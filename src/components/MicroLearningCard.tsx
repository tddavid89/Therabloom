import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Target, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { MicroLesson, Theme } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface MicroLearningCardProps {
  lesson: MicroLesson;
  themes: Theme[];
  onCompleteLesson: (lessonId: string, xp: number) => void;
  onGenerateNewLesson: (themeName: string) => void;
  isGenerating?: boolean;
}

export const MicroLearningCard: React.FC<MicroLearningCardProps> = ({
  lesson,
  themes,
  onCompleteLesson,
  onGenerateNewLesson,
  isGenerating = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    lesson.userAnswerIndex ?? null
  );
  const [isAnswered, setIsAnswered] = useState<boolean>(lesson.completed);
  const [showExplanation, setShowExplanation] = useState<boolean>(lesson.completed);
  const [activeTab, setActiveTab] = useState<'concept' | 'experiment' | 'quiz' | 'prompt'>('concept');

  const theme = themes.find((t) => t.id === lesson.relatedThemeId);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setShowExplanation(true);

    if (lesson.quiz && idx === lesson.quiz.correctIndex) {
      fireCelebration();
      onCompleteLesson(lesson.id, lesson.xpReward);
    } else {
      // Still award partial completion for engaging
      onCompleteLesson(lesson.id, Math.floor(lesson.xpReward * 0.7));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D9] relative overflow-hidden transition-all hover:shadow-md">
      
      {/* Top Banner / Theme Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme?.color || '#2D5A43' }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#607066]">
            {theme?.name || 'Between-Session Growth'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3EFEA] text-[#607066] font-medium">
            2-Min Micro-Lesson
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {lesson.completed ? (
            <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed (+{lesson.xpReward} XP)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>+{lesson.xpReward} XP</span>
            </span>
          )}

          <button
            onClick={() => onGenerateNewLesson(theme?.name || 'Boundaries')}
            disabled={isGenerating}
            className="flex items-center space-x-1 text-xs text-[#2D5A43] hover:text-[#1E2922] font-medium px-2 py-1 rounded-lg hover:bg-[#EFEAE2] transition disabled:opacity-50 cursor-pointer"
            title="Generate a fresh micro-lesson using Gemini AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'New Seed'}</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#1E2922] mb-3 leading-snug">
        {lesson.title}
      </h3>

      {/* Sub-Tabs for Micro-Learning Steps */}
      <div className="flex space-x-1 bg-[#F4EFEA] p-1 rounded-xl mb-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
            activeTab === 'concept' ? 'bg-white text-[#1E2922] shadow-xs' : 'text-[#607066] hover:text-[#1E2922]'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>The Concept</span>
        </button>
        <button
          onClick={() => setActiveTab('experiment')}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
            activeTab === 'experiment' ? 'bg-white text-[#1E2922] shadow-xs' : 'text-[#607066] hover:text-[#1E2922]'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>1-Min Action</span>
        </button>
        {lesson.quiz && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
              activeTab === 'quiz' ? 'bg-white text-[#1E2922] shadow-xs' : 'text-[#607066] hover:text-[#1E2922]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Reframe Quiz</span>
          </button>
        )}
      </div>

      {/* Tab 1: The Psychological Concept */}
      {activeTab === 'concept' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA]">
            <p className="text-[#334238] leading-relaxed text-sm sm:text-base">
              {lesson.concept}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('experiment')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2D5A43] hover:underline cursor-pointer"
            >
              <span>Next: See 1-Minute Action</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Practical Real-World Experiment */}
      {activeTab === 'experiment' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#EAF2ED]/60 border border-[#D1E5D8]">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-[#2D5A43] text-white shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D5A43] mb-1">
                  Try This In Real Life Today
                </h4>
                <p className="text-[#243029] text-sm sm:text-base font-medium">
                  {lesson.practicalApplication}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#526056] italic">
            <strong>Reflective Prompt:</strong> "{lesson.reflectionPrompt}"
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('concept')}
              className="text-xs text-[#607066] hover:text-[#1E2922] cursor-pointer"
            >
              Back to Concept
            </button>
            {lesson.quiz ? (
              <button
                onClick={() => setActiveTab('quiz')}
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234734] transition cursor-pointer shadow-xs"
              >
                <span>Take Reframe Quiz</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              !lesson.completed && (
                <button
                  onClick={() => {
                    fireCelebration();
                    onCompleteLesson(lesson.id, lesson.xpReward);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234734] transition cursor-pointer shadow-xs"
                >
                  Mark as Practiced (+{lesson.xpReward} XP)
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Reframe Quiz Challenge */}
      {activeTab === 'quiz' && lesson.quiz && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3 rounded-xl bg-[#F0F7FA] border border-[#D5EAF2] text-xs text-[#1E4E63] font-medium flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span>Test your cognitive reframing muscle in this scenario:</span>
          </div>

          <p className="text-sm font-semibold text-[#1E2922]">
            {lesson.quiz.question}
          </p>

          <div className="space-y-2">
            {lesson.quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === lesson.quiz?.correctIndex;
              let btnStyle = 'bg-white border-[#E4DDD3] text-[#243029] hover:bg-[#FAF8F5]';

              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through opacity-80';
                } else {
                  btnStyle = 'bg-white border-[#E4DDD3] opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-start space-x-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showExplanation && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-[#F6FBF7] border border-[#CDE5D4] text-xs sm:text-sm text-[#234734] animate-fadeIn">
              <div className="flex items-center space-x-1.5 font-bold mb-1">
                <Sparkles className="w-4 h-4 text-[#2D5A43]" />
                <span>Therapeutic Rationale:</span>
              </div>
              <p>{lesson.quiz.explanation}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
