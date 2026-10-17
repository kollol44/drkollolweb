'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    url?: string;
    type?: 'call' | 'link' | 'booking';
  }>;
}

const QUICK_CHIPS = [
  {
    id: 'chambers',
    label_en: 'Chambers & Schedule',
    label_bn: 'চেম্বার ও সময়সূচী',
    icon: Clock,
    answer_en:
      'Dr. Kollol consults patients at:\n\n1. **Anwer Memorial Hospital, Sherpur**\n   - Friday: 9:00 AM – 5:00 PM\n\n2. **Delta Health Care, Mymensingh**\n   - Sat to Wed: 5:00 PM – 9:00 PM\n\n3. **Swadesh Hospital, Mymensingh**\n   - On call & emergency consults',
    answer_bn:
      'ডাঃ ফাহিম ফয়সাল কল্লোলের চেম্বার ও রোগী দেখার স্থান:\n\n1. **আনোয়ার মেমোরিয়াল হাসপাতাল, শেরপুর**\n   - প্রতি শুক্রবার: সকাল ৯:০০ টা – বিকাল ৫:০০ টা\n\n2. **ডেল্টা হেলথ কেয়ার, ময়মনসিংহ**\n   - শনি থেকে বুধবার: বিকাল ৫:০০ টা – রাত ৯:০০ টা\n\n3. **স্বদেশ হাসপাতাল, ময়মনসিংহ**\n   - বিশেষ ও জরুরি পরামর্শ',
    actions: [
      { label: 'কল করুন (01750529252)', url: 'tel:01750529252', type: 'call' as const },
      { label: 'অনলাইন সিরিয়াল ফর্ম', url: '#book-serial', type: 'booking' as const },
    ],
  },
  {
    id: 'serial',
    label_en: 'How to Book Serial',
    label_bn: 'সিরিয়াল নেওয়ার নিয়ম',
    icon: Calendar,
    answer_en:
      'You can book an appointment in 3 easy ways:\n\n1. **Direct Phone Call:** Call 01750-529252 between 8:00 AM – 10:00 PM.\n2. **WhatsApp Booking:** Send a message to 01670-879100 with patient name & district.\n3. **Online Form:** Click "Book Serial" at the top of the website.',
    answer_bn:
      'সিরিয়াল বুকিং করার সহজ ৩টি মাধ্যম:\n\n1. **সরাসরি ফোনে সিরিয়াল:** সকাল ৮টা থেকে রাত ১০টার মধ্যে কল করুন: 01750529252\n2. **হোয়াটসঅ্যাপে মেসেজ:** রোগীর নাম ও জেলা লিখে মেসেজ করুন: 01670879100\n3. **অনলাইন বুকিং:** ওয়েবসাইটের উপরের "সিরিয়াল নিন" বাটনে চাপ দিয়ে ফর্ম পূরণ করুন।',
    actions: [
      { label: 'হটলাইনে কল দিন', url: 'tel:01750529252', type: 'call' as const },
      { label: 'হোয়াটসঅ্যাপে লিখুন', url: 'https://wa.me/8801670879100', type: 'link' as const },
    ],
  },
  {
    id: 'laparoscopy_piles',
    label_en: 'Laparoscopy & Piles Care',
    label_bn: 'পাইলস ও ল্যাপারোস্কপিক সার্জারি',
    icon: Sparkles,
    answer_en:
      'Dr. Kollol specializes in:\n- **Minimally Invasive Laparoscopy:** Gallbladder stones (keyhole surgery), Hernia mesh repair, Appendicitis.\n- **Modern Colorectal Proctology:** Painless Longo stapler & laser surgery for Piles, complex fistula, & fissure.\n- **Breast Clinic:** Breast lump removal & tumor screening.',
    answer_bn:
      'ডাঃ কল্লোলের প্রধান অস্ত্রোপচার ও সেবা:\n- **ল্যাপারোস্কপিক সার্জারি:** ছোট ছিদ্রের মাধ্যমে পিত্তথলির পাথর অপসারণ, হার্নিয়া ও অ্যাপেন্ডিক্স।\n- **পাইলস ও কলোরেক্টাল:** লঙ্গো স্টেপলার ও লেজার প্রযুক্তির সাহায্যে ব্যথাহীন পাইলস ও জটিল ফিস্টুলার সফল চিকিৎসা।\n- **ব্রেস্ট ক্লিনিক:** স্তনের টিউমার, চাকা ও ক্যান্সার স্ক্রিনিং।',
    actions: [
      { label: 'সকল চিকিৎসার তালিকা দেখুন', url: '/conditions-treatments', type: 'link' as const },
    ],
  },
  {
    id: 'emergency',
    label_en: 'Emergency & Hotline',
    label_bn: 'জরুরি হটলাইন ও যোগাযোগ',
    icon: Phone,
    answer_en:
      "For emergency consults or acute surgical pain, call Dr. Kollol's desk directly:\n- Serial Hotline: 01750529252\n- Direct Doctor Phone: 01670879100\n- Assistant Manager: 01671-869026\n\nFor critical life-threatening conditions, please visit the MMCH Emergency Room or call 999 immediately.",
    answer_bn:
      'জরুরি তথ্য ও যোগাযোগের নম্বর:\n- সিরিয়াল হটলাইন: 01750529252\n- সরাসরি কথা বলুন: 01670879100\n- চেম্বার সহকারী: 01671-869026\n\nআশঙ্কাজনক উপসর্গের ক্ষেত্রে অবিলম্বে ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH) ইমার্জেন্সিতে যান অথবা ৯৯৯-এ কল করুন।',
    actions: [
      { label: 'সরাসরি কল (01670879100)', url: 'tel:01670879100', type: 'call' as const },
    ],
  },
];

export function ChatWidget() {
  const { lang, isBn } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeText = isBn
      ? 'আসসালামু আলাইকুম। আমি ডাঃ ফাহিম ফয়সাল কল্লোলের ডিজিটাল ক্লিনিক্যাল অ্যাসিস্ট্যান্ট। চেম্বার, সময়সূচী, সিরিয়াল বুকিং বা সার্জারি চিকিৎসার তথ্যে কীভাবে সাহায্য করতে পারি?'
      : "Hello! I am Dr. Fahim Foysal Kollol's digital assistant. How may I assist you regarding chamber locations, visiting hours, serial booking, or surgical procedures today?";

    setMessages([
      {
        id: 'welcome_1',
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [isBn]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setHasInteracted(true);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Handle Quick Chips (Instant, zero API call)
  const handleChipClick = (chip: (typeof QUICK_CHIPS)[0]) => {
    const userText = isBn ? chip.label_bn : chip.label_en;
    const botAnswer = isBn ? chip.answer_bn : chip.answer_en;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: 'user_' + Date.now(),
        sender: 'user',
        text: userText,
        timestamp: now,
      },
      {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: botAnswer,
        timestamp: now,
        actions: chip.actions,
      },
    ]);
  };

  // Handle Free Typing Message through Google Gemini AI
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim();
    if (!query || isTyping) return;

    setInputText('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Build brief conversation history
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: history,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (isBn
          ? 'ধন্যবাদ। তথ্যের জন্য সরাসরি কল করুন: 01750529252।'
          : 'Thank you. For direct assistance, please call: 01750529252.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            { label: isBn ? 'সিরিয়াল হটলাইন (কল)' : 'Serial Hotline', url: 'tel:01750529252', type: 'call' },
          ],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: isBn
            ? 'নেটওয়ার্ক সংযোগে সমস্যা হচ্ছে। জরুরি তথ্যে সরাসরি সিরিয়াল নম্বরে কল করুন: 01750529252।'
            : 'Connection timeout. Please contact Dr. Kollol directly at: 01750529252.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    const welcomeText = isBn
      ? 'আসসালামু আলাইকুম। আমি ডাঃ ফাহিম ফয়সাল কল্লোলের ডিজিটাল ক্লিনিক্যাল অ্যাসিস্ট্যান্ট। কীভাবে সহায়তা করতে পারি?'
      : "Hello! I am Dr. Fahim Foysal Kollol's digital assistant. How may I help you today?";

    setMessages([
      {
        id: 'welcome_' + Date.now(),
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* ---------------------------------------------------------------------------------- */}
      {/* FLOATING ACTION BUBBLE */}
      {/* ---------------------------------------------------------------------------------- */}
      <aside aria-label="Medical AI Assistant" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Dr. Kollol Clinical Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            {/* Glowing ambient ring */}
            <span className="absolute -inset-1 rounded-full bg-[#2BB3B1]/30 blur-md group-hover:bg-[#2BB3B1]/50 transition-all pointer-events-none" />

            {/* Doctor avatar / icon */}
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white/20 border border-white/40 shrink-0">
              <Image
                src="/img/doctor.webp"
                alt="Dr. Kollol"
                fill
                className="object-cover object-top"
                sizes="28px"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
            </div>

            {/* Label text */}
            <span className="text-xs font-bold font-sans tracking-wide pr-1 hidden xs:inline-block">
              {isBn ? 'সহায়তা নিন' : 'Ask Dr. Kollol AI'}
            </span>

            {/* Sparkle icon */}
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />

            {/* Unread badge if any */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </aside>

      {/* ---------------------------------------------------------------------------------- */}
      {/* CHAT WINDOW DIALOG */}
      {/* ---------------------------------------------------------------------------------- */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dr. Kollol Clinical Assistant Dialog"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="relative p-4 px-5 bg-gradient-to-r from-[#062F31] via-[#0B6E73] to-[#062F31] text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-[#2BB3B1]/60 shrink-0">
                <Image
                  src="/img/doctor.webp"
                  alt="Dr. Kollol"
                  fill
                  className="object-cover object-top"
                  sizes="40px"
                />
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#062F31]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm font-serif tracking-wide leading-tight">
                    {isBn ? 'ডাঃ কল্লোল ডিজিটাল এআই' : 'Dr. Kollol Clinical AI'}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#2BB3B1]/30 text-emerald-200 border border-[#2BB3B1]/40">
                    BMDC A-61041
                  </span>
                </div>
                <p className="text-[10px] text-teal-100/80 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isBn ? 'চেম্বার ও সার্জারি সহকারী • অনলাইন' : 'Verified Clinical Assistant • Online'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title={isBn ? 'চ্যাট রিলোড করুন' : 'Reset chat'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title={isBn ? 'বন্ধ করুন' : 'Close assistant'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="px-4 py-1.5 bg-[#EEF7F6] border-b border-[#2BB3B1]/20 flex items-center justify-between text-[10px] text-[#0B6E73] font-medium shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {isBn ? 'অফিসিয়াল তথ্য যাচাইকৃত' : 'Official Grounded Knowledge'}
            </span>
            <span className="text-[9px] text-[#3F6668]">
              {isBn ? 'প্রেসক্রিপশন প্রদান করা হয় না' : 'Informational Only'}
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin bg-[#F4F9F8]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white rounded-br-xs'
                      : 'bg-white text-[#062F31] border border-gray-100 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line select-text">{msg.text}</p>

                  {/* Message Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
                      {msg.actions.map((act, aIdx) => (
                        <a
                          key={aIdx}
                          href={act.url || '#'}
                          target={act.url?.startsWith('http') ? '_blank' : '_self'}
                          rel={act.url?.startsWith('http') ? 'noreferrer' : undefined}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF7F6] text-[#0B6E73] hover:bg-[#0B6E73] hover:text-white font-bold text-[10px] transition-colors border border-[#0B6E73]/20"
                        >
                          {act.type === 'call' && <Phone className="w-2.5 h-2.5" />}
                          {act.type === 'link' && <ExternalLink className="w-2.5 h-2.5" />}
                          <span>{act.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 max-w-[70%] text-xs text-[#0B6E73] shadow-xs">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6E73] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6E73] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6E73] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] font-medium">
                  {isBn ? 'ডাঃ কল্লোল এআই লিখছে...' : 'Thinking...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips (Zero Latency) */}
          <div className="p-2.5 px-3 bg-white border-t border-gray-100 shrink-0">
            <p className="text-[10px] text-[#3F6668] font-bold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2BB3B1]" />
              {isBn ? 'দ্রুত জানতে নিচের টপিকে চাপ দিন:' : 'Instant topics:'}
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_CHIPS.map((chip) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#EEF7F6] text-[#062F31] hover:bg-[#0B6E73] hover:text-white text-[10px] font-semibold transition-all border border-[#0B6E73]/15 whitespace-nowrap shrink-0 shadow-2xs"
                  >
                    <IconComponent className="w-3 h-3 text-[#0B6E73]" />
                    <span>{isBn ? chip.label_bn : chip.label_en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isBn
                  ? 'চেম্বার, সার্জারি বা সিরিয়াল নিয়ে প্রশ্ন লিখুন...'
                  : 'Ask about chambers, surgeries, or appointments...'
              }
              maxLength={500}
              className="flex-1 text-xs rounded-xl border border-gray-200 p-2.5 px-3 bg-[#F4F9F8] text-[#062F31] placeholder-gray-400 focus:outline-hidden focus:border-[#0B6E73] focus:ring-1 focus:ring-[#0B6E73]/30 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              aria-label="Send Message"
              className={`w-9 h-9 rounded-xl grid place-items-center transition-all ${
                inputText.trim() && !isTyping
                  ? 'bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
