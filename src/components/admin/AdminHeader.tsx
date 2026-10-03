'use client';

import React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  CircleDot,
} from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
  loggingOut?: boolean;
  activeTabTitle?: string;
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
}

export function AdminHeader({
  onLogout,
  loggingOut = false,
  activeTabTitle = 'Overview',
  mobileOpen = false,
  onToggleMobile,
}: AdminHeaderProps) {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-[#0B6E73]/15 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand & Active Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Toggle Button */}
          {onToggleMobile && (
            <button
              type="button"
              onClick={onToggleMobile}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-[#EEF7F6] text-[#062F31] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0B6E73] to-[#2BB3B1] flex items-center justify-center text-white shadow-md shadow-[#2BB3B1]/20 shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg text-[#062F31] leading-none">
                  Dr. Kollol CMS
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2BB3B1]/15 text-[#0B6E73] border border-[#2BB3B1]/20">
                  <ShieldCheck className="w-3 h-3" /> Encrypted
                </span>
              </div>
              <div className="text-[11px] text-[#062F31]/60 flex items-center gap-1.5 mt-0.5">
                <span className="font-medium text-[#0B6E73]">Command Center</span>
                <span>/</span>
                <span className="text-[#062F31] font-semibold truncate max-w-[140px] sm:max-w-none">
                  {activeTabTitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Status indicator on desktop */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EEF7F6] border border-[#2BB3B1]/30 text-xs text-[#062F31]">
            <CircleDot className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="font-medium text-[11px]">System Online</span>
          </div>

          {/* Live Site Link Button */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white border border-[#0B6E73]/20 hover:border-[#2BB3B1] hover:bg-[#EEF7F6]/60 text-xs font-semibold text-[#0B6E73] hover:text-[#062F31] transition-all shadow-xs group"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-semibold transition-all border border-red-200/70 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
