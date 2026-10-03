'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminAppointments } from '@/components/admin/AdminAppointments';
import { AdminHeroProfile } from '@/components/admin/AdminHeroProfile';
import { AdminSiteSettings } from '@/components/admin/AdminSiteSettings';
import { AdminConditions } from '@/components/admin/AdminConditions';
import { AdminChambers } from '@/components/admin/AdminChambers';
import { AdminBlogs } from '@/components/admin/AdminBlogs';
import { AdminFaqsReviews } from '@/components/admin/AdminFaqsReviews';

import type {
  SiteSettings,
  HeroSection,
  SurgeonProfile,
  Category,
  Condition,
  Chamber,
  Review,
  FAQ,
  BlogPost,
  Appointment,
} from '@/types/database';

const tabTitles: Record<string, string> = {
  overview: 'Executive Overview',
  appointments: 'Patient Appointments',
  conditions: 'Clinical Conditions (26)',
  chambers: 'Chambers & Visiting Hours',
  blogs: 'Medical Articles & Blogs',
  heroProfile: 'Hero & Doctor Profile',
  faqsReviews: 'FAQs & Patient Reviews',
  settings: 'Global Site Settings',
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // State data
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [surgeonProfile, setSurgeonProfile] = useState<SurgeonProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch all CMS content
  const loadDashboardData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        setSiteSettings(json.data.siteSettings);
        setHeroSection(json.data.heroSection);
        setSurgeonProfile(json.data.surgeonProfile);
        setCategories(json.data.categories || []);
        setConditions(json.data.conditions || []);
        setChambers(json.data.chambers || []);
        setReviews(json.data.reviews || []);
        setFaqs(json.data.faqs || []);
        setBlogs(json.data.blogs || []);
        setAppointments(json.data.appointments || []);
      }
    } catch {
      showToast('Failed to connect to CMS backend service.', 'error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Logout handler
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      setLoggingOut(false);
    }
  };

  // Content mutators
  const saveSection = async (section: string, payload: unknown) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Changes saved and synchronized successfully!');
        return true;
      } else {
        showToast(data.message || 'Error updating content.', 'error');
        return false;
      }
    } catch {
      showToast('Network error while saving changes.', 'error');
      return false;
    }
  };

  // Specific save operations
  const handleSaveSiteSettings = async (newSettings: SiteSettings) => {
    const ok = await saveSection('siteSettings', newSettings);
    if (ok) setSiteSettings(newSettings);
  };

  const handleSaveHero = async (newHero: HeroSection) => {
    const ok = await saveSection('heroSection', newHero);
    if (ok) setHeroSection(newHero);
  };

  const handleSaveProfile = async (newProfile: SurgeonProfile) => {
    const ok = await saveSection('surgeonProfile', newProfile);
    if (ok) setSurgeonProfile(newProfile);
  };

  const handleSaveCondition = async (newCondition: Condition) => {
    const ok = await saveSection('condition', newCondition);
    if (ok) {
      setConditions((prev) =>
        prev.map((c) => (c.slug === newCondition.slug ? newCondition : c))
      );
    }
  };

  const handleSaveChamber = async (newChamber: Chamber) => {
    const ok = await saveSection('chamber', newChamber);
    if (ok) {
      setChambers((prev) => {
        const idx = prev.findIndex((c) => c.id === newChamber.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = newChamber;
          return clone;
        }
        return [...prev, newChamber];
      });
    }
  };

  const handleSaveBlog = async (newBlog: BlogPost) => {
    const ok = await saveSection('blog', newBlog);
    if (ok) {
      setBlogs((prev) => {
        const idx = prev.findIndex((b) => b.slug === newBlog.slug);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = newBlog;
          return clone;
        }
        return [newBlog, ...prev];
      });
    }
  };

  const handleSaveFaq = async (newFaq: FAQ) => {
    const ok = await saveSection('faq', newFaq);
    if (ok) {
      setFaqs((prev) => {
        const idx = prev.findIndex((f) => f.id === newFaq.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = newFaq;
          return clone;
        }
        return [...prev, newFaq];
      });
    }
  };

  const handleSaveReview = async (newReview: Review) => {
    const ok = await saveSection('review', newReview);
    if (ok) {
      setReviews((prev) => {
        const idx = prev.findIndex((r) => r.id === newReview.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = newReview;
          return clone;
        }
        return [...prev, newReview];
      });
    }
  };

  const handleUpdateAppointmentStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    const ok = await saveSection('appointmentStatus', { id, status });
    if (ok) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF7F6]/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B6E73] border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-semibold text-[#062F31]">Loading Clinical CMS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#2BB3B1]/20 selection:text-[#062F31]">
      {/* Decorative ambient background accents */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-[#2BB3B1]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-10 w-[450px] h-[450px] bg-[#0B6E73]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <AdminHeader
        onLogout={handleLogout}
        loggingOut={loggingOut}
        activeTabTitle={tabTitles[activeTab] || 'Overview'}
        mobileOpen={mobileMenuOpen}
        onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl bg-white border border-gray-100 text-xs font-semibold text-[#062F31] animate-in fade-in slide-in-from-bottom-5">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10">
        {/* Left Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setMobileMenuOpen(false);
          }}
          appointments={appointments}
          conditions={conditions}
          chambers={chambers}
          blogs={blogs}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          <div className="transition-all duration-300">
            {activeTab === 'overview' && (
              <AdminOverview
                appointments={appointments}
                conditions={conditions}
                chambers={chambers}
                blogs={blogs}
                reviews={reviews}
                onSelectTab={(tab) => setActiveTab(tab)}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              />
            )}

            {activeTab === 'appointments' && (
              <AdminAppointments
                appointments={appointments}
                onUpdateStatus={handleUpdateAppointmentStatus}
              />
            )}

            {activeTab === 'heroProfile' && heroSection && surgeonProfile && (
              <AdminHeroProfile
                heroSection={heroSection}
                surgeonProfile={surgeonProfile}
                onSaveHero={handleSaveHero}
                onSaveProfile={handleSaveProfile}
              />
            )}

            {activeTab === 'conditions' && (
              <AdminConditions
                conditions={conditions}
                categories={categories}
                onSaveCondition={handleSaveCondition}
              />
            )}

            {activeTab === 'chambers' && (
              <AdminChambers
                chambers={chambers}
                onSaveChamber={handleSaveChamber}
              />
            )}

            {activeTab === 'blogs' && (
              <AdminBlogs
                blogs={blogs}
                categories={categories}
                onSaveBlog={handleSaveBlog}
              />
            )}

            {activeTab === 'faqsReviews' && (
              <AdminFaqsReviews
                faqs={faqs}
                reviews={reviews}
                onSaveFaq={handleSaveFaq}
                onSaveReview={handleSaveReview}
              />
            )}

            {activeTab === 'settings' && siteSettings && (
              <AdminSiteSettings
                siteSettings={siteSettings}
                onSave={handleSaveSiteSettings}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
