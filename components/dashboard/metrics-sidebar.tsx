"use client";

import { useRPGStore } from "@/lib/store";
import { ActivityRings } from "@/components/ui/circular-progress";
import { Flame, Award, Check } from "lucide-react";
import { StatType } from "@/types/rpg";

const SECTORS: { key: StatType; label: string; color: string }[] = [
  { key: "strength", label: "Strength", color: "bg-rose-500" },
  { key: "intellect", label: "Intellect", color: "bg-cyan-500" },
  { key: "discipline", label: "Discipline", color: "bg-purple-500" },
  { key: "creativity", label: "Creativity", color: "bg-amber-500" },
  { key: "charisma", label: "Charisma", color: "bg-emerald-500" },
];

export function MetricsSidebar() {
  const player = useRPGStore((state) => state.player);
  const goals = useRPGStore((state) => state.goals);
  const badges = useRPGStore((state) => state.badges);

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const taskPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const xpPercentage = Math.min(100, (player.currentXp / player.xpToNextLevel) * 100);

  const days = [
    { label: "S", completed: true },
    { label: "M", completed: true },
    { label: "T", completed: true },
    { label: "W", completed: true },
    { label: "T", completed: false, isToday: true },
    { label: "F", completed: false },
    { label: "S", completed: false },
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 border-l border-subtle bg-[#0c0e14] p-5 space-y-6">
      {/* Activity Rings Section (Apple Fitness Inspired) */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Daily Activity
        </div>

        <div className="flex items-center gap-4 productivity-card rounded-xl p-4">
          <ActivityRings
            size={96}
            outerValue={taskPercentage}
            innerValue={xpPercentage}
            outerColor="#10b981"
            innerColor="#6366f1"
          />

          <div className="space-y-2 text-xs min-w-0 flex-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Tasks
                </span>
                <span className="font-mono text-slate-400">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  XP
                </span>
                <span className="font-mono text-slate-400">
                  {player.currentXp}/{player.xpToNextLevel}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 border-t border-subtle">
              Level {player.level + 1} in{" "}
              <strong className="text-slate-300">
                {player.xpToNextLevel - player.currentXp} XP
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Habit Matrix (GitHub/Linear Heat Tracker) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            7-Day Consistency
          </span>
          <span className="flex items-center gap-1 font-mono text-orange-400 text-xs">
            <Flame className="h-3 w-3" />
            {player.currentStreak}d streak
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 productivity-card rounded-xl p-3 text-center">
          {days.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-400 font-mono">{d.label}</span>
              <div
                className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] transition-all ${
                  d.completed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : d.isToday
                    ? "border border-indigo-500 text-indigo-300 bg-indigo-500/10"
                    : "bg-white/[0.03] text-slate-600 border border-subtle"
                }`}
              >
                {d.completed && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Attributes Breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
          Attributes Distribution
        </div>

        <div className="space-y-2 productivity-card rounded-xl p-3.5">
          {SECTORS.map((s) => {
            const value = player.stats[s.key] ?? 10;
            const percentage = Math.min(100, Math.round((value / 30) * 100));

            return (
              <div key={s.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{s.label}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{value} pts</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones / Badges Unlocked */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
          Recent Milestones
        </div>

        <div className="grid grid-cols-2 gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-lg p-2.5 border text-xs transition-all ${
                b.unlocked
                  ? "bg-white/[0.02] border-subtle text-slate-200"
                  : "bg-transparent border-white/[0.03] text-slate-600 opacity-50"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Award
                  className={`h-3.5 w-3.5 ${
                    b.unlocked ? "text-amber-400" : "text-slate-600"
                  }`}
                />
                <span className="font-semibold truncate">{b.title}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{b.requirement}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
