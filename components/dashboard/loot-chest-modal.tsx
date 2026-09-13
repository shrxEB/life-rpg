"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Sparkles, Coins, ArrowRight, X, ShieldCheck } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { sounds } from "@/lib/sound";
import confetti from "canvas-confetti";

interface LootChestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LootChestModal({ isOpen, onClose }: LootChestModalProps) {
  const player = useRPGStore((state) => state.player);
  const openMysteryChest = useRPGStore((state) => state.openMysteryChest);

  const [hasOpened, setHasOpened] = useState(false);
  const [reward, setReward] = useState<{ gold: number; xp: number } | null>(null);

  if (!isOpen) return null;

  const handleUnlock = async () => {
    if (hasOpened) return;

    sounds.playChestOpen();
    const bounty = await openMysteryChest();
    if (bounty) {
      setReward(bounty);
      setHasOpened(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#e5b869", "#c59a4c", "#ffffff", "#10b981"],
      });
    }
  };

  const handleClose = () => {
    setHasOpened(false);
    setReward(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.12] bg-[#111319] p-8 text-center shadow-2xl"
        >
          {/* Top Specular Edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e5b869]/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {!hasOpened ? (
            /* State 1: Unopened Cache */
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded bg-[#e5b869]/10 border border-[#e5b869]/25 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#e5b869] uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  Tactical Vault
                </span>
                <h3 className="text-xl font-bold text-white mt-2 tracking-tight">
                  Hunter Cache Ready
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You hold <strong className="text-[#e5b869] font-mono">{player.mysteryChests} cache</strong> in your personal inventory.
                </p>
              </div>

              {/* Shaking Metallic Vault Icon */}
              <motion.div
                animate={{
                  rotate: [0, -3, 3, -3, 3, 0],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 2,
                  duration: 0.5,
                }}
                className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-[#161922] border border-[#e5b869]/30 shadow-xl cursor-pointer"
                onClick={handleUnlock}
              >
                <Package className="h-14 w-14 text-[#e5b869]" />
              </motion.div>

              <button
                onClick={handleUnlock}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] py-3 text-xs font-bold font-mono text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>UNSEAL CACHE</span>
              </button>
            </div>
          ) : (
            /* State 2: Unsealed Reward */
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded bg-[#10b981]/15 border border-[#10b981]/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Cache Unsealed
                </span>
                <h3 className="text-xl font-bold text-white mt-2 tracking-tight">
                  Bounty Credited
                </h3>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 flex flex-col items-center justify-center">
                  <Coins className="h-5 w-5 text-[#e5b869] mb-1.5" />
                  <span className="text-xl font-bold text-white font-mono">
                    +{reward?.gold}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    Gold Coins
                  </span>
                </div>

                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 flex flex-col items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#10b981] mb-1.5" />
                  <span className="text-xl font-bold text-white font-mono">
                    +{reward?.xp}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    Experience XP
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 py-3 text-xs font-mono font-bold text-white transition-all cursor-pointer"
              >
                <span>CONTINUE WORKSPACE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
