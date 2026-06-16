"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured, syncUserProfile } from "@/lib/supabase";
import { X, Mail, Lock, ShieldCheck, Loader2, Info } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // If Supabase is not configured, simulate successful login/signup for testing!
      setTimeout(() => {
        setLoading(false);
        const mockUser = {
          id: "mock-user-123",
          email: email,
          user_metadata: { full_name: isSignUp ? fullName : email.split("@")[0] }
        };
        // Save mock user in localStorage
        localStorage.setItem("living_law_mock_user", JSON.stringify(mockUser));
        if (onSuccess) onSuccess(mockUser);
        onClose();
      }, 1500);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (data?.user) {
          // Sync to profiles table
          await syncUserProfile(data.user);
          setMessage("Registration successful! Please check your email for verification link.");
          setTimeout(() => {
            setIsSignUp(false);
            setMessage(null);
          }, 3000);
        }
      } else {
        // Sign in flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data?.user) {
          // Sync profile to database if it doesn't exist
          const profile = await syncUserProfile(data.user);
          if (onSuccess) onSuccess({ ...data.user, profile });
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900/90 dark:bg-slate-950/95 border border-amber-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition duration-200"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-500 mb-3">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-serif-legal font-bold text-white tracking-wide">
            {isSignUp ? "Create Chambers Account" : "Access Legal Chambers"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {isSignUp ? "Sign up to join our secure litigation and notary workspace" : "Log in to check cases, notary deeds, and filings"}
          </p>
        </div>

        {/* Warning if running in Mock mode */}
        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5 text-amber-400 text-xs">
            <Info size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Local Mock Mode Active:</span> Supabase keys are not set in `.env.local`. Sign-in will generate a local session in your browser.
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-200 text-xs rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs rounded-lg">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
                Full Name
              </label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="L. N. Rao"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500/50"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
              Email Address
            </label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@livinglaw.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500/50"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
              Password
            </label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500/50"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>{isSignUp ? "Sign Up" : "Log In"}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-400 font-sans">
          {isSignUp ? "Already have a legal profile?" : "New to Living Law Chambers?"}{" "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-amber-500 hover:text-amber-400 font-semibold underline transition ml-1"
          >
            {isSignUp ? "Log In here" : "Register here"}
          </button>
        </div>

      </div>
    </div>
  );
}
