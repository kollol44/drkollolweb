'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function VideosSection() {
  const { lang } = useLanguage();

  const t = {
    en: {
      vdEb: 'Videos',
      vdH: 'Watch & understand',
      vdLead: 'Short videos where Dr. Kollol explains common problems and surgeries.',
      soon: 'Videos coming soon',
    },
    bn: {
      vdEb: 'ভিডিও',
      vdH: 'ভিডিওতে জেনে নিন',
      vdLead: 'সাধারণ রোগ ও অপারেশন নিয়ে ডাঃ কল্লোলের ছোট ছোট ভিডিও।',
      soon: 'ভিডিও শীঘ্রই আসছে',
    },
  }[lang];

  return (
    <section className="hx tint" id="videos">
      <div className="wrap">
        <p className="eb">{t.vdEb}</p>
        <h2>{t.vdH}</h2>
        <p className="lead">{t.vdLead}</p>

        <div className="vid">
          <div className="ph main">
            <div>
              <span className="play" />
              <small>{t.soon}</small>
            </div>
          </div>
          <div className="stack">
            {[1, 2, 3].map((item) => (
              <div key={item} className="ph">
                <div>
                  <span className="play sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
