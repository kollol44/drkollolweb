'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function Preloader() {
  const { isBn } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem('kpl')) {
        document.documentElement.classList.add('pl-skip');
        setVisible(false);
      } else {
        sessionStorage.setItem('kpl', '1');
      }
    } catch {
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    document.documentElement.classList.add('pl-skip');
  };

  if (!visible) return null;

  return (
    <div
      id="pl"
      role="presentation"
      aria-hidden="true"
      onClick={handleDismiss}
      onAnimationEnd={(e) => {
        if (e.animationName === 'plFlood') {
          handleDismiss();
        }
      }}
    >
      <div className="pl-stage">
        <div className="pl-mv">
          <svg className="pl-lamp" viewBox="0 0 120 70" aria-hidden="true">
            <rect x="56" y="0" width="8" height="16" rx="3" fill="#2BB3B1" />
            <path d="M10 50 Q60 6 110 50 Z" fill="#dfeeed" />
            <path d="M10 50 Q60 6 110 50" fill="none" stroke="#9fc9c7" strokeWidth="2" />
            <ellipse cx="60" cy="50" rx="50" ry="8" fill="#fff" />
            <circle cx="40" cy="50" r="4" fill="#fffbe6" />
            <circle cx="60" cy="51" r="4.5" fill="#fffbe6" />
            <circle cx="80" cy="50" r="4" fill="#fffbe6" />
          </svg>
          <div className="pl-beam" />
        </div>
        <div className="pl-name">
          {isBn ? 'ডাঃ ফাহিম ফয়সাল কল্লোল' : 'Dr. Fahim Foysal Kollol'}
        </div>
        <div className="pl-sub">
          {isBn
            ? 'জেনারেল, ল্যাপারোস্কপিক, ব্রেস্ট ও কলোরেক্টাল সার্জন'
            : 'General, Laparoscopic, Breast & Colorectal Surgeon'}
        </div>
      </div>
    </div>
  );
}
