import React from 'react';
import { Metadata } from 'next';
import {
  getCategories,
  getConditions,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { ConditionsHubClient } from '@/components/conditions/ConditionsHubClient';

export const metadata: Metadata = {
  title: 'Conditions & Treatments — Dr. Fahim Foysal Kollol',
  description:
    'Piles, fistula, fissure, gallstones, hernia, breast lumps, kidney stones and more — complete surgical conditions and treatments by Dr. Fahim Foysal Kollol in Sherpur and Mymensingh.',
};

export const revalidate = 60;

export default async function ConditionsPage() {
  const [categories, conditions, settings, chambers] = await Promise.all([
    getCategories(),
    getConditions(),
    getSiteSettings(),
    getChambers(),
  ]);

  return (
    <ConditionsHubClient
      categories={categories}
      conditions={conditions}
      settings={settings}
      chambers={chambers}
    />
  );
}
