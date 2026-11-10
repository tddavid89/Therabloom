import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Dynamic Server-side Gemini Client
function getValidGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || typeof key !== 'string' || key.trim() === '' || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function callGeminiWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 6000
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// Helper for safe JSON parsing from Gemini
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
    console.warn('Failed to parse JSON response from Gemini:', err);
    return fallback;
  }
}

// -------------------------------------------------------------
// INTELLIGENT CLINICAL FALLBACK GENERATORS (WHEN GEMINI IS OFFLINE / QUOTA EXCEEDED)
// -------------------------------------------------------------

function generateFallbackJournalReply(
  messages: any[], 
  sessionContext: any, 
  mode: string, 
  activeModalities: string[] = []
): string {
  const lastMsg = (messages && messages.length > 0 ? messages[messages.length - 1].content : '').trim();
  const modalities = activeModalities?.length ? activeModalities : ['IFS', 'Somatic Experiencing', 'CBT'];
  
  let reflection = `I hear how much is present for you right now. Thank you for taking this moment between sessions to slow down and reflect.\n\n`;

  if (lastMsg) {
    reflection += `When you bring attention to "${lastMsg.slice(0, 100)}${lastMsg.length > 100 ? '...' : ''}", it is completely understandable that your system feels activated, tired, or tender.\n\n`;
  }

  if (modalities.includes('Somatic Experiencing')) {
    reflection += `Let's begin by checking in with your physical body: Where do you feel this sensation most vividly right now? Is there tightness in your chest, a flutter in your stomach, or tension in your jaw or shoulders? Take a slow, compassionate breath and see if you can soften your posture by just 5%.\n\n`;
  }

  if (modalities.includes('IFS')) {
    reflection += `From an IFS perspective, notice if there is a protector part speaking—perhaps a vigilant manager trying to keep you safe from being judged, or a critic part that worries about failing. What happens when you extend calm Self-energy and say to that part: "I see you, and I appreciate how hard you have been working to protect me"?\n\n`;
  } else if (modalities.includes('CBT')) {
    reflection += `From a CBT lens, what automatic thoughts are running in the background? Are there 'all-or-nothing' assumptions or 'should' statements? Remember that thoughts are mental suggestions, not objective commands.\n\n`;
  } else if (modalities.includes('DBT')) {
    reflection += `From a DBT Wise Mind lens, what would balance the emotional surge you are feeling with your grounded inner wisdom?\n\n`;
  }

  reflection += `What would feel most gentle and supportive for you to give yourself in this moment?`;
  return reflection;
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
    const { messages, sessionContext, mode, activeModalities } = req.body;
    let reply = '';

    const gemini = getValidGeminiClient();
    if (gemini) {
      try {
        const modalitiesList = activeModalities?.length ? activeModalities.join(', ') : 'CBT, Somatic Experiencing, Mindfulness';

        const systemInstruction = `You are "Soma", a warm, empathetic, and psychologically grounded between-session journaling companion for a user in counseling/therapy.
Your role:
- Validate emotional experiences with compassion, warmth, and non-judgment.
- Active Clinical Modalities leveraged by client: ${modalitiesList}.
- Tailor reflections using these modalities:
  * If IFS (Internal Family Systems): recognize "parts" (e.g. protector parts, perfectionist managers, wounded exiles). Gently ask how the client feels toward that part from Self-energy (curiosity, compassion, calm).
  * If EMDR: normalize noticing bodily anchors, SUDs ratings (0-10), bilateral somatic soothing, and holding dual awareness of past memory vs. present safety.
  * If CBT: assist with identifying automatic cognitive distortions (catastrophizing, mind-reading, all-or-nothing) and examining objective evidence.
  * If DBT: reference distress tolerance (TIPP skills, Radical Acceptance), emotion regulation, and Wise Mind balance between emotion and logic.
  * If Somatic Experiencing / Polyvagal: track bodily felt-senses, window of tolerance, and encourage physical resets (physiological sighs, grounding feet).
  * If ACT: emphasize psychological flexibility, cognitive defusion ("I notice my mind having the thought that..."), and values-aligned action.
- Keep responses conversational, concise (2-4 paragraphs maximum), and invite gentle self-exploration.
- Help the user connect their daily moments to their therapy session themes and homework without sounding clinical or didactic.
- Safety: If the user indicates immediate severe crisis or intent of self-harm, validate their pain empathetically and remind them of the 988 Suicide & Crisis Lifeline (call/text 988) or text HOME to 741741, while keeping them safe.

Current User Context:
- Active Themes: ${sessionContext?.themes?.join(', ') || 'General growth and emotional well-being'}
- Recent Session Notes / Focus: ${sessionContext?.recentNotes || 'Working on self-awareness and regulation'}
- Active Homework: ${sessionContext?.activeHomework?.join('; ') || 'Practicing mindful reflection'}
- Journaling Mode: ${mode || 'Open reflection'}
- Active Modalities: ${modalitiesList}
`;

        const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
          role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        if (formattedContents.length === 0) {
          formattedContents.push({
            role: 'user',
            parts: [{ text: "Hello, I'm ready to reflect on how I've been doing since my last session." }],
          });
        }

        const response = await callGeminiWithTimeout(
          gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
            },
          }),
          5000
        );

        reply = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini chat error, using therapeutic fallback:', geminiError);
      }
    }

    if (!reply) {
      reply = generateFallbackJournalReply(messages, sessionContext, mode, activeModalities);
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in journal chat endpoint:', error);
    res.json({
      reply: generateFallbackJournalReply(req.body?.messages, req.body?.sessionContext, req.body?.mode, req.body?.activeModalities),
    });
  }
});

// 2. SYNTHESIZE SESSION NOTES & RESOURCES INTO MICRO-LEARNING & HOMEWORK
app.post('/api/synthesize/session', async (req, res) => {
  try {
    const { sessionTitle, sessionDate, rawNotes, themes, resourcesText, counselorAdvice } = req.body;
    let data: any = null;

    const gemini = getValidGeminiClient();
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

        const response = await callGeminiWithTimeout(
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
        console.warn('Gemini session synthesis error, using fallback:', geminiError);
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

    const gemini = getValidGeminiClient();
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

        const response = await callGeminiWithTimeout(
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
        console.warn('Gemini resource synthesis error, using fallback:', geminiError);
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

// 4. GENERATE ON-DEMAND MICRO-LESSON / QUIZ FOR A THEME
app.post('/api/generate/micro-lesson', async (req, res) => {
  try {
    const { theme, clientNeeds } = req.body;
    let data: any = null;

    const gemini = getValidGeminiClient();
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

        const response = await callGeminiWithTimeout(
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
        console.warn('Gemini micro-lesson error, using fallback:', geminiError);
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

    const gemini = getValidGeminiClient();
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

        const response = await callGeminiWithTimeout(
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
        console.warn('Gemini session prep report error, using fallback:', geminiError);
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

    const gemini = getValidGeminiClient();
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

        const response = await callGeminiWithTimeout(
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
        console.warn('Gemini session guide generation error, using fallback:', geminiError);
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
