"use client";

import { motion } from "motion/react";
import { Plus, Check, Trophy, Sparkles, Coins, Flame, Dumbbell, Brain, Target, Palette, Users, Trash2 } from "lucide-react";
import { Goal } from "@/types/rpg";
import { useRPGStore } from "@/lib/store";
import { sounds } from "@/lib/sound";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface LongTermGoalCardProps {
  goal: Goal;
}

const SECTOR_CONFIG: Record<
  string,
  { label: string; icon: any; color: string }
> = {
  strength: { label: "Strength", icon: Dumbbell, color: "text-rose-400" },
  intellect: { label: "Intellect", icon: Brain, color: "text-sky-400" },
  discipline: { label: "Discipline", icon: Target, color: "text-[#e5b869]" },
  creativity: { label: "Creativity", icon: Palette, color: "text-amber-400" },
  charisma: { label: "Charisma", icon: Users, color: "text-emerald-400" },
};

export function LongTermGoalCard({ goal }: LongTermGoalCardProps) {
  const incrementLongTermGoal = useRPGStore((state) => state.incrementLongTermGoal);
  const deleteGoal = useRPGStore((state) => state.deleteGoal);

  const sector = SECTOR_CONFIG[goal.stat] || SECTOR_CONFIG.discipline;
  const SectorIcon = sector.icon;

  const current = goal.currentValue || 0;
  const target = goal.targetValue || 10;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isCompleted = current >= target || goal.completed;

  const handleIncrement = () => {
    if (isCompleted) return;

    sounds.playQuestComplete();
    incrementLongTermGoal(goal.id, 1);

    if (current + 1 >= target) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e5b869", "#10b981", "#ffffff"],
      });
      toast.success(`Milestone Achieved: "${goal.title}"`, {
        description: `+${goal.xpReward} XP • +${goal.goldReward} Gold • +3 ${sector.label} added!`,
      });
    } else {
      toast.info(`Logged +1 ${goal.unit || "Step"}`, {
        description: `${current + 1} / ${target} ${goal.unit || ""} (${Math.round(((current + 1) / target) * 100)}%)`,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-150 ${
        isCompleted
          ? "bg-[#0b0e14]/60 border-[#10b981]/30 opacity-75"
          : "titanium-panel titanium-panel-hover border-white/[0.08]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Information */}
        <div className="space-y-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#e5b869] bg-[#e5b869]/10 border border-[#e5b869]/25 uppercase flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Milestone
            </span>

            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-white/[0.04] text-slate-300">
              <SectorIcon className={`h-3 w-3 ${sector.color}`} />
              <span>{sector.label}</span>
            </span>

            {goal.streak > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-mono text-orange-400">
                <Flame className="h-3 w-3" />
                {goal.streak}d active
              </span>
            )}
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {goal.description}
              </p>
            )}
          </div>

          {/* 4px Precision Metallic Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                {current} / {target} {goal.unit || "units"}
              </span>
              <span className={isCompleted ? "text-[#10b981] font-bold" : "text-[#e5b869] font-bold"}>
                {percentage}% Completed
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-black/60 border border-white/[0.06] overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  isCompleted
                    ? "bg-[#10b981]"
                    : "bg-gradient-to-r from-[#10b981] via-[#c59a4c] to-[#e5b869]"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>

        {/* Right Actions & Bounties */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#e5b869]/10 border border-[#e5b869]/25 px-2 py-0.5 text-xs font-mono font-bold text-[#e5b869]">
              +{goal.xpReward} XP
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 text-xs font-mono text-slate-300">
              +{goal.goldReward} G
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                onClick={handleIncrement}
                className="flex items-center gap-1.5 rounded-lg bg-[#e5b869] px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer font-mono"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Log +1 {goal.unit || "Step"}</span>
              </button>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-[#10b981]">
                <Check className="h-4 w-4 stroke-[3]" />
                Achieved
              </span>
            )}

            <button
              onClick={() => deleteGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
              title="Remove Milestone"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
