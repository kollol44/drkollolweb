import {
  Category,
  Condition,
  SiteSettings,
  HeroSection,
  SurgeonProfile,
  SerialStep,
  Chamber,
  Review,
  FAQ,
  BlogPost,
} from '@/types/database';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'global',
  brand_name_en: 'Dr. Kollol',
  brand_name_bn: 'ডাঃ কল্লোল',
  phone_serial: '01750529252',
  phone_call: '01670879100',
  phone_assistant: '01671-869026',
  whatsapp_url: 'https://wa.me/8801670879100',
  email: 'kollolsomc44@gmail.com',
  bmdc_reg: 'A-61041',
  notice_banner_active: false,
  notice_banner_en: '',
  notice_banner_bn: '',
  disclaimer_en: 'Information on this site is not a substitute for professional medical consultation or examination.',
  disclaimer_bn: 'এই সাইটের তথ্য কোনোভাবেই সরাসরি ডাক্তার দেখানোর বা চিকিৎসার বিকল্প নয়।',
};

export const DEFAULT_HERO_SECTION: HeroSection = {
  id: 'hero_main',
  h1_en: 'Every incision has a reason.',
  h1_bn: 'প্রতিটা ইনসিশনের পেছনে একটা কারণ আছে।',
  h2_en: 'And an <em>expert surgeon</em> knows it all.',
  h2_bn: 'আর একজন <em>অভিজ্ঞ সার্জনই</em> সেই কারণ জানেন।',
  meet_cta_en: 'Meet your surgeon',
  meet_cta_bn: 'পরিচিত হন আপনার সার্জনের সাথে',
  scroll_cue_en: 'Scroll to explore',
  scroll_cue_bn: 'নিচে স্ক্রল করুন',
};

export const DEFAULT_SURGEON_PROFILE: SurgeonProfile = {
  id: 'kollol',
  name_en: 'Dr. Fahim Foysal Kollol',
  name_bn: 'ডাঃ ফাহিম ফয়সাল কল্লোল',
  intro_word_en: 'Meet Your Surgeon',
  intro_word_bn: 'ইনিই আপনার সার্জন',
  role_en: 'General, Laparoscopic, Breast & Colorectal Surgeon',
  role_bn: 'জেনারেল, ল্যাপারোস্কপিক, ব্রেস্ট ও কলোরেক্টাল সার্জন',
  post_en: 'Assistant Professor of Surgery, Mymensingh Medical College Hospital · BMDC Reg. A-61041',
  post_bn: 'সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল · বিএমডিসি রেজি: এ-৬১০৪১',
  chambers_summary_en: '<strong>Sherpur</strong> every Thursday & Friday · <strong>Mymensingh</strong> Saturday to Tuesday',
  chambers_summary_bn: '<strong>শেরপুরে</strong> প্রতি বৃহস্পতি ও শুক্রবার · <strong>ময়মনসিংহে</strong> শনি থেকে মঙ্গলবার',
  degrees_badges: ['MBBS', 'BCS (Health)', 'FCPS (Surgery)', 'MACS (USA)'],
  stats: [
    { num_en: '10,000+', num_bn: '১০,০০০+', label_en: 'Major & minor surgeries', label_bn: 'বড়-ছোট অপারেশন' },
    { num_en: '300+', num_bn: '৩০০+', label_en: 'Laparoscopic (keyhole) surgeries', label_bn: 'ল্যাপারোস্কপিক অপারেশন' },
    { num_en: '250+', num_bn: '২৫০+', label_en: 'Fistula operations', label_bn: 'ফিস্টুলা অপারেশন' },
    { num_en: '100+', num_bn: '১০০+', label_en: 'Longo (stapler) piles surgeries', label_bn: 'লংগো পদ্ধতিতে পাইলস অপারেশন' },
    { num_en: '10+ yrs', num_bn: '১০+ বছর', label_en: 'In practice since 2015', label_bn: '২০১৫ থেকে চিকিৎসা দিচ্ছেন' },
    { num_en: '11', num_bn: '১১', label_en: 'Research publications', label_bn: 'গবেষণা প্রকাশনা' },
  ],
  degrees_ticker: [
    { en: 'MBBS', bn: 'এমবিবিএস' },
    { en: 'BCS (Health) · 33rd BCS', bn: 'বিসিএস (স্বাস্থ্য) · ৩৩তম বিসিএস' },
    { en: 'FCPS (Surgery)', bn: 'এফসিপিএস (সার্জারি)' },
    { en: 'MACS (USA)', bn: 'এমএসিএস (আমেরিকা)' },
    { en: 'Life Member, SOSB', bn: 'আজীবন সদস্য, এসওএসবি' },
    { en: 'Life Member, SELSB', bn: 'আজীবন সদস্য, এসইএলএসবি' },
    { en: 'Assistant Professor of Surgery, MMCH', bn: 'সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ' },
    { en: 'Laparoscopy Training, SELSB', bn: 'ল্যাপারোস্কপি ট্রেনিং, এসইএলএসবি' },
  ],
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    slug: 'colorectal',
    sort_order: 1,
    name_en: 'Colorectal & Anal',
    name_bn: 'মলদ্বার ও বৃহদন্ত্র',
    desc_en: 'Piles, fissure, fistula and other problems of the back passage.',
    desc_bn: 'পাইলস, ফিশার, ফিস্টুলা ও মলদ্বারের অন্যান্য সমস্যা।',
  },
  {
    slug: 'gallbladder',
    sort_order: 2,
    name_en: 'Gallbladder & Bile Duct',
    name_bn: 'পিত্তথলি ও পিত্তনালি',
    desc_en: 'Stones in the gallbladder and bile duct — mostly treated by keyhole surgery.',
    desc_bn: 'পিত্তথলি ও পিত্তনালির পাথর — বেশিরভাগ ক্ষেত্রে ছোট ছিদ্রে অপারেশন।',
  },
  {
    slug: 'abdomen',
    sort_order: 3,
    name_en: 'Abdomen & Pelvis',
    name_bn: 'পেট ও তলপেট',
    desc_en: 'Appendicitis, hernia and other belly problems.',
    desc_bn: 'অ্যাপেন্ডিসাইটিস, হার্নিয়া ও পেটের অন্যান্য সমস্যা।',
  },
  {
    slug: 'breast',
    sort_order: 4,
    name_en: 'Breast',
    name_bn: 'স্তন',
    desc_en: 'Lumps, pain, discharge and breast cancer — for women and men.',
    desc_bn: 'চাকা, ব্যথা, রস পড়া ও স্তন ক্যান্সার — নারী ও পুরুষ দুজনের জন্যই।',
  },
  {
    slug: 'urinary',
    sort_order: 5,
    name_en: 'Kidney & Urinary',
    name_bn: 'কিডনি ও মূত্রতন্ত্র',
    desc_en: 'Stones in the kidney, urine tube and bladder.',
    desc_bn: 'কিডনি, মূত্রনালি ও মূত্রথলির পাথর।',
  },
  {
    slug: 'testis-veins',
    sort_order: 6,
    name_en: 'Testis & Veins',
    name_bn: 'অণ্ডকোষ ও শিরা',
    desc_en: 'Testicular swelling, varicocele and varicose veins.',
    desc_bn: 'অণ্ডকোষ ফোলা, ভেরিকোসিল ও ভেরিকোস ভেইন।',
  },
  {
    slug: 'skin',
    sort_order: 7,
    name_en: 'Skin & Soft Tissue',
    name_bn: 'চামড়া ও নরম টিস্যু',
    desc_en: 'Lumps, tumours and cysts anywhere under the skin.',
    desc_bn: 'শরীরের যেকোনো জায়গায় চামড়ার নিচে চাকা, টিউমার ও সিস্ট।',
  },
];

export const DEFAULT_CONDITIONS: Condition[] = [
  // 1. Colorectal
  {
    slug: 'piles',
    category_slug: 'colorectal',
    sort_order: 1,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 1,
    home_word_en: 'Piles',
    home_word_bn: 'পাইলস',
    name_en: 'Piles',
    name_bn: 'পাইলস',
    med_en: 'Haemorrhoids',
    med_bn: 'হেমোরয়েড',
    short_en: 'Bleeding or a lump at the back passage — treated with or without cutting.',
    short_bn: 'মলদ্বারে রক্ত যাওয়া বা গোটা বের হওয়া — কেটে বা না কেটে চিকিৎসা।',
    what_en: 'Piles are swollen blood vessels inside or around the back passage. They are very common and often come from constipation, straining or sitting for long hours.',
    what_bn: 'পাইলস হলো মলদ্বারের ভেতরে বা চারপাশের রক্তনালি ফুলে যাওয়া। এটা খুবই সাধারণ রোগ। কোষ্ঠকাঠিন্য, পায়খানায় চাপ দেওয়া বা অনেকক্ষণ বসে থাকা থেকে বেশি হয়।',
    symptoms_en: ['Bright red blood with stool', 'A lump that comes out during stool', 'Itching or discomfort', 'Feeling the bowel is not fully empty'],
    symptoms_bn: ['পায়খানার সাথে টাটকা লাল রক্ত', 'পায়খানার সময় গোটা বের হয়ে আসা', 'চুলকানি বা অস্বস্তি', 'পায়খানা পুরো পরিষ্কার না হওয়ার অনুভূতি'],
    treat_en: ['Early piles: diet, medicine and simple clinic treatment.', 'Advanced piles: modern Longo (stapler) surgery — less cutting, less pain, faster return home.', 'Open surgery when it suits you better.'],
    treat_bn: ['শুরুর দিকে: খাবার, ওষুধ ও সহজ চিকিৎসা।', 'জটিল হলে: আধুনিক লংগো (স্টেপলার) অপারেশন — কম কাটা, কম ব্যথা, দ্রুত বাড়ি ফেরা।', 'প্রয়োজনে সাধারণ অপারেশন।'],
    when_en: 'Bleeding with stool should never be ignored — get checked to rule out other causes.',
    when_bn: 'পায়খানার সাথে রক্ত গেলে কখনো অবহেলা করবেন না — অন্য কোনো রোগ আছে কিনা পরীক্ষা করিয়ে নিন।',
    stat_en: '100+ Longo (stapler) operations',
    stat_bn: '১০০+ লংগো (স্টেপলার) অপারেশন',
    image_url: '/img/conditions/piles.webp',
  },
  {
    slug: 'fistula',
    category_slug: 'colorectal',
    sort_order: 2,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 2,
    home_word_en: 'Fistula',
    home_word_bn: 'ফিস্টুলা',
    name_en: 'Fistula',
    name_bn: 'ফিস্টুলা',
    med_en: 'Fistula-in-ano',
    med_bn: 'ফিস্টুলা-ইন-অ্যানো',
    short_en: 'A small opening near the back passage with pus or discharge.',
    short_bn: 'মলদ্বারের পাশে ছোট মুখ দিয়ে পুঁজ বা রস পড়া।',
    what_en: 'A fistula is a thin tunnel between the inside of the back passage and the skin outside, usually after an abscess. It does not heal with medicine alone.',
    what_bn: 'ফিস্টুলা হলো মলদ্বারের ভেতর থেকে বাইরের চামড়া পর্যন্ত একটা সরু নালি, সাধারণত ফোড়া থেকে তৈরি হয়। শুধু ওষুধে এটা সারে না।',
    symptoms_en: ['Pus or fluid from a small hole near the anus', 'Boils or swelling near the anus that keep coming back', 'Pain and itching', 'Staining of underwear'],
    symptoms_bn: ['মলদ্বারের পাশের ছোট মুখ দিয়ে পুঁজ বা রস পড়া', 'বারবার মলদ্বারের পাশে ফোড়া বা ফোলা', 'ব্যথা ও চুলকানি', 'অন্তর্বাসে দাগ লাগা'],
    treat_en: ['Surgery is the main treatment.', 'Modern staged surgery to remove the whole tract and lower the chance of it coming back.'],
    treat_bn: ['মূল চিকিৎসা অপারেশন।', 'আধুনিক স্টেজ পদ্ধতিতে পুরো নালি সরিয়ে ফেলা, যাতে আবার ফিরে আসার সম্ভাবনা কমে।'],
    when_en: 'If a boil near the anus keeps coming back, get checked — it may be a fistula.',
    when_bn: 'মলদ্বারের পাশে ফোড়া বারবার হলে পরীক্ষা করান — এটা ফিস্টুলা হতে পারে।',
    stat_en: '250+ fistula operations',
    stat_bn: '২৫০+ ফিস্টুলা অপারেশন',
    image_url: '/img/conditions/fistula.webp',
  },
  {
    slug: 'fissure',
    category_slug: 'colorectal',
    sort_order: 3,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 3,
    home_word_en: 'Fissure',
    home_word_bn: 'ফিশার',
    name_en: 'Fissure',
    name_bn: 'ফিশার',
    med_en: 'Anal fissure',
    med_bn: 'এনাল ফিশার',
    short_en: 'Burning pain and bleeding while passing stool.',
    short_bn: 'পায়খানার সময় জ্বালাপোড়া ব্যথা ও রক্ত যাওয়া।',
    what_en: 'A fissure is a small tear in the skin of the back passage, usually from hard stool. It hurts a lot, especially during and after stool.',
    what_bn: 'ফিশার হলো মলদ্বারের চামড়ায় ছোট একটা ফাটল, সাধারণত শক্ত পায়খানা থেকে হয়। পায়খানার সময় ও পরে খুব ব্যথা হয়।',
    symptoms_en: ['Sharp or burning pain during stool', 'Pain that lasts for hours after', 'A little bright red blood', 'Fear of going to the toilet'],
    symptoms_bn: ['পায়খানার সময় তীব্র বা জ্বালাপোড়া ব্যথা', 'পায়খানার পরও অনেকক্ষণ ব্যথা থাকা', 'অল্প টাটকা রক্ত যাওয়া', 'পায়খানা করতে ভয় লাগা'],
    treat_en: ['Most fissures heal with medicine, ointment and softer stool.', 'Long-standing fissures: a small modern operation that relaxes the muscle so the tear can heal.'],
    treat_bn: ['বেশিরভাগ ফিশার ওষুধ, মলম ও নরম পায়খানায় সেরে যায়।', 'পুরনো ফিশারে: ছোট একটা আধুনিক অপারেশন, যাতে মাংসপেশি ঢিলা হয়ে ঘা শুকায়।'],
    when_en: 'If the pain continues for more than a few weeks, see a surgeon before it becomes chronic.',
    when_bn: 'কয়েক সপ্তাহের বেশি ব্যথা থাকলে পুরনো হয়ে যাওয়ার আগেই সার্জন দেখান।',
    image_url: '/img/conditions/fissure.webp',
  },
  {
    slug: 'rectal-cancer',
    category_slug: 'colorectal',
    sort_order: 4,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Anal & Rectal Cancer',
    name_bn: 'মলদ্বারের ক্যান্সার',
    med_en: 'Colorectal cancer',
    med_bn: 'রেক্টাল ও এনাল ক্যান্সার',
    short_en: 'Cancer of the back passage — diagnosis, treatment and surgery.',
    short_bn: 'মলদ্বারের ক্যান্সার — রোগ নির্ণয়, চিকিৎসা ও অপারেশন।',
    what_en: 'Cancer can grow in the last part of the bowel (rectum) or in the anus. Found early, it can often be treated well with surgery and other treatment.',
    what_bn: 'বৃহদন্ত্রের শেষ অংশে (রেক্টাম) বা মলদ্বারে ক্যান্সার হতে পারে। শুরুতে ধরা পড়লে অপারেশন ও অন্যান্য চিকিৎসায় অনেক ক্ষেত্রে ভালো ফল পাওয়া যায়।',
    symptoms_en: ['Blood or mucus with stool', 'Change in bowel habit for weeks', 'Feeling of incomplete emptying', 'Weight loss or tiredness'],
    symptoms_bn: ['পায়খানার সাথে রক্ত বা আম যাওয়া', 'কয়েক সপ্তাহ ধরে পায়খানার অভ্যাস বদলে যাওয়া', 'পায়খানা পুরো না হওয়ার অনুভূতি', 'ওজন কমে যাওয়া বা দুর্বলতা'],
    treat_en: ['Examination and tests to confirm the diagnosis and stage.', 'Surgery, with further treatment planned together with other specialists when needed.'],
    treat_bn: ['রোগ ও স্টেজ নিশ্চিত করতে পরীক্ষা।', 'অপারেশন, এবং প্রয়োজনে অন্য বিশেষজ্ঞদের সাথে মিলে পরবর্তী চিকিৎসার পরিকল্পনা।'],
    when_en: 'Bleeding with stool after age 40, or a change in bowel habit for more than 3 weeks — see a surgeon soon.',
    when_bn: '৪০ বছরের পর পায়খানার সাথে রক্ত, বা ৩ সপ্তাহের বেশি পায়খানার অভ্যাস বদলালে দ্রুত সার্জন দেখান।',
    image_url: '/img/conditions/rectal-cancer.webp',
  },
  {
    slug: 'anal-pain-bleeding',
    category_slug: 'colorectal',
    sort_order: 5,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Anal Pain & Bleeding',
    name_bn: 'মলদ্বারে ব্যথা ও রক্ত',
    med_en: 'Diagnosis',
    med_bn: 'রোগ নির্ণয়',
    short_en: 'Not sure why it hurts or bleeds? Get the right diagnosis first.',
    short_bn: 'ব্যথা বা রক্ত কেন যাচ্ছে বুঝতে পারছেন না? আগে সঠিক রোগ নির্ণয়।',
    what_en: 'Pain or bleeding from the back passage can come from piles, fissure, fistula, infection or, rarely, cancer. The right treatment starts with the right diagnosis.',
    what_bn: 'মলদ্বারে ব্যথা বা রক্ত যাওয়ার কারণ হতে পারে পাইলস, ফিশার, ফিস্টুলা, ইনফেকশন, আবার কখনো ক্যান্সারও। সঠিক চিকিৎসা শুরু হয় সঠিক রোগ নির্ণয় দিয়ে।',
    symptoms_en: ['Blood on tissue or in the toilet', 'Pain while sitting or passing stool', 'Swelling or a lump', 'Discharge or itching'],
    symptoms_bn: ['টিস্যু বা কমোডে রক্ত', 'বসতে বা পায়খানার সময় ব্যথা', 'ফোলা বা গোটা', 'রস পড়া বা চুলকানি'],
    treat_en: ['Careful examination in the chamber, with simple tests when needed.', 'A clear explanation of the cause and the treatment plan.'],
    treat_bn: ['চেম্বারে যত্ন নিয়ে পরীক্ষা, প্রয়োজনে সহজ কিছু টেস্ট।', 'রোগের কারণ আর চিকিৎসার পরিকল্পনা পরিষ্কার করে বুঝিয়ে বলা।'],
    when_en: 'Don’t feel shy — these problems are common, and an early check makes treatment simpler.',
    when_bn: 'লজ্জা পাবেন না — এই সমস্যা খুবই সাধারণ, আর আগে দেখালে চিকিৎসা সহজ হয়।',
    image_url: '/img/conditions/anal-pain-bleeding.webp',
  },

  // 2. Gallbladder
  {
    slug: 'gallstones',
    category_slug: 'gallbladder',
    sort_order: 6,
    is_laparoscopic: true,
    is_hidden: false,
    home_order: 4,
    home_word_en: 'Gallstones',
    home_word_bn: 'পিত্তথলির পাথর',
    name_en: 'Gallstones',
    name_bn: 'পিত্তথলির পাথর',
    med_en: 'Cholelithiasis',
    med_bn: 'গলস্টোন',
    short_en: 'Stones in the gallbladder — keyhole (laparoscopic) removal.',
    short_bn: 'পিত্তথলিতে পাথর — ছোট ছিদ্রে (ল্যাপারোস্কপিক) অপারেশন।',
    what_en: 'Gallstones are stones that form inside the gallbladder. Many people get pain after fatty food; some get serious infection or jaundice.',
    what_bn: 'পিত্তথলির ভেতরে পাথর জমাকে গলস্টোন বলে। অনেকের তৈলাক্ত খাবারের পর ব্যথা হয়; কারো কারো মারাত্মক ইনফেকশন বা জন্ডিস হতে পারে।',
    symptoms_en: ['Pain in the upper right or middle of the belly', 'Pain after oily or heavy food', 'Nausea, vomiting, gas', 'Fever or yellow eyes (needs urgent care)'],
    symptoms_bn: ['পেটের ডান দিকে ওপরে বা মাঝখানে ব্যথা', 'তৈলাক্ত বা ভারী খাবারের পর ব্যথা', 'বমি ভাব, বমি, গ্যাস', 'জ্বর বা চোখ হলুদ হওয়া (জরুরি)'],
    treat_en: ['Laparoscopic cholecystectomy: the gallbladder is removed through small keyhole cuts.', 'Less pain, small scars and a faster return to work than open surgery.'],
    treat_bn: ['ল্যাপারোস্কপিক কোলেসিস্টেক্টমি: ছোট কয়েকটা ছিদ্র দিয়ে পিত্তথলি অপসারণ।', 'খোলা অপারেশনের চেয়ে কম ব্যথা, ছোট দাগ, দ্রুত কাজে ফেরা।'],
    when_en: 'Repeated upper-belly pain after food, or yellow eyes with fever — see a surgeon.',
    when_bn: 'খাবারের পর বারবার পেটের ওপরের দিকে ব্যথা, বা জ্বরের সাথে চোখ হলুদ হলে সার্জন দেখান।',
    stat_en: '300+ laparoscopic gallbladder operations',
    stat_bn: '৩০০+ ল্যাপারোস্কপিক পিত্তথলি অপারেশন',
    image_url: '/img/conditions/gallstones.webp',
  },
  {
    slug: 'bile-duct-stones',
    category_slug: 'gallbladder',
    sort_order: 7,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Bile Duct Stones',
    name_bn: 'পিত্তনালির পাথর',
    med_en: 'CBD stones',
    med_bn: 'সিবিডি স্টোন',
    short_en: 'A stone stuck in the bile duct — can cause jaundice.',
    short_bn: 'পিত্তনালিতে পাথর আটকে যাওয়া — জন্ডিস হতে পারে।',
    what_en: 'Sometimes a stone moves from the gallbladder into the bile duct and blocks it. This can cause jaundice, fever and serious infection.',
    what_bn: 'অনেক সময় পিত্তথলি থেকে পাথর পিত্তনালিতে নেমে এসে আটকে যায়। এতে জন্ডিস, পেটে ব্যথা আর মারাত্মক ইনফেকশন হতে পারে।',
    symptoms_en: ['Yellow eyes and skin', 'Dark urine, pale stool', 'Pain in the upper right belly', 'Fever with shivering'],
    symptoms_bn: ['চোখ ও চামড়া হলুদ হয়ে যাওয়া', 'গাঢ় প্রস্রাব, ফ্যাকাশে পায়খানা', 'পেটের ডান দিকে ওপরের অংশে তীব্র ব্যথা', 'কাঁপুনী দিয়ে জ্বর'],
    treat_en: ['Tests to find the stone and the blockage.', 'Surgery or endoscopy to clear the duct and remove the gallbladder.'],
    treat_bn: ['পাথর ও ব্লকের অবস্থান নিশ্চিত করতে পরীক্ষা।', 'নালি পরিষ্কার করা ও পিত্তথলি অপসারণের সঠিক পরিকল্পনা।'],
    when_en: 'Jaundice with belly pain or fever needs urgent medical assessment.',
    when_bn: 'পেটে ব্যথার সাথে জন্ডিস বা জ্বর দেখা দিলে অবহেলা না করে জরুরি সার্জন দেখান।',
    image_url: '/img/conditions/bile-duct-stones.webp',
  },

  // 3. Abdomen
  {
    slug: 'appendicitis',
    category_slug: 'abdomen',
    sort_order: 8,
    is_laparoscopic: true,
    is_hidden: false,
    home_order: 5,
    home_word_en: 'Appendicitis',
    home_word_bn: 'অ্যাপেন্ডিসাইটিস',
    name_en: 'Appendicitis',
    name_bn: 'অ্যাপেন্ডিসাইটিস',
    med_en: 'Acute appendicitis',
    med_bn: 'তীব্র অ্যাপেন্ডিসাইটিস',
    short_en: 'Sudden lower right belly pain — urgent keyhole operation.',
    short_bn: 'হঠাৎ তলপেটের ডান পাশে তীব্র ব্যথা — দ্রুত ছোট ছিদ্রে অপারেশন।',
    what_en: 'Appendicitis is inflammation of the appendix. If not removed on time, it can burst and spread infection through the whole abdomen.',
    what_bn: 'অ্যাপেন্ডিক্সের তীব্র ইনফেকশনকে অ্যাপেন্ডিসাইটিস বলে। সময়মতো অপারেশন না করলে ফেটে গিয়ে পুরো পেটে ইনফেকশন ছড়িয়ে যেতে পারে।',
    symptoms_en: ['Pain starting around the navel and moving to the right lower belly', 'Nausea, loss of appetite, vomiting', 'Low fever', 'Pain increases with coughing or walking'],
    symptoms_bn: ['নাভির চারপাশ থেকে শুরু হয়ে তলপেটের ডান পাশে যাওয়া তীব্র ব্যথা', 'বমি ভাব বা বমি, খাবারে অরুচি', 'হালকা জ্বর', 'হাঁটলে বা কাশি দিলে ব্যথা বেড়ে যাওয়া'],
    treat_en: ['Emergency laparoscopic appendicectomy through miniature keyholes.', 'Quick recovery with minimal hospital stay.'],
    treat_bn: ['ছোট ছিদ্রে ল্যাপারোস্কপিক পদ্ধতিতে অ্যাপেন্ডিক্স অপসারণ।', 'অল্প ব্যথায় দ্রুত সুস্থতা ও বাড়ি ফেরা।'],
    when_en: 'Severe pain in the lower right abdomen requires immediate emergency surgical check.',
    when_bn: 'তলপেটের ডান পাশে তীব্র ব্যথা হলে ব্যথানাশক না খেয়ে দ্রুত সার্জনকে দেখান।',
    image_url: '/img/conditions/appendicitis.webp',
  },
  {
    slug: 'inguinal-hernia',
    category_slug: 'abdomen',
    sort_order: 9,
    is_laparoscopic: true,
    is_hidden: false,
    home_order: 6,
    home_word_en: 'Hernia',
    home_word_bn: 'হার্নিয়া',
    name_en: 'Inguinal Hernia',
    name_bn: 'কুঁচকির হার্নিয়া',
    med_en: 'Inguinal hernia',
    med_bn: 'ইনগুইনাল হার্নিয়া',
    short_en: 'Swelling in the groin — keyhole mesh repair (TAPP).',
    short_bn: 'কুঁচকি বা অণ্ডকোষের দিকে ফোলা — মেশ দিয়ে ল্যাপারোস্কপিক অপারেশন।',
    what_en: 'An inguinal hernia happens when intestine pushes through a weakness in the lower belly wall into the groin. It will not heal without surgery.',
    what_bn: 'পেটের মাংসপেশির দুর্বল অংশ দিয়ে নাড়িভুড়ি কুঁচকিতে নেমে এলে তাকে ইনগুইনাল হার্নিয়া বলে। ওষুধে এটি ভালো হয় না, অপারেশনে স্থায়ী সমাধান হয়।',
    symptoms_en: ['Bulge in the groin that grows when standing or coughing', 'Heaviness or dragging discomfort', 'Disappears when lying down in early stages', 'Sudden severe pain if trapped (emergency)'],
    symptoms_bn: ['দাঁড়ালে বা কাশি দিলে কুঁচকিতে ফোলা বেড়ে যাওয়া', 'ভারী লাগা বা অস্বস্তি', 'শুরুর দিকে শুয়ে থাকলে ভেতরে চলে যাওয়া', 'হঠাৎ আটকে গেলে তীব্র ব্যথা (জরুরি)'],
    treat_en: ['Laparoscopic TAPP mesh repair with tiny scars.', 'High-strength mesh placed inside the abdominal wall to stop recurrence.'],
    treat_bn: ['ল্যাপারোস্কপিক মেশ রিপেয়ার (TAPP) — খুব ছোট ছিদ্রে টেকসই মেশ স্থাপন।', 'দ্রুত কাজে ফেরা ও পুনরায় হওয়ার ঝুঁকি সর্বনিম্ন।'],
    when_en: 'If a hernia suddenly becomes hard, extremely painful, or will not go back in, seek emergency care.',
    when_bn: 'হার্নিয়ার ফোলা হঠাৎ শক্ত ও তীব্র ব্যথাদায়ক হলে জরুরি ভিত্তিতে হাসপাতালে যান।',
    image_url: '/img/conditions/inguinal-hernia.webp',
  },
  {
    slug: 'umbilical-hernia',
    category_slug: 'abdomen',
    sort_order: 10,
    is_laparoscopic: true,
    is_hidden: false,
    name_en: 'Umbilical Hernia',
    name_bn: 'নাভির হার্নিয়া',
    med_en: 'Umbilical hernia',
    med_bn: 'আমবিলিকাল হার্নিয়া',
    short_en: 'A bulge at the navel — keyhole or open mesh repair.',
    short_bn: 'নাভির চারপাশে বা উপরে ফোলা — মেশ দিয়ে আধুনিক অপারেশন।',
    what_en: 'An umbilical or paraumbilical hernia is a weakness around the belly button where tissues push forward.',
    what_bn: 'নাভির চারপাশে মাংসপেশির দুর্বলতা দিয়ে পেটের চর্বি বা নাড়ি ফুলে ওঠাকে নাভির হার্নিয়া বলে।',
    symptoms_en: ['Bulge at or near the navel', 'Pain or pulling sensation during heavy lifting', 'Tenderness around the navel'],
    symptoms_bn: ['নাভির কাছে চাকা বা ফোলা', 'ভারী কিছু তোলার সময় টান লাগা বা ব্যথা', 'নাভির চারপাশ নরম ও স্পর্শকাতর হওয়া'],
    treat_en: ['Laparoscopic IPOM or mini-incision mesh repair.', 'Customized mesh reconstruction.'],
    treat_bn: ['ল্যাপারোস্কপিক বা মিনি-ইনসিশন মেশ রিপেয়ার।', 'ব্যথাহীন আধুনিক সেলাই।'],
    when_en: 'Repair before the hernia grows larger or risks bowel entrapment.',
    when_bn: 'ফোলা বড় হওয়ার আগেই অপারেশনের সিদ্ধান্ত নিন।',
    image_url: '/img/conditions/umbilical-hernia.webp',
  },

  // 4. Breast
  {
    slug: 'breast-lump',
    category_slug: 'breast',
    sort_order: 11,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 7,
    home_word_en: 'Breast Lump',
    home_word_bn: 'স্তনে চাকা',
    name_en: 'Breast Lump',
    name_bn: 'স্তনে চাকা',
    med_en: 'Fibroadenoma & benign disease',
    med_bn: 'ফাইব্রোঅ্যাডেনোমা ও নিরীহ চাকা',
    short_en: 'A lump in the breast — most are benign, but every lump must be checked.',
    short_bn: 'স্তনে চাকা বা গোটা — বেশিরভাগই ক্যান্সার নয়, তবে পরীক্ষা জরুরি।',
    what_en: 'Finding a breast lump is stressful, but most lumps in younger women are benign (fibroadenoma or cyst). Accurate examination and ultrasound provide peace of mind.',
    what_bn: 'স্তনে চাকা অনুভব করা দুশ্চিন্তার কারণ হলেও বেশিরভাগ চাকাই নিরীহ বা বিনাইন। আল্ট্রাসনোগ্রাম ও যত্নশীল পরীক্ষায় সঠিক কারণ নিশ্চিত করা যায়।',
    symptoms_en: ['Painless, smooth, movable lump in the breast', 'Changes during menstrual cycles', 'Discomfort or tenderness'],
    symptoms_bn: ['ব্যথাহীন, মসৃণ, সহজে নড়াচড়া করে এমন চাকা', 'মাসিকের সময় আকারে পরিবর্তন বা অস্বস্তি', 'স্তনে ভারি ভাব'],
    treat_en: ['Clinical breast examination & ultrasound.', 'Cosmetic scarless or hidden-border minor surgical removal if needed.'],
    treat_bn: ['ক্লিনিক্যাল পরীক্ষা ও আল্ট্রাসনোগ্রাম।', 'প্রয়োজনে দাগহীন কসমেটিক পদ্ধতিতে চাকা অপসারণ।'],
    when_en: 'Any new lump in the breast should be evaluated by a surgeon without delay.',
    when_bn: 'স্তনে নতুন যেকোনো চাকা অনুভব করলেই অবহেলা না করে সার্জনকে দেখান।',
    image_url: '/img/conditions/breast-lump.webp',
  },
  {
    slug: 'breast-cancer',
    category_slug: 'breast',
    sort_order: 12,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 8,
    home_word_en: 'Breast Cancer',
    home_word_bn: 'স্তন ক্যান্সার',
    name_en: 'Breast Cancer',
    name_bn: 'স্তন ক্যান্সার',
    med_en: 'Carcinoma breast',
    med_bn: 'কার্সিনোমা ব্রেস্ট',
    short_en: 'Early detection, staging and comprehensive breast cancer surgery.',
    short_bn: 'শুরুতে রোগ নির্ণয় ও আধুনিক স্তন ক্যান্সার সার্জারি।',
    what_en: 'Breast cancer is the most common cancer in women. When diagnosed in early stages, complete cure and normal life expectancy are highly achievable.',
    what_bn: 'নারীদের মধ্যে সবচেয়ে সাধারণ ক্যান্সার হলেও শুরুর দিকে ধরা পড়লে চিকিৎসার মাধ্যমে সম্পূর্ণ সুস্থ হওয়া সম্ভব।',
    symptoms_en: ['Hard, irregular, fixed lump', 'Nipple retraction or bloody discharge', 'Dimpling or orange-peel texture on skin', 'Swelling in the armpit'],
    symptoms_bn: ['শক্ত, অসমান ও অনড় চাকা', 'বোঁটা ভেতরের দিকে দেবে যাওয়া বা রক্তমিশ্রিত রস পড়া', 'চামড়া কুঁচকে যাওয়া বা কমলার খোসার মতো দাগ', 'বগলে চাকা বা ফোলা'],
    treat_en: ['Triple assessment (Clinical, Imaging, Biopsy).', 'Breast conservation surgery or modified radical mastectomy.', 'Coordinated multidisciplinary cancer therapy.'],
    treat_bn: ['ট্রিপল অ্যাসেসমেন্ট (পরীক্ষা, ম্যামোগ্রাম/আল্ট্রা, বায়োপসি)।', 'স্তন সংরক্ষণকারী অপারেশন অথবা মডিফাইড রেডিক্যাল মাস্টেক্টমি।', 'পরিকল্পিত অনকোলজি পরামর্শ।'],
    when_en: 'Immediate consultation upon noticing any skin or nipple changes, or a hard lump.',
    when_bn: 'স্তনের চামড়া বা বোঁটায় কোনো পরিবর্তন দেখলে কালক্ষেপণ না করে বিশেষজ্ঞ সার্জন দেখান।',
    image_url: '/img/conditions/breast-cancer.webp',
  },

  // 5. Kidney & Urinary
  {
    slug: 'kidney-stones',
    category_slug: 'urinary',
    sort_order: 13,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 9,
    home_word_en: 'Kidney Stones',
    home_word_bn: 'কিডনির পাথর',
    name_en: 'Kidney & Ureteric Stones',
    name_bn: 'কিডনি ও মূত্রনালির পাথর',
    med_en: 'Urolithiasis',
    med_bn: 'ইউরোলিথিয়াসিস',
    short_en: 'Severe side or back pain — diagnosis and modern stone removal surgery.',
    short_bn: 'কোমর ও পিঠে তীব্র ব্যথা — পরীক্ষা ও আধুনিক পাথর অপসারণ সার্জারি।',
    what_en: 'Stones formed from concentrated minerals can block the kidney or urine pipe, causing unbearable spasms and potential kidney damage.',
    what_bn: 'কিডনি বা প্রস্রাবের নালিতে পাথর জমে প্রস্রাবের পথ বন্ধ হয়ে যেতে পারে। তীব্র ব্যথার পাশাপাশি কিডনির কার্যক্ষমতা নষ্ট হওয়ার ঝুঁকি থাকে।',
    symptoms_en: ['Sharp radiating flank or back pain towards the groin', 'Blood in urine', 'Burning or frequent urge to pass urine', 'Nausea and vomiting during attacks'],
    symptoms_bn: ['কোমর থেকে কুঁচকির দিকে ছড়িয়ে যাওয়া তীব্র খিল ধরা ব্যথা', 'প্রস্রাবের সাথে রক্ত যাওয়া', 'প্রস্রাবে জ্বালাপোড়া বা বারবার বেগ হওয়া', 'ব্যথার সময় বমি ভাব বা বমি'],
    treat_en: ['Precise imaging (Ultrasound, CT KUB).', 'Medical expulsion or modern surgical extraction.'],
    treat_bn: ['সঠিক সিটি স্ক্যান ও আল্ট্রাসনোগ্রাম মূল্যায়ন।', 'ওষুধের সাহায্যে বের করা বা আধুনিক সার্জিক্যাল অপারেশন।'],
    when_en: 'Intense flank pain with fever or inability to pass urine requires urgent hospital care.',
    when_bn: 'কোমরে তীব্র ব্যথার সাথে জ্বর বা প্রস্রাব আটকে গেলে জরুরি হাসপাতালে যান।',
    image_url: '/img/conditions/kidney-stones.webp',
  },

  // 6. Testis & Veins
  {
    slug: 'varicocele',
    category_slug: 'testis-veins',
    sort_order: 14,
    is_laparoscopic: true,
    is_hidden: false,
    home_order: 10,
    home_word_en: 'Varicocele',
    home_word_bn: 'ভেরিকোসিল',
    name_en: 'Varicocele',
    name_bn: 'ভেরিকোসিল',
    med_en: 'Varicocele',
    med_bn: 'ভেরিকোসিল',
    short_en: 'Swollen veins in the scrotum — keyhole surgery for pain and fertility.',
    short_bn: 'অণ্ডকোষের স্ফীত রক্তনালি — ব্যথা ও বন্ধ্যত্ব রোধে ছোট ছিদ্রে অপারেশন।',
    what_en: 'Varicocele is an enlargement of the veins within the scrotum, resembling varicose veins in the leg. It can affect sperm count and cause aching pain.',
    what_bn: 'অণ্ডকোষের চারপাশের রক্তনালি অস্বাভাবিক ফুলে পেঁচিয়ে যাওয়াকে ভেরিকোসিল বলে। এটি নিস্তেজ ব্যথা এবং পুরুষদের শুক্রাণুর মান হ্রাসের প্রধান কারণ।',
    symptoms_en: ['Dull aching pain in the scrotum after prolonged standing', 'Bag-of-worms feeling above the testicle', 'Difference in testicular size'],
    symptoms_bn: ['অনেকক্ষণ দাঁড়িয়ে বা কাজ করলে অণ্ডকোষে ভারী নিস্তেজ ব্যথা', 'অণ্ডকোষে শিরা পেঁচিয়ে থাকার মতো অনুভূতি', 'উভয় অণ্ডকোষের আকারে তফাৎ হওয়া'],
    treat_en: ['Laparoscopic or subinguinal microscopic varicocelectomy.', 'Discharge on the same or next day.'],
    treat_bn: ['ল্যাপারোস্কপিক ভেরিকোসিল অপারেশন।', 'খুব দ্রুত আরোগ্য ও স্বাভাবিক জীবনে প্রত্যাবর্তন।'],
    when_en: 'Aching scrotal discomfort or fertility evaluation issues.',
    when_bn: 'অণ্ডকোষে টান ধরা ব্যথা বা সন্তান ধারণের সমস্যায় চিকিৎসকের পরামর্শ নিন।',
    image_url: '/img/conditions/varicocele.webp',
  },
  {
    slug: 'varicose-veins',
    category_slug: 'testis-veins',
    sort_order: 15,
    is_laparoscopic: false,
    is_hidden: false,
    home_order: 11,
    home_word_en: 'Varicose Veins',
    home_word_bn: 'ভেরিকোস ভেইন',
    name_en: 'Varicose Veins',
    name_bn: 'পায়ের ফোলা শিরা',
    med_en: 'Varicose veins of legs',
    med_bn: 'ভেরিকোস ভেইন',
    short_en: 'Twisted blue veins in the legs — relief from pain and skin ulcers.',
    short_bn: 'পায়ের চামড়ার নিচে ফুলে থাকা শিরা — ব্যথা ও ঘা থেকে স্থায়ী মুক্তি।',
    what_en: 'Faulty valves inside leg veins cause blood to pool, producing visibly dilated tortuous veins, heaviness, pigmentation, and slow-healing sores.',
    what_bn: 'পায়ের রক্তনালির ভালভ নষ্ট হয়ে রক্ত জমে শিরাগুলো মোটা ও পেঁচিয়ে ওঠে। অবহেলায় পায়ে কালো দাগ ও দীর্ঘস্থায়ী ঘা তৈরি হয়।',
    symptoms_en: ['Bulging, bluish, rope-like leg veins', 'Leg heaviness and fatigue at end of day', 'Swelling and itchy skin around ankles', 'Leg ulcers near the ankle'],
    symptoms_bn: ['পায়ে নীলচে ফোলা মোটা শিরা দৃশ্যমান হওয়া', 'দিনের শেষে পায়ে ভারী ভাব ও ক্লান্তি', 'গোড়ালির চারপাশে কালো দাগ ও চুলকানি', 'দেরিতে শুকায় এমন ঘা হওয়া'],
    treat_en: ['Doppler ultrasound vein mapping.', 'Minimally invasive ligation or surgical removal of diseased veins.'],
    treat_bn: ['ডপলার আল্ট্রাসনোগ্রাম পরীক্ষা।', 'আধুনিক সার্জিক্যাল পদ্ধতিতে ক্ষতিগ্রস্ত শিরা অপসারণ।'],
    when_en: 'Skin discoloration or ulcer development near the ankle.',
    when_bn: 'পায়ে ঘা বা চামড়ার রঙ পরিবর্তন শুরু হলে দ্রুত চিকিৎসা নিন।',
    image_url: '/img/conditions/varicose-veins.webp',
  },
  {
    slug: 'incisional-hernia',
    category_slug: 'abdomen',
    sort_order: 16,
    is_laparoscopic: true,
    is_hidden: false,
    name_en: 'Incisional & Ventral Hernia',
    name_bn: 'অপারেশন পরবর্তী হার্নিয়া',
    med_en: 'Incisional hernia',
    med_bn: 'ইনসিশনাল হার্নিয়া',
    short_en: 'Bulge at previous surgery scar — laparoscopic mesh reconstruction.',
    short_bn: 'আগের অপারেশনের কাটার জায়গায় ফোলা — ল্যাপারোস্কপিক মেশ রিপেয়ার।',
    what_en: 'An incisional hernia develops through an operative scar from a previous abdominal surgery where muscle layers separated over time.',
    what_bn: 'আগের কোনো পেটের অপারেশনের দাগের ভেতর দিয়ে মাংসপেশি দুর্বল হয়ে নাড়িভুড়ি ফুলে বের হয়ে আসাকে ইনসিশনাল হার্নিয়া বলে।',
    symptoms_en: ['Bulge under or around previous surgical incision', 'Pain while lifting weights or coughing', 'Skin stretching over the scar'],
    symptoms_bn: ['আগের অপারেশনের দাগের নিচে চাকা বা ফোলা', 'কাশি দিলে বা ভারী কাজ করলে টান লাগা ও ব্যথা', 'দাগের চামড়া পাতলা হয়ে আসা'],
    treat_en: ['Laparoscopic IPOM (keyhole) mesh repair or open component separation.', 'Strengthens abdominal wall with dual-layer surgical mesh.'],
    treat_bn: ['ল্যাপারোস্কপিক পদ্ধতিতে পেটের ভেতর থেকে টেকসই মেশ স্থাপন।', 'দ্রুত আরোগ্য এবং পুনরায় হওয়ার ঝুঁকি সর্বনিম্ন।'],
    when_en: 'Seek surgical consultation early before the abdominal wall defect expands.',
    when_bn: 'ফোলা আরও বড় হয়ে নাড়ি আটকে যাওয়ার আগেই বিশেষজ্ঞ সার্জনকে দেখান।',
    image_url: '/img/conditions/umbilical-hernia.webp',
  },

  // 4. Additional Breast Conditions
  {
    slug: 'fibrocystic-breast',
    category_slug: 'breast',
    sort_order: 17,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Fibrocystic Breast',
    name_bn: 'ফাইব্রোসিস্টিক স্তন',
    med_en: 'Fibrocystic disease',
    med_bn: 'ফাইব্রোসিস্টিক ডিজিজ',
    short_en: 'Lumpy, painful breasts that change with menstrual cycles.',
    short_bn: 'মাসিকের সাথে বদলায় এমন দলা দলা ও ব্যথাযুক্ত স্তন।',
    what_en: 'Fibrocystic changes make the breast feel lumpy or tender, often before periods. It is common and usually benign.',
    what_bn: 'ফাইব্রোসিস্টিক পরিবর্তনে স্তন দলা দলা বা ব্যথাযুক্ত লাগে, বিশেষ করে মাসিকের আগে। এটা সাধারণ এবং সাধারণত ক্যান্সার না।',
    symptoms_en: ['Lumpy or rope-like feel', 'Pain or tenderness before periods', 'Small fluid-filled cysts'],
    symptoms_bn: ['দলা দলা বা দড়ির মতো অনুভূতি', 'মাসিকের আগে ব্যথা', 'ছোট পানি ভরা সিস্ট'],
    treat_en: ['Clinical breast examination and ultrasound.', 'Medical management for pain relief and reassurance.'],
    treat_bn: ['পরীক্ষা ও আলট্রাসাউন্ড।', 'ব্যথা কমানোর ওষুধ ও সঠিক পরামর্শ।'],
    when_en: 'If a lump persists after periods or continues to grow, get it checked.',
    when_bn: 'মাসিকের পরও চাকা থাকলে বা বড় হতে থাকলে পরীক্ষা করান।',
    image_url: '/img/conditions/breast-lump.webp',
  },
  {
    slug: 'breast-pain',
    category_slug: 'breast',
    sort_order: 18,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Breast Pain',
    name_bn: 'স্তনে ব্যথা',
    med_en: 'Mastalgia',
    med_bn: 'মাস্টালজিয়া',
    short_en: 'Pain in one or both breasts — evaluate the cause, get lasting relief.',
    short_bn: 'এক বা দুই স্তনে ব্যথা — কারণ খুঁজে আরাম।',
    what_en: 'Breast pain is very common and is rarely due to cancer. It is often linked to hormones or muscle strain.',
    what_bn: 'স্তনে ব্যথা খুবই সাধারণ, আর এর কারণ খুব কমই ক্যান্সার। প্রায়ই হরমোন, আঁটসাঁট ব্রা বা মাংসপেশির টান থেকে হয়।',
    symptoms_en: ['Pain before menstrual periods', 'Localized discomfort', 'Heaviness or burning sensation'],
    symptoms_bn: ['মাসিকের আগে ব্যথা', 'এক জায়গায় অস্বস্তি', 'ভার ভার লাগা বা জ্বালা'],
    treat_en: ['Specialist clinical evaluation and ultrasound.', 'Targeted medical treatment and dietary adjustments.'],
    treat_bn: ['বিশেষজ্ঞ পরীক্ষা ও আলট্রাসাউন্ড।', 'ব্যথা কমানোর ওষুধ ও সঠিক খাদ্যাভ্যাস।'],
    when_en: 'Persistent pain or pain accompanied by a lump.',
    when_bn: 'চাকার সাথে ব্যথা বা ব্যথা দীর্ঘদিন থাকলে পরীক্ষা করান।',
    image_url: '/img/conditions/breast-lump.webp',
  },
  {
    slug: 'nipple-discharge',
    category_slug: 'breast',
    sort_order: 19,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Nipple Discharge',
    name_bn: 'বোঁটা দিয়ে রস পড়া',
    med_en: 'Nipple discharge',
    med_bn: 'নিপল ডিসচার্জ',
    short_en: 'Fluid or blood from the nipple — requires structured examination.',
    short_bn: 'স্তনের বোঁটা দিয়ে রস বা রক্ত পড়া — সঠিক পরীক্ষা দরকার।',
    what_en: 'Discharge from one side, bloody fluid or discharge associated with a lump requires specialist surgical examination.',
    what_bn: 'স্তনের বোঁটা দিয়ে এক দিক থেকে রক্তমাখা বা চাকার সাথে রস পড়লে বিশেষায়িত সার্জিক্যাল পরীক্ষা করা দরকার।',
    symptoms_en: ['Clear or green fluid discharge', 'Bloody nipple discharge', 'Discharge from one side only'],
    symptoms_bn: ['স্বচ্ছ বা সবুজ রস', 'রক্তমাখা রস', 'শুধু এক বোঁটা দিয়ে রস পড়া'],
    treat_en: ['Cytological evaluation, duct ultrasound and duct excision if needed.'],
    treat_bn: ['আলট্রাসাউন্ড ও রসের সাইটোলজি পরীক্ষা, প্রয়োজনে ছোট সার্জারি।'],
    when_en: 'Bloody discharge or spontaneous single-duct discharge.',
    when_bn: 'রক্তমাখা রস বা নিজে থেকে রস বের হলে অবিলম্বে সার্জন দেখান।',
    image_url: '/img/conditions/breast-cancer.webp',
  },
  {
    slug: 'breast-abscess',
    category_slug: 'breast',
    sort_order: 20,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Breast Abscess',
    name_bn: 'স্তনের ফোড়া',
    med_en: 'Breast abscess',
    med_bn: 'ব্রেস্ট অ্যাবসেস',
    short_en: 'Painful, swollen breast with pus — prompt drainage and antibiotics.',
    short_bn: 'পুঁজসহ ফোলা ও ব্যথাযুক্ত স্তন — পুঁজ বের করা দরকার।',
    what_en: 'A breast abscess is a collection of pus, often in lactating mothers, accompanied by severe tenderness and high fever.',
    what_bn: 'স্তনে পুঁজ জমাকে স্তনের ফোড়া বলে, বুকের দুধ খাওয়ানো মায়েদের বেশি হয়। তীব্র ব্যথা, লাল হওয়া ও জ্বর হয়।',
    symptoms_en: ['Hot, red, swollen area on breast', 'Severe throbbing pain', 'High fever and chills'],
    symptoms_bn: ['লাল, গরম, ফোলা জায়গা', 'তীব্র দপদপানি ব্যথা', 'উচ্চ জ্বর ও কাঁপুনি'],
    treat_en: ['Targeted antibiotics and needle aspiration or minimal incision drainage.'],
    treat_bn: ['অ্যান্টিবায়োটিক এবং সুই দিয়ে অথবা ছোট কাটায় পুঁজ নিষ্কাশন।'],
    when_en: 'Fever with an inflamed, painful breast requires immediate treatment.',
    when_bn: 'জ্বরের সাথে স্তন লাল ও ব্যথাযুক্ত হলে অবিলম্বে ডাক্তার দেখান।',
    image_url: '/img/conditions/breast-lump.webp',
  },
  {
    slug: 'gynecomastia',
    category_slug: 'breast',
    sort_order: 21,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Gynecomastia',
    name_bn: 'গাইনোকোমাস্টিয়া',
    med_en: 'Enlarged male breast',
    med_bn: 'ছেলেদের বড় স্তন',
    short_en: 'Enlarged breast tissue in men — minimally invasive cosmetic surgery.',
    short_bn: 'ছেলেদের বড় স্তন — কসমেটিক অপারেশন।',
    what_en: 'Gynecomastia is benign enlargement of gland tissue in males. It causes self-consciousness and can be corrected with cosmetic surgery.',
    what_bn: 'ছেলেদের স্তনের গ্ল্যান্ড বড় হয়ে যাওয়াকে গাইনোকোমাস্টিয়া বলে। আধুনিক কসমেটিক অপারেশনে বুক স্বাভাবিক করা হয়।',
    symptoms_en: ['Firm rubbery disc under nipple', 'Tenderness or discomfort in tight clothing'],
    symptoms_bn: ['বোঁটার নিচে শক্ত ফোলা', 'চাপ দিলে ব্যথা ও পোশাকে অস্বস্তি'],
    treat_en: ['Cosmetic surgical excision or liposuction under local/general anesthesia.'],
    treat_bn: ['নিখুঁত কসমেটিক সার্জারির মাধ্যমে বাড়তি গ্ল্যান্ড অপসারণ।'],
    when_en: 'Persistent swelling causing aesthetic or emotional discomfort.',
    when_bn: 'সমস্যা দীর্ঘস্থায়ী হলে বিশেষজ্ঞ প্লাস্টিক/জেনারেল সার্জনের পরামর্শ নিন।',
    image_url: '/img/conditions/breast-lump.webp',
  },

  // 5. Additional Kidney & Urinary
  {
    slug: 'ureteric-stones',
    category_slug: 'urinary',
    sort_order: 22,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Ureteric Stones',
    name_bn: 'মূত্রনালির পাথর',
    med_en: 'Ureteric calculi',
    med_bn: 'ইউরেটেরিক স্টোন',
    short_en: 'Stone lodged in the urine pipe — excruciating colicky pain.',
    short_bn: 'প্রস্রাবের নালিতে পাথর — পিঠ থেকে কুঁচকি পর্যন্ত তীব্র ব্যথা।',
    what_en: 'A stone travelling from the kidney down to the bladder can lodge in the ureter, causing severe wave-like spasms.',
    what_bn: 'কিডনির পাথর মূত্রনালিতে আটকে গেলে ঢেউয়ের মতো তীব্র খিল ধরা ব্যথা হয়।',
    symptoms_en: ['Spasmodic groin pain', 'Blood in urine', 'Urgent frequent urination'],
    symptoms_bn: ['পিঠ থেকে কুঁচকি পর্যন্ত তীব্র ব্যথা', 'প্রস্রাবে রক্ত', 'বারবার প্রস্রাবের বেগ'],
    treat_en: ['Medical expulsion therapy or modern surgical retrieval.'],
    treat_bn: ['ওষুধের মাধ্যমে বের করা বা আধুনিক সার্জারি।'],
    when_en: 'Severe pain with fever or complete inability to pass urine.',
    when_bn: 'জ্বরের সাথে ব্যথা বা প্রস্রাব আটকে গেলে জরুরি হাসপাতালে যান।',
    image_url: '/img/conditions/kidney-stones.webp',
  },
  {
    slug: 'bladder-stones',
    category_slug: 'urinary',
    sort_order: 23,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Bladder Stones',
    name_bn: 'মূত্রথলির পাথর',
    med_en: 'Vesical calculi',
    med_bn: 'ভেসিক্যাল স্টোন',
    short_en: 'Stones in the bladder — interrupted stream and burning.',
    short_bn: 'মূত্রথলিতে পাথর — ব্যথা ও প্রস্রাবে কষ্ট।',
    what_en: 'Stones forming inside the urinary bladder due to incomplete emptying, causing interrupted urination and pain.',
    what_bn: 'মূত্রথলিতে পাথর জমলে প্রস্রাবের গতি বাধাগ্রস্ত হয় এবং তলপেটে তীব্র জ্বালা-যন্ত্রণা হয়।',
    symptoms_en: ['Interrupted urine stream', 'Lower belly ache', 'Pain at the end of urination'],
    symptoms_bn: ['থেমে থেমে প্রস্রাব হওয়া', 'তলপেটে ব্যথা', 'প্রস্রাবের শেষে তীব্র যন্ত্রণা'],
    treat_en: ['Cystolitholapaxy or small surgical extraction.'],
    treat_bn: ['আধুনিক এন্ডোস্কোপিক অথবা ছোট অপারেশনের মাধ্যমে পাথর অপসারণ।'],
    when_en: 'Sudden stoppage of urine or bloody urine.',
    when_bn: 'হঠাৎ প্রস্রাব বন্ধ হয়ে গেলে বা রক্ত গেলে অবিলম্বে চিকিৎসা নিন।',
    image_url: '/img/conditions/kidney-stones.webp',
  },

  // 6. Additional Testicular
  {
    slug: 'testicular-swelling',
    category_slug: 'testis-veins',
    sort_order: 24,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Testicular Swelling',
    name_bn: 'অণ্ডকোষের রোগ',
    med_en: 'Hydrocele & scrotal disease',
    med_bn: 'হাইড্রোসিল ও অণ্ডকোষ রোগ',
    short_en: 'Swelling, fluid collection or pain in the scrotum.',
    short_bn: 'অণ্ডকোষে ফোলা, পানি জমা বা ব্যথা।',
    what_en: 'Scrotal swellings like hydrocele, epididymal cysts or infections require accurate physical examination and ultrasound.',
    what_bn: 'অণ্ডকোষে পানি জমা (হাইড্রোসিল) বা ইনফেকশন অত্যন্ত পরিচিত রোগ যা ছোট অপারেশনে স্থায়ীভাবে সেরে যায়।',
    symptoms_en: ['Heavy dragging feeling', 'Visible painless enlargement of scrotum'],
    symptoms_bn: ['ভারী ভাব ও টান লাগা', 'অণ্ডকোষের দৃশ্যমান বৃদ্ধি'],
    treat_en: ['Eversion/excision of hydrocele sac under regional anesthesia.'],
    treat_bn: ['ছোট অপারেশনে অতিরিক্ত পানি ও থলি অপসারণ।'],
    when_en: 'Sudden severe pain is a surgical emergency.',
    when_bn: 'হঠাৎ তীব্র ব্যথা হলে তাৎক্ষণিক হাসপাতালে যান।',
    image_url: '/img/conditions/varicocele.webp',
  },

  // 7. Skin & Soft Tissue
  {
    slug: 'lump-cyst-lipoma',
    category_slug: 'skin',
    sort_order: 25,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Lipoma & Soft Tissue Lumps',
    name_bn: 'লাইপোমা ও নরম টিস্যুর চাকা',
    med_en: 'Lipoma & soft tissue lumps',
    med_bn: 'লাইপোমা ও টিস্যু টিউমার',
    short_en: 'Fatty lumps anywhere under the skin — painless excision.',
    short_bn: 'চামড়ার নিচে নরম চর্বির চাকা বা সিস্ট — দাগহীন ছোট অপারেশনে সমাধান।',
    what_en: 'Lipomas are benign fatty lumps that grow slowly under the skin and are cleanly removed in a day procedure.',
    what_bn: 'চামড়ার নিচে চর্বির নরম চাকা (লাইপোমা) অত্যন্ত নিরীহ। ছোট ডে-সার্জারিতে সম্পূর্ণ অপসারণ করা হয়।',
    symptoms_en: ['Soft, moveable, painless lump under skin', 'Slow increase in size'],
    symptoms_bn: ['চামড়ার নিচে নরম চর্বির চাকা', 'ধীরে ধীরে বৃদ্ধি পাওয়া'],
    treat_en: ['Cosmetic surgical excision under local anesthesia.'],
    treat_bn: ['লোকাল অ্যানেস্থেসিয়ায় নিখুঁত সেলাই সহ অপারেশন।'],
    when_en: 'Rapid enlargement, pain, or cosmetic disfigurement.',
    when_bn: 'চাকা দ্রুত বাড়লে বা দাগজনিত সমস্যা হলে সার্জন দেখান।',
    image_url: '/img/conditions/lump-cyst-lipoma.webp',
  },
  {
    slug: 'cysts',
    category_slug: 'skin',
    sort_order: 26,
    is_laparoscopic: false,
    is_hidden: false,
    name_en: 'Sebaceous & Epidermal Cysts',
    name_bn: 'সেবাশিয়াস ও অন্যান্য সিস্ট',
    med_en: 'Sebaceous cyst',
    med_bn: 'সেবাশিয়াস সিস্ট',
    short_en: 'Pus or keratin-filled sac under the skin — capsule removal.',
    short_bn: 'চামড়ার নিচে পানি বা রস ভরা ফোলা — থলিসহ অপসারণ।',
    what_en: 'A cyst is a closed sac under the skin. Complete removal of the capsule prevents recurrent infection.',
    what_bn: 'চামড়ার নিচে তৈলাক্ত গ্রন্থি বন্ধ হয়ে সিস্ট তৈরি হয়। পুরো থলিসহ বের করলে আর ফিরে আসে না।',
    symptoms_en: ['Smooth round nodule', 'Punctum or dark dot', 'Foul discharge if infected'],
    symptoms_bn: ['গোল মসৃণ চাকা', 'মাঝখানে কালো বিন্দু', 'ইনফেকশন হলে দুর্গন্ধযুক্ত পুঁজ'],
    treat_en: ['Complete capsule excision with cosmetic intradermal stitching.'],
    treat_bn: ['থলিসহ সিস্ট অপসারণ ও কসমেটিক সেলাই।'],
    when_en: 'Infection, redness or foul-smelling leakage.',
    when_bn: 'লাল হয়ে ব্যথা হলে বা পুঁজ বের হলে অবিলম্বে সার্জন দেখান।',
    image_url: '/img/conditions/cysts.webp',
  },
];

export const DEFAULT_SERIAL_STEPS: SerialStep[] = [
  {
    step_number: 1,
    title_en: 'See where & when he sits',
    title_bn: 'দেখে নিন কবে, কোথায় বসেন',
    desc_en: 'Sherpur every Thursday & Friday · Mymensingh Saturday to Tuesday. Exact addresses, days and timings are listed right on this website.',
    desc_bn: 'শেরপুরে প্রতি বৃহস্পতি ও শুক্রবার · ময়মনসিংহে শনি থেকে মঙ্গলবার। ঠিকানা, দিন ও সময় এই পাতাতেই বিস্তারিত দেওয়া আছে।',
    primary_btn_text_en: 'Chambers & timings →',
    primary_btn_text_bn: 'চেম্বার ও সময় দেখুন →',
    primary_btn_link: '/contact',
    secondary_btn_text_en: '',
    secondary_btn_text_bn: '',
    secondary_btn_link: '',
  },
  {
    step_number: 2,
    title_en: 'Tap “Book a serial”',
    title_bn: '“সিরিয়াল নিন” বোতামে চাপ দিন',
    desc_en: 'The “Book a serial” button is accessible on every page of the website. One click connects you directly to book your serial.',
    desc_bn: 'ওয়েবসাইটের প্রতিটা পাতায় “সিরিয়াল নিন” বোতাম আছে। চাপ দিলেই সরাসরি সিরিয়াল বুক করার সুবিধা পাবেন।',
    primary_btn_text_en: 'Book a serial',
    primary_btn_text_bn: 'সিরিয়াল নিন',
    primary_btn_link: 'tel:01750529252',
    secondary_btn_text_en: '',
    secondary_btn_text_bn: '',
    secondary_btn_link: '',
  },
  {
    step_number: 3,
    title_en: 'Call or WhatsApp to confirm',
    title_bn: 'কল বা WhatsApp-এ নিশ্চিত করুন',
    desc_en: 'Simply tell us your patient name, problem and selected chamber — your serial number will be confirmed promptly.',
    desc_bn: 'আপনার নাম, সমস্যা আর কোন চেম্বারে দেখাবেন জানান — সাথে সাথে সিরিয়াল নম্বর নিশ্চিত করে জানিয়ে দেওয়া হবে।',
    primary_btn_text_en: 'Call: 01750-529252',
    primary_btn_text_bn: 'কল: ০১৭৫০-৫২৯২৫২',
    primary_btn_link: 'tel:01750529252',
    secondary_btn_text_en: 'WhatsApp Message',
    secondary_btn_text_bn: 'WhatsApp-এ লিখুন',
    secondary_btn_link: 'https://wa.me/8801670879100',
  },
];

export const DEFAULT_CHAMBERS: Chamber[] = [
  {
    id: 1,
    name_en: 'Asia Diagnostic Center',
    name_bn: 'এশিয়া ডায়াগনস্টিক সেন্টার',
    schedule_en: 'Sherpur · Thursday',
    schedule_bn: 'শেরপুর · বৃহস্পতিবার',
    address_en: 'Zila Hospital Road, Narayanpur, Sherpur',
    address_bn: 'জেলা হাসপাতাল রোড, নারায়ণপুর, শেরপুর',
    timing_en: '3:00 PM – 9:00 PM',
    timing_bn: 'দুপুর ৩টা – রাত ৯টা',
    map_query: 'Sadar Hospital Road, Narayanpur, Sherpur',
    is_highlighted: true,
    is_map_verified: false,
    sort_order: 1,
  },
  {
    id: 2,
    name_en: 'Amjad Diagnostic Center',
    name_bn: 'আমজাদ ডায়াগনস্টিক সেন্টার',
    schedule_en: 'Sherpur · Friday',
    schedule_bn: 'শেরপুর · শুক্রবার',
    address_en: 'Zila Hospital Road, Narayanpur, Sherpur',
    address_bn: 'জেলা হাসপাতাল রোড, নারায়ণপুর, শেরপুর',
    timing_en: '11:00 AM – 9:00 PM',
    timing_bn: 'সকাল ১১টা – রাত ৯টা',
    map_query: 'Amzad diagnostic center, Sherpur',
    is_highlighted: true,
    is_map_verified: true,
    sort_order: 2,
  },
  {
    id: 3,
    name_en: 'New Medicare Pathology Lab',
    name_bn: 'নিউ মেডিকেয়ার প্যাথলজি ল্যাব',
    schedule_en: 'Mymensingh · Saturday to Tuesday',
    schedule_bn: 'ময়মনসিংহ · শনি থেকে মঙ্গলবার',
    address_en: '204 Charpara (Opposite Hospital Gate 1, 5th floor), Mymensingh',
    address_bn: '২০৪ চরপাড়া (১নং হাসপাতাল গেটের বিপরীতে, ৫ম তলা), ময়মনসিংহ',
    timing_en: '3:30 PM – 8:00 PM',
    timing_bn: 'বিকাল ৩:৩০টা – রাত ৮টা',
    map_query: 'New medicare Path. Lab, Charpara, Mymensingh',
    is_highlighted: false,
    is_map_verified: true,
    sort_order: 3,
  },
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    author_name_en: 'A. R.',
    author_name_bn: 'আ. র.',
    author_meta_en: '45 yrs · Sherpur · Piles (Longo Method)',
    author_meta_bn: '৪৫ বছর · শেরপুর · পাইলস (লংগো পদ্ধতি)',
    quote_en: 'I suffered from piles for years. Sir explained everything calmly — after the Longo operation I went home in two days and I am completely fine now.',
    quote_bn: 'অনেক বছর ধরে পাইলসের কষ্টে ছিলাম। স্যার সব শান্তভাবে বুঝিয়ে বললেন, লংগো অপারেশনের দুই দিন পরেই বাড়ি ফিরেছি। এখন একদম ভালো আছি।',
    rating: 5,
    is_sample: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 2,
    author_name_en: 'S. A.',
    author_name_bn: 'সা. আ.',
    author_meta_en: '34 yrs · Mymensingh · Gallstones (Laparoscopic)',
    author_meta_bn: '৩৪ বছর · ময়মনসিংহ · পিত্তথলির পাথর (ল্যাপারোস্কপি)',
    quote_en: 'I was scared when I heard “gallstones”. It was done through tiny holes and the scars are barely visible. Sir is very caring.',
    quote_bn: 'পিত্তথলিতে পাথর শুনে খুব ভয় পেয়েছিলাম। ছোট ছিদ্রে অপারেশন হলো, দাগ প্রায় বোঝাই যায় না। স্যারের ব্যবহার খুবই আন্তরিক।',
    rating: 5,
    is_sample: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 3,
    author_name_en: 'M. H.',
    author_name_bn: 'ম. হ.',
    author_meta_en: '28 yrs · Nalitabari, Sherpur · Fistula Surgery',
    author_meta_bn: '২৮ বছর · নালিতাবাড়ী, শেরপুর · ফিস্টুলা সার্জারি',
    quote_en: 'My fistula came back after two operations elsewhere. After Dr. Kollol’s surgery it has not returned at all.',
    quote_bn: 'অন্য জায়গায় দুইবার অপারেশনের পরও ফিস্টুলা ফিরে এসেছিল। ডাঃ কল্লোলের অপারেশনের পর আর কোনো সমস্যা হয়নি।',
    rating: 5,
    is_sample: true,
    is_featured: true,
    sort_order: 3,
  },
  {
    id: 4,
    author_name_en: 'R. K.',
    author_name_bn: 'র. খা.',
    author_meta_en: '52 yrs · Mymensingh · Breast Lump Excision',
    author_meta_bn: '৫২ বছর · ময়মনসিংহ · স্তনের চাকা অপসারণ',
    quote_en: 'I was very worried about a lump in my breast. Sir arranged the tests quickly, explained clearly and the surgery was completely smooth.',
    quote_bn: 'স্তনে চাকা দেখে খুব দুশ্চিন্তায় ছিলাম। স্যার দ্রুত পরীক্ষা করিয়ে পরিষ্কার করে বুঝিয়ে দিলেন, সময়মতো নিখুঁত অপারেশন হয়েছে।',
    rating: 5,
    is_sample: true,
    is_featured: true,
    sort_order: 4,
  },
];

export const DEFAULT_FAQS: FAQ[] = [
  {
    id: 1,
    question_en: 'Do piles always require surgery?',
    question_bn: 'পাইলস হলে কি সবসময় অপারেশন লাগবেই?',
    answer_en: 'No. Early grade piles often respond well to high-fibre nutrition, abundant water intake, sitz baths, and targeted medications. Surgery (such as modern Longo stapler procedure) is recommended when piles persistently prolapse, cause severe blood loss, or fail conservative medical management.',
    answer_bn: 'না। শুরুর দিকের পাইলস আঁশযুক্ত খাবার, প্রচুর পানি, কুসুম গরম পানির সেক এবং ওষুধের মাধ্যমে স্বাভাবিক রাখা যায়। পাইলস বাইরে বের হয়ে আটকে থাকলে, বারবার রক্তক্ষরণ হলে বা ওষুধে না সারলে তখন আধুনিক লংগো (স্টেপলার) বা লেজার অপারেশনের পরামর্শ দেওয়া হয়।',
    sort_order: 1,
  },
  {
    id: 2,
    question_en: 'What is laparoscopic (keyhole) surgery and its benefits?',
    question_bn: 'ল্যাপারোস্কপিক (ছোট ছিদ্রে) অপারেশন কী এবং এর সুবিধা কী?',
    answer_en: 'Laparoscopic surgery uses miniature incisions (3-10mm) and high-definition optical cameras to operate with superior precision. Compared to traditional open incisions, patients enjoy dramatically less pain, negligible scarring, minimal infection risk, and can resume work within days.',
    answer_bn: 'ল্যাপারোস্কপি হলো পেট বড় করে না কেটে ছোট ৩-৪টি ছিদ্রে ক্যামেরার সাহায্যে নিখুঁতভাবে অপারেশন করা। এর প্রধান সুবিধা হলো ব্যথা খুব কম হয়, দাগ থাকে না বললেই চলে, ইনফেকশনের ঝুঁকি নেই এবং রোগী কয়েক দিনের মধ্যে কর্মক্ষেত্রে ফিরতে পারেন।',
    sort_order: 2,
  },
  {
    id: 3,
    question_en: 'How long do I need to stay in the hospital?',
    question_bn: 'অপারেশনের পর হাসপাতালে কত দিন থাকতে হবে?',
    answer_en: 'For most laparoscopic surgeries (gallbladder, hernia, appendix) and Longo piles procedures, patients only need an overnight or 24-48 hour hospital stay. Dr. Kollol provides precise discharge expectations after physical evaluation.',
    answer_bn: 'বেশিরভাগ ল্যাপারোস্কপিক অপারেশন (পিত্তথলি, অ্যাপেন্ডিসাইটিস, হার্নিয়া) এবং আধুনিক পাইলস অপারেশনে মাত্র ১ দিন বা ২৪ থেকে ৪৮ ঘণ্টা হাসপাতালে থাকতে হয়। এরপর স্বাভাবিকভাবেই রোগী বাড়ি ফিরতে পারেন।',
    sort_order: 3,
  },
  {
    id: 4,
    question_en: 'Is every breast lump a sign of cancer?',
    question_bn: 'স্তনে চাকা মানেই কি ক্যান্সার?',
    answer_en: 'Most breast lumps (over 80-90%) in young and middle-aged women are completely benign conditions like fibroadenomas or simple fluid cysts. However, any new palpable lump must be professionally examined and imaged via ultrasound or mammography to be entirely sure.',
    answer_bn: 'না, বেশিরভাগ চাকাই (৮০-৯০ ভাগ) নিরীহ বা নন-ক্যান্সারাস যেমন ফাইব্রোঅ্যাডেনোমা বা সিস্ট। তবে স্তনে যেকোনো নতুন চাকা দেখা দিলে দেরি না করে অভিজ্ঞ সার্জনকে দেখিয়ে আল্ট্রাসনোগ্রাম করানোই সবচেয়ে নিরাপদ।',
    sort_order: 4,
  },
  {
    id: 5,
    question_en: 'Can an anal fistula recur after surgery?',
    question_bn: 'অপারেশনের পর কি ফিস্টুলা আবার ফিরে আসতে পারে?',
    answer_en: 'Fistulas can recur if tracts are complex, high-lying, or improperly excised. Dr. Kollol uses meticulous anatomical mapping and modern staged techniques ensuring optimal sphincter preservation with minimal recurrence rates.',
    answer_bn: 'ফিস্টুলার নালি যদি অত্যন্ত জটিল হয় বা ঠিকমতো পুরোটা পরিষ্কার না করা যায় তবে পুনরায় হওয়ার ঝুঁকি থাকে। ডাঃ কল্লোল আধুনিক প্রযুক্তিতে সতর্কতার সাথে পুরো নালি অপসারণ করেন, ফলে ফিরে আসার সম্ভাবনা থাকে সর্বনিম্ন।',
    sort_order: 5,
  },
  {
    id: 6,
    question_en: 'What documents and reports should I bring to the chamber?',
    question_bn: 'চেম্বারে আসার সময় সাথে কী কী আনা উচিত?',
    answer_en: 'Please bring your previous medical prescriptions, ultrasound films and reports, recent blood investigations, CT/MRI scans if completed, and a complete list of ongoing daily medications.',
    answer_bn: 'আপনার আগের চিকিৎসার সকল প্রেসক্রিপশন, আল্ট্রাসনোগ্রাম রিপোর্ট ও ফিল্ম, রক্ত পরীক্ষার কাগজপত্র এবং বর্তমানে নিয়মিত যেসকল ওষুধ সেবন করছেন তার তালিকা সাথে নিয়ে আসুন।',
    sort_order: 6,
  },
  {
    id: 7,
    question_en: 'How do I book a serial for Sherpur or Mymensingh?',
    question_bn: 'শেরপুর বা ময়মনসিংহের জন্য সিরিয়াল কীভাবে নেব?',
    answer_en: 'Call or WhatsApp 01750-529252 with your patient name, contact number, and desired chamber. Sherpur chamber runs Thursdays & Fridays; Mymensingh chamber runs Saturday through Tuesday.',
    answer_bn: '০১৭৫০-৫২৯২৫২ নম্বরে সরাসরি কল বা WhatsApp মেসেজ করে আপনার নাম ও চেম্বার জানালেই সিরিয়াল নম্বর প্রদান করা হবে। শেরপুরে প্রতি বৃহস্পতি ও শুক্রবার এবং ময়মনসিংহে শনি থেকে মঙ্গলবার রোগী দেখা হয়।',
    sort_order: 7,
  },
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 1,
    slug: 'piles-surgery-need-explained',
    title_en: 'Do Piles Always Need Surgery? When To Treat & When To Operate',
    title_bn: 'পাইলস হলে কি অপারেশন লাগবেই? কখন ওষুধ আর কখন অপারেশন',
    category_slug: 'colorectal',
    excerpt_en: 'Understand when early piles can be managed without surgery, and when modern methods like Longo stapler surgery provide painless cure.',
    excerpt_bn: 'পাইলস নিয়ে ভয় নয়। জানুন কোন পর্যায়ে ওষুধ ও জীবনযাত্রার পরিবর্তনে সারে, আর কোন জটিলতায় অপারেশন জরুরি হয়ে পড়ে।',
    content_en: `### Understanding Piles (Haemorrhoids)
Piles are swollen blood vessels situated within and around the anal canal. They develop primarily due to chronic constipation, habitual straining during bowel movements, prolonged sitting, and genetic predisposition.

### When Surgery is NOT Required
In Grade 1 and early Grade 2 piles where mild bleeding occurs without irreversible tissue prolapse:
- High-fibre dietary regimen (vegetables, isabgol husk, oats).
- Adequate hydration (2.5 to 3 litres of clean water daily).
- Warm sitz baths for 10-15 minutes twice daily.
- Stool softeners and vein-strengthening medications.

### When Surgery Becomes Essential
Surgery is strongly advised when:
1. Piles prolapse completely out of the back passage and do not return automatically.
2. Continuous or heavy bleeding leads to severe anaemia.
3. Severe thrombosed piles cause extreme, sudden pain.
4. Painful ulcers or multiple piles clusters fail conservative management.

### Modern Longo (Stapler) Surgery
Rather than extensive cutting, the modern **Longo technique** uses a specialized circular surgical stapler above the sensitive nerve-rich pain line. Benefits include:
- Minimal post-operative pain.
- Negligible external surgical wound.
- Return home within 24 to 48 hours.
- Rapid resumption of standard professional duties.`,
    content_bn: `### পাইলস আসলে কী?
পাইলস বা হেমোরয়েড হলো মলদ্বারের ভেতরের রক্তনালির অস্বাভাবিক স্ফীতি। অতিরিক্ত কোষ্ঠকাঠিন্য, পায়খানায় বসে অতিরিক্ত চাপ দেওয়া, দীর্ঘক্ষণ একনাগাড়ে বসে কাজ করা এবং কম আঁশযুক্ত খাবার খাওয়ার কারণে পাইলসের উৎপত্তি হয়।

### কখন অপারেশন ছাড়াই ভালো থাকা যায়?
শুরুর দিকে (ফার্স্ট ও সেকেন্ড ডিগ্রি পাইলস) যখন কেবল অল্প রক্ত যায় এবং গোটা নিজে থেকেই ভেতরে চলে যায়, তখন অপারেশনের প্রয়োজন পড়ে না:
- খাবারে প্রচুর শাকসবজি ও ফলমূল রাখা।
- ইসবগুলের ভুসি ও প্রতিদিন পর্যাপ্ত (৮-১০ গ্লাস) পানি পান করা।
- কুসুম গরম পানিতে লবণ ছাড়া দিনে ২-৩ বার ১০ মিনিট করে বসে সেঁক দেওয়া।
- মল নরম রাখার ওষুধ ও চিকিৎসকের পরামর্শ মতো মলম ব্যবহার করা।

### কখন অপারেশন অনিবার্য?
১. পায়খানার সময় পাইলসের গোটা বাইরে বেরিয়ে আসে এবং হাত দিয়ে চাপেও আর ভেতরে ঢোকানো যায় না।
২. মলত্যাগের সময় ফিনকি দিয়ে রক্ত পড়ে রোগী রক্তশূন্যতায় ভোগেন।
৩. তীব্র প্রদাহ হয়ে মলদ্বারে চাকা আটকে রক্ত জমাট বাঁধে (থ্রম্বোসিস)।
৪. দীর্ঘদিনের ওষুধ ও খাদ্যাভ্যাসেও কোনো সুফল পাওয়া যায় না।

### কাটা-ছেঁড়া ছাড়া আধুনিক লংগো (স্টেপলার) পদ্ধতি
সনাতন পদ্ধতির মতো কেটে উন্মুক্ত ঘা না রেখে আধুনিক **লংগো অপারেশনে** বিশেষ স্টেপলার যন্ত্রের সাহায্যে ব্যথাহীন জোন থেকে বাড়তি টিস্যু তুলে রিং তৈরি করা হয়। 
- অপারেশনের পর তীব্র ব্যথা থাকে না বললেই চলে।
- বাইরে কোনো কাটা দাগ থাকে না।
- রোগী ২৪ থেকে ৪৮ ঘণ্টার মধ্যে বাড়ি ফিরতে পারেন এবং দ্রুত কাজে ফিরতে পারেন।`,
    is_published: true,
    published_at: '2026-10-01T10:00:00Z',
    reading_time_en: '4 min read',
    reading_time_bn: '৪ মিনিট পড়ার সময়',
  },
  {
    id: 2,
    slug: 'longo-stapler-surgery-piles',
    title_en: 'Longo Stapler Surgery: The Modern Painless Approach to Piles',
    title_bn: 'লংগো (স্টেপলার) অপারেশন: পাইলসের আধুনিক ও ব্যথাহীন সমাধান',
    category_slug: 'colorectal',
    excerpt_en: 'A comprehensive medical guide explaining how circular stapling treats piles with minimal discomfort and rapid recovery.',
    excerpt_bn: 'কাটা-ছেঁড়ার ভয় ভুলে জেনে নিন কীভাবে লংগো স্টেপলার পদ্ধতিতে পাইলস অপারেশন করা হয় এবং রোগী কেন দ্রুত বাড়ি ফেরেন।',
    content_en: `### What is Longo (MIPH) Surgery?
Minimally Invasive Procedure for Haemorrhoids (MIPH), widely known as the **Longo technique**, revolutionized colorectal surgery worldwide. Developed by Dr. Antonio Longo, this procedure repositions prolapsing anal cushions back to their natural anatomical location while cutting off excessive blood flow.

### Key Advantages Over Open Surgery
- **No external cuts:** All work is done within the rectal mucosa above the dentate line.
- **Pain-free sensation:** The staple line resides in a zone with zero somatic pain receptors.
- **Low complication rate:** Preserves anal sphincter integrity and continence.
- **Fast hospital discharge:** 1 night stay is customary.`,
    content_bn: `### লংগো অপারেশন কী?
লংগো অপারেশন (MIPH) হলো পাইলস চিকিৎসার বৈশ্বিক যুগান্তকারী আবিষ্কার। এতে মলদ্বারের স্পর্শকাতর অংশের বাইরে বিশেষ স্টেপলার যন্ত্র দিয়ে ভেতরের ঢিলে হয়ে যাওয়া রক্তনালিসমূহ কেটে স্বাভাবিক অবস্থানে টেনে তোলা হয়।

### সাধারণ অপারেশনের চেয়ে কেন এটি উত্তম?
- বাইরে কোনো বড় কাটা বা ক্ষত থাকে না।
- যে অংশে স্টেপলিং হয় সেখানে ব্যথার স্নায়ু থাকে না, তাই অপারেশনের পর ব্যথা খুব কম।
- পায়খানা ধরে রাখার মাংসপেশি ক্ষতিগ্রস্ত হওয়ার কোনো সুযোগ নেই।
- ১ দিনেই হাসপাতাল থেকে ছুটি নিয়ে বাসায় যাওয়া যায়।`,
    is_published: true,
    published_at: '2026-10-02T10:00:00Z',
    reading_time_en: '5 min read',
    reading_time_bn: '৫ মিনিট পড়ার সময়',
  },
  {
    id: 3,
    slug: 'fistula-recurrence-prevention',
    title_en: 'Why Does Anal Fistula Recur? Causes and Modern Prevention',
    title_bn: 'ফিস্টুলা বারবার ফিরে আসে কেন? কারণ ও প্রতিরোধের আধুনিক উপায়',
    category_slug: 'colorectal',
    excerpt_en: 'Discover why fistulas frequently return after improper surgeries, and how advanced surgical mapping stops recurrence.',
    excerpt_bn: 'ফিস্টুলা অপারেশন করার পরও কেন আবার হয়? জানুন কীভাবে সঠিক রোগ নির্ণয় ও নিখুঁত সার্জারিতে ফিস্টুলা চিরতরে দূর করা যায়।',
    content_en: `### The Nature of an Anal Fistula
An anal fistula is an abnormal hollow tract running between an infected gland deep inside the anal canal and the external skin. It nearly always originates from a perianal abscess.

### Why Recurrences Happen
1. **Missed secondary tracts:** Complex horseshoe fistulas often branch in multiple directions.
2. **Failure to excise the internal opening:** If the infected crypt gland inside is neglected, pus reforms.
3. **Inappropriate initial drainage:** Incomplete opening leads to quick surface closure while infection lingers underneath.

### Prevention with Dr. Kollol’s Method
- Accurate pre-operative evaluation and tract probing.
- Staged preservation procedures (LIFT, partial fistulotomy with loose seton).
- Careful follow-up dressing ensuring healing from the deep base upwards.`,
    content_bn: `### ফিস্টুলা কেন হয়?
মলদ্বারের ভেতরে থাকা ছোট ছোট গ্রন্থিতে জীবাণু সংক্রমণের ফলে ফোড়া হয়। সেই ফোড়া ফেটে বা কেটে পুঁজ বের করার পর অনেক সময় ভেতরের গ্রন্থি থেকে চামড়ার বাইরে একটি স্থায়ী নালি তৈরি হয়ে যায়, একেই ফিস্টুলা বা ভগন্দর বলে।

### বারবার ফিরে আসার কারণ
১. ফিস্টুলার একাধিক শাখা-প্রশাখা থাকলে তা ঠিকমতো চিহ্নিত না করা।
২. মলদ্বারের ভেতরের প্রধান মুখটি বন্ধ বা অপসারণ না করা।
৩. অভিজ্ঞ সার্জন ছাড়া হাতুড়ে চিকিৎসা নেওয়া বা আংশিক পুঁজ বের করে রাখা।

### স্থায়ীভাবে ফিস্টুলা নিরাময়ের উপায়
- অপারেশনের আগে সঠিক ট্র‍্যাক পরীক্ষা।
- আধুনিক ধাপে ধাপে অপারেশন ও সেটন পদ্ধতি ব্যবহার করা যাতে মল ধরে রাখার ক্ষমতা অক্ষুণ্ণ থাকে।
- অপারেশনের পর ভেতর থেকে সম্পূর্ণ শুকিয়ে আসার যত্নশীল ফলো-আপ।`,
    is_published: true,
    published_at: '2026-10-02T14:00:00Z',
    reading_time_en: '6 min read',
    reading_time_bn: '৬ মিনিট পড়ার সময়',
  },
  {
    id: 4,
    slug: 'blood-in-stool-causes',
    title_en: 'Blood in Stool: Is It Piles, Fissure, or Rectal Cancer?',
    title_bn: 'পায়খানার সাথে রক্ত: পাইলস, ফিশার নাকি ক্যান্সার? লক্ষণ দেখে চিনুন',
    category_slug: 'colorectal',
    excerpt_en: 'Crucial differential diagnostic guidelines to recognize warning signals and act early.',
    excerpt_bn: 'পায়খানার সাথে রক্ত গেলে কখনোই হেলাফেলা করবেন না। জানুন কোন লক্ষণটি নিরীহ আর কোনটি কোলন ক্যান্সারের পূর্বাভাস।',
    content_en: `### Blood in Stool: A Symptom Not to Ignore
Many patients assume any rectal bleeding is simply piles and delay consultation. Understanding distinct symptoms is vital for safety:

| Condition | Bleeding Nature | Pain Level | Associated Symptoms |
|---|---|---|---|
| **Piles** | Fresh bright red, drops or jets in the pan | Painless usually | Soft painless lumps |
| **Anal Fissure** | Streak of blood on hard stool or tissue | Severe burning pain | Intense post-defecation spasm |
| **Colorectal Cancer** | Dark red mixed with stool or mucus | Dull ache or no pain | Change in bowel habits, weight loss |

### Critical Red Flags
- Bleeding onset after 40 years of age.
- Alternating constipation and diarrhoea for over 3 weeks.
- Unexplained weight loss and chronic fatigue.`,
    content_bn: `### পায়খানায় রক্ত মানেই পাইলস নয়
আমাদের দেশের রোগীরা মলদ্বারে রক্ত গেলেই পাইলস ভেবে কবিরাজি বা অপচিকিৎসা নেন। অথচ প্রতিটি রোগের রক্তক্ষরণের ধরন ভিন্ন:

| রোগ | রক্তের ধরন | ব্যথার মাত্রা | অন্যান্য লক্ষণ |
|---|---|---|---|
| **পাইলস** | টাটকা লাল রক্ত ফোঁটায় বা পিচকারির মতো পড়ে | সচরাচর ব্যথা থাকে না | মলত্যাগে মাংসপিণ্ড বা গোটা বের হওয়া |
| **এনাল ফিশার** | শক্ত পায়খানার গায়ে রক্তের দাগ লাগে | মলত্যাগের সময় ও পরে তীব্র জ্বালাপোড়া | পায়খানা করতে প্রচণ্ড ভয় পাওয়া |
| **ক্যান্সার** | কালচে রক্ত বা আম/শ্লেষ্মা মিশ্রিত | শুরুর দিকে ব্যথা থাকে না | ওজন কমে যাওয়া, পায়খানার অভ্যাসের ঘন ঘন বদল |

### বিপদচিহ্নসমূহ
- ৪০ বছর বয়সের পর হঠাৎ রক্তক্ষরণ।
- ৩ সপ্তাহের বেশি সময় ধরে ডায়রিয়া ও কোষ্ঠকাঠিন্যের ওলটপালট।
- রক্তশূন্যতা ও দুর্বলতা।`,
    is_published: true,
    published_at: '2026-10-03T09:00:00Z',
    reading_time_en: '5 min read',
    reading_time_bn: '৫ মিনিট পড়ার সময়',
  },
  {
    id: 5,
    slug: 'anal-fissure-modern-treatment',
    title_en: 'Modern Treatment for Painful Anal Fissure: Relief Without Fear',
    title_bn: 'ফিশারের অসহ্য জ্বালাপোড়া ব্যথার আধুনিক চিকিৎসা',
    category_slug: 'colorectal',
    excerpt_en: 'Learn how chronic fissure pain can be conquered using modern ointments, diet management, and minor sphincter-saving surgery.',
    excerpt_bn: 'মলত্যাগের সময় কাঁচ কাটার মতো জ্বালাপোড়া ব্যথায় ভুগছেন? জেনে নিন ফিশারের সহজ ও আধুনিক চিকিৎসা পদ্ধতি।',
    content_en: `### Understanding Anal Fissures
An anal fissure is a tear in the moist, thin mucosal lining of the lower anal canal, caused primarily by hard, dry bowel movements or prolonged diarrhoea.

### The Pain-Spasm Cycle
The fissure creates sharp pain during stool, triggering involuntary spasm of the internal anal sphincter muscle. This reduces blood supply to the tear, preventing healing and intensifying the pain for hours.

### Modern Non-Surgical Treatment
- GTN ointment or Diltiazem cream to relax the sphincter and restore blood flow.
- High-fibre diet with abundant hydration.
- Stool softeners for 4 to 6 weeks.

### Lateral Internal Sphincterotomy (LIS)
For non-healing chronic fissures, a tiny 5-minute precision procedure relieves muscle spasm permanently with instantaneous pain relief.`,
    content_bn: `### এনাল ফিশার কী?
শক্ত পায়খানার ঘর্ষণে মলদ্বারের ভেতরের পাতলা চামড়া ফেটে ক্ষত তৈরি হলে তাকে এনাল ফিশার বলে। 

### ফিশারের ব্যথার দুষ্টচক্র
মলদ্বারে ফাটল ধরলে মাংসপেশি সংকুচিত হয়ে শক্ত হয়ে যায়। এর ফলে সেখানে রক্ত চলাচল কমে যায় এবং ঘা শুকাতে পারে না। ফলে প্রতিবার মলত্যাগে অসহ্য কাঁচ কাটার মতো জ্বালাপোড়া হয় যা ঘণ্টার পর ঘণ্টা স্থায়ী হয়।

### প্রাথমিক চিকিৎসা
- স্ফিঙ্কটার শিথিল করার বিশেষ মলম ব্যবহার।
- কোষ্ঠকাঠিন্য দূর করতে ফাইবারযুক্ত খাবার ও প্রচুর পানি পান।
- মল নরম রাখার নিরাপদ ওষুধ সেবন।

### ছোট অপারেশন (LIS)
দীর্ঘদিনের পুরনো ফিশার ওষুধে না সারলে মাত্র ৫ মিনিটের ছোট অপারেশনে অতিরিক্ত টানটান পেশি শিথিল করে দেওয়া হয়, যাতে রক্ত সঞ্চালন বেড়ে ঘা দ্রুত শুকিয়ে যায়।`,
    is_published: true,
    published_at: '2026-10-03T11:00:00Z',
    reading_time_en: '4 min read',
    reading_time_bn: '৪ মিনিট পড়ার সময়',
  },
  {
    id: 6,
    slug: 'gallstones-keyhole-surgery-recovery',
    title_en: 'Gallstones & Laparoscopy: When to Resume Work and What to Eat',
    title_bn: 'পিত্তথলির পাথর: ল্যাপারোস্কপির পর কবে কাজে ফিরবেন ও কী খাবেন',
    category_slug: 'gallbladder',
    excerpt_en: 'Everything you need to know about laparoscopic cholecystectomy, post-op recovery timeline, and dietary transitions.',
    excerpt_bn: 'ল্যাপারোস্কপিক পিত্তথলি অপারেশনের পর কত দ্রুত সুস্থ হওয়া যায় এবং অপারেশনের পর খাবারের নিয়ম সম্পর্কে চিকিৎসকের পরামর্শ।',
    content_en: `### Why Gallstones Must Be Removed With the Gallbladder
A common misconception is that gallstones can be crushed or dissolved like kidney stones. Because the diseased gallbladder wall continues to produce stones and carries risk of dangerous infection or cancer, removing the entire gallbladder (**cholecystectomy**) is the world gold standard.

### Recovery Timeline
- **Day 1:** Walking around the hospital room a few hours after surgery; taking liquid food.
- **Day 2:** Discharged to home; comfortable with oral pain medicines.
- **Day 3-5:** Light desk work and gentle walking outdoors.
- **Day 7:** Complete return to driving, normal office work, and daily activities.

### Post-Surgery Diet Tips
- Small frequent meals for the first 2 weeks.
- Avoid excessively heavy, oily, or fried items initially.
- The liver takes over bile storage seamlessly without altering digestion.`,
    content_bn: `### পাথর নয়, পুরো পিত্তথলি কেন ফেলা হয়?
অনেকে ভাবেন কিডনির মতো পিত্তথলির পাথরও ভেঙে ফেলা সম্ভব। কিন্তু পিত্তথলির দেয়ালে ত্রুটি থাকায় পাথর বারবার তৈরি হয় এবং এতে পিত্তনালি বন্ধ হয়ে জন্ডিস বা মারাত্মক সংক্রমণের ঝুঁকি থাকে। তাই ল্যাপারোস্কপির মাধ্যমে পুরো পিত্তথলি অপসারণ করাই বিশ্বজুড়ে একমাত্র স্বীকৃত চিকিৎসা।

### সুস্থ হওয়ার সময়সূচি
- **১ম দিন:** অপারেশনের কয়েক ঘণ্টার মধ্যেই রোগী নিজে হেঁটে বাথরুমে যেতে পারেন ও তরল খাবার খান।
- **২য় দিন:** হাসপাতাল থেকে ছুটি পেয়ে বাড়ি ফেরা।
- **৩-৫ দিন:** ঘরের স্বাভাবিক কাজকর্ম ও হালকা হাঁটাচলা।
- **৭ম দিন:** যেকোনো নিয়মিত অফিস, দোকান বা পড়াশোনার কাজে ফেরা।

### অপারেশনের পর খাদ্যাভ্যাস
- প্রথম ২-৩ সপ্তাহ অতিরিক্ত তৈলাক্ত ও ভাজাপোড়া খাবার পরিহার করা।
- পিত্তথলি না থাকলেও লিভার স্বাভাবিকভাবেই পিত্তরস তৈরি করে হজমপ্রক্রিয়া সম্পূর্ণ ঠিক রাখে।`,
    is_published: true,
    published_at: '2026-10-03T13:00:00Z',
    reading_time_en: '5 min read',
    reading_time_bn: '৫ মিনিট পড়ার সময়',
  },
  {
    id: 7,
    slug: 'laparoscopic-hernia-mesh-repair',
    title_en: 'Laparoscopic Hernia Mesh Repair (TAPP/IPOM): Explained Simply',
    title_bn: 'হার্নিয়া: মেশ দিয়ে ল্যাপারোস্কপিক অপারেশন (TAPP/IPOM) সহজ ভাষায়',
    category_slug: 'abdomen',
    excerpt_en: 'Discover how modern surgical mesh placed via keyhole technique restores abdominal wall strength permanently.',
    excerpt_bn: 'হার্নিয়া হলে কেন মেশ লাগে? জেনে নিন কীভাবে ছোট ছিদ্রের সাহায্যে পেটের ভেতর মেশ বসিয়ে হার্নিয়া সারিয়ে তোলা হয়।',
    content_en: `### What is a Hernia?
A hernia develops when internal organs (most commonly the intestine or intra-abdominal fat) protrude through a weakened zone in the surrounding muscle wall. It will never resolve with medicine or belts.

### Why Mesh Is Indispensable
Simply sewing the weak muscle margins together creates immense tension, leading to failure and recurrence. A specialized synthetic mesh acts as a permanent structural scaffold, allowing natural collagen and fibrous tissue to weave through it.

### Why Keyhole (TAPP/TEP) Repair Is Superior
1. **Mesh placed from the inside:** Pressure from inside pushes the mesh tighter against the wall, following Pascal’s physical law.
2. **Tiny scars:** 3 micro-ports rather than a large painful groin incision.
3. **Bilaterality:** Both sides can be inspected and repaired through the exact same incisions.`,
    content_bn: `### হার্নিয়া কেন হয়?
পেটের মাংসপেশির কোনো অংশ দুর্বল হয়ে ফাঁকা হলে ভেতর থেকে নাড়িভুড়ি বাইরে বেরিয়ে আসে, যাকে হার্নিয়া বলে। এটি কোনো ওষুধ বা বেল্টে সারে না।

### অপারেশনে মেশ কেন দেওয়া হয়?
দুর্বল মাংসপেশি শুধু সেলাই করে দিলে কিছুদিন পর আবার ফেটে হার্নিয়া ফিরে আসার ঝুঁকি থাকে। মেশ হলো বিশেষ ধরনের জাল যা পেটের দেয়ালকে আজীবনের জন্য সুদৃঢ় করে তোলে।

### ল্যাপারোস্কপিক হার্নিয়া অপারেশনের সুবিধা
১. মেশটি পেটের ভেতরের দিক থেকে বসানো হয়, ফলে পেটের ভেতরের চাপে মেশটি দেয়ালের সাথে আরও শক্তভাবে আটকে থাকে।
২. কুঁচকি বড় করে কাটার বদলে মাত্র ৩টি ছোট ছিদ্রে অপারেশন করা হয়।
৩. দুই দিকের কুঁচকিতে হার্নিয়া থাকলেও একই ছিদ্র দিয়ে একসাথে চিকিৎসা করা যায়।`,
    is_published: true,
    published_at: '2026-10-03T15:00:00Z',
    reading_time_en: '5 min read',
    reading_time_bn: '৫ মিনিট পড়ার সময়',
  },
  {
    id: 8,
    slug: 'breast-lump-not-always-cancer',
    title_en: 'A Breast Lump is Not Always Cancer: When To See a Surgeon',
    title_bn: 'স্তনে চাকা মানেই ক্যান্সার নয় — কখন দ্রুত ডাক্তার দেখাবেন',
    category_slug: 'breast',
    excerpt_en: 'Empowering awareness for women and families on diagnosing breast lumps accurately without unnecessary panic.',
    excerpt_bn: 'স্তনে চাকা অনুভব হলে আতঙ্কিত হবেন না। শতকরা ৮০-৯০ ভাগ চাকাই নিরীহ। জানুন কখন ও কীভাবে সঠিক পরীক্ষা করাবেন।',
    content_en: `### Panic vs Preparation
Discovering a breast lump causes immediate dread of cancer. However, medical statistics show that 80-90% of palpable breast lumps in women under 40 are benign conditions.

### Common Benign Lumps
- **Fibroadenoma:** Firm, smooth, slippery rubbery lumps that move freely under the fingertips ("breast mouse").
- **Fibrocystic changes:** Fluid-filled tender sacs that fluctuate with monthly cycles.
- **Breast abscess:** Painful red swelling occurring during breastfeeding.

### When to Seek Immediate Surgical Evaluation
- Lump feels hard, uneven, or stuck to skin or chest wall.
- Spontaneous bloody discharge from one nipple.
- Nipple turns inward or skin looks dimpled like orange peel.
- Persistent lumps developing after menopause.`,
    content_bn: `### আতঙ্ক নয়, সচেতন হোন
স্তনে চাকা মানেই ক্যান্সার এমন ধারণা ভুল। ৪০ বছরের কম বয়সী নারীদের ক্ষেত্রে শতকরা প্রায় ৯০ ভাগ চাকাই সম্পূর্ণ নিরীহ।

### নিরীহ চাকার প্রকারভেদ
- **ফাইব্রোঅ্যাডেনোমা:** মসৃণ ও সহজে নড়াচড়া করে এমন ব্যথাহীন চাকা, যা সাধারণত তরুণীদের বেশি হয়।
- **সিস্ট বা পানিভরা থলি:** মাসিকের হরমোনের তারতম্যে তৈরি হওয়া চাকা যা মাসিকের আগে ব্যথা করতে পারে।
- **স্তনে ফোড়া:** বিশেষ করে স্তন্যদানকারী মায়েদের দুধ জমে প্রদাহ থেকে ফোড়া হতে পারে।

### যেসব ক্ষেত্রে দ্রুত সার্জন দেখাবেন
- চাকা যদি পাথরের মতো শক্ত ও অনড় মনে হয়।
- বোঁটা ভেতরের দিকে দেবে গেলে বা রক্তক্ষরণ হলে।
- স্তনের চামড়া কমলার খোসার মতো কুঁচকে গেলে।
- মেনোপজ বা মাসিক স্থায়ীভাবে বন্ধ হওয়ার পর নতুন চাকা দেখা দিলে।`,
    is_published: true,
    published_at: '2026-10-03T16:00:00Z',
    reading_time_en: '5 min read',
    reading_time_bn: '৫ মিনিট পড়ার সময়',
  },
  {
    id: 9,
    slug: 'appendicitis-signs-and-dangers',
    title_en: 'Appendicitis Signs: Why Delaying Medical Care Is Extremely Dangerous',
    title_bn: 'অ্যাপেন্ডিসাইটিসের লক্ষণ: দেরি করলে কী বিপদ হতে পারে',
    category_slug: 'abdomen',
    excerpt_en: 'Learn how to identify genuine appendicitis pain, avoid painkiller masking, and prevent appendix rupture.',
    excerpt_bn: 'পেটে ব্যথা হলেই ব্যথানাশক ওষুধ খাবেন না। অ্যাপেন্ডিক্স ফেটে যাওয়ার মতো মারাত্মক বিপদ এড়াতে জেনে নিন আসল লক্ষণ।',
    content_en: `### The Function and Danger of the Appendix
The appendix is a small, finger-shaped pouch projecting from the right side of the large intestine. When its opening becomes blocked by hard stool or swollen lymphoid tissue, bacterial multiplication triggers rapid inflammation.

### Typical Sequence of Symptoms
1. Dull aching pain commencing around the umbilicus (navel).
2. The pain shifts after several hours directly to the right lower abdomen.
3. Movement, coughing, or pressing the area causes severe tenderness.
4. Accompanying nausea, loss of appetite, and mild fever.

### The Lethal Danger of Rupture
Taking strong painkillers without consulting a surgeon temporarily masks symptoms. Meanwhile, the appendix swells until it **perforates (bursts)**, spilling contaminated pus throughout the abdominal cavity (**peritonitis**), requiring extensive emergency surgery.`,
    content_bn: `### অ্যাপেন্ডিক্স কী ও কেন প্রদাহ হয়?
অ্যাপেন্ডিক্স হলো নাড়িভুড়ির শুরুর দিকে থাকা একটি ছোট আঙুলের মতো থলি। কোনো কারণে এর মুখ শক্ত মলে আটকে গেলে ভেতরে ব্যাকটেরিয়া দ্রুত ছড়িয়ে পড়ে ফুলে ওঠে, যাকে অ্যাপেন্ডিসাইটিস বলে।

### উপসর্গের ধারাবাহিকতা
১. প্রথমে নাভির চারপাশজুড়ে নিস্তেজ ব্যথা শুরু হয়।
২. কয়েক ঘণ্টা পর ব্যথা স্থায়ীভাবে তলপেটের ডান পাশে চলে আসে এবং তীব্র হতে থাকে।
৩. কাশি দিলে, হাঁটলে বা চাপ দিলে ব্যথা বাড়ে।
৪. খাবারে সম্পূর্ণ অরুচি, বমি ভাব ও হালকা জ্বর থাকে।

### ফেটে যাওয়ার মারাত্মক ঝুঁকি
ডাক্তার না দেখিয়ে দোকান থেকে কড়া ব্যথানাশক ট্যাবলেট খেলে ব্যথা সাময়িক কমে যায় ঠিকই, কিন্তু ভেতরে জীবাণুর বিস্তার থামে না। ফলে অ্যাপেন্ডিক্স ফেটে গিয়ে পুরো পেটে পুঁজ ছড়িয়ে জীবন সংকটাপন্ন হতে পারে। তাই দ্রুত ল্যাপারোস্কপিক অপারেশনই একমাত্র নিরাপদ সমাধান।`,
    is_published: true,
    published_at: '2026-10-03T17:00:00Z',
    reading_time_en: '4 min read',
    reading_time_bn: '৪ মিনিট পড়ার সময়',
  },
  {
    id: 10,
    slug: 'surgery-faqs-ten-patient-questions',
    title_en: '10 Questions Patients Ask Most Before and After Surgery',
    title_bn: 'অপারেশনের আগে-পরে রোগীদের সবচেয়ে বেশি করা ১০টি প্রশ্ন',
    category_slug: 'colorectal',
    excerpt_en: 'Clear, compassionate answers to essential queries regarding fasting, anaesthesia, recovery, bathing, and diet.',
    excerpt_bn: 'অপারেশন নিয়ে সাধারণ মানুষের মনে থাকা ১০টি প্রধান প্রশ্নের খোলামেলা ও নির্ভরযোগ্য উত্তর।',
    content_en: `### Frequently Asked Surgical Questions
**1. How long do I fast before surgery?**
No solid food for 6 hours; clear water up to 2 hours before general or spinal anaesthesia.

**2. Will I feel pain during surgery?**
No. Modern spinal or general anaesthesia guarantees absolute painlessness throughout the surgical procedure.

**3. When can I shower after surgery?**
With waterproof sterile dressings, showering is often permitted 48 hours post-operation.

**4. When can I climb stairs?**
Light stair climbing is safe from day 2 for keyhole surgeries.

**5. Does keyhole surgery leave visible marks?**
Tiny 5mm marks fade significantly within a few months into barely visible thin lines.`,
    content_bn: `### রোগীদের সচরাচর প্রশ্ন ও উত্তর
**১. অপারেশনের কতক্ষণ আগে না খেয়ে থাকতে হয়?**
সাধারণত অপারেশনের ৬ ঘণ্টা আগে কোনো ভারী খাবার খাওয়া যায় না। অপারেশনের ২ ঘণ্টা আগ পর্যন্ত অল্প পরিষ্কার পানি পান করা যেতে পারে।

**২. অপারেশনের সময় কি কোনো ব্যথা পাওয়া যায়?**
একদমই না। আধুনিক অবশকরণ (অ্যানেস্থেসিয়া) পদ্ধতিতে রোগী সম্পূর্ণ ব্যথামুক্ত থাকেন।

**৩. অপারেশনের কতদিন পর গোসল করা যায়?**
ওয়াটারপ্রুফ ড্রেসিং করা থাকলে অপারেশনের ৪৮ ঘণ্টা পর থেকেই সাবধানে গোসল করা যায়।

**৪. সিঁড়ি দিয়ে ওঠা-নামা করা যাবে কি?**
ল্যাপারোস্কপিক অপারেশনের দ্বিতীয় দিন থেকেই ধীরেসুস্থে সিঁড়ি ব্যবহার করা সম্পূর্ণ নিরাপদ।

**৫. ল্যাপারোস্কপির দাগ কি স্থায়ী হয়?**
মাত্র ৩-৫ মিলিমিটারের দাগ কয়েক মাসের মধ্যেই মিলিয়ে গিয়ে প্রায় অদৃশ্য হয়ে যায়।`,
    is_published: true,
    published_at: '2026-10-03T18:00:00Z',
    reading_time_en: '6 min read',
    reading_time_bn: '৬ মিনিট পড়ার সময়',
  },
];
