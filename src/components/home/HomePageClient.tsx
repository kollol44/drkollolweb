'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroIncision } from '@/components/home/HeroIncision';
import { MeetYourSurgeonHero } from '@/components/home/MeetYourSurgeonHero';
import { DoctorConditionsStage } from '@/components/home/DoctorConditionsStage';
import { SerialStepsSection } from '@/components/home/SerialStepsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { VideosSection } from '@/components/home/VideosSection';
import { GallerySection } from '@/components/home/GallerySection';
import { FaqSection } from '@/components/home/FaqSection';
import { BlogPreviewSection } from '@/components/home/BlogPreviewSection';
import { VisitChambersSection } from '@/components/home/VisitChambersSection';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { AppointmentModal } from '@/components/AppointmentModal';
import {
  SiteSettings,
  HeroSection,
  SurgeonProfile,
  Category,
  Condition,
  SerialStep,
  Chamber,
  Review,
  FAQ,
  BlogPost,
} from '@/types/database';

interface HomePageClientProps {
  siteSettings: SiteSettings;
  heroSection: HeroSection;
  surgeonProfile: SurgeonProfile;
  categories: Category[];
  conditions: Condition[];
  serialSteps: SerialStep[];
  chambers: Chamber[];
  reviews: Review[];
  faqs: FAQ[];
  blogs: BlogPost[];
}

export function HomePageClient({
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
}: HomePageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navbar with Book a Serial action */}
      <Navbar
        categories={categories}
        serialPhone={siteSettings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* 1. Hero with scroll-scrubbed incision video & bleeding cut line */}
      <HeroIncision heroData={heroSection} />

      {/* 2. Meet Your Surgeon Hero (exact layout matching screenshot and About hero) */}
      <MeetYourSurgeonHero
        profile={surgeonProfile}
        serialPhone={siteSettings.phone_serial}
        callPhone={siteSettings.phone_call}
        onBookClick={() => setModalOpen(true)}
        id="doctor"
        headingLevel="h2"
      />

      {/* 3. Conditions & Treatments Swinging Doctor Pinned Stage */}
      <DoctorConditionsStage
        profile={surgeonProfile}
        categories={categories}
        conditions={conditions}
        onBookClick={() => setModalOpen(true)}
      />

      {/* 4. How to get a serial sticky stack with animated pictograms */}
      <SerialStepsSection
        steps={serialSteps}
        profile={surgeonProfile}
        onBookClick={() => setModalOpen(true)}
      />

      {/* 5. Patient Reviews & Google Box */}
      <ReviewsSection reviews={reviews} />

      {/* 6. Medical Explanation Videos */}
      <VideosSection />

      {/* 7. Clinical Practice Gallery */}
      <GallerySection />

      {/* 8. Common FAQ Accordion */}
      <FaqSection faqs={faqs} />

      {/* 9. Health & Surgery Blogs Preview */}
      <BlogPreviewSection blogs={blogs} categories={categories} />

      {/* 10. Visit & Consultation Chambers with Google Map */}
      <VisitChambersSection
        settings={siteSettings}
        chambers={chambers}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Redesigned Fresh Aqua Gradient Footer */}
      <Footer
        settings={siteSettings}
        categories={categories}
        chambers={chambers}
      />

      {/* Mobile Bottom Sticky Bar */}
      <MobileStickyBar
        phoneCall={siteSettings.phone_call}
        whatsappUrl={siteSettings.whatsapp_url}
        phoneSerial={siteSettings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Interactive Appointment Modal */}
      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chambers={chambers}
        whatsappUrl={siteSettings.whatsapp_url}
      />
    </div>
  );
}
