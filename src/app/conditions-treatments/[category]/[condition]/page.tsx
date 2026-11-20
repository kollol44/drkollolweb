import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getCategories,
  getConditions,
  getConditionBySlug,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { ConditionPageClient } from '@/components/conditions/ConditionPageClient';

interface ConditionPageProps {
  params: Promise<{ category: string; condition: string }>;
}

export async function generateMetadata({ params }: ConditionPageProps): Promise<Metadata> {
  const { category: catSlug, condition: condSlug } = await params;
  const condition = await getConditionBySlug(condSlug);

  if (!condition) return { title: 'Condition Not Found' };

  return {
    title: `${condition.name_en} (${condition.name_bn}) — Dr. Fahim Foysal Kollol`,
    description: `${condition.short_en} ${condition.what_en.slice(0, 140)}... Surgeon in Sherpur and Mymensingh.`,
    alternates: {
      canonical: `https://drkollol.com/conditions-treatments/${catSlug}/${condSlug}`,
    },
    openGraph: {
      title: `${condition.name_en} (${condition.name_bn}) — Surgical Care`,
      description: `${condition.short_en} Specialized surgery by Dr. Fahim Foysal Kollol in Sherpur & Mymensingh.`,
      url: `https://drkollol.com/conditions-treatments/${catSlug}/${condSlug}`,
      images: condition.image_url ? [{ url: condition.image_url }] : [],
    },
  };
}

export async function generateStaticParams() {
  const conditions = await getConditions();
  return conditions.map((c) => ({
    category: c.category_slug,
    condition: c.slug,
  }));
}

export const revalidate = 60;

export default async function ConditionPage({ params }: ConditionPageProps) {
  const { category: catSlug, condition: condSlug } = await params;
  const [categories, condition, allConditions, settings, chambers] = await Promise.all([
    getCategories(),
    getConditionBySlug(condSlug),
    getConditions(),
    getSiteSettings(),
    getChambers(),
  ]);

  if (!condition || condition.category_slug !== catSlug) {
    notFound();
  }

  const category = categories.find((c) => c.slug === catSlug) || categories[0];
  const relatedConditions = allConditions.filter(
    (c) => c.category_slug === catSlug && c.slug !== condSlug
  );

  const medicalJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: condition.name_en,
    alternateName: condition.name_bn,
    description: condition.what_en,
    signOrSymptom: condition.symptoms_en.map((s) => ({
      '@type': 'MedicalSignOrSymptom',
      name: s,
    })),
    possibleTreatment: condition.treat_en.map((t) => ({
      '@type': 'MedicalTherapy',
      name: t,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalJsonLd) }}
      />
      <ConditionPageClient
        condition={condition}
        category={category}
        categories={categories}
        relatedConditions={relatedConditions}
        settings={settings}
        chambers={chambers}
      />
    </>
  );
}
