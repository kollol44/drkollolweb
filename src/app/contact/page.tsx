import React from 'react';
import { Metadata } from 'next';
import {
  getCategories,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { ContactPageClient } from '@/components/contact/ContactPageClient';

export const metadata: Metadata = {
  title: 'Chambers & Contact — Dr. Fahim Foysal Kollol',
  description:
    'Consultation chambers and direct serial booking for Dr. Fahim Foysal Kollol in Sherpur (Health Care Pvt Hospital, Amjad Diagnostic) and Mymensingh (New Medicare Pathology Lab). Serial Hotline: 01750-529252, Assistant: 01671-869026, Doctor WhatsApp: 01670879100.',
};

export const revalidate = 60;

export default async function ContactPage() {
  const [categories, settings, chambers] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getChambers(),
  ]);

  return (
    <ContactPageClient
      categories={categories}
      settings={settings}
      chambers={chambers}
    />
  );
}
