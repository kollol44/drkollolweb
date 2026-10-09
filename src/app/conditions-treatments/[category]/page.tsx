import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getCategories,
  getConditions,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { CategoryPageClient } from '@/components/conditions/CategoryPageClient';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.name_en} / ${cat.name_bn} — Dr. Fahim Foysal Kollol`,
    description: `${cat.desc_en} — Surgical consultation and procedures by Dr. Fahim Foysal Kollol in Sherpur and Mymensingh.`,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const [categories, allConditions, settings, chambers] = await Promise.all([
    getCategories(),
    getConditions(),
    getSiteSettings(),
    getChambers(),
  ]);

  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const categoryConditions = allConditions.filter((c) => c.category_slug === slug);

  return (
    <CategoryPageClient
      category={cat}
      conditions={categoryConditions}
      allCategories={categories}
      settings={settings}
      chambers={chambers}
    />
  );
}
