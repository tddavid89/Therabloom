import React, { useEffect, useMemo, useState } from 'react';
import { Compass, PenLine, Quote, BookOpen, RefreshCw, Footprints, Copy, Check } from 'lucide-react';
import { Session, Theme, WeeklyFocus } from '../types/therapy';
import { INITIAL_WEEKLY_FOCUS } from '../data/initialData';
import { loadData, saveData } from '../utils/storage';
import { PERSONAL_PROFILE } from '../data/personalProfile';
import { compactSessions, getAIQuality } from '../utils/aiContext';
import { AIQualityToggle } from './AIQualityToggle';

const FOCUS_KEY = 'therabloom_weeklyfocus_v1';
const DONE_KEY = 'therabloom_weeklyfocus_done_v1';

interface Props {
  sessions: Session[];
  themes: Theme[];
  counselorName: string;
  pendingHomeworkCount: number;
  pendingResourceCount: number;
}

// Used when there is no curated or AI focus yet for the latest session.
function autoFocus(s: Session): WeeklyFocus {
  const ins = s.keyInsights.length ? s.keyInsights : [s.focusTheme];
  return {
    sessionId: s.id,
    source: 'auto',
    summary: s.summary || `Last session focused on ${s.focusTheme}. Use this week to notice where it shows up in daily life.`,
    focusAreas: ins.slice(0, 3).map((t) => ({ title: t, why: `From session ${s.sessionNumber}: ${s.focusTheme}.` })),
    practices: [
      s.counselorAdvice ? `Practice what your counselor suggested: ${s.counselorAdvice}` : 'Pick one small moment each day to try what you worked on in session.',
      'Notice one body sensation each day when you feel activated, and name it without judging it.',
      'Write down one moment this week where the old pattern showed up and what you did instead.',
    ],
    journalPrompts: [
      ...ins.slice(0, 3).map((t) => `What came up for me this week around this: "${t}"?`),
      'What did I do this week that I am proud of, however small?',
      'What do I want to bring to my next session?',
    ],
    affirmations: [
      ...(s.counselorAdvice ? [s.counselorAdvice] : []),
      'I can take this one step at a time.',
      'I am allowed to need things.',
    ],
    resources: [],
  };
}

export const WeeklyFocusCard: React.FC<Props> = ({ sessions, themes, counselorName, pendingHomeworkCount, pendingResourceCount }) => {
  const latest = useMemo(
    () => [...sessions].sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt))[0],
    [sessions]
  );
  const [stored, setStored] = useState<Record<string, WeeklyFocus>>(() => loadData(FOCUS_KEY, {}));
  const [done, setDone] = useState<Record<string, boolean>>(() => loadData(DONE_KEY, {}));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => saveData(FOCUS_KEY, stored), [stored]);
  useEffect(() => saveData(DONE_KEY, done), [done]);

  if (!latest) return null;
  const focus: WeeklyFocus = stored[latest.id] || INITIAL_WEEKLY_FOCUS[latest.id] || autoFocus(latest);

  const refresh = async () => {
    setBusy(true);
    setMsg('');
    try {
      const ordered = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
      const r = await fetch('/api/generate/weekly-focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessions: ordered.slice(0, 3),
          pillars: themes.map((t) => t.name),
          counselorName,
          sessionId: latest.id,
          personalProfile: PERSONAL_PROFILE,
          allSessions: compactSessions(sessions),
          quality: getAIQuality(),
        }),
      });
      if (!r.ok) throw new Error('unavailable');
      const data = (await r.json()) as WeeklyFocus;
      setStored((prev) => ({ ...prev, [latest.id]: data }));
      setMsg('Refreshed by your local AI from your recent sessions.');
    } catch {
      setMsg('Local AI is not reachable. Start Ollama and run the app locally. Showing your saved focus.');
    } finally {
      setBusy(false);
    }
  };

  const toggle = (i: number) => {
    const k = `${latest.id}:${i}`;
    setDone((d) => ({ ...d, [k]: !d[k] }));
  };

  const copyPrompts = async () => {
    try {
      await navigator.clipboard.writeText(focus.journalPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const doneCount = focus.practices.filter((_, i) => done[`${latest.id}:${i}`]).length;

  return (
    <section className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-5 sm:p-7 space-y-6" aria-labelledby="weekly-focus-title">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[#2D5A43] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>This week, based on session #{latest.sessionNumber} ({latest.date})</span>
          </div>
          <h3 id="weekly-focus-title" className="text-xl sm:text-2xl font-bold text-[#1E2922] mt-1">
            What to work on and explore this week
          </h3>
          <p className="text-xs text-[#607066] mt-1">
            This adds to your counselor's homework ({pendingHomeworkCount} active) and resources ({pendingResourceCount} to do). It does not replace them.
          </p>
        </div>
        <div className="flex items-start gap-3 shrink-0">
        <AIQualityToggle />
        <button
          onClick={refresh}
          disabled={busy}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] hover:bg-[#F4EFEA] text-xs font-semibold text-[#2D5A43] disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
          {busy ? 'Refreshing...' : 'Refresh from latest sessions'}
        </button>
        </div>
      </header>

      {msg && <p className="text-xs text-[#607066] -mt-3" role="status">{msg}</p>}

      <p className="text-sm text-[#243029] leading-relaxed max-w-3xl">{focus.summary}</p>

      <div className="grid gap-3 md:grid-cols-3">
        {focus.focusAreas.map((a, i) => (
          <div key={i} className="rounded-2xl bg-[#F4EFEA] border border-[#E8E2D9] p-4 min-w-0">
            <h4 className="text-sm font-bold text-[#1E2922]">{a.title}</h4>
            <p className="text-xs text-[#607066] leading-relaxed mt-1.5">{a.why}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[#1E2922]">
              <Footprints className="w-4 h-4 text-[#2D5A43]" /> Practices for this week
            </h4>
            <span className="text-[11px] text-[#607066]">{doneCount} of {focus.practices.length} done</span>
          </div>
          <ul className="space-y-2">
            {focus.practices.map((p, i) => {
              const on = !!done[`${latest.id}:${i}`];
              return (
                <li key={i}>
                  <label className="flex items-start gap-2.5 text-sm text-[#243029] leading-relaxed cursor-pointer">
                    <input type="checkbox" checked={on} onChange={() => toggle(i)} className="mt-1 accent-[#2D5A43]" />
                    <span className={on ? 'line-through text-[#8A9890]' : ''}>{p}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[#1E2922]">
              <PenLine className="w-4 h-4 text-[#2D5A43]" /> Journal prompts
            </h4>
            <button onClick={copyPrompts} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D5A43] cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy all'}
            </button>
          </div>
          <ol className="space-y-2 list-decimal pl-5 marker:text-[#2D5A43] marker:font-semibold">
            {focus.journalPrompts.map((p, i) => (
              <li key={i} className="text-sm text-[#243029] leading-relaxed pl-1">{p}</li>
            ))}
          </ol>
        </div>
      </div>

      <div>
        <h4 className="flex items-center gap-2 text-sm font-bold text-[#1E2922] mb-2">
          <Quote className="w-4 h-4 text-[#2D5A43]" /> Affirmations
        </h4>
        <div className="flex flex-wrap gap-2">
          {focus.affirmations.map((a, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl bg-[#EAF2EC] text-[#1E4631] text-sm italic border border-[#D5E5DA]">
              {a}
            </span>
          ))}
        </div>
      </div>

      {focus.resources.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-[#1E2922] mb-2">
            <BookOpen className="w-4 h-4 text-[#2D5A43]" /> Reading and resources
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {focus.resources.map((r, i) => (
              <div key={i} className="rounded-2xl border border-[#E8E2D9] p-3.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1E2922]">{r.title}</p>
                    {r.author && <p className="text-xs text-[#607066]">{r.author}</p>}
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.fromCounselor ? 'bg-[#2D5A43] text-white' : 'bg-[#F4EFEA] text-[#607066]'}`}>
                    {r.fromCounselor ? 'From your counselor' : 'Suggested'}
                  </span>
                </div>
                <p className="text-xs text-[#607066] leading-relaxed mt-1.5">{r.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#8A9890]">
        Prepared from your own session notes ({focus.source === 'curated' ? 'curated' : focus.source === 'ai' ? 'generated by your local AI' : 'auto-generated'}). It is not clinical advice. Bring what you notice to {counselorName || 'your counselor'}.
      </p>
    </section>
  );
};
