'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function GallerySection() {
  const { lang } = useLanguage();

  const t = {
    en: {
      glEb: 'Gallery',
      glH: 'Inside the practice',
      glLead: 'Operation theatre, chambers, health camps and conferences.',
      gsoon: 'Photos coming soon',
      gal: [
        'Operation theatre',
        'Sherpur chamber',
        'Mymensingh chamber',
        'Health camps',
        'Conferences',
        'With patients',
      ],
    },
    bn: {
      glEb: 'গ্যালারি',
      glH: 'ছবিতে চিকিৎসা ও চেম্বার',
      glLead: 'অপারেশন থিয়েটার, চেম্বার, স্বাস্থ্য ক্যাম্প ও সম্মেলন।',
      gsoon: 'ছবি শীঘ্রই আসছে',
      gal: [
        'অপারেশন থিয়েটার',
        'শেরপুর চেম্বার',
        'ময়মনসিংহ চেম্বার',
        'স্বাস্থ্য ক্যাম্প',
        'সম্মেলন',
        'রোগীদের সাথে',
      ],
    },
  }[lang];

  return (
    <section className="hx" id="gallery">
      <div className="wrap">
        <p className="eb">{t.glEb}</p>
        <h2>{t.glH}</h2>
        <p className="lead">{t.glLead}</p>

        <div className="gal">
          {t.gal.map((g, idx) => (
            <div key={idx} className="ph">
              <div>
                <b>{g}</b>
                <small>{t.gsoon}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
