"use client";

import { useRPGStore } from "@/lib/store";
import { Flame, Calendar, Check, Zap } from "lucide-react";

export function WeeklyTracker() {
  const player = useRPGStore((state) => state.player);
  const goals = useRPGStore((state) => state.goals);

  const days = [
    { key: "sun", label: "S", name: "Sun", count: 2 },
    { key: "mon", label: "M", name: "Mon", count: 4 },
    { key: "tue", label: "T", name: "Tue", count: 4 },
    { key: "wed", label: "W", name: "Wed", count: 3 },
    { key: "thu", label: "T", name: "Thu", count: 2, isToday: true },
    { key: "fri", label: "F", name: "Fri", count: 0 },
    { key: "sat", label: "S", name: "Sat", count: 0 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0c1024]/90 via-[#0d1430]/80 to-[#0c1024]/90 p-4 sm:p-5 backdrop-blur-xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Streak Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Weekly Discipline Matrix</h3>
              <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                {player.currentStreak}-Day Streak
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Best Record: <span className="text-amber-400 font-bold">{player.bestStreak} Days</span> • 7-day habit consistency
            </p>
          </div>
        </div>

        {/* 7-Day Matrix Pips */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {days.map((day) => {
            const isCompleted = day.count > 0;
            return (
              <div key={day.key} className="flex flex-col items-center gap-1.5">
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black transition-all ${
                    day.isToday
                      ? "border-violet-500 bg-violet-600/30 text-violet-200 ring-2 ring-violet-500/40 shadow-md shadow-violet-500/30"
                      : isCompleted
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/10"
                      : "border-white/5 bg-slate-900/60 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
                  ) : (
                    <span>{day.label}</span>
                  )}

                  {/* Dot pulse on current day */}
                  {day.isToday && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold ${
                    day.isToday ? "text-violet-300 font-bold" : "text-slate-400"
                  }`}
                >
                  {day.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
