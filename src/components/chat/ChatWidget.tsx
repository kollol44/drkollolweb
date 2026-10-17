'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Send,
  Sparkles,
  Phone,
  Clock,
  Calendar,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Activity,
  Scissors,
  HeartPulse,
  CreditCard,
  HelpCircle,
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

// ----------------------------------------------------------------------------------
// INLINE & BLOCK MARKDOWN PARSER (Renders **bold**, *italic*, [link], lists, headers)
// ----------------------------------------------------------------------------------

function parseInlineMarkdown(text: string, isUser: boolean = false): React.ReactNode[] {
  // Regex to match **bold**, *italic*, [link text](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={idx}
          className={`font-bold ${isUser ? 'text-white underline decoration-white/40' : 'text-[#062F31] font-semibold'}`}
        >
          {boldText}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const italicText = part.slice(1, -1);
      return (
        <em key={idx} className={`italic ${isUser ? 'text-teal-100' : 'text-[#0B6E73]'}`}>
          {italicText}
        </em>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith('http');
      return (
        <a
          key={idx}
          href={url}
          target={isExternal ? '_blank' : '_self'}
          rel={isExternal ? 'noreferrer' : undefined}
          className={`underline underline-offset-2 font-semibold transition-colors ${
            isUser ? 'text-teal-100 hover:text-white' : 'text-[#0B6E73] hover:text-[#2BB3B1]'
          }`}
        >
          {label}
        </a>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function FormattedMessageText({ text, isUser }: { text: string; isUser?: boolean }) {
  if (!text) return null;

  if (isUser) {
    return <p className="whitespace-pre-line select-text text-white">{parseInlineMarkdown(text, true)}</p>;
  }

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ol' | 'ul'; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-1.5 space-y-1.5 pl-0.5 list-none">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs leading-relaxed text-[#062F31]">
                <span className="font-bold text-[#0B6E73] shrink-0 text-[11px] mt-0.5 min-w-[16px]">
                  {idx + 1}.
                </span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-1.5 space-y-1 pl-1 list-none">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs leading-relaxed text-[#062F31]">
                <span className="text-[#2BB3B1] font-bold shrink-0 text-sm leading-none mt-0.5">
                  •
                </span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((rawLine, lineIdx) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      elements.push(<div key={`spacer-${lineIdx}`} className="h-1" />);
      return;
    }

    // Heading: ### or ## or #
    if (trimmed.startsWith('#')) {
      flushList();
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h4
          key={`h-${lineIdx}`}
          className="font-bold text-[#062F31] text-[13px] mt-2 mb-1 tracking-tight"
        >
          {parseInlineMarkdown(headingText, false)}
        </h4>
      );
      return;
    }

    // Numbered list item: e.g. "1. **Anwer Memorial...**" or "1) Title"
    const olMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(parseInlineMarkdown(olMatch[2], false));
      return;
    }

    // Bullet list item: e.g. "- Friday: 9am" or "* text" or "• text"
    const ulMatch = trimmed.match(/^[\-\*\•]\s+(.*)/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(parseInlineMarkdown(ulMatch[1], false));
      return;
    }

    // Regular line / paragraph
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="leading-relaxed text-xs text-[#062F31]">
        {parseInlineMarkdown(rawLine, false)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1 select-text">{elements}</div>;
}

// ----------------------------------------------------------------------------------
// 9 HIGH-VALUE CLINICAL QUICK FAQS & ZERO-LATENCY TOPICS
// ----------------------------------------------------------------------------------

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
      'You can book an appointment in 3 easy ways:\n\n1. **Direct Phone Call:** Call **01750-529252** between 8:00 AM – 10:00 PM.\n2. **WhatsApp Booking:** Send a message to **01670-879100** with patient name & district.\n3. **Online Form:** Click "Book Serial" at the top of the website.',
    answer_bn:
      'সিরিয়াল বুকিং করার সহজ ৩টি মাধ্যম:\n\n1. **সরাসরি ফোনে সিরিয়াল:** সকাল ৮টা থেকে রাত ১০টার মধ্যে কল করুন: **01750529252**\n2. **হোয়াটসঅ্যাপে মেসেজ:** রোগীর নাম ও জেলা লিখে মেসেজ করুন: **01670879100**\n3. **অনলাইন বুকিং:** ওয়েবসাইটের উপরের "সিরিয়াল নিন" বাটনে চাপ দিয়ে ফর্ম পূরণ করুন।',
    actions: [
      { label: 'হটলাইনে কল দিন', url: 'tel:01750529252', type: 'call' as const },
      { label: 'হোয়াটসঅ্যাপে লিখুন', url: 'https://wa.me/8801670879100', type: 'link' as const },
    ],
  },
  {
    id: 'piles_fissure',
    label_en: 'Piles, Fistula & Fissure',
    label_bn: 'পাইলস, ফিস্টুলা ও ফিশার',
    icon: Scissors,
    answer_en:
      'Advanced painless proctology treatments offered by Dr. Kollol:\n\n1. **Piles (Hemorrhoids):** Longo stapler technique & laser ablation — no open wounds, painless, same-day or 24hr discharge.\n2. **Anal Fistula:** Modern laser fistula closure (FiLaC), preserving sphincter muscle & continence.\n3. **Anal Fissure:** Medical sphincter management and minimally invasive surgery for lasting relief.',
    answer_bn:
      'মলদ্বারের ব্যথাহীন আধুনিক চিকিৎসা ও সার্জারি:\n\n1. **পাইলস (অর্শ):** আধুনিক লঙ্গো স্টেপলার ও লেজার সার্জারি — কোনো বড় কাটাছেঁড়া নেই, ব্যথামুক্ত এবং ১ দিনের মধ্যেই বাড়ি ফেরা সম্ভব।\n2. **এনাল ফিস্টুলা (ভগন্দর):** আধুনিক ফিস্টুলা লেজার চিকিৎসা (FiLaC), যা মলদ্বারের মাংসপেশি সুরক্ষিত রাখে।\n3. **এনাল ফিশার (গেজ/ফেটে যাওয়া):** ব্যথাহীন দ্রুত আরোগ্য লাভ ও স্থায়ী সমাধান।',
    actions: [
      { label: 'কলোরেক্টাল বিভাগ দেখুন', url: '/conditions-treatments/colorectal', type: 'link' as const },
      { label: 'পাইলস পরামর্শে সিরিয়াল', url: 'tel:01750529252', type: 'call' as const },
    ],
  },
  {
    id: 'laparoscopy_gallbladder',
    label_en: 'Gallbladder Stones & Laparoscopy',
    label_bn: 'পিত্তথলির পাথর ও ল্যাপারোস্কপি',
    icon: Activity,
    answer_en:
      'Minimally invasive keyhole surgical care:\n\n1. **Laparoscopic Cholecystectomy:** Removal of gallbladder stones through 3–4 tiny keyholes (5mm–10mm).\n2. **Key Benefits:** Minimal pain, barely visible scars, normal eating within 12–24 hours, back to work in 5–7 days.\n3. **Safety:** High-definition laparoscopic camera ensures precision and patient safety.',
    answer_bn:
      'পিত্তথলির পাথরের ল্যাপারোস্কপিক (মাইক্রো-ছিদ্র) চিকিৎসা:\n\n1. **ল্যাপারোস্কপিক কোলেসিস্টেক্টমি:** পেট না কেটে মাত্র ৩-৪টি ছোট ছিদ্রের মাধ্যমে ক্যামেরা দিয়ে সম্পূর্ণ পিত্তথলি ও পাথর অপসারণ।\n2. **সুবিধাসমূহ:** কোনো বড় কাটাছেঁড়া বা দাগ থাকে না, রক্তক্ষরণ নেই বললেই চলে, ২৪ ঘণ্টার মধ্যে বাড়ি ফেরা যায়।\n3. **নিরাপত্তা:** এইচডি ল্যাপারোস্কপির মাধ্যমে সম্পূর্ণ সুরক্ষিত ও দ্রুত স্বাভাবিক জীবনে প্রত্যাবর্তন।',
    actions: [
      { label: 'পিত্তথলি বিভাগ দেখুন', url: '/conditions-treatments/gallbladder', type: 'link' as const },
      { label: 'ল্যাপারোস্কপি সিরিয়াল নিন', url: 'tel:01750529252', type: 'call' as const },
    ],
  },
  {
    id: 'hernia_appendix',
    label_en: 'Hernia & Appendicitis',
    label_bn: 'হার্নিয়া ও অ্যাপেন্ডিসাইটিস',
    icon: ShieldCheck,
    answer_en:
      'Expert laparoscopic abdominal care:\n\n1. **Hernia Mesh Repair:** Inguinal, Umbilical, and Incisional hernias repaired using tension-free medical polypropylene mesh (TAPP/TEP keyhole).\n2. **Appendicitis:** Acute emergency diagnosis and emergency laparoscopic appendectomy before rupture/perforation.\n3. **Zero Tension:** Ensures minimal recurrence rate and quick return to regular physical activity.',
    answer_bn:
      'হার্নিয়া ও জরুরি অ্যাপেন্ডিসাইটিসের আধুনিক চিকিৎসা:\n\n1. **ল্যাপারোস্কপিক হার্নিয়া মেশ রিপেয়ার:** কুঁচকি, নাভি বা পুরনো অপারেশনের দাগের হার্নিয়ায় টেনশন-ফ্রি আধুনিক মেশ প্রতিস্থাপন।\n2. **অ্যাপেন্ডিসাইটিস:** তীব্র পেটের ব্যথা ও প্রদাহে জরুরি ল্যাপারোস্কপিক অ্যাপেন্ডিসেক্টমি (ফেটে যাওয়ার ঝুঁকি এড়াতে তাৎক্ষণিক চিকিৎসা)।\n3. **কার্যকারিতা:** পুনরায় হার্নিয়া হওয়ার ঝুঁকি সর্বনিম্ন এবং রোগী দ্রুত কর্মক্ষম হতে পারেন।',
    actions: [
      { label: 'হার্নিয়া চিকিৎসা বিস্তারিত', url: '/conditions-treatments/hernia', type: 'link' as const },
      { label: 'জরুরি সার্জারি সিরিয়াল', url: 'tel:01750529252', type: 'call' as const },
    ],
  },
  {
    id: 'breast_care',
    label_en: 'Breast Lump & Tumor Care',
    label_bn: 'স্তনের চাকা ও টিউমার স্ক্রিনিং',
    icon: HeartPulse,
    answer_en:
      'Confidential and compassionate breast care:\n\n1. **Breast Lump Screening:** Differentiating benign fibroadenoma, cysts, and suspicious lesions.\n2. **Cosmetic Incision Surgery:** Removal of benign breast tumors through aesthetic, hidden circumareolar lines to preserve breast appearance.\n3. **Early Cancer Screening:** Clinical triple assessment, ultrasound correlation, and biopsy guidance.',
    answer_bn:
      'স্তনের চাকা, টিউমার ও ক্যান্সার স্ক্রিনিং সেবা:\n\n1. **স্তনের চাকা পরীক্ষা:** সব চাকা ক্যান্সার নয়; অধিকাংশ ক্ষেত্রে ফাইব্রোএডেনোমা বা নিরীহ সিস্ট হয়ে থাকে।\n2. **কসমেটিক মাইক্রো-সার্জারি:** দাগবিহীন সূক্ষ্ম কসমেটিক ইনসিশনের মাধ্যমে স্তনের সৌন্দর্য অক্ষুণ্ণ রেখে টিউমার অপসারণ।\n3. **ক্যান্সার স্ক্রিনিং:** প্রাথমিক অবস্থায় স্ক্রিনিং ও নির্ভরযোগ্য বায়োপসি পরামর্শ।',
    actions: [
      { label: 'ব্রেস্ট কেয়ার বিস্তারিত', url: '/conditions-treatments/breast', type: 'link' as const },
      { label: 'পরামর্শ বুকিং', url: 'tel:01750529252', type: 'call' as const },
    ],
  },
  {
    id: 'surgery_cost',
    label_en: 'Surgery Cost & Packages',
    label_bn: 'অপারেশন খরচ ও প্যাকেজ',
    icon: CreditCard,
    answer_en:
      'Transparent and patient-friendly surgical packages:\n\n1. **Affordable Hospital Packages:** Surgery costs vary based on hospital chosen (Anwer Memorial, Sherpur vs Delta Health Care, Mymensingh) and bed category (Cabin/General).\n2. **Included in Package:** Surgeon fees, Assistant fees, OT charges, Anesthesia, and routine post-op rounds.\n3. **Exact Estimate:** Please share your investigation reports or call our coordinator desk directly for an exact quote.',
    answer_bn:
      'স্বচ্ছ ও সাশ্রয়ী অপারেশন প্যাকেজ সংক্রান্ত তথ্য:\n\n1. **হাসপাতাল ভিত্তিক প্যাকেজ:** রোগী আনোয়ার মেমোরিয়াল হাসপাতাল (শেরপুর) নাকি ডেল্টা হেলথ কেয়ার (ময়মনসিংহ) এবং কেবিন বা সাধারণ ওয়ার্ড নিচ্ছেন তার ওপর ভিত্তি করে প্যাকেজ নির্ধারিত হয়।\n2. **প্যাকেজে অন্তর্ভুক্ত:** সার্জন ফি, এনেস্থেশিয়া, ওটি চার্জ এবং পোস্ট-অপারেটিভ সেবা। কোনো লুকানো চার্জ নেই।\n3. **নির্দিষ্ট খরচের হিসাব:** সরাসরি খরচের আনুমানিক হিসাব জানতে রোগীর রিপোর্ট সহ আমাদের কোঅর্ডিনেটরের সাথে কথা বলুন।',
    actions: [
      { label: 'খরচ জানতে কল করুন', url: 'tel:01750529252', type: 'call' as const },
      { label: 'হোয়াটসঅ্যাপে রিপোর্ট পাঠান', url: 'https://wa.me/8801670879100', type: 'link' as const },
    ],
  },
  {
    id: 'visiting_fee',
    label_en: 'Consultation Fee & Policy',
    label_bn: 'পরামর্শ ফি ও চেম্বার নিয়ম',
    icon: HelpCircle,
    answer_en:
      'Chamber consultation fees & policy:\n\n1. **First Consultation:** Consultation fees adhere to standard hospital policies at Anwer Memorial Hospital & Delta Health Care.\n2. **Follow-up Policy:** Report review or follow-up consultations within the specified hospital window enjoy reduced follow-up rates.\n3. **What to Bring:** Please bring all prior medical records, ultrasound, endoscopy, and blood reports during your visit.',
    answer_bn:
      'চেম্বারে পরামর্শ ফি ও নিয়মাবলী:\n\n1. **প্রথম ভিজিট ফি:** হাসপাতাল নীতিমালা অনুযায়ী নির্ধারিত ও যুক্তিসঙ্গত কনসাল্টেশন ফি প্রযোজ্য।\n2. **রিপোর্ট দেখানো ও ফলো-আপ:** নির্ধারিত দিনের মধ্যে পুরনো প্রেসক্রিপশন সহ রিপোর্ট দেখানোর ক্ষেত্রে বিশেষ ফলো-আপ সুবিধা রয়েছে।\n3. **সাথে কী আনবেন:** পূর্বের প্রেসক্রিপশন, আল্ট্রাসনোগ্রাম, রক্ত ও যেকোনো টেস্টের ফাইল সাথে নিয়ে আসবেন।',
    actions: [
      { label: 'সিরিয়াল নম্বর (01750529252)', url: 'tel:01750529252', type: 'call' as const },
    ],
  },
  {
    id: 'emergency',
    label_en: 'Emergency & Hotline',
    label_bn: 'জরুরি হটলাইন ও যোগাযোগ',
    icon: Phone,
    answer_en:
      "For emergency consults or acute surgical pain, call Dr. Kollol's desk directly:\n- **Serial Hotline:** 01750-529252\n- **Direct Doctor Desk:** 01670-879100\n- **Chamber Coordinator:** 01671-869026\n\nFor critical life-threatening conditions, please visit the **MMCH Emergency Room** or dial **999** immediately.",
    answer_bn:
      'জরুরি তথ্য ও যোগাযোগের প্রধান নম্বরসমূহ:\n- **সিরিয়াল হটলাইন:** 01750529252\n- **সরাসরি কথা বলুন:** 01670879100\n- **চেম্বার সহকারী:** 01671-869026\n\nআশঙ্কাজনক উপসর্গের ক্ষেত্রে অবিলম্বে **ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH) ইমার্জেন্সিতে** যান অথবা **৯৯৯**-এ কল করুন।',
    actions: [
      { label: 'সরাসরি কল (01670879100)', url: 'tel:01670879100', type: 'call' as const },
      { label: 'হোয়াটসঅ্যাপ জরুরি চ্যাট', url: 'https://wa.me/8801670879100', type: 'link' as const },
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

  // Scroll controls for instant FAQ chips
  const chipsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkScroll = useCallback(() => {
    if (chipsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  }, []);

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      chipsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeText = isBn
      ? 'আসসালামু আলাইকুম। আমি **ডাঃ ফাহিম ফয়সাল কল্লোলের** ডিজিটাল ক্লিনিক্যাল অ্যাসিস্ট্যান্ট।\n\nচেম্বারের স্থান, সময়সূচী, সিরিয়াল বুকিং বা যেকোনো সার্জারি চিকিৎসার তথ্যের জন্য নিচে বিষয় বেছে নিন অথবা সরাসরি টাইপ করুন।'
      : "Hello! I am **Dr. Fahim Foysal Kollol's** digital clinical assistant.\n\nHow may I assist you regarding chamber locations, visiting hours, serial booking, or surgical procedures today?";

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

  // Focus input when opened and update scroll state
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setHasInteracted(true);
      setTimeout(() => {
        inputRef.current?.focus();
        checkScroll();
      }, 200);
    }
  }, [isOpen, checkScroll]);

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
          ? 'ধন্যবাদ। সরাসরি সিরিয়াল বা তথ্যের জন্য কল করুন: **01750529252**।'
          : 'Thank you. For direct assistance, please call: **01750529252**.');

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
            ? 'নেটওয়ার্ক সংযোগে সমস্যা হচ্ছে। জরুরি তথ্যে সরাসরি সিরিয়াল নম্বরে কল করুন: **01750529252**।'
            : 'Connection timeout. Please contact Dr. Kollol directly at: **01750529252**.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    const welcomeText = isBn
      ? 'আসসালামু আলাইকুম। আমি **ডাঃ ফাহিম ফয়সাল কল্লোলের** ডিজিটাল ক্লিনিক্যাল অ্যাসিস্ট্যান্ট। কীভাবে সহায়তা করতে পারি?'
      : "Hello! I am **Dr. Fahim Foysal Kollol's** digital assistant. How may I help you today?";

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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
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
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white rounded-br-xs'
                      : 'bg-white text-[#062F31] border border-gray-100/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <FormattedMessageText text={msg.text} isUser={msg.sender === 'user'} />

                  {/* Message Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
                      {msg.actions.map((act, aIdx) => (
                        <a
                          key={aIdx}
                          href={act.url || '#'}
                          target={act.url?.startsWith('http') ? '_blank' : '_self'}
                          rel={act.url?.startsWith('http') ? 'noreferrer' : undefined}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF7F6] text-[#0B6E73] hover:bg-[#0B6E73] hover:text-white font-bold text-[10px] transition-colors border border-[#0B6E73]/20 shadow-2xs"
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
                  {isBn ? 'ডাঃ কল্লোল এআই উত্তর প্রস্তুত করছে...' : 'Dr. Kollol AI is preparing response...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ---------------------------------------------------------------------------------- */}
          {/* QUICK ACTION SUGGESTION CHIPS (Zero Latency + 9 Instant Topics + Left/Right Scroll) */}
          {/* ---------------------------------------------------------------------------------- */}
          <div className="p-2.5 px-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-[#3F6668] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2BB3B1]" />
                <span>{isBn ? 'ইনস্ট্যান্ট প্রশ্নোত্তর (ডানে-বামে স্ক্রোল করুন):' : 'Instant FAQs (Scroll left/right):'}</span>
              </p>

              {/* Navigation Chevrons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollChips('left')}
                  disabled={!canScrollLeft}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? 'bg-[#EEF7F6] text-[#0B6E73] hover:bg-[#0B6E73] hover:text-white cursor-pointer shadow-2xs'
                      : 'text-gray-300 opacity-40 cursor-default'
                  }`}
                  title={isBn ? 'বামে স্ক্রোল করুন' : 'Scroll left'}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollChips('right')}
                  disabled={!canScrollRight}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    canScrollRight
                      ? 'bg-[#EEF7F6] text-[#0B6E73] hover:bg-[#0B6E73] hover:text-white cursor-pointer shadow-2xs'
                      : 'text-gray-300 opacity-40 cursor-default'
                  }`}
                  title={isBn ? 'ডানে স্ক্রোল করুন' : 'Scroll right'}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Track with sleek custom scrollbar */}
            <div
              ref={chipsScrollRef}
              onScroll={checkScroll}
              className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scroll-smooth custom-chat-scroll"
            >
              {QUICK_CHIPS.map((chip) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#EEF7F6] text-[#062F31] hover:bg-[#0B6E73] hover:text-white text-[10.5px] font-semibold transition-all border border-[#0B6E73]/15 whitespace-nowrap shrink-0 shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer group"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-[#0B6E73] group-hover:text-emerald-200 transition-colors shrink-0" />
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
