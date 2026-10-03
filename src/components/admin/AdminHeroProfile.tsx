'use client';

import React, { useState } from 'react';
import { Save, CheckCircle, Award, Sparkles } from 'lucide-react';
import type { HeroSection, SurgeonProfile, StatItem } from '@/types/database';

interface AdminHeroProfileProps {
  heroSection: HeroSection;
  surgeonProfile: SurgeonProfile;
  onSaveHero: (hero: HeroSection) => Promise<void>;
  onSaveProfile: (profile: SurgeonProfile) => Promise<void>;
}

export function AdminHeroProfile({
  heroSection,
  surgeonProfile,
  onSaveHero,
  onSaveProfile,
}: AdminHeroProfileProps) {
  const [heroForm, setHeroForm] = useState<HeroSection>(heroSection);
  const [profileForm, setProfileForm] = useState<SurgeonProfile>(surgeonProfile);
  const [savingHero, setSavingHero] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      await onSaveHero(heroForm);
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } finally {
      setSavingHero(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await onSaveProfile(profileForm);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const updateStatItem = (index: number, field: keyof StatItem, value: string) => {
    const nextStats = [...profileForm.stats];
    nextStats[index] = { ...nextStats[index], [field]: value };
    setProfileForm({ ...profileForm, stats: nextStats });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif font-bold text-2xl text-[#062F31]">Hero & Surgeon Profile</h2>
        <p className="text-xs text-[#062F31]/60">
          Control the scroll-scrubbed homepage headline, surgical callouts, BMDC profile, and count-up clinical metrics.
        </p>
      </div>

      {/* Hero Section Form */}
      <form onSubmit={handleHeroSubmit} className="bg-white rounded-2xl border border-[#0B6E73]/15 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2BB3B1]" />
            <h3 className="font-serif font-bold text-lg text-[#062F31]">Hero Incision & Scrub Screen</h3>
          </div>
          <button
            type="submit"
            disabled={savingHero}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {savingHero ? (
              <span>Saving...</span>
            ) : heroSaved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Hero</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English Hero */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B6E73]">English Copy</div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Headline (H1)</label>
              <textarea
                rows={2}
                value={heroForm.h1_en}
                onChange={(e) => setHeroForm({ ...heroForm, h1_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sub-headline (H2)</label>
              <input
                type="text"
                value={heroForm.h2_en}
                onChange={(e) => setHeroForm({ ...heroForm, h2_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Scroll Cue Text</label>
              <input
                type="text"
                value={heroForm.scroll_cue_en}
                onChange={(e) => setHeroForm({ ...heroForm, scroll_cue_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Meet CTA Button Text</label>
              <input
                type="text"
                value={heroForm.meet_cta_en}
                onChange={(e) => setHeroForm({ ...heroForm, meet_cta_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>

          {/* Bangla Hero */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B6E73]">বাংলা কপি (Bangla)</div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">হেডলাইন (H1)</label>
              <textarea
                rows={2}
                value={heroForm.h1_bn}
                onChange={(e) => setHeroForm({ ...heroForm, h1_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">সাব-হেডলাইন (H2)</label>
              <input
                type="text"
                value={heroForm.h2_bn}
                onChange={(e) => setHeroForm({ ...heroForm, h2_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">স্ক্রোল নির্দেশনা টেক্সট</label>
              <input
                type="text"
                value={heroForm.scroll_cue_bn}
                onChange={(e) => setHeroForm({ ...heroForm, scroll_cue_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">মিট বাটন টেক্সট</label>
              <input
                type="text"
                value={heroForm.meet_cta_bn}
                onChange={(e) => setHeroForm({ ...heroForm, meet_cta_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Surgeon Profile Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-[#0B6E73]/15 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2BB3B1]" />
            <h3 className="font-serif font-bold text-lg text-[#062F31]">Surgeon Identity & Count-Up Stats</h3>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {savingProfile ? (
              <span>Saving...</span>
            ) : profileSaved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Doctor Names & Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B6E73]">English Identity</div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Doctor Full Name</label>
              <input
                type="text"
                value={profileForm.name_en}
                onChange={(e) => setProfileForm({ ...profileForm, name_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Intro Highlight Word</label>
              <input
                type="text"
                value={profileForm.intro_word_en}
                onChange={(e) => setProfileForm({ ...profileForm, intro_word_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Clinical Role / Specialty</label>
              <input
                type="text"
                value={profileForm.role_en}
                onChange={(e) => setProfileForm({ ...profileForm, role_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Official Hospital Designation</label>
              <input
                type="text"
                value={profileForm.post_en}
                onChange={(e) => setProfileForm({ ...profileForm, post_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chambers Location Summary</label>
              <input
                type="text"
                value={profileForm.chambers_summary_en}
                onChange={(e) => setProfileForm({ ...profileForm, chambers_summary_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B6E73]">বাংলা পরিচয় (Bangla)</div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ডাক্তারের পূর্ণ নাম</label>
              <input
                type="text"
                value={profileForm.name_bn}
                onChange={(e) => setProfileForm({ ...profileForm, name_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ইন্ট্রো ওয়ার্ড</label>
              <input
                type="text"
                value={profileForm.intro_word_bn}
                onChange={(e) => setProfileForm({ ...profileForm, intro_word_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">বিশেষজ্ঞ পদবি</label>
              <input
                type="text"
                value={profileForm.role_bn}
                onChange={(e) => setProfileForm({ ...profileForm, role_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">সরকারি দায়িত্ব ও হাসপাতাল</label>
              <input
                type="text"
                value={profileForm.post_bn}
                onChange={(e) => setProfileForm({ ...profileForm, post_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">চেম্বারের সংক্ষেপ বিবরণ</label>
              <input
                type="text"
                value={profileForm.chambers_summary_bn}
                onChange={(e) => setProfileForm({ ...profileForm, chambers_summary_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>
        </div>

        {/* 4 Clinical Statistics */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs font-bold uppercase tracking-wider text-[#062F31] mb-4">
            Count-Up Clinical Numbers (Shown on Stage 1)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profileForm.stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 space-y-2">
                <span className="text-[10px] font-bold text-[#0B6E73] uppercase">Metric #{idx + 1}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Value (EN)</label>
                    <input
                      type="text"
                      value={stat.num_en}
                      onChange={(e) => updateStatItem(idx, 'num_en', e.target.value)}
                      className="w-full p-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Value (BN)</label>
                    <input
                      type="text"
                      value={stat.num_bn}
                      onChange={(e) => updateStatItem(idx, 'num_bn', e.target.value)}
                      className="w-full p-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Label (EN)</label>
                  <input
                    type="text"
                    value={stat.label_en}
                    onChange={(e) => updateStatItem(idx, 'label_en', e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Label (BN)</label>
                  <input
                    type="text"
                    value={stat.label_bn}
                    onChange={(e) => updateStatItem(idx, 'label_bn', e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
