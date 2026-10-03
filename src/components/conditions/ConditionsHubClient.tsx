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

interface ConditionsHubClientProps {
  categories: Category[];
  conditions: Condition[];
  settings: SiteSettings;
  chambers: Chamber[];
}

export function ConditionsHubClient({
  categories,
  conditions,
  settings,
  chambers,
}: ConditionsHubClientProps) {
  const { lang, isBn } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const t = {
    en: {
      crumb: 'Treatments by Dr. Kollol',
      giant: 'Conditions & Treatments',
      introEy: 'Find your problem',
      introT: 'Every condition, explained simply.',
      introP:
        'Scroll to see the conditions Dr. Kollol treats — or jump to an anatomical area below. Each page explains the condition in simple words and how he treats it.',
      browse: 'Browse by area',
      n: 'conditions',
      learnMore: 'Learn more →',
      ctaH: 'Don’t wait. Talk to your surgeon.',
      ctaS: 'Call for a serial or come to the chamber — Dr. Kollol will explain your problem and the right treatment.',
      book: 'Book a serial',
      call: 'Call now',
      wa: 'WhatsApp',
    },
    bn: {
      crumb: 'ডাঃ কল্লোলের চিকিৎসা',
      giant: 'রোগ ও চিকিৎসা',
      introEy: 'আপনার সমস্যা খুঁজুন',
      introT: 'প্রতিটা রোগ, সহজ ভাষায়।',
      introP:
        'স্ক্রল করে দেখুন ডাঃ কল্লোল কোন কোন রোগের চিকিৎসা করেন, অথবা নিচে ক্ষেত্র অনুযায়ী খুঁজুন। প্রতিটা পেজে রোগটা আর তার চিকিৎসা সহজ ভাষায় বোঝানো আছে।',
      browse: 'ক্ষেত্র অনুযায়ী খুঁজুন',
      n: 'টি রোগ',
      learnMore: 'বিস্তারিত →',
      ctaH: 'দেরি করবেন না। সার্জনের সাথে কথা বলুন।',
      ctaS: 'সিরিয়ালের জন্য কল করুন বা চেম্বারে আসুন — ডাঃ কল্লোল আপনার সমস্যা ও সঠিক চিকিৎসা বুঝিয়ে বলবেন।',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
      wa: 'হোয়াটসঅ্যাপ',
    },
  }[lang];

  // Showcase steps: intro + conditions
  const steps: ShowcaseStep[] = [
    {
      word: t.giant,
      ey: t.introEy,
      title: t.introT,
      body: (
        <div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{t.introP}</p>
          <div className="flex gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-p text-xs py-2 px-4 shadow-sm"
            >
              {t.book}
            </button>
            <a href="#browse-areas" className="btn btn-g text-xs py-2 px-4 shadow-sm">
              {t.browse}
            </a>
          </div>
        </div>
      ),
    },
    ...conditions.map((c) => {
      const cat = categories.find((cat) => cat.slug === c.category_slug);
      return {
        word: isBn ? (c.home_word_bn || c.name_bn) : (c.home_word_en || c.name_en),
        cat: c.category_slug,
        ey: isBn ? cat?.name_bn : cat?.name_en,
        title: isBn ? c.name_bn : c.name_en,
        img: {
          src: c.image_url || `/img/conditions/${c.slug}.webp`,
          alt: isBn ? c.name_bn : c.name_en,
        },
        body: (
          <div>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
              {isBn ? c.short_bn : c.short_en}
            </p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[rgba(43,179,177,0.2)]">
              {c.is_laparoscopic ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--teal)] border border-[rgba(43,179,177,0.3)]">
                  {isBn ? 'ল্যাপারোস্কপিক' : 'Laparoscopic'}
                </span>
              ) : (
                <span />
              )}
              <Link
                href={`/conditions-treatments/${c.category_slug}/${c.slug}`}
                className="text-xs font-bold text-[var(--teal)] hover:underline"
              >
                {t.learnMore}
              </Link>
            </div>
          </div>
        ),
      };
    }),
  ];

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar
        categories={categories}
        serialPhone={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Pinned Showcase with Doctor Gloves & Condition Cards */}
      <PinnedShowcase
        steps={steps}
        mode="default"
        crumb={t.crumb}
        chips={categories.map((c) => ({
          slug: c.slug,
          name: isBn ? c.name_bn : c.name_en,
          href: `/conditions-treatments/${c.slug}`,
        }))}
      />

      {/* Sticky Chip Navigation Bar */}
      <div id="browse-areas" className="sticky top-20 z-30 py-3 bg-white/80 backdrop-blur-md border-y border-[rgba(43,179,177,0.25)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`#area-${c.slug}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white text-[var(--teal)] border border-[rgba(43,179,177,0.3)] hover:bg-[var(--teal)] hover:text-white transition-all shadow-sm"
            >
              {isBn ? c.name_bn : c.name_en}
            </a>
          ))}
        </div>
      </div>

      {/* 7 Organ-Based Category Sections with Cards */}
      <main className="py-12">
        {categories.map((c, idx) => {
          const catConditions = conditions.filter((item) => item.category_slug === c.slug);
          const isEven = idx % 2 === 0;

          return (
            <section
              key={c.slug}
              id={`area-${c.slug}`}
              className={`py-16 px-4 sm:px-6 lg:px-8 ${isEven ? 'bg-white' : 'bg-[var(--tint)]'}`}
            >
              <div className="max-w-7xl mx-auto">
                {/* Header with big category name */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[rgba(43,179,177,0.25)] pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
                      {isBn ? `ক্ষেত্র ০${idx + 1}` : `Area 0${idx + 1}`}
                    </span>
                    <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[var(--teal)] mt-1">
                      {isBn ? c.name_bn : c.name_en}
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-1 max-w-xl">
                      {isBn ? c.desc_bn : c.desc_en}
                    </p>
                  </div>

                  <Link
                    href={`/conditions-treatments/${c.slug}`}
                    className="btn btn-g text-xs py-2 px-4 whitespace-nowrap self-start md:self-end"
                  >
                    {isBn ? `${catConditions.length} ${t.n} দেখুন →` : `View all ${catConditions.length} ${t.n} →`}
                  </Link>
                </div>

                {/* Condition Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catConditions.map((cond) => (
                    <Link
                      key={cond.slug}
                      href={`/conditions-treatments/${c.slug}/${cond.slug}`}
                      className="group p-6 rounded-3xl bg-white border border-[rgba(43,179,177,0.25)] shadow-[0_16px_36px_-24px_rgba(6,47,49,0.3)] hover:shadow-xl hover:border-[var(--teal)] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Floating Condition Illustration */}
                        <div className="h-36 relative mb-4">
                          <Image
                            src={cond.image_url || `/img/conditions/${cond.slug}.webp`}
                            alt={isBn ? cond.name_bn : cond.name_en}
                            fill
                            className="object-contain filter drop-shadow-[0_14px_20px_rgba(6,47,49,0.22)] group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--aqua)] block">
                          {isBn ? c.name_bn : c.name_en}
                        </span>

                        <h3 className="font-heading font-bold text-xl text-[var(--ink)] mt-1 leading-snug">
                          {isBn ? cond.name_bn : cond.name_en}
                        </h3>

                        {cond.med_en && (
                          <span className="text-xs font-medium text-[var(--muted)] block mt-0.5">
                            {isBn ? cond.med_bn : cond.med_en}
                          </span>
                        )}

                        <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 leading-relaxed line-clamp-2">
                          {isBn ? cond.short_bn : cond.short_en}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-[rgba(43,179,177,0.18)]">
                        {cond.is_laparoscopic ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--teal)] border border-[rgba(43,179,177,0.3)]">
                            {isBn ? 'ল্যাপারোস্কপিক' : 'Laparoscopic'}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs font-bold text-[var(--teal)] group-hover:translate-x-1 transition-transform">
                          {t.learnMore}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* CTA Band with 3 Chambers */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-12">
            {chambers.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-white/80 border border-[rgba(43,179,177,0.25)] shadow-sm"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--aqua)] block">
                  {isBn ? ch.schedule_bn : ch.schedule_en}
                </span>
                <h4 className="font-heading font-bold text-sm text-[var(--ink)] mt-1">
                  {isBn ? ch.name_bn : ch.name_en}
                </h4>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {isBn ? ch.timing_bn : ch.timing_en}
                </p>
              </div>
            ))}
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
