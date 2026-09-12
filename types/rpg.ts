export type StatType = 
  | "strength"       // Physical fitness, workouts, sports
  | "intelligence"   // Studying, reading, coding, learning
  | "vitality"       // Sleep, hydration, nutrition, mental health
  | "agility"        // Quick chores, speed tasks, habits
  | "discipline";    // Focus blocks, cold showers, meditation

export type GoalDifficulty = "trivial" | "easy" | "medium" | "hard" | "epic";

export type GoalFrequency = "daily" | "weekly" | "one-time";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  stat: StatType;
  difficulty: GoalDifficulty;
  xpReward: number;
  goldReward: number;
  frequency: GoalFrequency;
  completed: boolean;
  streak: number;
  createdAt: string;
  dueDate?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  category: "streak" | "level" | "quest" | "stat";
  requirement: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PlayerStats {
  strength: number;
  intelligence: number;
  vitality: number;
  agility: number;
  discipline: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  title: string; // e.g. "Apprentice Adventurer", "Code Paladin"
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
  stats: PlayerStats;
}
