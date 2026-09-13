"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Flame, Coins, Sparkles, Dumbbell, Brain, Target, Palette, Users, Trash2 } from "lucide-react";
import { Goal, GoalDifficulty } from "@/types/rpg";
import { useRPGStore } from "@/lib/store";
import { sounds } from "@/lib/sound";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface QuestCardProps {
  goal: Goal;
}

const RARITY_THEMES: Record<
  GoalDifficulty,
  { label: string; border: string; badge: string; text: string }
> = {
  trivial: {
    label: "COMMON",
    border: "border-white/[0.06]",
    badge: "bg-white/[0.03] text-slate-400 border-white/[0.08]",
    text: "text-slate-400",
  },
  easy: {
    label: "RARE",
    border: "border-[#10b981]/25",
    badge: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
    text: "text-[#10b981]",
  },
  medium: {
    label: "EPIC",
    border: "border-[#38bdf8]/25",
    badge: "bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20",
    text: "text-[#38bdf8]",
  },
  hard: {
    label: "MYTHIC",
    border: "border-[#e5b869]/30",
    badge: "bg-[#e5b869]/10 text-[#e5b869] border-[#e5b869]/25",
    text: "text-[#e5b869]",
  },
  epic: {
    label: "LEGENDARY",
    border: "border-[#f43f5e]/30",
    badge: "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/25",
    text: "text-[#f43f5e]",
  },
};

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

export function QuestCard({ goal }: QuestCardProps) {
  const toggleGoal = useRPGStore((state) => state.toggleGoal);
  const deleteGoal = useRPGStore((state) => state.deleteGoal);

  const [showParticle, setShowParticle] = useState(false);

  const rarity = RARITY_THEMES[goal.difficulty] || RARITY_THEMES.medium;
  const sector = SECTOR_CONFIG[goal.stat] || SECTOR_CONFIG.discipline;
  const SectorIcon = sector.icon;

  const handleToggle = () => {
    toggleGoal(goal.id);

    if (!goal.completed) {
      sounds.playQuestComplete();
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1200);

      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#e5b869", "#10b981", "#ffffff"],
      });

      toast.success(`Goal Completed`, {
        description: `+${goal.xpReward} XP • +${goal.goldReward} Gold logged to your account.`,
      });
    } else {
      sounds.playClick();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-150 ${
        goal.completed
          ? "bg-[#0b0d11]/50 border-white/[0.04] opacity-60"
          : `titanium-panel titanium-panel-hover ${rarity.border}`
      }`}
    >
      {/* Floating XP Particle on Completion */}
      <AnimatePresence>
        {showParticle && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -35, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="pointer-events-none absolute right-16 top-2 z-30 flex items-center gap-1 rounded-md bg-[#e5b869] px-2.5 py-0.5 text-xs font-mono font-black text-slate-950 shadow-lg"
          >
            <Sparkles className="h-3 w-3" />
            <span>+{goal.xpReward} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4">
        {/* Left: Checkbox & Goal Title */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={`Toggle ${goal.title}`}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer ${
              goal.completed
                ? "border-[#10b981] bg-[#10b981] text-slate-950 shadow-sm"
                : "border-white/20 bg-transparent hover:border-[#e5b869]"
            }`}
          >
            {goal.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${rarity.badge}`}
              >
                {rarity.label}
              </span>

              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-white/[0.04] text-slate-300">
                <SectorIcon className={`h-3 w-3 ${sector.color}`} />
                <span>{sector.label}</span>
              </span>

              {goal.streak > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                  <Flame className="h-3 w-3" />
                  {goal.streak}d streak
                </span>
              )}
            </div>

            <h3
              className={`text-sm font-semibold tracking-tight transition-all ${
                goal.completed ? "line-through text-slate-500" : "text-slate-100 group-hover:text-white"
              }`}
            >
              {goal.title}
            </h3>

            {goal.description && (
              <p
                className={`text-xs mt-1.5 leading-relaxed transition-all ${
                  goal.completed
                    ? "line-through text-slate-600"
                    : "text-slate-300/90 font-normal"
                }`}
              >
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Bounties & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1 rounded-lg bg-[#e5b869]/10 border border-[#e5b869]/25 px-2 py-0.5 text-xs font-mono font-bold text-[#e5b869]">
            <span>+{goal.xpReward} XP</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 text-xs font-mono text-slate-300">
            <Coins className="h-3 w-3 text-slate-400" />
            <span>+{goal.goldReward}</span>
          </div>

          <button
            onClick={() => deleteGoal(goal.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
            title="Remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
