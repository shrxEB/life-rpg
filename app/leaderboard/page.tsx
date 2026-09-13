"use client";

import { Navbar } from "@/components/layout/navbar";
import { SquadArena } from "@/components/friends/squad-arena";
import { LevelUpModal } from "@/components/dashboard/level-up-modal";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-100 flex flex-col selection:bg-[#e5b869]/20 selection:text-[#e5b869] relative">
      {/* Specular Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(229,184,105,0.06),rgba(255,255,255,0))]" />

      {/* Luxury Brand Navbar */}
      <Navbar />

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <SquadArena />
      </main>

      <LevelUpModal />
    </div>
  );
}
