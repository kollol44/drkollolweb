'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Review } from '@/types/database';

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { lang, isBn } = useLanguage();

  const t = {
    en: {
      eyebrow: 'Patient Reviews',
      heading: 'What patients say',
      lead: 'Real experiences from patients treated in Sherpur and Mymensingh.',
      googleTitle: 'Google Reviews',
      googleDesc: 'Dr. Kollol’s verified patient ratings and reviews.',
      seeGoogle: 'See reviews on Google',
      writeGoogle: 'Write a review',
      sampleTag: 'Sample',
    },
    bn: {
      eyebrow: 'রোগীদের মতামত',
      heading: 'রোগীরা যা বলেন',
      lead: 'শেরপুর ও ময়মনসিংহের রোগীদের বাস্তব অভিজ্ঞতা।',
      googleTitle: 'Google রিভিউ',
      googleDesc: 'ডাঃ কল্লোলের ভেরিফাইড রোগী রেটিং ও রিভিউ।',
      seeGoogle: 'Google-এ রিভিউ দেখুন',
      writeGoogle: 'রিভিউ লিখুন',
      sampleTag: 'নমুনা',
    },
  }[lang];

  return (
    <section className="relative z-20 bg-white py-20 px-4 sm:px-6 lg:px-8" id="reviews">
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

          {/* Google Review Box */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white/80 border border-[rgba(43,179,177,0.25)] shadow-sm flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-white border border-[rgba(43,179,177,0.3)] grid place-items-center font-heading font-extrabold text-2xl text-[var(--teal)] shadow-sm">
                G
              </span>
              <div className="text-left">
                <h4 className="font-heading font-bold text-base text-[var(--ink)]">
                  {t.googleTitle}
                </h4>
                <p className="text-xs text-[var(--muted)]">
                  {t.googleDesc}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-p text-xs py-2 px-3.5 shadow-sm"
              >
                {t.seeGoogle}
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-g text-xs py-2 px-3 shadow-sm"
              >
                {t.writeGoogle}
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-[rgba(43,179,177,0.25)] shadow-[0_16px_36px_-20px_rgba(6,47,49,0.25)] flex flex-col justify-between gap-4 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-amber-400 tracking-widest text-sm font-bold">
                    {'★'.repeat(r.rating)}
                  </div>
                  {r.is_sample && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {t.sampleTag}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[var(--ink)] leading-relaxed italic">
                  “{isBn ? r.quote_bn : r.quote_en}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[rgba(43,179,177,0.15)]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--aqua)] to-[var(--teal)] text-white font-bold text-xs grid place-items-center shadow-sm">
                  {(isBn ? r.author_name_bn : r.author_name_en).slice(0, 2)}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[var(--ink)] leading-none">
                    {isBn ? r.author_name_bn : r.author_name_en}
                  </h5>
                  <span className="text-[11px] text-[var(--muted)] mt-1 block">
                    {isBn ? r.author_meta_bn : r.author_meta_en}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
