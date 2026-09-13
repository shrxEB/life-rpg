"use client";

import { useState, useMemo } from "react";
import { Flame, Calendar, Info, Sparkles } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { WeeklyDays } from "@/types/rpg";

interface DayData {
  date: string;
  dateObj: Date;
  count: number;
  isToday: boolean;
  dayOfWeek: number; // 0 = Sun, 1 = Mon ...
  monthLabel?: string;
}

export function ActivityHeatmap() {
  const goals = useRPGStore((state) => state.goals);
  const player = useRPGStore((state) => state.player);

  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  // Calculate live count of completed daily goals today
  const todayCompletedCount = goals.filter(
    (g) => g.goalType === "daily" && g.completed
  ).length;

  // Generate 16 weeks of real data (~112 days) ending today
  const { weeks, totalCompletedInCycle } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: DayData[] = [];
    const totalDays = 16 * 7; // 16 full weeks (112 days)

    const streak = Math.max(0, player.currentStreak || 0);

    // Calculate beginning of current week (Sunday)
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());
    currentWeekSunday.setHours(0, 0, 0, 0);

    const dayKeys: (keyof WeeklyDays)[] = [
      "sun",
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
    ];

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const isToday = i === 0;
      let count = 0;

      if (isToday) {
        // Real count of tasks completed today
        count = todayCompletedCount;
      } else if (d >= currentWeekSunday && d <= today) {
        // For earlier days in the current calendar week, check goals weekly matrix from Neon DB
        const dayKey = dayKeys[d.getDay()];
        const completedThisDay = goals.filter(
          (g) => g.weeklyDays && g.weeklyDays[dayKey]
        ).length;
        count = completedThisDay;
      } else if (i < streak) {
        // Verified consecutive active days in player's current streak
        count = 1;
      } else {
        // Zero activity for past unrecorded days (no fake dummy data)
        count = 0;
      }

      days.push({
        date: d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        dateObj: d,
        count,
        isToday,
        dayOfWeek: d.getDay(),
      });
    }

    // Group into columns of 7 days (weeks)
    const weekCols: DayData[][] = [];
    for (let w = 0; w < 16; w++) {
      weekCols.push(days.slice(w * 7, (w + 1) * 7));
    }

    const total = days.reduce((sum, d) => sum + d.count, 0);

    return { weeks: weekCols, totalCompletedInCycle: total };
  }, [todayCompletedCount, goals, player.currentStreak]);

  // Color intensity mapping based on completed tasks count
  const getCellClasses = (count: number, isToday: boolean) => {
    let bg = "bg-white/[0.03] border-white/[0.05]";

    if (count === 1) {
      bg = "bg-[#064e3b] border-[#065f46]/80"; // Deep Forest Emerald
    } else if (count === 2) {
      bg = "bg-[#047857] border-[#059669]"; // Mid Emerald
    } else if (count === 3) {
      bg = "bg-[#10b981] border-[#34d399]/70"; // Nordic Sage Emerald
    } else if (count >= 4) {
      bg = "bg-[#34d399] border-[#e5b869] shadow-sm shadow-[#10b981]/40"; // Luminous Emerald + Gold Rim
    }

    const todayRing = isToday ? "ring-1.5 ring-[#e5b869] ring-offset-1 ring-offset-[#101217]" : "";

    return `${bg} ${todayRing}`;
  };

  // Month labels across the 16-week grid
  const monthLabels = useMemo(() => {
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, colIdx) => {
      const firstDay = week[0]?.dateObj;
      if (firstDay && firstDay.getMonth() !== lastMonth) {
        lastMonth = firstDay.getMonth();
        months.push({
          label: firstDay.toLocaleDateString("en-US", { month: "short" }),
          colIndex: colIdx,
        });
      }
    });

    return months;
  }, [weeks]);

  return (
    <div className="rounded-3xl titanium-panel p-5 sm:p-6 backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
            <Calendar className="h-4 w-4 text-[#10b981]" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Contribution Heatmap
            </h3>
            <p className="text-[11px] text-slate-400">
              Daily habit commits & consistency ledger
            </p>
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-mono font-semibold text-orange-400">
          <Flame className="h-3.5 w-3.5 animate-pulse" />
          <span>{player.currentStreak}d Streak</span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-1 pt-1">
        <div className="min-w-[440px] space-y-2">
          {/* Month Headers */}
          <div className="grid grid-cols-16 text-[10px] font-mono text-slate-500 pl-7">
            {weeks.map((week, idx) => {
              const month = monthLabels.find((m) => m.colIndex === idx);
              return (
                <div key={idx} className="truncate">
                  {month ? month.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid with Day-of-Week labels */}
          <div className="flex gap-2">
            {/* Day Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 pr-1 py-0.5 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* 16 Columns of 7 Days */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
              {weeks.map((week, colIdx) =>
                week.map((day, rowIdx) => (
                  <div
                    key={`${colIdx}-${rowIdx}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-3.5 w-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer hover:scale-125 hover:z-20 ${getCellClasses(
                      day.count,
                      day.isToday
                    )}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Hover Tooltip / Status Display */}
      <div className="min-h-[26px] flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 text-xs font-mono">
        {hoveredDay ? (
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">{hoveredDay.date}:</span>
            <span className={hoveredDay.count > 0 ? "text-[#10b981] font-bold" : "text-slate-500"}>
              {hoveredDay.count === 0
                ? "No daily goals logged"
                : `${hoveredDay.count} daily ${hoveredDay.count === 1 ? "habit" : "habits"} finished`}
            </span>
            {hoveredDay.isToday && (
              <span className="rounded bg-[#e5b869]/15 border border-[#e5b869]/30 px-1 py-0.2 text-[9px] text-[#e5b869] font-bold uppercase">
                Today
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="h-3 w-3 text-[#e5b869]" />
            <span>
              <strong>{totalCompletedInCycle} verified {totalCompletedInCycle === 1 ? "habit" : "habits"}</strong> logged in current cycle ({player.currentStreak}d streak active).
            </span>
          </div>
        )}

        {/* GitHub-Style Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 select-none">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-[3px] bg-white/[0.03] border border-white/[0.05]" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-[#064e3b] border border-[#065f46]" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-[#047857] border border-[#059669]" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-[#10b981] border border-[#34d399]" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-[#34d399] border border-[#e5b869]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
