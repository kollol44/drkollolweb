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
      about: 'About the Doctor',
      services: 'Conditions & Treatments',
      all: 'All conditions & treatments',
      blogs: 'Blogs',
      contact: 'Contact',
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
      contact: 'যোগাযোগ',
      book: 'সিরিয়াল নিন',
      call: 'কল করুন',
    },
  }[lang];

  return (
    <>
      <header className="nav">
        <Link className="brand" href="/">
          <i>K</i>
          <span>{navLinks.brand}</span>
        </Link>

        <nav className="links">
          <Link href="/" className={pathname === '/' ? 'on' : ''}>
            {navLinks.home}
          </Link>
          <Link
            href={pathname === '/' ? '/#doctor' : '/about'}
            className={pathname === '/about' ? 'on' : ''}
          >
            {navLinks.about}
          </Link>

          <div className={`dd ${dropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {navLinks.services}
            </button>
            <div className="dd-menu">
              <Link className="all" href="/conditions-treatments">
                {navLinks.all}
              </Link>
              {categories.map((c) => (
                <Link key={c.slug} href={`/conditions-treatments/${c.slug}`}>
                  {isBn ? c.name_bn : c.name_en}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/blogs" className={pathname.startsWith('/blogs') ? 'on' : ''}>
            {navLinks.blogs}
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? 'on' : ''}>
            {navLinks.contact}
          </Link>
        </nav>

        <div className="right">
          <div className="lang">
            <button
              type="button"
              className={lang === 'en' ? 'on' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'bn' ? 'on' : ''}
              onClick={() => setLang('bn')}
            >
              বাং
            </button>
          </div>

          {onBookClick ? (
            <button type="button" onClick={onBookClick} className="btn btn-p">
              {navLinks.book}
            </button>
          ) : (
            <a className="btn btn-p" href={`tel:${serialPhone}`}>
              {navLinks.book}
            </a>
          )}

          <button
            type="button"
            className="burger"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      <div className={`sheet ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/">{navLinks.home}</Link>
        <Link href={pathname === '/' ? '/#doctor' : '/about'}>{navLinks.about}</Link>
        <Link href="/conditions-treatments">{navLinks.services}</Link>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categories.map((c) => (
            <Link key={c.slug} className="sub" href={`/conditions-treatments/${c.slug}`}>
              {isBn ? c.name_bn : c.name_en}
            </Link>
          ))}
        </div>
        <Link href="/blogs">{navLinks.blogs}</Link>
        <Link href="/contact">{navLinks.contact}</Link>
        <a
          href="tel:01670879100"
          className="btn btn-p"
          style={{ marginTop: '6px' }}
        >
          {navLinks.call}
        </a>
      </div>
    </>
  );
}
