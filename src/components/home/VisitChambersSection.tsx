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

  const SERIAL_NO = '01750529252';
  const CALL_NO = '01670879100';
  const WA_URL = 'https://wa.me/8801670879100';

  const t = {
    en: {
      brand: 'Dr. Kollol',
      vH: 'Don’t wait. Talk to your surgeon.',
      vP: 'Call for a serial or come to the chamber — Dr. Kollol will explain your problem and the right treatment.',
      book: 'Book a serial',
      call: 'Call now',
      wa: 'WhatsApp',
      dir: 'Directions →',
      mapH: 'Find the chamber',
      mapS: 'Tap a chamber to see it on the map.',
      mapNote: 'Map location for Asia Diagnostic Center (Sherpur) is approximate — it is not listed on Google Maps yet.',
      ch: [
        {
          t: 'Sherpur · Thursday',
          n: 'Asia Diagnostic Center',
          a: 'Zila Hospital Road, Narayanpur · 3 PM – 9 PM',
          q: 'Sadar Hospital Road, Narayanpur, Sherpur',
          ok: false,
        },
        {
          t: 'Sherpur · Friday',
          n: 'Amjad Diagnostic Center',
          a: 'Zila Hospital Road, Narayanpur · 11 AM – 9 PM',
          q: 'Amzad diagnostic center, Sherpur',
          ok: true,
        },
        {
          t: 'Mymensingh · Sat – Tue',
          n: 'New Medicare Pathology Lab',
          a: '204 Charpara (opp. Hospital Gate 1, 5th floor) · 3:30 PM – 8 PM',
          q: 'New medicare Path. Lab, Charpara, Mymensingh',
          ok: true,
        },
      ],
    },
    bn: {
      brand: 'ডাঃ কল্লোল',
      vH: 'দেরি নয়। আপনার সার্জনের সাথে কথা বলুন।',
      vP: 'সিরিয়ালের জন্য কল করুন বা চেম্বারে আসুন — ডাঃ কল্লোল আপনার সমস্যা ও সঠিক চিকিৎসা বুঝিয়ে বলবেন।',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
      wa: 'WhatsApp',
      dir: 'দিকনির্দেশনা →',
      mapH: 'চেম্বার খুঁজে নিন',
      mapS: 'ম্যাপে দেখতে একটা চেম্বারে চাপ দিন।',
      mapNote: 'শেরপুরের এশিয়া ডায়াগনস্টিক সেন্টারের লোকেশন আনুমানিক — Google Maps-এ এখনো তালিকাভুক্ত নয়।',
      ch: [
        {
          t: 'শেরপুর · বৃহস্পতিবার',
          n: 'এশিয়া ডায়াগনস্টিক সেন্টার',
          a: 'জেলা হাসপাতাল রোড, নারায়ণপুর · দুপুর ৩টা – রাত ৯টা',
          q: 'Sadar Hospital Road, Narayanpur, Sherpur',
          ok: false,
        },
        {
          t: 'শেরপুর · শুক্রবার',
          n: 'আমজাদ ডায়াগনস্টিক সেন্টার',
          a: 'জেলা হাসপাতাল রোড, নারায়ণপুর · সকাল ১১টা – রাত ৯টা',
          q: 'Amzad diagnostic center, Sherpur',
          ok: true,
        },
        {
          t: 'ময়মনসিংহ · শনি – মঙ্গল',
          n: 'নিউ মেডিকেয়ার প্যাথলজি ল্যাব',
          a: '২০৪ চরপাড়া (১নং হাসপাতাল গেটের বিপরীতে, ৫ম তলা) · বিকাল ৩:৩০টা – রাত ৮টা',
          q: 'New medicare Path. Lab, Charpara, Mymensingh',
          ok: true,
        },
      ],
    },
  }[lang];

  const currentCh = t.ch[selectedChamberIdx] || t.ch[0];

  const handleChamberClick = (idx: number) => {
    if (selectedChamberIdx === idx) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.ch[idx].q)}`,
        '_blank',
        'noopener'
      );
    } else {
      setSelectedChamberIdx(idx);
    }
  };

  return (
    <section className="hx tint visit" id="visit">
      <div className="v-stage">
        <div className="v-big" id="vBig">
          {t.brand}
        </div>

        <div className="v-doc">
          <Image
            src="/img/doctor-cta.webp"
            alt="Dr. Fahim Foysal Kollol"
            width={649}
            height={1081}
            loading="lazy"
          />
        </div>

        <div className="v-cta glass" id="vCta">
          <h3>{t.vH}</h3>
          <p>{t.vP}</p>
          <div className="row">
            {onBookClick ? (
              <button type="button" onClick={onBookClick} className="btn btn-p">
                {t.book}
              </button>
            ) : (
              <a href={`tel:${SERIAL_NO}`} className="btn btn-p">
                {t.book}
              </a>
            )}
            <a href={`tel:${CALL_NO}`} className="btn btn-g">
              {t.call}
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn btn-g">
              {t.wa}
            </a>
          </div>
        </div>

        <div className="v-chs" id="vChs">
          {t.ch.map((x, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChamberClick(idx)}
              className={`v-ch glass ${selectedChamberIdx === idx ? 'on' : ''}`}
            >
              <small>{x.t}</small>
              <b>{x.n}</b>
              <span>{x.a}</span>
              <em>{t.dir}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="v-map" id="vMap">
        <div className="mh">
          <div>
            <b>{t.mapH}</b>
            <span>{t.mapS}</span>
          </div>
        </div>
        <iframe
          id="mapFrame"
          title="Chamber Map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodeURIComponent(currentCh.q)}&z=16&output=embed`}
        />
        {!currentCh.ok && <p className="note">{t.mapNote}</p>}
      </div>
    </section>
  );
}
