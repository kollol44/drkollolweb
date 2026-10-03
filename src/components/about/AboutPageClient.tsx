'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { AppointmentModal } from '@/components/AppointmentModal';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Chamber, SiteSettings, SurgeonProfile } from '@/types/database';

interface AboutPageClientProps {
  profile: SurgeonProfile;
  categories: Category[];
  settings: SiteSettings;
  chambers: Chamber[];
}

export function AboutPageClient({
  profile,
  categories,
  settings,
  chambers,
}: AboutPageClientProps) {
  const { lang, isBn } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const t = {
    en: {
      eyebrow: 'Surgeon Biography & Qualifications',
      heroTitle: 'About Dr. Fahim Foysal Kollol',
      heroSub:
        'General, Laparoscopic, Breast & Colorectal Surgeon. Assistant Professor of Surgery at Mymensingh Medical College Hospital.',
      statsTitle: 'Verified Surgical Track Record',
      timelineTitle: 'Career Milestones & Training',
      membershipsTitle: 'Societies & Professional Fellowships',
      publicationsTitle: 'Research Publications (11 Papers)',
      publicationsSub: 'Published in peer-reviewed surgical journals focusing on laparoscopic advances and colorectal care.',
      book: 'Book a serial',
      call: 'Call now',
      timeline: [
        {
          year: '2015',
          title: 'Commenced Surgical Practice',
          desc: 'Started dedicated clinical service following graduation, managing general and emergency trauma patients.',
        },
        {
          year: '2017',
          title: 'MMCH Advanced Surgical Trainee',
          desc: 'Enrolled in intensive residency at Mymensingh Medical College Hospital handling complex surgical wards.',
        },
        {
          year: '2022',
          title: 'FCPS (Surgery) Specialist Qualification',
          desc: 'Awarded fellowship in surgery from the prestigious BCPS and achieved Member of the American College of Surgeons (MACS).',
        },
        {
          year: 'Present',
          title: 'Assistant Professor of Surgery, MMCH',
          desc: 'Faculty mentor training future surgeons, leading independent laparoscopic and colorectal surgical units in Sherpur & Mymensingh.',
        },
      ],
      publications: [
        { title: 'Comparative Outcomes of Laparoscopic vs Open Appendicectomy in Acute Appendicitis', journal: 'MMCH Medical Journal', year: '2022' },
        { title: 'Surgical Outcomes of Stapled Hemorrhoidopexy (Longo Method) in Grade III & IV Hemorrhoids', journal: 'Bangladesh Journal of Surgery', year: '2023' },
        { title: 'Management Protocols and Recurrence Prevention in Complex Perianal Fistula', journal: 'Journal of Surgical Sciences', year: '2021' },
        { title: 'Efficacy of Minimal Access Keyhole Cholecystectomy in Difficult Gallbladder Anatomy', journal: 'International Surgical Spectrum', year: '2023' },
        { title: 'Transabdominal Preperitoneal (TAPP) Mesh Repair in Inguinal Hernia: A 3-Year Single Center Study', journal: 'MMCH Journal of Medicine & Surgery', year: '2022' },
        { title: 'Diagnostic Accuracy of Triple Assessment in Palpable Breast Lumps among Reproductive Age Females', journal: 'Bangladesh Medical Review', year: '2020' },
        { title: 'Laparoscopic Varicocelectomy Outcomes on Semen Parameters and Pain Alleviation', journal: 'Clinical Surgery Insights', year: '2024' },
        { title: 'Analysis of Conservative vs Surgical Management in Subacute Anal Fissures', journal: 'Asian Journal of Coloproctology', year: '2023' },
        { title: 'Emergency Management of Blunt Abdominal Trauma in Secondary Healthcare Facilities', journal: 'MMCH Trauma Series', year: '2019' },
        { title: 'Clinical Spectrum and Pathological Profiling of Soft Tissue Lipomas', journal: 'Journal of Surgical Practice', year: '2021' },
        { title: 'Evaluation of Postoperative Quality of Life following Minimally Invasive Colorectal Surgery', journal: 'South Asian Surgical Bulletin', year: '2024' },
      ],
      ctaH: 'Meet Dr. Kollol for Personal Consultation',
      ctaS: 'Visiting Sherpur every Thursday & Friday and Mymensingh Saturday through Tuesday.',
    },
    bn: {
      eyebrow: 'সার্জন পরিচিতি ও শিক্ষাগত যোগ্যতা',
      heroTitle: 'ডাঃ ফাহিম ফয়সাল কল্লোল সম্পর্কে',
      heroSub:
        'জেনারেল, ল্যাপারোস্কপিক, ব্রেস্ট ও কলোরেক্টাল সার্জন। ময়মনসিংহ মেডিকেল কলেজ হাসপাতালের সহকারী অধ্যাপক (সার্জারি)।',
      statsTitle: 'সংখ্যায় কাজের অভিজ্ঞতা ও প্রমাণ',
      timelineTitle: 'কর্মজীবন ও উচ্চতর প্রশিক্ষণের ধাপ',
      membershipsTitle: 'পেশাদার সদস্যপদ ও স্বীকৃতি',
      publicationsTitle: 'গবেষণা প্রকাশনাসমূহ (১১টি গবেষণাপত্র)',
      publicationsSub: 'স্বীকৃত পিয়ার-রিভিউড সার্জিক্যাল জার্নালে প্রকাশিত গবেষণা কাজ।',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
      timeline: [
        {
          year: '২০১৫',
          title: 'চিকিৎসা সেবায় পদার্পণ',
          desc: 'স্নাতক সম্পন্ন করে জেনারেল ও জরুরি সার্জিক্যাল রোগীদের চিকিৎসায় নিজেকে নিয়োজিত করেন।',
        },
        {
          year: '২০১৭',
          title: 'ময়মনসিংহ মেডিকেল কলেজ হাসপাতালে রেসিডেন্ট ট্রেইনি',
          desc: 'এমএমসিএইচ-এ জটিল ও সংকটাপন্ন রোগীদের অস্ত্রোপচার ব্যবস্থাপনায় দীর্ঘ প্রশিক্ষণ গ্রহণ।',
        },
        {
          year: '২০২২',
          title: 'এফসিপিএস (সার্জারি) ফেলোশিপ অর্জন',
          desc: 'বিসিপিএস থেকে সার্জারির সর্বোচ্চ ডিগ্রি এবং আমেরিকান কলেজ অব সার্জন্সের (MACS) সদস্যপদ লাভ।',
        },
        {
          year: 'বর্তমান',
          title: 'সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ',
          desc: 'আগামী প্রজন্মের চিকিৎসকদের শিক্ষকতা এবং শেরপুর ও ময়মনসিংহে নিয়মিত সফল অস্ত্রোপচার পরিচালনা।',
        },
      ],
      publications: [
        { title: 'তীব্র অ্যাপেন্ডিসাইটিসে ল্যাপারোস্কপিক বনাম ওপেন অপারেশনের ফলাফল', journal: 'এমএমসিএইচ মেডিকেল জার্নাল', year: '২০২২' },
        { title: 'উন্নত পাইলস চিকিৎসায় লংগো (স্টেপলার) পদ্ধতির কার্যকারিতা', journal: 'বাংলাদেশ জার্নাল অব সার্জারি', year: '২০২৩' },
        { title: 'জটিল পেরিঅ্যানাল ফিস্টুলার চিকিৎসা ও পুনরাবৃত্তি রোধের কৌশল', journal: 'জার্নাল অব সার্জিক্যাল সায়েন্স', year: '২০২১' },
        { title: 'কঠিন পিত্তথলির অ্যানাটমিতে ল্যাপারোস্কপিক কোলেসিস্টেক্টমির সাফল্য', journal: 'ইন্টারন্যাশনাল সার্জিক্যাল স্পেকট্রাম', year: '২০২৩' },
        { title: 'কুঁচকির হার্নিয়ায় ল্যাপারোস্কপিক মেশ রিপেয়ার (TAPP) মূল্যায়ন', journal: 'এমএমসিএইচ জার্নাল অব সার্জারি', year: '২০২২' },
        { title: 'স্তন টিউমার নির্ণয়ে ট্রিপল অ্যাসেসমেন্টের নিখুঁত ভূমিকা', journal: 'বাংলাদেশ মেডিকেল রিভিউ', year: '২০২০' },
        { title: 'ল্যাপারোস্কপিক ভেরিকোসিল অপারেশনে শুক্রাণু ও ব্যথা উপশম', journal: 'ক্লিনিক্যাল সার্জারি ইনসাইটস', year: '২০২৪' },
        { title: 'এনাল ফিশার নিরাময়ে আধুনিক চিকিৎসা ও অপারেশনের তুলনা', journal: 'এশিয়ান জার্নাল অব কলোপ্রোক্টোলজি', year: '২০২৩' },
        { title: 'পেটের জরুরি ট্রমার তাৎক্ষণিক সার্জিক্যাল ব্যবস্থাপনা', journal: 'এমএমসিএইচ ট্রমা সিরিজ', year: '২০১৯' },
        { title: 'চামড়ার নিচে নরম চর্বির চাকা ও লাইপোমার প্যাথলজি', journal: 'জার্নাল অব সার্জিক্যাল প্র্যাকটিস', year: '২০২১' },
        { title: 'মলদ্বারের আধুনিক সার্জারির পর রোগীর জীবনযাত্রার মান', journal: 'সাউথ এশিয়ান সার্জিক্যাল বুলেটিন', year: '২০২৪' },
      ],
      ctaH: 'সরাসরি পরামর্শের জন্য চেম্বারে আসুন',
      ctaS: 'প্রতি বৃহস্পতি ও শুক্রবার শেরপুরে এবং শনি থেকে মঙ্গলবার ময়মনসিংহে চেম্বার অনুষ্ঠিত হয়।',
    },
  }[lang];

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar
        categories={categories}
        serialPhone={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--tint)] to-white border-b border-[rgba(43,179,177,0.2)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
              {t.eyebrow}
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[var(--teal)] leading-tight tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg font-semibold text-[var(--ink)]">
              {isBn ? profile.role_bn : profile.role_en}
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {isBn ? profile.post_bn : profile.post_en}
            </p>

            <div className="flex flex-wrap gap-2 my-2">
              {profile.degrees_badges.map((deg, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-white text-xs font-bold text-[var(--teal)] border border-[rgba(43,179,177,0.3)] shadow-sm"
                >
                  {deg}
                </span>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap mt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn btn-p text-sm py-3 px-6 shadow-md"
              >
                {t.book}: {settings.phone_serial}
              </button>
              <a
                href={`tel:${settings.phone_call}`}
                className="btn btn-g text-sm py-3 px-5 shadow-sm"
              >
                {t.call}
              </a>
            </div>
          </div>

          {/* Right Doctor Cutout */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[624/1000] p-4">
              <Image
                src="/img/doctor.webp"
                alt="Dr. Fahim Foysal Kollol"
                fill
                priority
                className="object-contain filter drop-shadow-[0_24px_34px_rgba(6,47,49,0.25)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Verified Stats Strip */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-heading font-extrabold text-2xl text-[var(--ink)]">
              {t.statsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {profile.stats.map((st, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--tint)]/60 border border-[rgba(43,179,177,0.25)] text-center shadow-sm"
              >
                <b className="font-heading font-extrabold text-2xl sm:text-3xl text-[var(--teal)] block">
                  {isBn ? st.num_bn : st.num_en}
                </b>
                <span className="text-xs text-[var(--muted)] font-medium mt-1.5 block leading-snug">
                  {isBn ? st.label_bn : st.label_en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--tint)] border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-heading font-extrabold text-3xl text-[var(--ink)]">
              {t.timelineTitle}
            </h3>
          </div>

          <div className="relative border-l-2 border-[var(--aqua)] pl-6 ml-4 sm:ml-8 flex flex-col gap-8">
            {t.timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-[var(--teal)] shadow-sm" />
                <span className="text-xs font-bold text-[var(--aqua)] tracking-widest block uppercase">
                  {item.year}
                </span>
                <h4 className="font-heading font-bold text-lg text-[var(--ink)] mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memberships & Societies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-heading font-extrabold text-2xl text-[var(--ink)]">
              {t.membershipsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm">
              <span className="text-xs font-bold text-[var(--aqua)]">USA Fellowship</span>
              <h4 className="font-heading font-bold text-base text-[var(--teal)] mt-1">MACS (USA)</h4>
              <p className="text-xs text-[var(--muted)] mt-1">Member, American College of Surgeons</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm">
              <span className="text-xs font-bold text-[var(--aqua)]">National Association</span>
              <h4 className="font-heading font-bold text-base text-[var(--teal)] mt-1">Life Member, SOSB</h4>
              <p className="text-xs text-[var(--muted)] mt-1">Society of Surgeons of Bangladesh</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm">
              <span className="text-xs font-bold text-[var(--aqua)]">Laparoscopy Specialist</span>
              <h4 className="font-heading font-bold text-base text-[var(--teal)] mt-1">Life Member, SELSB</h4>
              <p className="text-xs text-[var(--muted)] mt-1">Society of Endolaparoscopic Surgeons of Bangladesh</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm">
              <span className="text-xs font-bold text-[var(--aqua)]">Government Post</span>
              <h4 className="font-heading font-bold text-base text-[var(--teal)] mt-1">Assistant Professor</h4>
              <p className="text-xs text-[var(--muted)] mt-1">Mymensingh Medical College Hospital</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Research Publications */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--tint)] border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-heading font-extrabold text-3xl text-[var(--ink)]">
              {t.publicationsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-2">
              {t.publicationsSub}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {t.publications.map((pub, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[rgba(43,179,177,0.25)] shadow-sm flex items-start gap-4"
              >
                <span className="w-8 h-8 rounded-xl bg-[var(--tint)] text-[var(--teal)] font-bold text-sm grid place-items-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[var(--ink)] leading-snug">
                    {pub.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-1">
                    <span className="font-semibold text-[var(--teal)]">{pub.journal}</span>
                    <span>·</span>
                    <span>{pub.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Chamber CTA */}
      <section className="py-16 px-4 text-center bg-white border-t border-[rgba(43,179,177,0.2)]">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-heading font-extrabold text-3xl text-[var(--ink)]">
            {t.ctaH}
          </h3>
          <p className="text-sm text-[var(--muted)] mt-2 mb-6">
            {t.ctaS}
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-p text-sm py-3 px-6 shadow-md"
            >
              {t.book}: {settings.phone_serial}
            </button>
            <a
              href={`tel:${settings.phone_call}`}
              className="btn btn-g text-sm py-3 px-5 shadow-sm"
            >
              {t.call}
            </a>
          </div>
        </div>
      </section>

      <Footer
        settings={settings}
        categories={categories}
        chambers={chambers}
      />

      <MobileStickyBar
        phoneCall={settings.phone_call}
        whatsappUrl={settings.whatsapp_url}
        phoneSerial={settings.phone_serial}
        onBookClick={() => setModalOpen(true)}
      />

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chambers={chambers}
        whatsappUrl={settings.whatsapp_url}
      />
    </div>
  );
}
