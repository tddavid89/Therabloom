import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Sparkles, 
  Award, 
  Activity, 
  Wind, 
  Brain, 
  BookOpen, 
  CheckCircle2, 
  X,
  Star
} from 'lucide-react';
import { Homework, HomeworkCategory, Theme } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface HomeworkTrackerProps {
  homeworkList: Homework[];
  themes: Theme[];
  onCompleteHomework: (homeworkId: string, reflectionNotes: string, difficultyRating: number, xpReward: number) => void;
  onAddHomework: (newHw: Homework) => void;
}

export const HomeworkTracker: React.FC<HomeworkTrackerProps> = ({
  homeworkList,
  themes,
  onCompleteHomework,
  onAddHomework,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedHwForReflection, setSelectedHwForReflection] = useState<Homework | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Homework state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HomeworkCategory>('Behavioral Experiment');
  const [newDesc, setNewDesc] = useState('');
  const [newFrequency, setNewFrequency] = useState('Daily');
  const [newThemeId, setNewThemeId] = useState(themes[0]?.id || 'theme-boundaries');

  const filteredHw = homeworkList.filter((hw) => {
    if (filter === 'active') return hw.status !== 'completed';
    if (filter === 'completed') return hw.status === 'completed';
    return true;
  });

  const getTheme = (themeId: string) => themes.find((t) => t.id === themeId);

  const getCategoryBadge = (cat: HomeworkCategory) => {
    switch (cat) {
      case 'Behavioral Experiment':
        return { label: 'Behavioral Experiment', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: Activity };
      case 'Somatic Practice':
        return { label: 'Somatic Practice', color: 'bg-sky-50 text-sky-800 border-sky-200', icon: Wind };
      case 'Cognitive Reframe':
        return { label: 'Cognitive Reframe', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Brain };
      case 'Media / Reading':
        return { label: 'Media / Reading', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: BookOpen };
      default:
        return { label: 'Journaling', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: CheckSquare };
    }
  };

  const handleOpenReflectionModal = (hw: Homework) => {
    if (hw.status === 'completed') return;
    setSelectedHwForReflection(hw);
    setReflectionText(hw.reflectionNotes || '');
    setDifficulty(hw.difficultyRating || 3);
  };

  const handleConfirmCompletion = () => {
    if (!selectedHwForReflection) return;
    fireCelebration();
    onCompleteHomework(
      selectedHwForReflection.id,
      reflectionText,
      difficulty,
      selectedHwForReflection.xpReward || 40
    );
    setSelectedHwForReflection(null);
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHw: Homework = {
      id: `hw-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      description: newDesc || 'Practice between counseling sessions.',
      suggestedFrequency: newFrequency,
      relatedThemeId: newThemeId,
      status: 'pending',
      xpReward: 40,
    };

    onAddHomework(newHw);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
            Between-Session Homework & Experiments
          </h2>
          <p className="text-xs sm:text-sm text-[#607066]">
            Turn therapeutic insights into tangible behavioral shifts, somatic anchors, and cognitive reframes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experiment / Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white p-1.5 rounded-2xl border border-[#E8E2D9] max-w-sm text-xs font-semibold">
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-1.5 rounded-xl transition cursor-pointer ${
            filter === 'active' ? 'bg-[#2D5A43] text-white shadow-xs' : 'text-[#607066]'
          }`}
        >
          Active Experiments ({homeworkList.filter((h) => h.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 rounded-xl transition cursor-pointer ${
            filter === 'completed' ? 'bg-[#2D5A43] text-white shadow-xs' : 'text-[#607066]'
          }`}
        >
          Completed ({homeworkList.filter((h) => h.status === 'completed').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-xl transition cursor-pointer ${
            filter === 'all' ? 'bg-[#2D5A43] text-white shadow-xs' : 'text-[#607066]'
          }`}
        >
          All ({homeworkList.length})
        </button>
      </div>

      {/* Homework List */}
      <div className="space-y-3.5">
        {filteredHw.map((hw) => {
          const theme = getTheme(hw.relatedThemeId);
          const catInfo = getCategoryBadge(hw.category);
          const CatIcon = catInfo.icon;
          const isDone = hw.status === 'completed';

          return (
            <div
              key={hw.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                isDone
                  ? 'border-emerald-200/80 bg-[#FAFBF9]'
                  : 'border-[#E8E2D9] shadow-xs hover:border-[#2D5A43]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Checkbox & Details */}
                <div className="flex items-start space-x-3.5 flex-1">
                  <button
                    onClick={() => handleOpenReflectionModal(hw)}
                    disabled={isDone}
                    className={`mt-0.5 p-1 rounded-xl transition cursor-pointer shrink-0 ${
                      isDone
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-[#8C9B90] hover:text-[#2D5A43] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Square className="w-6 h-6" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catInfo.color}`}>
                        <CatIcon className="w-3 h-3" />
                        <span>{catInfo.label}</span>
                      </span>

                      {theme && (
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
                          style={{ backgroundColor: theme.color }}
                        >
                          {theme.name}
                        </span>
                      )}

                      <span className="text-xs text-[#607066]">
                        • {hw.suggestedFrequency}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold text-[#1E2922] ${isDone ? 'line-through text-[#607066]' : ''}`}>
                      {hw.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4A574E] leading-relaxed">
                      {hw.description}
                    </p>

                    {/* Reflection note if completed */}
                    {hw.reflectionNotes && (
                      <div className="mt-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#2D5A43]">
                        <span className="font-bold block mb-0.5">Your Reflection & Takeaway:</span>
                        <p className="italic text-[#334238]">"{hw.reflectionNotes}"</p>
                        {hw.difficultyRating && (
                          <div className="flex items-center space-x-1 mt-1 text-[11px] text-[#607066]">
                            <span>Difficulty felt:</span>
                            <span className="font-bold text-[#1E2922]">{hw.difficultyRating}/5</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right XP Reward */}
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>+{hw.xpReward} XP</span>
                  </span>
                  {!isDone && (
                    <button
                      onClick={() => handleOpenReflectionModal(hw)}
                      className="block text-[11px] text-[#2D5A43] hover:underline font-semibold mt-2 cursor-pointer"
                    >
                      Complete & Reflect
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {filteredHw.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E8E2D9] p-8">
            <CheckSquare className="w-10 h-10 text-[#8C9B90] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1E2922]">No homework in this view</h3>
            <p className="text-xs text-[#607066] mt-1">
              Add actionable experiments or log a new therapy session to auto-generate tasks.
            </p>
          </div>
        )}
      </div>

      {/* Reflection & Completion Modal */}
      {selectedHwForReflection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5]">
            <button
              onClick={() => setSelectedHwForReflection(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2D5A43] mb-1">
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <span>Complete Behavioral Experiment</span>
            </div>
            <h3 className="text-lg font-bold text-[#1E2922] mb-1">
              {selectedHwForReflection.title}
            </h3>
            <p className="text-xs text-[#607066] mb-4">
              Reflecting on what happened embeds the learning deep into your neural pathways.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                  How did it go? What somatic cues, resistance, or feelings came up?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. My heart pounded when I set the boundary, but nobody was angry. I felt relieved afterwards."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-xs sm:text-sm text-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                  Emotional Difficulty Rating (1 = Breeze, 5 = Very Challenging)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDifficulty(num)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        difficulty === num
                          ? 'bg-[#2D5A43] text-white border-[#2D5A43]'
                          : 'bg-white border-[#E4DDD3] text-[#243029]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-5 mt-5 border-t border-[#EAE3DA]">
              <button
                onClick={() => setSelectedHwForReflection(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="px-5 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Save & Earn +{selectedHwForReflection.xpReward} XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5]">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#1E2922] mb-1">
              Add Between-Session Experiment
            </h3>
            <p className="text-xs text-[#607066] mb-4">
              Commit to a small daily practice, somatic pause, or boundary check
            </p>

            <form onSubmit={handleCreateHomework} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Say 'No' to 1 request without making an excuse"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as HomeworkCategory)}
                    className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
                  >
                    <option value="Behavioral Experiment">Behavioral Experiment</option>
                    <option value="Somatic Practice">Somatic Practice</option>
                    <option value="Cognitive Reframe">Cognitive Reframe</option>
                    <option value="Media / Reading">Media / Reading</option>
                    <option value="Journaling">Journaling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Suggested Frequency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Daily, 2x this week"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                  Related Counseling Theme
                </label>
                <select
                  value={newThemeId}
                  onChange={(e) => setNewThemeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
                >
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                  Instructions / Steps
                </label>
                <textarea
                  rows={3}
                  placeholder="How specifically will you execute this experiment?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Add Homework Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
