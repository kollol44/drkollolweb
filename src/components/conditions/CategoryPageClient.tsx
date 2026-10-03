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

interface CategoryPageClientProps {
  category: Category;
  conditions: Condition[];
  allCategories: Category[];
  settings: SiteSettings;
  chambers: Chamber[];
}

export function CategoryPageClient({
  category,
  conditions,
  allCategories,
  settings,
  chambers,
}: CategoryPageClientProps) {
  const { lang, isBn } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const t = {
    en: {
      eb: 'All conditions in this area',
      other: 'Other areas Dr. Kollol treats',
      all: 'Conditions & Treatments',
      introEy: 'Treated by Dr. Kollol',
      scroll: 'Scroll to explore each condition and treatment option.',
      book: 'Book a serial',
      call: 'Call now',
      wa: 'WhatsApp',
      learnMore: 'Learn more →',
      ctaH: 'Don’t wait. Talk to your surgeon.',
      ctaS: 'Call for a serial or come to the chamber — Dr. Kollol will explain your problem and the right treatment.',
    },
    bn: {
      eb: 'এই ক্ষেত্রের সব রোগ ও চিকিৎসা',
      other: 'ডাঃ কল্লোল আরও যেসব ক্ষেত্রের চিকিৎসা করেন',
      all: 'রোগ ও চিকিৎসা',
      introEy: 'ডাঃ কল্লোলের বিশেষ সেবা',
      scroll: 'স্ক্রল করে প্রতিটা রোগ ও তার আধুনিক চিকিৎসা দেখে নিন।',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
      wa: 'হোয়াটসঅ্যাপ',
      learnMore: 'বিস্তারিত →',
      ctaH: 'দেরি করবেন না। সার্জনের সাথে কথা বলুন।',
      ctaS: 'সিরিয়ালের জন্য কল করুন বা চেম্বারে আসুন — ডাঃ কল্লোল আপনার সমস্যা ও সঠিক চিকিৎসা বুঝিয়ে বলবেন।',
    },
  }[lang];

  const steps: ShowcaseStep[] = [
    {
      word: isBn ? category.name_bn : category.name_en,
      cat: category.slug,
      ey: t.introEy,
      title: isBn ? category.name_bn : category.name_en,
      body: (
        <div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {isBn ? category.desc_bn : category.desc_en} {t.scroll}
          </p>
          <div className="flex gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-p text-xs py-2 px-4 shadow-sm"
            >
              {t.book}
            </button>
            <a href={`tel:${settings.phone_call}`} className="btn btn-g text-xs py-2 px-4 shadow-sm">
              {t.call}
            </a>
          </div>
        </div>
      ),
    },
    ...conditions.map((c) => ({
      word: isBn ? (c.home_word_bn || c.name_bn) : (c.home_word_en || c.name_en),
      cat: category.slug,
      ey: isBn ? c.name_bn : c.name_en,
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
              href={`/conditions-treatments/${category.slug}/${c.slug}`}
              className="text-xs font-bold text-[var(--teal)] hover:underline"
            >
              {t.learnMore}
            </Link>
          </div>
        </div>
      ),
    })),
  ];

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar
        categories={[category, ...allCategories]}
        serialPhone={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Pinned Showcase with Swap Mode (Doctor -> Condition Illustrations) */}
      <PinnedShowcase
        steps={steps}
        mode="swap"
        crumb={
          <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--teal)] font-bold">
            <Link href="/conditions-treatments" className="hover:underline">
              {t.all}
            </Link>
            <span>/</span>
            <span>{isBn ? category.name_bn : category.name_en}</span>
          </div>
        }
      />

      {/* All Conditions Grid in this Category */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
              {t.eb}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[var(--ink)] mt-1">
              {isBn ? category.name_bn : category.name_en}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((cond) => (
              <Link
                key={cond.slug}
                href={`/conditions-treatments/${category.slug}/${cond.slug}`}
                className="group p-6 rounded-3xl bg-white border border-[rgba(43,179,177,0.25)] shadow-[0_16px_36px_-24px_rgba(6,47,49,0.3)] hover:shadow-xl hover:border-[var(--teal)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 relative mb-4">
                    <Image
                      src={cond.image_url || `/img/conditions/${cond.slug}.webp`}
                      alt={isBn ? cond.name_bn : cond.name_en}
                      fill
                      className="object-contain filter drop-shadow-[0_14px_20px_rgba(6,47,49,0.22)] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--aqua)] block">
                    {isBn ? category.name_bn : category.name_en}
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

      {/* Other Categories Chips */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[var(--tint)] border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block mb-3">
            {t.other}
          </span>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {allCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/conditions-treatments/${c.slug}`}
                className="px-4 py-2 rounded-full bg-white text-xs font-semibold text-[var(--teal)] border border-[rgba(43,179,177,0.3)] hover:bg-[var(--teal)] hover:text-white transition-all shadow-sm"
              >
                {isBn ? c.name_bn : c.name_en} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band with Centered Doctor Cutout */}
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
        categories={[category, ...allCategories]}
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
