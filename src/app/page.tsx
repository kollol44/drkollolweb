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
  getGalleryPhotos,
  getGalleryVideos,
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
    galleryPhotos,
    galleryVideos,
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
    getGalleryPhotos(),
    getGalleryVideos(),
  ]);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question_en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer_en,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
        galleryPhotos={galleryPhotos}
        galleryVideos={galleryVideos}
      />
    </>
  );
}

