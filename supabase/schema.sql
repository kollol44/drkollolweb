-- ==================================================================================
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

-- 7.1 Site Settings
INSERT INTO public.site_settings (
    id, brand_name_en, brand_name_bn, phone_serial, phone_call, phone_assistant,
    whatsapp_url, email, bmdc_reg, notice_banner_active, notice_banner_en,
    notice_banner_bn, disclaimer_en, disclaimer_bn
) VALUES (
    'global',
    'Dr. Kollol',
    'ডাঃ কল্লোল',
    '01750529252',
    '01670879100',
    '01671-869026',
    'https://wa.me/8801670879100',
    'kollolsomc44@gmail.com',
    'A-61041',
    FALSE,
    '',
    '',
    'Information on this site is not a substitute for professional medical consultation or examination.',
    'এই সাইটের তথ্য কোনোভাবেই সরাসরি ডাক্তার দেখানোর বা চিকিৎসার বিকল্প নয়।'
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

-- 7.2 Hero Section
INSERT INTO public.hero_section (
    id, h1_en, h1_bn, h2_en, h2_bn, meet_cta_en, meet_cta_bn, scroll_cue_en, scroll_cue_bn
) VALUES (
    'hero_main',
    'Every incision has a reason.',
    'প্রতিটা ইনসিশনের পেছনে একটা কারণ আছে।',
    'And an <em>expert surgeon</em> knows it all.',
    'আর একজন <em>অভিজ্ঞ সার্জনই</em> সেই কারণ জানেন।',
    'Meet your surgeon',
    'পরিচিত হন আপনার সার্জনের সাথে',
    'Scroll to explore',
    'নিচে স্ক্রল করুন'
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

-- 7.3 Surgeon Profile
INSERT INTO public.surgeon_profile (
    id, name_en, name_bn, intro_word_en, intro_word_bn, role_en, role_bn,
    post_en, post_bn, chambers_summary_en, chambers_summary_bn,
    degrees_badges, stats, degrees_ticker
) VALUES (
    'kollol',
    'Dr. Fahim Foysal Kollol',
    'ডাঃ ফাহিম ফয়সাল কল্লোল',
    'Meet Your Surgeon',
    'ইনিই আপনার সার্জন',
    'General, Laparoscopic, Breast & Colorectal Surgeon',
    'জেনারেল, ল্যাপারোস্কপিক, ব্রেস্ট ও কলোরেক্টাল সার্জন',
    'Assistant Professor of Surgery, Mymensingh Medical College Hospital · BMDC Reg. A-61041',
    'সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল · বিএমডিসি রেজি: এ-৬১০৪১',
    '<strong>Sherpur</strong> every Thursday & Friday · <strong>Mymensingh</strong> Saturday to Tuesday',
    '<strong>শেরপুরে</strong> প্রতি বৃহস্পতি ও শুক্রবার · <strong>ময়মনসিংহে</strong> শনি থেকে মঙ্গলবার',
    '["MBBS","BCS (Health)","FCPS (Surgery)","MACS (USA)"]'::JSONB,
    '[{"num_en":"10,000+","num_bn":"১০,০০০+","label_en":"Major & minor surgeries","label_bn":"বড়-ছোট অপারেশন"},{"num_en":"300+","num_bn":"৩০০+","label_en":"Laparoscopic (keyhole) surgeries","label_bn":"ল্যাপারোস্কপিক অপারেশন"},{"num_en":"250+","num_bn":"২৫০+","label_en":"Fistula operations","label_bn":"ফিস্টুলা অপারেশন"},{"num_en":"100+","num_bn":"১০০+","label_en":"Longo (stapler) piles surgeries","label_bn":"লংগো পদ্ধতিতে পাইলস অপারেশন"},{"num_en":"10+ yrs","num_bn":"১০+ বছর","label_en":"In practice since 2015","label_bn":"২০১৫ থেকে চিকিৎসা দিচ্ছেন"},{"num_en":"11","num_bn":"১১","label_en":"Research publications","label_bn":"গবেষণা প্রকাশনা"}]'::JSONB,
    '[{"en":"MBBS","bn":"এমবিবিএস"},{"en":"BCS (Health) · 33rd BCS","bn":"বিসিএস (স্বাস্থ্য) · ৩৩তম বিসিএস"},{"en":"FCPS (Surgery)","bn":"এফসিপিএস (সার্জারি)"},{"en":"MACS (USA)","bn":"এমএসিএস (আমেরিকা)"},{"en":"Life Member, SOSB","bn":"আজীবন সদস্য, এসওএসবি"},{"en":"Life Member, SELSB","bn":"আজীবন সদস্য, এসইএলএসবি"},{"en":"Assistant Professor of Surgery, MMCH","bn":"সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ"},{"en":"Laparoscopy Training, SELSB","bn":"ল্যাপারোস্কপি ট্রেনিং, এসইএলএসবি"}]'::JSONB
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

-- 7.4 Categories (7 Clinical Domains)
INSERT INTO public.categories (slug, sort_order, name_en, name_bn, desc_en, desc_bn) VALUES
('colorectal', 1, 'Colorectal & Anal', 'মলদ্বার ও বৃহদন্ত্র', 'Piles, fissure, fistula and other problems of the back passage.', 'পাইলস, ফিশার, ফিস্টুলা ও মলদ্বারের অন্যান্য সমস্যা।'),
('gallbladder', 2, 'Gallbladder & Bile Duct', 'পিত্তথলি ও পিত্তনালি', 'Stones in the gallbladder and bile duct — mostly treated by keyhole surgery.', 'পিত্তথলি ও পিত্তনালির পাথর — বেশিরভাগ ক্ষেত্রে ছোট ছিদ্রে অপারেশন।'),
('abdomen', 3, 'Abdomen & Pelvis', 'পেট ও তলপেট', 'Appendicitis, hernia and other belly problems.', 'অ্যাপেন্ডিসাইটিস, হার্নিয়া ও পেটের অন্যান্য সমস্যা।'),
('breast', 4, 'Breast', 'স্তন', 'Lumps, pain, discharge and breast cancer — for women and men.', 'চাকা, ব্যথা, রস পড়া ও স্তন ক্যান্সার — নারী ও পুরুষ দুজনের জন্যই।'),
('urinary', 5, 'Kidney & Urinary', 'কিডনি ও মূত্রতন্ত্র', 'Stones in the kidney, urine tube and bladder.', 'কিডনি, মূত্রনালি ও মূত্রথলির পাথর।'),
('testis-veins', 6, 'Testis & Veins', 'অণ্ডকোষ ও শিরা', 'Testicular swelling, varicocele and varicose veins.', 'অণ্ডকোষ ফোলা, ভেরিকোসিল ও ভেরিকোস ভেইন।'),
('skin', 7, 'Skin & Soft Tissue', 'চামড়া ও নরম টিস্যু', 'Lumps, tumours and cysts anywhere under the skin.', 'শরীরের যেকোনো জায়গায় চামড়ার নিচে চাকা, টিউমার ও সিস্ট।')
ON CONFLICT (slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    desc_en = EXCLUDED.desc_en,
    desc_bn = EXCLUDED.desc_bn,
    updated_at = NOW();

-- 7.5 Conditions (All 26 Conditions with Symptoms and Treatments)
INSERT INTO public.conditions (
    slug, category_slug, sort_order, is_laparoscopic, is_hidden, home_order,
    home_word_en, home_word_bn, name_en, name_bn, med_en, med_bn,
    short_en, short_bn, what_en, what_bn, symptoms_en, symptoms_bn,
    treat_en, treat_bn, when_en, when_bn, stat_en, stat_bn, image_url
) VALUES
(
    'piles',
    'colorectal',
    1,
    FALSE,
    FALSE,
    1,
    'Piles',
    'পাইলস',
    'Piles',
    'পাইলস',
    'Haemorrhoids',
    'হেমোরয়েড',
    'Bleeding or a lump at the back passage — treated with or without cutting.',
    'মলদ্বারে রক্ত যাওয়া বা গোটা বের হওয়া — কেটে বা না কেটে চিকিৎসা।',
    'Piles are swollen blood vessels inside or around the back passage. They are very common and often come from constipation, straining or sitting for long hours.',
    'পাইলস হলো মলদ্বারের ভেতরে বা চারপাশের রক্তনালি ফুলে যাওয়া। এটা খুবই সাধারণ রোগ। কোষ্ঠকাঠিন্য, পায়খানায় চাপ দেওয়া বা অনেকক্ষণ বসে থাকা থেকে বেশি হয়।',
    ARRAY['Bright red blood with stool', 'A lump that comes out during stool', 'Itching or discomfort', 'Feeling the bowel is not fully empty']::TEXT[],
    ARRAY['পায়খানার সাথে টাটকা লাল রক্ত', 'পায়খানার সময় গোটা বের হয়ে আসা', 'চুলকানি বা অস্বস্তি', 'পায়খানা পুরো পরিষ্কার না হওয়ার অনুভূতি']::TEXT[],
    ARRAY['Early piles: diet, medicine and simple clinic treatment.', 'Advanced piles: modern Longo (stapler) surgery — less cutting, less pain, faster return home.', 'Open surgery when it suits you better.']::TEXT[],
    ARRAY['শুরুর দিকে: খাবার, ওষুধ ও সহজ চিকিৎসা।', 'জটিল হলে: আধুনিক লংগো (স্টেপলার) অপারেশন — কম কাটা, কম ব্যথা, দ্রুত বাড়ি ফেরা।', 'প্রয়োজনে সাধারণ অপারেশন।']::TEXT[],
    'Bleeding with stool should never be ignored — get checked to rule out other causes.',
    'পায়খানার সাথে রক্ত গেলে কখনো অবহেলা করবেন না — অন্য কোনো রোগ আছে কিনা পরীক্ষা করিয়ে নিন।',
    '100+ Longo (stapler) operations',
    '১০০+ লংগো (স্টেপলার) অপারেশন',
    '/img/conditions/piles.webp'
),
(
    'fistula',
    'colorectal',
    2,
    FALSE,
    FALSE,
    2,
    'Fistula',
    'ফিস্টুলা',
    'Fistula',
    'ফিস্টুলা',
    'Fistula-in-ano',
    'ফিস্টুলা-ইন-অ্যানো',
    'A small opening near the back passage with pus or discharge.',
    'মলদ্বারের পাশে ছোট মুখ দিয়ে পুঁজ বা রস পড়া।',
    'A fistula is a thin tunnel between the inside of the back passage and the skin outside, usually after an abscess. It does not heal with medicine alone.',
    'ফিস্টুলা হলো মলদ্বারের ভেতর থেকে বাইরের চামড়া পর্যন্ত একটা সরু নালি, সাধারণত ফোড়া থেকে তৈরি হয়। শুধু ওষুধে এটা সারে না।',
    ARRAY['Pus or fluid from a small hole near the anus', 'Boils or swelling near the anus that keep coming back', 'Pain and itching', 'Staining of underwear']::TEXT[],
    ARRAY['মলদ্বারের পাশের ছোট মুখ দিয়ে পুঁজ বা রস পড়া', 'বারবার মলদ্বারের পাশে ফোড়া বা ফোলা', 'ব্যথা ও চুলকানি', 'অন্তর্বাসে দাগ লাগা']::TEXT[],
    ARRAY['Surgery is the main treatment.', 'Modern staged surgery to remove the whole tract and lower the chance of it coming back.']::TEXT[],
    ARRAY['মূল চিকিৎসা অপারেশন।', 'আধুনিক স্টেজ পদ্ধতিতে পুরো নালি সরিয়ে ফেলা, যাতে আবার ফিরে আসার সম্ভাবনা কমে।']::TEXT[],
    'If a boil near the anus keeps coming back, get checked — it may be a fistula.',
    'মলদ্বারের পাশে ফোড়া বারবার হলে পরীক্ষা করান — এটা ফিস্টুলা হতে পারে।',
    '250+ fistula operations',
    '২৫০+ ফিস্টুলা অপারেশন',
    '/img/conditions/fistula.webp'
),
(
    'fissure',
    'colorectal',
    3,
    FALSE,
    FALSE,
    3,
    'Fissure',
    'ফিশার',
    'Fissure',
    'ফিশার',
    'Anal fissure',
    'এনাল ফিশার',
    'Burning pain and bleeding while passing stool.',
    'পায়খানার সময় জ্বালাপোড়া ব্যথা ও রক্ত যাওয়া।',
    'A fissure is a small tear in the skin of the back passage, usually from hard stool. It hurts a lot, especially during and after stool.',
    'ফিশার হলো মলদ্বারের চামড়ায় ছোট একটা ফাটল, সাধারণত শক্ত পায়খানা থেকে হয়। পায়খানার সময় ও পরে খুব ব্যথা হয়।',
    ARRAY['Sharp or burning pain during stool', 'Pain that lasts for hours after', 'A little bright red blood', 'Fear of going to the toilet']::TEXT[],
    ARRAY['পায়খানার সময় তীব্র বা জ্বালাপোড়া ব্যথা', 'পায়খানার পরও অনেকক্ষণ ব্যথা থাকা', 'অল্প টাটকা রক্ত যাওয়া', 'পায়খানা করতে ভয় লাগা']::TEXT[],
    ARRAY['Most fissures heal with medicine, ointment and softer stool.', 'Long-standing fissures: a small modern operation that relaxes the muscle so the tear can heal.']::TEXT[],
    ARRAY['বেশিরভাগ ফিশার ওষুধ, মলম ও নরম পায়খানায় সেরে যায়।', 'পুরনো ফিশারে: ছোট একটা আধুনিক অপারেশন, যাতে মাংসপেশি ঢিলা হয়ে ঘা শুকায়।']::TEXT[],
    'If the pain continues for more than a few weeks, see a surgeon before it becomes chronic.',
    'কয়েক সপ্তাহের বেশি ব্যথা থাকলে পুরনো হয়ে যাওয়ার আগেই সার্জন দেখান।',
    '',
    '',
    '/img/conditions/fissure.webp'
),
(
    'rectal-cancer',
    'colorectal',
    4,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Anal & Rectal Cancer',
    'মলদ্বারের ক্যান্সার',
    'Colorectal cancer',
    'রেক্টাল ও এনাল ক্যান্সার',
    'Cancer of the back passage — diagnosis, treatment and surgery.',
    'মলদ্বারের ক্যান্সার — রোগ নির্ণয়, চিকিৎসা ও অপারেশন।',
    'Cancer can grow in the last part of the bowel (rectum) or in the anus. Found early, it can often be treated well with surgery and other treatment.',
    'বৃহদন্ত্রের শেষ অংশে (রেক্টাম) বা মলদ্বারে ক্যান্সার হতে পারে। শুরুতে ধরা পড়লে অপারেশন ও অন্যান্য চিকিৎসায় অনেক ক্ষেত্রে ভালো ফল পাওয়া যায়।',
    ARRAY['Blood or mucus with stool', 'Change in bowel habit for weeks', 'Feeling of incomplete emptying', 'Weight loss or tiredness']::TEXT[],
    ARRAY['পায়খানার সাথে রক্ত বা আম যাওয়া', 'কয়েক সপ্তাহ ধরে পায়খানার অভ্যাস বদলে যাওয়া', 'পায়খানা পুরো না হওয়ার অনুভূতি', 'ওজন কমে যাওয়া বা দুর্বলতা']::TEXT[],
    ARRAY['Examination and tests to confirm the diagnosis and stage.', 'Surgery, with further treatment planned together with other specialists when needed.']::TEXT[],
    ARRAY['রোগ ও স্টেজ নিশ্চিত করতে পরীক্ষা।', 'অপারেশন, এবং প্রয়োজনে অন্য বিশেষজ্ঞদের সাথে মিলে পরবর্তী চিকিৎসার পরিকল্পনা।']::TEXT[],
    'Bleeding with stool after age 40, or a change in bowel habit for more than 3 weeks — see a surgeon soon.',
    '৪০ বছরের পর পায়খানার সাথে রক্ত, বা ৩ সপ্তাহের বেশি পায়খানার অভ্যাস বদলালে দ্রুত সার্জন দেখান।',
    '',
    '',
    '/img/conditions/rectal-cancer.webp'
),
(
    'anal-pain-bleeding',
    'colorectal',
    5,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Anal Pain & Bleeding',
    'মলদ্বারে ব্যথা ও রক্ত',
    'Diagnosis',
    'রোগ নির্ণয়',
    'Not sure why it hurts or bleeds? Get the right diagnosis first.',
    'ব্যথা বা রক্ত কেন যাচ্ছে বুঝতে পারছেন না? আগে সঠিক রোগ নির্ণয়।',
    'Pain or bleeding from the back passage can come from piles, fissure, fistula, infection or, rarely, cancer. The right treatment starts with the right diagnosis.',
    'মলদ্বারে ব্যথা বা রক্ত যাওয়ার কারণ হতে পারে পাইলস, ফিশার, ফিস্টুলা, ইনফেকশন, আবার কখনো ক্যান্সারও। সঠিক চিকিৎসা শুরু হয় সঠিক রোগ নির্ণয় দিয়ে।',
    ARRAY['Blood on tissue or in the toilet', 'Pain while sitting or passing stool', 'Swelling or a lump', 'Discharge or itching']::TEXT[],
    ARRAY['টিস্যু বা কমোডে রক্ত', 'বসতে বা পায়খানার সময় ব্যথা', 'ফোলা বা গোটা', 'রস পড়া বা চুলকানি']::TEXT[],
    ARRAY['Careful examination in the chamber, with simple tests when needed.', 'A clear explanation of the cause and the treatment plan.']::TEXT[],
    ARRAY['চেম্বারে যত্ন নিয়ে পরীক্ষা, প্রয়োজনে সহজ কিছু টেস্ট।', 'রোগের কারণ আর চিকিৎসার পরিকল্পনা পরিষ্কার করে বুঝিয়ে বলা।']::TEXT[],
    'Don’t feel shy — these problems are common, and an early check makes treatment simpler.',
    'লজ্জা পাবেন না — এই সমস্যা খুবই সাধারণ, আর আগে দেখালে চিকিৎসা সহজ হয়।',
    '',
    '',
    '/img/conditions/anal-pain-bleeding.webp'
),
(
    'gallstones',
    'gallbladder',
    6,
    TRUE,
    FALSE,
    4,
    'Gallstones',
    'পিত্তথলির পাথর',
    'Gallstones',
    'পিত্তথলির পাথর',
    'Cholelithiasis',
    'গলস্টোন',
    'Stones in the gallbladder — keyhole (laparoscopic) removal.',
    'পিত্তথলিতে পাথর — ছোট ছিদ্রে (ল্যাপারোস্কপিক) অপারেশন।',
    'Gallstones are stones that form inside the gallbladder. Many people get pain after fatty food; some get serious infection or jaundice.',
    'পিত্তথলির ভেতরে পাথর জমাকে গলস্টোন বলে। অনেকের তৈলাক্ত খাবারের পর ব্যথা হয়; কারো কারো মারাত্মক ইনফেকশন বা জন্ডিস হতে পারে।',
    ARRAY['Pain in the upper right or middle of the belly', 'Pain after oily or heavy food', 'Nausea, vomiting, gas', 'Fever or yellow eyes (needs urgent care)']::TEXT[],
    ARRAY['পেটের ডান দিকে ওপরে বা মাঝখানে ব্যথা', 'তৈলাক্ত বা ভারী খাবারের পর ব্যথা', 'বমি ভাব, বমি, গ্যাস', 'জ্বর বা চোখ হলুদ হওয়া (জরুরি)']::TEXT[],
    ARRAY['Laparoscopic cholecystectomy: the gallbladder is removed through small keyhole cuts.', 'Less pain, small scars and a faster return to work than open surgery.']::TEXT[],
    ARRAY['ল্যাপারোস্কপিক কোলেসিস্টেক্টমি: ছোট কয়েকটা ছিদ্র দিয়ে পিত্তথলি অপসারণ।', 'খোলা অপারেশনের চেয়ে কম ব্যথা, ছোট দাগ, দ্রুত কাজে ফেরা।']::TEXT[],
    'Repeated upper-belly pain after food, or yellow eyes with fever — see a surgeon.',
    'খাবারের পর বারবার পেটের ওপরের দিকে ব্যথা, বা জ্বরের সাথে চোখ হলুদ হলে সার্জন দেখান।',
    '300+ laparoscopic gallbladder operations',
    '৩০০+ ল্যাপারোস্কপিক পিত্তথলি অপারেশন',
    '/img/conditions/gallstones.webp'
),
(
    'bile-duct-stones',
    'gallbladder',
    7,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Bile Duct Stones',
    'পিত্তনালির পাথর',
    'CBD stones',
    'সিবিডি স্টোন',
    'A stone stuck in the bile duct — can cause jaundice.',
    'পিত্তনালিতে পাথর আটকে যাওয়া — জন্ডিস হতে পারে।',
    'Sometimes a stone moves from the gallbladder into the bile duct and blocks it. This can cause jaundice, fever and serious infection.',
    'অনেক সময় পিত্তথলি থেকে পাথর পিত্তনালিতে নেমে এসে আটকে যায়। এতে জন্ডিস, পেটে ব্যথা আর মারাত্মক ইনফেকশন হতে পারে।',
    ARRAY['Yellow eyes and skin', 'Dark urine, pale stool', 'Pain in the upper right belly', 'Fever with shivering']::TEXT[],
    ARRAY['চোখ ও চামড়া হলুদ হয়ে যাওয়া', 'গাঢ় প্রস্রাব, ফ্যাকাশে পায়খানা', 'পেটের ডান দিকে ওপরের অংশে তীব্র ব্যথা', 'কাঁপুনী দিয়ে জ্বর']::TEXT[],
    ARRAY['Tests to find the stone and the blockage.', 'Surgery or endoscopy to clear the duct and remove the gallbladder.']::TEXT[],
    ARRAY['পাথর ও ব্লকের অবস্থান নিশ্চিত করতে পরীক্ষা।', 'নালি পরিষ্কার করা ও পিত্তথলি অপসারণের সঠিক পরিকল্পনা।']::TEXT[],
    'Jaundice with belly pain or fever needs urgent medical assessment.',
    'পেটে ব্যথার সাথে জন্ডিস বা জ্বর দেখা দিলে অবহেলা না করে জরুরি সার্জন দেখান।',
    '',
    '',
    '/img/conditions/bile-duct-stones.webp'
),
(
    'appendicitis',
    'abdomen',
    8,
    TRUE,
    FALSE,
    5,
    'Appendicitis',
    'অ্যাপেন্ডিসাইটিস',
    'Appendicitis',
    'অ্যাপেন্ডিসাইটিস',
    'Acute appendicitis',
    'তীব্র অ্যাপেন্ডিসাইটিস',
    'Sudden lower right belly pain — urgent keyhole operation.',
    'হঠাৎ তলপেটের ডান পাশে তীব্র ব্যথা — দ্রুত ছোট ছিদ্রে অপারেশন।',
    'Appendicitis is inflammation of the appendix. If not removed on time, it can burst and spread infection through the whole abdomen.',
    'অ্যাপেন্ডিক্সের তীব্র ইনফেকশনকে অ্যাপেন্ডিসাইটিস বলে। সময়মতো অপারেশন না করলে ফেটে গিয়ে পুরো পেটে ইনফেকশন ছড়িয়ে যেতে পারে।',
    ARRAY['Pain starting around the navel and moving to the right lower belly', 'Nausea, loss of appetite, vomiting', 'Low fever', 'Pain increases with coughing or walking']::TEXT[],
    ARRAY['নাভির চারপাশ থেকে শুরু হয়ে তলপেটের ডান পাশে যাওয়া তীব্র ব্যথা', 'বমি ভাব বা বমি, খাবারে অরুচি', 'হালকা জ্বর', 'হাঁটলে বা কাশি দিলে ব্যথা বেড়ে যাওয়া']::TEXT[],
    ARRAY['Emergency laparoscopic appendicectomy through miniature keyholes.', 'Quick recovery with minimal hospital stay.']::TEXT[],
    ARRAY['ছোট ছিদ্রে ল্যাপারোস্কপিক পদ্ধতিতে অ্যাপেন্ডিক্স অপসারণ।', 'অল্প ব্যথায় দ্রুত সুস্থতা ও বাড়ি ফেরা।']::TEXT[],
    'Severe pain in the lower right abdomen requires immediate emergency surgical check.',
    'তলপেটের ডান পাশে তীব্র ব্যথা হলে ব্যথানাশক না খেয়ে দ্রুত সার্জনকে দেখান।',
    '',
    '',
    '/img/conditions/appendicitis.webp'
),
(
    'inguinal-hernia',
    'abdomen',
    9,
    TRUE,
    FALSE,
    6,
    'Hernia',
    'হার্নিয়া',
    'Inguinal Hernia',
    'কুঁচকির হার্নিয়া',
    'Inguinal hernia',
    'ইনগুইনাল হার্নিয়া',
    'Swelling in the groin — keyhole mesh repair (TAPP).',
    'কুঁচকি বা অণ্ডকোষের দিকে ফোলা — মেশ দিয়ে ল্যাপারোস্কপিক অপারেশন।',
    'An inguinal hernia happens when intestine pushes through a weakness in the lower belly wall into the groin. It will not heal without surgery.',
    'পেটের মাংসপেশির দুর্বল অংশ দিয়ে নাড়িভুড়ি কুঁচকিতে নেমে এলে তাকে ইনগুইনাল হার্নিয়া বলে। ওষুধে এটি ভালো হয় না, অপারেশনে স্থায়ী সমাধান হয়।',
    ARRAY['Bulge in the groin that grows when standing or coughing', 'Heaviness or dragging discomfort', 'Disappears when lying down in early stages', 'Sudden severe pain if trapped (emergency)']::TEXT[],
    ARRAY['দাঁড়ালে বা কাশি দিলে কুঁচকিতে ফোলা বেড়ে যাওয়া', 'ভারী লাগা বা অস্বস্তি', 'শুরুর দিকে শুয়ে থাকলে ভেতরে চলে যাওয়া', 'হঠাৎ আটকে গেলে তীব্র ব্যথা (জরুরি)']::TEXT[],
    ARRAY['Laparoscopic TAPP mesh repair with tiny scars.', 'High-strength mesh placed inside the abdominal wall to stop recurrence.']::TEXT[],
    ARRAY['ল্যাপারোস্কপিক মেশ রিপেয়ার (TAPP) — খুব ছোট ছিদ্রে টেকসই মেশ স্থাপন।', 'দ্রুত কাজে ফেরা ও পুনরায় হওয়ার ঝুঁকি সর্বনিম্ন।']::TEXT[],
    'If a hernia suddenly becomes hard, extremely painful, or will not go back in, seek emergency care.',
    'হার্নিয়ার ফোলা হঠাৎ শক্ত ও তীব্র ব্যথাদায়ক হলে জরুরি ভিত্তিতে হাসপাতালে যান।',
    '',
    '',
    '/img/conditions/inguinal-hernia.webp'
),
(
    'umbilical-hernia',
    'abdomen',
    10,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Umbilical Hernia',
    'নাভির হার্নিয়া',
    'Umbilical hernia',
    'আমবিলিকাল হার্নিয়া',
    'A bulge at the navel — keyhole or open mesh repair.',
    'নাভির চারপাশে বা উপরে ফোলা — মেশ দিয়ে আধুনিক অপারেশন।',
    'An umbilical or paraumbilical hernia is a weakness around the belly button where tissues push forward.',
    'নাভির চারপাশে মাংসপেশির দুর্বলতা দিয়ে পেটের চর্বি বা নাড়ি ফুলে ওঠাকে নাভির হার্নিয়া বলে।',
    ARRAY['Bulge at or near the navel', 'Pain or pulling sensation during heavy lifting', 'Tenderness around the navel']::TEXT[],
    ARRAY['নাভির কাছে চাকা বা ফোলা', 'ভারী কিছু তোলার সময় টান লাগা বা ব্যথা', 'নাভির চারপাশ নরম ও স্পর্শকাতর হওয়া']::TEXT[],
    ARRAY['Laparoscopic IPOM or mini-incision mesh repair.', 'Customized mesh reconstruction.']::TEXT[],
    ARRAY['ল্যাপারোস্কপিক বা মিনি-ইনসিশন মেশ রিপেয়ার।', 'ব্যথাহীন আধুনিক সেলাই।']::TEXT[],
    'Repair before the hernia grows larger or risks bowel entrapment.',
    'ফোলা বড় হওয়ার আগেই অপারেশনের সিদ্ধান্ত নিন।',
    '',
    '',
    '/img/conditions/umbilical-hernia.webp'
),
(
    'breast-lump',
    'breast',
    11,
    FALSE,
    FALSE,
    7,
    'Breast Lump',
    'স্তনে চাকা',
    'Breast Lump',
    'স্তনে চাকা',
    'Fibroadenoma & benign disease',
    'ফাইব্রোঅ্যাডেনোমা ও নিরীহ চাকা',
    'A lump in the breast — most are benign, but every lump must be checked.',
    'স্তনে চাকা বা গোটা — বেশিরভাগই ক্যান্সার নয়, তবে পরীক্ষা জরুরি।',
    'Finding a breast lump is stressful, but most lumps in younger women are benign (fibroadenoma or cyst). Accurate examination and ultrasound provide peace of mind.',
    'স্তনে চাকা অনুভব করা দুশ্চিন্তার কারণ হলেও বেশিরভাগ চাকাই নিরীহ বা বিনাইন। আল্ট্রাসনোগ্রাম ও যত্নশীল পরীক্ষায় সঠিক কারণ নিশ্চিত করা যায়।',
    ARRAY['Painless, smooth, movable lump in the breast', 'Changes during menstrual cycles', 'Discomfort or tenderness']::TEXT[],
    ARRAY['ব্যথাহীন, মসৃণ, সহজে নড়াচড়া করে এমন চাকা', 'মাসিকের সময় আকারে পরিবর্তন বা অস্বস্তি', 'স্তনে ভারি ভাব']::TEXT[],
    ARRAY['Clinical breast examination & ultrasound.', 'Cosmetic scarless or hidden-border minor surgical removal if needed.']::TEXT[],
    ARRAY['ক্লিনিক্যাল পরীক্ষা ও আল্ট্রাসনোগ্রাম।', 'প্রয়োজনে দাগহীন কসমেটিক পদ্ধতিতে চাকা অপসারণ।']::TEXT[],
    'Any new lump in the breast should be evaluated by a surgeon without delay.',
    'স্তনে নতুন যেকোনো চাকা অনুভব করলেই অবহেলা না করে সার্জনকে দেখান।',
    '',
    '',
    '/img/conditions/breast-lump.webp'
),
(
    'breast-cancer',
    'breast',
    12,
    FALSE,
    FALSE,
    8,
    'Breast Cancer',
    'স্তন ক্যান্সার',
    'Breast Cancer',
    'স্তন ক্যান্সার',
    'Carcinoma breast',
    'কার্সিনোমা ব্রেস্ট',
    'Early detection, staging and comprehensive breast cancer surgery.',
    'শুরুতে রোগ নির্ণয় ও আধুনিক স্তন ক্যান্সার সার্জারি।',
    'Breast cancer is the most common cancer in women. When diagnosed in early stages, complete cure and normal life expectancy are highly achievable.',
    'নারীদের মধ্যে সবচেয়ে সাধারণ ক্যান্সার হলেও শুরুর দিকে ধরা পড়লে চিকিৎসার মাধ্যমে সম্পূর্ণ সুস্থ হওয়া সম্ভব।',
    ARRAY['Hard, irregular, fixed lump', 'Nipple retraction or bloody discharge', 'Dimpling or orange-peel texture on skin', 'Swelling in the armpit']::TEXT[],
    ARRAY['শক্ত, অসমান ও অনড় চাকা', 'বোঁটা ভেতরের দিকে দেবে যাওয়া বা রক্তমিশ্রিত রস পড়া', 'চামড়া কুঁচকে যাওয়া বা কমলার খোসার মতো দাগ', 'বগলে চাকা বা ফোলা']::TEXT[],
    ARRAY['Triple assessment (Clinical, Imaging, Biopsy).', 'Breast conservation surgery or modified radical mastectomy.', 'Coordinated multidisciplinary cancer therapy.']::TEXT[],
    ARRAY['ট্রিপল অ্যাসেসমেন্ট (পরীক্ষা, ম্যামোগ্রাম/আল্ট্রা, বায়োপসি)।', 'স্তন সংরক্ষণকারী অপারেশন অথবা মডিফাইড রেডিক্যাল মাস্টেক্টমি।', 'পরিকল্পিত অনকোলজি পরামর্শ।']::TEXT[],
    'Immediate consultation upon noticing any skin or nipple changes, or a hard lump.',
    'স্তনের চামড়া বা বোঁটায় কোনো পরিবর্তন দেখলে কালক্ষেপণ না করে বিশেষজ্ঞ সার্জন দেখান।',
    '',
    '',
    '/img/conditions/breast-cancer.webp'
),
(
    'kidney-stones',
    'urinary',
    13,
    FALSE,
    FALSE,
    9,
    'Kidney Stones',
    'কিডনির পাথর',
    'Kidney & Ureteric Stones',
    'কিডনি ও মূত্রনালির পাথর',
    'Urolithiasis',
    'ইউরোলিথিয়াসিস',
    'Severe side or back pain — diagnosis and modern stone removal surgery.',
    'কোমর ও পিঠে তীব্র ব্যথা — পরীক্ষা ও আধুনিক পাথর অপসারণ সার্জারি।',
    'Stones formed from concentrated minerals can block the kidney or urine pipe, causing unbearable spasms and potential kidney damage.',
    'কিডনি বা প্রস্রাবের নালিতে পাথর জমে প্রস্রাবের পথ বন্ধ হয়ে যেতে পারে। তীব্র ব্যথার পাশাপাশি কিডনির কার্যক্ষমতা নষ্ট হওয়ার ঝুঁকি থাকে।',
    ARRAY['Sharp radiating flank or back pain towards the groin', 'Blood in urine', 'Burning or frequent urge to pass urine', 'Nausea and vomiting during attacks']::TEXT[],
    ARRAY['কোমর থেকে কুঁচকির দিকে ছড়িয়ে যাওয়া তীব্র খিল ধরা ব্যথা', 'প্রস্রাবের সাথে রক্ত যাওয়া', 'প্রস্রাবে জ্বালাপোড়া বা বারবার বেগ হওয়া', 'ব্যথার সময় বমি ভাব বা বমি']::TEXT[],
    ARRAY['Precise imaging (Ultrasound, CT KUB).', 'Medical expulsion or modern surgical extraction.']::TEXT[],
    ARRAY['সঠিক সিটি স্ক্যান ও আল্ট্রাসনোগ্রাম মূল্যায়ন।', 'ওষুধের সাহায্যে বের করা বা আধুনিক সার্জিক্যাল অপারেশন।']::TEXT[],
    'Intense flank pain with fever or inability to pass urine requires urgent hospital care.',
    'কোমরে তীব্র ব্যথার সাথে জ্বর বা প্রস্রাব আটকে গেলে জরুরি হাসপাতালে যান।',
    '',
    '',
    '/img/conditions/kidney-stones.webp'
),
(
    'varicocele',
    'testis-veins',
    14,
    TRUE,
    FALSE,
    10,
    'Varicocele',
    'ভেরিকোসিল',
    'Varicocele',
    'ভেরিকোসিল',
    'Varicocele',
    'ভেরিকোসিল',
    'Swollen veins in the scrotum — keyhole surgery for pain and fertility.',
    'অণ্ডকোষের স্ফীত রক্তনালি — ব্যথা ও বন্ধ্যত্ব রোধে ছোট ছিদ্রে অপারেশন।',
    'Varicocele is an enlargement of the veins within the scrotum, resembling varicose veins in the leg. It can affect sperm count and cause aching pain.',
    'অণ্ডকোষের চারপাশের রক্তনালি অস্বাভাবিক ফুলে পেঁচিয়ে যাওয়াকে ভেরিকোসিল বলে। এটি নিস্তেজ ব্যথা এবং পুরুষদের শুক্রাণুর মান হ্রাসের প্রধান কারণ।',
    ARRAY['Dull aching pain in the scrotum after prolonged standing', 'Bag-of-worms feeling above the testicle', 'Difference in testicular size']::TEXT[],
    ARRAY['অনেকক্ষণ দাঁড়িয়ে বা কাজ করলে অণ্ডকোষে ভারী নিস্তেজ ব্যথা', 'অণ্ডকোষে শিরা পেঁচিয়ে থাকার মতো অনুভূতি', 'উভয় অণ্ডকোষের আকারে তফাৎ হওয়া']::TEXT[],
    ARRAY['Laparoscopic or subinguinal microscopic varicocelectomy.', 'Discharge on the same or next day.']::TEXT[],
    ARRAY['ল্যাপারোস্কপিক ভেরিকোসিল অপারেশন।', 'খুব দ্রুত আরোগ্য ও স্বাভাবিক জীবনে প্রত্যাবর্তন।']::TEXT[],
    'Aching scrotal discomfort or fertility evaluation issues.',
    'অণ্ডকোষে টান ধরা ব্যথা বা সন্তান ধারণের সমস্যায় চিকিৎসকের পরামর্শ নিন।',
    '',
    '',
    '/img/conditions/varicocele.webp'
),
(
    'varicose-veins',
    'testis-veins',
    15,
    FALSE,
    FALSE,
    11,
    'Varicose Veins',
    'ভেরিকোস ভেইন',
    'Varicose Veins',
    'পায়ের ফোলা শিরা',
    'Varicose veins of legs',
    'ভেরিকোস ভেইন',
    'Twisted blue veins in the legs — relief from pain and skin ulcers.',
    'পায়ের চামড়ার নিচে ফুলে থাকা শিরা — ব্যথা ও ঘা থেকে স্থায়ী মুক্তি।',
    'Faulty valves inside leg veins cause blood to pool, producing visibly dilated tortuous veins, heaviness, pigmentation, and slow-healing sores.',
    'পায়ের রক্তনালির ভালভ নষ্ট হয়ে রক্ত জমে শিরাগুলো মোটা ও পেঁচিয়ে ওঠে। অবহেলায় পায়ে কালো দাগ ও দীর্ঘস্থায়ী ঘা তৈরি হয়।',
    ARRAY['Bulging, bluish, rope-like leg veins', 'Leg heaviness and fatigue at end of day', 'Swelling and itchy skin around ankles', 'Leg ulcers near the ankle']::TEXT[],
    ARRAY['পায়ে নীলচে ফোলা মোটা শিরা দৃশ্যমান হওয়া', 'দিনের শেষে পায়ে ভারী ভাব ও ক্লান্তি', 'গোড়ালির চারপাশে কালো দাগ ও চুলকানি', 'দেরিতে শুকায় এমন ঘা হওয়া']::TEXT[],
    ARRAY['Doppler ultrasound vein mapping.', 'Minimally invasive ligation or surgical removal of diseased veins.']::TEXT[],
    ARRAY['ডপলার আল্ট্রাসনোগ্রাম পরীক্ষা।', 'আধুনিক সার্জিক্যাল পদ্ধতিতে ক্ষতিগ্রস্ত শিরা অপসারণ।']::TEXT[],
    'Skin discoloration or ulcer development near the ankle.',
    'পায়ে ঘা বা চামড়ার রঙ পরিবর্তন শুরু হলে দ্রুত চিকিৎসা নিন।',
    '',
    '',
    '/img/conditions/varicose-veins.webp'
),
(
    'incisional-hernia',
    'abdomen',
    16,
    TRUE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Incisional & Ventral Hernia',
    'অপারেশন পরবর্তী হার্নিয়া',
    'Incisional hernia',
    'ইনসিশনাল হার্নিয়া',
    'Bulge at previous surgery scar — laparoscopic mesh reconstruction.',
    'আগের অপারেশনের কাটার জায়গায় ফোলা — ল্যাপারোস্কপিক মেশ রিপেয়ার।',
    'An incisional hernia develops through an operative scar from a previous abdominal surgery where muscle layers separated over time.',
    'আগের কোনো পেটের অপারেশনের দাগের ভেতর দিয়ে মাংসপেশি দুর্বল হয়ে নাড়িভুড়ি ফুলে বের হয়ে আসাকে ইনসিশনাল হার্নিয়া বলে।',
    ARRAY['Bulge under or around previous surgical incision', 'Pain while lifting weights or coughing', 'Skin stretching over the scar']::TEXT[],
    ARRAY['আগের অপারেশনের দাগের নিচে চাকা বা ফোলা', 'কাশি দিলে বা ভারী কাজ করলে টান লাগা ও ব্যথা', 'দাগের চামড়া পাতলা হয়ে আসা']::TEXT[],
    ARRAY['Laparoscopic IPOM (keyhole) mesh repair or open component separation.', 'Strengthens abdominal wall with dual-layer surgical mesh.']::TEXT[],
    ARRAY['ল্যাপারোস্কপিক পদ্ধতিতে পেটের ভেতর থেকে টেকসই মেশ স্থাপন।', 'দ্রুত আরোগ্য এবং পুনরায় হওয়ার ঝুঁকি সর্বনিম্ন।']::TEXT[],
    'Seek surgical consultation early before the abdominal wall defect expands.',
    'ফোলা আরও বড় হয়ে নাড়ি আটকে যাওয়ার আগেই বিশেষজ্ঞ সার্জনকে দেখান।',
    '',
    '',
    '/img/conditions/umbilical-hernia.webp'
),
(
    'fibrocystic-breast',
    'breast',
    17,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Fibrocystic Breast',
    'ফাইব্রোসিস্টিক স্তন',
    'Fibrocystic disease',
    'ফাইব্রোসিস্টিক ডিজিজ',
    'Lumpy, painful breasts that change with menstrual cycles.',
    'মাসিকের সাথে বদলায় এমন দলা দলা ও ব্যথাযুক্ত স্তন।',
    'Fibrocystic changes make the breast feel lumpy or tender, often before periods. It is common and usually benign.',
    'ফাইব্রোসিস্টিক পরিবর্তনে স্তন দলা দলা বা ব্যথাযুক্ত লাগে, বিশেষ করে মাসিকের আগে। এটা সাধারণ এবং সাধারণত ক্যান্সার না।',
    ARRAY['Lumpy or rope-like feel', 'Pain or tenderness before periods', 'Small fluid-filled cysts']::TEXT[],
    ARRAY['দলা দলা বা দড়ির মতো অনুভূতি', 'মাসিকের আগে ব্যথা', 'ছোট পানি ভরা সিস্ট']::TEXT[],
    ARRAY['Clinical breast examination and ultrasound.', 'Medical management for pain relief and reassurance.']::TEXT[],
    ARRAY['পরীক্ষা ও আলট্রাসাউন্ড।', 'ব্যথা কমানোর ওষুধ ও সঠিক পরামর্শ।']::TEXT[],
    'If a lump persists after periods or continues to grow, get it checked.',
    'মাসিকের পরও চাকা থাকলে বা বড় হতে থাকলে পরীক্ষা করান।',
    '',
    '',
    '/img/conditions/breast-lump.webp'
),
(
    'breast-pain',
    'breast',
    18,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Breast Pain',
    'স্তনে ব্যথা',
    'Mastalgia',
    'মাস্টালজিয়া',
    'Pain in one or both breasts — evaluate the cause, get lasting relief.',
    'এক বা দুই স্তনে ব্যথা — কারণ খুঁজে আরাম।',
    'Breast pain is very common and is rarely due to cancer. It is often linked to hormones or muscle strain.',
    'স্তনে ব্যথা খুবই সাধারণ, আর এর কারণ খুব কমই ক্যান্সার। প্রায়ই হরমোন, আঁটসাঁট ব্রা বা মাংসপেশির টান থেকে হয়।',
    ARRAY['Pain before menstrual periods', 'Localized discomfort', 'Heaviness or burning sensation']::TEXT[],
    ARRAY['মাসিকের আগে ব্যথা', 'এক জায়গায় অস্বস্তি', 'ভার ভার লাগা বা জ্বালা']::TEXT[],
    ARRAY['Specialist clinical evaluation and ultrasound.', 'Targeted medical treatment and dietary adjustments.']::TEXT[],
    ARRAY['বিশেষজ্ঞ পরীক্ষা ও আলট্রাসাউন্ড।', 'ব্যথা কমানোর ওষুধ ও সঠিক খাদ্যাভ্যাস।']::TEXT[],
    'Persistent pain or pain accompanied by a lump.',
    'চাকার সাথে ব্যথা বা ব্যথা দীর্ঘদিন থাকলে পরীক্ষা করান।',
    '',
    '',
    '/img/conditions/breast-lump.webp'
),
(
    'nipple-discharge',
    'breast',
    19,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Nipple Discharge',
    'বোঁটা দিয়ে রস পড়া',
    'Nipple discharge',
    'নিপল ডিসচার্জ',
    'Fluid or blood from the nipple — requires structured examination.',
    'স্তনের বোঁটা দিয়ে রস বা রক্ত পড়া — সঠিক পরীক্ষা দরকার।',
    'Discharge from one side, bloody fluid or discharge associated with a lump requires specialist surgical examination.',
    'স্তনের বোঁটা দিয়ে এক দিক থেকে রক্তমাখা বা চাকার সাথে রস পড়লে বিশেষায়িত সার্জিক্যাল পরীক্ষা করা দরকার।',
    ARRAY['Clear or green fluid discharge', 'Bloody nipple discharge', 'Discharge from one side only']::TEXT[],
    ARRAY['স্বচ্ছ বা সবুজ রস', 'রক্তমাখা রস', 'শুধু এক বোঁটা দিয়ে রস পড়া']::TEXT[],
    ARRAY['Cytological evaluation, duct ultrasound and duct excision if needed.']::TEXT[],
    ARRAY['আলট্রাসাউন্ড ও রসের সাইটোলজি পরীক্ষা, প্রয়োজনে ছোট সার্জারি।']::TEXT[],
    'Bloody discharge or spontaneous single-duct discharge.',
    'রক্তমাখা রস বা নিজে থেকে রস বের হলে অবিলম্বে সার্জন দেখান।',
    '',
    '',
    '/img/conditions/breast-cancer.webp'
),
(
    'breast-abscess',
    'breast',
    20,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Breast Abscess',
    'স্তনের ফোড়া',
    'Breast abscess',
    'ব্রেস্ট অ্যাবসেস',
    'Painful, swollen breast with pus — prompt drainage and antibiotics.',
    'পুঁজসহ ফোলা ও ব্যথাযুক্ত স্তন — পুঁজ বের করা দরকার।',
    'A breast abscess is a collection of pus, often in lactating mothers, accompanied by severe tenderness and high fever.',
    'স্তনে পুঁজ জমাকে স্তনের ফোড়া বলে, বুকের দুধ খাওয়ানো মায়েদের বেশি হয়। তীব্র ব্যথা, লাল হওয়া ও জ্বর হয়।',
    ARRAY['Hot, red, swollen area on breast', 'Severe throbbing pain', 'High fever and chills']::TEXT[],
    ARRAY['লাল, গরম, ফোলা জায়গা', 'তীব্র দপদপানি ব্যথা', 'উচ্চ জ্বর ও কাঁপুনি']::TEXT[],
    ARRAY['Targeted antibiotics and needle aspiration or minimal incision drainage.']::TEXT[],
    ARRAY['অ্যান্টিবায়োটিক এবং সুই দিয়ে অথবা ছোট কাটায় পুঁজ নিষ্কাশন।']::TEXT[],
    'Fever with an inflamed, painful breast requires immediate treatment.',
    'জ্বরের সাথে স্তন লাল ও ব্যথাযুক্ত হলে অবিলম্বে ডাক্তার দেখান।',
    '',
    '',
    '/img/conditions/breast-lump.webp'
),
(
    'gynecomastia',
    'breast',
    21,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Gynecomastia',
    'গাইনোকোমাস্টিয়া',
    'Enlarged male breast',
    'ছেলেদের বড় স্তন',
    'Enlarged breast tissue in men — minimally invasive cosmetic surgery.',
    'ছেলেদের বড় স্তন — কসমেটিক অপারেশন।',
    'Gynecomastia is benign enlargement of gland tissue in males. It causes self-consciousness and can be corrected with cosmetic surgery.',
    'ছেলেদের স্তনের গ্ল্যান্ড বড় হয়ে যাওয়াকে গাইনোকোমাস্টিয়া বলে। আধুনিক কসমেটিক অপারেশনে বুক স্বাভাবিক করা হয়।',
    ARRAY['Firm rubbery disc under nipple', 'Tenderness or discomfort in tight clothing']::TEXT[],
    ARRAY['বোঁটার নিচে শক্ত ফোলা', 'চাপ দিলে ব্যথা ও পোশাকে অস্বস্তি']::TEXT[],
    ARRAY['Cosmetic surgical excision or liposuction under local/general anesthesia.']::TEXT[],
    ARRAY['নিখুঁত কসমেটিক সার্জারির মাধ্যমে বাড়তি গ্ল্যান্ড অপসারণ।']::TEXT[],
    'Persistent swelling causing aesthetic or emotional discomfort.',
    'সমস্যা দীর্ঘস্থায়ী হলে বিশেষজ্ঞ প্লাস্টিক/জেনারেল সার্জনের পরামর্শ নিন।',
    '',
    '',
    '/img/conditions/breast-lump.webp'
),
(
    'ureteric-stones',
    'urinary',
    22,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Ureteric Stones',
    'মূত্রনালির পাথর',
    'Ureteric calculi',
    'ইউরেটেরিক স্টোন',
    'Stone lodged in the urine pipe — excruciating colicky pain.',
    'প্রস্রাবের নালিতে পাথর — পিঠ থেকে কুঁচকি পর্যন্ত তীব্র ব্যথা।',
    'A stone travelling from the kidney down to the bladder can lodge in the ureter, causing severe wave-like spasms.',
    'কিডনির পাথর মূত্রনালিতে আটকে গেলে ঢেউয়ের মতো তীব্র খিল ধরা ব্যথা হয়।',
    ARRAY['Spasmodic groin pain', 'Blood in urine', 'Urgent frequent urination']::TEXT[],
    ARRAY['পিঠ থেকে কুঁচকি পর্যন্ত তীব্র ব্যথা', 'প্রস্রাবে রক্ত', 'বারবার প্রস্রাবের বেগ']::TEXT[],
    ARRAY['Medical expulsion therapy or modern surgical retrieval.']::TEXT[],
    ARRAY['ওষুধের মাধ্যমে বের করা বা আধুনিক সার্জারি।']::TEXT[],
    'Severe pain with fever or complete inability to pass urine.',
    'জ্বরের সাথে ব্যথা বা প্রস্রাব আটকে গেলে জরুরি হাসপাতালে যান।',
    '',
    '',
    '/img/conditions/kidney-stones.webp'
),
(
    'bladder-stones',
    'urinary',
    23,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Bladder Stones',
    'মূত্রথলির পাথর',
    'Vesical calculi',
    'ভেসিক্যাল স্টোন',
    'Stones in the bladder — interrupted stream and burning.',
    'মূত্রথলিতে পাথর — ব্যথা ও প্রস্রাবে কষ্ট।',
    'Stones forming inside the urinary bladder due to incomplete emptying, causing interrupted urination and pain.',
    'মূত্রথলিতে পাথর জমলে প্রস্রাবের গতি বাধাগ্রস্ত হয় এবং তলপেটে তীব্র জ্বালা-যন্ত্রণা হয়।',
    ARRAY['Interrupted urine stream', 'Lower belly ache', 'Pain at the end of urination']::TEXT[],
    ARRAY['থেমে থেমে প্রস্রাব হওয়া', 'তলপেটে ব্যথা', 'প্রস্রাবের শেষে তীব্র যন্ত্রণা']::TEXT[],
    ARRAY['Cystolitholapaxy or small surgical extraction.']::TEXT[],
    ARRAY['আধুনিক এন্ডোস্কোপিক অথবা ছোট অপারেশনের মাধ্যমে পাথর অপসারণ।']::TEXT[],
    'Sudden stoppage of urine or bloody urine.',
    'হঠাৎ প্রস্রাব বন্ধ হয়ে গেলে বা রক্ত গেলে অবিলম্বে চিকিৎসা নিন।',
    '',
    '',
    '/img/conditions/kidney-stones.webp'
),
(
    'testicular-swelling',
    'testis-veins',
    24,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Testicular Swelling',
    'অণ্ডকোষের রোগ',
    'Hydrocele & scrotal disease',
    'হাইড্রোসিল ও অণ্ডকোষ রোগ',
    'Swelling, fluid collection or pain in the scrotum.',
    'অণ্ডকোষে ফোলা, পানি জমা বা ব্যথা।',
    'Scrotal swellings like hydrocele, epididymal cysts or infections require accurate physical examination and ultrasound.',
    'অণ্ডকোষে পানি জমা (হাইড্রোসিল) বা ইনফেকশন অত্যন্ত পরিচিত রোগ যা ছোট অপারেশনে স্থায়ীভাবে সেরে যায়।',
    ARRAY['Heavy dragging feeling', 'Visible painless enlargement of scrotum']::TEXT[],
    ARRAY['ভারী ভাব ও টান লাগা', 'অণ্ডকোষের দৃশ্যমান বৃদ্ধি']::TEXT[],
    ARRAY['Eversion/excision of hydrocele sac under regional anesthesia.']::TEXT[],
    ARRAY['ছোট অপারেশনে অতিরিক্ত পানি ও থলি অপসারণ।']::TEXT[],
    'Sudden severe pain is a surgical emergency.',
    'হঠাৎ তীব্র ব্যথা হলে তাৎক্ষণিক হাসপাতালে যান।',
    '',
    '',
    '/img/conditions/varicocele.webp'
),
(
    'lump-cyst-lipoma',
    'skin',
    25,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Lipoma & Soft Tissue Lumps',
    'লাইপোমা ও নরম টিস্যুর চাকা',
    'Lipoma & soft tissue lumps',
    'লাইপোমা ও টিস্যু টিউমার',
    'Fatty lumps anywhere under the skin — painless excision.',
    'চামড়ার নিচে নরম চর্বির চাকা বা সিস্ট — দাগহীন ছোট অপারেশনে সমাধান।',
    'Lipomas are benign fatty lumps that grow slowly under the skin and are cleanly removed in a day procedure.',
    'চামড়ার নিচে চর্বির নরম চাকা (লাইপোমা) অত্যন্ত নিরীহ। ছোট ডে-সার্জারিতে সম্পূর্ণ অপসারণ করা হয়।',
    ARRAY['Soft, moveable, painless lump under skin', 'Slow increase in size']::TEXT[],
    ARRAY['চামড়ার নিচে নরম চর্বির চাকা', 'ধীরে ধীরে বৃদ্ধি পাওয়া']::TEXT[],
    ARRAY['Cosmetic surgical excision under local anesthesia.']::TEXT[],
    ARRAY['লোকাল অ্যানেস্থেসিয়ায় নিখুঁত সেলাই সহ অপারেশন।']::TEXT[],
    'Rapid enlargement, pain, or cosmetic disfigurement.',
    'চাকা দ্রুত বাড়লে বা দাগজনিত সমস্যা হলে সার্জন দেখান।',
    '',
    '',
    '/img/conditions/lump-cyst-lipoma.webp'
),
(
    'cysts',
    'skin',
    26,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    'Sebaceous & Epidermal Cysts',
    'সেবাশিয়াস ও অন্যান্য সিস্ট',
    'Sebaceous cyst',
    'সেবাশিয়াস সিস্ট',
    'Pus or keratin-filled sac under the skin — capsule removal.',
    'চামড়ার নিচে পানি বা রস ভরা ফোলা — থলিসহ অপসারণ।',
    'A cyst is a closed sac under the skin. Complete removal of the capsule prevents recurrent infection.',
    'চামড়ার নিচে তৈলাক্ত গ্রন্থি বন্ধ হয়ে সিস্ট তৈরি হয়। পুরো থলিসহ বের করলে আর ফিরে আসে না।',
    ARRAY['Smooth round nodule', 'Punctum or dark dot', 'Foul discharge if infected']::TEXT[],
    ARRAY['গোল মসৃণ চাকা', 'মাঝখানে কালো বিন্দু', 'ইনফেকশন হলে দুর্গন্ধযুক্ত পুঁজ']::TEXT[],
    ARRAY['Complete capsule excision with cosmetic intradermal stitching.']::TEXT[],
    ARRAY['থলিসহ সিস্ট অপসারণ ও কসমেটিক সেলাই।']::TEXT[],
    'Infection, redness or foul-smelling leakage.',
    'লাল হয়ে ব্যথা হলে বা পুঁজ বের হলে অবিলম্বে সার্জন দেখান।',
    '',
    '',
    '/img/conditions/cysts.webp'
)
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

-- 7.6 Serial Steps (3 Guided Steps)
INSERT INTO public.serial_steps (
    step_number, title_en, title_bn, desc_en, desc_bn,
    primary_btn_text_en, primary_btn_text_bn, primary_btn_link,
    secondary_btn_text_en, secondary_btn_text_bn, secondary_btn_link
) VALUES
(
    1,
    'See where & when he sits',
    'দেখে নিন কবে, কোথায় বসেন',
    'Sherpur every Thursday & Friday · Mymensingh Saturday to Tuesday. Exact addresses, days and timings are listed right on this website.',
    'শেরপুরে প্রতি বৃহস্পতি ও শুক্রবার · ময়মনসিংহে শনি থেকে মঙ্গলবার। ঠিকানা, দিন ও সময় এই পাতাতেই বিস্তারিত দেওয়া আছে।',
    'Chambers & timings →',
    'চেম্বার ও সময় দেখুন →',
    '/contact',
    '',
    '',
    ''
),
(
    2,
    'Tap “Book a serial”',
    '“সিরিয়াল নিন” বোতামে চাপ দিন',
    'The “Book a serial” button is accessible on every page of the website. One click connects you directly to book your serial.',
    'ওয়েবসাইটের প্রতিটা পাতায় “সিরিয়াল নিন” বোতাম আছে। চাপ দিলেই সরাসরি সিরিয়াল বুক করার সুবিধা পাবেন।',
    'Book a serial',
    'সিরিয়াল নিন',
    'tel:01750529252',
    '',
    '',
    ''
),
(
    3,
    'Call or WhatsApp to confirm',
    'কল বা WhatsApp-এ নিশ্চিত করুন',
    'Simply tell us your patient name, problem and selected chamber — your serial number will be confirmed promptly.',
    'আপনার নাম, সমস্যা আর কোন চেম্বারে দেখাবেন জানান — সাথে সাথে সিরিয়াল নম্বর নিশ্চিত করে জানিয়ে দেওয়া হবে।',
    'Call: 01750-529252',
    'কল: ০১৭৫০-৫২৯২৫২',
    'tel:01750529252',
    'WhatsApp Message',
    'WhatsApp-এ লিখুন',
    'https://wa.me/8801670879100'
)
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

-- 7.7 Chambers (3 Visiting Chambers)
INSERT INTO public.chambers (
    id, name_en, name_bn, schedule_en, schedule_bn, address_en, address_bn,
    timing_en, timing_bn, map_query, is_highlighted, is_map_verified, sort_order
) VALUES
(
    1,
    'Asia Diagnostic Center',
    'এশিয়া ডায়াগনস্টিক সেন্টার',
    'Sherpur · Thursday',
    'শেরপুর · বৃহস্পতিবার',
    'Zila Hospital Road, Narayanpur, Sherpur',
    'জেলা হাসপাতাল রোড, নারায়ণপুর, শেরপুর',
    '3:00 PM – 9:00 PM',
    'দুপুর ৩টা – রাত ৯টা',
    'Sadar Hospital Road, Narayanpur, Sherpur',
    TRUE,
    FALSE,
    1
),
(
    2,
    'Amjad Diagnostic Center',
    'আমজাদ ডায়াগনস্টিক সেন্টার',
    'Sherpur · Friday',
    'শেরপুর · শুক্রবার',
    'Zila Hospital Road, Narayanpur, Sherpur',
    'জেলা হাসপাতাল রোড, নারায়ণপুর, শেরপুর',
    '11:00 AM – 9:00 PM',
    'সকাল ১১টা – রাত ৯টা',
    'Amzad diagnostic center, Sherpur',
    TRUE,
    TRUE,
    2
),
(
    3,
    'New Medicare Pathology Lab',
    'নিউ মেডিকেয়ার প্যাথলজি ল্যাব',
    'Mymensingh · Saturday to Tuesday',
    'ময়মনসিংহ · শনি থেকে মঙ্গলবার',
    '204 Charpara (Opposite Hospital Gate 1, 5th floor), Mymensingh',
    '২০৪ চরপাড়া (১নং হাসপাতাল গেটের বিপরীতে, ৫ম তলা), ময়মনসিংহ',
    '3:30 PM – 8:00 PM',
    'বিকাল ৩:৩০টা – রাত ৮টা',
    'New medicare Path. Lab, Charpara, Mymensingh',
    FALSE,
    TRUE,
    3
)
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

-- 7.8 Reviews (4 Verified Patient Testimonials)
INSERT INTO public.reviews (
    id, author_name_en, author_name_bn, author_meta_en, author_meta_bn,
    quote_en, quote_bn, rating, is_sample, is_featured, sort_order
) VALUES
(
    1,
    'A. R.',
    'আ. র.',
    '45 yrs · Sherpur · Piles (Longo Method)',
    '৪৫ বছর · শেরপুর · পাইলস (লংগো পদ্ধতি)',
    'I suffered from piles for years. Sir explained everything calmly — after the Longo operation I went home in two days and I am completely fine now.',
    'অনেক বছর ধরে পাইলসের কষ্টে ছিলাম। স্যার সব শান্তভাবে বুঝিয়ে বললেন, লংগো অপারেশনের দুই দিন পরেই বাড়ি ফিরেছি। এখন একদম ভালো আছি।',
    5,
    TRUE,
    TRUE,
    1
),
(
    2,
    'S. A.',
    'সা. আ.',
    '34 yrs · Mymensingh · Gallstones (Laparoscopic)',
    '৩৪ বছর · ময়মনসিংহ · পিত্তথলির পাথর (ল্যাপারোস্কপি)',
    'I was scared when I heard “gallstones”. It was done through tiny holes and the scars are barely visible. Sir is very caring.',
    'পিত্তথলিতে পাথর শুনে খুব ভয় পেয়েছিলাম। ছোট ছিদ্রে অপারেশন হলো, দাগ প্রায় বোঝাই যায় না। স্যারের ব্যবহার খুবই আন্তরিক।',
    5,
    TRUE,
    TRUE,
    2
),
(
    3,
    'M. H.',
    'ম. হ.',
    '28 yrs · Nalitabari, Sherpur · Fistula Surgery',
    '২৮ বছর · নালিতাবাড়ী, শেরপুর · ফিস্টুলা সার্জারি',
    'My fistula came back after two operations elsewhere. After Dr. Kollol’s surgery it has not returned at all.',
    'অন্য জায়গায় দুইবার অপারেশনের পরও ফিস্টুলা ফিরে এসেছিল। ডাঃ কল্লোলের অপারেশনের পর আর কোনো সমস্যা হয়নি।',
    5,
    TRUE,
    TRUE,
    3
),
(
    4,
    'R. K.',
    'র. খা.',
    '52 yrs · Mymensingh · Breast Lump Excision',
    '৫২ বছর · ময়মনসিংহ · স্তনের চাকা অপসারণ',
    'I was very worried about a lump in my breast. Sir arranged the tests quickly, explained clearly and the surgery was completely smooth.',
    'স্তনে চাকা দেখে খুব দুশ্চিন্তায় ছিলাম। স্যার দ্রুত পরীক্ষা করিয়ে পরিষ্কার করে বুঝিয়ে দিলেন, সময়মতো নিখুঁত অপারেশন হয়েছে।',
    5,
    TRUE,
    TRUE,
    4
)
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

-- 7.9 FAQs (7 Clinical Questions)
INSERT INTO public.faqs (
    id, question_en, question_bn, answer_en, answer_bn, sort_order
) VALUES
(
    1,
    'Do piles always require surgery?',
    'পাইলস হলে কি সবসময় অপারেশন লাগবেই?',
    'No. Early grade piles often respond well to high-fibre nutrition, abundant water intake, sitz baths, and targeted medications. Surgery (such as modern Longo stapler procedure) is recommended when piles persistently prolapse, cause severe blood loss, or fail conservative medical management.',
    'না। শুরুর দিকের পাইলস আঁশযুক্ত খাবার, প্রচুর পানি, কুসুম গরম পানির সেক এবং ওষুধের মাধ্যমে স্বাভাবিক রাখা যায়। পাইলস বাইরে বের হয়ে আটকে থাকলে, বারবার রক্তক্ষরণ হলে বা ওষুধে না সারলে তখন আধুনিক লংগো (স্টেপলার) বা লেজার অপারেশনের পরামর্শ দেওয়া হয়।',
    1
),
(
    2,
    'What is laparoscopic (keyhole) surgery and its benefits?',
    'ল্যাপারোস্কপিক (ছোট ছিদ্রে) অপারেশন কী এবং এর সুবিধা কী?',
    'Laparoscopic surgery uses miniature incisions (3-10mm) and high-definition optical cameras to operate with superior precision. Compared to traditional open incisions, patients enjoy dramatically less pain, negligible scarring, minimal infection risk, and can resume work within days.',
    'ল্যাপারোস্কপি হলো পেট বড় করে না কেটে ছোট ৩-৪টি ছিদ্রে ক্যামেরার সাহায্যে নিখুঁতভাবে অপারেশন করা। এর প্রধান সুবিধা হলো ব্যথা খুব কম হয়, দাগ থাকে না বললেই চলে, ইনফেকশনের ঝুঁকি নেই এবং রোগী কয়েক দিনের মধ্যে কর্মক্ষেত্রে ফিরতে পারেন।',
    2
),
(
    3,
    'How long do I need to stay in the hospital?',
    'অপারেশনের পর হাসপাতালে কত দিন থাকতে হবে?',
    'For most laparoscopic surgeries (gallbladder, hernia, appendix) and Longo piles procedures, patients only need an overnight or 24-48 hour hospital stay. Dr. Kollol provides precise discharge expectations after physical evaluation.',
    'বেশিরভাগ ল্যাপারোস্কপিক অপারেশন (পিত্তথলি, অ্যাপেন্ডিসাইটিস, হার্নিয়া) এবং আধুনিক পাইলস অপারেশনে মাত্র ১ দিন বা ২৪ থেকে ৪৮ ঘণ্টা হাসপাতালে থাকতে হয়। এরপর স্বাভাবিকভাবেই রোগী বাড়ি ফিরতে পারেন।',
    3
),
(
    4,
    'Is every breast lump a sign of cancer?',
    'স্তনে চাকা মানেই কি ক্যান্সার?',
    'Most breast lumps (over 80-90%) in young and middle-aged women are completely benign conditions like fibroadenomas or simple fluid cysts. However, any new palpable lump must be professionally examined and imaged via ultrasound or mammography to be entirely sure.',
    'না, বেশিরভাগ চাকাই (৮০-৯০ ভাগ) নিরীহ বা নন-ক্যান্সারাস যেমন ফাইব্রোঅ্যাডেনোমা বা সিস্ট। তবে স্তনে যেকোনো নতুন চাকা দেখা দিলে দেরি না করে অভিজ্ঞ সার্জনকে দেখিয়ে আল্ট্রাসনোগ্রাম করানোই সবচেয়ে নিরাপদ।',
    4
),
(
    5,
    'Can an anal fistula recur after surgery?',
    'অপারেশনের পর কি ফিস্টুলা আবার ফিরে আসতে পারে?',
    'Fistulas can recur if tracts are complex, high-lying, or improperly excised. Dr. Kollol uses meticulous anatomical mapping and modern staged techniques ensuring optimal sphincter preservation with minimal recurrence rates.',
    'ফিস্টুলার নালি যদি অত্যন্ত জটিল হয় বা ঠিকমতো পুরোটা পরিষ্কার না করা যায় তবে পুনরায় হওয়ার ঝুঁকি থাকে। ডাঃ কল্লোল আধুনিক প্রযুক্তিতে সতর্কতার সাথে পুরো নালি অপসারণ করেন, ফলে ফিরে আসার সম্ভাবনা থাকে সর্বনিম্ন।',
    5
),
(
    6,
    'What documents and reports should I bring to the chamber?',
    'চেম্বারে আসার সময় সাথে কী কী আনা উচিত?',
    'Please bring your previous medical prescriptions, ultrasound films and reports, recent blood investigations, CT/MRI scans if completed, and a complete list of ongoing daily medications.',
    'আপনার আগের চিকিৎসার সকল প্রেসক্রিপশন, আল্ট্রাসনোগ্রাম রিপোর্ট ও ফিল্ম, রক্ত পরীক্ষার কাগজপত্র এবং বর্তমানে নিয়মিত যেসকল ওষুধ সেবন করছেন তার তালিকা সাথে নিয়ে আসুন।',
    6
),
(
    7,
    'How do I book a serial for Sherpur or Mymensingh?',
    'শেরপুর বা ময়মনসিংহের জন্য সিরিয়াল কীভাবে নেব?',
    'Call or WhatsApp 01750-529252 with your patient name, contact number, and desired chamber. Sherpur chamber runs Thursdays & Fridays; Mymensingh chamber runs Saturday through Tuesday.',
    '০১৭৫০-৫২৯২৫২ নম্বরে সরাসরি কল বা WhatsApp মেসেজ করে আপনার নাম ও চেম্বার জানালেই সিরিয়াল নম্বর প্রদান করা হবে। শেরপুরে প্রতি বৃহস্পতি ও শুক্রবার এবং ময়মনসিংহে শনি থেকে মঙ্গলবার রোগী দেখা হয়।',
    7
)
ON CONFLICT (id) DO UPDATE SET
    question_en = EXCLUDED.question_en,
    question_bn = EXCLUDED.question_bn,
    answer_en = EXCLUDED.answer_en,
    answer_bn = EXCLUDED.answer_bn,
    sort_order = EXCLUDED.sort_order;

SELECT setval(pg_get_serial_sequence('public.faqs', 'id'), COALESCE((SELECT MAX(id) FROM public.faqs), 1));

-- 7.10 Medical Articles & Blogs (10 Full Articles)
INSERT INTO public.blogs (
    id, slug, title_en, title_bn, category_slug, excerpt_en, excerpt_bn,
    content_en, content_bn, cover_image, reading_time_en, reading_time_bn,
    is_published, published_at
) VALUES
(
    1,
    'piles-surgery-need-explained',
    'Do Piles Always Need Surgery? When To Treat & When To Operate',
    'পাইলস হলে কি অপারেশন লাগবেই? কখন ওষুধ আর কখন অপারেশন',
    'colorectal',
    'Understand when early piles can be managed without surgery, and when modern methods like Longo stapler surgery provide painless cure.',
    'পাইলস নিয়ে ভয় নয়। জানুন কোন পর্যায়ে ওষুধ ও জীবনযাত্রার পরিবর্তনে সারে, আর কোন জটিলতায় অপারেশন জরুরি হয়ে পড়ে।',
    '### Understanding Piles (Haemorrhoids)
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
- Rapid resumption of standard professional duties.',
    '### পাইলস আসলে কী?
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
- রোগী ২৪ থেকে ৪৮ ঘণ্টার মধ্যে বাড়ি ফিরতে পারেন এবং দ্রুত কাজে ফিরতে পারেন।',
    '',
    '4 min read',
    '৪ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-01T10:00:00Z'::TIMESTAMPTZ
),
(
    2,
    'longo-stapler-surgery-piles',
    'Longo Stapler Surgery: The Modern Painless Approach to Piles',
    'লংগো (স্টেপলার) অপারেশন: পাইলসের আধুনিক ও ব্যথাহীন সমাধান',
    'colorectal',
    'A comprehensive medical guide explaining how circular stapling treats piles with minimal discomfort and rapid recovery.',
    'কাটা-ছেঁড়ার ভয় ভুলে জেনে নিন কীভাবে লংগো স্টেপলার পদ্ধতিতে পাইলস অপারেশন করা হয় এবং রোগী কেন দ্রুত বাড়ি ফেরেন।',
    '### What is Longo (MIPH) Surgery?
Minimally Invasive Procedure for Haemorrhoids (MIPH), widely known as the **Longo technique**, revolutionized colorectal surgery worldwide. Developed by Dr. Antonio Longo, this procedure repositions prolapsing anal cushions back to their natural anatomical location while cutting off excessive blood flow.

### Key Advantages Over Open Surgery
- **No external cuts:** All work is done within the rectal mucosa above the dentate line.
- **Pain-free sensation:** The staple line resides in a zone with zero somatic pain receptors.
- **Low complication rate:** Preserves anal sphincter integrity and continence.
- **Fast hospital discharge:** 1 night stay is customary.',
    '### লংগো অপারেশন কী?
লংগো অপারেশন (MIPH) হলো পাইলস চিকিৎসার বৈশ্বিক যুগান্তকারী আবিষ্কার। এতে মলদ্বারের স্পর্শকাতর অংশের বাইরে বিশেষ স্টেপলার যন্ত্র দিয়ে ভেতরের ঢিলে হয়ে যাওয়া রক্তনালিসমূহ কেটে স্বাভাবিক অবস্থানে টেনে তোলা হয়।

### সাধারণ অপারেশনের চেয়ে কেন এটি উত্তম?
- বাইরে কোনো বড় কাটা বা ক্ষত থাকে না।
- যে অংশে স্টেপলিং হয় সেখানে ব্যথার স্নায়ু থাকে না, তাই অপারেশনের পর ব্যথা খুব কম।
- পায়খানা ধরে রাখার মাংসপেশি ক্ষতিগ্রস্ত হওয়ার কোনো সুযোগ নেই।
- ১ দিনেই হাসপাতাল থেকে ছুটি নিয়ে বাসায় যাওয়া যায়।',
    '',
    '5 min read',
    '৫ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-02T10:00:00Z'::TIMESTAMPTZ
),
(
    3,
    'fistula-recurrence-prevention',
    'Why Does Anal Fistula Recur? Causes and Modern Prevention',
    'ফিস্টুলা বারবার ফিরে আসে কেন? কারণ ও প্রতিরোধের আধুনিক উপায়',
    'colorectal',
    'Discover why fistulas frequently return after improper surgeries, and how advanced surgical mapping stops recurrence.',
    'ফিস্টুলা অপারেশন করার পরও কেন আবার হয়? জানুন কীভাবে সঠিক রোগ নির্ণয় ও নিখুঁত সার্জারিতে ফিস্টুলা চিরতরে দূর করা যায়।',
    '### The Nature of an Anal Fistula
An anal fistula is an abnormal hollow tract running between an infected gland deep inside the anal canal and the external skin. It nearly always originates from a perianal abscess.

### Why Recurrences Happen
1. **Missed secondary tracts:** Complex horseshoe fistulas often branch in multiple directions.
2. **Failure to excise the internal opening:** If the infected crypt gland inside is neglected, pus reforms.
3. **Inappropriate initial drainage:** Incomplete opening leads to quick surface closure while infection lingers underneath.

### Prevention with Dr. Kollol’s Method
- Accurate pre-operative evaluation and tract probing.
- Staged preservation procedures (LIFT, partial fistulotomy with loose seton).
- Careful follow-up dressing ensuring healing from the deep base upwards.',
    '### ফিস্টুলা কেন হয়?
মলদ্বারের ভেতরে থাকা ছোট ছোট গ্রন্থিতে জীবাণু সংক্রমণের ফলে ফোড়া হয়। সেই ফোড়া ফেটে বা কেটে পুঁজ বের করার পর অনেক সময় ভেতরের গ্রন্থি থেকে চামড়ার বাইরে একটি স্থায়ী নালি তৈরি হয়ে যায়, একেই ফিস্টুলা বা ভগন্দর বলে।

### বারবার ফিরে আসার কারণ
১. ফিস্টুলার একাধিক শাখা-প্রশাখা থাকলে তা ঠিকমতো চিহ্নিত না করা।
২. মলদ্বারের ভেতরের প্রধান মুখটি বন্ধ বা অপসারণ না করা।
৩. অভিজ্ঞ সার্জন ছাড়া হাতুড়ে চিকিৎসা নেওয়া বা আংশিক পুঁজ বের করে রাখা।

### স্থায়ীভাবে ফিস্টুলা নিরাময়ের উপায়
- অপারেশনের আগে সঠিক ট্র‍্যাক পরীক্ষা।
- আধুনিক ধাপে ধাপে অপারেশন ও সেটন পদ্ধতি ব্যবহার করা যাতে মল ধরে রাখার ক্ষমতা অক্ষুণ্ণ থাকে।
- অপারেশনের পর ভেতর থেকে সম্পূর্ণ শুকিয়ে আসার যত্নশীল ফলো-আপ।',
    '',
    '6 min read',
    '৬ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-02T14:00:00Z'::TIMESTAMPTZ
),
(
    4,
    'blood-in-stool-causes',
    'Blood in Stool: Is It Piles, Fissure, or Rectal Cancer?',
    'পায়খানার সাথে রক্ত: পাইলস, ফিশার নাকি ক্যান্সার? লক্ষণ দেখে চিনুন',
    'colorectal',
    'Crucial differential diagnostic guidelines to recognize warning signals and act early.',
    'পায়খানার সাথে রক্ত গেলে কখনোই হেলাফেলা করবেন না। জানুন কোন লক্ষণটি নিরীহ আর কোনটি কোলন ক্যান্সারের পূর্বাভাস।',
    '### Blood in Stool: A Symptom Not to Ignore
Many patients assume any rectal bleeding is simply piles and delay consultation. Understanding distinct symptoms is vital for safety:

| Condition | Bleeding Nature | Pain Level | Associated Symptoms |
|---|---|---|---|
| **Piles** | Fresh bright red, drops or jets in the pan | Painless usually | Soft painless lumps |
| **Anal Fissure** | Streak of blood on hard stool or tissue | Severe burning pain | Intense post-defecation spasm |
| **Colorectal Cancer** | Dark red mixed with stool or mucus | Dull ache or no pain | Change in bowel habits, weight loss |

### Critical Red Flags
- Bleeding onset after 40 years of age.
- Alternating constipation and diarrhoea for over 3 weeks.
- Unexplained weight loss and chronic fatigue.',
    '### পায়খানায় রক্ত মানেই পাইলস নয়
আমাদের দেশের রোগীরা মলদ্বারে রক্ত গেলেই পাইলস ভেবে কবিরাজি বা অপচিকিৎসা নেন। অথচ প্রতিটি রোগের রক্তক্ষরণের ধরন ভিন্ন:

| রোগ | রক্তের ধরন | ব্যথার মাত্রা | অন্যান্য লক্ষণ |
|---|---|---|---|
| **পাইলস** | টাটকা লাল রক্ত ফোঁটায় বা পিচকারির মতো পড়ে | সচরাচর ব্যথা থাকে না | মলত্যাগে মাংসপিণ্ড বা গোটা বের হওয়া |
| **এনাল ফিশার** | শক্ত পায়খানার গায়ে রক্তের দাগ লাগে | মলত্যাগের সময় ও পরে তীব্র জ্বালাপোড়া | পায়খানা করতে প্রচণ্ড ভয় পাওয়া |
| **ক্যান্সার** | কালচে রক্ত বা আম/শ্লেষ্মা মিশ্রিত | শুরুর দিকে ব্যথা থাকে না | ওজন কমে যাওয়া, পায়খানার অভ্যাসের ঘন ঘন বদল |

### বিপদচিহ্নসমূহ
- ৪০ বছর বয়সের পর হঠাৎ রক্তক্ষরণ।
- ৩ সপ্তাহের বেশি সময় ধরে ডায়রিয়া ও কোষ্ঠকাঠিন্যের ওলটপালট।
- রক্তশূন্যতা ও দুর্বলতা।',
    '',
    '5 min read',
    '৫ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T09:00:00Z'::TIMESTAMPTZ
),
(
    5,
    'anal-fissure-modern-treatment',
    'Modern Treatment for Painful Anal Fissure: Relief Without Fear',
    'ফিশারের অসহ্য জ্বালাপোড়া ব্যথার আধুনিক চিকিৎসা',
    'colorectal',
    'Learn how chronic fissure pain can be conquered using modern ointments, diet management, and minor sphincter-saving surgery.',
    'মলত্যাগের সময় কাঁচ কাটার মতো জ্বালাপোড়া ব্যথায় ভুগছেন? জেনে নিন ফিশারের সহজ ও আধুনিক চিকিৎসা পদ্ধতি।',
    '### Understanding Anal Fissures
An anal fissure is a tear in the moist, thin mucosal lining of the lower anal canal, caused primarily by hard, dry bowel movements or prolonged diarrhoea.

### The Pain-Spasm Cycle
The fissure creates sharp pain during stool, triggering involuntary spasm of the internal anal sphincter muscle. This reduces blood supply to the tear, preventing healing and intensifying the pain for hours.

### Modern Non-Surgical Treatment
- GTN ointment or Diltiazem cream to relax the sphincter and restore blood flow.
- High-fibre diet with abundant hydration.
- Stool softeners for 4 to 6 weeks.

### Lateral Internal Sphincterotomy (LIS)
For non-healing chronic fissures, a tiny 5-minute precision procedure relieves muscle spasm permanently with instantaneous pain relief.',
    '### এনাল ফিশার কী?
শক্ত পায়খানার ঘর্ষণে মলদ্বারের ভেতরের পাতলা চামড়া ফেটে ক্ষত তৈরি হলে তাকে এনাল ফিশার বলে। 

### ফিশারের ব্যথার দুষ্টচক্র
মলদ্বারে ফাটল ধরলে মাংসপেশি সংকুচিত হয়ে শক্ত হয়ে যায়। এর ফলে সেখানে রক্ত চলাচল কমে যায় এবং ঘা শুকাতে পারে না। ফলে প্রতিবার মলত্যাগে অসহ্য কাঁচ কাটার মতো জ্বালাপোড়া হয় যা ঘণ্টার পর ঘণ্টা স্থায়ী হয়।

### প্রাথমিক চিকিৎসা
- স্ফিঙ্কটার শিথিল করার বিশেষ মলম ব্যবহার।
- কোষ্ঠকাঠিন্য দূর করতে ফাইবারযুক্ত খাবার ও প্রচুর পানি পান।
- মল নরম রাখার নিরাপদ ওষুধ সেবন।

### ছোট অপারেশন (LIS)
দীর্ঘদিনের পুরনো ফিশার ওষুধে না সারলে মাত্র ৫ মিনিটের ছোট অপারেশনে অতিরিক্ত টানটান পেশি শিথিল করে দেওয়া হয়, যাতে রক্ত সঞ্চালন বেড়ে ঘা দ্রুত শুকিয়ে যায়।',
    '',
    '4 min read',
    '৪ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T11:00:00Z'::TIMESTAMPTZ
),
(
    6,
    'gallstones-keyhole-surgery-recovery',
    'Gallstones & Laparoscopy: When to Resume Work and What to Eat',
    'পিত্তথলির পাথর: ল্যাপারোস্কপির পর কবে কাজে ফিরবেন ও কী খাবেন',
    'gallbladder',
    'Everything you need to know about laparoscopic cholecystectomy, post-op recovery timeline, and dietary transitions.',
    'ল্যাপারোস্কপিক পিত্তথলি অপারেশনের পর কত দ্রুত সুস্থ হওয়া যায় এবং অপারেশনের পর খাবারের নিয়ম সম্পর্কে চিকিৎসকের পরামর্শ।',
    '### Why Gallstones Must Be Removed With the Gallbladder
A common misconception is that gallstones can be crushed or dissolved like kidney stones. Because the diseased gallbladder wall continues to produce stones and carries risk of dangerous infection or cancer, removing the entire gallbladder (**cholecystectomy**) is the world gold standard.

### Recovery Timeline
- **Day 1:** Walking around the hospital room a few hours after surgery; taking liquid food.
- **Day 2:** Discharged to home; comfortable with oral pain medicines.
- **Day 3-5:** Light desk work and gentle walking outdoors.
- **Day 7:** Complete return to driving, normal office work, and daily activities.

### Post-Surgery Diet Tips
- Small frequent meals for the first 2 weeks.
- Avoid excessively heavy, oily, or fried items initially.
- The liver takes over bile storage seamlessly without altering digestion.',
    '### পাথর নয়, পুরো পিত্তথলি কেন ফেলা হয়?
অনেকে ভাবেন কিডনির মতো পিত্তথলির পাথরও ভেঙে ফেলা সম্ভব। কিন্তু পিত্তথলির দেয়ালে ত্রুটি থাকায় পাথর বারবার তৈরি হয় এবং এতে পিত্তনালি বন্ধ হয়ে জন্ডিস বা মারাত্মক সংক্রমণের ঝুঁকি থাকে। তাই ল্যাপারোস্কপির মাধ্যমে পুরো পিত্তথলি অপসারণ করাই বিশ্বজুড়ে একমাত্র স্বীকৃত চিকিৎসা।

### সুস্থ হওয়ার সময়সূচি
- **১ম দিন:** অপারেশনের কয়েক ঘণ্টার মধ্যেই রোগী নিজে হেঁটে বাথরুমে যেতে পারেন ও তরল খাবার খান।
- **২য় দিন:** হাসপাতাল থেকে ছুটি পেয়ে বাড়ি ফেরা।
- **৩-৫ দিন:** ঘরের স্বাভাবিক কাজকর্ম ও হালকা হাঁটাচলা।
- **৭ম দিন:** যেকোনো নিয়মিত অফিস, দোকান বা পড়াশোনার কাজে ফেরা।

### অপারেশনের পর খাদ্যাভ্যাস
- প্রথম ২-৩ সপ্তাহ অতিরিক্ত তৈলাক্ত ও ভাজাপোড়া খাবার পরিহার করা।
- পিত্তথলি না থাকলেও লিভার স্বাভাবিকভাবেই পিত্তরস তৈরি করে হজমপ্রক্রিয়া সম্পূর্ণ ঠিক রাখে।',
    '',
    '5 min read',
    '৫ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T13:00:00Z'::TIMESTAMPTZ
),
(
    7,
    'laparoscopic-hernia-mesh-repair',
    'Laparoscopic Hernia Mesh Repair (TAPP/IPOM): Explained Simply',
    'হার্নিয়া: মেশ দিয়ে ল্যাপারোস্কপিক অপারেশন (TAPP/IPOM) সহজ ভাষায়',
    'abdomen',
    'Discover how modern surgical mesh placed via keyhole technique restores abdominal wall strength permanently.',
    'হার্নিয়া হলে কেন মেশ লাগে? জেনে নিন কীভাবে ছোট ছিদ্রের সাহায্যে পেটের ভেতর মেশ বসিয়ে হার্নিয়া সারিয়ে তোলা হয়।',
    '### What is a Hernia?
A hernia develops when internal organs (most commonly the intestine or intra-abdominal fat) protrude through a weakened zone in the surrounding muscle wall. It will never resolve with medicine or belts.

### Why Mesh Is Indispensable
Simply sewing the weak muscle margins together creates immense tension, leading to failure and recurrence. A specialized synthetic mesh acts as a permanent structural scaffold, allowing natural collagen and fibrous tissue to weave through it.

### Why Keyhole (TAPP/TEP) Repair Is Superior
1. **Mesh placed from the inside:** Pressure from inside pushes the mesh tighter against the wall, following Pascal’s physical law.
2. **Tiny scars:** 3 micro-ports rather than a large painful groin incision.
3. **Bilaterality:** Both sides can be inspected and repaired through the exact same incisions.',
    '### হার্নিয়া কেন হয়?
পেটের মাংসপেশির কোনো অংশ দুর্বল হয়ে ফাঁকা হলে ভেতর থেকে নাড়িভুড়ি বাইরে বেরিয়ে আসে, যাকে হার্নিয়া বলে। এটি কোনো ওষুধ বা বেল্টে সারে না।

### অপারেশনে মেশ কেন দেওয়া হয়?
দুর্বল মাংসপেশি শুধু সেলাই করে দিলে কিছুদিন পর আবার ফেটে হার্নিয়া ফিরে আসার ঝুঁকি থাকে। মেশ হলো বিশেষ ধরনের জাল যা পেটের দেয়ালকে আজীবনের জন্য সুদৃঢ় করে তোলে।

### ল্যাপারোস্কপিক হার্নিয়া অপারেশনের সুবিধা
১. মেশটি পেটের ভেতরের দিক থেকে বসানো হয়, ফলে পেটের ভেতরের চাপে মেশটি দেয়ালের সাথে আরও শক্তভাবে আটকে থাকে।
২. কুঁচকি বড় করে কাটার বদলে মাত্র ৩টি ছোট ছিদ্রে অপারেশন করা হয়।
৩. দুই দিকের কুঁচকিতে হার্নিয়া থাকলেও একই ছিদ্র দিয়ে একসাথে চিকিৎসা করা যায়।',
    '',
    '5 min read',
    '৫ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T15:00:00Z'::TIMESTAMPTZ
),
(
    8,
    'breast-lump-not-always-cancer',
    'A Breast Lump is Not Always Cancer: When To See a Surgeon',
    'স্তনে চাকা মানেই ক্যান্সার নয় — কখন দ্রুত ডাক্তার দেখাবেন',
    'breast',
    'Empowering awareness for women and families on diagnosing breast lumps accurately without unnecessary panic.',
    'স্তনে চাকা অনুভব হলে আতঙ্কিত হবেন না। শতকরা ৮০-৯০ ভাগ চাকাই নিরীহ। জানুন কখন ও কীভাবে সঠিক পরীক্ষা করাবেন।',
    '### Panic vs Preparation
Discovering a breast lump causes immediate dread of cancer. However, medical statistics show that 80-90% of palpable breast lumps in women under 40 are benign conditions.

### Common Benign Lumps
- **Fibroadenoma:** Firm, smooth, slippery rubbery lumps that move freely under the fingertips ("breast mouse").
- **Fibrocystic changes:** Fluid-filled tender sacs that fluctuate with monthly cycles.
- **Breast abscess:** Painful red swelling occurring during breastfeeding.

### When to Seek Immediate Surgical Evaluation
- Lump feels hard, uneven, or stuck to skin or chest wall.
- Spontaneous bloody discharge from one nipple.
- Nipple turns inward or skin looks dimpled like orange peel.
- Persistent lumps developing after menopause.',
    '### আতঙ্ক নয়, সচেতন হোন
স্তনে চাকা মানেই ক্যান্সার এমন ধারণা ভুল। ৪০ বছরের কম বয়সী নারীদের ক্ষেত্রে শতকরা প্রায় ৯০ ভাগ চাকাই সম্পূর্ণ নিরীহ।

### নিরীহ চাকার প্রকারভেদ
- **ফাইব্রোঅ্যাডেনোমা:** মসৃণ ও সহজে নড়াচড়া করে এমন ব্যথাহীন চাকা, যা সাধারণত তরুণীদের বেশি হয়।
- **সিস্ট বা পানিভরা থলি:** মাসিকের হরমোনের তারতম্যে তৈরি হওয়া চাকা যা মাসিকের আগে ব্যথা করতে পারে।
- **স্তনে ফোড়া:** বিশেষ করে স্তন্যদানকারী মায়েদের দুধ জমে প্রদাহ থেকে ফোড়া হতে পারে।

### যেসব ক্ষেত্রে দ্রুত সার্জন দেখাবেন
- চাকা যদি পাথরের মতো শক্ত ও অনড় মনে হয়।
- বোঁটা ভেতরের দিকে দেবে গেলে বা রক্তক্ষরণ হলে।
- স্তনের চামড়া কমলার খোসার মতো কুঁচকে গেলে।
- মেনোপজ বা মাসিক স্থায়ীভাবে বন্ধ হওয়ার পর নতুন চাকা দেখা দিলে।',
    '',
    '5 min read',
    '৫ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T16:00:00Z'::TIMESTAMPTZ
),
(
    9,
    'appendicitis-signs-and-dangers',
    'Appendicitis Signs: Why Delaying Medical Care Is Extremely Dangerous',
    'অ্যাপেন্ডিসাইটিসের লক্ষণ: দেরি করলে কী বিপদ হতে পারে',
    'abdomen',
    'Learn how to identify genuine appendicitis pain, avoid painkiller masking, and prevent appendix rupture.',
    'পেটে ব্যথা হলেই ব্যথানাশক ওষুধ খাবেন না। অ্যাপেন্ডিক্স ফেটে যাওয়ার মতো মারাত্মক বিপদ এড়াতে জেনে নিন আসল লক্ষণ।',
    '### The Function and Danger of the Appendix
The appendix is a small, finger-shaped pouch projecting from the right side of the large intestine. When its opening becomes blocked by hard stool or swollen lymphoid tissue, bacterial multiplication triggers rapid inflammation.

### Typical Sequence of Symptoms
1. Dull aching pain commencing around the umbilicus (navel).
2. The pain shifts after several hours directly to the right lower abdomen.
3. Movement, coughing, or pressing the area causes severe tenderness.
4. Accompanying nausea, loss of appetite, and mild fever.

### The Lethal Danger of Rupture
Taking strong painkillers without consulting a surgeon temporarily masks symptoms. Meanwhile, the appendix swells until it **perforates (bursts)**, spilling contaminated pus throughout the abdominal cavity (**peritonitis**), requiring extensive emergency surgery.',
    '### অ্যাপেন্ডিক্স কী ও কেন প্রদাহ হয়?
অ্যাপেন্ডিক্স হলো নাড়িভুড়ির শুরুর দিকে থাকা একটি ছোট আঙুলের মতো থলি। কোনো কারণে এর মুখ শক্ত মলে আটকে গেলে ভেতরে ব্যাকটেরিয়া দ্রুত ছড়িয়ে পড়ে ফুলে ওঠে, যাকে অ্যাপেন্ডিসাইটিস বলে।

### উপসর্গের ধারাবাহিকতা
১. প্রথমে নাভির চারপাশজুড়ে নিস্তেজ ব্যথা শুরু হয়।
২. কয়েক ঘণ্টা পর ব্যথা স্থায়ীভাবে তলপেটের ডান পাশে চলে আসে এবং তীব্র হতে থাকে।
৩. কাশি দিলে, হাঁটলে বা চাপ দিলে ব্যথা বাড়ে।
৪. খাবারে সম্পূর্ণ অরুচি, বমি ভাব ও হালকা জ্বর থাকে।

### ফেটে যাওয়ার মারাত্মক ঝুঁকি
ডাক্তার না দেখিয়ে দোকান থেকে কড়া ব্যথানাশক ট্যাবলেট খেলে ব্যথা সাময়িক কমে যায় ঠিকই, কিন্তু ভেতরে জীবাণুর বিস্তার থামে না। ফলে অ্যাপেন্ডিক্স ফেটে গিয়ে পুরো পেটে পুঁজ ছড়িয়ে জীবন সংকটাপন্ন হতে পারে। তাই দ্রুত ল্যাপারোস্কপিক অপারেশনই একমাত্র নিরাপদ সমাধান।',
    '',
    '4 min read',
    '৪ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T17:00:00Z'::TIMESTAMPTZ
),
(
    10,
    'surgery-faqs-ten-patient-questions',
    '10 Questions Patients Ask Most Before and After Surgery',
    'অপারেশনের আগে-পরে রোগীদের সবচেয়ে বেশি করা ১০টি প্রশ্ন',
    'colorectal',
    'Clear, compassionate answers to essential queries regarding fasting, anaesthesia, recovery, bathing, and diet.',
    'অপারেশন নিয়ে সাধারণ মানুষের মনে থাকা ১০টি প্রধান প্রশ্নের খোলামেলা ও নির্ভরযোগ্য উত্তর।',
    '### Frequently Asked Surgical Questions
**1. How long do I fast before surgery?**
No solid food for 6 hours; clear water up to 2 hours before general or spinal anaesthesia.

**2. Will I feel pain during surgery?**
No. Modern spinal or general anaesthesia guarantees absolute painlessness throughout the surgical procedure.

**3. When can I shower after surgery?**
With waterproof sterile dressings, showering is often permitted 48 hours post-operation.

**4. When can I climb stairs?**
Light stair climbing is safe from day 2 for keyhole surgeries.

**5. Does keyhole surgery leave visible marks?**
Tiny 5mm marks fade significantly within a few months into barely visible thin lines.',
    '### রোগীদের সচরাচর প্রশ্ন ও উত্তর
**১. অপারেশনের কতক্ষণ আগে না খেয়ে থাকতে হয়?**
সাধারণত অপারেশনের ৬ ঘণ্টা আগে কোনো ভারী খাবার খাওয়া যায় না। অপারেশনের ২ ঘণ্টা আগ পর্যন্ত অল্প পরিষ্কার পানি পান করা যেতে পারে।

**২. অপারেশনের সময় কি কোনো ব্যথা পাওয়া যায়?**
একদমই না। আধুনিক অবশকরণ (অ্যানেস্থেসিয়া) পদ্ধতিতে রোগী সম্পূর্ণ ব্যথামুক্ত থাকেন।

**৩. অপারেশনের কতদিন পর গোসল করা যায়?**
ওয়াটারপ্রুফ ড্রেসিং করা থাকলে অপারেশনের ৪৮ ঘণ্টা পর থেকেই সাবধানে গোসল করা যায়।

**৪. সিঁড়ি দিয়ে ওঠা-নামা করা যাবে কি?**
ল্যাপারোস্কপিক অপারেশনের দ্বিতীয় দিন থেকেই ধীরেসুস্থে সিঁড়ি ব্যবহার করা সম্পূর্ণ নিরাপদ।

**৫. ল্যাপারোস্কপির দাগ কি স্থায়ী হয়?**
মাত্র ৩-৫ মিলিমিটারের দাগ কয়েক মাসের মধ্যেই মিলিয়ে গিয়ে প্রায় অদৃশ্য হয়ে যায়।',
    '',
    '6 min read',
    '৬ মিনিট পড়ার সময়',
    TRUE,
    '2026-10-03T18:00:00Z'::TIMESTAMPTZ
)
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

-- 7.11 Super Admin Credentials (Bcrypt Hashed via pgcrypto)
-- Default Username: admin (or drkollol)
-- Default Email: admin@drkollol.com (or kollolsomc44@gmail.com)
-- Master Password: Admin@Kollol2026!
INSERT INTO public.admin_users (
    email, username, password_hash, role, full_name, is_active
) VALUES (
    'admin@drkollol.com',
    'admin',
    crypt('Admin@Kollol2026!', gen_salt('bf', 10)),
    'super_admin',
    'Dr. Fahim Foysal Kollol',
    TRUE
),
(
    'kollolsomc44@gmail.com',
    'drkollol',
    crypt('Admin@Kollol2026!', gen_salt('bf', 10)),
    'super_admin',
    'Dr. Fahim Foysal Kollol',
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    password_hash = crypt('Admin@Kollol2026!', gen_salt('bf', 10)),
    role = EXCLUDED.role,
    is_active = TRUE,
    updated_at = NOW();

-- ==================================================================================
-- END OF SCHEMA & SEED MIGRATION
-- ==================================================================================
