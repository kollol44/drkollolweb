'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { AppointmentModal } from '@/components/AppointmentModal';
import { PinnedShowcase, ShowcaseStep } from '@/components/common/PinnedShowcase';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Condition, SiteSettings, Chamber } from '@/types/database';

interface ConditionPageClientProps {
  condition: Condition;
  category: Category;
  categories: Category[];
  relatedConditions: Condition[];
  settings: SiteSettings;
  chambers: Chamber[];
}

export function ConditionPageClient({
  condition,
  category,
  categories,
  relatedConditions,
  settings,
  chambers,
}: ConditionPageClientProps) {
  const { lang, isBn } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const t = {
    en: {
      all: 'Conditions & Treatments',
      what: 'What is it?',
      whatW: 'What is it?',
      symp: 'Symptoms',
      sympT: 'Do you experience these?',
      treat: 'Treatment',
      treatT: 'How Dr. Kollol treats it',
      when: 'When to see a doctor',
      whenW: 'Don’t wait',
      whenT: 'Act early for best results',
      lap: 'Laparoscopic keyhole procedure',
      relEb: 'Related Conditions',
      relH: 'Other conditions in this anatomical area',
      book: 'Book a serial',
      call: 'Call now',
      wa: 'WhatsApp',
      ctaH: 'Don’t wait. Talk to your surgeon.',
      ctaS: 'Call for a serial or come to the chamber — Dr. Kollol will explain your problem and the right treatment.',
      onPage: 'On this page',
    },
    bn: {
      all: 'রোগ ও চিকিৎসা',
      what: 'এটা কী?',
      whatW: 'রোগের পরিচয়',
      symp: 'লক্ষণসমূহ',
      sympT: 'আপনার কি এমন হচ্ছে?',
      treat: 'চিকিৎসা পদ্ধতি',
      treatT: 'ডাঃ কল্লোল যেভাবে চিকিৎসা করেন',
      when: 'কখন ডাক্তার দেখাবেন',
      whenW: 'দেরি নয়',
      whenT: 'শুরুতেই চিকিৎসা নিন',
      lap: 'ল্যাপারোস্কপিক (ছোট ছিদ্রে) অপারেশন',
      relEb: 'আরও দেখুন',
      relH: 'এই ক্ষেত্রের অন্যান্য রোগ ও চিকিৎসা',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
      wa: 'হোয়াটসঅ্যাপ',
      ctaH: 'দেরি করবেন না। সার্জনের সাথে কথা বলুন।',
      ctaS: 'সিরিয়ালের জন্য কল করুন বা চেম্বারে আসুন — ডাঃ কল্লোল আপনার সমস্যা ও সঠিক চিকিৎসা বুঝিয়ে বলবেন।',
      onPage: 'এই পাতায় রয়েছে',
    },
  }[lang];

  const steps: ShowcaseStep[] = [
    // Step 1: Overview & TOC
    {
      word: isBn ? (condition.home_word_bn || condition.name_bn) : (condition.home_word_en || condition.name_en),
      cat: condition.category_slug,
      ey: isBn ? category.name_bn : category.name_en,
      title: isBn ? condition.name_bn : condition.name_en,
      body: (
        <div>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            {isBn ? condition.short_bn : condition.short_en}
          </p>

          {/* Table of contents pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-3 border-t border-[rgba(43,179,177,0.2)]">
            <span className="w-full text-[10px] font-bold uppercase tracking-wider text-[var(--aqua)] block">
              {t.onPage}:
            </span>
            {[t.what, t.symp, t.treat, t.when].map((tab, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--tint)] text-[11px] font-semibold text-[var(--ink)] border border-[rgba(43,179,177,0.25)]"
              >
                <i className="w-4 h-4 rounded-full bg-[var(--teal)] text-white not-italic text-[10px] grid place-items-center">
                  {idx + 1}
                </i>
                <span>{tab}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-p text-xs py-2 px-4 shadow-sm"
            >
              {t.book}
            </button>
            <a
              href={settings.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-g text-xs py-2 px-3.5 shadow-sm text-emerald-800 border-emerald-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ),
    },

    // Step 2: What is it?
    {
      word: t.whatW,
      cat: condition.category_slug,
      ey: t.what,
      title: isBn ? condition.name_bn : condition.name_en,
      body: (
        <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed">
          {isBn ? condition.what_bn : condition.what_en}
        </p>
      ),
    },

    // Step 3: Symptoms
    {
      word: t.symp,
      cat: condition.category_slug,
      ey: t.symp,
      title: t.sympT,
      body: (
        <ul className="flex flex-col gap-2 mt-1">
          {(isBn ? condition.symptoms_bn : condition.symptoms_en).map((symp, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--ink)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--aqua)] mt-1.5 flex-shrink-0" />
              <span>{symp}</span>
            </li>
          ))}
        </ul>
      ),
    },

    // Step 4: Treatment
    {
      word: t.treat,
      cat: condition.category_slug,
      ey: t.treat,
      title: t.treatT,
      body: (
        <div>
          <ol className="flex flex-col gap-2.5 mt-1">
            {(isBn ? condition.treat_bn : condition.treat_en).map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--ink)] font-medium">
                <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-[var(--aqua)] to-[var(--teal)] text-white text-xs font-bold grid place-items-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {condition.stat_en && (
            <div className="mt-4 p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-[var(--teal)] flex items-center gap-2">
              <span>✓</span>
              <span>{isBn ? condition.stat_bn : condition.stat_en}</span>
            </div>
          )}
        </div>
      ),
    },

    // Step 5: When to see a doctor (Alert card)
    {
      word: t.whenW,
      cat: condition.category_slug,
      ey: t.when,
      title: t.whenT,
      alert: true,
      body: (
        <div>
          <p className="text-sm text-[var(--ink)] font-medium leading-relaxed">
            {isBn ? condition.when_bn : condition.when_en}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-p text-xs py-2 px-4 shadow-sm"
            >
              {t.book}
            </button>
            <a
              href={`tel:${settings.phone_serial}`}
              className="btn btn-g text-xs py-2 px-4 shadow-sm"
            >
              {settings.phone_serial}
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar
        categories={categories}
        serialPhone={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Pinned Showcase in Hero Mode */}
      <PinnedShowcase
        steps={steps}
        mode="hero"
        heroImg={condition.image_url || `/img/conditions/${condition.slug}.webp`}
        crumb={
          <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--teal)] font-bold">
            <Link href="/conditions-treatments" className="hover:underline">
              {t.all}
            </Link>
            <span>/</span>
            <Link href={`/conditions-treatments/${category.slug}`} className="hover:underline">
              {isBn ? category.name_bn : category.name_en}
            </Link>
            <span>/</span>
            <span>{isBn ? condition.name_bn : condition.name_en}</span>
          </div>
        }
      />

      {/* Related Conditions in this Area */}
      {relatedConditions.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--tint)] border-t border-[rgba(43,179,177,0.25)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
                {t.relEb}
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[var(--ink)] mt-1">
                {t.relH}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedConditions.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/conditions-treatments/${rel.category_slug}/${rel.slug}`}
                  className="group p-5 rounded-3xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm hover:shadow-lg hover:border-[var(--teal)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 relative mb-3">
                      <Image
                        src={rel.image_url || `/img/conditions/${rel.slug}.webp`}
                        alt={isBn ? rel.name_bn : rel.name_en}
                        fill
                        className="object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="font-heading font-bold text-lg text-[var(--ink)]">
                      {isBn ? rel.name_bn : rel.name_en}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                      {isBn ? rel.short_bn : rel.short_en}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[rgba(43,179,177,0.2)] flex justify-end">
                    <span className="text-xs font-bold text-[var(--teal)]">
                      {isBn ? 'বিস্তারিত দেখুন →' : 'Learn more →'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band with Doctor Cutout */}
      <section className="relative bg-gradient-to-b from-white to-[var(--tint)] py-20 px-4 sm:px-6 lg:px-8 border-t border-[rgba(43,179,177,0.25)] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="block w-12 h-1 bg-[var(--teal)] rounded-full mx-auto mb-4" />
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[var(--ink)] leading-snug">
            {t.ctaH}
          </h2>
          <p className="text-sm text-[var(--muted)] max-w-xl mx-auto mt-2 mb-8">
            {t.ctaS}
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-p text-sm py-3 px-6 shadow-md"
            >
              {t.book}: {settings.phone_serial}
            </button>
            <a
              href={`tel:${settings.phone_call}`}
              className="btn btn-g text-sm py-3 px-5 shadow-sm"
            >
              {t.call}
            </a>
            <a
              href={settings.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-g text-sm py-3 px-5 shadow-sm text-emerald-800 border-emerald-300 bg-emerald-50"
            >
              {t.wa}
            </a>
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
