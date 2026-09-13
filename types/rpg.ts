export type StatType = 
  | "strength"       // Physical fitness, workouts, sports
  | "intellect"      // Studying, coding, learning, reading
  | "discipline"     // Consistency, deep focus, morning routine
  | "creativity"     // Writing, design, side-projects, art
  | "charisma"       // Socializing, networking, teamwork
  | "vitality";      // Sleep, hydration, wellness

export type GoalDifficulty = "trivial" | "easy" | "medium" | "hard" | "epic";

export type GoalFrequency = "daily" | "weekly" | "one-time";

export type GoalType = "daily" | "long-term";

export interface WeeklyDays {
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  stat: StatType;
  difficulty: GoalDifficulty;
  xpReward: number;
  goldReward: number;
  frequency: GoalFrequency;
  goalType: GoalType; // "daily" or "long-term"
  completed: boolean;
  streak: number;
  createdAt: string;
  dueDate?: string;
  weeklyDays?: WeeklyDays;
  // For Long-Term Goals (matches backend MonthlyQuest)
  targetValue?: number;
  currentValue?: number;
  unit?: string; // e.g. "days", "km", "books", "hours"
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "level" | "quest" | "stat";
  requirement: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PlayerStats {
  strength: number;
  intellect: number;
  discipline: number;
  creativity: number;
  charisma: number;
  [key: string]: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  characterClass: "Warrior" | "Mage" | "Rogue" | "Paladin";
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  gold: number;
  currentStreak: number;
  bestStreak: number;
  mysteryChests: number;
  powerScore?: number;
  stats: PlayerStats;
}

// --- Party & Squad Competition Types (Matches backend Party.java & ActivityLog.java) ---
export interface PartyMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  title: string;
  characterClass: string;
  todayXp: number; // Points earned today for daily competition
  todayGoalsCompleted: number;
  todayGoalsTotal: number;
  streakDays: number;
  isCurrentUser?: boolean;
  status: "online" | "idle" | "completed_all";
  lastNudge?: string;
}

export interface PartyRaidBoss {
  id: string;
  name: string;
  description: string;
  targetXp: number;
  currentXp: number;
  rewardGold: number;
  rewardChests: number;
  expiresIn: string;
  completed: boolean;
}

export interface PartyActivityLog {
  id: string;
  username: string;
  action: string;
  xpGained: number;
  timestamp: string;
}

export interface Party {
  id: string;
  name: string;
  tag: string;
  description: string;
  inviteCode: string; // 6-character code like "NR7XK2"
  creatorId: string;
  members: PartyMember[];
  raidBoss: PartyRaidBoss;
  activityFeed: PartyActivityLog[];
}

