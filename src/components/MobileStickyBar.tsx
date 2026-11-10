'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PhoneCall, MessageCircle } from 'lucide-react';

interface MobileStickyBarProps {
  phoneCall?: string;
  whatsappUrl?: string;
  phoneSerial?: string;
  onBookClick?: () => void;
}

export function MobileStickyBar({
  phoneCall = '01670879100',
  whatsappUrl = 'https://wa.me/8801670879100',
  phoneSerial = '01750529252',
  onBookClick,
}: MobileStickyBarProps) {
  const { isBn } = useLanguage();

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 p-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-[rgba(43,179,177,0.3)] shadow-[0_14px_30px_-10px_rgba(6,47,49,0.35)] flex items-center gap-2">
      <a
        href={`tel:${phoneCall}`}
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[var(--teal)] hover:bg-[#062F31] !text-white text-white text-xs font-bold transition-all shadow-sm active:scale-98"
      >
        <PhoneCall className="w-3.5 h-3.5 text-white stroke-[2.2] shrink-0" />
        <span className="!text-white text-white">{isBn ? 'কল করুন' : 'Call'}</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#0A6E73] hover:bg-[#062F31] !text-white text-white text-xs font-bold transition-all shadow-sm active:scale-98"
      >
        <MessageCircle className="w-3.5 h-3.5 text-white stroke-[2.2] shrink-0" />
        <span className="!text-white text-white">WhatsApp</span>
      </a>
      {onBookClick ? (
        <button
          type="button"
          onClick={onBookClick}
          className="btn btn-p flex-1 py-2.5 px-2 text-xs font-bold text-center justify-center"
        >
          {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
        </button>
      ) : (
        <a
          href={`tel:${phoneSerial}`}
          className="btn btn-p flex-1 py-2.5 px-2 text-xs font-bold text-center justify-center"
        >
          {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
        </a>
      )}
    </div>
  );
}
