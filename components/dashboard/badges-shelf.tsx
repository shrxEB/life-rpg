"use client";

import Link from "next/link";
import { Trophy, Sword, Flame, Shield, BookOpen, Lock, ChevronRight } from "lucide-react";
import { useRPGStore } from "@/lib/store";

const ICON_MAP: Record<string, any> = {
  Sword,
  Flame,
  Shield,
  BookOpen,
};

export function BadgesShelf() {
  const badges = useRPGStore((state) => state.badges);

  return (
    <div className="rounded-2xl glass-card border border-white/10 p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Trophy Shelf</h2>
            <p className="text-[11px] text-slate-400">Achievements & Medals</p>
          </div>
        </div>

        <Link
          href="/awards"
          className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-0.5 transition-colors"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Badges Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {badges.map((badge) => {
          const Icon = ICON_MAP[badge.icon] || Trophy;

          return (
            <div
              key={badge.id}
              className={`relative overflow-hidden rounded-xl border p-3 transition-all ${
                badge.unlocked
                  ? "bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent border-amber-500/30 shadow-sm"
                  : "bg-slate-900/40 border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                    badge.unlocked
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-md shadow-amber-500/20"
                      : "bg-slate-800 text-slate-500 border-white/10"
                  }`}
                >
                  {badge.unlocked ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {badge.requirement}
                  </p>
                  {badge.unlocked && badge.unlockedAt && (
                    <span className="inline-block mt-1 text-[9px] font-semibold text-amber-400/90">
                      Unlocked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
