'use client';

import React, { useState } from 'react';
import { Save, CheckCircle, Settings, ShieldAlert, Phone, Mail } from 'lucide-react';
import type { SiteSettings } from '@/types/database';

interface AdminSiteSettingsProps {
  siteSettings: SiteSettings;
  onSave: (settings: SiteSettings) => Promise<void>;
}

export function AdminSiteSettings({ siteSettings, onSave }: AdminSiteSettingsProps) {
  const [form, setForm] = useState<SiteSettings>(siteSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-[#062F31]">Global Site Settings</h2>
        <p className="text-xs text-[#062F31]/60">
          Configure emergency contact hotlines, appointment lines, BMDC credentials, and legal disclaimers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#0B6E73]/15 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#2BB3B1]" />
            <h3 className="font-serif font-bold text-lg text-[#062F31]">Brand & Contact Hotlines</h3>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : saved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved Settings</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Brand & Registration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Brand Name (EN)</label>
            <input
              type="text"
              value={form.brand_name_en}
              onChange={(e) => setForm({ ...form, brand_name_en: e.target.value })}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ব্র্যান্ড নাম (BN)</label>
            <input
              type="text"
              value={form.brand_name_bn}
              onChange={(e) => setForm({ ...form, brand_name_bn: e.target.value })}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">BMDC Registration No.</label>
            <input
              type="text"
              value={form.bmdc_reg}
              onChange={(e) => setForm({ ...form, bmdc_reg: e.target.value })}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
            />
          </div>
        </div>

        {/* Phone & Communications */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs font-bold uppercase tracking-wider text-[#062F31] mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0B6E73]" /> Communications Hotlines
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Appointment Serial Line</label>
              <input
                type="text"
                value={form.phone_serial}
                onChange={(e) => setForm({ ...form, phone_serial: e.target.value })}
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Direct Call Line</label>
              <input
                type="text"
                value={form.phone_call}
                onChange={(e) => setForm({ ...form, phone_call: e.target.value })}
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Assistant Hotline</label>
              <input
                type="text"
                value={form.phone_assistant}
                onChange={(e) => setForm({ ...form, phone_assistant: e.target.value })}
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp URL / Number</label>
              <input
                type="text"
                value={form.whatsapp_url}
                onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="pt-4 border-t border-gray-100">
          <div className="max-w-md">
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>Official Inquiries Email</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
            />
          </div>
        </div>

        {/* Emergency Notice Banner */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#062F31]">
                Urgent Notice Top Banner
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.notice_banner_active}
                onChange={(e) => setForm({ ...form, notice_banner_active: e.target.checked })}
                className="w-4 h-4 text-[#0B6E73] rounded"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notice Banner (EN)</label>
              <input
                type="text"
                value={form.notice_banner_en || ''}
                onChange={(e) => setForm({ ...form, notice_banner_en: e.target.value })}
                placeholder="E.g., Dr. Kollol is available this Friday at MMCH..."
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">জরুরি বিজ্ঞপ্তি ব্যানার (BN)</label>
              <input
                type="text"
                value={form.notice_banner_bn || ''}
                onChange={(e) => setForm({ ...form, notice_banner_bn: e.target.value })}
                placeholder="যেমন: এই শুক্রবার শেরপুর চেম্বারে রোগী দেখা হবে..."
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>
        </div>

        {/* Medical Disclaimers */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs font-bold uppercase tracking-wider text-[#062F31] mb-4">
            Legal & Medical Disclaimers
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Disclaimer (EN)</label>
              <textarea
                rows={2}
                value={form.disclaimer_en}
                onChange={(e) => setForm({ ...form, disclaimer_en: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">মেডিকেল সতর্কতা ও ডিসক্লেইমার (BN)</label>
              <textarea
                rows={2}
                value={form.disclaimer_bn}
                onChange={(e) => setForm({ ...form, disclaimer_bn: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
