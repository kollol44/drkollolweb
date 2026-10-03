'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarClock,
  Activity,
  Building2,
  BookOpenText,
  Sparkles,
  HelpCircle,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import type { Appointment, Condition, Chamber, BlogPost } from '@/types/database';

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  appointments: Appointment[];
  conditions: Condition[];
  chambers: Chamber[];
  blogs: BlogPost[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  groupLabel: string;
  items: {
    id: string;
    label: string;
    shortDesc: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number | null;
    badgeVariant?: 'amber' | 'neutral' | 'teal';
  }[];
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  appointments,
  conditions,
  chambers,
  blogs,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pendingAppointmentsCount = appointments.filter(
    (a) => !a.status || a.status === 'pending'
  ).length;

  const navGroups: NavGroup[] = [
    {
      groupLabel: 'Clinical Operations',
      items: [
        {
          id: 'overview',
          label: 'Executive Overview',
          shortDesc: 'Metrics & activity summary',
          icon: LayoutDashboard,
        },
        {
          id: 'appointments',
          label: 'Patient Appointments',
          shortDesc: 'Online serial queue',
          icon: CalendarClock,
          badge: pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount} New` : null,
          badgeVariant: 'amber',
        },
      ],
    },
    {
      groupLabel: 'Medical Practice & Hub',
      items: [
        {
          id: 'conditions',
          label: 'Clinical Conditions',
          shortDesc: '7 categories & 26 procedures',
          icon: Activity,
          badge: conditions.length || 26,
          badgeVariant: 'teal',
        },
        {
          id: 'chambers',
          label: 'Chambers & Hours',
          shortDesc: 'Sherpur & Mymensingh',
          icon: Building2,
          badge: chambers.length || 3,
          badgeVariant: 'neutral',
        },
        {
          id: 'blogs',
          label: 'Medical Articles',
          shortDesc: 'Patient guides (EN / BN)',
          icon: BookOpenText,
          badge: blogs.length || 10,
          badgeVariant: 'neutral',
        },
      ],
    },
    {
      groupLabel: 'Identity & Reputation',
      items: [
        {
          id: 'heroProfile',
          label: 'Hero & Doctor Profile',
          shortDesc: 'Headline, bio & surgery stats',
          icon: Sparkles,
        },
        {
          id: 'faqsReviews',
          label: 'FAQs & Reviews',
          shortDesc: 'Testimonials & answers',
          icon: HelpCircle,
        },
      ],
    },
    {
      groupLabel: 'Platform & Security',
      items: [
        {
          id: 'settings',
          label: 'Global Site Settings',
          shortDesc: 'Hotlines, banners & disclaimers',
          icon: SlidersHorizontal,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[73px] left-0 h-screen lg:h-[calc(100vh-89px)] w-72 sm:w-80 lg:w-72 shrink-0 bg-white/90 backdrop-blur-xl lg:bg-white/80 border-r lg:border border-[#0B6E73]/15 lg:rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl lg:shadow-sm shadow-[#0B6E73]/5 z-40 lg:z-10 transition-transform duration-300 ease-out overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Doctor Miniature Profile Badge */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#EEF7F6] to-white border border-[#2BB3B1]/25 flex items-center gap-3 shadow-xs">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0B6E73] to-[#2BB3B1] p-0.5 shadow-sm">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src="/img/doctor.webp"
                    alt="Dr. Kollol"
                    width={44}
                    height={44}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
              </div>
              {/* Online pulse indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold font-serif text-[#062F31] truncate">
                Dr. Fahim Foysal Kollol
              </div>
              <div className="text-[10px] text-[#0B6E73] font-semibold flex items-center gap-1">
                <span>BMDC A-61041</span>
                <span>•</span>
                <span className="truncate">MMCH Post</span>
              </div>
              <div className="text-[9px] text-[#062F31]/50 uppercase tracking-wider font-mono">
                Surgery Specialist
              </div>
            </div>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.groupLabel} className="space-y-1.5">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#062F31]/45 flex items-center justify-between">
                  <span>{group.groupLabel}</span>
                </div>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0B6E73] to-[#0E8389] text-white shadow-md shadow-[#0B6E73]/25 font-semibold ring-1 ring-[#2BB3B1]/40'
                            : 'text-[#062F31]/75 hover:bg-white/90 hover:text-[#062F31] hover:shadow-xs'
                        }`}
                      >
                        {/* Left Active Accent Pill */}
                        {isActive && (
                          <div className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-[#2BB3B1] rounded-full shadow-xs" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0 pl-1">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-white/15 text-[#2BB3B1]'
                                : 'bg-[#EEF7F6]/80 group-hover:bg-[#2BB3B1]/15 text-[#0B6E73]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="text-left min-w-0">
                            <div className="truncate text-xs tracking-tight">
                              {item.label}
                            </div>
                            <div
                              className={`text-[10px] truncate hidden sm:block ${
                                isActive ? 'text-white/70' : 'text-[#062F31]/45'
                              }`}
                            >
                              {item.shortDesc}
                            </div>
                          </div>
                        </div>

                        {/* Badges / Chevron */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {item.badge && (
                            <span
                              className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                                isActive
                                  ? 'bg-white text-[#0B6E73]'
                                  : item.badgeVariant === 'amber'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200/80 shadow-2xs'
                                  : item.badgeVariant === 'teal'
                                  ? 'bg-[#2BB3B1]/15 text-[#0B6E73]'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {item.badgeVariant === 'amber' && (
                                <span className="relative flex h-1.5 w-1.5 mr-1 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                </span>
                              )}
                              {item.badge}
                            </span>
                          )}

                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isActive
                                ? 'text-white/70 translate-x-0.5'
                                : 'text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer System Status */}
        <div className="pt-4 mt-4 border-t border-[#0B6E73]/10 space-y-3">
          <div className="p-3 rounded-xl bg-[#EEF7F6]/60 border border-[#0B6E73]/10 text-[11px] text-[#062F31]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold flex items-center gap-1.5 text-[#0B6E73]">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Live Portal Sync</span>
              </span>
              <span className="font-mono text-[9px] text-[#062F31]/50 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-[#062F31]/60 leading-tight">
              Changes auto-sync to live database & cache edge.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] px-1 text-[#062F31]/60">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 hover:text-[#0B6E73] font-medium transition-colors"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>TLS / RLS</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
