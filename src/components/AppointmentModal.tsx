'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Chamber } from '@/types/database';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chambers: Chamber[];
  whatsappUrl?: string;
}

export function AppointmentModal({
  isOpen,
  onClose,
  chambers,
  whatsappUrl = 'https://wa.me/8801670879100',
}: AppointmentModalProps) {
  const { lang, isBn } = useLanguage();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [chamberName, setChamberName] = useState(
    chambers[0] ? (isBn ? chambers[0].name_bn : chambers[0].name_en) : 'Sherpur - Asia Diagnostic Center'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [problemSummary, setProblemSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const t = {
    en: {
      title: 'Book a Surgical Serial',
      subtitle: 'Leave your details and our assistant will confirm your serial number promptly.',
      nameLabel: 'Patient Full Name',
      phoneLabel: 'Mobile Phone Number',
      chamberLabel: 'Select Chamber',
      dateLabel: 'Preferred Consultation Date',
      problemLabel: 'Problem Summary (Optional)',
      problemPlaceholder: 'e.g. Piles, gallbladder pain, hernia, breast lump, fistula...',
      submitBtn: 'Submit Appointment Request',
      submitting: 'Submitting...',
      successTitle: 'Appointment Request Submitted!',
      successMsg: 'Our serial coordinator will call or WhatsApp you shortly with your serial number.',
      waDirect: 'Send to WhatsApp Directly',
      close: 'Close',
    },
    bn: {
      title: 'ডাক্তারের সিরিয়াল নিন',
      subtitle: 'আপনার তথ্য দিন — আমাদের সহকারী দ্রুত সিরিয়াল নম্বর নিশ্চিত করে জানিয়ে দেবেন।',
      nameLabel: 'রোগীর পূর্ণ নাম',
      phoneLabel: 'মোবাইল নম্বর',
      chamberLabel: 'চেম্বার নির্বাচন করুন',
      dateLabel: 'যে তারিখে দেখাতে চান',
      problemLabel: 'সমস্যার বিবরণ (ঐচ্ছিক)',
      problemPlaceholder: 'যেমন: পাইলস, পিত্তথলির পাথর, হার্নিয়া, স্তনে চাকা, ফিস্টুলা...',
      submitBtn: 'সিরিয়ালের জন্য অনুরোধ পাঠান',
      submitting: 'পাঠানো হচ্ছে...',
      successTitle: 'সিরিয়াল রিকোয়েস্ট জমা হয়েছে!',
      successMsg: 'আমাদের সিরিয়াল সহকারী দ্রুত আপনার নম্বরে কল বা WhatsApp-এ সিরিয়াল জানিয়ে দেবেন।',
      waDirect: 'সরাসরি WhatsApp-এ পাঠান',
      close: 'বন্ধ করুন',
    },
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          patient_phone: patientPhone,
          chamber_name: chamberName,
          preferred_date: preferredDate,
          problem_summary: problemSummary,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMessage(data.message || 'Please check your inputs and try again.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please try again or call directly.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppPrefilledUrl = () => {
    const text = isBn
      ? `আসসালামু আলাইকুম। আমি ডাঃ কল্লোল স্যারের সিরিয়াল নিতে চাই।\nরোগীর নাম: ${patientName || '...'}\nমোবাইল: ${patientPhone || '...'}\nচেম্বার: ${chamberName}\nতারিখ: ${preferredDate || '...'}\nসমস্যা: ${problemSummary || '...'}`
      : `Hello, I would like to book an appointment with Dr. Kollol.\nPatient: ${patientName || '...'}\nPhone: ${patientPhone || '...'}\nChamber: ${chamberName}\nDate: ${preferredDate || '...'}\nProblem: ${problemSummary || '...'}`;
    return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[var(--ink)]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white shadow-2xl border border-[var(--aqua)]/30 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--tint)] hover:bg-[var(--teal)] hover:text-white grid place-items-center text-[var(--muted)] font-bold transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center text-3xl font-extrabold shadow-inner">
              ✓
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[var(--teal)]">
              {t.successTitle}
            </h3>
            <p className="text-sm text-[var(--muted)] max-w-sm">
              {t.successMsg}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
              <a
                href={getWhatsAppPrefilledUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-g flex-1 py-3 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
              >
                {t.waDirect}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-p flex-1 py-3"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--aqua)] block">
                Dr. Fahim Foysal Kollol
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[var(--teal)] mt-1">
                {t.title}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                {t.subtitle}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                  {t.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Md. Rahim / Rashida Begum"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(43,179,177,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                  {t.phoneLabel} *
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(43,179,177,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    {t.chamberLabel} *
                  </label>
                  <select
                    value={chamberName}
                    onChange={(e) => setChamberName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(43,179,177,0.3)] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  >
                    {chambers.map((ch) => (
                      <option key={ch.id} value={isBn ? ch.name_bn : ch.name_en}>
                        {isBn ? ch.schedule_bn : ch.schedule_en} ({isBn ? ch.name_bn : ch.name_en})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    {t.dateLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[rgba(43,179,177,0.3)] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                  {t.problemLabel}
                </label>
                <textarea
                  rows={2}
                  value={problemSummary}
                  onChange={(e) => setProblemSummary(e.target.value)}
                  placeholder={t.problemPlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-[rgba(43,179,177,0.3)] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-p w-full py-3.5 mt-2 font-bold shadow-md"
              >
                {loading ? t.submitting : t.submitBtn}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[var(--muted)]">
                <span>or</span>
                <a
                  href={getWhatsAppPrefilledUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  {t.waDirect} →
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
