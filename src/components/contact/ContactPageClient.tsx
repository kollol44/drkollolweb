'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { AppointmentModal } from '@/components/AppointmentModal';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Chamber, SiteSettings } from '@/types/database';

interface ContactPageClientProps {
  categories: Category[];
  settings: SiteSettings;
  chambers: Chamber[];
}

export function ContactPageClient({
  categories,
  settings,
  chambers,
}: ContactPageClientProps) {
  const { lang, isBn } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChamberIdx, setSelectedChamberIdx] = useState(0);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [chamberName, setChamberName] = useState(
    chambers[0] ? (isBn ? chambers[0].name_bn : chambers[0].name_en) : 'Sherpur'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [problemSummary, setProblemSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = {
    en: {
      eyebrow: 'Appointments & Locations',
      heading: 'Chambers & Contact Information',
      lead: 'Dr. Fahim Foysal Kollol consults patients at Sherpur on Thursdays and Fridays, and at Mymensingh from Saturday to Tuesday.',
      formTitle: 'Book an Appointment Serial Online',
      formSub: 'Submit your request below, and our coordinator will confirm your exact serial number.',
      name: 'Patient Name',
      phone: 'Mobile Phone',
      chamber: 'Select Chamber',
      date: 'Consultation Date',
      problem: 'Problem Summary (Optional)',
      submit: 'Confirm Serial Request',
      submitting: 'Submitting...',
      successTitle: 'Request Received!',
      successSub: 'Our serial assistant will reach out promptly to confirm your appointment.',
      callUs: 'Call for Immediate Serial',
      assistantCall: 'Assistant Serial Phone',
      waConsult: 'WhatsApp Consultation',
      mapDirections: 'Directions on Google Maps →',
    },
    bn: {
      eyebrow: 'চেম্বার ও সিরিয়াল',
      heading: 'চেম্বার ও সরাসরি যোগাযোগ',
      lead: 'ডাঃ ফাহিম ফয়সাল কল্লোল শেরপুরে প্রতি বৃহস্পতি ও শুক্রবার এবং ময়মনসিংহে শনি থেকে মঙ্গলবার নিয়মিত রোগী দেখেন।',
      formTitle: 'অনলাইনে সিরিয়ালের জন্য বুকিং করুন',
      formSub: 'নিচে তথ্য জমা দিন — আমাদের সিরিয়াল সহকারী দ্রুত আপনার সিরিয়াল নম্বর নিশ্চিত করবেন।',
      name: 'রোগীর নাম',
      phone: 'মোবাইল নম্বর',
      chamber: 'চেম্বার নির্বাচন করুন',
      date: 'দেখানোর তারিখ',
      problem: 'সমস্যার বিবরণ (ঐচ্ছিক)',
      submit: 'সিরিয়াল কনফার্ম করুন',
      submitting: 'পাঠানো হচ্ছে...',
      successTitle: 'সিরিয়াল রিকোয়েস্ট সফলভাবে জমা হয়েছে!',
      successSub: 'আমাদের সিরিয়াল সহকারী দ্রুত কল বা WhatsApp-এ আপনার সিরিয়াল জানিয়ে দেবেন।',
      callUs: 'সরাসরি সিরিয়ালের জন্য কল',
      assistantCall: 'সহকারী মিলন (সিরিয়াল)',
      waConsult: 'WhatsApp-এ পরামর্শ',
      mapDirections: 'Google Maps-এ দেখুন →',
    },
  }[lang];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

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
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || 'Please check your inputs and try again.');
      }
    } catch {
      setErrorMsg('Failed to submit appointment. Please call directly.');
    } finally {
      setLoading(false);
    }
  };

  const currentChamber = chambers[selectedChamberIdx] || chambers[0];

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar
        categories={categories}
        serialPhone={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Header */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--tint)] to-white border-b border-[rgba(43,179,177,0.2)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
            {t.eyebrow}
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[var(--teal)] leading-tight tracking-tight mt-1">
            {t.heading}
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl mx-auto mt-2 leading-relaxed">
            {t.lead}
          </p>
        </div>
      </section>

      {/* 3 Chamber Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chambers.map((ch, idx) => (
              <div
                key={ch.id}
                onClick={() => setSelectedChamberIdx(idx)}
                className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  selectedChamberIdx === idx
                    ? 'bg-white border-[var(--teal)] shadow-lg ring-2 ring-[var(--teal)]/20 scale-[1.02]'
                    : 'bg-[var(--tint)]/50 border-[rgba(43,179,177,0.25)] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--aqua)]">
                      {isBn ? ch.schedule_bn : ch.schedule_en}
                    </span>
                    {ch.is_highlighted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--teal)] text-white">
                        {isBn ? 'শেরপুর চেম্বার' : 'Sherpur Highlight'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-xl text-[var(--ink)] leading-snug">
                    {isBn ? ch.name_bn : ch.name_en}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 leading-relaxed">
                    {isBn ? ch.address_bn : ch.address_en}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-[rgba(43,179,177,0.2)] text-xs font-semibold text-[var(--teal)]">
                    ⏰ {isBn ? ch.timing_bn : ch.timing_en}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[rgba(43,179,177,0.18)] flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ch.map_query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[var(--teal)] hover:underline"
                  >
                    {t.mapDirections}
                  </a>
                  <a href={`tel:${settings.phone_serial}`} className="text-xs font-bold text-[var(--ink)]">
                    {settings.phone_serial}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid: Form Left, Google Map Right */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--tint)] border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Booking Form (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[rgba(43,179,177,0.3)] shadow-md">
            <h3 className="font-heading font-extrabold text-2xl text-[var(--ink)]">
              {t.formTitle}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1 mb-6">
              {t.formSub}
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-2">
                <span className="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-2xl grid place-items-center">
                  ✓
                </span>
                <h4 className="font-heading font-bold text-lg text-emerald-900 mt-2">
                  {t.successTitle}
                </h4>
                <p className="text-xs text-emerald-800">
                  {t.successSub}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn btn-p text-xs py-2 px-4 mt-3"
                >
                  Book another serial
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    {t.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Md. Rahim"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(43,179,177,0.3)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(43,179,177,0.3)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      {t.chamber} *
                    </label>
                    <select
                      value={chamberName}
                      onChange={(e) => setChamberName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[rgba(43,179,177,0.3)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
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
                      {t.date} *
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[rgba(43,179,177,0.3)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    {t.problem}
                  </label>
                  <textarea
                    rows={2}
                    value={problemSummary}
                    onChange={(e) => setProblemSummary(e.target.value)}
                    placeholder="e.g. Gallstone diagnosis, Piles bleeding, Inguinal hernia..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[rgba(43,179,177,0.3)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-p w-full py-3.5 mt-2 font-bold shadow-md"
                >
                  {loading ? t.submitting : t.submit}
                </button>
              </form>
            )}
          </div>

          {/* Map & Helplines (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="p-5 rounded-3xl bg-white border border-[rgba(43,179,177,0.3)] shadow-sm">
              <h4 className="font-heading font-bold text-lg text-[var(--ink)] mb-1">
                {isBn ? currentChamber.name_bn : currentChamber.name_en}
              </h4>
              <p className="text-xs text-[var(--muted)] mb-3">
                {isBn ? currentChamber.address_bn : currentChamber.address_en}
              </p>

              <div className="w-full h-80 rounded-2xl overflow-hidden border border-[rgba(43,179,177,0.2)]">
                <iframe
                  title={`Map for ${currentChamber.name_en}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(currentChamber.map_query)}&z=16&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Helpline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm">
                <span className="text-[11px] font-bold uppercase text-[var(--aqua)] block">{t.callUs}</span>
                <a href={`tel:${settings.phone_serial}`} className="font-heading font-bold text-lg text-[var(--teal)] hover:underline block mt-1">
                  {settings.phone_serial}
                </a>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm">
                <span className="text-[11px] font-bold uppercase text-[var(--aqua)] block">{t.assistantCall}</span>
                <a href={`tel:${settings.phone_assistant}`} className="font-heading font-bold text-lg text-[var(--teal)] hover:underline block mt-1">
                  {settings.phone_assistant}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer
        settings={settings}
        categories={categories}
        chambers={chambers}
      />

      <MobileStickyBar
        phoneCall={settings.phone_call}
        whatsappUrl={settings.whatsapp_url}
        phoneSerial={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chambers={chambers}
        whatsappUrl={settings.whatsapp_url}
      />
    </div>
  );
}
