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
      rvEb: 'Patient reviews',
      rvH: 'What patients say',
      rvLead: 'Real experiences from patients in Sherpur and Mymensingh.',
      gT: 'Google reviews',
      gS: 'Dr. Kollol’s Google rating and reviews will appear here.',
      gSee: 'See reviews on Google',
      gWrite: 'Write a review',
      sample: 'Sample',
    },
    bn: {
      rvEb: 'রোগীদের মতামত',
      rvH: 'রোগীরা যা বলেন',
      rvLead: 'শেরপুর ও ময়মনসিংহের রোগীদের অভিজ্ঞতা।',
      gT: 'Google রিভিউ',
      gS: 'ডাঃ কল্লোলের Google রেটিং ও রিভিউ এখানে দেখা যাবে।',
      gSee: 'Google-এ রিভিউ দেখুন',
      gWrite: 'রিভিউ লিখুন',
      sample: 'নমুনা',
    },
  }[lang];

  return (
    <section className="hx" id="reviews">
      <div className="wrap">
        <p className="eb">{t.rvEb}</p>
        <h2>{t.rvH}</h2>
        <p className="lead">{t.rvLead}</p>

        {/* Google Reviews Glass Box */}
        <div className="gbox glass">
          <span className="g">G</span>
          <div className="gt">
            <b>{t.gT}</b>
            <span>{t.gS}</span>
          </div>
          <div className="row">
            <a
              className="btn btn-p"
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.gSee}
            </a>
            <a
              className="btn btn-g"
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.gWrite}
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="revs">
          {reviews.map((r) => {
            const quote = isBn ? r.quote_bn : r.quote_en;
            const author = isBn ? r.author_name_bn : r.author_name_en;
            const meta = isBn ? r.author_meta_bn : r.author_meta_en;
            const initials = author.replace(/[.\s]/g, '').slice(0, isBn ? 3 : 2);

            return (
              <div key={r.id} className="rev glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="st">{'★'.repeat(r.rating || 5)}</span>
                  <span className="tag-s">{t.sample}</span>
                </div>
                <q>{quote}</q>
                <div className="who">
                  <span className="av">{initials}</span>
                  <div>
                    <b>{author}</b>
                    <span>{meta}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
