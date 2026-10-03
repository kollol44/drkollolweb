export type Language = 'en' | 'bn';

export interface SiteSettings {
  id: string;
  brand_name_en: string;
  brand_name_bn: string;
  phone_serial: string;
  phone_call: string;
  phone_assistant: string;
  whatsapp_url: string;
  email: string;
  bmdc_reg: string;
  notice_banner_active: boolean;
  notice_banner_en?: string;
  notice_banner_bn?: string;
  disclaimer_en: string;
  disclaimer_bn: string;
  updated_at?: string;
}

export interface HeroSection {
  id: string;
  h1_en: string;
  h1_bn: string;
  h2_en: string;
  h2_bn: string;
  meet_cta_en: string;
  meet_cta_bn: string;
  scroll_cue_en: string;
  scroll_cue_bn: string;
  updated_at?: string;
}

export interface StatItem {
  num_en: string;
  num_bn: string;
  label_en: string;
  label_bn: string;
}

export interface DegreesTickerItem {
  en: string;
  bn: string;
}

export interface SurgeonProfile {
  id: string;
  name_en: string;
  name_bn: string;
  intro_word_en: string;
  intro_word_bn: string;
  role_en: string;
  role_bn: string;
  post_en: string;
  post_bn: string;
  chambers_summary_en: string;
  chambers_summary_bn: string;
  degrees_badges: string[];
  stats: StatItem[];
  degrees_ticker: DegreesTickerItem[];
  updated_at?: string;
}

export interface Category {
  slug: string;
  sort_order: number;
  name_en: string;
  name_bn: string;
  desc_en: string;
  desc_bn: string;
}

export interface Condition {
  slug: string;
  category_slug: string;
  sort_order: number;
  is_laparoscopic: boolean;
  is_hidden: boolean;
  home_order?: number | null;
  home_word_en?: string | null;
  home_word_bn?: string | null;
  name_en: string;
  name_bn: string;
  med_en: string;
  med_bn: string;
  short_en: string;
  short_bn: string;
  what_en: string;
  what_bn: string;
  symptoms_en: string[];
  symptoms_bn: string[];
  treat_en: string[];
  treat_bn: string[];
  when_en: string;
  when_bn: string;
  stat_en?: string;
  stat_bn?: string;
  image_url: string;
}

export interface SerialStep {
  step_number: number;
  title_en: string;
  title_bn: string;
  desc_en: string;
  desc_bn: string;
  primary_btn_text_en: string;
  primary_btn_text_bn: string;
  primary_btn_link: string;
  secondary_btn_text_en?: string;
  secondary_btn_text_bn?: string;
  secondary_btn_link?: string;
}

export interface Chamber {
  id: number;
  name_en: string;
  name_bn: string;
  schedule_en: string;
  schedule_bn: string;
  address_en: string;
  address_bn: string;
  timing_en: string;
  timing_bn: string;
  map_query: string;
  is_highlighted: boolean;
  is_map_verified: boolean;
  sort_order: number;
}

export interface Review {
  id: number;
  author_name_en: string;
  author_name_bn: string;
  author_meta_en: string;
  author_meta_bn: string;
  quote_en: string;
  quote_bn: string;
  rating: number;
  is_sample: boolean;
  is_featured: boolean;
  sort_order: number;
}

export interface FAQ {
  id: number;
  question_en: string;
  question_bn: string;
  answer_en: string;
  answer_bn: string;
  sort_order: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title_en: string;
  title_bn: string;
  category_slug: string;
  excerpt_en: string;
  excerpt_bn: string;
  content_en: string;
  content_bn: string;
  cover_image?: string;
  is_published: boolean;
  published_at: string;
  reading_time_en?: string;
  reading_time_bn?: string;
}

export interface Appointment {
  id?: string;
  patient_name: string;
  patient_phone: string;
  chamber_id?: number | null;
  chamber_name: string;
  preferred_date: string;
  problem_summary?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  source?: string;
  created_at?: string;
}
