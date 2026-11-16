import React, { useState } from 'react';
import { 
  Plus, 
  Youtube, 
  BookOpen, 
  Share2, 
  FileText, 
  Headphones, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Quote, 
  Target, 
  Sparkles, 
  Filter,
  MessageSquare
} from 'lucide-react';
import { Resource, ResourceType, Theme } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface ResourceVaultProps {
  resources: Resource[];
  themes: Theme[];
  onOpenAddResource: () => void;
  onToggleComplete: (resourceId: string) => void;
  onStartJournalFromPrompt?: (promptText: string) => void;
}

export const ResourceVault: React.FC<ResourceVaultProps> = ({
  resources,
  themes,
  onOpenAddResource,
  onToggleComplete,
  onStartJournalFromPrompt,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('all');

  const filtered = resources.filter((res) => {
    if (selectedType !== 'all' && res.type !== selectedType) return false;
    if (selectedThemeFilter !== 'all' && res.relatedThemeId !== selectedThemeFilter) return false;
    return true;
  });

  const getTheme = (themeId: string) => themes.find((t) => t.id === themeId);

  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-rose-600" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-700" />;
      case 'social_post':
        return <Share2 className="w-4 h-4 text-purple-600" />;
      case 'article':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'podcast':
        return <Headphones className="w-4 h-4 text-emerald-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#2D5A43]" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
            Between-Session Resource Vault
          </h2>
          <p className="text-xs sm:text-sm text-[#607066]">
            Therapy assignments, YouTube videos, books, articles & social media carousels with AI-distilled takeaways
          </p>
        </div>

        <button
          onClick={onOpenAddResource}
          className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add & Distill Resource</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E2D9] text-xs">
        
        {/* Type Pills */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'youtube', label: 'YouTube' },
            { id: 'book', label: 'Books' },
            { id: 'social_post', label: 'Social Media' },
            { id: 'article', label: 'Handouts & Articles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-[#2D5A43] text-white shadow-xs'
                  : 'text-[#607066] hover:bg-[#FAF8F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Theme Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#607066]" />
          <select
            value={selectedThemeFilter}
            onChange={(e) => setSelectedThemeFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-[#E4DDD3] bg-[#FAF8F5] text-xs text-[#243029]"
          >
            <option value="all">All Counseling Themes</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((res) => {
          const theme = getTheme(res.relatedThemeId);

          return (
            <div
              key={res.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                res.completed
                  ? 'border-emerald-200/80 bg-[#FAFBF9]'
                  : 'border-[#E8E2D9] hover:shadow-md'
              }`}
            >
              <div>
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9]">
                      {getIconForType(res.type)}
                    </span>
                    <span className="text-[11px] font-bold text-[#607066]">
                      {res.platformBadge || res.type}
                    </span>
                    {res.isAssignedByTherapist && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Counselor Assigned
                      </span>
                    )}
                  </div>

                  {/* Completion Toggle */}
                  <button
                    onClick={() => {
                      if (!res.completed) fireCelebration();
                      onToggleComplete(res.id);
                    }}
                    className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-xl transition cursor-pointer ${
                      res.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#FAF8F5] text-[#607066] hover:bg-[#EFEAE2]'
                    }`}
                  >
                    {res.completed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed (+30 XP)</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark Reviewed</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title & Creator */}
                <h3 className="text-base sm:text-lg font-bold text-[#1E2922] mb-1 leading-snug">
                  {res.title}
                </h3>
                {res.authorOrCreator && (
                  <p className="text-xs text-[#607066] mb-3">
                    By <strong>{res.authorOrCreator}</strong>
                  </p>
                )}

                {/* Theme Tag */}
                {theme && (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-white mb-4"
                    style={{ backgroundColor: theme.color }}
                  >
                    <span>{theme.name}</span>
                  </div>
                )}

                {/* Counselor / Personal Notes */}
                {res.notes && (
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#526056] mb-4 italic">
                    "{res.notes}"
                  </div>
                )}

                {/* AI Distilled Takeaways Box */}
                {res.distilledTakeaways && res.distilledTakeaways.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9E6DE] mb-4 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2D5A43]">
                      <Sparkles className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>Distilled Therapy Takeaways</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#243029]">
                      {res.distilledTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-700 font-bold shrink-0">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Core Quote or Insight */}
                {res.coreQuoteOrInsight && (
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#1E2922] mb-4 flex items-start space-x-2 font-serif italic">
                    <Quote className="w-3.5 h-3.5 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>"{res.coreQuoteOrInsight}"</span>
                  </div>
                )}

                {/* Micro-Action */}
                {res.microAction && (
                  <div className="p-3 rounded-xl bg-[#EAF2ED]/60 border border-[#D1E5D8] text-xs text-[#1E2922] mb-4">
                    <div className="flex items-center space-x-1.5 font-bold text-[#2D5A43] mb-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>2-Minute Real World Action</span>
                    </div>
                    <p className="text-[#334238] font-medium">{res.microAction}</p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#EAE3DA] flex items-center justify-between text-xs">
                {res.url ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-[#2D5A43] font-semibold hover:underline"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-[#8C9B90]">Assigned reading / material</span>
                )}

                {res.journalPrompt && onStartJournalFromPrompt && (
                  <button
                    onClick={() => onStartJournalFromPrompt(res.journalPrompt!)}
                    className="inline-flex items-center space-x-1 text-xs text-[#2D5A43] hover:text-[#1E2922] font-semibold cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Journal This</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-[#E8E2D9] p-8">
            <BookOpen className="w-10 h-10 text-[#8C9B90] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1E2922]">No resources match your filters</h3>
            <p className="text-xs text-[#607066] mt-1">
              Add YouTube videos, book chapters, or social posts assigned by your therapist to distill key takeaways.
            </p>
            <button
              onClick={onOpenAddResource}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234734] transition cursor-pointer"
            >
              Add Resource
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
