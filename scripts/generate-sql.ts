import fs from 'fs';
import path from 'path';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HERO_SECTION,
  DEFAULT_SURGEON_PROFILE,
  DEFAULT_CATEGORIES,
  DEFAULT_CONDITIONS,
  DEFAULT_SERIAL_STEPS,
  DEFAULT_CHAMBERS,
  DEFAULT_REVIEWS,
  DEFAULT_FAQS,
  DEFAULT_BLOGS,
} from '../src/lib/content/default-data';

function esc(val: string | null | undefined): string {
  if (val === null || val === undefined) return 'NULL';
  return `'${val.replace(/'/g, "''")}'`;
}

function escArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "'{}'::TEXT[]";
  const elements = arr.map((item) => esc(item)).join(', ');
  return `ARRAY[${elements}]::TEXT[]`;
}

function escJson(obj: any): string {
  if (obj === null || obj === undefined) return "'{}'::JSONB";
  const str = JSON.stringify(obj).replace(/'/g, "''");
  return `'${str}'::JSONB`;
}

let sql = `-- ==================================================================================
-- Supabase Consolidated Database Schema & Complete Seed Migration
-- Dr. Fahim Foysal Kollol Official Medical Platform
--
-- INCLUDES:
--  1. PostgreSQL Extensions
--  2. 11 Core Clinical Tables with Foreign Keys and Constraints
--  3. High-Performance Query Indexes
--  4. Automatic updated_at Trigger Functions
--  5. Comprehensive Row-Level Security (RLS) & Role-Based Policies
--  6. 100% Seed Data: Settings, Hero, Profile, 7 Categories, 26 Conditions,
--     3 Serial Steps, 3 Chambers, 4 Reviews, 7 FAQs, 10 Rich Blogs
-- ==================================================================================

-- ----------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------------
-- 2. AUTOMATIC TIMESTAMP TRIGGER
-- ----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------------
-- 3. TABLES DEFINITION
-- ----------------------------------------------------------------------------------

-- 3.1 Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    brand_name_en TEXT NOT NULL DEFAULT 'Dr. Kollol',
    brand_name_bn TEXT NOT NULL DEFAULT 'ডাঃ কল্লোল',
    phone_serial TEXT NOT NULL DEFAULT '01750529252',
    phone_call TEXT NOT NULL DEFAULT '01670879100',
    phone_assistant TEXT NOT NULL DEFAULT '01671-869026',
    whatsapp_url TEXT NOT NULL DEFAULT 'https://wa.me/8801670879100',
    email TEXT NOT NULL DEFAULT 'kollolsomc44@gmail.com',
    bmdc_reg TEXT NOT NULL DEFAULT 'A-61041',
    notice_banner_active BOOLEAN NOT NULL DEFAULT FALSE,
    notice_banner_en TEXT DEFAULT '',
    notice_banner_bn TEXT DEFAULT '',
    disclaimer_en TEXT NOT NULL DEFAULT 'Information on this site is not a substitute for professional medical consultation or examination.',
    disclaimer_bn TEXT NOT NULL DEFAULT 'এই সাইটের তথ্য কোনোভাবেই সরাসরি ডাক্তার দেখানোর বা চিকিৎসার বিকল্প নয়।',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Hero Section
CREATE TABLE IF NOT EXISTS public.hero_section (
    id TEXT PRIMARY KEY DEFAULT 'hero_main',
    h1_en TEXT NOT NULL,
    h1_bn TEXT NOT NULL,
    h2_en TEXT NOT NULL,
    h2_bn TEXT NOT NULL,
    meet_cta_en TEXT NOT NULL,
    meet_cta_bn TEXT NOT NULL,
    scroll_cue_en TEXT NOT NULL,
    scroll_cue_bn TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Surgeon Profile
CREATE TABLE IF NOT EXISTS public.surgeon_profile (
    id TEXT PRIMARY KEY DEFAULT 'kollol',
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    intro_word_en TEXT NOT NULL,
    intro_word_bn TEXT NOT NULL,
    role_en TEXT NOT NULL,
    role_bn TEXT NOT NULL,
    post_en TEXT NOT NULL,
    post_bn TEXT NOT NULL,
    chambers_summary_en TEXT NOT NULL,
    chambers_summary_bn TEXT NOT NULL,
    degrees_badges JSONB NOT NULL DEFAULT '[]'::JSONB,
    stats JSONB NOT NULL DEFAULT '[]'::JSONB,
    degrees_ticker JSONB NOT NULL DEFAULT '[]'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Categories
CREATE TABLE IF NOT EXISTS public.categories (
    slug TEXT PRIMARY KEY,
    sort_order INT NOT NULL DEFAULT 0,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    desc_bn TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Clinical Conditions (26 items across 7 specialties)
CREATE TABLE IF NOT EXISTS public.conditions (
    slug TEXT PRIMARY KEY,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    sort_order INT NOT NULL DEFAULT 0,
    is_laparoscopic BOOLEAN NOT NULL DEFAULT FALSE,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    home_order INT DEFAULT NULL,
    home_word_en TEXT DEFAULT NULL,
    home_word_bn TEXT DEFAULT NULL,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    med_en TEXT DEFAULT '',
    med_bn TEXT DEFAULT '',
    short_en TEXT NOT NULL,
    short_bn TEXT NOT NULL,
    what_en TEXT NOT NULL,
    what_bn TEXT NOT NULL,
    symptoms_en TEXT[] NOT NULL DEFAULT '{}',
    symptoms_bn TEXT[] NOT NULL DEFAULT '{}',
    treat_en TEXT[] NOT NULL DEFAULT '{}',
    treat_bn TEXT[] NOT NULL DEFAULT '{}',
    when_en TEXT NOT NULL,
    when_bn TEXT NOT NULL,
    stat_en TEXT DEFAULT '',
    stat_bn TEXT DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 Serial Steps
CREATE TABLE IF NOT EXISTS public.serial_steps (
    step_number INT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    desc_bn TEXT NOT NULL,
    primary_btn_text_en TEXT NOT NULL,
    primary_btn_text_bn TEXT NOT NULL,
    primary_btn_link TEXT NOT NULL,
    secondary_btn_text_en TEXT DEFAULT '',
    secondary_btn_text_bn TEXT DEFAULT '',
    secondary_btn_link TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 Chambers
CREATE TABLE IF NOT EXISTS public.chambers (
    id SERIAL PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    schedule_en TEXT NOT NULL,
    schedule_bn TEXT NOT NULL,
    address_en TEXT NOT NULL,
    address_bn TEXT NOT NULL,
    timing_en TEXT NOT NULL,
    timing_bn TEXT NOT NULL,
    map_query TEXT NOT NULL,
    is_highlighted BOOLEAN NOT NULL DEFAULT FALSE,
    is_map_verified BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    author_name_en TEXT NOT NULL,
    author_name_bn TEXT NOT NULL,
    author_meta_en TEXT NOT NULL,
    author_meta_bn TEXT NOT NULL,
    quote_en TEXT NOT NULL,
    quote_bn TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    is_sample BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9 FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
    id SERIAL PRIMARY KEY,
    question_en TEXT NOT NULL,
    question_bn TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_bn TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10 Blogs (Medical Articles)
CREATE TABLE IF NOT EXISTS public.blogs (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    excerpt_en TEXT NOT NULL,
    excerpt_bn TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_bn TEXT NOT NULL,
    cover_image TEXT DEFAULT '',
    reading_time_en TEXT DEFAULT '4 min read',
    reading_time_bn TEXT DEFAULT '৪ মিনিট পড়ার সময়',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.11 Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY DEFAULT ('apt_' || replace(gen_random_uuid()::TEXT, '-', '')),
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    chamber_id INT REFERENCES public.chambers(id) ON DELETE SET NULL,
    chamber_name TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    problem_summary TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    source TEXT DEFAULT 'website',
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.12 Admin Users (Authentication & Role Management)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'super_admin',
    full_name TEXT NOT NULL DEFAULT 'Dr. Fahim Foysal Kollol',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_conditions_category ON public.conditions(category_slug);
CREATE INDEX IF NOT EXISTS idx_conditions_home_order ON public.conditions(home_order);
CREATE INDEX IF NOT EXISTS idx_conditions_hidden ON public.conditions(is_hidden);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category_slug);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON public.appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- ----------------------------------------------------------------------------------
-- 5. AUTOMATIC UPDATE TRIGGERS & PROCEDURES
-- ----------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_hero_section_updated ON public.hero_section;
CREATE TRIGGER trg_hero_section_updated BEFORE UPDATE ON public.hero_section FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_surgeon_profile_updated ON public.surgeon_profile;
CREATE TRIGGER trg_surgeon_profile_updated BEFORE UPDATE ON public.surgeon_profile FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated ON public.categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_conditions_updated ON public.conditions;
CREATE TRIGGER trg_conditions_updated BEFORE UPDATE ON public.conditions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_serial_steps_updated ON public.serial_steps;
CREATE TRIGGER trg_serial_steps_updated BEFORE UPDATE ON public.serial_steps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_chambers_updated ON public.chambers;
CREATE TRIGGER trg_chambers_updated BEFORE UPDATE ON public.chambers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_blogs_updated ON public.blogs;
CREATE TRIGGER trg_blogs_updated BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_admin_users_updated ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5.1 Secure Admin Login Verification Procedure (Runs inside DB with Bcrypt check)
CREATE OR REPLACE FUNCTION public.verify_admin_login(p_identifier TEXT, p_password TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    role TEXT,
    full_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    UPDATE public.admin_users u
    SET last_login_at = NOW()
    WHERE (LOWER(u.email) = LOWER(p_identifier) OR LOWER(u.username) = LOWER(p_identifier))
      AND u.is_active = TRUE
      AND u.password_hash = crypt(p_password, u.password_hash)
    RETURNING u.id, u.email, u.username, u.role, u.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------------
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgeon_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serial_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chambers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to prevent duplicate policy errors on re-runs
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Hero Section" ON public.hero_section;
DROP POLICY IF EXISTS "Public Read Surgeon Profile" ON public.surgeon_profile;
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Conditions" ON public.conditions;
DROP POLICY IF EXISTS "Public Read Serial Steps" ON public.serial_steps;
DROP POLICY IF EXISTS "Public Read Chambers" ON public.chambers;
DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Read FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Public Read Blogs" ON public.blogs;
DROP POLICY IF EXISTS "Public Insert Appointments" ON public.appointments;

DROP POLICY IF EXISTS "Admin All Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin All Hero Section" ON public.hero_section;
DROP POLICY IF EXISTS "Admin All Surgeon Profile" ON public.surgeon_profile;
DROP POLICY IF EXISTS "Admin All Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin All Conditions" ON public.conditions;
DROP POLICY IF EXISTS "Admin All Serial Steps" ON public.serial_steps;
DROP POLICY IF EXISTS "Admin All Chambers" ON public.chambers;
DROP POLICY IF EXISTS "Admin All Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin All FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Admin All Blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin All Appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin All Admin Users" ON public.admin_users;

-- 6.1 Public Read-Only Policies (Accessible by website visitors and search engines)
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Section" ON public.hero_section FOR SELECT USING (true);
CREATE POLICY "Public Read Surgeon Profile" ON public.surgeon_profile FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Conditions" ON public.conditions FOR SELECT USING (is_hidden = false OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Serial Steps" ON public.serial_steps FOR SELECT USING (true);
CREATE POLICY "Public Read Chambers" ON public.chambers FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

-- 6.2 Patient Appointment Booking (Public can insert their booking; cannot view or edit others')
CREATE POLICY "Public Insert Appointments" ON public.appointments FOR INSERT WITH CHECK (
    char_length(patient_name) >= 2 AND
    char_length(patient_phone) >= 10
);

-- 6.3 Authenticated & Service Role Full Control (CMS Admin Panel & Server Functions)
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Hero Section" ON public.hero_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Surgeon Profile" ON public.surgeon_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Conditions" ON public.conditions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Serial Steps" ON public.serial_steps FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Chambers" ON public.chambers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All FAQs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Appointments" ON public.appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Admin Users" ON public.admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------------
-- 7. COMPLETE INITIAL SEED DATA
-- ----------------------------------------------------------------------------------

`;

// 7.1 Site Settings Seed
sql += `-- 7.1 Site Settings
INSERT INTO public.site_settings (
    id, brand_name_en, brand_name_bn, phone_serial, phone_call, phone_assistant,
    whatsapp_url, email, bmdc_reg, notice_banner_active, notice_banner_en,
    notice_banner_bn, disclaimer_en, disclaimer_bn
) VALUES (
    ${esc(DEFAULT_SITE_SETTINGS.id)},
    ${esc(DEFAULT_SITE_SETTINGS.brand_name_en)},
    ${esc(DEFAULT_SITE_SETTINGS.brand_name_bn)},
    ${esc(DEFAULT_SITE_SETTINGS.phone_serial)},
    ${esc(DEFAULT_SITE_SETTINGS.phone_call)},
    ${esc(DEFAULT_SITE_SETTINGS.phone_assistant)},
    ${esc(DEFAULT_SITE_SETTINGS.whatsapp_url)},
    ${esc(DEFAULT_SITE_SETTINGS.email)},
    ${esc(DEFAULT_SITE_SETTINGS.bmdc_reg)},
    ${DEFAULT_SITE_SETTINGS.notice_banner_active ? 'TRUE' : 'FALSE'},
    ${esc(DEFAULT_SITE_SETTINGS.notice_banner_en || '')},
    ${esc(DEFAULT_SITE_SETTINGS.notice_banner_bn || '')},
    ${esc(DEFAULT_SITE_SETTINGS.disclaimer_en)},
    ${esc(DEFAULT_SITE_SETTINGS.disclaimer_bn)}
) ON CONFLICT (id) DO UPDATE SET
    brand_name_en = EXCLUDED.brand_name_en,
    brand_name_bn = EXCLUDED.brand_name_bn,
    phone_serial = EXCLUDED.phone_serial,
    phone_call = EXCLUDED.phone_call,
    phone_assistant = EXCLUDED.phone_assistant,
    whatsapp_url = EXCLUDED.whatsapp_url,
    email = EXCLUDED.email,
    bmdc_reg = EXCLUDED.bmdc_reg,
    notice_banner_active = EXCLUDED.notice_banner_active,
    notice_banner_en = EXCLUDED.notice_banner_en,
    notice_banner_bn = EXCLUDED.notice_banner_bn,
    disclaimer_en = EXCLUDED.disclaimer_en,
    disclaimer_bn = EXCLUDED.disclaimer_bn,
    updated_at = NOW();

`;

// 7.2 Hero Section Seed
sql += `-- 7.2 Hero Section
INSERT INTO public.hero_section (
    id, h1_en, h1_bn, h2_en, h2_bn, meet_cta_en, meet_cta_bn, scroll_cue_en, scroll_cue_bn
) VALUES (
    ${esc(DEFAULT_HERO_SECTION.id)},
    ${esc(DEFAULT_HERO_SECTION.h1_en)},
    ${esc(DEFAULT_HERO_SECTION.h1_bn)},
    ${esc(DEFAULT_HERO_SECTION.h2_en)},
    ${esc(DEFAULT_HERO_SECTION.h2_bn)},
    ${esc(DEFAULT_HERO_SECTION.meet_cta_en)},
    ${esc(DEFAULT_HERO_SECTION.meet_cta_bn)},
    ${esc(DEFAULT_HERO_SECTION.scroll_cue_en)},
    ${esc(DEFAULT_HERO_SECTION.scroll_cue_bn)}
) ON CONFLICT (id) DO UPDATE SET
    h1_en = EXCLUDED.h1_en,
    h1_bn = EXCLUDED.h1_bn,
    h2_en = EXCLUDED.h2_en,
    h2_bn = EXCLUDED.h2_bn,
    meet_cta_en = EXCLUDED.meet_cta_en,
    meet_cta_bn = EXCLUDED.meet_cta_bn,
    scroll_cue_en = EXCLUDED.scroll_cue_en,
    scroll_cue_bn = EXCLUDED.scroll_cue_bn,
    updated_at = NOW();

`;

// 7.3 Surgeon Profile Seed
sql += `-- 7.3 Surgeon Profile
INSERT INTO public.surgeon_profile (
    id, name_en, name_bn, intro_word_en, intro_word_bn, role_en, role_bn,
    post_en, post_bn, chambers_summary_en, chambers_summary_bn,
    degrees_badges, stats, degrees_ticker
) VALUES (
    ${esc(DEFAULT_SURGEON_PROFILE.id)},
    ${esc(DEFAULT_SURGEON_PROFILE.name_en)},
    ${esc(DEFAULT_SURGEON_PROFILE.name_bn)},
    ${esc(DEFAULT_SURGEON_PROFILE.intro_word_en)},
    ${esc(DEFAULT_SURGEON_PROFILE.intro_word_bn)},
    ${esc(DEFAULT_SURGEON_PROFILE.role_en)},
    ${esc(DEFAULT_SURGEON_PROFILE.role_bn)},
    ${esc(DEFAULT_SURGEON_PROFILE.post_en)},
    ${esc(DEFAULT_SURGEON_PROFILE.post_bn)},
    ${esc(DEFAULT_SURGEON_PROFILE.chambers_summary_en)},
    ${esc(DEFAULT_SURGEON_PROFILE.chambers_summary_bn)},
    ${escJson(DEFAULT_SURGEON_PROFILE.degrees_badges)},
    ${escJson(DEFAULT_SURGEON_PROFILE.stats)},
    ${escJson(DEFAULT_SURGEON_PROFILE.degrees_ticker)}
) ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    intro_word_en = EXCLUDED.intro_word_en,
    intro_word_bn = EXCLUDED.intro_word_bn,
    role_en = EXCLUDED.role_en,
    role_bn = EXCLUDED.role_bn,
    post_en = EXCLUDED.post_en,
    post_bn = EXCLUDED.post_bn,
    chambers_summary_en = EXCLUDED.chambers_summary_en,
    chambers_summary_bn = EXCLUDED.chambers_summary_bn,
    degrees_badges = EXCLUDED.degrees_badges,
    stats = EXCLUDED.stats,
    degrees_ticker = EXCLUDED.degrees_ticker,
    updated_at = NOW();

`;

// 7.4 Categories Seed
sql += `-- 7.4 Categories (7 Clinical Domains)
INSERT INTO public.categories (slug, sort_order, name_en, name_bn, desc_en, desc_bn) VALUES
${DEFAULT_CATEGORIES.map(
  (c) =>
    `(${esc(c.slug)}, ${c.sort_order}, ${esc(c.name_en)}, ${esc(c.name_bn)}, ${esc(c.desc_en)}, ${esc(c.desc_bn)})`
).join(',\n')}
ON CONFLICT (slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    desc_en = EXCLUDED.desc_en,
    desc_bn = EXCLUDED.desc_bn,
    updated_at = NOW();

`;

// 7.5 Conditions Seed (26 Conditions)
sql += `-- 7.5 Conditions (All 26 Conditions with Symptoms and Treatments)
INSERT INTO public.conditions (
    slug, category_slug, sort_order, is_laparoscopic, is_hidden, home_order,
    home_word_en, home_word_bn, name_en, name_bn, med_en, med_bn,
    short_en, short_bn, what_en, what_bn, symptoms_en, symptoms_bn,
    treat_en, treat_bn, when_en, when_bn, stat_en, stat_bn, image_url
) VALUES
${DEFAULT_CONDITIONS.map((c) => {
  return `(
    ${esc(c.slug)},
    ${esc(c.category_slug)},
    ${c.sort_order},
    ${c.is_laparoscopic ? 'TRUE' : 'FALSE'},
    ${c.is_hidden ? 'TRUE' : 'FALSE'},
    ${c.home_order ?? 'NULL'},
    ${esc(c.home_word_en)},
    ${esc(c.home_word_bn)},
    ${esc(c.name_en)},
    ${esc(c.name_bn)},
    ${esc(c.med_en)},
    ${esc(c.med_bn)},
    ${esc(c.short_en)},
    ${esc(c.short_bn)},
    ${esc(c.what_en)},
    ${esc(c.what_bn)},
    ${escArray(c.symptoms_en)},
    ${escArray(c.symptoms_bn)},
    ${escArray(c.treat_en)},
    ${escArray(c.treat_bn)},
    ${esc(c.when_en)},
    ${esc(c.when_bn)},
    ${esc(c.stat_en || '')},
    ${esc(c.stat_bn || '')},
    ${esc(c.image_url)}
)`;
}).join(',\n')}
ON CONFLICT (slug) DO UPDATE SET
    category_slug = EXCLUDED.category_slug,
    sort_order = EXCLUDED.sort_order,
    is_laparoscopic = EXCLUDED.is_laparoscopic,
    is_hidden = EXCLUDED.is_hidden,
    home_order = EXCLUDED.home_order,
    home_word_en = EXCLUDED.home_word_en,
    home_word_bn = EXCLUDED.home_word_bn,
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    med_en = EXCLUDED.med_en,
    med_bn = EXCLUDED.med_bn,
    short_en = EXCLUDED.short_en,
    short_bn = EXCLUDED.short_bn,
    what_en = EXCLUDED.what_en,
    what_bn = EXCLUDED.what_bn,
    symptoms_en = EXCLUDED.symptoms_en,
    symptoms_bn = EXCLUDED.symptoms_bn,
    treat_en = EXCLUDED.treat_en,
    treat_bn = EXCLUDED.treat_bn,
    when_en = EXCLUDED.when_en,
    when_bn = EXCLUDED.when_bn,
    stat_en = EXCLUDED.stat_en,
    stat_bn = EXCLUDED.stat_bn,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

`;

// 7.6 Serial Steps Seed
sql += `-- 7.6 Serial Steps (3 Guided Steps)
INSERT INTO public.serial_steps (
    step_number, title_en, title_bn, desc_en, desc_bn,
    primary_btn_text_en, primary_btn_text_bn, primary_btn_link,
    secondary_btn_text_en, secondary_btn_text_bn, secondary_btn_link
) VALUES
${DEFAULT_SERIAL_STEPS.map(
  (s) => `(
    ${s.step_number},
    ${esc(s.title_en)},
    ${esc(s.title_bn)},
    ${esc(s.desc_en)},
    ${esc(s.desc_bn)},
    ${esc(s.primary_btn_text_en)},
    ${esc(s.primary_btn_text_bn)},
    ${esc(s.primary_btn_link)},
    ${esc(s.secondary_btn_text_en || '')},
    ${esc(s.secondary_btn_text_bn || '')},
    ${esc(s.secondary_btn_link || '')}
)`
).join(',\n')}
ON CONFLICT (step_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_bn = EXCLUDED.title_bn,
    desc_en = EXCLUDED.desc_en,
    desc_bn = EXCLUDED.desc_bn,
    primary_btn_text_en = EXCLUDED.primary_btn_text_en,
    primary_btn_text_bn = EXCLUDED.primary_btn_text_bn,
    primary_btn_link = EXCLUDED.primary_btn_link,
    secondary_btn_text_en = EXCLUDED.secondary_btn_text_en,
    secondary_btn_text_bn = EXCLUDED.secondary_btn_text_bn,
    secondary_btn_link = EXCLUDED.secondary_btn_link,
    updated_at = NOW();

`;

// 7.7 Chambers Seed
sql += `-- 7.7 Chambers (3 Visiting Chambers)
INSERT INTO public.chambers (
    id, name_en, name_bn, schedule_en, schedule_bn, address_en, address_bn,
    timing_en, timing_bn, map_query, is_highlighted, is_map_verified, sort_order
) VALUES
${DEFAULT_CHAMBERS.map(
  (c) => `(
    ${c.id},
    ${esc(c.name_en)},
    ${esc(c.name_bn)},
    ${esc(c.schedule_en)},
    ${esc(c.schedule_bn)},
    ${esc(c.address_en)},
    ${esc(c.address_bn)},
    ${esc(c.timing_en)},
    ${esc(c.timing_bn)},
    ${esc(c.map_query)},
    ${c.is_highlighted ? 'TRUE' : 'FALSE'},
    ${c.is_map_verified ? 'TRUE' : 'FALSE'},
    ${c.sort_order}
)`
).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    schedule_en = EXCLUDED.schedule_en,
    schedule_bn = EXCLUDED.schedule_bn,
    address_en = EXCLUDED.address_en,
    address_bn = EXCLUDED.address_bn,
    timing_en = EXCLUDED.timing_en,
    timing_bn = EXCLUDED.timing_bn,
    map_query = EXCLUDED.map_query,
    is_highlighted = EXCLUDED.is_highlighted,
    is_map_verified = EXCLUDED.is_map_verified,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

SELECT setval(pg_get_serial_sequence('public.chambers', 'id'), COALESCE((SELECT MAX(id) FROM public.chambers), 1));

`;

// 7.8 Reviews Seed
sql += `-- 7.8 Reviews (4 Verified Patient Testimonials)
INSERT INTO public.reviews (
    id, author_name_en, author_name_bn, author_meta_en, author_meta_bn,
    quote_en, quote_bn, rating, is_sample, is_featured, sort_order
) VALUES
${DEFAULT_REVIEWS.map(
  (r) => `(
    ${r.id},
    ${esc(r.author_name_en)},
    ${esc(r.author_name_bn)},
    ${esc(r.author_meta_en)},
    ${esc(r.author_meta_bn)},
    ${esc(r.quote_en)},
    ${esc(r.quote_bn)},
    ${r.rating},
    ${r.is_sample ? 'TRUE' : 'FALSE'},
    ${r.is_featured ? 'TRUE' : 'FALSE'},
    ${r.sort_order}
)`
).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
    author_name_en = EXCLUDED.author_name_en,
    author_name_bn = EXCLUDED.author_name_bn,
    author_meta_en = EXCLUDED.author_meta_en,
    author_meta_bn = EXCLUDED.author_meta_bn,
    quote_en = EXCLUDED.quote_en,
    quote_bn = EXCLUDED.quote_bn,
    rating = EXCLUDED.rating,
    is_sample = EXCLUDED.is_sample,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order;

SELECT setval(pg_get_serial_sequence('public.reviews', 'id'), COALESCE((SELECT MAX(id) FROM public.reviews), 1));

`;

// 7.9 FAQs Seed
sql += `-- 7.9 FAQs (7 Clinical Questions)
INSERT INTO public.faqs (
    id, question_en, question_bn, answer_en, answer_bn, sort_order
) VALUES
${DEFAULT_FAQS.map(
  (f) => `(
    ${f.id},
    ${esc(f.question_en)},
    ${esc(f.question_bn)},
    ${esc(f.answer_en)},
    ${esc(f.answer_bn)},
    ${f.sort_order}
)`
).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
    question_en = EXCLUDED.question_en,
    question_bn = EXCLUDED.question_bn,
    answer_en = EXCLUDED.answer_en,
    answer_bn = EXCLUDED.answer_bn,
    sort_order = EXCLUDED.sort_order;

SELECT setval(pg_get_serial_sequence('public.faqs', 'id'), COALESCE((SELECT MAX(id) FROM public.faqs), 1));

`;

// 7.10 Blogs Seed
sql += `-- 7.10 Medical Articles & Blogs (10 Full Articles)
INSERT INTO public.blogs (
    id, slug, title_en, title_bn, category_slug, excerpt_en, excerpt_bn,
    content_en, content_bn, cover_image, reading_time_en, reading_time_bn,
    is_published, published_at
) VALUES
${DEFAULT_BLOGS.map(
  (b) => `(
    ${b.id},
    ${esc(b.slug)},
    ${esc(b.title_en)},
    ${esc(b.title_bn)},
    ${esc(b.category_slug)},
    ${esc(b.excerpt_en)},
    ${esc(b.excerpt_bn)},
    ${esc(b.content_en)},
    ${esc(b.content_bn)},
    ${esc(b.cover_image || '')},
    ${esc(b.reading_time_en || '4 min read')},
    ${esc(b.reading_time_bn || '৪ মিনিট পড়ার সময়')},
    ${b.is_published ? 'TRUE' : 'FALSE'},
    ${esc(b.published_at)}::TIMESTAMPTZ
)`
).join(',\n')}
ON CONFLICT (slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_bn = EXCLUDED.title_bn,
    category_slug = EXCLUDED.category_slug,
    excerpt_en = EXCLUDED.excerpt_en,
    excerpt_bn = EXCLUDED.excerpt_bn,
    content_en = EXCLUDED.content_en,
    content_bn = EXCLUDED.content_bn,
    cover_image = EXCLUDED.cover_image,
    reading_time_en = EXCLUDED.reading_time_en,
    reading_time_bn = EXCLUDED.reading_time_bn,
    is_published = EXCLUDED.is_published,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();

SELECT setval(pg_get_serial_sequence('public.blogs', 'id'), COALESCE((SELECT MAX(id) FROM public.blogs), 1));

`;

// 7.11 Seed Super Admin Users
const envFile = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf-8') : '';
const configuredAdminPassword = envFile.match(/ADMIN_PASSWORD=(.*)/)?.[1]?.trim() || 'Admin@Kollol2026!';

sql += `-- 7.11 Super Admin Credentials (Bcrypt Hashed via pgcrypto)
-- Default Username: admin (or drkollol)
-- Default Email: admin@drkollol.com (or kollolsomc44@gmail.com)
-- Master Password: ${configuredAdminPassword}
INSERT INTO public.admin_users (
    email, username, password_hash, role, full_name, is_active
) VALUES (
    'admin@drkollol.com',
    'admin',
    crypt(${esc(configuredAdminPassword)}, gen_salt('bf', 10)),
    'super_admin',
    'Dr. Fahim Foysal Kollol',
    TRUE
),
(
    'kollolsomc44@gmail.com',
    'drkollol',
    crypt(${esc(configuredAdminPassword)}, gen_salt('bf', 10)),
    'super_admin',
    'Dr. Fahim Foysal Kollol',
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    password_hash = crypt(${esc(configuredAdminPassword)}, gen_salt('bf', 10)),
    role = EXCLUDED.role,
    is_active = TRUE,
    updated_at = NOW();

-- ==================================================================================
-- END OF SCHEMA & SEED MIGRATION
-- ==================================================================================
`;

fs.writeFileSync(path.join(process.cwd(), 'supabase', 'schema.sql'), sql, 'utf8');
console.log('Successfully generated supabase/schema.sql with total length:', sql.length);
