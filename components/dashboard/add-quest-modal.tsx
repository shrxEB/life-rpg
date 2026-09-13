"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Coins, Plus, Dumbbell, Brain, Target, Palette, Users, Calendar, Trophy } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { StatType, GoalDifficulty, GoalFrequency, GoalType } from "@/types/rpg";
import { toast } from "sonner";

interface AddQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIFFICULTY_REWARDS: Record<GoalDifficulty, { xp: number; gold: number; label: string }> = {
  trivial: { xp: 10, gold: 5, label: "Trivial (+10 XP)" },
  easy: { xp: 50, gold: 20, label: "Easy (+50 XP)" },
  medium: { xp: 100, gold: 45, label: "Medium (+100 XP)" },
  hard: { xp: 200, gold: 100, label: "Hard (+200 XP)" },
  epic: { xp: 400, gold: 250, label: "Epic (+400 XP)" },
};

export function AddQuestModal({ isOpen, onClose }: AddQuestModalProps) {
  const addGoal = useRPGStore((state) => state.addGoal);

  const [goalType, setGoalType] = useState<GoalType>("daily");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stat, setStat] = useState<StatType>("intellect");
  const [difficulty, setDifficulty] = useState<GoalDifficulty>("medium");
  const [targetValue, setTargetValue] = useState<number>(10);
  const [unit, setUnit] = useState<string>("steps");

  if (!isOpen) return null;

  const baseRewards = DIFFICULTY_REWARDS[difficulty];
  const finalXp = goalType === "long-term" ? baseRewards.xp * 2 : baseRewards.xp;
  const finalGold = goalType === "long-term" ? baseRewards.gold * 2 : baseRewards.gold;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a goal title");
      return;
    }

    addGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      stat,
      difficulty,
      xpReward: finalXp,
      goldReward: finalGold,
      frequency: goalType === "daily" ? "daily" : "weekly",
      goalType,
      targetValue: goalType === "long-term" ? targetValue : undefined,
      currentValue: goalType === "long-term" ? 0 : undefined,
      unit: goalType === "long-term" ? unit.trim() || "units" : undefined,
    });

    toast.success(
      goalType === "daily" ? "Daily Goal Added!" : "Long-Term Milestone Created!",
      {
        description: `"${title}" is active in your quest log.`,
      }
    );

    // Reset & close
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#121832] via-[#0d1226] to-[#070b14] p-6 sm:p-7 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">Deploy New Objective</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Goal Type Selector: Daily vs Long-Term */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Objective Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGoalType("daily")}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-black border transition-all cursor-pointer ${
                    goalType === "daily"
                      ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30"
                      : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Daily Goal (Fills Circle)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGoalType("long-term")}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-black border transition-all cursor-pointer ${
                    goalType === "long-term"
                      ? "bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/30"
                      : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Long-Term Milestone</span>
                </button>
              </div>
            </div>

            {/* Goal Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {goalType === "daily" ? "Daily Goal Title" : "Milestone Objective"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  goalType === "daily"
                    ? "e.g. 30-min Morning Run, Read 20 mins, Drink 2.5L Water"
                    : "e.g. Run 100km this month, Read 4 books, Finish Course"
                }
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                required
              />
            </div>

            {/* Long-Term specific: Target Value & Units */}
            {goalType === "long-term" && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-amber-500/30 px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    Unit (e.g. books, km, days)
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="km, chapters, days..."
                    className="w-full rounded-xl bg-slate-900 border border-amber-500/30 px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Goal Description & Directives
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specific instructions, steps, or daily targets for this goal..."
                rows={2}
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              />
            </div>

            {/* Attribute Trained */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Attribute Trained
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "strength" as StatType, label: "Strength", icon: Dumbbell },
                  { id: "intellect" as StatType, label: "Intellect", icon: Brain },
                  { id: "discipline" as StatType, label: "Discipline", icon: Target },
                  { id: "creativity" as StatType, label: "Creativity", icon: Palette },
                  { id: "charisma" as StatType, label: "Charisma", icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = stat === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStat(item.id)}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-violet-500 bg-violet-600/30 text-white shadow-md ring-1 ring-violet-400"
                          : "border-white/5 bg-slate-900/60 text-slate-400 hover:border-white/15 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-violet-400" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Difficulty Tier</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(["trivial", "easy", "medium", "hard", "epic"] as GoalDifficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`uppercase rounded-xl py-1.5 text-xs font-black border transition-all cursor-pointer ${
                      difficulty === d
                        ? "border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-500/30"
                        : "border-white/5 bg-slate-900/60 text-slate-400 hover:border-white/15 hover:text-slate-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Reward Preview Bar */}
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/30 p-3.5">
              <span className="text-xs font-bold text-slate-300">
                {goalType === "daily" ? "Daily Bounty:" : "Epic Milestone Bounty (2x):"}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>+{finalXp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-yellow-300">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span>+{finalGold} Gold</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-black text-white shadow-xl shadow-purple-600/30 hover:brightness-110 active:scale-95 cursor-pointer"
              >
                Accept {goalType === "daily" ? "Daily Goal" : "Milestone"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
