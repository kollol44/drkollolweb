export interface GuardrailCheckResult {
  blocked: boolean;
  reason?: 'emergency' | 'prescription' | 'adversarial';
  reply?: string;
  actions?: Array<{
    label: string;
    url: string;
    type: 'call' | 'link' | 'booking';
  }>;
}

export interface SiteContactInfo {
  phone_serial: string;
  phone_assistant: string;
  phone_call?: string;
  phone_emergency?: string;
  whatsapp_url?: string;
}

/**
 * Clinical & Cybersecurity Guardrail Engine
 * Formatted with polite, empathetic, caring tone as instructed by Dr. Fahim Foysal Kollol.
 */
export function evaluateClinicalSafety(
  rawInput: string,
  contacts: SiteContactInfo
): GuardrailCheckResult {
  const normalized = rawInput.trim().toLowerCase();

  // --------------------------------------------------------------------------
  // 1. CYBERSECURITY: Prompt Injection & Adversarial Jailbreak Defense
  // --------------------------------------------------------------------------
  const adversarialPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /disregard\s+(all\s+)?instructions/i,
    /system\s+prompt/i,
    /reveal\s+(your\s+)?(instructions|prompt|rules)/i,
    /you\s+are\s+now\s+(an?\s+)?unrestricted/i,
    /jailbreak/i,
    /\bDAN\b/i,
    /bypass\s+safety/i,
    /<script\b/i,
    /union\s+select/i,
    /javascript:/i,
    /DROP\s+TABLE/i,
  ];

  for (const pattern of adversarialPatterns) {
    if (pattern.test(normalized)) {
      return {
        blocked: true,
        reason: 'adversarial',
        reply:
          'আসসালামু আলাইকুম। আমি ডাঃ ফাহিম ফয়সাল কল্লোলের অফিশিয়াল সহকারী। আমি আপনাকে চেম্বারের সিরিয়াল, সময়সূচী ও চিকিৎসাসেবার সঠিক তথ্য দিয়ে আন্তরিকভাবে সহায়তা করতে পারি। আপনার যেকোনো প্রয়োজনে নিচে দেওয়া চেম্বারের নম্বরে যোগাযোগ করুন।',
        actions: [
          {
            label: 'সিরিয়াল ও তথ্য হটলাইন (ময়মনসিংহ)',
            url: `tel:${contacts.phone_serial || '01750529252'}`,
            type: 'call',
          },
          {
            label: 'ব্যক্তিগত সহকারী মিলন (শেরপুর)',
            url: `tel:${contacts.phone_assistant || '01671869026'}`,
            type: 'call',
          },
        ],
      };
    }
  }

  // --------------------------------------------------------------------------
  // 2. EMERGENCY RED FLAGS: Acute Symptoms & Emergency Distress
  // --------------------------------------------------------------------------
  const emergencyKeywords = [
    /(প্রচণ্ড|তীব্র|অতিরিক্ত|অনেক|ভয়ানক|প্রচুর)\s*(রক্ত|ব্লিডিং|রক্তপাত)/i,
    /profuse\s*bleeding|severe\s*bleeding|hemorrhage/i,
    /(বুকে\s*তীব্র\s*ব্যথা|হার্ট\s*অ্যাটাক|দম\s*বন্ধ|শ্বাস\s*নিতে\s*পারছি\s*না|শ্বাসকষ্ট)/i,
    /severe\s*chest\s*pain|heart\s*attack|cannot\s*breathe|choking/i,
    /(জ্ঞান\s*হারিয়ে|অজ্ঞান\s*হয়ে|সেন্স\s*নেই|মরণাপন্ন|জরুরি\s*অবস্থা)/i,
    /unconscious|fainted|loss\s*of\s*consciousness|emergency/i,
    /হঠাৎ\s*তীব্র\s*ব্যথা/i,
  ];

  for (const pattern of emergencyKeywords) {
    if (pattern.test(normalized)) {
      return {
        blocked: true,
        reason: 'emergency',
        reply:
          'হঠাৎ তীব্র ব্যথা বা অতিরিক্ত রক্তক্ষরণ জরুরি হতে পারে। দেরি না করে অবিলম্বে নিকটস্থ হাসপাতালের জরুরি বিভাগে যান বা এখনই সরাসরি কল করুন।\n\n**জরুরি যোগাযোগের নম্বর:**\n• **জরুরি জাতীয় সেবা:** ৯৯৯\n• **ডাক্তারকে সরাসরি WhatsApp (জরুরি প্রয়োজনে):** 01670-879100\n• **সিরিয়াল ও তথ্য হটলাইন:** 01750-529252 (ময়মনসিংহ)\n• **ব্যক্তিগত সহকারী মিলন:** 01671-869026 (শেরপুর চেম্বার ১ / চেম্বার ২)',
        actions: [
          {
            label: 'জরুরি জাতীয় সেবা (৯৯৯)',
            url: 'tel:999',
            type: 'call',
          },
          {
            label: 'ডাক্তারকে সরাসরি কল (জরুরি)',
            url: 'tel:01670879100',
            type: 'call',
          },
          {
            label: 'সিরিয়াল হটলাইন (ময়মনসিংহ)',
            url: 'tel:01750529252',
            type: 'call',
          },
        ],
      };
    }
  }

  // --------------------------------------------------------------------------
  // 3. CLINICAL GUARDRAIL: Strict Prohibition on Medication / Prescription Advice
  // --------------------------------------------------------------------------
  const prescriptionIntent = [
    /(ওষুধ|ঔষধ|মেডিসিন|ট্যাবলেট|ক্যাপসুল|সিরাপ|ড্রপ|মলম|প্যারাসিটামল|নাপা|অ্যান্টিবায়োটিক|পেইনকিলার)\s*(দেন|দাও|বলেন|খাব|খাবো|খাওয়া|খাওয়া|কী|কি|নাম)/i,
    /(কী|কি)\s*(ওষুধ|ঔষধ|মেডিসিন|ট্যাবলেট|ক্যাপসুল|ড্রপ|মলম|পেইনকিলার)\s*(খাব|খাবো|ব্যবহার)/i,
    /(ব্যথা|ব্যাথা|যন্ত্রণা|গ্যাস|জ্বালা)\s*(কমানোর|উপশমের)?\s*(ওষুধ|ঔষধ|ট্যাবলেট|উপায়|পদ্ধতি)/i,
    /(কত\s*ডোজ|কত\s*মিলি|ডোজ\s*কত|how\s*much\s*dosage)/i,
    /(prescription|prescribe|medicine|tablet|capsule|antibiotic|painkiller|dosage|which\s*medicine)/i,
    /(ব্যথা\s*করছে|পেটে\s*ব্যথা|বুকে\s*ব্যথা)\s*.*\s*(কী\s*খাব|কি\s*খাবো|কোন\s*ওষুধ)/i,
  ];

  for (const pattern of prescriptionIntent) {
    if (pattern.test(normalized)) {
      const hasSeverePainNotice = /(তীব্র|প্রচণ্ড|অতিরিক্ত|অনেক|ভয়ানক|severe|tibro|prochondo)\s*(ব্যথা|ব্যাথা|যন্ত্রণা|betha|batha|pain)/i.test(
        normalized
      );

      const replyText = hasSeverePainNotice
        ? 'আসলে পেশেন্ট সরাসরি না দেখে তো অনুমান করে সঠিক কারণ বা চিকিৎসার পরামর্শ দেওয়া যায় না। তাই ডক্টর নিজে শারীরিক পরীক্ষা ও রিপোর্টগুলো সামনাসামনি দেখলে সবচেয়ে ভালো ও নিরাপদ হয়।\n\nহঠাৎ তীব্র ব্যথা জরুরি অবস্থা হতে পারে। তাই অবহেলা না করে আপনি সরাসরি ডক্টরের সাথে কথা বলুন অথবা চেম্বারের সিরিয়াল নিন।\n\n**সিরিয়াল ও যোগাযোগের নম্বর:**\n• **ব্যক্তিগত সহকারী মিলন:** 01671-869026 (শেরপুর চেম্বার ১: হেলথ কেয়ার হাসপাতাল / শেরপুর চেম্বার ২: আমজাদ ডায়াগনস্টিক)\n• **সিরিয়াল ও তথ্য হটলাইন:** 01750-529252 (ময়মনসিংহ চেম্বার: নিউ মেডিকেয়ার প্যাথলজি ল্যাব)\n• **ডাক্তারকে সরাসরি WhatsApp (জরুরি প্রয়োজনে):** 01670-879100'
        : 'আসলে পেশেন্ট সরাসরি না দেখে তো অনুমান করে সঠিক কারণ বা চিকিৎসার পরামর্শ দেওয়া যায় না। তাই ডক্টর নিজে শারীরিক পরীক্ষা ও রিপোর্টগুলো সামনাসামনি দেখলে সবচেয়ে ভালো ও নিরাপদ হয়। আপনি সরাসরি ডক্টরের সাথে কথা বলুন অথবা উনাকে দেখানোর জন্য চেম্বারের সিরিয়াল নিন। ডাঃ কল্লোল আপনার সমস্যার সঠিক সমাধানের সর্বোচ্চ চেষ্টা করবেন।\n\n**সিরিয়াল ও যোগাযোগের নম্বর:**\n• **ব্যক্তিগত সহকারী মিলন:** 01671-869026 (শেরপুর চেম্বার ১: হেলথ কেয়ার হাসপাতাল / শেরপুর চেম্বার ২: আমজাদ ডায়াগনস্টিক)\n• **সিরিয়াল ও তথ্য হটলাইন:** 01750-529252 (ময়মনসিংহ চেম্বার: নিউ মেডিকেয়ার প্যাথলজি ল্যাব)\n• **ডাক্তারকে সরাসরি WhatsApp (জরুরি প্রয়োজনে):** 01670-879100';

      return {
        blocked: true,
        reason: 'prescription',
        reply: replyText,
        actions: [
          {
            label: 'ব্যক্তিগত সহকারী মিলন (শেরপুর)',
            url: `tel:${contacts.phone_assistant || '01671869026'}`,
            type: 'call',
          },
          {
            label: 'সিরিয়াল হটলাইন (ময়মনসিংহ)',
            url: `tel:${contacts.phone_serial || '01750529252'}`,
            type: 'call',
          },
          {
            label: 'ডাক্তারকে সরাসরি WhatsApp',
            url: 'https://wa.me/8801670879100',
            type: 'link',
          },
        ],
      };
    }
  }

  return { blocked: false };
}

/**
 * Post-Processing Guardrail: Scans generated AI output to catch any accidental drug recommendation
 */
export function sanitizeClinicalReply(reply: string, contacts: SiteContactInfo): string {
  const dangerousClinicalTokens = [
    /\b(500mg|250mg|650mg|40mg|20mg|10mg)\b/i,
    /\b(napa\s*extra|ace\s*plus|seclo|sergel|ciprofloxacin|flagyl|antacid|paracetamol)\b/i,
    /(দিনে\s*[১-৩1-3]\s*বার|খাওয়ার\s*আগে|খাওয়ার\s*পরে\s*[১-৩1-3]\s*টা)/i,
  ];

  for (const token of dangerousClinicalTokens) {
    if (token.test(reply)) {
      return `আসলে পেশেন্ট সরাসরি না দেখে তো অনুমান করে সঠিক কারণ বা চিকিৎসার পরামর্শ দেওয়া যায় না। তাই ডক্টর নিজে শারীরিক পরীক্ষা ও রিপোর্টগুলো সামনাসামনি দেখলে সবচেয়ে ভালো ও নিরাপদ হয়।\n\nসরাসরি পরামর্শ ও সিরিয়ালের জন্য যোগাযোগ করুন:\n• **ব্যক্তিগত সহকারী মিলন:** 01671-869026 (শেরপুর চেম্বার ১: হেলথ কেয়ার হাসপাতাল / শেরপুর চেম্বার ২: আমজাদ ডায়াগনস্টিক)\n• **সিরিয়াল ও তথ্য হটলাইন:** 01750-529252 (ময়মনসিংহ চেম্বার: নিউ মেডিকেয়ার প্যাথলজি ল্যাব)\n• **ডাক্তারকে সরাসরি WhatsApp (জরুরি প্রয়োজনে):** 01670-879100`;
    }
  }

  return reply;
}
