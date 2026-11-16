import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Award, 
  RefreshCw, 
  Target, 
  BookOpen, 
  ChevronRight, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { Theme, MicroLesson } from '../types/therapy';

interface ThemeGrowthMapProps {
  themes: Theme[];
  onGenerateMicroLessonForTheme: (theme: Theme) => void;
  onOpenThemeManager?: () => void;
  isGenerating?: boolean;
}

export const ThemeGrowthMap: React.FC<ThemeGrowthMapProps> = ({
  themes,
  onGenerateMicroLessonForTheme,
  onOpenThemeManager,
  isGenerating = false,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0] || {} as Theme);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
            Counseling Themes & Growth Map
          </h2>
          <p className="text-xs sm:text-sm text-[#607066]">
            The psychological pillars of your therapy journey—customized with clinical modalities & personal anchors
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {onOpenThemeManager && (
            <button
              onClick={onOpenThemeManager}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#2D5A43] text-xs font-semibold text-[#1E2922] transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Customize Themes & Modalities</span>
            </button>
          )}

          <button
            onClick={() => selectedTheme.name && onGenerateMicroLessonForTheme(selectedTheme)}
            disabled={isGenerating || !selectedTheme.name}
            className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating ? 'Synthesizing...' : `Generate 2-Min Lesson on ${selectedTheme.name ? selectedTheme.name.split(' ')[0] : 'Theme'}`}
            </span>
          </button>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {themes.map((theme) => {
          const isSelected = selectedTheme?.id === theme.id;
          const progressPercent = Math.min(100, (theme.growthPoints % 200) / 2);

          return (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#2D5A43] shadow-md ring-2 ring-[#2D5A43]/15'
                  : 'bg-white/80 border-[#E8E2D9] hover:bg-white hover:border-[#CBD5E1]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: theme.color }}
                    >
                      {theme.category}
                    </span>
                    {theme.modality && (
                      <span className="text-[10px] font-bold text-[#2D5A43] bg-[#EAF2ED] px-2 py-0.5 rounded-full border border-[#D1E5D8]">
                        {theme.modality}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#2D5A43] bg-[#EAF2ED] px-2 py-0.5 rounded-full">
                    Mastery Lvl {theme.masteryLevel}/5
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1E2922] mb-1.5">
                  {theme.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#4E5D53] leading-relaxed mb-3">
                  {theme.description}
                </p>

                {theme.affirmation && (
                  <p className="text-xs text-[#2D5A43] font-serif italic mb-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
                    "{theme.affirmation}"
                  </p>
                )}

                {theme.personalTriggers && theme.personalTriggers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 mb-4 text-[11px] text-[#607066]">
                    <span className="font-semibold text-[#1E2922]">Triggers:</span>
                    {theme.personalTriggers.map((trig, idx) => (
                      <span key={idx} className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EAE3DA]">
                        {trig}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Progress bar */}
                <div className="space-y-1 pt-3 border-t border-[#EAE3DA]">
                  <div className="flex justify-between text-[11px] text-[#607066] font-medium">
                    <span>Integration Experience</span>
                    <span className="font-bold text-[#1E2922]">{theme.growthPoints} XP</span>
                  </div>
                  <div className="w-full bg-[#EFEAE2] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent || 40}%`,
                        backgroundColor: theme.color,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs">
                  {onOpenThemeManager ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenThemeManager();
                      }}
                      className="text-[#607066] hover:text-[#1E2922] hover:underline"
                    >
                      Edit Theme
                    </button>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateMicroLessonForTheme(theme);
                    }}
                    disabled={isGenerating}
                    className="font-semibold text-[#2D5A43] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Practice Micro-Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
