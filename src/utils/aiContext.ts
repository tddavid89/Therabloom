import { Session } from '../types/therapy';

// Trimmed copy of each session sent to the local AI server for retrieval.
export function compactSessions(sessions: Session[]) {
  return sessions.map((s) => ({
    id: s.id,
    sessionNumber: s.sessionNumber,
    date: s.date,
    focusTheme: s.focusTheme,
    summary: s.summary,
    keyInsights: s.keyInsights,
    counselorAdvice: s.counselorAdvice,
    themes: s.themes,
    rawNotes: (s.rawNotes || '').slice(0, 1500),
  }));
}

export type AIQuality = 'fast' | 'deep';
const QUALITY_KEY = 'therabloom_ai_quality_v1';

export function getAIQuality(): AIQuality {
  try {
    return localStorage.getItem(QUALITY_KEY) === 'deep' ? 'deep' : 'fast';
  } catch {
    return 'fast';
  }
}

export function setAIQuality(q: AIQuality) {
  try {
    localStorage.setItem(QUALITY_KEY, q);
  } catch {
    /* storage unavailable */
  }
}
