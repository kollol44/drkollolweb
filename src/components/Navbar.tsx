'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/types/database';

interface NavbarProps {
  categories: Category[];
  serialPhone?: string;
  onBookClick?: () => void;
}

export function Navbar({ categories, serialPhone = '01750529252', onBookClick }: NavbarProps) {
  const { lang, setLang, isBn } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = {
    en: {
      brand: 'Dr. Kollol',
      home: 'Home',
      about: 'About Doctor',
      services: 'Conditions & Treatments',
      all: 'All conditions & treatments',
      blogs: 'Blogs',
      contact: 'Contact & Chambers',
      book: 'Book a serial',
      call: 'Call now',
    },
    bn: {
      brand: 'ডাঃ কল্লোল',
      home: 'হোম',
      about: 'ডাক্তার সম্পর্কে',
      services: 'রোগ ও চিকিৎসা',
      all: 'সব রোগ ও চিকিৎসা',
      blogs: 'ব্লগ',
      contact: 'যোগাযোগ ও চেম্বার',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
    },
  }[lang];

  return (
    <>
      <header className="fixed top-3 inset-x-4 max-w-7xl mx-auto z-50 flex items-center justify-between gap-4 px-4 py-2.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-[rgba(43,179,177,0.25)] shadow-[0_6px_30px_-12px_rgba(6,47,49,0.18)]">
        {/* Brand Emblem */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg leading-none whitespace-nowrap text-[var(--ink)]">
          <i className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--aqua)] to-[var(--teal)] grid place-items-center text-white not-italic font-extrabold text-base shadow-sm">
            K
          </i>
          <span className="font-heading tracking-tight">{navLinks.brand}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/' ? 'bg-[var(--tint)] text-[var(--teal)] font-semibold' : 'text-[var(--muted)] hover:bg-[var(--tint)] hover:text-[var(--teal)]'
            }`}
          >
            {navLinks.home}
          </Link>

          <Link
            href="/about"
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/about' ? 'bg-[var(--tint)] text-[var(--teal)] font-semibold' : 'text-[var(--muted)] hover:bg-[var(--tint)] hover:text-[var(--teal)]'
            }`}
          >
            {navLinks.about}
          </Link>

          {/* Conditions & Treatments Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith('/conditions') || dropdownOpen
                  ? 'bg-[var(--tint)] text-[var(--teal)] font-semibold'
                  : 'text-[var(--muted)] hover:bg-[var(--tint)] hover:text-[var(--teal)]'
              }`}
            >
              <span>{navLinks.services}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[var(--teal)]' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-72 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[rgba(43,179,177,0.22)] shadow-[0_20px_50px_-15px_rgba(6,47,49,0.3)] animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/conditions-treatments"
                  className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[var(--teal)] bg-[var(--tint)]/60 hover:bg-[var(--tint)] border-b border-[rgba(43,179,177,0.2)] mb-1"
                >
                  {navLinks.all} →
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/conditions-treatments/${cat.slug}`}
                    className="block px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--ink)] hover:bg-[var(--tint)] hover:text-[var(--teal)] transition-colors"
                  >
                    {isBn ? cat.name_bn : cat.name_en}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/blogs"
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname.startsWith('/blogs') ? 'bg-[var(--tint)] text-[var(--teal)] font-semibold' : 'text-[var(--muted)] hover:bg-[var(--tint)] hover:text-[var(--teal)]'
            }`}
          >
            {navLinks.blogs}
          </Link>

          <Link
            href="/contact"
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/contact' ? 'bg-[var(--tint)] text-[var(--teal)] font-semibold' : 'text-[var(--muted)] hover:bg-[var(--tint)] hover:text-[var(--teal)]'
            }`}
          >
            {navLinks.contact}
          </Link>
        </nav>

        {/* Right Section: Language switcher & Book CTA */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center border border-[rgba(11,110,115,0.25)] rounded-full p-0.5 bg-white/60">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                !isBn ? 'bg-[var(--teal)] text-white shadow-sm' : 'text-[var(--teal)] hover:bg-[var(--tint)]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                isBn ? 'bg-[var(--teal)] text-white shadow-sm' : 'text-[var(--teal)] hover:bg-[var(--tint)]'
              }`}
            >
              বাং
            </button>
          </div>

          {onBookClick ? (
            <button type="button" onClick={onBookClick} className="hidden sm:inline-flex btn btn-p text-sm py-2 px-4 shadow-sm">
              {navLinks.book}
            </button>
          ) : (
            <a href={`tel:${serialPhone}`} className="hidden sm:inline-flex btn btn-p text-sm py-2 px-4 shadow-sm">
              {navLinks.book}
            </a>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-[rgba(11,110,115,0.22)] bg-white grid place-items-center cursor-pointer text-[var(--teal)]"
            aria-label="Toggle menu"
          >
            <span className="block w-4 h-0.5 bg-[var(--teal)] shadow-[0_5px_0_var(--teal),0_-5px_0_var(--teal)]" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[72px] inset-x-4 z-40 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[rgba(43,179,177,0.25)] shadow-2xl flex flex-col gap-1 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <Link href="/" className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[var(--ink)] hover:bg-[var(--tint)]">
            {navLinks.home}
          </Link>
          <Link href="/about" className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[var(--ink)] hover:bg-[var(--tint)]">
            {navLinks.about}
          </Link>
          <Link href="/conditions-treatments" className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[var(--teal)] bg-[var(--tint)]/50">
            {navLinks.services} (সব রোগ)
          </Link>
          <div className="pl-4 flex flex-col gap-0.5 border-l-2 border-[var(--aqua)]/30 my-1">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/conditions-treatments/${c.slug}`}
                className="px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--teal)]"
              >
                {isBn ? c.name_bn : c.name_en}
              </Link>
            ))}
          </div>
          <Link href="/blogs" className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[var(--ink)] hover:bg-[var(--tint)]">
            {navLinks.blogs}
          </Link>
          <Link href="/contact" className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[var(--ink)] hover:bg-[var(--tint)]">
            {navLinks.contact}
          </Link>

          <a href={`tel:${serialPhone}`} className="btn btn-p mt-3 w-full py-3 text-center">
            {navLinks.book}: {serialPhone}
          </a>
        </div>
      )}
    </>
  );
}
