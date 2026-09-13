// LifeRPG API Client - Connects Next.js Frontend to Spring Boot REST Backend

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "" : "http://localhost:8080");
const TOKEN_KEY = "liferpg_jwt_token";
const USER_KEY = "liferpg_current_user";

// --- Types Matching Spring Boot DTOs ---

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  level: number;
  gold: number;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  title: string;
  avatar: string;
  level: number;
  currentXp: number;
  totalXp: number;
  xpRequiredForNextLevel: number;
  gold: number;
  streakDays: number;
  mysteryChests: number;
  strength: number;
  intellect: number;
  discipline: number;
  creativity: number;
  charisma: number;
  partyName?: string | null;
  partyInviteCode?: string | null;
  powerScore: number;
}

export interface DailyQuestResponse {
  id: number;
  title: string;
  description?: string | null;
  category: "STRENGTH" | "INTELLECT" | "DISCIPLINE" | "CREATIVITY" | "CHARISMA";
  currentStreak: number;
  completedToday: boolean;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface QuestCompletionResult {
  questId: number;
  questTitle: string;
  xpGained: number;
  goldGained: number;
  attributeBoosted: string;
  newAttributeValue: number;
  currentXp: number;
  xpNeededForNextLevel: number;
  level: number;
  leveledUp: boolean;
  newMysteryChests: number;
  streakDays: number;
}

export interface MonthlyQuestResponse {
  id: number;
  title: string;
  description: string;
  category: "STRENGTH" | "INTELLECT" | "DISCIPLINE" | "CREATIVITY" | "CHARISMA";
  targetValue: number;
  currentValue: number;
  xpReward: number;
  goldReward: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  title: string;
  avatar: string;
  level: number;
  totalXp: number;
  streakDays: number;
  powerScore: number;
  partyName?: string;
}

export interface PartyResponse {
  id: number;
  name: string;
  description: string;
  inviteCode: string;
  memberCount: number;
  members: LeaderboardEntry[];
}

export interface ActivityLog {
  id: number;
  username: string;
  action: string;
  xpGained: number;
  timestamp: string;
}

export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  type: "TITLE" | "AVATAR" | "BADGE" | "REAL_REWARD";
  icon: string;
  rarity: string;
}

export interface UserInventory {
  id: number;
  shopItem: ShopItem;
  equipped: boolean;
  acquiredAt: string;
}

export interface ChestOpenResult {
  rewardType: "GOLD" | "XP" | "TITLE" | "AVATAR";
  rewardName: string;
  rewardDescription: string;
  rarity: string;
  goldWon: number;
  xpWon: number;
  remainingChests: number;
  updatedGold: number;
  updatedTotalXp: number;
}

// --- Token & Storage Management ---

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// --- HTTP Request Engine ---

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = API_BASE ? `${API_BASE}${path}` : path;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.messages && typeof errorJson.messages === "object") {
        const errorList = Object.values(errorJson.messages);
        if (errorList.length > 0) {
          errorMessage = errorList.join(". ");
        }
      } else {
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      }
    } catch {
      // Non-JSON response
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// --- API Modules ---

export const api = {
  // Health check
  health: {
    async check(): Promise<boolean> {
      try {
        const url = API_BASE ? `${API_BASE}/api/leaderboard/global` : "/api/leaderboard/global";
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        return res.ok;
      } catch {
        return false;
      }
    },
  },

  // Authentication
  auth: {
    async register(data: {
      username: string;
      email: string;
      password: string;
    }): Promise<AuthResponse> {
      const res = await request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setAuthToken(res.token);
      setStoredUser(res);
      return res;
    },

    async login(data: {
      username: string;
      password: string;
    }): Promise<AuthResponse> {
      const res = await request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          usernameOrEmail: data.username,
          password: data.password,
        }),
      });
      setAuthToken(res.token);
      setStoredUser(res);
      return res;
    },

    logout(): void {
      clearAuthToken();
    },
  },

  // User Profile
  user: {
    async getProfile(): Promise<UserProfileResponse> {
      return request<UserProfileResponse>("/api/users/profile");
    },

    async updateProfile(params: {
      title?: string;
      avatar?: string;
    }): Promise<UserProfileResponse> {
      const query = new URLSearchParams();
      if (params.title) query.set("title", params.title);
      if (params.avatar) query.set("avatar", params.avatar);
      return request<UserProfileResponse>(`/api/users/profile?${query.toString()}`, {
        method: "PUT",
      });
    },
  },

  // Daily Quests
  dailies: {
    async getAll(): Promise<DailyQuestResponse[]> {
      return request<DailyQuestResponse[]>("/api/dailies");
    },

    async create(data: {
      title: string;
      description?: string;
      category: string;
    }): Promise<DailyQuestResponse> {
      return request<DailyQuestResponse>("/api/dailies", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async checkIn(id: number): Promise<QuestCompletionResult> {
      return request<QuestCompletionResult>(`/api/dailies/${id}/check`, {
        method: "POST",
      });
    },

    async delete(id: number): Promise<void> {
      return request<void>(`/api/dailies/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Monthly Quests / Long-Term Milestones
  monthlies: {
    async getAll(): Promise<MonthlyQuestResponse[]> {
      return request<MonthlyQuestResponse[]>("/api/monthlies");
    },

    async create(data: {
      title: string;
      description?: string;
      category: string;
      targetValue: number;
      xpReward?: number;
      goldReward?: number;
    }): Promise<MonthlyQuestResponse> {
      return request<MonthlyQuestResponse>("/api/monthlies", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async recordProgress(
      id: number,
      increment: number = 1
    ): Promise<QuestCompletionResult> {
      return request<QuestCompletionResult>(`/api/monthlies/${id}/progress`, {
        method: "POST",
        body: JSON.stringify({ increment }),
      });
    },

    async delete(id: number): Promise<void> {
      return request<void>(`/api/monthlies/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Guilds / Parties
  parties: {
    async getMyParty(): Promise<PartyResponse | null> {
      try {
        return await request<PartyResponse>("/api/parties/my-party");
      } catch {
        return null;
      }
    },

    async create(data: {
      name: string;
      description?: string;
    }): Promise<PartyResponse> {
      return request<PartyResponse>("/api/parties/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async join(data: { inviteCode: string }): Promise<PartyResponse> {
      return request<PartyResponse>("/api/parties/join", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async leave(): Promise<void> {
      return request<void>("/api/parties/leave", {
        method: "POST",
      });
    },
  },

  // Leaderboard & Activity Ticker
  leaderboard: {
    async getGlobal(): Promise<LeaderboardEntry[]> {
      return request<LeaderboardEntry[]>("/api/leaderboard/global");
    },

    async getActivity(): Promise<ActivityLog[]> {
      return request<ActivityLog[]>("/api/leaderboard/activity");
    },
  },

  // Shop, Inventory, Mystery Chests
  shop: {
    async getCatalog(): Promise<ShopItem[]> {
      return request<ShopItem[]>("/api/shop");
    },

    async getInventory(): Promise<UserInventory[]> {
      return request<UserInventory[]>("/api/shop/inventory");
    },

    async buyItem(id: number): Promise<UserInventory> {
      return request<UserInventory>(`/api/shop/buy/${id}`, {
        method: "POST",
      });
    },

    async createCustomReward(data: {
      name: string;
      description: string;
      price: number;
      icon?: string;
    }): Promise<ShopItem> {
      return request<ShopItem>("/api/shop/custom-reward", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async openChest(): Promise<ChestOpenResult> {
      return request<ChestOpenResult>("/api/shop/chest/open", {
        method: "POST",
      });
    },

    async equipItem(inventoryId: number): Promise<void> {
      return request<void>("/api/shop/equip", {
        method: "POST",
        body: JSON.stringify({ inventoryId }),
      });
    },
  },
};
