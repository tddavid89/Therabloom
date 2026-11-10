import React from 'react';
import { 
  Sprout, 
  Flame, 
  HeartHandshake, 
  BookOpen, 
  CheckSquare, 
  MessageSquareHeart, 
  Compass, 
  Wind,
  Calendar,
  Sparkles,
  ClipboardList,
  SlidersHorizontal
} from 'lucide-react';
import { UserGrowthProfile } from '../types/therapy';
import { AmbientSoundscapes } from './AmbientSoundscapes';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserGrowthProfile;
  onOpenBreathe: () => void;
  onOpenSessionPrep: () => void;
  onOpenSchedule: () => void;
  onOpenNextSessionGuide: () => void;
  onOpenThemeManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenBreathe,
  onOpenSessionPrep,
  onOpenSchedule,
  onOpenNextSessionGuide,
  onOpenThemeManager,
}) => {
  // Calculate days until next session
  const getDaysUntilSession = () => {
    if (!profile.nextSessionDate) return null;
    const today = new Date();
    const next = new Date(profile.nextSessionDate);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilSession();

  const navItems = [
    { id: 'garden', label: 'Growth Sanctuary', icon: Sprout },
    { id: 'sessions', label: 'Sessions & Notes', icon: HeartHandshake },
    { id: 'resources', label: 'Resource Vault', icon: BookOpen },
    { id: 'homework', label: 'Homework & Experiments', icon: CheckSquare },
    { id: 'journal', label: 'Journaling Agent (Soma)', icon: MessageSquareHeart },
    { id: 'themes', label: 'Growth Map', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9]">
      {/* Top Banner with Stats & Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white shadow-sm ring-4 ring-[#2D5A43]/10">
              <Sprout className="w-6 h-6 animate-gentle-float text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-[#1E2922]">TheraBloom</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] font-medium border border-[#D1E5D8]">
                  Between-Session Companion
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#607066]">
                <span>Counseling with {profile.counselorName}</span>
                {profile.activeModalities && profile.activeModalities.length > 0 && (
                  <>
                    <span>•</span>
                    <button
                      onClick={onOpenThemeManager}
                      className="text-[#2D5A43] hover:underline font-semibold flex items-center space-x-0.5 cursor-pointer"
                      title="Manage clinical modalities (IFS, EMDR, CBT, etc.)"
                    >
                      <span>{profile.activeModalities.slice(0, 3).join('/')}{profile.activeModalities.length > 3 ? ` +${profile.activeModalities.length - 3}` : ''}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            
            {/* Ambient Audio Player */}
            <AmbientSoundscapes />

            {/* Next Session Countdown (Clickable) */}
            <button
              onClick={onOpenSchedule}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#F3EFEA] hover:bg-[#EAE3DA] border border-[#E4DDD3] text-xs text-[#4A574E] transition cursor-pointer"
              title="Click to input or update your counseling schedule"
            >
              <Calendar className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>
                {daysUntil !== null ? (
                  <>
                    Next Session: <strong className="text-[#1E2922]">{daysUntil > 0 ? `in ${daysUntil}d` : 'Today'}</strong>
                  </>
                ) : (
                  <>Set Schedule</>
                )}
              </span>
              <span className="text-[10px] text-[#2D5A43] font-semibold underline ml-0.5">Edit</span>
            </button>

            {/* Streak Counter */}
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] font-medium">
              <Flame className="w-3.5 h-3.5 text-[#D97706] animate-pulse" />
              <span>{profile.currentStreak}d</span>
            </div>

            {/* XP & Garden Level */}
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#EAF2ED] border border-[#D1E5D8] text-xs text-[#2D5A43] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>{profile.totalXP} XP</span>
            </div>

            {/* Somatic Breath Button */}
            <button
              onClick={onOpenBreathe}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#2D5A43] hover:text-[#2D5A43] text-xs text-[#334155] font-medium transition shadow-xs cursor-pointer"
              title="Take a 1-minute somatic grounding breath"
            >
              <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden sm:inline">Somatic Pause</span>
            </button>

            {/* Theme & Modality Customizer Button */}
            <button
              onClick={onOpenThemeManager}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#2D5A43] hover:text-[#2D5A43] text-xs text-[#334155] font-medium transition shadow-xs cursor-pointer"
              title="Customize counseling themes and modalities (IFS, EMDR, CBT, DBT, etc.)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#607066]" />
              <span className="hidden sm:inline">Modalities</span>
            </button>

            {/* Dynamic Next Session Guide Button */}
            <button
              onClick={onOpenNextSessionGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
              title="Generate a guide to decide on what to discuss in your next session"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Session Guide</span>
            </button>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 mt-2 pt-2 border-t border-[#EAE3DA] overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#2D5A43] text-white shadow-xs'
                    : 'text-[#4A574E] hover:text-[#1E2922] hover:bg-[#EFEAE2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#607066]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
