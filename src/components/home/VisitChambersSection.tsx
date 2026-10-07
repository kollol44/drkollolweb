'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Chamber, SiteSettings } from '@/types/database';

interface VisitChambersSectionProps {
  settings: SiteSettings;
  chambers: Chamber[];
  onBookClick?: () => void;
}

export function VisitChambersSection({ settings, chambers, onBookClick }: VisitChambersSectionProps) {
  const { lang, isBn } = useLanguage();
  const [selectedChamberIdx, setSelectedChamberIdx] = useState(0);

  const t = {
    en: {
      ctaTitle: 'Don’t wait. Talk to your surgeon.',
      ctaDesc: 'Call for a serial or come to the chamber — Dr. Kollol will examine your problem carefully and explain the right treatment.',
      book: 'Book a serial',
      call: 'Call now',
      wa: 'WhatsApp',
      mapHeader: 'Find the Chamber on Google Maps',
      mapSub: 'Click any chamber above to update the map pin below.',
      directions: 'Open Directions in Google Maps →',
      unverifiedNote: 'Map location for Asia Diagnostic Center (Sherpur) is approximate — confirm via call.',
    },
    bn: {
      ctaTitle: 'দেরি নয়। আপনার সার্জনের সাথে কথা বলুন।',
      ctaDesc: 'সিরিয়ালের জন্য কল করুন বা চেম্বারে আসুন — ডাঃ কল্লোল যত্ন নিয়ে আপনার সমস্যা পরীক্ষা করে সঠিক চিকিৎসা পদ্ধতি বুঝিয়ে বলবেন।',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
      wa: 'WhatsApp',
      mapHeader: 'গুগল ম্যাপে চেম্বার খুঁজুন',
      mapSub: 'ম্যাপে দেখতে ওপরের যেকোনো চেম্বারে চাপ দিন।',
      directions: 'Google Maps-এ দিকনির্দেশনা খুলুন →',
      unverifiedNote: 'শেরপুরের এশিয়া ডায়াগনস্টিক সেন্টারের লোকেশন আনুমানিক — আসার আগে ফোন করে নিশ্চিত হন।',
    },
  }[lang];

  const currentChamber = chambers[selectedChamberIdx] || chambers[0];

  return (
    <section className="relative z-20 bg-[var(--tint)] pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden" id="visit">
      <div className="max-w-7xl mx-auto">
        {/* Stage with Doctor Centered, CTA Left, Chambers Right */}
        <div className="relative min-h-[min(90vh,760px)] grid grid-cols-1 lg:grid-cols-12 items-center gap-8 mb-16">
          {/* Giant Brand Name Behind Doctor */}
          <div className="absolute inset-x-0 top-0 text-center font-heading font-extrabold text-[clamp(44px,9vw,150px)] leading-[0.9] tracking-tight bg-gradient-to-b from-[var(--teal)]/40 via-[var(--teal)]/20 to-transparent bg-clip-text text-transparent pointer-events-none select-none max-w-full overflow-hidden px-2">
            {isBn ? settings.brand_name_bn : settings.brand_name_en}
          </div>

          {/* Left: CTA Glass Card (4 cols) */}
          <div className="lg:col-span-4 z-10 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-2xl border border-[rgba(43,179,177,0.3)] shadow-[0_20px_44px_-24px_rgba(6,47,49,0.35)]">
            <span className="block w-12 h-1 bg-[var(--teal)] rounded-full mb-4" />
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[var(--ink)] leading-snug">
              {t.ctaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mt-3 mb-6">
              {t.ctaDesc}
            </p>

            <div className="flex flex-col gap-2.5">
              {onBookClick ? (
                <button type="button" onClick={onBookClick} className="btn btn-p w-full py-3 shadow-sm font-bold">
                  {t.book}: {settings.phone_serial}
                </button>
              ) : (
                <a href={`tel:${settings.phone_serial}`} className="btn btn-p w-full py-3 text-center shadow-sm font-bold">
                  {t.book}: {settings.phone_serial}
                </a>
              )}
              <div className="flex gap-2">
                <a href={`tel:${settings.phone_call}`} className="btn btn-g flex-1 py-2.5 text-xs text-center font-bold">
                  {t.call}
                </a>
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-g flex-1 py-2.5 text-xs text-center font-bold text-emerald-800 border-emerald-300 bg-emerald-50/60"
                >
                  {t.wa}
                </a>
              </div>
            </div>
          </div>

          {/* Center: Doctor CTA Cutout (4 cols) */}
          <div className="lg:col-span-4 z-10 flex justify-center items-end h-[min(65vh,600px)] pointer-events-none">
            <Image
              src="/img/doctor-cta.webp"
              alt="Dr. Fahim Foysal Kollol"
              width={649}
              height={1081}
              className="h-full w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(6,47,49,0.25)] anim-float"
            />
          </div>

          {/* Right: 3 Chamber Selector Cards (4 cols) */}
          <div className="lg:col-span-4 z-10 flex flex-col gap-3">
            {chambers.map((ch, idx) => {
              const isSelected = selectedChamberIdx === idx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChamberIdx(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[var(--teal)] shadow-md ring-2 ring-[var(--teal)]/20 scale-[1.02]'
                      : 'bg-white/70 border-[rgba(43,179,177,0.25)] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--aqua)]">
                      {isBn ? ch.schedule_bn : ch.schedule_en}
                    </span>
                    {ch.is_highlighted && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--teal)] border border-[var(--aqua)]/30">
                        {isBn ? 'শেরপুর' : 'Sherpur'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-base text-[var(--ink)] leading-snug">
                    {isBn ? ch.name_bn : ch.name_en}
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">
                    {isBn ? ch.address_bn : ch.address_en}
                  </p>
                  <p className="text-xs font-semibold text-[var(--teal)] mt-1">
                    {isBn ? ch.timing_bn : ch.timing_en}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="mt-8 p-4 sm:p-6 rounded-3xl bg-white border border-[rgba(43,179,177,0.3)] shadow-[0_20px_44px_-26px_rgba(6,47,49,0.35)]">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h4 className="font-heading font-bold text-lg text-[var(--ink)]">
                {t.mapHeader}: {isBn ? currentChamber.name_bn : currentChamber.name_en}
              </h4>
              <p className="text-xs text-[var(--muted)]">
                {isBn ? currentChamber.address_bn : currentChamber.address_en} · {isBn ? currentChamber.timing_bn : currentChamber.timing_en}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentChamber.map_query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-g text-xs py-2 px-3.5 shadow-sm font-semibold"
            >
              {t.directions}
            </a>
          </div>

          <div className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-[var(--tint)] border border-[rgba(43,179,177,0.2)]">
            <iframe
              title={`Map for ${currentChamber.name_en}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(currentChamber.map_query)}&z=16&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {!currentChamber.is_map_verified && (
            <p className="text-xs text-amber-800 font-medium mt-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              ⚠️ {t.unverifiedNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
