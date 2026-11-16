import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Tag, 
  Palette, 
  Brain 
} from 'lucide-react';
import { Theme, TherapyModality } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface ThemeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: Theme[];
  activeModalities: TherapyModality[];
  onSaveThemes: (updatedThemes: Theme[]) => void;
  onSaveModalities: (modalities: TherapyModality[]) => void;
}

const ALL_MODALITIES: { name: TherapyModality; desc: string; category: string }[] = [
  { name: 'IFS', desc: 'Internal Family Systems (Parts work, Protectors, Exiles & Self-energy)', category: 'Parts Work' },
  { name: 'EMDR', desc: 'Eye Movement Desensitization & Reprocessing (Trauma processing & Bilateral stimulation)', category: 'Trauma' },
  { name: 'CBT', desc: 'Cognitive Behavioral Therapy (Catching distortions & Thought records)', category: 'Cognitive' },
  { name: 'DBT', desc: 'Dialectical Behavior Therapy (Distress tolerance, TIPP, Wise Mind & Emotion regulation)', category: 'Behavioral' },
  { name: 'ACT', desc: 'Acceptance & Commitment Therapy (Psychological flexibility, Defusion & Values)', category: 'Mindfulness' },
  { name: 'Somatic Experiencing', desc: 'Nervous system regulation, Polyvagal theory & Tracking physical felt-senses', category: 'Somatic' },
  { name: 'Psychodynamic', desc: 'Childhood attachment patterns, defense mechanisms & unconscious dynamics', category: 'Relational' },
  { name: 'Attachment-Based', desc: 'Anxious/avoidant attachment styles & building earned secure connection', category: 'Relational' },
  { name: 'Mindfulness-Based', desc: 'Present-moment awareness, non-judgmental observation & breath anchoring', category: 'Mindfulness' },
];

const PRESET_COLORS = [
  '#2D5A43', // deep sage
  '#4B7B94', // serene blue
  '#9C6644', // warm terracotta
  '#6A5D7B', // lavender slate
  '#3F612D', // forest olive
  '#A0522D', // sienna
  '#3B7A57', // emerald
  '#5C5470', // dusk
];

export const ThemeManagerModal: React.FC<ThemeManagerModalProps> = ({
  isOpen,
  onClose,
  themes,
  activeModalities,
  onSaveThemes,
  onSaveModalities,
}) => {
  const [selectedModalities, setSelectedModalities] = useState<TherapyModality[]>(activeModalities);
  const [themeList, setThemeList] = useState<Theme[]>(themes);
  const [activeTab, setActiveTab] = useState<'themes' | 'modalities'>('themes');

  // Form for new / editing theme
  const [isEditingTheme, setIsEditingTheme] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Relational');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [modality, setModality] = useState<TherapyModality | undefined>('CBT');
  const [affirmation, setAffirmation] = useState('');
  const [triggersInput, setTriggersInput] = useState('');

  if (!isOpen) return null;

  const handleToggleModality = (mod: TherapyModality) => {
    let next: TherapyModality[];
    if (selectedModalities.includes(mod)) {
      next = selectedModalities.filter((m) => m !== mod);
    } else {
      next = [...selectedModalities, mod];
    }
    setSelectedModalities(next);
    onSaveModalities(next);
  };

  const handleStartEdit = (t: Theme) => {
    setIsEditingTheme(t.id);
    setName(t.name);
    setCategory(t.category);
    setDescription(t.description);
    setColor(t.color);
    setModality(t.modality || 'CBT');
    setAffirmation(t.affirmation || '');
    setTriggersInput(t.personalTriggers ? t.personalTriggers.join(', ') : '');
  };

  const handleCancelForm = () => {
    setIsEditingTheme(null);
    setName('');
    setDescription('');
    setAffirmation('');
    setTriggersInput('');
  };

  const handleSaveThemeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTriggers = triggersInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (isEditingTheme && isEditingTheme !== 'new') {
      const updated = themeList.map((t) =>
        t.id === isEditingTheme
          ? {
              ...t,
              name,
              category,
              description,
              color,
              modality,
              affirmation,
              personalTriggers: parsedTriggers,
            }
          : t
      );
      setThemeList(updated);
      onSaveThemes(updated);
    } else {
      const newTheme: Theme = {
        id: `theme-${Date.now()}`,
        name,
        category,
        description: description || 'Focus area discussed in counseling.',
        color,
        masteryLevel: 1,
        growthPoints: 50,
        modality,
        affirmation,
        personalTriggers: parsedTriggers,
      };
      const updated = [...themeList, newTheme];
      setThemeList(updated);
      onSaveThemes(updated);
      fireCelebration();
    }

    handleCancelForm();
  };

  const handleDeleteTheme = (id: string) => {
    if (window.confirm('Are you sure you want to remove this counseling theme?')) {
      const updated = themeList.filter((t) => t.id !== id);
      setThemeList(updated);
      onSaveThemes(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2D5A43] mb-1">
          <Compass className="w-4 h-4 text-[#A3E635]" />
          <span>Counseling Customization</span>
        </div>
        <h2 className="text-xl font-bold text-[#1E2922] mb-1">
          Themes & Therapeutic Modalities
        </h2>
        <p className="text-xs text-[#607066] mb-5">
          Specify what modalities you leverage (IFS, EMDR, CBT, etc.) and customize your growth pillars.
        </p>

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#EFEAE2] p-1 rounded-2xl mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'themes' ? 'bg-white text-[#1E2922] shadow-xs' : 'text-[#607066]'
            }`}
          >
            Counseling Themes ({themeList.length})
          </button>
          <button
            onClick={() => setActiveTab('modalities')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'modalities' ? 'bg-white text-[#1E2922] shadow-xs' : 'text-[#607066]'
            }`}
          >
            Therapeutic Modalities ({selectedModalities.length} Active)
          </button>
        </div>

        {/* TAB 1: THEMES MANAGER */}
        {activeTab === 'themes' && (
          <div className="space-y-4 text-xs sm:text-sm">
            {isEditingTheme ? (
              /* Add/Edit Form */
              <form onSubmit={handleSaveThemeForm} className="p-4 rounded-2xl bg-white border border-[#EAE3DA] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1E2922]">
                    {isEditingTheme === 'new' ? 'Add New Counseling Theme' : 'Edit Theme'}
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="text-xs text-[#607066] hover:underline"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Theme Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unburdening the People-Pleaser, Life Transition Grief"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029]"
                    >
                      <option value="Relational">Relational</option>
                      <option value="Cognitive">Cognitive</option>
                      <option value="Somatic">Somatic</option>
                      <option value="Parts Work">Parts Work (IFS)</option>
                      <option value="Trauma">Trauma Processing</option>
                      <option value="Emotional">Emotional Regulation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                      Associated Modality
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as TherapyModality)}
                      className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029]"
                    >
                      {ALL_MODALITIES.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Description & Core Focus
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What specific patterns or goals are you exploring around this theme?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Personal Affirmation / Grounding Anchor
                  </label>
                  <input
                    type="text"
                    placeholder='e.g. "I can love someone and still hold my boundary."'
                    value={affirmation}
                    onChange={(e) => setAffirmation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Known Triggers (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Critical emails, Family gatherings, Saying no"
                    value={triggersInput}
                    onChange={(e) => setTriggersInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                    Color Accent
                  </label>
                  <div className="flex space-x-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          color === c ? 'border-[#1E2922] scale-110 shadow-xs' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-3 py-1.5 rounded-xl text-xs text-[#607066] hover:bg-[#EFEAE2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold shadow-xs"
                  >
                    Save Theme
                  </button>
                </div>
              </form>
            ) : (
              /* Theme Cards List */
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#607066]">
                    Active themes used for micro-learning, AI synthesis, and session guides:
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingTheme('new');
                      setName('');
                      setDescription('');
                      setColor(PRESET_COLORS[0]);
                      setAffirmation('');
                      setTriggersInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Theme</span>
                  </button>
                </div>

                {themeList.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-white border border-[#EAE3DA] flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: t.color }}
                        />
                        <h4 className="font-bold text-[#1E2922] text-sm">{t.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#4A574E] border border-[#EAE3DA]">
                          {t.category}
                        </span>
                        {t.modality && (
                          <span className="text-[10px] font-bold text-[#2D5A43] bg-[#EAF2ED] px-2 py-0.5 rounded-md">
                            {t.modality}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#4E5D53]">{t.description}</p>

                      {t.affirmation && (
                        <p className="text-xs text-[#2D5A43] italic font-serif">
                          "{t.affirmation}"
                        </p>
                      )}

                      {t.personalTriggers && t.personalTriggers.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px] text-[#607066]">
                          <span>Triggers:</span>
                          {t.personalTriggers.map((trig, idx) => (
                            <span key={idx} className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EAE3DA]">
                              {trig}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(t)}
                        className="p-1.5 rounded-lg text-[#607066] hover:bg-[#FAF8F5] hover:text-[#1E2922]"
                        title="Edit theme"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTheme(t.id)}
                        className="p-1.5 rounded-lg text-[#607066] hover:bg-rose-50 hover:text-rose-600"
                        title="Delete theme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MODALITIES SELECTION */}
        {activeTab === 'modalities' && (
          <div className="space-y-3 text-xs sm:text-sm">
            <p className="text-xs text-[#607066] mb-2">
              Select the therapy modalities your clinician uses. This provides direct clinical context to Soma and tailors your Next Session Discussion Guide:
            </p>

            <div className="space-y-2.5">
              {ALL_MODALITIES.map((mod) => {
                const isSelected = selectedModalities.includes(mod.name);

                return (
                  <div
                    key={mod.name}
                    onClick={() => handleToggleModality(mod.name)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'bg-[#EAF2ED]/60 border-[#2D5A43] shadow-xs'
                        : 'bg-white border-[#E8E2D9] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="space-y-0.5 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#1E2922] text-sm">{mod.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#607066] border border-[#EAE3DA]">
                          {mod.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#526056]">{mod.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-1 transition ${
                        isSelected ? 'bg-[#2D5A43] text-white' : 'border border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 mt-6 border-t border-[#EAE3DA] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Done Customizing
          </button>
        </div>

      </div>
    </div>
  );
};
