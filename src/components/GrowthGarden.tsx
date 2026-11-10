import React, { useState } from 'react';
import { 
  Sprout, 
  Droplets, 
  Award, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  Wind,
  CheckCircle,
  Clock
} from 'lucide-react';
import { UserGrowthProfile, Theme, Homework } from '../types/therapy';
import { fireCelebration, fireLevelUpCelebration } from '../utils/confetti';

interface GrowthGardenProps {
  profile: UserGrowthProfile;
  themes: Theme[];
  activeHomework: Homework[];
  onWaterPlant: () => void;
  onCheckInMood: (mood: string, reflection: string) => void;
  onOpenBreathe: () => void;
  onOpenSchedule?: () => void;
}

export const GrowthGarden: React.FC<GrowthGardenProps> = ({
  profile,
  themes,
  activeHomework,
  onWaterPlant,
  onCheckInMood,
  onOpenBreathe,
  onOpenSchedule,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showMoodDone, setShowMoodDone] = useState(false);
  const [isWatering, setIsWatering] = useState(false);

  // Garden stage labels and visuals
  const gardenStages = [
    { level: 1, name: 'Tender Sprout', desc: 'First seeds of emotional insight planted.' },
    { level: 2, name: 'Rooted Seedling', desc: 'Practicing between-session tools consistently.' },
    { level: 3, name: 'Flourishing Sapling', desc: 'Tolerating boundary guilt & noticing somatic cues.' },
    { level: 4, name: 'Blooming Grove', desc: 'Inner critic transformed into compassionate ally.' },
    { level: 5, name: 'Sanctuary Bodhi Tree', desc: 'Embodied wisdom and nervous system safety.' },
  ];

  const currentStage = gardenStages[profile.gardenLevel - 1] || gardenStages[2];

  const handleWaterClick = () => {
    if (profile.waterDroplets <= 0) return;
    setIsWatering(true);
    fireCelebration();
    onWaterPlant();
    setTimeout(() => {
      setIsWatering(false);
    }, 1500);
  };

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;
    onCheckInMood(selectedMood, moodNote);
    setShowMoodDone(true);
    fireCelebration();
    setTimeout(() => {
      setShowMoodDone(false);
      setSelectedMood(null);
      setMoodNote('');
    }, 3000);
  };

  // Compute total active homework
  const pendingHw = activeHomework.filter((h) => h.status !== 'completed');

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Sanctuary Hero Banner */}
      <div className="bg-gradient-to-br from-[#2D5A43] via-[#3B6E53] to-[#254C37] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        
        {/* Subtle decorative background foliage */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-[#A3E635] text-xs font-semibold uppercase tracking-wider backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Between-Session Sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Welcome back, {profile.name}
            </h2>
            <p className="text-sm text-stone-200 leading-relaxed">
              Therapy is where insights are born, but everyday life is where transformation happens. Every micro-action, boundary defended, and breath taken waters your inner growth.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
              <button
                onClick={onOpenSchedule}
                className="flex items-center space-x-1.5 bg-black/25 hover:bg-black/35 px-3 py-1.5 rounded-xl border border-white/15 transition cursor-pointer text-left"
                title="Click to view and edit your counseling schedule"
              >
                <Clock className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>Next session: <strong>{profile.nextSessionDate || 'Upcoming'}</strong></span>
                <span className="text-[10px] text-[#A3E635] underline ml-1">Edit</span>
              </button>
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>{pendingHw.length} Active Homework Experiments</span>
              </div>
            </div>
          </div>

          {/* Interactive Digital Plant / Tree Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center sm:min-w-[220px]">
            
            {/* Visual Plant Graphic */}
            <div className="relative w-24 h-24 flex items-center justify-center my-1">
              <div className={`transition-transform duration-700 ${isWatering ? 'scale-110 animate-bounce' : 'animate-gentle-float'}`}>
                {profile.gardenLevel === 1 && <span className="text-5xl">🌱</span>}
                {profile.gardenLevel === 2 && <span className="text-6xl">🌿</span>}
                {profile.gardenLevel === 3 && <span className="text-7xl">🪴</span>}
                {profile.gardenLevel === 4 && <span className="text-7xl">🌳</span>}
                {profile.gardenLevel >= 5 && <span className="text-8xl">🏡</span>}
              </div>
              {isWatering && (
                <div className="absolute top-0 text-sky-300 text-2xl animate-ping">
                  💧
                </div>
              )}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#A3E635]">
              Stage {profile.gardenLevel}: {currentStage.name}
            </span>
            <p className="text-[11px] text-stone-300 mt-1 max-w-[190px]">
              {currentStage.desc}
            </p>

            {/* Water Plant Button */}
            <button
              onClick={handleWaterClick}
              disabled={profile.waterDroplets <= 0 || isWatering}
              className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                profile.waterDroplets > 0
                  ? 'bg-[#A3E635] text-[#1E2922] hover:bg-[#bef264] shadow-xs'
                  : 'bg-white/10 text-stone-300 cursor-not-allowed opacity-60'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-sky-800" />
              <span>Water Tree ({profile.waterDroplets} available)</span>
            </button>
            <span className="text-[10px] text-stone-300 mt-1">
              Earn water droplets from micro-lessons & homework
            </span>
          </div>

        </div>
      </div>

      {/* Grid: Quick Mood Check-In & Badges / Themes Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Today's Somatic & Emotional Check-in */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-[#1E2922] text-sm sm:text-base">
                  Daily Emotional & Somatic Pulse
                </h3>
              </div>
              <button
                onClick={onOpenBreathe}
                className="text-[11px] text-[#2D5A43] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Wind className="w-3 h-3 text-[#38BDF8]" />
                <span>Need a breath?</span>
              </button>
            </div>
            <p className="text-xs text-[#607066] mb-4">
              How is your nervous system feeling in this moment?
            </p>

            {showMoodDone ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs text-center border border-emerald-200 animate-fadeIn">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <strong className="block mb-0.5">Check-in Recorded (+15 XP)</strong>
                Thank you for honoring what is alive in you today.
              </div>
            ) : (
              <form onSubmit={handleMoodSubmit} className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Grounded', emoji: '🌿', color: 'hover:bg-emerald-50 hover:border-emerald-300' },
                    { label: 'Activated', emoji: '⚡', color: 'hover:bg-amber-50 hover:border-amber-300' },
                    { label: 'Overwhelmed', emoji: '🌊', color: 'hover:bg-rose-50 hover:border-rose-300' },
                    { label: 'Depleted', emoji: '🍂', color: 'hover:bg-stone-100 hover:border-stone-300' },
                  ].map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setSelectedMood(m.label)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center ${
                        selectedMood === m.label
                          ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                          : `bg-[#FAF8F5] border-[#E8E2D9] text-[#243029] ${m.color}`
                      }`}
                    >
                      <span className="text-lg mb-1">{m.emoji}</span>
                      <span className="text-[11px] font-medium leading-none">{m.label}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="One word or note on what is triggering or nourishing you..."
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FAF8F5] text-[#243029] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20"
                />

                <button
                  type="submit"
                  disabled={!selectedMood}
                  className="w-full py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] disabled:opacity-40 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Log Emotional Pulse (+15 XP)
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Card 2: Active Counseling Themes Mastery */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#1E2922] text-sm sm:text-base">
                Between-Session Pillars & Mastery
              </h3>
              <p className="text-xs text-[#607066]">
                Tracking your real-world integration of core counseling themes
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#2D5A43] font-semibold bg-[#EAF2ED] px-2.5 py-1 rounded-full">
              <Award className="w-3.5 h-3.5" />
              <span>Level {profile.gardenLevel} Mastery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => {
              const progressPct = Math.min(100, Math.round((theme.growthPoints % 200) / 2));
              return (
                <div
                  key={theme.id}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white inline-block mb-1"
                        style={{ backgroundColor: theme.color }}
                      >
                        {theme.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#1E2922] line-clamp-1">
                        {theme.name}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#2D5A43]">
                      Lvl {theme.masteryLevel}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#607066] line-clamp-2 mb-2">
                    {theme.description}
                  </p>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#526056] font-medium mb-1">
                      <span>Integration Progress</span>
                      <span>{theme.growthPoints} pts</span>
                    </div>
                    <div className="w-full bg-[#E5DFD5] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPct || 50}%`,
                          backgroundColor: theme.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Badges / Milestones Carousel */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-[#1E2922] text-sm sm:text-base">
              Milestone Badges & Emotional Breakthroughs
            </h3>
          </div>
          <span className="text-xs text-[#607066]">
            {profile.badges.filter((b) => b.unlockedAt).length} of {profile.badges.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {profile.badges.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border text-center transition ${
                  isUnlocked
                    ? 'bg-[#FDFBF7] border-amber-200 text-[#1E2922] shadow-xs'
                    : 'bg-[#FAF8F5]/60 border-[#E8E2D9] opacity-40 grayscale'
                }`}
                title={badge.description}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <h4 className="text-xs font-bold line-clamp-1">{badge.name}</h4>
                <p className="text-[10px] text-[#607066] line-clamp-2 mt-0.5">
                  {badge.description}
                </p>
                {isUnlocked && (
                  <span className="inline-block mt-1 text-[9px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
