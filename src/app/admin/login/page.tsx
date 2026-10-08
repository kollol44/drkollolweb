'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, Stethoscope, ArrowRight, User } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your admin username or email address.');
      return;
    }
    if (!password) {
      setError('Please enter the administrator master password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.message || 'Incorrect credentials. Access denied.');
      }
    } catch {
      setError('Connection failed. Please check network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#2BB3B1] mb-4 shadow-xl">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Dr. Kollol CMS
        </h1>
        <p className="text-white/70 text-sm mt-1">
          Clinical Portal & Administrative Command Center
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
        <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-wider text-[#2BB3B1] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Authorized Medical Personnel Only</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Admin Identifier */}
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Admin Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin or email"
                autoFocus
                required
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1] focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Admin Password */}
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Administrator Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                required
                className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1] focus:border-transparent transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-[#2BB3B1] hover:bg-[#239997] disabled:opacity-50 text-[#062F31] font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#2BB3B1]/20 active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#062F31] border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          Protected by end-to-end HTTP-only cryptographic session tokens & CSRF shielding.
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#062F31] via-[#0B6E73] to-[#062F31] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow & Geometry */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2BB3B1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#2BB3B1]/15 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="text-white text-sm flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#2BB3B1] border-t-transparent rounded-full animate-spin" />
          <span>Loading secure portal...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
