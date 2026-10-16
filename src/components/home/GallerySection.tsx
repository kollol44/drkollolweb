'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, X, Camera } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { GalleryPhoto } from '@/types/database';
import { DEFAULT_GALLERY_PHOTOS } from '@/lib/content/default-data';

interface GallerySectionProps {
  photos?: GalleryPhoto[];
}

export function GallerySection({ photos = DEFAULT_GALLERY_PHOTOS }: GallerySectionProps) {
  const { lang, isBn } = useLanguage();
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const t = {
    en: {
      glEb: 'Gallery & Inside Practice',
      glH: 'Clinical Practice in Pictures',
      glLead:
        'Laparoscopic operating theatre, patient consultation chambers, health camps, and clinical conferences.',
      viewAll: 'Explore Complete Gallery & Photos',
      clickZoom: 'Click to zoom',
    },
    bn: {
      glEb: 'গ্যালারি ও কর্মক্ষেত্র',
      glH: 'ছবিতে চিকিৎসা, অপারেশন ও চেম্বার',
      glLead:
        'উন্নত ল্যাপারোস্কপিক অপারেশন থিয়েটার, শেরপুর ও ময়মনসিংহ চেম্বার, স্বাস্থ্য ক্যাম্প ও সম্মেলন।',
      viewAll: 'সম্পূর্ণ ফটো গ্যালারি দেখুন',
      clickZoom: 'বড় করে দেখুন',
    },
  }[lang];

  // Take top 6 photos for the home showcase grid
  const displayPhotos = (photos && photos.length > 0 ? photos : DEFAULT_GALLERY_PHOTOS).slice(0, 6);

  return (
    <section className="hx relative overflow-hidden" id="gallery">
      <div className="wrap">
        <p className="eb flex items-center gap-2">
          <Camera className="w-4 h-4 text-[var(--teal)] inline" />
          {t.glEb}
        </p>
        <h2>{t.glH}</h2>
        <p className="lead">{t.glLead}</p>

        {/* Dynamic Image Grid */}
        <div className="gal">
          {displayPhotos.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setActivePhoto(item)}
              className="ph group relative overflow-hidden cursor-pointer border border-[var(--aqua)]/30 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <Image
                src={item.image_url}
                alt={isBn ? item.title_bn : item.title_en}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Gradient Dark Backdrop for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/85 via-[var(--ink)]/20 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-left transition-opacity duration-300">
                <span className="text-[10px] font-bold text-[var(--aqua)] uppercase tracking-wider mb-0.5">
                  {item.category}
                </span>
                <b className="text-white text-xs sm:text-sm font-semibold line-clamp-1 leading-snug drop-shadow-xs font-serif">
                  {isBn ? item.title_bn : item.title_en}
                </b>
                <small className="text-white/80 text-[11px] font-medium flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-[var(--aqua)]" /> {t.clickZoom}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-[var(--teal)] to-[var(--aqua)] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white grid place-items-center hover:bg-black/70 transition-colors backdrop-blur-xs"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-16/10 w-full bg-slate-950">
              <Image
                src={activePhoto.image_url}
                alt={isBn ? activePhoto.title_bn : activePhoto.title_en}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />

            </div>

            <div className="p-6 bg-white">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#EEF7F6] text-[var(--teal)] border border-[var(--aqua)]/30 inline-block mb-2">
                {activePhoto.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--ink)]">
                {isBn ? activePhoto.title_bn : activePhoto.title_en}
              </h3>
              {(isBn ? activePhoto.caption_bn : activePhoto.caption_en) && (
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                  {isBn ? activePhoto.caption_bn : activePhoto.caption_en}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
