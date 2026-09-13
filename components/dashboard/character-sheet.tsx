"use client";

import { Shield, Dumbbell, Brain, Target, Palette, Users, Activity } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";

const ATTRIBUTES = [
  { key: "strength", label: "Strength", icon: Dumbbell, color: "text-rose-400", bar: "bg-rose-500" },
  { key: "intellect", label: "Intellect", icon: Brain, color: "text-sky-400", bar: "bg-sky-500" },
  { key: "discipline", label: "Discipline", icon: Target, color: "text-[#e5b869]", bar: "bg-[#e5b869]" },
  { key: "creativity", label: "Creativity", icon: Palette, color: "text-amber-400", bar: "bg-amber-500" },
  { key: "charisma", label: "Charisma", icon: Users, color: "text-emerald-400", bar: "bg-emerald-500" },
];

export function CharacterSheet() {
  const player = useRPGStore((state) => state.player);
  const activityFeed = useRPGStore((state) => state.party.activityFeed);

  // Dynamically determine archetype from highest trained attribute in PostgreSQL
  const highestStatEntry = Object.entries(player.stats).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["discipline", 10]
  );
  const ARCHETYPE_MAP: Record<string, string> = {
    strength: "Vanguard Titan",
    intellect: "Arcane Technomancer",
    discipline: "Zen Sentinel",
    creativity: "Visionary Artisan",
    charisma: "Sovereign Envoy",
  };
  const archetype =
    highestStatEntry[1] > 10
      ? ARCHETYPE_MAP[highestStatEntry[0]] || "Ascendant Pathfinder"
      : "Balanced Pathfinder";

  const rankTier =
    player.level >= 20
      ? "S"
      : player.level >= 15
      ? "A"
      : player.level >= 10
      ? "B"
      : player.level >= 5
      ? "C"
      : player.level >= 2
      ? "D"
      : "E";

  // Dynamic maximum scale so progress bars grow with player progression
  const maxStat = Math.max(
    25,
    ...ATTRIBUTES.map((a) => player.stats[a.key] || 10)
  );

  const totalStatPoints = Object.values(player.stats).reduce(
    (sum, val) => sum + (typeof val === "number" ? val : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* 1. Attributes Telemetry Panel */}
      <div className="rounded-3xl titanium-panel p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
              <Shield className="h-4 w-4 text-[#e5b869]" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Attributes Matrix
              </h3>
              <p className="text-[11px] text-slate-400">
                {player.title} • {archetype}
              </p>
            </div>
          </div>

          <span className="rounded bg-[#e5b869]/10 border border-[#e5b869]/25 px-2 py-0.5 text-[10px] font-mono font-bold text-[#e5b869] uppercase">
            Rank {rankTier}
          </span>
        </div>

        {/* 5 Stats Sparklines */}
        <div className="mt-4 space-y-2.5">
          {ATTRIBUTES.map((attr) => {
            const Icon = attr.icon;
            const points = player.stats[attr.key] ?? 10;
            const barWidth = Math.min(100, Math.round((points / maxStat) * 100));
            const isBoosted = points > 10;

            return (
              <div
                key={attr.key}
                className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5 px-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-3.5 w-3.5 ${attr.color}`} />
                  <span className="text-xs font-medium text-slate-200">
                    {attr.label}
                  </span>
                  {isBoosted && (
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/25 px-1 py-0.2 text-[9px] font-mono text-emerald-400 font-bold">
                      +{points - 10}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${attr.bar} transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-300 w-12 text-right">
                    {points} <span className="text-[10px] text-slate-400">pts</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Power Score Telemetry (Calculated from PostgreSQL stats) */}
        <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Calculated Power Score:</span>
          <span className="font-bold text-[#e5b869] flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3 text-[#e5b869]" />
            {player.powerScore || (player.level * 200 + player.currentXp + player.currentStreak * 50 + totalStatPoints * 10)}
          </span>
        </div>
      </div>

      {/* 2. GitHub-Style Daily Activity & Contribution Heatmap */}
      <ActivityHeatmap />

      {/* 3. Live Ticker / Global Telemetry */}
      <div className="rounded-3xl titanium-panel p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-[#10b981] animate-pulse" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Live Cloud Ticker
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Neon Live Feed</span>
        </div>

        <div className="mt-3 space-y-2">
          {activityFeed.length > 0 ? (
            activityFeed.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.04] p-2 px-2.5 text-xs"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <span className="font-semibold text-slate-200">{log.username} </span>
                  <span className="text-slate-400">{log.action}</span>
                </div>
                {log.xpGained > 0 && (
                  <span className="font-mono font-bold text-[#e5b869] shrink-0 text-[11px]">
                    +{log.xpGained} XP
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-xs font-mono text-slate-500">
              No recent activity recorded yet. Check off a habit to broadcast!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
