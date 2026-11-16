import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { AsyncLocalStorage } from 'async_hooks';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use((req, _res, next) => {
  const quality = req.body?.quality === 'deep' ? 'deep' : 'fast';
  requestQuality.run({ quality }, () => next());
});

// ---------------------------------------------------------------------------
// Provider setup
// - Journal chat uses Gemini 3.8 Flash on the Google AI Studio FREE tier.
// - All other AI features continue to use local Ollama so stored counseling
//   notes, session summaries, resource notes, and session-prep data are not
//   sent to the hosted Gemini API by those endpoints.
// - Keep the Google Cloud project on the Free tier with NO billing account
//   linked. This code never selects a paid model, retries, or uses grounding.
// ---------------------------------------------------------------------------
const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'soma-gemma-test';
const OLLAMA_MODEL_DEEP = process.env.OLLAMA_MODEL_DEEP || 'gemma3:4b';
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 600000;
const OLLAMA_NUM_CTX = Number(process.env.OLLAMA_NUM_CTX) || 4096;
const OLLAMA_NUM_CTX_DEEP = Number(process.env.OLLAMA_NUM_CTX_DEEP) || 4096;

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 120000;

// Quality for the current request ('fast' | 'deep'), set from the request body.
const requestQuality = new AsyncLocalStorage<{ quality: 'fast' | 'deep' }>();

type LocalContent = { role?: string; parts?: { text?: string }[] };

class GeminiApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
    this.code = code;
  }
}

// Hosted Gemini client used ONLY by /api/chat/journal.
// The model is fixed to the free-tier model; no model override is accepted.
function getGeminiClient() {
  return {
    models: {
      async generateContent(args: {
        model?: string;
        contents: string | LocalContent[];
        config?: { systemInstruction?: string; responseMimeType?: string };
      }): Promise<{ text: string }> {
        if (!GEMINI_API_KEY) {
          throw new GeminiApiError(
            'GEMINI_API_KEY is missing from the server .env file.',
            503,
            'GEMINI_API_KEY_MISSING'
          );
        }

        const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

        if (typeof args.contents === 'string') {
          const text = args.contents.trim();
          if (text) contents.push({ role: 'user', parts: [{ text }] });
        } else {
          for (const item of args.contents || []) {
            const parts = (item.parts || [])
              .map((part) => typeof part.text === 'string' ? part.text : '')
              .filter((text) => text.length > 0)
              .map((text) => ({ text }));

            if (parts.length) {
              contents.push({
                role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
                parts,
              });
            }
          }
        }

        if (!contents.length) {
          throw new GeminiApiError('Gemini request contained no message content.', 400, 'EMPTY_CONTENT');
        }

        const isJson = args.config?.responseMimeType === 'application/json';
        const thinkingLevel = requestQuality.getStore()?.quality === 'deep' ? 'high' : 'low';
        const controller = new AbortController();
        const abortTimer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY,
              },
              signal: controller.signal,
              body: JSON.stringify({
                contents,
                ...(args.config?.systemInstruction
                  ? { systemInstruction: { parts: [{ text: args.config.systemInstruction }] } }
                  : {}),
                generationConfig: {
                  temperature: 0.65,
                  topP: 0.9,
                  // Gemini 3.8 Flash supports low/medium/high thinking levels.
                  // Deep mode uses high reasoning; Fast mode uses low latency.
                  thinkingConfig: { thinkingLevel },
                  // Allow room for internal reasoning plus the short final reply.
                  maxOutputTokens: isJson ? 2048 : 4096,
                  ...(isJson ? { responseMimeType: 'application/json' } : {}),
                },
              }),
            }
          );

          const responseText = await response.text();
          let data: any = {};
          try {
            data = responseText ? JSON.parse(responseText) : {};
          } catch {
            throw new GeminiApiError(
              `Gemini returned an unreadable response (HTTP ${response.status}).`,
              response.status || 502,
              'INVALID_API_RESPONSE'
            );
          }

          if (!response.ok) {
            const apiMessage = data?.error?.message || response.statusText || 'Unknown Gemini API error';
            const quotaError = response.status === 429 ||
              /RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(apiMessage);

            throw new GeminiApiError(
              quotaError
                ? `Gemini Free-tier quota or rate limit reached. No retry or paid fallback was attempted. ${apiMessage}`
                : `Gemini API error (HTTP ${response.status}): ${apiMessage}`,
              response.status,
              quotaError ? 'GEMINI_FREE_QUOTA_EXHAUSTED' : 'GEMINI_API_ERROR'
            );
          }

          const responseParts = data?.candidates?.[0]?.content?.parts || [];
          const text = responseParts
            .map((part: any) => typeof part.text === 'string' ? part.text : '')
            .join('')
            .trim();

          if (!text) {
            const reason = data?.candidates?.[0]?.finishReason ||
              data?.promptFeedback?.blockReason || 'empty response';
            throw new GeminiApiError(`Gemini returned no text: ${reason}`, 502, 'EMPTY_MODEL_RESPONSE');
          }

          console.info('Gemini completion:', {
            model: GEMINI_MODEL,
            promptTokenCount: data?.usageMetadata?.promptTokenCount,
            outputTokenCount: data?.usageMetadata?.candidatesTokenCount,
          });

          return { text };
        } catch (error: any) {
          if (error?.name === 'AbortError') {
            throw new GeminiApiError(
              `Gemini request exceeded ${GEMINI_TIMEOUT_MS}ms and was aborted.`,
              504,
              'GEMINI_TIMEOUT'
            );
          }
          throw error;
        } finally {
          clearTimeout(abortTimer);
        }
      },
    },
  };
}

// Local Ollama client retained for non-journal AI features. These requests
// continue to run on this computer and do not call the Gemini API.
function getLocalOllamaClient() {
  return {
    models: {
      async generateContent(args: {
        model?: string;
        contents: string | LocalContent[];
        config?: { systemInstruction?: string; responseMimeType?: string };
      }): Promise<{ text: string }> {
        const messages: { role: string; content: string }[] = [];
        if (args.config?.systemInstruction) {
          messages.push({ role: 'system', content: args.config.systemInstruction });
        }
        if (typeof args.contents === 'string') {
          messages.push({ role: 'user', content: args.contents });
        } else {
          for (const item of args.contents || []) {
            const text = (item.parts || []).map((part) => part.text || '').join('\n');
            if (!text) continue;
            messages.push({ role: item.role === 'model' || item.role === 'assistant' ? 'assistant' : 'user', content: text });
          }
        }

        const wantJson = args.config?.responseMimeType === 'application/json';
        const deep = requestQuality.getStore()?.quality === 'deep';
        const isPlanner = wantJson;
        const model = deep ? OLLAMA_MODEL_DEEP : OLLAMA_MODEL;
        const controller = new AbortController();
        const abortTimer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

        try {
          const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              model,
              messages,
              stream: false,
              ...(wantJson ? { format: 'json' } : {}),
              ...(isPlanner && model === 'qwen3:8b' ? { think: false } : {}),
              options: {
                num_ctx: deep ? OLLAMA_NUM_CTX_DEEP : OLLAMA_NUM_CTX,
                num_predict: isPlanner ? 700 : 500,
                temperature: 0.65,
                top_p: 0.9,
                repeat_penalty: 1.1,
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`Ollama ${response.status}: ${(await response.text()).slice(0, 200)}`);
          }

          const data: any = await response.json();
          console.info('Ollama completion:', {
            model: data?.model || model,
            done: data?.done,
            done_reason: data?.done_reason,
            prompt_eval_count: data?.prompt_eval_count,
            eval_count: data?.eval_count,
          });
          return { text: data?.message?.content || '' };
        } catch (error: any) {
          if (error?.name === 'AbortError') {
            throw new Error(`Ollama request exceeded ${OLLAMA_TIMEOUT_MS}ms and was aborted`);
          }
          throw error;
        } finally {
          clearTimeout(abortTimer);
        }
      },
    },
  };
}

// Preserve the previous generous timeout behavior for local AI routes.
async function callAIWithTimeout<T>(
  promise: Promise<T>,
  _timeoutMs: number = 0
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI request timed out')), OLLAMA_TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}


// ---------------------------------------------------------------------------
// Personal context for the local model: a standing profile plus the past sessions
// most relevant to what the user is writing about right now (keyword retrieval).
// The client sends its sessions with each request; nothing is stored on the server.
// ---------------------------------------------------------------------------
const STOPWORDS = new Set(('the and for that this with was were are but not you your have has had from they them their there what when where which while about into just like been being would could should then than also because really very much more some other can will did does done its our out all any how why who him her she his said say told talk talked felt feel feeling feelings session today week').split(' '));

function tokenize(text: string): string[] {
  return (String(text || '').toLowerCase().match(/[a-z][a-z']{2,}/g) || [])
    .filter((w) => !STOPWORDS.has(w))
    .map((w) => w.replace(/(ing|ed|es|s)$/, ''))
    .filter((w) => w.length > 2);
}

type CompactSession = {
  id: string;
  sessionNumber?: number;
  date?: string;
  focusTheme?: string;
  summary?: string;
  keyInsights?: string[];
  counselorAdvice?: string;
  themes?: string[];
  rawNotes?: string;
};

function pickRelevantSessions(query: string, sessions: CompactSession[], k: number, excludeIds: string[] = []): CompactSession[] {
  const pool = sessions.filter((s) => !excludeIds.includes(s.id));
  const q = tokenize(query);
  if (!q.length || !pool.length) return [];
  const docs = pool.map((s) => {
    const text = [s.focusTheme, s.summary, (s.keyInsights || []).join(' '), s.counselorAdvice, (s.themes || []).join(' '), String(s.rawNotes || '').slice(0, 1500)].join(' ');
    const tokens = tokenize(text);
    const tf = new Map<string, number>();
    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    return { s, tf, len: tokens.length || 1 };
  });
  const df = new Map<string, number>();
  docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const N = docs.length;
  const scored = docs.map((d, i) => {
    let score = 0;
    for (const t of new Set(q)) {
      const f = d.tf.get(t);
      if (f) score += (1 + Math.log(f)) * Math.log(1 + N / (df.get(t) || 1));
    }
    score = score / Math.sqrt(d.len);
    score *= 1 + 0.15 * (i / Math.max(1, N - 1)); // gentle recency boost (pool is oldest to newest)
    return { s: d.s, score };
  });
  return scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, k).map((x) => x.s);
}

function sessionBlock(s: CompactSession): string {
  const ins = (s.keyInsights || []).slice(0, 3).join('; ');
  return `- Session ${s.sessionNumber ?? ''} (${s.date || ''}), ${s.focusTheme || ''}: ${s.summary || ''}${ins ? ` Insights: ${ins}.` : ''}${s.counselorAdvice ? ` Counselor advice: ${s.counselorAdvice}` : ''}`.slice(0, 750);
}

function buildPersonalContext(opts: { personalProfile?: string; allSessions?: CompactSession[]; query: string; k?: number }): string {
  const sessions = (Array.isArray(opts.allSessions) ? opts.allSessions : []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const latest = sessions[sessions.length - 1];
  const parts: string[] = [];
  if (opts.personalProfile) parts.push(`ABOUT THIS PERSON (from their counseling work):\n${String(opts.personalProfile).slice(0, 2800)}`);
  if (latest) {
    const related = pickRelevantSessions(opts.query, sessions, opts.k ?? 2, [latest.id]);
    const blocks = [`Most recent: ${sessionBlock(latest)}`, ...related.map((s) => `Related earlier: ${sessionBlock(s)}`)];
    parts.push(`SESSION NOTES MOST RELEVANT TO WHAT THEY ARE WRITING ABOUT (use these specifics; never invent session content):\n${blocks.join('\n')}`);
  }
  return parts.join('\n\n');
}

// Status check: Gemini is the hosted provider for journal chat; Ollama remains
// available for local-only synthesis, resource, and session-prep features.
app.get('/api/ai/status', async (_req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!r.ok) throw new Error(`Ollama status ${r.status}`);
    const data: any = await r.json();
    const names: string[] = (data?.models || []).map((m: any) => m.name);
    const installed = names.some((n) => n === OLLAMA_MODEL || n.split(':')[0] === OLLAMA_MODEL);
    const has = (m: string) => names.some((n) => n === m || n.split(':')[0] === m);
    res.json({
      running: Boolean(GEMINI_API_KEY),
      provider: 'gemini-free-tier-for-journal',
      geminiConfigured: Boolean(GEMINI_API_KEY),
      geminiModel: GEMINI_MODEL,
      localProvider: 'ollama',
      ollamaRunning: true,
      model: OLLAMA_MODEL,
      modelInstalled: installed,
      deepModel: OLLAMA_MODEL_DEEP,
      deepModelInstalled: has(OLLAMA_MODEL_DEEP),
      installedModels: names,
    });
  } catch {
    res.json({
      running: Boolean(GEMINI_API_KEY),
      provider: 'gemini-free-tier-for-journal',
      geminiConfigured: Boolean(GEMINI_API_KEY),
      geminiModel: GEMINI_MODEL,
      localProvider: 'ollama',
      ollamaRunning: false,
      model: OLLAMA_MODEL,
      modelInstalled: false,
      deepModel: OLLAMA_MODEL_DEEP,
      deepModelInstalled: false,
      installedModels: [],
    });
  }
});

// Helper for safe JSON parsing from the local model
function cleanAndParseJSON(text: string | undefined, fallback: any = {}) {
  if (!text) return fallback;
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/, '');
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed to parse JSON response from local AI:', err);
    return fallback;
  }
}

// -------------------------------------------------------------
// INTELLIGENT CLINICAL FALLBACK GENERATORS (WHEN THE LOCAL AI IS OFFLINE)
// -------------------------------------------------------------

function generateFallbackJournalReply(
  _messages: any[],
  _sessionContext: any,
  _mode: string,
  _activeModalities: string[] = []
): string {
  // The hosted journal request is never retried through a paid model or provider.
  return "I'm having trouble reaching Gemini right now. Your journal entry is still here. No paid fallback was attempted; please try again later.";
}

function generateFallbackSessionSynthesis(payload: any) {
  const { sessionTitle, rawNotes, themes, counselorAdvice } = payload;
  const themeList = themes && themes.length > 0 ? themes : ['Emotional Regulation', 'Boundaries'];

  return {
    summary: rawNotes
      ? `Explored themes of ${themeList.join(' and ')}, working through emotional activation and personal boundaries.`
      : 'Session focused on developing emotional awareness and between-session grounding.',
    themes: themeList,
    microLessons: [
      {
        id: `ml-syn-${Date.now()}-1`,
        title: 'The 90-Second Neurochemical Wave',
        concept: 'Neurologically, a surge of adrenaline or cortisol takes roughly 90 seconds to flush through the bloodstream unless thoughts re-trigger it.',
        practicalApplication: 'When activated, set a 90-second mental timer and focus entirely on the physical rise and fall of your belly breath.',
        reflectionPrompt: 'Where did you notice an automatic reaction that subsided once you stopped adding mental fuel?',
        quiz: {
          question: 'What happens if you allow an emotional wave to run its 90-second physical course without rumination?',
          options: [
            'It intensifies permanently and takes over your whole day.',
            'The physiological surge naturally peaks and subsides in your nervous system.',
            'It proves your emotions were completely invalid.',
            'It forces you into an immediate fight-or-flight shutdown.'
          ],
          correctIndex: 1,
          explanation: 'Dr. Jill Bolte Taylor showed that the chemical lifespan of an emotional surge is only 90 seconds unless sustained by cognitive rumination.'
        }
      },
      {
        id: `ml-syn-${Date.now()}-2`,
        title: 'Boundaries as Self-Care, Not Rejection',
        concept: 'Setting a boundary is not about pushing someone away; it is defining where you begin and end so you can love without resentment.',
        practicalApplication: 'Use a clear buffer: "I need to check my calendar and will let you know tomorrow morning."',
        reflectionPrompt: 'What boundary could you set this week that protects your peace without apologizing for your needs?',
        quiz: {
          question: 'What is the primary function of a healthy boundary?',
          options: [
            'To punish someone who upset you.',
            'To prevent resentment and preserve your capacity for authentic connection.',
            'To make sure nobody ever asks anything of you.',
            'To prove your independence from everyone.'
          ],
          correctIndex: 1,
          explanation: 'Healthy boundaries protect your energy and prevent the buildup of quiet bitterness or burnout.'
        }
      }
    ],
    extractedHomework: [
      {
        id: `hw-syn-${Date.now()}-1`,
        title: 'The 24-Hour Boundary Buffer',
        category: 'Behavioral Experiment',
        description: 'Before saying yes to non-urgent requests, take a 24-hour buffer to notice somatic readiness before responding.',
        suggestedFrequency: 'Whenever a request arises',
        theme: themeList[0] || 'Boundaries'
      },
      {
        id: `hw-syn-${Date.now()}-2`,
        title: 'Physiological Sigh Body Scan',
        category: 'Somatic Practice',
        description: 'Take two quick inhales through the nose, followed by a long, slow exhale through the mouth 3 times a day.',
        suggestedFrequency: 'Daily (Morning & Evening)',
        theme: 'Somatic Regulation'
      }
    ],
    keyQuotes: [
      counselorAdvice || 'You are allowed to take up space and honor your own rhythm.',
      'Awareness is the doorway to choosing response over reflex.'
    ]
  };
}

function generateFallbackResourceSynthesis(payload: any) {
  const { title, notes, relatedTheme } = payload;
  return {
    distilledTakeaways: [
      `Core principle: Cultivate compassionate self-observation when exploring ${relatedTheme || 'growth'}.`,
      'Recognize early emotional activation signs before they become overwhelming.',
      'Small, consistent behavioral micro-steps create sustainable neurological rewiring.'
    ],
    coreQuoteOrInsight: notes && notes.length > 20
      ? `"${notes.slice(0, 120)}..."`
      : 'Healing is not about eliminating all discomfort, but expanding your capacity to hold it with kindness.',
    microAction: 'Take 2 minutes to pause and write down one belief from this resource that resonates with your current journey.',
    journalPrompt: `How does the core concept of "${title}" challenge your old coping habits in daily life?`,
    recommendedFrequency: 'Review once after engaging',
    estimatedTimeMinutes: 5
  };
}

function generateFallbackMicroLesson(theme: string = 'Emotional Regulation') {
  return {
    title: `${theme}: The Power of the Compassionate Pause`,
    concept: 'When triggered, the limbic system fires in 20 milliseconds. Taking a 5-second conscious pause allows your prefrontal cortex to come back online so you can choose your response.',
    practicalApplication: 'Before replying to a tense text or email, place both feet firmly on the floor and take 3 deliberate slow exhales.',
    reflectionPrompt: 'Where this week could a 5-second pause have prevented an automatic survival reaction?',
    quiz: {
      question: 'Why is taking a 5-second pause physically effective when activated?',
      options: [
        'It completely erases all difficult feelings instantly.',
        'It allows oxygen and blood flow to re-engage your prefrontal cortex over instinctual reflexes.',
        'It guarantees the other person will concede the argument.',
        'It forces you to suppress your emotions permanently.'
      ],
      correctIndex: 1,
      explanation: 'Taking a physiological pause interrupts the amygdala hijack and gives executive function time to re-engage.'
    }
  };
}

function generateFallbackSessionPrepReport(payload: any) {
  const { completedHomework = [], themes = [] } = payload;
  return {
    headline: 'Between-Session Growth & Reflection Debrief',
    celebrationsAndWins: [
      completedHomework.length > 0 
        ? `Successfully practiced assigned behavioral experiment: "${completedHomework[0].title}".`
        : 'Dedicated intentional time to journal and reflect between sessions.',
      'Noticed emotional activation and practiced somatic grounding.',
      'Brought curiosity to automatic survival patterns.'
    ],
    homeworkDebrief: completedHomework.length > 0
      ? `Completed ${completedHomework.length} homework experiment(s). Key takeaway: Noticed reduction in anxiety when pausing before reacting.`
      : 'Experiments remain queued for mindful real-world testing.',
    stickingPointsAndTriggers: [
      'Hesitation and lingering guilt when holding interpersonal boundaries.',
      'Somatic tension (tight jaw/chest) during unexpected demands.'
    ],
    proposedAgendaQuestions: [
      'How can I anchor in Self-energy when an external boundary is questioned?',
      'Can we explore the protective part that feels guilty for resting?',
      'What somatic practice works best when adrenaline floods the chest?'
    ],
    somaticAndMoodTrend: 'Gradual expansion in emotional tolerance, with periods of acute activation during interpersonal boundary tests.'
  };
}

function generateFallbackSessionGuide(payload: any) {
  const {
    activeModalities = ['IFS', 'CBT', 'Somatic Experiencing'],
    journalEntries = [],
    homework = [],
    userNotes = '',
    targetSessionDate = 'Upcoming Session',
  } = payload || {};

  const recentJournal = journalEntries && journalEntries.length > 0 ? journalEntries[0] : null;
  const pendingHw = (homework || []).filter((h: any) => h.status !== 'completed');
  const completedHw = (homework || []).filter((h: any) => h.status === 'completed');

  const modalities: string[] = activeModalities?.length ? activeModalities : ['IFS', 'CBT', 'Somatic Experiencing'];

  // 1. Primary intention
  let primaryIntention = "To explore real-world emotional triggers from this week and deepen somatic safety in everyday interactions.";
  if (userNotes && userNotes.trim().length > 5) {
    primaryIntention = `To address: "${userNotes.trim().slice(0, 100)}" and explore healthy coping mechanisms.`;
  } else if (recentJournal && recentJournal.topic) {
    primaryIntention = `To process what arose around "${recentJournal.topic}" and cultivate compassionate self-awareness.`;
  }

  // 2. Prioritized agenda
  const prioritizedAgenda = [];

  // Item 1: High priority
  if (recentJournal) {
    prioritizedAgenda.push({
      id: 'agenda-1',
      topic: `${recentJournal.topic || 'Weekly Trigger'} & Somatic Response`,
      priority: 'High',
      context: recentJournal.content ? recentJournal.content.slice(0, 150) + '...' : 'Felt heightened activation during the week; need to unpack triggers.',
      triggerEvent: recentJournal.topic || 'Acute activating event during the week',
      relatedModality: modalities[0] || 'IFS',
      isDiscussed: false,
    });
  } else {
    prioritizedAgenda.push({
      id: 'agenda-1',
      topic: 'Boundary Setting & Interpersonal Activation',
      priority: 'High',
      context: 'Lingering hesitation when prioritizing personal needs over external demands.',
      triggerEvent: 'Work & relational boundary friction',
      relatedModality: modalities.includes('IFS') ? 'IFS' : (modalities[0] || 'CBT'),
      isDiscussed: false,
    });
  }

  // Item 2: Medium priority
  if (pendingHw.length > 0) {
    prioritizedAgenda.push({
      id: 'agenda-2',
      topic: `Debrief: "${pendingHw[0].title}" Experiment`,
      priority: 'Medium',
      context: pendingHw[0].description || 'Practicing behavioral pause in real-time activation.',
      triggerEvent: 'Real-world practice attempt',
      relatedModality: modalities.includes('CBT') ? 'CBT' : (modalities[1] || 'DBT'),
      isDiscussed: false,
    });
  } else {
    prioritizedAgenda.push({
      id: 'agenda-2',
      topic: 'Nervous System Window of Tolerance',
      priority: 'Medium',
      context: 'Tracking physical constriction and returning to regulation after stress spikes.',
      triggerEvent: 'Daily task transitions and fatigue',
      relatedModality: modalities.includes('Somatic Experiencing') ? 'Somatic Experiencing' : (modalities[1] || 'ACT'),
      isDiscussed: false,
    });
  }

  // Item 3: Exploratory priority
  prioritizedAgenda.push({
    id: 'agenda-3',
    topic: 'Core Belief Examination & Self-Energy Anchor',
    priority: 'Exploratory',
    context: 'Looking ahead to upcoming relational transitions with grounded presence.',
    triggerEvent: 'Internal self-critic monologue',
    relatedModality: modalities[2] || modalities[0] || 'Mindfulness-Based',
    isDiscussed: false,
  });

  // 3. Week Triggers and Emotions
  const weekTriggersAndEmotions = [];
  if (journalEntries && journalEntries.length > 0) {
    journalEntries.slice(0, 3).forEach((j: any) => {
      weekTriggersAndEmotions.push({
        trigger: j.topic || 'Moment of activation during routine tasks',
        emotion: j.moodTag || 'Anxious anticipation',
        somaticSensation: j.content?.toLowerCase().includes('tight') ? 'Tightness in chest or throat' : 'Shallow breathing, restless energy',
      });
    });
  } else {
    weekTriggersAndEmotions.push(
      {
        trigger: 'Urgent email / message received outside of working hours',
        emotion: 'Guilt & urgency to comply',
        somaticSensation: 'Stomach flutter and tightened shoulders',
      },
      {
        trigger: 'Setting an explicit boundary with family member',
        emotion: 'Vulnerability and fear of conflict',
        somaticSensation: 'Throat constriction, accelerated heart rate',
      }
    );
  }

  // 4. Modality Check-ins
  const modalityCheckins = modalities.map((mod: string) => {
    switch (mod) {
      case 'IFS':
        return {
          modality: 'IFS',
          notes: 'Notice the proactive manager part that worries about disappointing others; extend Self-compassion.',
        };
      case 'EMDR':
        return {
          modality: 'EMDR',
          notes: 'Review SUDS (Subjective Units of Disturbance) scale on key activating memories and practice bilateral butterfly taps.',
        };
      case 'CBT':
        return {
          modality: 'CBT',
          notes: 'Examine cognitive distortions: Catch mind-reading and catastrophizing thoughts before they spiral.',
        };
      case 'DBT':
        return {
          modality: 'DBT',
          notes: 'Engage Wise Mind: Practice TIPP (temperature/paced breathing) when emotional distress reaches 6/10.',
        };
      case 'Somatic Experiencing':
        return {
          modality: 'Somatic Experiencing',
          notes: 'Track felt sensations in the body without rushing to analyze them; practice physiological sighs.',
        };
      case 'ACT':
        return {
          modality: 'ACT',
          notes: 'Cognitive defusion: Say "I notice I am having the thought that..." and anchor to personal values.',
        };
      case 'Attachment-Based':
        return {
          modality: 'Attachment-Based',
          notes: 'Observe relational triggers: Notice anxious hyperactivating or avoidant withdrawal tendencies.',
        };
      default:
        return {
          modality: mod,
          notes: `Check in on how ${mod} strategies were applied between sessions.`,
        };
    }
  });

  // 5. Wins
  const winsToCelebrate = [];
  if (completedHw.length > 0) {
    winsToCelebrate.push(`Completed behavioral homework experiment: "${completedHw[0].title}".`);
  }
  winsToCelebrate.push('Practiced self-reflection and recorded moments of activation between sessions.');
  winsToCelebrate.push('Paused before reacting to an automatic emotional surge.');

  // 6. Homework debrief notes
  const homeworkDebriefNotes = completedHw.length > 0
    ? `Completed ${completedHw.length} assigned experiment(s). Key reflection: "${completedHw[0].reflectionNotes || 'Noticeable decrease in distress after applying the pause'}".`
    : 'Between-session behavioral experiments are queued and ready for real-world practice.';

  // 7. Questions for therapist
  const questionsForTherapist = [
    'How can I maintain Self-energy when an external boundary is pushed back against?',
    'What physical grounding cue would you recommend when my nervous system activates into fight-or-flight?',
    'Can we do a brief experiential exercise today to unburden the protector part feeling overwhelmed?',
  ];

  return {
    id: `guide-${Date.now()}`,
    targetSessionDate,
    sessionTitle: 'Next Session Discussion & Integration Guide',
    primaryIntention,
    prioritizedAgenda,
    weekTriggersAndEmotions,
    modalityCheckins,
    winsToCelebrate,
    homeworkDebriefNotes,
    questionsForTherapist,
    generatedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------------

// 1. CHAT / JOURNALING AGENT ENDPOINT

app.post('/api/chat/journal', async (req, res) => {
  try {
    const {
      messages,
      sessionContext,
      mode,
      activeModalities,
    } = req.body;

    let reply = '';
    const gemini = getGeminiClient();

    if (gemini) {
      try {
        // Stored profile, archived sessions, and saved homework stay local.
        // Only the recent journal conversation (formattedContents below) is sent to Gemini.
        const personalContext = '';

        const systemInstruction = `You are SOMA, a thoughtful, warm, grounded conversational companion for someone engaged in counseling. You are not their therapist.

YOUR PURPOSE
Help the user understand their experiences, thoughts, emotions, needs, and patterns. Be a genuine conversational partner, not a therapy instructor or self-help article generator.

HOW TO CONVERSE
- Respond to what the user actually says and asks.
- Explore before intervening. Do not assume every difficulty needs an exercise.
- Answer direct questions directly.
- Offer meaningful observations rather than merely paraphrasing.
- Use natural, everyday language. Avoid headings, numbered lists, and checklists in ordinary conversation.
- Avoid stock openings and repetitive validation.
- Use therapeutic ideas only when genuinely relevant.
- Ask at most one focused question. Do not end every response with a question.
- Usually respond in 70-130 words.
- Do not reinforce perfectionism or over-responsibility with more rules.

IMPORTANT DISTINCTIONS
- Being considerate does not mean being responsible for everyone's feelings.
- Expressing a need does not automatically make someone selfish.
- Someone else's disappointment does not automatically mean the user did something wrong.
- Assertiveness does not require perfect wording or a mutually beneficial outcome.

REASONING STANDARD
When the user asks to understand a pattern or explore possible explanations:

- Start with the specific behavior the user described. Don't immediately assign it a psychological label.
- Look for different mechanisms that could independently produce that behavior.
- Consider ordinary explanations involving attention, decision-making, habits, expectations, values, incentives, and practical circumstances.
- For each explanation, describe HOW the mechanism could produce the behavior. A label such as perfectionism, people-pleasing, or empathy is not an explanation.
- Make explanations genuinely distinct. Different descriptions of the same underlying process do not count.
- Examine what each explanation accounts for and what it does not establish.
- Distinguish observations from hypotheses. Do not invent motives, memories, or causes.
- Do not default to childhood, trauma, attachment, approval, fear of conflict, rejection, or emotional responsibility.
- Do not force a predetermined number of explanations.
- Do not finish by asking the user which explanation resonates. Contribute your reasoning and allow the conversation to continue naturally.

ILLUSTRATIVE EXAMPLE

User: "I often agree to plans and then wish I hadn't. Why might I do that?"

Good response:
"Several different processes could produce that pattern. You might be making decisions with an inaccurate forecast of your future energy: how you'll feel later is harder to judge than how you feel now. Another possibility is that you recognize the value of having a free evening but give the immediate appeal of the invitation more weight when deciding. Or accepting might simply be your default response because it ends the decision quickly, before you've really compared the alternatives.

These are different possibilities: one involves forecasting, another involves how you weigh competing preferences, and another involves the decision process itself. Regretting the decision afterward doesn't tell us which one is operating."

WHY THIS EXAMPLE IS USEFUL
- It explains mechanisms rather than assigning labels.
- It distinguishes three different processes.
- It doesn't invent a childhood cause or hidden emotional motive.
- It acknowledges uncertainty without becoming vague.
- It contributes an observation without requiring the user to answer a question.

Keep ordinary responses conversational and concise. Do not turn every response into a list of hypotheses. Use this reasoning approach when the user's request calls for it.
PERSONAL CONTEXT
This hosted request does not receive the user's stored profile, archived counseling notes, session history, or saved homework. Base your response only on the recent conversation included in the request. Never invent memories, events, or counselor statements.

PACING AND CARE
Respect uncertainty. Do not push for childhood memories, emotional breakthroughs, body exercises, or therapeutic frameworks. Do not diagnose or provide medical advice. If the user expresses immediate danger or intent to self-harm, respond compassionately, encourage emergency help when appropriate, and provide the US 988 Suicide & Crisis Lifeline.

CURRENT CONTEXT
Do not use archived counseling notes, stored profile data, or saved session history in this request. Only use the recent journal conversation supplied below.
Journaling mode: ${mode || 'Open reflection'}

${personalContext}

      CONTEXT RULES
- Do not imply access to background information that was not included in this request.
- Never invent memories, motives, experiences, or physical sensations.
- Prior corrections present in the conversation take precedence over earlier interpretations.
      `;

        const formattedContents = (messages || [])
          .slice(-8)
          .map((m: { role: string; content: string }) => ({
            role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

        if (formattedContents.length === 0) {
          formattedContents.push({
            role: 'user',
            parts: [{
              text: "Hello, I'm ready to reflect on how I've been doing since my last session.",
            }],
          });
        }

        const response = await callAIWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
            },
          }),
          OLLAMA_TIMEOUT_MS
        );

        reply = response.text || '';
      } catch (aiError: any) {
        console.warn('Gemini journal request failed:', aiError?.message || aiError);
        const quotaReached = aiError instanceof GeminiApiError && aiError.code === 'GEMINI_FREE_QUOTA_EXHAUSTED';
        const missingKey = aiError instanceof GeminiApiError && aiError.code === 'GEMINI_API_KEY_MISSING';
        const replyMessage = quotaReached
          ? 'Gemini’s free-tier quota or rate limit has been reached. No paid request, retry, or provider switch was made. Please try again after the quota resets.'
          : missingKey
            ? 'Gemini is not configured. Check GEMINI_API_KEY in the server .env file. No paid request was made.'
            : 'Gemini is temporarily unavailable. No paid fallback or provider switch was attempted. Please try again later.';
        // JournalCompanion currently displays data.reply only when response.ok is true.
        // Keep HTTP 200 here so the user sees the explicit quota/error explanation.
        return res.status(200).json({
          error: quotaReached ? 'GEMINI_FREE_QUOTA_EXHAUSTED' : missingKey ? 'GEMINI_API_KEY_MISSING' : 'GEMINI_UNAVAILABLE',
          reply: replyMessage,
        });
      }
    }

    if (!reply) {
      reply = generateFallbackJournalReply(
        messages,
        sessionContext,
        mode,
        activeModalities
      );
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in journal chat endpoint:', error);
    res.json({
      reply: generateFallbackJournalReply(
        req.body?.messages,
        req.body?.sessionContext,
        req.body?.mode,
        req.body?.activeModalities
      ),
    });
  }
});


// 2. SYNTHESIZE SESSION NOTES & RESOURCES INTO MICRO-LEARNING & HOMEWORK
app.post('/api/synthesize/session', async (req, res) => {
  try {
    const { sessionTitle, sessionDate, rawNotes, themes, resourcesText, counselorAdvice } = req.body;
    let data: any = null;

    const gemini = getLocalOllamaClient();
    if (gemini) {
      try {
        const prompt = `You are a clinical synthesis assistant helping a counseling client turn their therapy session notes into practical, bite-sized between-session micro-learning and actionable homework.

Session Title: ${sessionTitle || 'Therapy Session'}
Date: ${sessionDate || 'Recent'}
Counselor Insights / Discussion:
${rawNotes || 'Discussed boundary setting, noticing feelings of guilt, and somatic tightness in the chest.'}

Themes identified: ${themes?.join(', ') || 'Boundaries, Self-Compassion'}
Resources Mentioned / Provided: ${resourcesText || 'None specified'}
Counselor Advice: ${counselorAdvice || 'None'}

Please synthesize this into a structured JSON object with the following structure:
{
  "summary": "2-3 sentence empathetic takeaway of what this session was about",
  "themes": ["Extracted core theme 1", "Extracted core theme 2"],
  "microLessons": [
    {
      "id": "ml-1",
      "title": "Short catchy title (e.g., The Guilt vs. Resentment Tradeoff)",
      "concept": "2-3 sentences explaining the psychological principle behind what they discussed",
      "practicalApplication": "1 tangible, specific thing to practice in everyday life this week",
      "reflectionPrompt": "A deep, empowering question to journal or think about",
      "quiz": {
        "question": "A realistic scenario-based question to test or reinforce the concept",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 1,
        "explanation": "Why this option best represents healthy emotional regulation or boundary setting"
      }
    }
  ],
  "extractedHomework": [
    {
      "id": "hw-1",
      "title": "Specific homework task (e.g. Pause 10 seconds before agreeing to requests)",
      "category": "Behavioral Experiment" | "Somatic Practice" | "Cognitive Reframe" | "Media / Reading",
      "description": "Clear step-by-step instructions on how to do it",
      "suggestedFrequency": "Daily" | "2-3 times this week" | "As needed when triggered",
      "theme": "Related theme"
    }
  ],
  "keyQuotes": ["Memorable takeaway quote or compassionate affirmation from this session"]
}

Return ONLY valid JSON.`;

        const response = await callAIWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          5000
        );

        data = cleanAndParseJSON(response.text, null);
      } catch (geminiError) {
        console.warn('Local Ollama session synthesis error, using fallback:', geminiError);
      }
    }

    if (!data || !data.microLessons || data.microLessons.length === 0) {
      data = generateFallbackSessionSynthesis(req.body);
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error synthesizing session:', error);
    res.json(generateFallbackSessionSynthesis(req.body));
  }
});

// 3. SYNTHESIZE EXTERNAL RESOURCES (YOUTUBE, BOOKS, SOCIAL MEDIA, ARTICLES)
app.post('/api/synthesize/resource', async (req, res) => {
  try {
    const { title, type, url, authorOrCreator, notes, relatedTheme } = req.body;
    let data: any = null;

    const gemini = getLocalOllamaClient();
    if (gemini) {
      try {
        const prompt = `You are an expert therapy learning synthesizer. A counseling client was recommended or assigned a resource by their therapist or found a helpful resource to support their growth between sessions.

Resource Title: ${title}
Type: ${type} (e.g., YouTube Video, Book / Chapter, Social Media Post/Carousel, Article / Clinical Handout, Podcast)
URL / Source: ${url || 'N/A'}
Author / Creator: ${authorOrCreator || 'N/A'}
Client's Notes / Excerpt / Description: ${notes || 'No notes provided'}
Related Counseling Theme: ${relatedTheme || 'Emotional growth and mental health'}

Please distill this resource into an actionable micro-learning card:
Return a JSON object:
{
  "distilledTakeaways": [
    "Key takeaway 1 (direct, memorable, practical)",
    "Key takeaway 2",
    "Key takeaway 3"
  ],
  "coreQuoteOrInsight": "The single most impactful quote or mental reframe from this material",
  "microAction": "A 2-minute real-world experiment or exercise the client can do right now or this week",
  "journalPrompt": "A personalized journal prompt based on this resource to deepen integration",
  "recommendedFrequency": "e.g., Once after watching, or Daily for 5 days",
  "estimatedTimeMinutes": 5
}

Return ONLY valid JSON.`;

        const response = await callAIWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          5000
        );

        data = cleanAndParseJSON(response.text, null);
      } catch (geminiError) {
        console.warn('Local Ollama resource synthesis error, using fallback:', geminiError);
      }
    }

    if (!data || !data.distilledTakeaways) {
      data = generateFallbackResourceSynthesis(req.body);
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error synthesizing resource:', error);
    res.json(generateFallbackResourceSynthesis(req.body));
  }
});

// 3b. WEEKLY FOCUS BASED ON RECENT SESSIONS
app.post('/api/generate/weekly-focus', async (req, res) => {
  try {
    const { sessions, pillars, counselorName, sessionId, personalProfile, allSessions } = req.body || {};
    const gemini = getLocalOllamaClient();
    if (!gemini) return res.status(503).json({ error: 'AI unavailable' });
    const recent = (Array.isArray(sessions) ? sessions : []).slice(0, 2).map((s: any) =>
      `Session ${s.date} (${s.focusTheme}):\n${String(s.rawNotes || '').slice(0, 2500)}`
    ).join('\n\n---\n\n');
    const prompt = `You are a supportive between-session companion. A client sees counselor ${counselorName || 'their counselor'}. Their counseling pillars: ${(pillars || []).join('; ')}.
${buildPersonalContext({ personalProfile, allSessions, query: String((sessions && sessions[0] && (sessions[0].focusTheme + ' ' + sessions[0].summary)) || ''), k: 2 })}

Based mainly on their MOST RECENT session (first below) and the pattern across the earlier ones, write what they should work on and explore this week. Speak to the client as "you". Do not diagnose or give medical advice, and stay consistent with what the counselor actually said.

${recent}

Return ONLY JSON:
{
  "summary": "3-4 sentence summary of where they are and the focus this week",
  "focusAreas": [{"title": "...", "why": "..."}],
  "practices": ["5 concrete small practices"],
  "journalPrompts": ["6 journal prompts"],
  "affirmations": ["5 first-person affirmations in the client's own voice"],
  "resources": [{"title": "...", "author": "...", "why": "...", "fromCounselor": false}]
}
Use exactly 3 focusAreas and 3-4 real, well-known resources only (never invent titles). Set fromCounselor true only for resources the counselor named in the notes.`;
    const response = await callAIWithTimeout(
      gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      }),
      20000
    );
    const data = cleanAndParseJSON(response.text, null);
    if (!data || !data.summary || !Array.isArray(data.journalPrompts)) {
      return res.status(502).json({ error: 'Bad AI response' });
    }
    res.json({ ...data, sessionId, source: 'ai' });
  } catch (error: any) {
    console.warn('Local Ollama weekly focus error:', error?.message || error);
    res.status(502).json({ error: 'AI unavailable' });
  }
});

// 4. GENERATE ON-DEMAND MICRO-LESSON / QUIZ FOR A THEME
app.post('/api/generate/micro-lesson', async (req, res) => {
  try {
    const { theme, clientNeeds } = req.body;
    let data: any = null;

    const gemini = getLocalOllamaClient();
    if (gemini) {
      try {
        const prompt = `Create a high-impact, 2-minute therapy micro-learning card and interactive quiz challenge for a counseling client working on: "${theme || 'Emotional Regulation and Resilience'}".
Client notes / context: ${clientNeeds || 'General practice between sessions'}

Return a JSON object:
{
  "title": "Engaging micro-lesson title",
  "concept": "Concise psychological principle explained in simple, warm terms (CBT/ACT/Somatic)",
  "practicalApplication": "Concrete 1-minute exercise to test right now",
  "reflectionPrompt": "Reflective question",
  "quiz": {
    "scenario": "A short relatable real-life scenario",
    "question": "What is the most emotionally regulated / healthy response?",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "correctIndex": 0,
    "explanation": "Why this response honors boundaries, nervous system health, or cognitive flexibility"
  }
}

Return ONLY valid JSON.`;

        const response = await callAIWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          5000
        );

        data = cleanAndParseJSON(response.text, null);
      } catch (geminiError) {
        console.warn('Local Ollama micro-lesson error, using fallback:', geminiError);
      }
    }

    if (!data || !data.title) {
      data = generateFallbackMicroLesson(theme);
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error generating micro lesson:', error);
    res.json(generateFallbackMicroLesson(req.body?.theme));
  }
});

// 5. GENERATE SESSION PREP DEBRIEF (FOR NEXT COUNSELING SESSION)
app.post('/api/report/session-prep', async (req, res) => {
  try {
    const { recentSessions, completedHomework, pendingHomework, journalHighlights, themes } = req.body;
    let data: any = null;

    const gemini = getLocalOllamaClient();
    if (gemini) {
      try {
        const prompt = `You are a clinical assistant helping a counseling client prepare an empowering, structured 1-page summary to bring to their NEXT therapy session.

Context between sessions:
Themes: ${JSON.stringify(themes)}
Completed Homework & Experiments: ${JSON.stringify(completedHomework)}
Pending Homework: ${JSON.stringify(pendingHomework)}
Recent Journaling Reflections: ${JSON.stringify(journalHighlights)}
Recent Sessions: ${JSON.stringify(recentSessions)}

Create an organized session debrief:
Return a JSON object:
{
  "headline": "Empowering title for next session agenda",
  "celebrationsAndWins": [
    "Win 1 (moments they noticed growth or applied tools)",
    "Win 2"
  ],
  "homeworkDebrief": "Summary of what worked and what was hard during homework practice",
  "stickingPointsAndTriggers": [
    "Trigger or obstacle 1 that came up between sessions",
    "Trigger or obstacle 2"
  ],
  "proposedAgendaQuestions": [
    "Targeted question 1 to ask the therapist in the upcoming session",
    "Targeted question 2",
    "Targeted question 3"
  ],
  "somaticAndMoodTrend": "Observation on nervous system regulation and emotional trends"
}

Return ONLY valid JSON.`;

        const response = await callAIWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          5000
        );

        data = cleanAndParseJSON(response.text, null);
      } catch (geminiError) {
        console.warn('Local Ollama session prep report error, using fallback:', geminiError);
      }
    }

    if (!data || !data.headline) {
      data = generateFallbackSessionPrepReport(req.body);
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error generating session prep:', error);
    res.json(generateFallbackSessionPrepReport(req.body));
  }
});

// 6. GENERATE INTERACTIVE NEXT SESSION DISCUSSION GUIDE (TOPICS, WEEK'S TRIGGERS, MODALITY CONTEXT)
app.post('/api/generate/session-guide', async (req, res) => {
  try {
    const { 
      activeModalities, 
      themes, 
      recentSessions, 
      journalEntries, 
      homework, 
      userNotes, 
      targetSessionDate 
    } = req.body;

    let guideData: any = null;

    const gemini = getLocalOllamaClient();
    if (gemini) {
      try {
        const modalitiesList = (activeModalities && activeModalities.length > 0)
          ? activeModalities.join(', ')
          : 'CBT, Somatic Experiencing, Mindfulness';

        const prompt = `You are an expert clinical session preparation assistant. Help a therapy client build an organized, prioritized "Next Session Discussion Guide" so they know exactly what to talk about with their counselor in their upcoming session.

Client Therapy Context:
- Active Modalities Used in Session: ${modalitiesList}
- Active Counseling Themes: ${JSON.stringify(themes?.map((t: any) => ({ name: t.name, modality: t.modality, description: t.description })))}
- Recent Session History: ${JSON.stringify(recentSessions?.slice(0, 2).map((s: any) => ({ sessionNumber: s.sessionNumber, focusTheme: s.focusTheme, summary: s.summary, advice: s.counselorAdvice })))}
- What Came Up During the Week (Journal Entries & Check-ins): ${JSON.stringify(journalEntries?.slice(0, 6).map((j: any) => ({ topic: j.topic, mood: j.moodTag, content: j.content, takeaway: j.keyTakeaway })))}
- Homework & Behavioral Experiments Status: ${JSON.stringify(homework?.map((h: any) => ({ title: h.title, status: h.status, reflection: h.reflectionNotes, difficulty: h.difficultyRating })))}
- Client's Custom Notes / Thoughts: "${userNotes || 'None entered'}"
- Upcoming Session Date: "${targetSessionDate || 'Upcoming'}"

Please synthesize this into a structured JSON Next Session Guide:
{
  "primaryIntention": "A powerful 1-sentence intention for what the client hopes to get out of this session (e.g., 'To work through the guilt triggered by family requests and unburden the protector part that feels responsible for everyone.')",
  "prioritizedAgenda": [
    {
      "id": "agenda-1",
      "topic": "Concise topic title",
      "priority": "High" | "Medium" | "Exploratory",
      "context": "Why this is important based on what happened this week",
      "triggerEvent": "The specific real-world trigger or moment that occurred",
      "relatedModality": "IFS" | "EMDR" | "CBT" | "DBT" | "Somatic Experiencing" | "ACT" | "Attachment-Based"
    },
    {
      "id": "agenda-2",
      "topic": "Second topic title",
      "priority": "Medium",
      "context": "Context from homework or reflection",
      "triggerEvent": "What was noticed",
      "relatedModality": "Modality name"
    },
    {
      "id": "agenda-3",
      "topic": "Third topic title",
      "priority": "Exploratory",
      "context": "Context",
      "relatedModality": "Modality name"
    }
  ],
  "weekTriggersAndEmotions": [
    {
      "trigger": "Specific moment or interaction from the week",
      "emotion": "Emotion felt (e.g. Shame, Panicked, Resentful, Defeated)",
      "somaticSensation": "Physical sensation (e.g. Throat tightening, solar plexus flutter, jaw clenching)"
    }
  ],
  "modalityCheckins": [
    {
      "modality": "Modality name",
      "notes": "Specific clinical focal point tailored to this modality (e.g., for IFS: 'Check in with the people-pleaser manager part'; for EMDR: 'Assess SUDS on childhood school memory'; for CBT: 'Review thought record on boss message')"
    }
  ],
  "winsToCelebrate": [
    "Breakthrough or moment they handled differently this week"
  ],
  "homeworkDebriefNotes": "Summary of behavioral experiments attempted and what was learned",
  "questionsForTherapist": [
    "Targeted question 1 to ask the therapist",
    "Targeted question 2"
  ]
}

Return ONLY valid JSON.`;

        const response = await callAIWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          5000
        );

        guideData = cleanAndParseJSON(response.text, null);
      } catch (geminiError) {
        console.warn('Local Ollama session guide generation error, using fallback:', geminiError);
      }
    }

    if (!guideData || !guideData.prioritizedAgenda) {
      guideData = generateFallbackSessionGuide(req.body);
    }

    res.json(guideData);
  } catch (error: any) {
    console.error('Error generating session guide:', error);
    res.json(generateFallbackSessionGuide(req.body));
  }
});

// Production vs Development static serving & Vite middleware
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const portNumber = Number(PORT) || 3000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${portNumber}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
