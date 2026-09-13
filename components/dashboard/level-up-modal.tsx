"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, Award, Shield, ArrowRight } from "lucide-react";
import { useRPGStore } from "@/lib/store";

export function LevelUpModal() {
  const celebration = useRPGStore((state) => state.levelUpCelebration);
  const dismissLevelUp = useRPGStore((state) => state.dismissLevelUp);
  const addGold = useRPGStore((state) => state.addGold);

  useEffect(() => {
    if (celebration?.isOpen) {
      // Fire confetti burst!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#A855F7", "#F59E0B", "#10B981", "#3B82F6"],
      });

      // Secondary burst
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);

      return () => clearTimeout(timeout);
    }
  }, [celebration]);

  if (!celebration?.isOpen) return null;

  const handleClaim = () => {
    addGold(50); // Level-up bounty bonus
    dismissLevelUp();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Darkened Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClaim}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-violet-500/40 bg-gradient-to-b from-[#141b36] to-[#0a0e1c] p-8 text-center shadow-2xl glow-purple"
        >
          {/* Decorative Top Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-violet-600/40 blur-3xl" />

          {/* Level Badge Aura */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-violet-500 to-purple-600 animate-pulse blur-md opacity-75" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-xl border border-white/20">
              <span className="text-3xl font-black text-white">
                {celebration.newLevel}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-black text-amber-300 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Level Up Achieved!
            </span>
            <h2 className="mt-3 text-2xl font-black text-white tracking-tight">
              You Reached Level {celebration.newLevel}!
            </h2>
            <p className="mt-1 text-sm font-semibold text-violet-300">
              New Title: &ldquo;{celebration.title}&rdquo;
            </p>
          </div>

          {/* Unlocked Rewards List */}
          <div className="mt-6 space-y-2 rounded-2xl bg-black/30 border border-white/10 p-4 text-left text-xs">
            <div className="flex items-center gap-2.5 text-slate-200">
              <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Level Bounty: <strong>+50 Gold Coins</strong> added</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Attributes boosted & vitality fully restored</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Award className="h-4 w-4 text-violet-400 shrink-0" />
              <span>Next tier quest multipliers unlocked</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClaim}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-3.5 text-sm font-black text-white shadow-xl shadow-purple-600/40 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <span>Claim Rewards & Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
