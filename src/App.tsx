import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GrowthGarden } from './components/GrowthGarden';
import { WeeklyFocusCard } from './components/WeeklyFocusCard';
import { MicroLearningCard } from './components/MicroLearningCard';
import { SessionList } from './components/SessionList';
import { SessionDetailModal } from './components/SessionDetailModal';
import { AddSessionModal } from './components/AddSessionModal';
import { ResourceVault } from './components/ResourceVault';
import { AddResourceModal } from './components/AddResourceModal';
import { HomeworkTracker } from './components/HomeworkTracker';
import { JournalCompanion } from './components/JournalCompanion';
import { SessionPrepModal } from './components/SessionPrepModal';
import { NextSessionGuideModal } from './components/NextSessionGuideModal';
import { ThemeGrowthMap } from './components/ThemeGrowthMap';
import { ThemeManagerModal } from './components/ThemeManagerModal';
import { BreatheModal } from './components/BreatheModal';
import { ScheduleModal } from './components/ScheduleModal';

import { 
  Theme, 
  Resource, 
  Homework, 
  MicroLesson, 
  Session, 
  UserGrowthProfile, 
  JournalEntry,
  CounselingSchedule,
  TherapyModality
} from './types/therapy';
import { TherapyStorage } from './utils/storage';
import { fireCelebration, fireLevelUpCelebration } from './utils/confetti';
import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('garden');

  // Core Data State
  const [profile, setProfile] = useState<UserGrowthProfile>(TherapyStorage.getProfile());
  const [themes, setThemes] = useState<Theme[]>(TherapyStorage.getThemes());
  const [resources, setResources] = useState<Resource[]>(TherapyStorage.getResources());
  const [homework, setHomework] = useState<Homework[]>(TherapyStorage.getHomework());
  const [microLessons, setMicroLessons] = useState<MicroLesson[]>(TherapyStorage.getMicroLessons());
  const [sessions, setSessions] = useState<Session[]>(TherapyStorage.getSessions());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(TherapyStorage.getJournalEntries());

  // Modals
  const [isBreatheOpen, setIsBreatheOpen] = useState(false);
  const [isSessionPrepOpen, setIsSessionPrepOpen] = useState(false);
  const [isNextSessionGuideOpen, setIsNextSessionGuideOpen] = useState(false);
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<Session | null>(null);

  // Journaling prompt handover
  const [journalInitialPrompt, setJournalInitialPrompt] = useState<string | undefined>(undefined);

  // Micro-lesson AI generation loading
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  // Save to localStorage when state updates
  useEffect(() => {
    TherapyStorage.setProfile(profile);
  }, [profile]);

  useEffect(() => {
    TherapyStorage.setThemes(themes);
  }, [themes]);

  useEffect(() => {
    TherapyStorage.setResources(resources);
  }, [resources]);

  useEffect(() => {
    TherapyStorage.setHomework(homework);
  }, [homework]);

  useEffect(() => {
    TherapyStorage.setMicroLessons(microLessons);
  }, [microLessons]);

  useEffect(() => {
    TherapyStorage.setSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    TherapyStorage.setJournalEntries(journalEntries);
  }, [journalEntries]);

  // Gamification: XP, Water Droplets, Garden Level Up
  const awardXP = (xp: number, themeId?: string) => {
    setProfile((prev) => {
      const newXP = prev.totalXP + xp;
      const newDroplets = prev.waterDroplets + Math.max(1, Math.floor(xp / 25));
      
      // Calculate level (every 300 XP is a new growth stage, max 5)
      const calculatedLevel = Math.min(5, Math.max(1, Math.floor(newXP / 250) + 1));
      if (calculatedLevel > prev.gardenLevel) {
        fireLevelUpCelebration();
      }

      return {
        ...prev,
        totalXP: newXP,
        waterDroplets: newDroplets,
        gardenLevel: calculatedLevel,
      };
    });

    if (themeId) {
      setThemes((prev) =>
        prev.map((t) =>
          t.id === themeId ? { ...t, growthPoints: t.growthPoints + xp } : t
        )
      );
    }
  };

  // Water Plant Handler
  const handleWaterPlant = () => {
    setProfile((prev) => {
      if (prev.waterDroplets <= 0) return prev;
      const newDroplets = prev.waterDroplets - 1;
      const newXP = prev.totalXP + 20;
      return {
        ...prev,
        waterDroplets: newDroplets,
        totalXP: newXP,
      };
    });
  };

  // Daily Mood Pulse
  const handleCheckInMood = (mood: string, reflection: string) => {
    awardXP(15);
    const newEntry: JournalEntry = {
      id: `mood-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mode: 'Daily Emotional Pulse',
      topic: mood,
      content: reflection || `Felt ${mood} today.`,
      moodTag: mood,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  // Micro-lesson complete
  const handleCompleteLesson = (lessonId: string, xp: number) => {
    setMicroLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? { ...l, completed: true, completedAt: new Date().toISOString() }
          : l
      )
    );
    const lesson = microLessons.find((l) => l.id === lessonId);
    awardXP(xp, lesson?.relatedThemeId);
  };

  // Generate on-demand micro-lesson via Gemini
  const handleGenerateNewLesson = async (themeName: string) => {
    setIsGeneratingLesson(true);
    try {
      const response = await fetch('/api/generate/micro-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: themeName,
          clientNeeds: 'Between-session growth and cognitive reframing',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson from server');
      }

      const data = await response.json();
      const matchedTheme = themes.find((t) => t.name.toLowerCase().includes(themeName.toLowerCase())) || themes[0];

      const newLesson: MicroLesson = {
        id: `ml-ai-${Date.now()}`,
        title: data.title || `${themeName} Micro-Practice`,
        concept: data.concept || 'Focus on nervous system safety and cognitive flexibility.',
        practicalApplication: data.practicalApplication || 'Take 3 conscious breaths when triggered.',
        reflectionPrompt: data.reflectionPrompt || 'How does this apply to your day?',
        quiz: data.quiz,
        relatedThemeId: matchedTheme.id,
        completed: false,
        xpReward: 45,
      };

      setMicroLessons((prev) => [newLesson, ...prev]);
      fireCelebration();
    } catch (err) {
      console.error('Error generating micro lesson:', err);
      // Fallback lesson
      const newLesson: MicroLesson = {
        id: `ml-fb-${Date.now()}`,
        title: 'The Power of the Compassionate Pause',
        concept: 'When triggered, your amygdala acts in 20 milliseconds. Taking a 5-second pause gives your prefrontal cortex time to come back online so you can choose a conscious response.',
        practicalApplication: 'Before replying to a tense text or email, place your feet flat on the floor and count 5 slow breaths.',
        reflectionPrompt: 'Where did you notice an automatic reaction that could have benefited from a 5-second pause?',
        quiz: {
          question: 'What is the primary benefit of taking a 5-second pause during a trigger?',
          options: [
            'It guarantees the other person will apologize immediately.',
            'It allows your conscious prefrontal cortex to re-engage over automatic survival reflexes.',
            'It suppresses your feelings permanently so you never feel angry.',
            'It proves you are smarter than everyone else.'
          ],
          correctIndex: 1,
          explanation: 'The biological pause allows blood flow and neural activity to return to higher-order reasoning centers.'
        },
        relatedThemeId: themes[0].id,
        completed: false,
        xpReward: 45,
      };
      setMicroLessons((prev) => [newLesson, ...prev]);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  // Complete Homework
  const handleCompleteHomework = (
    homeworkId: string,
    reflectionNotes: string,
    difficultyRating: number,
    xpReward: number
  ) => {
    setHomework((prev) =>
      prev.map((h) =>
        h.id === homeworkId
          ? {
              ...h,
              status: 'completed',
              reflectionNotes,
              difficultyRating,
              completedAt: new Date().toISOString(),
            }
          : h
      )
    );
    const hw = homework.find((h) => h.id === homeworkId);
    awardXP(xpReward, hw?.relatedThemeId);
  };

  // Toggle Resource Complete
  const handleToggleResourceComplete = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const nextState = !r.completed;
          if (nextState) {
            awardXP(30, r.relatedThemeId);
          }
          return { ...r, completed: nextState };
        }
        return r;
      })
    );
  };

  // Handover prompt from Resource to Journaling agent
  const handleStartJournalFromPrompt = (promptText: string) => {
    setJournalInitialPrompt(promptText);
    setActiveTab('journal');
  };

  // Save new session + auto-synthesized lessons/homework
  const handleSaveSession = (newSession: Session, newLessons: MicroLesson[], newHw: Homework[]) => {
    setSessions((prev) => [newSession, ...prev]);
    if (newLessons.length > 0) {
      setMicroLessons((prev) => [...newLessons, ...prev]);
    }
    if (newHw.length > 0) {
      setHomework((prev) => [...newHw, ...prev]);
    }
    awardXP(80);
    fireCelebration();
  };

  // Save new resource
  const handleSaveResource = (newResource: Resource) => {
    setResources((prev) => [newResource, ...prev]);
    awardXP(35, newResource.relatedThemeId);
  };

  // Save journal entry from companion
  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev]);
    awardXP(20);
  };

  // Save counseling schedule
  const handleSaveSchedule = (schedule: CounselingSchedule, nextDate: string) => {
    setProfile((prev) => ({
      ...prev,
      schedule,
      nextSessionDate: nextDate,
    }));
    awardXP(25);
  };

  // Custom themes & modalities handlers
  const handleSaveThemes = (updatedThemes: Theme[]) => {
    setThemes(updatedThemes);
    TherapyStorage.setThemes(updatedThemes);
  };

  const handleSaveModalities = (modalities: TherapyModality[]) => {
    setProfile((prev) => {
      const next = { ...prev, activeModalities: modalities };
      TherapyStorage.setProfile(next);
      return next;
    });
  };

  // Find daily active micro-lesson for the Sanctuary dashboard
  const activeDailyLesson = microLessons.find((l) => !l.completed) || microLessons[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#243029] flex flex-col font-sans selection:bg-[#D1E5D8] selection:text-[#1E2922]">
      
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenBreathe={() => setIsBreatheOpen(true)}
        onOpenSessionPrep={() => setIsSessionPrepOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenNextSessionGuide={() => setIsNextSessionGuideOpen(true)}
        onOpenThemeManager={() => setIsThemeManagerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: GROWTH SANCTUARY (DASHBOARD + DAILY MICRO-LEARNING) */}
        {activeTab === 'garden' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Sanctuary Garden & Emotional Pulse */}
            <GrowthGarden
              profile={profile}
              themes={themes}
              activeHomework={homework}
              onWaterPlant={handleWaterPlant}
              onCheckInMood={handleCheckInMood}
              onOpenBreathe={() => setIsBreatheOpen(true)}
              onOpenSchedule={() => setIsScheduleOpen(true)}
            />

            {/* This week's focus, based on the latest session */}
            <WeeklyFocusCard
              sessions={sessions}
              themes={themes}
              counselorName={profile.counselorName}
              pendingHomeworkCount={homework.filter((h) => h.status !== 'completed').length}
              pendingResourceCount={resources.filter((r) => !r.completed).length}
            />

            {/* Daily Micro-Learning Seed (Interactive 2-Min Lesson & Quiz) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#2D5A43]" />
                    <h3 className="text-lg sm:text-xl font-bold text-[#1E2922]">
                      Today's Between-Session Micro-Learning Seed
                    </h3>
                  </div>
                  <p className="text-xs text-[#607066]">
                    Synthesized from your therapy sessions & assigned resources to practice in everyday life
                  </p>
                </div>
              </div>

              {activeDailyLesson ? (
                <MicroLearningCard
                  lesson={activeDailyLesson}
                  themes={themes}
                  onCompleteLesson={handleCompleteLesson}
                  onGenerateNewLesson={handleGenerateNewLesson}
                  isGenerating={isGeneratingLesson}
                />
              ) : (
                <div className="bg-white p-6 rounded-3xl border border-[#E8E2D9] text-center">
                  <p className="text-sm text-[#607066]">All current micro-lessons completed!</p>
                  <button
                    onClick={() => handleGenerateNewLesson('Boundaries & Growth')}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234734] cursor-pointer"
                  >
                    Generate Fresh Micro-Lesson
                  </button>
                </div>
              )}
            </div>

            {/* Quick Homework Radar Banner */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A43] block mb-0.5">
                  Between-Session Homework Experiments
                </span>
                <h4 className="text-base font-bold text-[#1E2922]">
                  {homework.filter((h) => h.status !== 'completed').length} Experiments Awaiting Real-World Practice
                </h4>
                <p className="text-xs text-[#607066]">
                  Complete small behavioral tests to water your garden and build empirical confidence.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('homework')}
                className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <span>View Homework Experiments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: SESSIONS & THEMES */}
        {activeTab === 'sessions' && (
          <div className="animate-fadeIn">
            <SessionList
              sessions={sessions}
              resources={resources}
              homework={homework}
              onOpenAddSession={() => setIsAddSessionOpen(true)}
              onSelectSession={(s) => setSelectedSessionForDetail(s)}
              onOpenSessionPrep={() => setIsSessionPrepOpen(true)}
            />
          </div>
        )}

        {/* TAB 3: RESOURCE VAULT */}
        {activeTab === 'resources' && (
          <div className="animate-fadeIn">
            <ResourceVault
              resources={resources}
              themes={themes}
              onOpenAddResource={() => setIsAddResourceOpen(true)}
              onToggleComplete={handleToggleResourceComplete}
              onStartJournalFromPrompt={handleStartJournalFromPrompt}
            />
          </div>
        )}

        {/* TAB 4: HOMEWORK & BEHAVIORAL EXPERIMENTS */}
        {activeTab === 'homework' && (
          <div className="animate-fadeIn">
            <HomeworkTracker
              homeworkList={homework}
              themes={themes}
              onCompleteHomework={handleCompleteHomework}
              onAddHomework={(hw) => {
                setHomework((prev) => [hw, ...prev]);
                awardXP(15, hw.relatedThemeId);
              }}
            />
          </div>
        )}

        {/* TAB 5: GUIDED JOURNALING AGENT (SOMA) */}
        {activeTab === 'journal' && (
          <div className="animate-fadeIn">
            <JournalCompanion
              themes={themes}
              recentSessions={sessions}
              activeHomework={homework}
              onSaveJournalEntry={handleSaveJournalEntry}
              initialPrompt={journalInitialPrompt}
              activeModalities={profile.activeModalities || ['IFS', 'Somatic Experiencing', 'CBT']}
            />
          </div>
        )}

        {/* TAB 6: THEMES & GROWTH MAP */}
        {activeTab === 'themes' && (
          <div className="animate-fadeIn">
            <ThemeGrowthMap
              themes={themes}
              onGenerateMicroLessonForTheme={(t) => {
                handleGenerateNewLesson(t.name);
                setActiveTab('garden');
              }}
              onOpenThemeManager={() => setIsThemeManagerOpen(true)}
              isGenerating={isGeneratingLesson}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#EAE3DA] py-6 text-center text-xs text-[#8C9B90]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TheraBloom — Cultivating healing, resilience, and mindful integration between counseling sessions.</span>
          <span className="text-[11px] text-[#A6B5AA]">Grounded in IFS, EMDR, CBT, DBT, ACT, and Somatic Experiencing.</span>
        </div>
      </footer>

      {/* Modals */}
      <BreatheModal
        isOpen={isBreatheOpen}
        onClose={() => setIsBreatheOpen(false)}
        onCompleteExercise={(xp) => awardXP(xp, 'theme-somatics')}
      />

      <SessionPrepModal
        isOpen={isSessionPrepOpen}
        onClose={() => setIsSessionPrepOpen(false)}
        recentSessions={sessions}
        homework={homework}
        themes={themes}
        journalEntries={journalEntries}
      />

      <NextSessionGuideModal
        isOpen={isNextSessionGuideOpen}
        onClose={() => setIsNextSessionGuideOpen(false)}
        recentSessions={sessions}
        homework={homework}
        themes={themes}
        journalEntries={journalEntries}
        activeModalities={profile.activeModalities || ['IFS', 'CBT', 'Somatic Experiencing']}
        nextSessionDate={profile.nextSessionDate}
        counselorName={profile.counselorName}
      />

      <ThemeManagerModal
        isOpen={isThemeManagerOpen}
        onClose={() => setIsThemeManagerOpen(false)}
        themes={themes}
        activeModalities={profile.activeModalities || ['IFS', 'CBT', 'Somatic Experiencing']}
        onSaveThemes={handleSaveThemes}
        onSaveModalities={handleSaveModalities}
      />

      <AddSessionModal
        isOpen={isAddSessionOpen}
        onClose={() => setIsAddSessionOpen(false)}
        nextSessionNumber={sessions.length + 1}
        counselorName={profile.counselorName}
        onSaveSession={handleSaveSession}
      />

      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        themes={themes}
        onSaveResource={handleSaveResource}
      />

      <SessionDetailModal
        session={selectedSessionForDetail}
        allResources={resources}
        allHomework={homework}
        onClose={() => setSelectedSessionForDetail(null)}
        onOpenResource={(res) => {
          setSelectedSessionForDetail(null);
          setActiveTab('resources');
        }}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        profile={profile}
        onSaveSchedule={handleSaveSchedule}
      />

    </div>
  );
}
