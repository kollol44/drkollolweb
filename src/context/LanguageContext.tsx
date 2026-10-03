'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types/database';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isBn: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  isBn: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kollol-lang');
      if (stored === 'bn' || stored === 'en') {
        setLangState(stored);
        document.documentElement.lang = stored;
        document.body.classList.toggle('bn', stored === 'bn');
      }
    } catch {
      // localStorage unavailable in private mode
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('kollol-lang', newLang);
    } catch {}
    document.documentElement.lang = newLang;
    document.body.classList.toggle('bn', newLang === 'bn');
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isBn: lang === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
