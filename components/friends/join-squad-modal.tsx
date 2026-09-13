"use client";

import { useState } from "react";
import { X, Users, KeyRound, Plus, ShieldCheck } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { sounds } from "@/lib/sound";

interface JoinSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinSquadModal({ isOpen, onClose }: JoinSquadModalProps) {
  const [tab, setTab] = useState<"join" | "create">("join");
  const [code, setCode] = useState("");
  const [squadName, setSquadName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const joinParty = useRPGStore((state) => state.joinParty);
  const createParty = useRPGStore((state) => state.createParty);

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter a 6-character squad invite code.");
      return;
    }
    const success = joinParty(code.trim());
    if (success) {
      sounds.playQuestComplete();
      onClose();
      setCode("");
      setError(null);
    } else {
      setError("Invalid code. Must be at least 4 characters.");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) {
      setError("Please enter a squad name.");
      return;
    }
    createParty(squadName.trim(), description.trim());
    sounds.playLevelUp();
    onClose();
    setSquadName("");
    setDescription("");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#101217] border border-white/[0.1] p-6 shadow-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e5b869]/10 border border-[#e5b869]/25 text-[#e5b869]">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                Squad Protocol
              </h3>
              <p className="text-[11px] text-slate-400">Compete with friends & share rewards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
          <button
            onClick={() => {
              setTab("join");
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
              tab === "join"
                ? "bg-white/[0.1] text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5 text-[#e5b869]" />
            Join with Code
          </button>
          <button
            onClick={() => {
              setTab("create");
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
              tab === "create"
                ? "bg-white/[0.1] text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="h-3.5 w-3.5 text-[#10b981]" />
            Found New Squad
          </button>
        </div>

        {/* Form Body */}
        {tab === "join" ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Invite Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="e.g. NR7XK2"
                maxLength={10}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm font-mono tracking-widest text-center text-[#e5b869] placeholder:text-slate-600 focus:border-[#e5b869]/60 focus:outline-none uppercase"
              />
              <p className="mt-1.5 text-[11px] text-slate-400 text-center">
                Ask your squad leader for their 6-character access token.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e5b869] hover:bg-[#d4a758] text-slate-950 font-mono font-bold text-xs uppercase tracking-wider py-3 shadow-lg shadow-[#e5b869]/15 transition-transform active:scale-[0.99] cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              Join Squad Arena
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Squad Name
              </label>
              <input
                type="text"
                value={squadName}
                onChange={(e) => {
                  setSquadName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Vanguard Syndicate"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#e5b869]/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Squad Philosophy / Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Daily consistency, fitness, and deep work"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#e5b869]/60 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-mono font-bold text-xs uppercase tracking-wider py-3 shadow-lg shadow-emerald-500/15 transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Found Squad Syndicate
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
