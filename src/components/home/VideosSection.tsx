'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight, X, Video } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { parseVideoUrl } from '@/lib/video-utils';
import type { GalleryVideo } from '@/types/database';
import { DEFAULT_GALLERY_VIDEOS } from '@/lib/content/default-data';

interface VideosSectionProps {
  videos?: GalleryVideo[];
}

export function VideosSection({ videos = DEFAULT_GALLERY_VIDEOS }: VideosSectionProps) {
  const { lang, isBn } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<GalleryVideo | null>(null);

  const t = {
    en: {
      vdEb: 'Videos & Insights',
      vdH: 'Watch & Understand Surgical Care',
      vdLead:
        'Short educational videos where Dr. Kollol explains common abdominal problems, piles recovery, and keyhole surgery.',
      viewAll: 'Watch All Video Guides',
    },
    bn: {
      vdEb: 'ভিডিও গাইড',
      vdH: 'ভিডিওতে জানুন জটিল রোগের সহজ ব্যাখ্যা',
      vdLead:
        'পাইলস, ফিস্টুলা, পিত্তথলির পাথর ও ল্যাপারোস্কপিক অপারেশন নিয়ে ডাঃ কল্লোলের গুরুত্বপূর্ণ পরামর্শমূলক ভিডিও।',
      viewAll: 'সব ভিডিও গ্যালারিতে দেখুন',
    },
  }[lang];

  const displayVideos = (videos && videos.length > 0 ? videos : DEFAULT_GALLERY_VIDEOS).slice(0, 4);
  const mainVideo = displayVideos[0];
  const sideVideos = displayVideos.slice(1, 4);

  return (
    <section className="hx tint relative overflow-hidden" id="videos">
      <div className="wrap">
        <p className="eb flex items-center gap-2">
          <Video className="w-4 h-4 text-[var(--teal)] inline" />
          {t.vdEb}
        </p>
        <h2>{t.vdH}</h2>
        <p className="lead">{t.vdLead}</p>

        {mainVideo && (
          <div className="vid">
            {/* Featured Main Video */}
            {(() => {
              const parsed = parseVideoUrl(mainVideo.video_url);
              const thumb = mainVideo.thumbnail_url || parsed.thumbnailUrl || '/img/doctor-cta.webp';

              return (
                <div
                  onClick={() => setActiveVideo(mainVideo)}
                  className="ph main group relative overflow-hidden cursor-pointer border border-[var(--aqua)]/30 rounded-2xl shadow-sm hover:shadow-xl transition-all"
                >
                  <Image
                    src={thumb}
                    alt={isBn ? mainVideo.title_bn : mainVideo.title_en}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors grid place-items-center">
                    <div>
                      <span className="play transition-transform group-hover:scale-110" />
                      <span className="block mt-3 text-white font-bold text-sm sm:text-base font-serif drop-shadow-md px-4">
                        {isBn ? mainVideo.title_bn : mainVideo.title_en}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Stack of Smaller Videos */}
            <div className="stack">
              {sideVideos.map((item, idx) => {
                const parsed = parseVideoUrl(item.video_url);
                const thumb = item.thumbnail_url || parsed.thumbnailUrl || '/img/doctor-cta.webp';

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setActiveVideo(item)}
                    className="ph group relative overflow-hidden cursor-pointer border border-[var(--aqua)]/25 rounded-2xl shadow-xs hover:shadow-md transition-all"
                  >
                    <Image
                      src={thumb}
                      alt={isBn ? item.title_bn : item.title_en}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center p-3 gap-3">
                      <span className="play sm shrink-0 transition-transform group-hover:scale-110" />
                      <span className="text-white text-xs font-semibold line-clamp-2 text-left font-serif drop-shadow-xs">
                        {isBn ? item.title_bn : item.title_en}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-black rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/80 transition-colors backdrop-blur-xs"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full bg-black">
              {(() => {
                const parsed = parseVideoUrl(activeVideo.video_url);
                return (
                  <iframe
                    src={parsed.embedUrl}
                    title={isBn ? activeVideo.title_bn : activeVideo.title_en}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                );
              })()}
            </div>

            <div className="p-5 bg-[#062F31] text-white">
              <span className="text-[10px] uppercase font-bold text-[var(--aqua)] tracking-wider block mb-1">
                {activeVideo.video_type} · {activeVideo.category || 'Clinical Explanation'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif leading-snug">
                {isBn ? activeVideo.title_bn : activeVideo.title_en}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
