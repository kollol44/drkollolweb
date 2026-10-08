'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ } from '@/types/database';

interface FaqSectionProps {
  faqs: FAQ[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const { lang, isBn } = useLanguage();

  const t = {
    en: {
      fqEb: 'FAQ',
      fqH: 'Common questions',
    },
    bn: {
      fqEb: 'প্রশ্নোত্তর',
      fqH: 'সাধারণ প্রশ্ন',
    },
  }[lang];

  return (
    <section className="hx tint" id="faq">
      <div className="wrap">
        <p className="eb">{t.fqEb}</p>
        <h2>{t.fqH}</h2>

        <div className="faq">
          {faqs.map((f, idx) => (
            <details key={f.id} className="glass" open={idx === 0}>
              <summary>{isBn ? f.question_bn : f.question_en}</summary>
              <p>{isBn ? f.answer_bn : f.answer_en}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
