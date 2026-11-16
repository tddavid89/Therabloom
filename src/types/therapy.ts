export type ResourceType = 'youtube' | 'book' | 'social_post' | 'article' | 'podcast';

export type HomeworkCategory = 
  | 'Behavioral Experiment' 
  | 'Somatic Practice' 
  | 'Cognitive Reframe' 
  | 'Media / Reading' 
  | 'Journaling';

export type HomeworkStatus = 'pending' | 'in_progress' | 'completed';

export type TherapyModality = 
  | 'IFS' 
  | 'EMDR' 
  | 'CBT' 
  | 'DBT' 
  | 'ACT' 
  | 'Somatic Experiencing' 
  | 'Psychodynamic' 
  | 'Attachment-Based' 
  | 'Mindfulness-Based';

export type AmbientSoundType = 'rain' | 'bowls' | 'stream' | 'waves' | 'forest' | 'silence';

export interface Theme {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  masteryLevel: number; // 1 to 5
  growthPoints: number;
  modality?: TherapyModality;
  affirmation?: string;
  personalTriggers?: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  authorOrCreator?: string;
  notes?: string;
  distilledTakeaways: string[];
  coreQuoteOrInsight?: string;
  microAction?: string;
  journalPrompt?: string;
  relatedThemeId: string;
  completed: boolean;
  isAssignedByTherapist: boolean;
  estimatedTimeMinutes?: number;
  assignedDate: string;
  platformBadge?: string; // e.g. "YouTube", "Instagram Carousel", "Book Chapter"
  audioSummaryUrl?: string;
}

export interface Homework {
  id: string;
  title: string;
  category: HomeworkCategory;
  description: string;
  suggestedFrequency: string;
  relatedThemeId: string;
  status: HomeworkStatus;
  reflectionNotes?: string;
  difficultyRating?: number; // 1 to 5
  completedAt?: string;
  xpReward: number;
  linkedResourceId?: string;
  sessionId?: string;
  modalityTag?: TherapyModality;
}

export interface MicroLessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MicroLesson {
  id: string;
  title: string;
  concept: string;
  practicalApplication: string;
  reflectionPrompt: string;
  quiz?: MicroLessonQuiz;
  relatedThemeId: string;
  completed: boolean;
  xpReward: number;
  completedAt?: string;
  userAnswerIndex?: number;
  modalityTag?: TherapyModality;
}

export interface Session {
  id: string;
  sessionNumber: number;
  date: string;
  counselorName: string;
  focusTheme: string;
  rawNotes: string;
  summary?: string;
  keyInsights: string[];
  emotionBefore: string;
  emotionAfter: string;
  homeworkIds: string[];
  resourceIds: string[];
  themes: string[];
  modalities?: TherapyModality[];
  targetPartsOrTriggers?: string;
  counselorAdvice?: string;
  createdAt: string;
}

export interface JournalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  extractedInsight?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mode: string;
  topic: string;
  content: string;
  aiFeedback?: string;
  moodTag: string;
  keyTakeaway?: string;
  modalityContext?: TherapyModality[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  category: 'streak' | 'homework' | 'learning' | 'reflection';
}

export interface CounselingSchedule {
  nextSessionDate: string; // YYYY-MM-DD
  nextSessionTime: string; // HH:MM
  cadence: 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
  appointmentType: 'telehealth' | 'in_person' | 'phone';
  telehealthUrl?: string;
  clinicAddress?: string;
  reminderEnabled: boolean;
  dailyMicroLearningReminderTime?: string;
  notes?: string;
}

export interface UserGrowthProfile {
  name: string;
  counselorName: string;
  nextSessionDate: string;
  lastSessionDate: string;
  currentStreak: number;
  totalXP: number;
  gardenLevel: number;
  waterDroplets: number;
  badges: Badge[];
  schedule?: CounselingSchedule;
  activeModalities: TherapyModality[];
}

export interface NextSessionAgendaItem {
  id: string;
  topic: string;
  priority: 'High' | 'Medium' | 'Exploratory';
  context: string;
  triggerEvent?: string;
  relatedModality?: TherapyModality;
  isDiscussed?: boolean;
}

export interface NextSessionGuide {
  id: string;
  targetSessionDate: string;
  sessionTitle?: string;
  primaryIntention: string;
  prioritizedAgenda: NextSessionAgendaItem[];
  weekTriggersAndEmotions: { trigger: string; emotion: string; somaticSensation?: string }[];
  homeworkDebriefNotes: string;
  modalityCheckins: { modality: TherapyModality; notes: string }[];
  winsToCelebrate: string[];
  questionsForTherapist: string[];
  generatedAt: string;
}

export interface SessionPrepReport {
  headline: string;
  celebrationsAndWins: string[];
  homeworkDebrief: string;
  stickingPointsAndTriggers: string[];
  proposedAgendaQuestions: string[];
  somaticAndMoodTrend: string;
  generatedAt: string;
}

export interface WeeklyFocusResource {
  title: string;
  author?: string;
  why: string;
  fromCounselor: boolean;
}

export interface WeeklyFocus {
  sessionId: string;
  summary: string;
  focusAreas: { title: string; why: string }[];
  practices: string[];
  journalPrompts: string[];
  affirmations: string[];
  resources: WeeklyFocusResource[];
  source: 'curated' | 'ai' | 'auto';
}
