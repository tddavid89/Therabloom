import React, { useState } from 'react';
import { X, Sparkles, Wand2, Calendar, User, Heart, BookOpen, AlertCircle, Tag } from 'lucide-react';
import { Session, MicroLesson, Homework, TherapyModality } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextSessionNumber: number;
  counselorName: string;
  defaultModalities?: TherapyModality[];
  onSaveSession: (session: Session, newLessons: MicroLesson[], newHomework: Homework[]) => void;
}

export const AddSessionModal: React.FC<AddSessionModalProps> = ({
  isOpen,
  onClose,
  nextSessionNumber,
  counselorName,
  defaultModalities = ['IFS', 'Somatic Experiencing'],
  onSaveSession,
}) => {
  const [sessionNumber, setSessionNumber] = useState(nextSessionNumber);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [counselor, setCounselor] = useState(counselorName || 'Dr. Evelyn Brooks, LMFT');
  const [focusTheme, setFocusTheme] = useState('');
  const [sessionModalities, setSessionModalities] = useState<TherapyModality[]>(defaultModalities);
  const [rawNotes, setRawNotes] = useState('');
  const [counselorAdvice, setCounselorAdvice] = useState('');
  const [resourcesText, setResourcesText] = useState('');
  const [emotionBefore, setEmotionBefore] = useState('Anxious & Tense (7/10)');
  const [emotionAfter, setEmotionAfter] = useState('Grounded & Clear (4/10)');

  // AI Synthesis state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedResult, setSynthesizedResult] = useState<{
    summary?: string;
    themes?: string[];
    microLessons?: any[];
    extractedHomework?: any[];
    keyQuotes?: string[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAISynthesis = async () => {
    if (!rawNotes.trim()) {
      setErrorMsg('Please write some session notes first so Gemini can synthesize them.');
      return;
    }
    setErrorMsg(null);
    setIsSynthesizing(true);

    try {
      const response = await fetch('/api/synthesize/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionTitle: `Session #${sessionNumber}: ${focusTheme || 'Counseling Session'}`,
          sessionDate: date,
          rawNotes,
          themes: focusTheme ? [focusTheme] : ['Emotional Growth'],
          resourcesText,
          counselorAdvice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run synthesis on the server');
      }

      const data = await response.json();
      setSynthesizedResult(data);
      if (data.keyQuotes?.[0] && !counselorAdvice) {
        setCounselorAdvice(data.keyQuotes[0]);
      }
      fireCelebration();
    } catch (err: any) {
      console.error('Error during synthesis:', err);
      setErrorMsg(err?.message || 'Synthesis encountered an issue. You can still save manually.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSave = () => {
    if (!rawNotes.trim()) {
      setErrorMsg('Please enter session notes or discussion points.');
      return;
    }

    const sessionId = `session-${Date.now()}`;
    const newHomework: Homework[] = [];
    const newLessons: MicroLesson[] = [];

    // Process synthesized homework
    if (synthesizedResult?.extractedHomework) {
      synthesizedResult.extractedHomework.forEach((hw, idx) => {
        newHomework.push({
          id: `hw-${Date.now()}-${idx}`,
          title: hw.title || 'Therapy Practice Exercise',
          category: hw.category || 'Behavioral Experiment',
          description: hw.description || 'Practice between sessions.',
          suggestedFrequency: hw.suggestedFrequency || '2-3 times this week',
          relatedThemeId: 'theme-boundaries',
          status: 'pending',
          xpReward: 40,
          sessionId,
        });
      });
    }

    // Process synthesized micro-lessons
    if (synthesizedResult?.microLessons) {
      synthesizedResult.microLessons.forEach((ml, idx) => {
        newLessons.push({
          id: `ml-${Date.now()}-${idx}`,
          title: ml.title || 'Micro-Reflection',
          concept: ml.concept || 'Psychological insight from session.',
          practicalApplication: ml.practicalApplication || 'Small step today.',
          reflectionPrompt: ml.reflectionPrompt || 'What did you notice?',
          quiz: ml.quiz,
          relatedThemeId: 'theme-boundaries',
          completed: false,
          xpReward: 45,
        });
      });
    }

    const newSession: Session = {
      id: sessionId,
      sessionNumber: Number(sessionNumber),
      date,
      counselorName: counselor,
      focusTheme: focusTheme || 'General Growth & Emotional Awareness',
      rawNotes,
      summary: synthesizedResult?.summary || rawNotes.slice(0, 160) + '...',
      keyInsights: synthesizedResult?.keyQuotes || [counselorAdvice || 'Growth happens step by step.'],
      emotionBefore,
      emotionAfter,
      homeworkIds: newHomework.map((h) => h.id),
      resourceIds: [],
      themes: synthesizedResult?.themes || [focusTheme || 'Emotional Health'],
      modalities: sessionModalities,
      counselorAdvice,
      createdAt: new Date().toISOString(),
    };

    onSaveSession(newSession, newLessons, newHomework);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA] mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E2922]">Log Counseling Session</h2>
              <p className="text-xs text-[#607066]">
                Record notes, insights, and auto-synthesize into between-session micro-learning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center space-x-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Session Number
              </label>
              <input
                type="number"
                value={sessionNumber}
                onChange={(e) => setSessionNumber(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Date of Session
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Counselor Name
              </label>
              <input
                type="text"
                value={counselor}
                onChange={(e) => setCounselor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1">
              Primary Focus / Theme Discussed
            </label>
            <input
              type="text"
              placeholder="e.g., Setting Boundaries with Family, Catastrophic Thinking, Somatic Chest Tightness"
              value={focusTheme}
              onChange={(e) => setFocusTheme(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1.5">
              Modalities Leveraged in This Session
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['IFS', 'EMDR', 'CBT', 'DBT', 'ACT', 'Somatic Experiencing', 'Attachment-Based'] as TherapyModality[]).map((mod) => {
                const isSelected = sessionModalities.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSessionModalities(sessionModalities.filter((m) => m !== mod));
                      } else {
                        setSessionModalities([...sessionModalities, mod]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-2xs'
                        : 'bg-white border-[#E8E2D9] text-[#607066] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[#4A574E]">
                Session Discussion & Raw Notes
              </label>
              <span className="text-[11px] text-[#607066]">
                Jot down what you talked about, breakthroughs, or things that made you cry/smile
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="What did your therapist say? What patterns or childhood memories came up? What did you discover about your emotions or triggers?"
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E4DDD3] bg-white text-[#243029] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Counselor Advice or Memorable Quote
              </label>
              <input
                type="text"
                placeholder='e.g., "Guilt is the price of admission to peace."'
                value={counselorAdvice}
                onChange={(e) => setCounselorAdvice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Resources Recommended / Mentioned
              </label>
              <input
                type="text"
                placeholder="e.g., Polyvagal video, Chapter 4 of Attached, 4-7-8 breathing"
                value={resourcesText}
                onChange={(e) => setResourcesText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
          </div>

          {/* Emotional Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F4EFEA] rounded-2xl">
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Emotion Going In
              </label>
              <input
                type="text"
                value={emotionBefore}
                onChange={(e) => setEmotionBefore(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4DDD3] bg-white text-[#243029] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Emotion Leaving Session
              </label>
              <input
                type="text"
                value={emotionAfter}
                onChange={(e) => setEmotionAfter(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4DDD3] bg-white text-[#243029] text-xs"
              />
            </div>
          </div>

          {/* AI Synthesis Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF2ED] to-[#F0F7FA] border border-[#CDE5D4]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-[#2D5A43]" />
                <span className="font-bold text-[#1E2922] text-xs sm:text-sm">
                  Gemini Synthesis Engine
                </span>
              </div>
              <button
                type="button"
                onClick={handleRunAISynthesis}
                disabled={isSynthesizing || !rawNotes.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>
                  {isSynthesizing ? 'Distilling & Generating...' : 'Synthesize into Micro-Learning'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#526056]">
              Gemini will extract bite-sized daily lessons, real-world homework experiments, and core psychological themes from your notes!
            </p>

            {/* Synthesized Preview */}
            {synthesizedResult && (
              <div className="mt-3 pt-3 border-t border-[#D1E5D8] space-y-2 text-xs">
                {synthesizedResult.summary && (
                  <p className="text-[#243029]">
                    <strong>Summary:</strong> {synthesizedResult.summary}
                  </p>
                )}
                {synthesizedResult.microLessons && synthesizedResult.microLessons.length > 0 && (
                  <p className="text-emerald-800 font-semibold">
                    ✨ Extracted {synthesizedResult.microLessons.length} Micro-Lessons & Quizzes
                  </p>
                )}
                {synthesizedResult.extractedHomework && synthesizedResult.extractedHomework.length > 0 && (
                  <p className="text-[#2D5A43] font-semibold">
                    🎯 Created {synthesizedResult.extractedHomework.length} Actionable Homework Tasks
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-[#EAE3DA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Save Session & Integrate Growth
          </button>
        </div>

      </div>
    </div>
  );
};
