"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Coins,
  Volume2,
  VolumeX,
  Database,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { sounds } from "@/lib/sound";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

export function Navbar() {
  const pathname = usePathname();
  const player = useRPGStore((state) => state.player);
  const backendConnected = useRPGStore((state) => state.backendConnected);
  const isLoggedIn = useRPGStore((state) => state.isLoggedIn);
  const currentUser = useRPGStore((state) => state.currentUser);
  const checkBackendStatus = useRPGStore((state) => state.checkBackendStatus);
  const openAuthModal = useRPGStore((state) => state.openAuthModal);
  const logoutUser = useRPGStore((state) => state.logoutUser);

  const [soundActive, setSoundActive] = useState(true);

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(() => {
      checkBackendStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, [checkBackendStatus]);

  const xpPercentage = Math.min(
    100,
    Math.round((player.currentXp / player.xpToNextLevel) * 100)
  );

  const toggleSound = () => {
    sounds.enabled = !soundActive;
    setSoundActive(!soundActive);
    if (!soundActive) sounds.playClick();
  };

  const navItems = [
    { name: "Personal Protocol", href: "/" },
    { name: "Squad Arena", href: "/leaderboard" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e5b869] to-[#c59a4c] text-slate-950 font-black text-sm shadow-md shadow-amber-500/10 transition-transform group-hover:scale-105">
                ◈
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-extrabold tracking-[0.22em] uppercase text-white font-mono">
                  Questify
                </span>
                <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-mono tracking-widest text-[#e5b869] bg-[#e5b869]/10 border border-[#e5b869]/20 uppercase">
                  Neon Edition
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/" && pathname === "/dashboard");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      isActive
                        ? "text-white bg-white/[0.07] font-semibold border border-white/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Cloud DB Status & Metrics */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Neon Cloud Database Status Badge */}
            <button
              onClick={openAuthModal}
              title={
                backendConnected
                  ? "Spring Boot + Neon PostgreSQL: Online"
                  : "Connecting to backend..."
              }
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
                backendConnected
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15"
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/15"
              }`}
            >
              <Database
                className={`h-3 w-3 ${
                  backendConnected ? "text-emerald-400 animate-pulse" : "text-amber-400"
                }`}
              />
              <span className="hidden sm:inline">
                {backendConnected ? "Neon DB" : "Offline"}
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              title={soundActive ? "Audio Feedback Active" : "Audio Muted"}
            >
              {soundActive ? (
                <Volume2 className="h-3.5 w-3.5 text-[#10b981]" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>

            {/* Streak Flame Pill */}
            <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs font-mono font-semibold text-orange-400">
              <Flame className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
              <span>{player.currentStreak}d</span>
            </div>

            {/* Gold Pill */}
            <div className="flex items-center gap-1.5 rounded-lg bg-[#e5b869]/10 border border-[#e5b869]/25 px-2.5 py-1 text-xs font-mono font-bold text-[#e5b869]">
              <Coins className="h-3.5 w-3.5 text-[#e5b869]" />
              <span>{player.gold}</span>
            </div>

            {/* User Profile / Auth Action */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#161922] border border-[#e5b869]/40 text-xs font-mono font-bold text-[#e5b869]">
                  {player.level}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-xs font-semibold text-white truncate max-w-[90px]">
                    {player.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {xpPercentage}% XP
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  title="Sign Out"
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer rounded"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] px-3 py-1.5 text-xs font-mono font-bold text-slate-950 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
