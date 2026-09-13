"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PlayerHUD } from "@/components/dashboard/player-hud";
import { QuestList } from "@/components/dashboard/quest-list";
import { CharacterSheet } from "@/components/dashboard/character-sheet";
import { SquadArena } from "@/components/friends/squad-arena";
import { AddQuestModal } from "@/components/dashboard/add-quest-modal";
import { LootChestModal } from "@/components/dashboard/loot-chest-modal";
import { LevelUpModal } from "@/components/dashboard/level-up-modal";
import { Target, Users, Database, User, Plus, Sparkles, Shield } from "lucide-react";
import { useRPGStore } from "@/lib/store";

export function DashboardView() {
  const [activeTab, setActiveTab] = useState<"personal" | "squad">("personal");
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
  const [isLootChestOpen, setIsLootChestOpen] = useState(false);
  const party = useRPGStore((state) => state.party);
  const player = useRPGStore((state) => state.player);
  const isLoggedIn = useRPGStore((state) => state.isLoggedIn);
  const backendConnected = useRPGStore((state) => state.backendConnected);
  const openAuthModal = useRPGStore((state) => state.openAuthModal);

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-100 flex flex-col selection:bg-[#e5b869]/20 selection:text-[#e5b869] relative">
      {/* Subtle Specular Ambient Lighting - Zero Gaudy Neon */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(229,184,105,0.06),rgba(255,255,255,0))]" />

      {/* Luxury Brand Navbar */}
      <Navbar />

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Status & Context Bar */}
        {isLoggedIn ? (
          <div className="rounded-2xl titanium-panel p-4 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#e5b869]/20 bg-gradient-to-r from-[#e5b869]/[0.08] via-white/[0.02] to-emerald-500/[0.04]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5b869]/10 border border-[#e5b869]/30 text-[#e5b869] shadow-inner">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e5b869]">
                    Cloud Protocol Active
                  </span>
                  <span className="flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
                    <Database className="h-3 w-3 animate-pulse" />
                    Neon PostgreSQL Synced
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Welcome back, <strong className="text-white font-semibold">{player.name}</strong> • Level {player.level} {player.title} • {player.gold} Gold • {player.currentStreak}d Streak
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsAddQuestOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#e5b869] px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 shadow-md shadow-[#e5b869]/15 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Deploy Quest</span>
              </button>
              {player.mysteryChests > 0 && (
                <button
                  onClick={() => setIsLootChestOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#e5b869]/15 border border-[#e5b869]/30 px-3 py-1.5 text-xs font-mono font-bold text-[#e5b869] hover:bg-[#e5b869]/25 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Open Cache ({player.mysteryChests})</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl titanium-panel p-4 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                    Guest Protocol Active
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                    Local Session
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in or create a hero profile to permanently store habits, streaks, and squad data in Neon PostgreSQL.
                </p>
              </div>
            </div>

            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] px-4 py-2 text-xs font-mono font-bold text-slate-950 shadow-md shadow-[#e5b869]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer self-end sm:self-auto"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}

        {/* 1. Watchmaker Chronograph Circular Daily Progress Core */}
        <PlayerHUD
          onOpenAddQuest={() => setIsAddQuestOpen(true)}
          onOpenLootChest={() => setIsLootChestOpen(true)}
        />

        {/* 2. Seamless Workspace Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "personal"
                  ? "bg-[#e5b869] text-slate-950 shadow-md shadow-[#e5b869]/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              Personal Protocol
            </button>
            <button
              onClick={() => setActiveTab("squad")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "squad"
                  ? "bg-[#e5b869] text-slate-950 shadow-md shadow-[#e5b869]/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Squad Arena [{party.tag}]
              <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-bold">
                {party.members.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Invite Token:</span>
            <span className="rounded-lg bg-black/40 border border-[#e5b869]/30 px-2 py-0.5 text-[#e5b869] font-bold">
              {party.inviteCode}
            </span>
          </div>
        </div>

        {/* 3. Dynamic View: Personal Protocol vs Squad Arena */}
        {activeTab === "personal" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Dual-Mode Goals Workspace (Daily Goals vs Milestones) */}
            <div className="lg:col-span-8 space-y-6">
              <QuestList onOpenAddQuest={() => setIsAddQuestOpen(true)} />
            </div>

            {/* Right Column: Performance Attribute Matrix & Party Telemetry */}
            <div className="lg:col-span-4 space-y-6">
              <CharacterSheet />
            </div>
          </div>
        ) : (
          <SquadArena />
        )}
      </main>


      {/* Modals */}
      <AddQuestModal
        isOpen={isAddQuestOpen}
        onClose={() => setIsAddQuestOpen(false)}
      />
      <LootChestModal
        isOpen={isLootChestOpen}
        onClose={() => setIsLootChestOpen(false)}
      />
      <LevelUpModal />
    </div>
  );
}
