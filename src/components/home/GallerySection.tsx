'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  X,
  Camera,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { GalleryPhoto } from '@/types/database';
import { DEFAULT_GALLERY_PHOTOS } from '@/lib/content/default-data';

interface GallerySectionProps {
  photos?: GalleryPhoto[];
}

const CATEGORY_NAMES: Record<string, { en: string; bn: string }> = {
  ot: { en: 'Operating Theatre', bn: 'অপারেশন থিয়েটার' },
  chamber: { en: 'Consultation Chamber', bn: 'পরামর্শ চেম্বার' },
  conference: { en: 'Clinical Conference', bn: 'সেমিনার ও সম্মেলন' },
  patient: { en: 'Patient Care & Ward', bn: 'রোগী সেবা ও ওয়ার্ড' },
  camp: { en: 'Health Outreach', bn: 'স্বাস্থ্য ক্যাম্প' },
  general: { en: 'Clinical Practice', bn: 'ক্লিনিক্যাল সেবা' },
};

function toBanglaDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

export function GallerySection({ photos = DEFAULT_GALLERY_PHOTOS }: GallerySectionProps) {
  const { lang, isBn } = useLanguage();

  // Ensure we have a valid, sorted list of photos
  const basePhotos: GalleryPhoto[] = useMemo(() => {
    const list = photos && photos.length > 0 ? photos : DEFAULT_GALLERY_PHOTOS;
    return [...list].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));
  }, [photos]);

  // Triple duplicated list for seamless, infinite looping
  const infinitePhotos = useMemo(() => {
    return [...basePhotos, ...basePhotos, ...basePhotos];
  }, [basePhotos]);

  // Slider state
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Lightbox Modal state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const t = {
    en: {
      glEb: 'Gallery & Inside Practice',
      glH: 'Clinical Practice in Pictures',
      glLead:
        'Laparoscopic operating theatre, patient consultation chambers, health camps, and clinical conferences.',
      viewAll: 'Explore Complete Gallery & Photos',
      clickZoom: 'Click to expand photo',
      pause: 'Pause auto-slide',
      resume: 'Resume auto-slide',
      autoPlaying: 'Auto-slide Active',
      paused: 'Auto-slide Paused',
      prevPhoto: 'Previous Photo',
      nextPhoto: 'Next Photo',
      photoOf: 'Photo',
      ofTotal: 'of',
      swipeHint: 'Swipe or drag to explore',
      close: 'Close',
    },
    bn: {
      glEb: 'গ্যালারি ও কর্মক্ষেত্র',
      glH: 'ছবিতে চিকিৎসা, অপারেশন ও চেম্বার',
      glLead:
        'উন্নত ল্যাপারোস্কপিক অপারেশন থিয়েটার, শেরপুর ও ময়মনসিংহ চেম্বার, স্বাস্থ্য ক্যাম্প ও সম্মেলন।',
      viewAll: 'সম্পূর্ণ ফটো গ্যালারি দেখুন',
      clickZoom: 'বড় করে দেখুন',
      pause: 'অটো-স্লাইড থামান',
      resume: 'অটো-স্লাইড চালু করুন',
      autoPlaying: 'অটো-স্লাইড চালু',
      paused: 'অটো-স্লাইড স্থগিত',
      prevPhoto: 'পূর্ববর্তী ছবি',
      nextPhoto: 'পরবর্তী ছবি',
      photoOf: 'ছবি নং',
      ofTotal: 'এর',
      swipeHint: 'ডানে-বামে টেনে বা সোয়াইপ করে দেখুন',
      close: 'বন্ধ করুন',
    },
  }[lang];

  // Helper to get card width + gap
  const getCardStep = useCallback(() => {
    if (!sliderRef.current) return 380;
    const firstCard = sliderRef.current.querySelector<HTMLElement>('[data-gallery-card]');
    if (!firstCard) return 380;
    const computedGap = 20; // 20px gap-5
    return firstCard.offsetWidth + computedGap;
  }, []);

  // Update progress & active index on scroll
  const handleScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el || basePhotos.length === 0) return;

    const step = getCardStep();
    const singleSetWidth = basePhotos.length * step;

    // Infinite loop boundaries reset seamlessly
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.style.scrollBehavior = 'auto';
      el.scrollLeft -= singleSetWidth;
      el.style.scrollBehavior = 'smooth';
    } else if (el.scrollLeft <= singleSetWidth * 0.1) {
      el.style.scrollBehavior = 'auto';
      el.scrollLeft += singleSetWidth;
      el.style.scrollBehavior = 'smooth';
    }

    // Normalized progress in the current cycle (0 to 100%)
    const normalizedScroll = (el.scrollLeft % singleSetWidth + singleSetWidth) % singleSetWidth;
    const progressPercent = Math.min(100, Math.max(0, (normalizedScroll / singleSetWidth) * 100));
    setScrollProgress(progressPercent);

    // Active photo index relative to basePhotos
    const currentIdx = Math.floor((normalizedScroll + step * 0.4) / step) % basePhotos.length;
    setActivePhotoIdx(currentIdx);
  }, [basePhotos.length, getCardStep]);

  // Initial scroll to middle set on mount for smooth two-way sliding
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || basePhotos.length === 0) return;

    const step = getCardStep();
    const singleSetWidth = basePhotos.length * step;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = singleSetWidth;
    el.style.scrollBehavior = 'smooth';
    handleScroll();
  }, [basePhotos.length, getCardStep, handleScroll]);

  // Auto-play ticker: advances smoothly from right to left every 3.5 seconds
  useEffect(() => {
    if (!isPlaying || isHovered || isDragging || lightboxIndex !== null) return;

    const interval = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;
      const step = getCardStep();
      el.scrollBy({ left: step, behavior: 'smooth' });
    }, 3600);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, isDragging, lightboxIndex, getCardStep]);

  // Manual Prev / Next Arrow Navigation
  const handleNav = (direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const step = getCardStep();
    const delta = direction === 'left' ? -step : step;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Scrubber / Progress Bar click or drag
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const el = sliderRef.current;
    if (!track || !el || basePhotos.length === 0) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    const step = getCardStep();
    const singleSetWidth = basePhotos.length * step;
    el.style.scrollBehavior = 'smooth';
    el.scrollLeft = singleSetWidth + ratio * singleSetWidth;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    setDragStartX(e.pageX - el.offsetLeft);
    setDragStartScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const el = sliderRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartX) * 1.3;
    el.scrollLeft = dragStartScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % basePhotos.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + basePhotos.length) % basePhotos.length : 0
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, basePhotos.length]);

  const activeLightboxItem = lightboxIndex !== null ? basePhotos[lightboxIndex] : null;

  return (
    <section
      className="hx relative overflow-hidden py-16 sm:py-24 bg-[#F6F6F6]"
      id="gallery"
      aria-label="Clinical Practice in Pictures"
    >
      {/* 1. Header Section */}
      <div className="wrap text-center">
        <p className="eb flex items-center justify-center gap-2">
          <Camera className="w-4 h-4 text-[var(--teal)] inline" />
          {t.glEb}
        </p>
        <h2>{t.glH}</h2>
        <p className="lead">{t.glLead}</p>
      </div>

      {/* 2. Full-Screen Bleed Carousel Container */}
      <div
        className="w-full relative mt-8 sm:mt-12 overflow-hidden select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUpOrLeave();
        }}
      >
        {/* Soft edge fade masks on laptop screens */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-24 md:w-36 z-20 bg-gradient-to-r from-[#F6F6F6] via-[#F6F6F6]/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-24 md:w-36 z-20 bg-gradient-to-l from-[#F6F6F6] via-[#F6F6F6]/80 to-transparent" />

        {/* Scrollable track with cards */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className={`flex gap-4 sm:gap-5 px-4 sm:px-12 md:px-24 overflow-x-auto scroll-smooth scrollbar-none py-4 cursor-${
            isDragging ? 'grabbing' : 'grab'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {infinitePhotos.map((item, idx) => {
            const originalIndex = idx % basePhotos.length;
            const categoryObj = CATEGORY_NAMES[item.category] || {
              en: item.category,
              bn: item.category,
            };
            const categoryLabel = isBn ? categoryObj.bn : categoryObj.en;
            const title = isBn ? item.title_bn : item.title_en;

            return (
              <div
                key={`${item.id}-${idx}`}
                data-gallery-card
                onClick={() => {
                  if (!isDragging) {
                    setLightboxIndex(originalIndex);
                  }
                }}
                className="group relative shrink-0 w-[280px] sm:w-[350px] md:w-[380px] lg:w-[410px] aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-white border border-[var(--aqua)]/25 hover:border-[var(--aqua)]/80 shadow-[0_8px_24px_rgba(11,110,115,0.06)] hover:shadow-[0_16px_36px_rgba(11,110,115,0.18)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Image with smooth zoom */}
                <Image
                  src={item.image_url}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 420px"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  draggable={false}
                />

                {/* Top Category Badge & Order Chip */}
                <div className="absolute top-3 inset-x-3.5 z-10 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-[var(--teal)] border border-[var(--aqua)]/30 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--aqua)] animate-pulse" />
                    {categoryLabel}
                  </span>

                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-[var(--ink)]/60 text-white/90 backdrop-blur-xs">
                    #{isBn ? toBanglaDigits(originalIndex + 1) : String(originalIndex + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom Gradient Card Information */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--ink)]/95 via-[var(--ink)]/40 to-transparent flex flex-col justify-end p-4 sm:p-5 text-left transition-all duration-300">
                  <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-1 leading-snug drop-shadow-sm font-serif">
                    {title}
                  </h3>

                  {(item.caption_en || item.caption_bn) && (
                    <p className="text-white/75 text-xs line-clamp-1 mt-1 font-sans">
                      {isBn ? item.caption_bn : item.caption_en}
                    </p>
                  )}

                  {/* Hover action indicator */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--aqua)] font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/15">
                      <Sparkles className="w-3 h-3 text-[var(--aqua)]" />
                      {t.clickZoom}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Pro Level Controls & Scrubber Bar */}
      <div className="wrap mt-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Top Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Play/Pause & Live Status */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-[var(--ink)] border border-[var(--aqua)]/30 shadow-xs hover:shadow-md transition-all font-semibold active:scale-95"
                title={isPlaying ? t.pause : t.resume}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[var(--teal)] fill-[var(--teal)]" />
                    <span>{t.pause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[var(--teal)] fill-[var(--teal)] ml-0.5" />
                    <span>{t.resume}</span>
                  </>
                )}
              </button>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--muted)] font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'
                  }`}
                />
                {isPlaying ? t.autoPlaying : t.paused}
              </span>
            </div>

            {/* Photo Counter & Navigation Arrows */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-white/70 border border-[var(--aqua)]/20 text-[var(--ink)] font-mono text-xs font-bold shadow-xs">
                <span>{t.photoOf} </span>
                <span className="text-[var(--teal)]">
                  {isBn ? toBanglaDigits(activePhotoIdx + 1) : String(activePhotoIdx + 1).padStart(2, '0')}
                </span>
                <span className="text-gray-400"> / </span>
                <span>
                  {isBn ? toBanglaDigits(basePhotos.length) : String(basePhotos.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleNav('left')}
                  className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[var(--teal)] border border-[var(--aqua)]/30 grid place-items-center shadow-xs hover:shadow-md transition-all active:scale-90"
                  aria-label={t.prevPhoto}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('right')}
                  className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[var(--teal)] border border-[var(--aqua)]/30 grid place-items-center shadow-xs hover:shadow-md transition-all active:scale-90"
                  aria-label={t.nextPhoto}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Scrub Track */}
          <div
            ref={trackRef}
            onClick={handleScrubberClick}
            className="w-full h-2 sm:h-2.5 rounded-full bg-[var(--aqua)]/15 hover:bg-[var(--aqua)]/25 relative cursor-pointer overflow-hidden transition-colors shadow-inner"
            title="Click or drag to scrub gallery"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--teal)] via-[var(--aqua)] to-[var(--teal)] transition-[width] duration-200"
              style={{ width: `${Math.max(8, scrollProgress)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--muted)] px-1">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-[var(--teal)]" />
              {t.swipeHint}
            </span>
            <span>
              {isBn
                ? `মোট ${toBanglaDigits(basePhotos.length)}টি ছবি সংরক্ষিত`
                : `${basePhotos.length} Clinical Photos`}
            </span>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--teal)] to-[var(--aqua)] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4. Fullscreen Lightbox Modal with Next/Prev Controls */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-white/20 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white grid place-items-center transition-colors backdrop-blur-xs"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Area with Floating Nav Arrows */}
            <div className="relative aspect-16/10 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <Image
                src={activeLightboxItem.image_url}
                alt={isBn ? activeLightboxItem.title_bn : activeLightboxItem.title_en}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />

              {/* Prev Button inside Lightbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + basePhotos.length) % basePhotos.length
                  );
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white grid place-items-center transition-all backdrop-blur-xs border border-white/20 active:scale-90"
                aria-label={t.prevPhoto}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button inside Lightbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % basePhotos.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white grid place-items-center transition-all backdrop-blur-xs border border-white/20 active:scale-90"
                aria-label={t.nextPhoto}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Floating Counter */}
              <div className="absolute bottom-3 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono font-medium">
                {t.photoOf}{' '}
                {isBn ? toBanglaDigits(lightboxIndex + 1) : lightboxIndex + 1}{' '}
                {t.ofTotal}{' '}
                {isBn ? toBanglaDigits(basePhotos.length) : basePhotos.length}
              </div>
            </div>

            {/* Modal Details Footer */}
            <div className="p-5 sm:p-7 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#EEF7F6] text-[var(--teal)] border border-[var(--aqua)]/30 inline-block">
                  {isBn
                    ? CATEGORY_NAMES[activeLightboxItem.category]?.bn || activeLightboxItem.category
                    : CATEGORY_NAMES[activeLightboxItem.category]?.en || activeLightboxItem.category}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--ink)]">
                {isBn ? activeLightboxItem.title_bn : activeLightboxItem.title_en}
              </h3>

              {(activeLightboxItem.caption_en || activeLightboxItem.caption_bn) && (
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed font-sans">
                  {isBn ? activeLightboxItem.caption_bn : activeLightboxItem.caption_en}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
