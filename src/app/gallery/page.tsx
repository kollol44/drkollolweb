import React from 'react';
import { Metadata } from 'next';
import {
  getGalleryPhotos,
  getGalleryVideos,
  getCategories,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { GalleryPageClient } from '@/components/gallery/GalleryPageClient';

export const metadata: Metadata = {
  title: 'Media Gallery & Surgical Videos — Dr. Fahim Foysal Kollol',
  description:
    'Browse verified clinical photography from laparoscopic operating theatres, patient chambers in Sherpur and Mymensingh, and watch surgical video explanations by Dr. Fahim Foysal Kollol.',
  openGraph: {
    title: 'Media Gallery & Surgical Videos — Dr. Fahim Foysal Kollol',
    description:
      'Verified clinical photography from laparoscopic operating theatres and educational surgical video insights.',
    images: ['/img/gallery/ot-laparoscopic-surgery.webp'],
  },
};

export const revalidate = 60;

export default async function GalleryPage() {
  const [photos, videos, categories, settings, chambers] = await Promise.all([
    getGalleryPhotos(),
    getGalleryVideos(),
    getCategories(),
    getSiteSettings(),
    getChambers(),
  ]);

  return (
    <GalleryPageClient
      photos={photos}
      videos={videos}
      categories={categories}
      settings={settings}
      chambers={chambers}
    />
  );
}
