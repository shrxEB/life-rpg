"use client";

import { useState } from "react";
import { 
  Users, 
  Crown, 
  Flame, 
  Zap, 
  Copy, 
  Check, 
  Shield, 
  Clock, 
  Swords, 
  Sparkles, 
  Gift,
  Trophy,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { sounds } from "@/lib/sound";
import { JoinSquadModal } from "@/components/friends/join-squad-modal";

function renderAvatarBadge(avatar: string | undefined, name: string, size: "sm" | "md" | "lg" = "md") {
  if (avatar && (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("/"))) {
    return <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />;
  }

  const cleanName = (name || "Hero").trim();
  const initials = (avatar && avatar.length <= 3 && !avatar.includes("_"))
    ? avatar.toUpperCase()
    : cleanName.substring(0, 2).toUpperCase();

  const fontSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base sm:text-lg",
  };

  return (
    <span className={`font-mono font-black tracking-tight select-none ${fontSizes[size]}`}>
      {initials}
    </span>
  );
}

export function SquadArena() {
  const party = useRPGStore((state) => state.party);
  const player = useRPGStore((state) => state.player);
  const sendNudge = useRPGStore((state) => state.sendNudge);
  const claimRaidReward = useRPGStore((state) => state.claimRaidReward);
  const nudgeNotification = useRPGStore((state) => state.nudgeNotification);
  const dismissNudgeNotification = useRPGStore((state) => state.dismissNudgeNotification);

  const [copied, setCopied] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Dynamic ranking sorted by today's XP points descending
  const sortedMembers = [...party.members].sort((a, b) => {
    if (b.todayXp !== a.todayXp) return b.todayXp - a.todayXp;
    return b.todayGoalsCompleted - a.todayGoalsCompleted;
  });

  const top1 = sortedMembers[0];
  const top2 = sortedMembers[1];
  const top3 = sortedMembers[2];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(party.inviteCode);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNudge = (memberId: string) => {
    sendNudge(memberId);
    sounds.playHighFive();
  };

  const handleClaimRaid = () => {
    const reward = claimRaidReward();
    if (reward) {
      sounds.playChestOpen();
    }
  };

  const raidProgress = Math.min(
    100,
    Math.round((party.raidBoss.currentXp / party.raidBoss.targetXp) * 100)
  );

  return (
    <div className="space-y-6">
      {/* 1. Squad Header & Tactical Command Bar */}
      <div className="rounded-3xl titanium-panel p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden">
        {/* Hairline ambient illumination */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e5b869]/5 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          {/* Guild Identity */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5b869]/10 border border-[#e5b869]/30 text-[#e5b869] text-xl font-black font-mono shadow-lg shadow-[#e5b869]/10">
              ◈
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
                  {party.name}
                </h2>
                <span className="rounded px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-[#e5b869] bg-[#e5b869]/10 border border-[#e5b869]/25 uppercase">
                  [{party.tag}]
                </span>
                <span className="rounded px-2 py-0.5 text-[10px] font-mono font-semibold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/25">
                  {party.members.length > 0 ? `${party.members.length} Member Syndicate` : "Solo Protocol"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 max-w-xl">
                {party.description}
              </p>
            </div>
          </div>

          {/* Action Row: Invite Code & Join Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 1-Click Copy Invite Code */}
            <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-1 pl-3 gap-2">
              <div className="text-left">
                <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
                  Invite Code
                </div>
                <div className="text-xs font-mono font-bold text-[#e5b869] tracking-wider">
                  {party.inviteCode}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Invite Code to Clipboard"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#10b981]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Switch / Join Squad Modal Trigger */}
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-2 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-[#e5b869]" />
              Squad Protocol
            </button>
          </div>
        </div>

        {/* Tactical Status Ribbon */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5 px-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Friends</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{party.members.length} Grinders</span>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5 px-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Daily Reset In</span>
            <span className="text-sm font-bold text-orange-400 mt-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {23 - new Date().getHours()}h {59 - new Date().getMinutes()}m
            </span>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5 px-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Co-Op Damage</span>
            <span className="text-sm font-bold text-[#e5b869] mt-0.5 block">
              {party.raidBoss.currentXp} XP / {party.raidBoss.targetXp} XP
            </span>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5 px-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Your Daily Rank</span>
            <span className="text-sm font-bold text-[#10b981] mt-0.5 block">
              {sortedMembers.length > 0
                ? `#${sortedMembers.findIndex((m) => m.isCurrentUser) + 1} of ${sortedMembers.length}`
                : "Solo (Unranked)"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Daily Competition Podium */}
      <div className="rounded-3xl titanium-panel p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
              <Trophy className="h-4 w-4 text-[#e5b869]" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Daily Victory Podium
              </h3>
              <p className="text-[11px] text-slate-400">Rankings based on today&apos;s finished goals & XP</p>
            </div>
          </div>

          <span className="rounded bg-white/[0.04] border border-white/10 px-2.5 py-1 text-[10px] font-mono text-slate-400">
            Live Daily Telemetry
          </span>
        </div>

        {/* Podium Displays */}
        {sortedMembers.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto pt-4">
            {/* 🥈 Rank 2 (Left) */}
            {top2 && (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#181b24] border-2 border-slate-400 font-mono font-bold text-sm text-slate-200 shadow-md overflow-hidden shrink-0">
                    {renderAvatarBadge(top2.avatar, top2.name, "md")}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-400 text-[10px] font-black text-slate-950 font-mono">
                    2
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate max-w-[90px] sm:max-w-[120px]">
                  {top2.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {top2.todayGoalsCompleted}/{top2.todayGoalsTotal} Goals
                </div>
                <div className="mt-1 text-xs font-mono font-bold text-slate-300">
                  +{top2.todayXp} XP
                </div>
                {/* Pedestal Bar */}
                <div className="w-full mt-3 h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-white/[0.02] to-white/[0.08] border-t-2 border-slate-400/60 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-slate-400">#2</span>
                </div>
              </div>
            )}

            {/* 🥇 Rank 1 (Center - Elevated) */}
            {top1 && (
              <div className="flex flex-col items-center text-center -mt-4">
                {/* Laurel Crown */}
                <div className="flex items-center justify-center mb-1 text-[#e5b869] animate-bounce">
                  <Crown className="h-5 w-5" />
                </div>

                <div className="relative mb-2">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1c1a16] border-2 border-[#e5b869] font-mono font-bold text-base text-[#e5b869] shadow-lg shadow-[#e5b869]/20 overflow-hidden shrink-0">
                    {renderAvatarBadge(top1.avatar, top1.name, "lg")}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#e5b869] to-[#c59a4c] text-[11px] font-black text-slate-950 font-mono shadow-sm">
                    1
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-[140px] flex items-center gap-1 justify-center">
                  {top1.name}
                </div>
                <div className="text-[10px] font-mono text-[#10b981] font-semibold">
                  {top1.todayGoalsCompleted}/{top1.todayGoalsTotal} Goals (100%)
                </div>
                <div className="mt-1 text-xs sm:text-sm font-mono font-bold text-[#e5b869]">
                  +{top1.todayXp} XP
                </div>
                {/* Pedestal Bar */}
                <div className="w-full mt-3 h-28 sm:h-32 rounded-t-2xl bg-gradient-to-t from-[#e5b869]/5 to-[#e5b869]/20 border-t-2 border-[#e5b869] flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-[#e5b869]">#1 CHAMPION</span>
                </div>
              </div>
            )}

            {/* 🥉 Rank 3 (Right) */}
            {top3 && (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#171513] border-2 border-amber-700 font-mono font-bold text-sm text-amber-500 shadow-md overflow-hidden shrink-0">
                    {renderAvatarBadge(top3.avatar, top3.name, "md")}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-black text-white font-mono">
                    3
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate max-w-[90px] sm:max-w-[120px]">
                  {top3.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {top3.todayGoalsCompleted}/{top3.todayGoalsTotal} Goals
                </div>
                <div className="mt-1 text-xs font-mono font-bold text-amber-500">
                  +{top3.todayXp} XP
                </div>
                {/* Pedestal Bar */}
                <div className="w-full mt-3 h-16 sm:h-20 rounded-t-2xl bg-gradient-to-t from-white/[0.02] to-amber-900/15 border-t-2 border-amber-700/60 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-amber-600">#3</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5b869]/10 text-[#e5b869] border border-[#e5b869]/20">
              <Trophy className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold font-mono text-white">No Squad Competition Active</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You have not joined a squad yet. Create your own squad or join friends using their invite token to unlock the live victory podium!
            </p>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] px-4 py-2 text-xs font-mono font-bold text-slate-950 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Create or Join Squad</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Real-Time Daily Standings Table */}
      <div className="rounded-3xl titanium-panel p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
              <Swords className="h-4 w-4 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Daily Roster & Synergies
              </h3>
              <p className="text-[11px] text-slate-400">High-five your squad members to send +5 XP</p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#e5b869]">
            Dynamic Live Sort
          </span>
        </div>

        {/* Member Standings List */}
        <div className="mt-4 space-y-2.5">
          {sortedMembers.map((member, idx) => {
            const isSelf = member.isCurrentUser;
            const completionPercent = Math.min(
              100,
              Math.round((member.todayGoalsCompleted / Math.max(1, member.todayGoalsTotal)) * 100)
            );

            return (
              <div
                key={member.id}
                className={`rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                  isSelf
                    ? "bg-[#e5b869]/[0.06] border border-[#e5b869]/30 shadow-md shadow-[#e5b869]/5"
                    : "bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05]"
                }`}
              >
                {/* Left: Rank & Identity */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono font-bold text-xs ${
                      idx === 0
                        ? "bg-[#e5b869] text-slate-950 shadow-sm"
                        : idx === 1
                        ? "bg-slate-300 text-slate-950"
                        : idx === 2
                        ? "bg-amber-700 text-white"
                        : "bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#161922] border border-white/10 font-mono font-bold text-xs text-white overflow-hidden">
                    {renderAvatarBadge(member.avatar, member.name, "sm")}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-white truncate">
                        {member.name}
                      </span>
                      {isSelf && (
                        <span className="rounded bg-[#e5b869]/15 border border-[#e5b869]/30 px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#e5b869] uppercase">
                          You
                        </span>
                      )}
                      {member.status === "completed_all" && (
                        <span className="rounded bg-[#10b981]/15 border border-[#10b981]/30 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-[#10b981]">
                          Finished
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Level {member.level} {member.characterClass} • {member.title}
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Synergy Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                  {/* Daily Goals Completed Gauge */}
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-500">
                      Daily Goals
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-200">
                      {member.todayGoalsCompleted}/{member.todayGoalsTotal}{" "}
                      <span className="text-[#10b981]">({completionPercent}%)</span>
                    </div>
                  </div>

                  {/* Streak Flame */}
                  <div className="flex items-center gap-1 font-mono text-xs text-orange-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{member.streakDays}d</span>
                  </div>

                  {/* Today's Points */}
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-right">
                    <div className="text-[9px] font-mono uppercase text-slate-500">Points</div>
                    <div className="text-xs sm:text-sm font-mono font-bold text-[#e5b869]">
                      +{member.todayXp}
                    </div>
                  </div>

                  {/* Interactive High-Five Button */}
                  {!isSelf ? (
                    <button
                      onClick={() => handleNudge(member.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-white/[0.05] hover:bg-[#e5b869]/15 border border-white/[0.08] hover:border-[#e5b869]/30 px-3 py-1.5 text-xs font-mono font-semibold text-slate-300 hover:text-[#e5b869] transition-all cursor-pointer active:scale-95"
                      title="Cheer your friend with a High-Five (+5 XP Synergy)"
                    >
                      <Zap className="h-3.5 w-3.5 text-[#e5b869]" />
                      <span className="hidden sm:inline">High-Five</span>
                    </button>
                  ) : (
                    <div className="w-[88px] text-center text-[10px] font-mono text-slate-500">
                      Active Grinder
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sortedMembers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-xs font-mono text-slate-400">
              No squad members yet. Share your invite code or create a party to coordinate with friends!
            </div>
          )}
        </div>
      </div>

      {/* 4. Co-Op Daily Squad Raid: The Obsidian Titan */}
      <div className="rounded-3xl titanium-panel p-5 sm:p-6 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Co-Op Daily Raid: {party.raidBoss.name}
                </h3>
                <span className="rounded bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 text-[9px] font-mono font-bold text-rose-400 uppercase">
                  Guild Boss
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{party.raidBoss.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-xs font-mono text-[#e5b869] bg-[#e5b869]/10 border border-[#e5b869]/20 rounded-xl px-3 py-1.5">
              <Gift className="h-3.5 w-3.5" />
              <span>+{party.raidBoss.rewardGold} Gold & 1 Cache</span>
            </div>

            {party.raidBoss.completed ? (
              <button
                onClick={handleClaimRaid}
                className="flex items-center gap-1.5 rounded-xl bg-[#e5b869] hover:bg-[#d4a758] text-slate-950 font-mono font-bold text-xs uppercase px-4 py-2 shadow-lg shadow-[#e5b869]/20 transition-transform active:scale-95 cursor-pointer animate-pulse"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Claim Raid Bounty
              </button>
            ) : (
              <div className="text-[11px] font-mono text-slate-400">
                Resets in {party.raidBoss.expiresIn}
              </div>
            )}
          </div>
        </div>

        {/* Raid Health / XP Accumulation Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Squad XP Siphon</span>
            <span className="font-bold text-white">
              {party.raidBoss.currentXp} / {party.raidBoss.targetXp} XP ({raidProgress}%)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/[0.08]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                party.raidBoss.completed
                  ? "bg-gradient-to-r from-[#10b981] to-[#059669]"
                  : "bg-gradient-to-r from-rose-500 via-[#e5b869] to-[#10b981]"
              }`}
              style={{ width: `${raidProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-right">
            Every daily goal checked off by any squad member deals XP damage to the Titan.
          </p>
        </div>
      </div>

      {/* 5. Live Squad Activity Telemetry Stream */}
      <div className="rounded-3xl titanium-panel p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-[#10b981] animate-pulse" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Squad Activity Feed
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Backed by ActivityLog.java
          </span>
        </div>

        <div className="mt-3 divide-y divide-white/[0.04]">
          {party.activityFeed.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-slate-200">{log.username} </span>
                <span className="text-slate-400">{log.action}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                {log.xpGained > 0 && (
                  <span className="font-bold text-[#e5b869]">+{log.xpGained} XP</span>
                )}
                <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating High-Five / Nudge Toast */}
      {nudgeNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#161922] border border-[#e5b869]/40 p-4 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-5">
          <Zap className="h-4 w-4 text-[#e5b869] animate-bounce shrink-0" />
          <span className="text-xs font-mono font-semibold text-white">
            {nudgeNotification}
          </span>
          <button
            onClick={dismissNudgeNotification}
            className="rounded-lg p-1 text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Join / Create Squad Modal */}
      <JoinSquadModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
