"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, CheckCircle2, Swords, Trophy, Calendar, Sparkles, Target } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { QuestCard } from "./quest-card";
import { LongTermGoalCard } from "./long-term-goal-card";
import { StatType } from "@/types/rpg";

interface QuestListProps {
  selectedSector?: string;
  onOpenAddQuest?: () => void;
}

export function QuestList({ selectedSector = "all", onOpenAddQuest }: QuestListProps) {
  const goals = useRPGStore((state) => state.goals);

  // Tab: "daily" vs "long-term"
  const [activeTab, setActiveTab] = useState<"daily" | "long-term">("daily");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [statFilter, setStatFilter] = useState<"all" | StatType>("all");

  const categories: { key: StatType; label: string }[] = [
    { key: "strength", label: "Strength" },
    { key: "intellect", label: "Intellect" },
    { key: "discipline", label: "Discipline" },
    { key: "creativity", label: "Creativity" },
    { key: "charisma", label: "Charisma" },
  ];

  // Filter based on active tab (daily vs long-term)
  const tabGoals = goals.filter((g) => {
    if (activeTab === "daily") {
      return g.goalType === "daily" || (!g.goalType && g.frequency === "daily");
    } else {
      return g.goalType === "long-term";
    }
  });

  const filteredGoals = tabGoals.filter((goal) => {
    if (statusFilter === "pending" && goal.completed) return false;
    if (statusFilter === "completed" && !goal.completed) return false;
    if (statFilter !== "all" && goal.stat !== statFilter) return false;
    return true;
  });

  const dailyCount = goals.filter((g) => g.goalType === "daily" || (!g.goalType && g.frequency === "daily")).length;
  const longTermCount = goals.filter((g) => g.goalType === "long-term").length;
  const pendingCount = tabGoals.filter((g) => !g.completed).length;

  return (
    <div className="space-y-6">
      {/* 1. Main Mode Switcher: Daily Goals vs Long-Term Goals */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-3xl bg-[#0b0f22] border border-white/10 shadow-inner">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => setActiveTab("daily")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black transition-all cursor-pointer ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Daily Goals ({dailyCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("long-term")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black transition-all cursor-pointer ${
              activeTab === "long-term"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Long-Term Milestones ({longTermCount})</span>
          </button>
        </div>

        {onOpenAddQuest && (
          <button
            onClick={onOpenAddQuest}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
        )}
      </div>

      {/* 2. Controls & Sector Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            {activeTab === "daily" ? "Daily Protocol Log" : "Epic Long-Term Quests"}
            <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-bold text-violet-300 border border-violet-500/30">
              {pendingCount} Active
            </span>
          </h2>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
              statusFilter === "all" ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            All ({tabGoals.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
              statusFilter === "pending" ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Active ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
              statusFilter === "completed" ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Done ({tabGoals.length - pendingCount})
          </button>
        </div>
      </div>

      {/* Sector Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatFilter("all")}
          className={`rounded-xl px-3 py-1 font-bold border transition-all whitespace-nowrap cursor-pointer ${
            statFilter === "all"
              ? "bg-white/15 text-white border-white/30"
              : "bg-[#0c1226]/60 text-slate-400 border-white/5 hover:border-white/15 hover:text-slate-200"
          }`}
        >
          All Sectors
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setStatFilter(cat.key)}
            className={`rounded-xl px-3 py-1 font-bold border transition-all whitespace-nowrap cursor-pointer ${
              statFilter === cat.key
                ? "bg-violet-500/25 text-violet-200 border-violet-500/50"
                : "bg-[#0c1226]/60 text-slate-400 border-white/5 hover:border-white/15 hover:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Goal Cards Container */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) =>
              activeTab === "daily" ? (
                <QuestCard key={goal.id} goal={goal} />
              ) : (
                <LongTermGoalCard key={goal.id} goal={goal} />
              )
            )
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-white/10 bg-black/30 p-10 text-center"
            >
              {tabGoals.length === 0 ? (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5b869]/15 text-[#e5b869] mb-3 border border-[#e5b869]/25">
                    <Target className="h-7 w-7 text-[#e5b869]" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {activeTab === "daily"
                      ? "No Daily Quests Deployed Yet"
                      : "No Long-Term Milestones Found"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    {activeTab === "daily"
                      ? "Your quest board is ready. Deploy your daily habits to earn XP, gold, and build streaks in Neon PostgreSQL!"
                      : "Create milestone quests like reading 4 books or running 100km to earn epic rewards."}
                  </p>
                  {onOpenAddQuest && (
                    <button
                      onClick={onOpenAddQuest}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-[#e5b869]/20 hover:brightness-110 transition-all cursor-pointer font-mono"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Deploy First {activeTab === "daily" ? "Daily Goal" : "Milestone"}</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 mb-3 border border-emerald-500/25">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {statusFilter === "pending"
                      ? "All Quests Completed For Today!"
                      : "No Matching Quests Found"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    {statusFilter === "pending"
                      ? "Great discipline, Hunter! Your daily protocol is 100% fulfilled."
                      : "Try adjusting your category or status filters to view other goals."}
                  </p>
                  {onOpenAddQuest && (
                    <button
                      onClick={onOpenAddQuest}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Another Goal</span>
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
