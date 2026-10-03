import React from 'react';
import { Metadata } from 'next';
import {
  getSurgeonProfile,
  getCategories,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { AboutPageClient } from '@/components/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Dr. Fahim Foysal Kollol — Surgeon Qualifications & Career',
  description:
    'Learn about Dr. Fahim Foysal Kollol — MBBS, BCS (Health), FCPS (Surgery), MACS (USA). Assistant Professor of Surgery, MMCH. Over 10,000 surgeries, 11 research publications, and specialized laparoscopic & colorectal surgical training.',
};

export const revalidate = 60;

export default async function AboutPage() {
  const [profile, categories, settings, chambers] = await Promise.all([
    getSurgeonProfile(),
    getCategories(),
    getSiteSettings(),
    getChambers(),
  ]);

  return (
    <AboutPageClient
      profile={profile}
      categories={categories}
      settings={settings}
      chambers={chambers}
    />
  );
}
