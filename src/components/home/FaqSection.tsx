'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ } from '@/types/database';

interface FaqSectionProps {
  faqs: FAQ[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const { lang, isBn } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First item open by default

  const t = {
    en: {
      eyebrow: 'Frequently Asked Questions',
      heading: 'Common Questions Answered',
      lead: 'Clear, reassuring answers from Dr. Kollol regarding surgery, diagnosis, and recovery.',
    },
    bn: {
      eyebrow: 'সাধারণ প্রশ্নোত্তর',
      heading: 'রোগীদের সচরাচর প্রশ্নসমূহ',
      lead: 'অপারেশন, রোগ নির্ণয় ও সুস্থতা নিয়ে ডাঃ কল্লোলের সহজ ও নির্ভরযোগ্য উত্তর।',
    },
  }[lang];

  return (
    <section className="relative z-20 bg-[var(--tint)] py-20 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
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

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white/90 backdrop-blur-md border border-[rgba(43,179,177,0.25)] shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-[var(--ink)] leading-snug">
                    {isBn ? faq.question_bn : faq.question_en}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--aqua)] to-[var(--teal)] text-white text-lg font-bold flex-shrink-0 grid place-items-center transition-transform duration-200 shadow-sm ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[var(--muted)] leading-relaxed border-t border-[rgba(43,179,177,0.15)] animate-in fade-in duration-150">
                    {isBn ? faq.answer_bn : faq.answer_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
