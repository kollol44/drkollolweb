'use client';

import React from 'react';
import { Calendar, Layers, Building2, BookOpen, Star, MessageSquare, ArrowUpRight, Phone, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Appointment, Condition, Chamber, BlogPost, Review } from '@/types/database';

interface AdminOverviewProps {
  appointments: Appointment[];
  conditions: Condition[];
  chambers: Chamber[];
  blogs: BlogPost[];
  reviews: Review[];
  onSelectTab: (tab: string) => void;
  onUpdateAppointmentStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
}

export function AdminOverview({
  appointments,
  conditions,
  chambers,
  blogs,
  reviews,
  onSelectTab,
  onUpdateAppointmentStatus,
}: AdminOverviewProps) {
  const pendingAppointments = appointments.filter((a) => a.status === 'pending' || !a.status);
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Appointments */}
        <div
          onClick={() => onSelectTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-[#0B6E73]/15 hover:border-[#2BB3B1] hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#2BB3B1]/10 text-[#0B6E73] flex items-center justify-center group-hover:bg-[#2BB3B1] group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            {pendingAppointments.length > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingAppointments.length} New
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-[#062F31]">{appointments.length}</div>
          <div className="text-xs text-[#062F31]/60 mt-0.5">Appointments</div>
        </div>

        {/* Conditions */}
        <div
          onClick={() => onSelectTab('conditions')}
          className="bg-white p-5 rounded-2xl border border-[#0B6E73]/15 hover:border-[#2BB3B1] hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B6E73]/10 text-[#0B6E73] flex items-center justify-center group-hover:bg-[#0B6E73] group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#062F31]/30 group-hover:text-[#2BB3B1]" />
          </div>
          <div className="text-2xl font-bold text-[#062F31]">{conditions.length}</div>
          <div className="text-xs text-[#062F31]/60 mt-0.5">Clinical Conditions</div>
        </div>

        {/* Chambers */}
        <div
          onClick={() => onSelectTab('chambers')}
          className="bg-white p-5 rounded-2xl border border-[#0B6E73]/15 hover:border-[#2BB3B1] hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0B6E73] flex items-center justify-center group-hover:bg-[#0B6E73] group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#062F31]/30 group-hover:text-[#2BB3B1]" />
          </div>
          <div className="text-2xl font-bold text-[#062F31]">{chambers.length}</div>
          <div className="text-xs text-[#062F31]/60 mt-0.5">Active Chambers</div>
        </div>

        {/* Blogs */}
        <div
          onClick={() => onSelectTab('blogs')}
          className="bg-white p-5 rounded-2xl border border-[#0B6E73]/15 hover:border-[#2BB3B1] hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#062F31]/30 group-hover:text-[#2BB3B1]" />
          </div>
          <div className="text-2xl font-bold text-[#062F31]">{blogs.length}</div>
          <div className="text-xs text-[#062F31]/60 mt-0.5">Medical Articles</div>
        </div>

        {/* Reviews */}
        <div
          onClick={() => onSelectTab('faqsReviews')}
          className="bg-white p-5 rounded-2xl border border-[#0B6E73]/15 hover:border-[#2BB3B1] hover:shadow-lg transition-all cursor-pointer group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Star className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#062F31]/30 group-hover:text-[#2BB3B1]" />
          </div>
          <div className="text-2xl font-bold text-[#062F31]">{reviews.length}</div>
          <div className="text-xs text-[#062F31]/60 mt-0.5">Patient Testimonials</div>
        </div>
      </div>

      {/* Main Split: Recent Patient Appointments & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Patient Appointment Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0B6E73]/15 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#062F31]">Recent Patient Appointments</h2>
              <p className="text-xs text-[#062F31]/60">Patients who recently booked online serials</p>
            </div>
            <button
              onClick={() => onSelectTab('appointments')}
              className="text-xs font-semibold text-[#0B6E73] hover:text-[#2BB3B1] transition-colors"
            >
              View All ({appointments.length})
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#062F31]/50">
              No appointments recorded yet. Submissions from the website will appear here in real-time.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {appointments.slice(0, 5).map((apt) => {
                const isPending = !apt.status || apt.status === 'pending';
                const isConfirmed = apt.status === 'confirmed';

                return (
                  <div key={apt.id || apt.patient_phone} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#062F31]">{apt.patient_name}</span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : isConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            <XCircle className="w-3 h-3" /> {apt.status}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#062F31]/70 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 font-mono font-medium text-[#0B6E73]">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${apt.patient_phone}`} className="hover:underline">{apt.patient_phone}</a>
                        </span>
                        <span>•</span>
                        <span>{apt.chamber_name}</span>
                        <span>•</span>
                        <span>{apt.preferred_date}</span>
                      </div>
                      {apt.problem_summary && (
                        <p className="text-xs text-[#062F31]/60 italic mt-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                          &quot;{apt.problem_summary}&quot;
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && apt.id && (
                        <button
                          onClick={() => onUpdateAppointmentStatus(apt.id!, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-all cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      <a
                        href={`https://wa.me/88${apt.patient_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${apt.patient_name}, this is Dr. Kollol's Chamber regarding your serial for ${apt.preferred_date} at ${apt.chamber_name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#2BB3B1]/10 hover:bg-[#2BB3B1]/20 text-[#0B6E73] text-xs font-semibold border border-[#2BB3B1]/30 transition-all"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Quick Clinical Management Shortcuts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#062F31] to-[#0B6E73] rounded-2xl p-6 text-white shadow-md">
            <h3 className="font-serif font-bold text-lg mb-2">Practice Overview</h3>
            <p className="text-xs text-white/75 leading-relaxed mb-4">
              Control the medical profile, 26 surgical conditions, hospital chambers in Sherpur and Mymensingh, patient reviews, and educational articles.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">Laparoscopic Procedures</span>
                <span className="font-bold text-[#2BB3B1]">
                  {conditions.filter((c) => c.is_laparoscopic).length} active
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">BMDC Registration</span>
                <span className="font-mono text-white/90">A-61041</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">Confirmed Today</span>
                <span className="font-bold text-emerald-300">{confirmedAppointments.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#0B6E73]/15 p-6">
            <h4 className="font-serif font-bold text-sm text-[#062F31] mb-3">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onSelectTab('heroProfile')}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#EEF7F6] text-[#062F31] font-semibold text-left transition-all border border-gray-100 hover:border-[#2BB3B1]/30"
              >
                Hero & Stats
              </button>
              <button
                onClick={() => onSelectTab('conditions')}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#EEF7F6] text-[#062F31] font-semibold text-left transition-all border border-gray-100 hover:border-[#2BB3B1]/30"
              >
                Conditions (26)
              </button>
              <button
                onClick={() => onSelectTab('chambers')}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#EEF7F6] text-[#062F31] font-semibold text-left transition-all border border-gray-100 hover:border-[#2BB3B1]/30"
              >
                Chambers & Hours
              </button>
              <button
                onClick={() => onSelectTab('blogs')}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#EEF7F6] text-[#062F31] font-semibold text-left transition-all border border-gray-100 hover:border-[#2BB3B1]/30"
              >
                Medical Blogs (10)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
