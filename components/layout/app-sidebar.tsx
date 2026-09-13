"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Calendar,
  Flame,
  Layers,
  Dumbbell,
  Brain,
  Target,
  Palette,
  Users,
  Coins,
  Package,
  Sparkles,
  Command,
  Plus,
} from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { SingleRing } from "@/components/ui/circular-progress";
import { StatType } from "@/types/rpg";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface AppSidebarProps {
  activeSector: string;
  onSelectSector: (sector: string) => void;
  onOpenNewTask: () => void;
}

export function AppSidebar({
  activeSector,
  onSelectSector,
  onOpenNewTask,
}: AppSidebarProps) {
  const pathname = usePathname();
  const player = useRPGStore((state) => state.player);
  const goals = useRPGStore((state) => state.goals);
  const openMysteryChest = useRPGStore((state) => state.openMysteryChest);

  const pendingCount = goals.filter((g) => !g.completed).length;
  const xpPercentage = Math.min(
    100,
    Math.round((player.currentXp / player.xpToNextLevel) * 100)
  );

  const handleOpenChest = async () => {
    if (player.mysteryChests <= 0) return;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#6366f1", "#10b981", "#f59e0b"],
    });
    const reward = await openMysteryChest();
    if (reward) {
      toast.success("Mystery Chest Claimed", {
        description: `+${reward.gold} Gold • +${reward.xp} XP added to your profile.`,
      });
    }
  };

  const sectors: { key: StatType; label: string; color: string; icon: any }[] = [
    { key: "strength", label: "Strength", color: "bg-rose-500", icon: Dumbbell },
    { key: "intellect", label: "Intellect", color: "bg-cyan-500", icon: Brain },
    { key: "discipline", label: "Discipline", color: "bg-purple-500", icon: Target },
    { key: "creativity", label: "Creativity", color: "bg-amber-500", icon: Palette },
    { key: "charisma", label: "Charisma", color: "bg-emerald-500", icon: Users },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-subtle bg-[#0c0e14] flex flex-col justify-between p-4 h-auto lg:min-h-screen">
      <div className="space-y-6">
        {/* Workspace Brand & Profile Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-3">
            <SingleRing size={38} strokeWidth={3.5} value={xpPercentage} color="#6366f1">
              <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-200">
                {player.name.charAt(0)}
              </div>
            </SingleRing>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{player.name}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Level {player.level} • {xpPercentage}%
              </div>
            </div>
          </div>

          <button
            onClick={onOpenNewTask}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            title="New Task (N)"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Views */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectSector("all")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
              activeSector === "all"
                ? "bg-white/10 text-white font-semibold"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="h-4 w-4 text-indigo-400" />
              <span>Today</span>
            </div>
            {pendingCount > 0 && (
              <span className="rounded-full bg-indigo-500/20 text-indigo-300 px-2 py-0.5 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <Link
            href="/goals"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Habits & Routine</span>
            </div>
          </Link>

          <Link
            href="/awards"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-slate-400" />
              <span>Milestones</span>
            </div>
          </Link>
        </div>

        {/* Sectors / Attributes List */}
        <div>
          <div className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Sectors
          </div>
          <div className="space-y-0.5">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              const isSelected = activeSector === sector.key;
              const sectorGoals = goals.filter((g) => g.stat === sector.key);
              const sectorPoints = player.stats[sector.key] ?? 10;

              return (
                <button
                  key={sector.key}
                  onClick={() => onSelectSector(sector.key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white/10 text-white font-semibold"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${sector.color}`} />
                    <span>{sector.label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {sectorPoints}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Metrics & Chest Pill */}
      <div className="pt-4 border-t border-subtle space-y-2">
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span>{player.currentStreak}d Streak</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Coins className="h-3.5 w-3.5 text-yellow-400" />
            <span>{player.gold}</span>
          </div>
        </div>

        {player.mysteryChests > 0 && (
          <button
            onClick={handleOpenChest}
            className="flex w-full items-center justify-between rounded-lg bg-indigo-950/40 border border-indigo-500/20 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-indigo-400" />
              <span>{player.mysteryChests} Chest Available</span>
            </div>
            <span className="text-[10px] text-indigo-300/80 underline">Claim</span>
          </button>
        )}
      </div>
    </aside>
  );
}
