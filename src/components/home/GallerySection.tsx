'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function GallerySection() {
  const { lang } = useLanguage();

  const t = {
    en: {
      eyebrow: 'Clinical Practice',
      heading: 'Inside the Surgery',
      lead: 'Operation theatres, clinical chambers, health camps, and medical conferences.',
      items: [
        'Operation Theatre & Laparoscopy',
        'Sherpur Consultation Chamber',
        'Mymensingh New Medicare Chamber',
        'Rural Health Camps & Community Work',
        'Surgical Conferences & Research Seminars',
        'Patient Consultation & Clinical Care',
      ],
      comingSoon: 'Photo updates coming soon',
    },
    bn: {
      eyebrow: 'গ্যালারি',
      heading: 'চিকিৎসা ও সেবার মুহূর্ত',
      lead: 'অপারেশন থিয়েটার, চেম্বার, স্বাস্থ্য ক্যাম্প ও মেডিকেল সম্মেলন।',
      items: [
        'অপারেশন থিয়েটার ও ল্যাপারোস্কপি',
        'শেরপুর চেম্বার ও রোগী দেখা',
        'ময়মনসিংহ নিউ মেডিকেয়ার চেম্বার',
        'ফ্রি স্বাস্থ্য ক্যাম্প ও সামাজিক সেবা',
        'সার্জিক্যাল সম্মেলন ও সেমিনার',
        'রোগীদের যত্ন ও পরামর্শ',
      ],
      comingSoon: 'ছবি শীঘ্রই যুক্ত হবে',
    },
  }[lang];

  return (
    <section className="relative z-20 bg-white py-20 px-4 sm:px-6 lg:px-8" id="gallery">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
            {t.eyebrow}
          </span>
          <h2 className="font-heading font-extrabold text-[clamp(34px,4.5vw,64px)] leading-tight tracking-tight bg-gradient-to-b from-[var(--teal)] via-[var(--teal)]/80 to-[rgba(43,179,177,0.5)] bg-clip-text text-transparent mt-1">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            {t.lead}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[190px]">
          {t.items.map((item, idx) => {
            const isSpan2 = idx === 0 || idx === 5;
            return (
              <div
                key={idx}
                className={`relative rounded-3xl overflow-hidden border border-dashed border-[rgba(43,179,177,0.35)] bg-gradient-to-br from-white to-[var(--tint)] p-4 flex flex-col justify-end shadow-sm hover:border-[var(--teal)] transition-all ${
                  isSpan2 ? 'col-span-2 row-span-1 sm:row-span-2' : ''
                }`}
              >
                <div className="z-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-[rgba(43,179,177,0.2)]">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-[var(--ink)] leading-snug">
                    {item}
                  </h4>
                  <span className="text-[10px] text-[var(--muted)] mt-0.5 block">
                    {t.comingSoon}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
