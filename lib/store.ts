import { create } from "zustand";
import { PlayerProfile, Goal, Badge } from "@/types/rpg";

interface RPGStore {
  player: PlayerProfile;
  goals: Goal[];
  badges: Badge[];
  
  // Actions
  addXp: (amount: number) => void;
  addGold: (amount: number) => void;
  toggleGoal: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "completed" | "streak" | "createdAt">) => void;
  deleteGoal: (id: string) => void;
}

export const useRPGStore = create<RPGStore>((set) => ({
  player: {
    id: "player-1",
    name: "Adventurer",
    title: "Novice Hero",
    characterClass: "Warrior",
    level: 1,
    currentXp: 120,
    xpToNextLevel: 300,
    hp: 100,
    maxHp: 100,
    gold: 50,
    currentStreak: 3,
    bestStreak: 5,
    stats: {
      strength: 12,
      intelligence: 10,
      vitality: 14,
      agility: 8,
      discipline: 11,
    },
  },
  goals: [
    {
      id: "goal-1",
      title: "Morning 30-min Workout",
      description: "Push-ups, core workout, and stretches",
      stat: "strength",
      difficulty: "medium",
      xpReward: 50,
      goldReward: 20,
      frequency: "daily",
      completed: false,
      streak: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: "goal-2",
      title: "Study Next.js Architecture",
      description: "Read docs and implement a new feature branch",
      stat: "intelligence",
      difficulty: "hard",
      xpReward: 100,
      goldReward: 40,
      frequency: "daily",
      completed: false,
      streak: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: "goal-3",
      title: "Drink 2.5L Water",
      description: "Stay hydrated throughout the day",
      stat: "vitality",
      difficulty: "easy",
      xpReward: 25,
      goldReward: 10,
      frequency: "daily",
      completed: true,
      streak: 4,
      createdAt: new Date().toISOString(),
    },
  ],
  badges: [
    {
      id: "badge-1",
      title: "First Blood",
      description: "Completed your first quest",
      icon: "Sword",
      category: "quest",
      requirement: "Complete 1 quest",
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    },
    {
      id: "badge-2",
      title: "Iron Will",
      description: "Maintained a 7-day streak",
      icon: "Flame",
      category: "streak",
      requirement: "Reach a 7-day streak",
      unlocked: false,
    },
    {
      id: "badge-3",
      title: "Scholar of the Realm",
      description: "Reach 50 Intelligence points",
      icon: "BookOpen",
      category: "stat",
      requirement: "Accumulate 50 INT",
      unlocked: false,
    },
  ],

  addXp: (amount) =>
    set((state) => {
      let newXp = state.player.currentXp + amount;
      let newLevel = state.player.level;
      let xpToNext = state.player.xpToNextLevel;

      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel += 1;
        xpToNext = Math.round(xpToNext * 1.5);
      }

      return {
        player: {
          ...state.player,
          level: newLevel,
          currentXp: newXp,
          xpToNextLevel: xpToNext,
        },
      };
    }),

  addGold: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        gold: state.player.gold + amount,
      },
    })),

  toggleGoal: (id) =>
    set((state) => {
      const goal = state.goals.find((g) => g.id === id);
      if (!goal) return state;

      const willBeCompleted = !goal.completed;
      const updatedGoals = state.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              completed: willBeCompleted,
              streak: willBeCompleted ? g.streak + 1 : Math.max(0, g.streak - 1),
            }
          : g
      );

      // Reward player if completed
      let updatedPlayer = state.player;
      if (willBeCompleted) {
        let newXp = updatedPlayer.currentXp + goal.xpReward;
        let newLevel = updatedPlayer.level;
        let xpToNext = updatedPlayer.xpToNextLevel;

        while (newXp >= xpToNext) {
          newXp -= xpToNext;
          newLevel += 1;
          xpToNext = Math.round(xpToNext * 1.5);
        }

        updatedPlayer = {
          ...updatedPlayer,
          level: newLevel,
          currentXp: newXp,
          xpToNextLevel: xpToNext,
          gold: updatedPlayer.gold + goal.goldReward,
          stats: {
            ...updatedPlayer.stats,
            [goal.stat]: updatedPlayer.stats[goal.stat] + 1,
          },
        };
      }

      return {
        goals: updatedGoals,
        player: updatedPlayer,
      };
    }),

  addGoal: (newGoalData) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...newGoalData,
          id: `goal-${Date.now()}`,
          completed: false,
          streak: 0,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
}));
