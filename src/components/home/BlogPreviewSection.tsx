'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { BlogPost, Category } from '@/types/database';

interface BlogPreviewSectionProps {
  blogs: BlogPost[];
  categories: Category[];
}

export function BlogPreviewSection({ blogs, categories }: BlogPreviewSectionProps) {
  const { lang, isBn } = useLanguage();

  const t = {
    en: {
      eyebrow: 'Health & Surgery Blog',
      heading: 'Read Before You Worry',
      lead: 'In-depth surgical guides and symptom awareness written for patients and families.',
      readMore: 'Read article →',
      viewAll: 'View all surgical blogs →',
    },
    bn: {
      eyebrow: 'স্বাস্থ্য ব্লগ',
      heading: 'দুশ্চিন্তার আগে পড়ে নিন',
      lead: 'রোগীদের জন্য সহজ বাংলায় নির্ভরযোগ্য চিকিৎসাতথ্য ও অপারেশনের প্রস্তুতি।',
      readMore: 'সম্পূর্ণ পড়ুন →',
      viewAll: 'সব স্বাস্থ্য ব্লগ দেখুন →',
    },
  }[lang];

  // Pick top 3 blogs for homepage preview
  const previewList = blogs.slice(0, 3);

  return (
    <section className="relative z-20 bg-white py-20 px-4 sm:px-6 lg:px-8" id="blog">
      <div className="max-w-7xl mx-auto">
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

        {/* 3 Blogs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewList.map((b) => {
            const cat = categories.find((c) => c.slug === b.category_slug);
            return (
              <Link
                key={b.slug}
                href={`/blogs/${b.slug}`}
                className="group rounded-3xl overflow-hidden bg-white/90 border border-[rgba(43,179,177,0.25)] shadow-[0_16px_36px_-24px_rgba(6,47,49,0.3)] hover:shadow-xl hover:border-[var(--teal)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Badge */}
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--teal)] bg-[var(--tint)] px-3 py-1 rounded-full border border-[rgba(43,179,177,0.25)]">
                      {isBn ? cat?.name_bn : cat?.name_en}
                    </span>
                    <span className="text-xs font-semibold text-[var(--muted)]">
                      {isBn ? b.reading_time_bn : b.reading_time_en}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-[var(--ink)] group-hover:text-[var(--teal)] transition-colors leading-snug">
                    {isBn ? b.title_bn : b.title_en}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--muted)] mt-2.5 leading-relaxed line-clamp-3">
                    {isBn ? b.excerpt_bn : b.excerpt_en}
                  </p>
                </div>

                <div className="p-6 pt-3 border-t border-[rgba(43,179,177,0.15)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--teal)] group-hover:underline">
                    {t.readMore}
                  </span>
                  <span className="text-[var(--aqua)] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/blogs" className="btn btn-g text-sm py-2.5 px-6 shadow-sm">
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
