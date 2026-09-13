import { create } from "zustand";
import {
  PlayerProfile,
  Goal,
  Badge,
  Party,
  PartyMember,
  PartyRaidBoss,
  PartyActivityLog,
  StatType,
} from "@/types/rpg";
import {
  api,
  AuthResponse,
  UserProfileResponse,
  DailyQuestResponse,
  MonthlyQuestResponse,
  PartyResponse,
  ActivityLog,
  getAuthToken,
  getStoredUser,
} from "@/lib/api";

const TITLES_BY_LEVEL: Record<number, string> = {
  1: "Novice Adventurer",
  2: "Apprentice Pathfinder",
  3: "Realm Wanderer",
  4: "Quest Blade",
  5: "Code Paladin",
  6: "Dungeon Master",
  7: "Arcane Strategist",
  8: "Grand Vanguard",
  9: "Dragon Slayer",
  10: "Mythic Sovereign",
};

export function getTitleForLevel(level: number): string {
  return TITLES_BY_LEVEL[level] || `Mythic Level ${level} Master`;
}

interface LevelUpCelebration {
  isOpen: boolean;
  newLevel: number;
  oldLevel: number;
  title: string;
}

interface RPGStore {
  player: PlayerProfile;
  goals: Goal[];
  badges: Badge[];
  party: Party;
  levelUpCelebration: LevelUpCelebration | null;
  nudgeNotification: string | null;

  // --- Backend Connection & Auth State ---
  backendConnected: boolean;
  isLoggedIn: boolean;
  currentUser: AuthResponse | null;
  isAuthModalOpen: boolean;

  // Actions
  checkBackendStatus: () => Promise<boolean>;
  syncWithBackend: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginUser: (username: string, password: string) => Promise<boolean>;
  registerUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logoutUser: () => void;

  addXp: (amount: number) => void;
  addGold: (amount: number) => void;
  toggleGoal: (id: string) => Promise<void> | void;
  incrementLongTermGoal: (id: string, amount?: number) => Promise<void> | void;
  addGoal: (
    goal: Omit<Goal, "id" | "completed" | "streak" | "createdAt">
  ) => Promise<void> | void;
  deleteGoal: (id: string) => Promise<void> | void;
  openMysteryChest: () => Promise<{ gold: number; xp: number } | null>;
  dismissLevelUp: () => void;
  sendNudge: (memberId: string) => void;
  dismissNudgeNotification: () => void;
  joinParty: (inviteCode: string) => Promise<boolean> | boolean;
  createParty: (name: string, description: string) => Promise<void> | void;
  claimRaidReward: () => { gold: number; chests: number } | null;
}

const EMPTY_PARTY: Party = {
  id: "",
  name: "No Squad Joined",
  tag: "SOLO",
  description: "You have not joined a squad yet. Create your own squad or join your friends with an invite code.",
  inviteCode: "NONE",
  creatorId: "",
  members: [],
  raidBoss: {
    id: "boss-1",
    name: "The Obsidian Titan",
    description: "Form a squad and complete daily habits to slay the Titan and claim mythic loot!",
    targetXp: 1500,
    currentXp: 0,
    rewardGold: 150,
    rewardChests: 1,
    expiresIn: "24h",
    completed: false,
  },
  activityFeed: [],
};

const INITIAL_PLAYER: PlayerProfile = {
  id: "guest",
  name: "Adventurer",
  title: "Novice Adventurer",
  characterClass: "Warrior",
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  hp: 100,
  maxHp: 100,
  gold: 100,
  currentStreak: 0,
  bestStreak: 0,
  mysteryChests: 1,
  powerScore: 700,
  stats: {
    strength: 10,
    intellect: 10,
    discipline: 10,
    creativity: 10,
    charisma: 10,
  },
};

export const useRPGStore = create<RPGStore>((set, get) => ({
  // Auth & Status
  backendConnected: false,
  isLoggedIn: false,
  currentUser: null,
  isAuthModalOpen: false,

  player: INITIAL_PLAYER,
  goals: [], // Zero dummy goals! Real goals come from Neon DB or user creation
  party: EMPTY_PARTY, // Zero dummy members! Real squad comes from Neon DB

  badges: [
    {
      id: "badge-1",
      title: "First Blood",
      description: "Completed your very first quest",
      icon: "Sword",
      category: "quest",
      requirement: "Complete 1 quest",
      unlocked: false,
    },
    {
      id: "badge-2",
      title: "Flame Keeper",
      description: "Maintained a 3-day quest completion streak",
      icon: "Flame",
      category: "streak",
      requirement: "Reach a 3-day streak",
      unlocked: false,
    },
    {
      id: "badge-3",
      title: "Iron Will",
      description: "Reach a 7-day uninterrupted streak",
      icon: "Shield",
      category: "streak",
      requirement: "Reach a 7-day streak",
      unlocked: false,
    },
    {
      id: "badge-4",
      title: "Arcane Sage",
      description: "Accumulate 25 Intellect points",
      icon: "BookOpen",
      category: "stat",
      requirement: "Accumulate 25 INT",
      unlocked: false,
    },
  ],

  levelUpCelebration: null,
  nudgeNotification: null,

  // --- Backend Actions & Handlers ---

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  checkBackendStatus: async () => {
    const isOnline = await api.health.check();
    set({ backendConnected: isOnline });

    const storedToken = getAuthToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      set({ isLoggedIn: true, currentUser: storedUser });
      if (isOnline) {
        await get().syncWithBackend();
      }
    }

    return isOnline;
  },

  syncWithBackend: async () => {
    try {
      const [profile, dailies, monthlies, partyRes, activityFeed] =
        await Promise.allSettled([
          api.user.getProfile(),
          api.dailies.getAll(),
          api.monthlies.getAll(),
          api.parties.getMyParty(),
          api.leaderboard.getActivity(),
        ]);

      // 1. Sync Real Player Profile from Neon DB
      if (profile.status === "fulfilled" && profile.value) {
        const p = profile.value;
        const currentTitle = p.title || getTitleForLevel(p.level);

        set((state) => ({
          player: {
            ...state.player,
            id: `user-${p.id}`,
            name: p.username,
            title: currentTitle,
            level: p.level,
            currentXp: p.currentXp,
            xpToNextLevel: p.xpRequiredForNextLevel,
            gold: p.gold,
            currentStreak: p.streakDays,
            bestStreak: Math.max(state.player.bestStreak, p.streakDays),
            mysteryChests: p.mysteryChests,
            powerScore: p.powerScore,
            stats: {
              strength: p.strength,
              intellect: p.intellect,
              discipline: p.discipline,
              creativity: p.creativity,
              charisma: p.charisma,
            },
          },
        }));
      }

      // 2. Sync Real Goals from Neon DB (Zero Dummy Goals!)
      const syncedGoals: Goal[] = [];

      if (dailies.status === "fulfilled" && Array.isArray(dailies.value)) {
        dailies.value.forEach((d: DailyQuestResponse) => {
          syncedGoals.push({
            id: `daily-${d.id}`,
            title: d.title,
            description: d.description || undefined,
            stat: (d.category?.toLowerCase() as StatType) || "discipline",
            difficulty: "medium",
            xpReward: 50,
            goldReward: 25,
            frequency: "daily",
            goalType: "daily",
            completed: d.completedToday,
            streak: d.currentStreak,
            createdAt: new Date().toISOString(),
            weeklyDays: {
              sun: d.sunday,
              mon: d.monday,
              tue: d.tuesday,
              wed: d.wednesday,
              thu: d.thursday,
              fri: d.friday,
              sat: d.saturday,
            },
          });
        });
      }

      if (monthlies.status === "fulfilled" && Array.isArray(monthlies.value)) {
        monthlies.value.forEach((m: MonthlyQuestResponse) => {
          syncedGoals.push({
            id: `monthly-${m.id}`,
            title: m.title,
            description: m.description,
            stat: (m.category?.toLowerCase() as StatType) || "intellect",
            difficulty: "epic",
            xpReward: m.xpReward,
            goldReward: m.goldReward,
            frequency: "weekly",
            goalType: "long-term",
            targetValue: m.targetValue,
            currentValue: m.currentValue,
            unit: "milestones",
            completed: m.completed,
            streak: 0,
            createdAt: new Date().toISOString(),
          });
        });
      }

      // Always set goals to the real database goals (empty array if brand new user)
      set({ goals: syncedGoals });

      // 3. Sync Real Squad from Neon DB
      if (partyRes.status === "fulfilled" && partyRes.value) {
        const partyData = partyRes.value;
        set((state) => ({
          party: {
            ...state.party,
            id: `party-${partyData.id}`,
            name: partyData.name,
            tag: partyData.name.substring(0, 3).toUpperCase(),
            description: partyData.description,
            inviteCode: partyData.inviteCode,
            members: partyData.members.map((m) => ({
              id: `m-${m.userId}`,
              name: m.username,
              avatar: (m.avatar && (m.avatar.startsWith("http") || m.avatar.startsWith("/")))
                ? m.avatar
                : m.username ? m.username.substring(0, 2).toUpperCase() : "U",
              level: m.level,
              title: m.title || "Novice Adventurer",
              characterClass: "Warrior",
              todayXp: m.totalXp,
              todayGoalsCompleted: m.streakDays,
              todayGoalsTotal: 4,
              streakDays: m.streakDays,
              isCurrentUser: m.username === get().player.name,
              status: "online",
            })),
          },
        }));
      } else {
        set({ party: EMPTY_PARTY });
      }

      // 4. Sync Real Activity Ticker from Neon DB
      if (activityFeed.status === "fulfilled" && Array.isArray(activityFeed.value)) {
        const feed: PartyActivityLog[] = activityFeed.value.map((a: ActivityLog) => ({
          id: `act-${a.id}`,
          username: a.username,
          action: a.action,
          xpGained: a.xpGained,
          timestamp: "Recently",
        }));
        set((state) => ({
          party: {
            ...state.party,
            activityFeed: feed,
          },
        }));
      }
    } catch (e) {
      console.error("Backend sync error:", e);
    }
  },

  loginUser: async (username, password) => {
    const res = await api.auth.login({ username, password });
    set({ isLoggedIn: true, currentUser: res });
    await get().syncWithBackend();
    return true;
  },

  registerUser: async (username, email, password) => {
    const res = await api.auth.register({ username, email, password });
    set({ isLoggedIn: true, currentUser: res });
    await get().syncWithBackend();
    return true;
  },

  logoutUser: () => {
    api.auth.logout();
    set({
      isLoggedIn: false,
      currentUser: null,
      player: INITIAL_PLAYER,
      goals: [],
      party: EMPTY_PARTY,
    });
  },

  addXp: (amount) =>
    set((state) => {
      let newXp = state.player.currentXp + amount;
      let newLevel = state.player.level;
      let xpToNext = state.player.xpToNextLevel;
      let leveledUp = false;

      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel += 1;
        xpToNext = Math.round(xpToNext * 1.4);
        leveledUp = true;
      }

      const newTitle = getTitleForLevel(newLevel);

      return {
        player: {
          ...state.player,
          level: newLevel,
          title: newTitle,
          currentXp: newXp,
          xpToNextLevel: xpToNext,
        },
        levelUpCelebration: leveledUp
          ? {
              isOpen: true,
              newLevel,
              oldLevel: state.player.level,
              title: newTitle,
            }
          : state.levelUpCelebration,
      };
    }),

  addGold: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        gold: state.player.gold + amount,
      },
    })),

  toggleGoal: async (id) => {
    const state = get();
    const goal = state.goals.find((g) => g.id === id);
    if (!goal) return;

    // Check if connected to backend and daily quest
    if (state.backendConnected && state.isLoggedIn && id.startsWith("daily-")) {
      const dailyId = Number(id.replace("daily-", ""));
      try {
        const result = await api.dailies.checkIn(dailyId);

        set((s) => {
          const updatedPlayer = {
            ...s.player,
            level: result.level,
            currentXp: result.currentXp,
            xpToNextLevel: result.xpNeededForNextLevel,
            gold: s.player.gold + result.goldGained,
            mysteryChests: result.newMysteryChests,
            currentStreak: result.streakDays,
            stats: {
              ...s.player.stats,
              [result.attributeBoosted.toLowerCase()]: result.newAttributeValue,
            },
          };

          return {
            player: updatedPlayer,
            goals: s.goals.map((g) =>
              g.id === id
                ? {
                    ...g,
                    completed: true,
                    streak: result.streakDays,
                  }
                : g
            ),
            levelUpCelebration: result.leveledUp
              ? {
                  isOpen: true,
                  newLevel: result.level,
                  oldLevel: result.level - 1,
                  title: getTitleForLevel(result.level),
                }
              : s.levelUpCelebration,
          };
        });

        // Refresh activity feed from server
        try {
          const feed = await api.leaderboard.getActivity();
          set((s) => ({
            party: {
              ...s.party,
              activityFeed: feed.map((a) => ({
                id: `act-${a.id}`,
                username: a.username,
                action: a.action,
                xpGained: a.xpGained,
                timestamp: "Just now",
              })),
            },
          }));
        } catch {}

        return;
      } catch (err: any) {
        console.warn("Check-in error:", err.message);
        throw err;
      }
    }

    // Local execution fallback
    set((s) => {
      const willBeCompleted = !goal.completed;
      return {
        goals: s.goals.map((g) =>
          g.id === id
            ? {
                ...g,
                completed: willBeCompleted,
                streak: willBeCompleted ? g.streak + 1 : Math.max(0, g.streak - 1),
              }
            : g
        ),
      };
    });
  },

  incrementLongTermGoal: async (id, amount = 1) => {
    const state = get();
    const goal = state.goals.find((g) => g.id === id);
    if (!goal) return;

    if (state.backendConnected && state.isLoggedIn && id.startsWith("monthly-")) {
      const monthlyId = Number(id.replace("monthly-", ""));
      try {
        const result = await api.monthlies.recordProgress(monthlyId, amount);
        set((s) => ({
          player: {
            ...s.player,
            currentXp: result.currentXp,
            xpToNextLevel: result.xpNeededForNextLevel,
            level: result.level,
            gold: s.player.gold + result.goldGained,
            mysteryChests: result.newMysteryChests,
          },
          goals: s.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  currentValue: Math.min(g.targetValue || 10, (g.currentValue || 0) + amount),
                  completed: (g.currentValue || 0) + amount >= (g.targetValue || 10),
                }
              : g
          ),
          levelUpCelebration: result.leveledUp
            ? {
                isOpen: true,
                newLevel: result.level,
                oldLevel: result.level - 1,
                title: getTitleForLevel(result.level),
              }
            : s.levelUpCelebration,
        }));
        return;
      } catch (err: any) {
        console.warn("Monthly progress error:", err.message);
        throw err;
      }
    }

    set((s) => {
      const current = goal.currentValue || 0;
      const target = goal.targetValue || 10;
      const nextVal = Math.min(target, current + amount);
      return {
        goals: s.goals.map((g) =>
          g.id === id
            ? {
                ...g,
                currentValue: nextVal,
                completed: nextVal >= target,
              }
            : g
        ),
      };
    });
  },

  addGoal: async (newGoalData) => {
    const state = get();

    if (state.backendConnected && state.isLoggedIn) {
      try {
        if (newGoalData.goalType === "daily") {
          const res = await api.dailies.create({
            title: newGoalData.title,
            description: newGoalData.description,
            category: (newGoalData.stat || "DISCIPLINE").toUpperCase(),
          });
          const mapped: Goal = {
            id: `daily-${res.id}`,
            title: res.title,
            description: res.description || newGoalData.description,
            stat: (res.category?.toLowerCase() as StatType) || "discipline",
            difficulty: "medium",
            xpReward: 50,
            goldReward: 25,
            frequency: "daily",
            goalType: "daily",
            completed: false,
            streak: 0,
            createdAt: new Date().toISOString(),
          };
          set((s) => ({ goals: [mapped, ...s.goals] }));
          return;
        } else {
          const res = await api.monthlies.create({
            title: newGoalData.title,
            description: newGoalData.description,
            category: (newGoalData.stat || "INTELLECT").toUpperCase(),
            targetValue: newGoalData.targetValue || 10,
            xpReward: newGoalData.xpReward || 400,
            goldReward: newGoalData.goldReward || 200,
          });
          const mapped: Goal = {
            id: `monthly-${res.id}`,
            title: res.title,
            description: res.description,
            stat: (res.category?.toLowerCase() as StatType) || "intellect",
            difficulty: "epic",
            xpReward: res.xpReward,
            goldReward: res.goldReward,
            frequency: "weekly",
            goalType: "long-term",
            targetValue: res.targetValue,
            currentValue: res.currentValue,
            unit: newGoalData.unit || "milestones",
            completed: false,
            streak: 0,
            createdAt: new Date().toISOString(),
          };
          set((s) => ({ goals: [mapped, ...s.goals] }));
          return;
        }
      } catch (err: any) {
        console.warn("Backend add goal error:", err.message);
        throw err;
      }
    }

    // Local fallback
    set((s) => ({
      goals: [
        {
          ...newGoalData,
          id: `goal-${Date.now()}`,
          completed: false,
          streak: 0,
          createdAt: new Date().toISOString(),
        },
        ...s.goals,
      ],
    }));
  },

  deleteGoal: async (id) => {
    const state = get();
    if (state.backendConnected && state.isLoggedIn) {
      try {
        if (id.startsWith("daily-")) {
          await api.dailies.delete(Number(id.replace("daily-", "")));
        } else if (id.startsWith("monthly-")) {
          await api.monthlies.delete(Number(id.replace("monthly-", "")));
        }
      } catch (e) {
        console.warn("Delete goal error:", e);
      }
    }
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },

  openMysteryChest: async () => {
    const state = get();
    if (state.player.mysteryChests <= 0) return null;

    if (state.backendConnected && state.isLoggedIn) {
      try {
        const result = await api.shop.openChest();
        set((s) => ({
          player: {
            ...s.player,
            gold: result.updatedGold,
            currentXp: result.updatedTotalXp % 250,
            mysteryChests: result.remainingChests,
            title: result.rewardType === "TITLE" ? result.rewardName : s.player.title,
          },
        }));
        return { gold: result.goldWon, xp: result.xpWon };
      } catch (e) {
        console.warn("Chest open error:", e);
      }
    }

    const goldBonus = Math.floor(Math.random() * 50) + 50;
    const xpBonus = Math.floor(Math.random() * 40) + 40;

    set((s) => ({
      player: {
        ...s.player,
        gold: s.player.gold + goldBonus,
        currentXp: s.player.currentXp + xpBonus,
        mysteryChests: Math.max(0, s.player.mysteryChests - 1),
      },
    }));

    return { gold: goldBonus, xp: xpBonus };
  },

  dismissLevelUp: () => set({ levelUpCelebration: null }),

  sendNudge: (memberId) => {
    const { party, addXp } = get();
    const target = party.members.find((m) => m.id === memberId);
    if (!target) return;

    addXp(5);
    set((s) => ({
      nudgeNotification: `You high-fived ${target.name}! ⚡ (+5 XP Synergy)`,
      party: {
        ...s.party,
        members: s.party.members.map((m) =>
          m.id === memberId ? { ...m, todayXp: m.todayXp + 5, lastNudge: "High-fived just now" } : m
        ),
      },
    }));
  },

  dismissNudgeNotification: () => set({ nudgeNotification: null }),

  joinParty: async (inviteCode) => {
    const cleanCode = inviteCode.trim().toUpperCase();
    if (cleanCode.length < 4) return false;

    const state = get();
    if (state.backendConnected && state.isLoggedIn) {
      try {
        const partyRes = await api.parties.join({ inviteCode: cleanCode });
        set((s) => ({
          party: {
            ...s.party,
            id: `party-${partyRes.id}`,
            name: partyRes.name,
            description: partyRes.description,
            inviteCode: partyRes.inviteCode,
          },
          nudgeNotification: `Successfully joined ${partyRes.name}! 🚀`,
        }));
        await state.syncWithBackend();
        return true;
      } catch (e: any) {
        console.warn("Backend join party failed:", e.message);
        throw e;
      }
    }

    return false;
  },

  createParty: async (name, description) => {
    const state = get();
    if (state.backendConnected && state.isLoggedIn) {
      try {
        const partyRes = await api.parties.create({ name, description });
        set((s) => ({
          party: {
            ...s.party,
            id: `party-${partyRes.id}`,
            name: partyRes.name,
            description: partyRes.description,
            inviteCode: partyRes.inviteCode,
          },
          nudgeNotification: `Created squad '${name}'! Invite code: ${partyRes.inviteCode} 🛡️`,
        }));
        await state.syncWithBackend();
        return;
      } catch (e: any) {
        console.warn("Backend create party error:", e.message);
        throw e;
      }
    }
  },

  claimRaidReward: () => {
    const { party, addGold } = get();
    if (!party.raidBoss.completed) return null;

    const goldReward = party.raidBoss.rewardGold;
    const chestReward = party.raidBoss.rewardChests;

    addGold(goldReward);
    set((s) => ({
      player: {
        ...s.player,
        mysteryChests: s.player.mysteryChests + chestReward,
      },
      party: {
        ...s.party,
        raidBoss: {
          ...s.party.raidBoss,
          completed: false,
          currentXp: 0,
          targetXp: Math.round(s.party.raidBoss.targetXp * 1.2),
        },
      },
    }));

    return { gold: goldReward, chests: chestReward };
  },
}));
