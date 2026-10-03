import React from 'react';
import {
  getSiteSettings,
  getHeroSection,
  getSurgeonProfile,
  getCategories,
  getConditions,
  getSerialSteps,
  getChambers,
  getReviews,
  getFaqs,
  getBlogs,
} from '@/lib/content/service';
import { HomePageClient } from '@/components/home/HomePageClient';

export const revalidate = 60; // ISR for lightning fast loading

export default async function HomePage() {
  const [
    siteSettings,
    heroSection,
    surgeonProfile,
    categories,
    conditions,
    serialSteps,
    chambers,
    reviews,
    faqs,
    blogs,
  ] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getSurgeonProfile(),
    getCategories(),
    getConditions(),
    getSerialSteps(),
    getChambers(),
    getReviews(),
    getFaqs(),
    getBlogs(),
  ]);

  return (
    <HomePageClient
      siteSettings={siteSettings}
      heroSection={heroSection}
      surgeonProfile={surgeonProfile}
      categories={categories}
      conditions={conditions}
      serialSteps={serialSteps}
      chambers={chambers}
      reviews={reviews}
      faqs={faqs}
      blogs={blogs}
    />
  );
}
