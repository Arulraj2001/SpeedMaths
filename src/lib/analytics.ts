"use client";

export interface SessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  topic: string;
  difficulty: string;
  correct: number;
  wrong: number;
  xpEarned: number;
  avgSpeed: number; // seconds per question
  duration: number; // total session seconds
  maxStreak: number;
}

export interface UserStats {
  totalXp: number;
  totalPracticeTime: number; // total seconds
  longestStreak: number;
  currentStreak: number;
  lastPracticeDate: string; // YYYY-MM-DD
  sessionRecords: SessionRecord[];
  unlockedBadges: string[];
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first-step",
    title: "First Step",
    description: "Completed your first calculation training workout.",
    icon: "🎯",
    criteria: "Complete 1 session"
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Achieved an average response speed under 1.5 seconds with high accuracy.",
    icon: "⚡",
    criteria: "Speed < 1.5s & Accuracy >= 80%"
  },
  {
    id: "perfect-recall",
    title: "Perfect Recall",
    description: "Scored a flawless 100% accuracy in a workout session of 10 or more questions.",
    icon: "💯",
    criteria: "100% accuracy on 10+ Qs"
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Completed a marathon workout session of 100 questions in a single round.",
    icon: "🏛️",
    criteria: "Complete 100 Qs session"
  },
  {
    id: "streak-starter",
    title: "Streak Starter",
    description: "Achieved a consecutive streak of 10 or more correct answers in a workout.",
    icon: "🔥",
    criteria: "Streak of 10+"
  },
  {
    id: "math-wizard",
    title: "Math Wizard",
    description: "Accumulated a total experience rating of 1,000 XP or more.",
    icon: "🧙‍♂️",
    criteria: "Reach 1,000+ total XP"
  },
  {
    id: "consistency-hero",
    title: "Consistency Hero",
    description: "Practiced speed math workouts on 3 consecutive calendar days.",
    icon: "📅",
    criteria: "Practice 3 days in a row"
  },
  {
    id: "grandmaster",
    title: "Grandmaster",
    description: "Unlocked Level 10 or higher through dedicated practice metrics.",
    icon: "👑",
    criteria: "Unlock Level 10"
  }
];

const LOCAL_STORAGE_KEY = "speedmaths-user-analytics";

const getEmptyStats = (): UserStats => ({
  totalXp: 0,
  totalPracticeTime: 0,
  longestStreak: 0,
  currentStreak: 0,
  lastPracticeDate: "",
  sessionRecords: [],
  unlockedBadges: []
});

export const loadUserStats = (): UserStats => {
  if (typeof window === "undefined") return getEmptyStats();
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) return getEmptyStats();
  try {
    return JSON.parse(saved);
  } catch {
    return getEmptyStats();
  }
};

export const saveUserStats = (stats: UserStats) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
};

// Calculate user level based on XP: Level = floor(totalXp / 200) + 1
export const calculateUserLevel = (totalXp: number) => {
  const xpPerLevel = 200;
  const level = Math.floor(totalXp / xpPerLevel) + 1;
  const currentLevelXp = totalXp % xpPerLevel;
  const nextLevelXp = xpPerLevel;
  const percentToNext = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));
  return { level, currentLevelXp, nextLevelXp, percentToNext };
};

// Checks and updates streaks across unique days
const updatePracticeStreaks = (stats: UserStats, todayStr: string) => {
  if (stats.lastPracticeDate === todayStr) return; // Already counted today
  
  if (!stats.lastPracticeDate) {
    stats.currentStreak = 1;
  } else {
    const lastDate = new Date(stats.lastPracticeDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      stats.currentStreak += 1;
    } else if (diffDays > 1) {
      stats.currentStreak = 1;
    }
  }

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }
  stats.lastPracticeDate = todayStr;
};

// Evaluates badges unlocked
const checkNewBadges = (stats: UserStats, newRecord: SessionRecord): string[] => {
  const newlyUnlocked: string[] = [];
  const accuracy = newRecord.correct + newRecord.wrong > 0
    ? (newRecord.correct / (newRecord.correct + newRecord.wrong)) * 100
    : 0;

  const unlock = (id: string) => {
    if (!stats.unlockedBadges.includes(id)) {
      stats.unlockedBadges.push(id);
      newlyUnlocked.push(id);
    }
  };

  // 1. First Step
  if (stats.sessionRecords.length >= 1) unlock("first-step");

  // 2. Speed Demon
  if (newRecord.avgSpeed < 1.5 && accuracy >= 80) unlock("speed-demon");

  // 3. Perfect Recall
  if (accuracy === 100 && (newRecord.correct + newRecord.wrong) >= 10) unlock("perfect-recall");

  // 4. Centurion
  if ((newRecord.correct + newRecord.wrong) >= 100) unlock("centurion");

  // 5. Streak Starter
  if (newRecord.maxStreak >= 10) unlock("streak-starter");

  // 6. Math Wizard
  if (stats.totalXp >= 1000) unlock("math-wizard");

  // 7. Consistency Hero (3 consecutive days)
  if (stats.currentStreak >= 3) unlock("consistency-hero");

  // 8. Grandmaster
  const { level } = calculateUserLevel(stats.totalXp);
  if (level >= 10) unlock("grandmaster");

  return newlyUnlocked;
};

export const recordSession = (
  recordInput: Omit<SessionRecord, "id" | "timestamp" | "date">
): { stats: UserStats; newlyUnlockedBadges: string[] } => {
  const stats = loadUserStats();
  
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const timestamp = today.getTime();
  const id = Math.random().toString(36).substring(2, 9);

  const newRecord: SessionRecord = {
    ...recordInput,
    id,
    date: dateStr,
    timestamp
  };

  // Append record
  stats.sessionRecords.push(newRecord);

  // Update totals
  stats.totalXp += recordInput.xpEarned;
  stats.totalPracticeTime += recordInput.duration;

  // Update daily streaks
  updatePracticeStreaks(stats, dateStr);

  // Check badges
  const newlyUnlockedBadges = checkNewBadges(stats, newRecord);

  saveUserStats(stats);
  return { stats, newlyUnlockedBadges };
};

export const resetStats = (): UserStats => {
  const empty = getEmptyStats();
  saveUserStats(empty);
  return empty;
};

export const exportStats = (): string => {
  const stats = loadUserStats();
  return JSON.stringify(stats, null, 2);
};

export const importStats = (jsonStr: string): boolean => {
  try {
    const parsed = JSON.parse(jsonStr) as Partial<UserStats>;
    
    // Validate schema basic fields
    if (
      typeof parsed.totalXp === "number" &&
      Array.isArray(parsed.sessionRecords) &&
      Array.isArray(parsed.unlockedBadges)
    ) {
      const stats: UserStats = {
        totalXp: parsed.totalXp,
        totalPracticeTime: parsed.totalPracticeTime || 0,
        longestStreak: parsed.longestStreak || 0,
        currentStreak: parsed.currentStreak || 0,
        lastPracticeDate: parsed.lastPracticeDate || "",
        sessionRecords: parsed.sessionRecords,
        unlockedBadges: parsed.unlockedBadges
      };
      saveUserStats(stats);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
