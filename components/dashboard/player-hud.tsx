"use client";

import { motion } from "motion/react";
import { Sparkles, Flame, Coins, Package, Plus, Shield, Target, Award, CheckCircle2 } from "lucide-react";
import { useRPGStore } from "@/lib/store";

interface PlayerHUDProps {
  onOpenAddQuest: () => void;
  onOpenLootChest: () => void;
}

export function PlayerHUD({ onOpenAddQuest, onOpenLootChest }: PlayerHUDProps) {
  const player = useRPGStore((state) => state.player);
  const goals = useRPGStore((state) => state.goals);

  // Daily goals computation for the Chronograph Dial
  const dailyGoals = goals.filter(
    (g) => g.goalType === "daily" || (!g.goalType && g.frequency === "daily")
  );
  const completedDailyCount = dailyGoals.filter((g) => g.completed).length;
  const totalDailyCount = dailyGoals.length;
  const dailyPercentage =
    totalDailyCount > 0
      ? Math.round((completedDailyCount / totalDailyCount) * 100)
      : 0;

  const xpPercentage = Math.min(
    100,
    Math.round((player.currentXp / player.xpToNextLevel) * 100)
  );
  const xpNeeded = player.xpToNextLevel - player.currentXp;

  // Chronograph Dial SVG Math
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dailyPercentage / 100) * circumference;

  // 12 Analog Watchmaker Ticks
  const ticks = Array.from({ length: 12 });

  return (
    <div className="relative overflow-hidden rounded-3xl titanium-panel p-6 sm:p-8 backdrop-blur-xl">
      {/* Subtle Specular Top Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Watchmaker Chronograph Circular Dial (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90 transform overflow-visible"
            >
              <defs>
                <linearGradient id="chronograph-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#e5b869" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Animated Chronograph Progress Arc */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#chronograph-gradient)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="chronograph-dial"
              />
            </svg>

            {/* Analog Chronograph Ticks around inner ring */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {ticks.map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-white/[0.12] origin-center"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-${radius - 12}px)`,
                  }}
                />
              ))}
            </div>

            {/* Center Chronograph Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 pointer-events-none">
              <span
                className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                  dailyPercentage === 100 ? "text-[#e5b869]" : "text-white"
                }`}
              >
                {dailyPercentage}%
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#10b981] uppercase mt-0.5">
                {dailyPercentage === 100 ? "Protocol Cleared" : "Daily Goals"}
              </span>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                {completedDailyCount} of {totalDailyCount} Finished
              </span>
            </div>
          </div>
        </div>

        {/* Right: Character Telemetry & XP Progression (7 Columns) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#161922] border border-white/10 text-white shadow-inner">
                <Shield className="h-5 w-5 text-[#e5b869]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-white tracking-tight">
                    {player.name}
                  </h1>
                  <span className="rounded-md bg-[#e5b869]/10 border border-[#e5b869]/25 px-2 py-0.5 text-[10px] font-mono font-bold text-[#e5b869]">
                    LEVEL {player.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                  <Sparkles className="h-3 w-3 text-[#e5b869]" />
                  {player.title} • Power Score {player.powerScore || 700}
                </p>
              </div>
            </div>

            {/* Quick Loot Box Button */}
            <button
              onClick={onOpenLootChest}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold transition-all cursor-pointer ${
                player.mysteryChests > 0
                  ? "bg-[#e5b869]/10 border border-[#e5b869]/30 text-[#e5b869] hover:bg-[#e5b869]/20"
                  : "bg-white/[0.03] border border-white/[0.06] text-slate-500 opacity-60"
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>{player.mysteryChests} Loot Cache</span>
            </button>
          </div>

          {/* XP Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-medium">
              <span className="text-slate-300">
                Experience to Level {player.level + 1}
              </span>
              <span className="text-[#e5b869] font-bold">
                {player.currentXp} / {player.xpToNextLevel} XP ({xpPercentage}%)
              </span>
            </div>

            {/* Sleek Metallic 5px Progress Track */}
            <div className="h-2 w-full rounded-full bg-black/50 border border-white/[0.08] overflow-hidden p-px">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#10b981] via-[#c59a4c] to-[#e5b869]"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>{xpNeeded} XP to level promotion</span>
              <span className="text-slate-300 font-mono">+50 Gold on Level Up</span>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onOpenAddQuest}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Deploy New Goal</span>
            </button>

            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
              Checking off daily goals rotates the chronograph forward
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
