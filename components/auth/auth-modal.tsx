"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Shield,
  Lock,
  User,
  Mail,
  ArrowRight,
  Database,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { toast } from "sonner";
import { sounds } from "@/lib/sound";

export function AuthModal() {
  const isOpen = useRPGStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useRPGStore((state) => state.closeAuthModal);
  const loginUser = useRPGStore((state) => state.loginUser);
  const registerUser = useRPGStore((state) => state.registerUser);
  const backendConnected = useRPGStore((state) => state.backendConnected);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "register" && !email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const success = await registerUser(
          username.trim(),
          email.trim(),
          password
        );
        if (success) {
          sounds.playLevelUp();
          toast.success("Account Created in Neon Database!", {
            description: `Welcome to LifeRPG, ${username}! Your cloud save is active.`,
          });
          closeAuthModal();
        }
      } else {
        const success = await loginUser(username.trim(), password);
        if (success) {
          sounds.playQuestComplete();
          toast.success("Signed In Successfully!", {
            description: `Welcome back, ${username}! Progression synchronized from Neon DB.`,
          });
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with backend.");
      toast.error("Authentication Error", {
        description: err.message || "Could not connect to Spring Boot backend.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0e1017] p-7 shadow-2xl"
        >
          {/* Top Specular Edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e5b869]/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#e5b869]/10 border border-[#e5b869]/25 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#e5b869] uppercase tracking-wider">
                <Database className="h-3 w-3 text-[#10b981]" />
                Neon Cloud Database
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-semibold ${
                  backendConnected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                }`}
              >
                {backendConnected ? "Backend Online" : "Starting Server"}
              </span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white tracking-tight pt-1">
              {mode === "login" ? "Hunter Authentication" : "Register New Hunter"}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === "login"
                ? "Synchronize your profile, streaks, and party from Neon DB."
                : "Create a permanent cloud-persisted hero record in PostgreSQL."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06] mb-5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[#e5b869] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-[#e5b869] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ShadowHunter"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#e5b869] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. hunter@domain.com"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#e5b869] focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {mode === "register" && (
                  <span className="text-[10px] font-mono text-[#e5b869]">
                    Min. 3 characters
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#e5b869] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e5b869] to-[#c59a4c] py-3 text-xs font-bold font-mono text-slate-950 shadow-lg shadow-[#e5b869]/15 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>SYNCHRONIZING WITH NEON DB...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {mode === "login" ? "ENTER PROTOCOL" : "CREATE HERO PROFILE"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
