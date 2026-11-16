import { 
  Theme, 
  Resource, 
  Homework, 
  MicroLesson, 
  Session, 
  UserGrowthProfile, 
  JournalEntry 
} from '../types/therapy';
import { 
  INITIAL_THEMES, 
  INITIAL_RESOURCES, 
  INITIAL_HOMEWORK, 
  INITIAL_MICRO_LESSONS, 
  INITIAL_SESSIONS, 
  INITIAL_USER_PROFILE, 
  INITIAL_JOURNAL_ENTRIES 
} from '../data/initialData';

const STORAGE_KEYS = {
  THEMES: 'therabloom_themes_v1',
  RESOURCES: 'therabloom_resources_v1',
  HOMEWORK: 'therabloom_homework_v1',
  MICRO_LESSONS: 'therabloom_microlessons_v1',
  SESSIONS: 'therabloom_sessions_v1',
  USER_PROFILE: 'therabloom_profile_v1',
  JOURNAL_ENTRIES: 'therabloom_journal_v1',
};

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to load key ${key} from localStorage:`, e);
    return defaultValue;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save key ${key} to localStorage:`, e);
  }
}

export const TherapyStorage = {
  getThemes: (): Theme[] => loadData(STORAGE_KEYS.THEMES, INITIAL_THEMES),
  setThemes: (themes: Theme[]) => saveData(STORAGE_KEYS.THEMES, themes),

  getResources: (): Resource[] => loadData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES),
  setResources: (resources: Resource[]) => saveData(STORAGE_KEYS.RESOURCES, resources),

  getHomework: (): Homework[] => loadData(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK),
  setHomework: (hw: Homework[]) => saveData(STORAGE_KEYS.HOMEWORK, hw),

  getMicroLessons: (): MicroLesson[] => loadData(STORAGE_KEYS.MICRO_LESSONS, INITIAL_MICRO_LESSONS),
  setMicroLessons: (lessons: MicroLesson[]) => saveData(STORAGE_KEYS.MICRO_LESSONS, lessons),

  getSessions: (): Session[] => loadData(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS),
  setSessions: (sessions: Session[]) => saveData(STORAGE_KEYS.SESSIONS, sessions),

  getProfile: (): UserGrowthProfile => loadData(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE),
  setProfile: (profile: UserGrowthProfile) => saveData(STORAGE_KEYS.USER_PROFILE, profile),

  getJournalEntries: (): JournalEntry[] => loadData(STORAGE_KEYS.JOURNAL_ENTRIES, INITIAL_JOURNAL_ENTRIES),
  setJournalEntries: (entries: JournalEntry[]) => saveData(STORAGE_KEYS.JOURNAL_ENTRIES, entries),

  resetToDefaults: () => {
    saveData(STORAGE_KEYS.THEMES, INITIAL_THEMES);
    saveData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    saveData(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
    saveData(STORAGE_KEYS.MICRO_LESSONS, INITIAL_MICRO_LESSONS);
    saveData(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    saveData(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
    saveData(STORAGE_KEYS.JOURNAL_ENTRIES, INITIAL_JOURNAL_ENTRIES);
  }
};
