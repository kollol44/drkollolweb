-- =================================================================
-- Supabase Database Schema for Dr. Fahim Foysal Kollol Website
-- Production Grade, RLS Enabled, Bilingual English & Bangla Support
-- =================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SITE SETTINGS TABLE
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
    disclaimer_en TEXT NOT NULL DEFAULT 'Information on this site is not a substitute for professional medical advice or consultation.',
    disclaimer_bn TEXT NOT NULL DEFAULT 'এই সাইটের তথ্য ডাক্তার দেখানোর বা পেশাদার পরামর্শের বিকল্প নয়।',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. HERO SECTION TABLE
CREATE TABLE IF NOT EXISTS public.hero_section (
    id TEXT PRIMARY KEY DEFAULT 'hero_main',
    h1_en TEXT NOT NULL DEFAULT 'Every incision has a reason.',
    h1_bn TEXT NOT NULL DEFAULT 'প্রতিটা ইনসিশনের পেছনে একটা কারণ আছে।',
    h2_en TEXT NOT NULL DEFAULT 'And an <em>expert surgeon</em> knows it all.',
    h2_bn TEXT NOT NULL DEFAULT 'আর একজন <em>অভিজ্ঞ সার্জনই</em> সেই কারণ জানেন।',
    meet_cta_en TEXT NOT NULL DEFAULT 'Meet your surgeon',
    meet_cta_bn TEXT NOT NULL DEFAULT 'পরিচিত হন আপনার সার্জনের সাথে',
    scroll_cue_en TEXT NOT NULL DEFAULT 'Scroll',
    scroll_cue_bn TEXT NOT NULL DEFAULT 'স্ক্রল করুন',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SURGEON PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.surgeon_profile (
    id TEXT PRIMARY KEY DEFAULT 'kollol',
    name_en TEXT NOT NULL DEFAULT 'Dr. Fahim Foysal Kollol',
    name_bn TEXT NOT NULL DEFAULT 'ডাঃ ফাহিম ফয়সাল কল্লোল',
    intro_word_en TEXT NOT NULL DEFAULT 'Meet Your Surgeon',
    intro_word_bn TEXT NOT NULL DEFAULT 'ইনিই আপনার সার্জন',
    role_en TEXT NOT NULL DEFAULT 'General, Laparoscopic, Breast & Colorectal Surgeon',
    role_bn TEXT NOT NULL DEFAULT 'জেনারেল, ল্যাপারোস্কপিক, ব্রেস্ট ও কলোরেক্টাল সার্জন',
    post_en TEXT NOT NULL DEFAULT 'Assistant Professor of Surgery, Mymensingh Medical College Hospital · BMDC Reg. A-61041',
    post_bn TEXT NOT NULL DEFAULT 'সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল · বিএমডিসি রেজি: এ-৬১০৪১',
    chambers_summary_en TEXT NOT NULL DEFAULT '<strong>Sherpur</strong> every Thursday & Friday · <strong>Mymensingh</strong> Saturday to Tuesday',
    chambers_summary_bn TEXT NOT NULL DEFAULT '<strong>শেরপুরে</strong> প্রতি বৃহস্পতি ও শুক্রবার · <strong>ময়মনসিংহে</strong> শনি থেকে মঙ্গলবার',
    degrees_badges JSONB NOT NULL DEFAULT '["MBBS", "BCS (Health)", "FCPS (Surgery)", "MACS (USA)"]'::JSONB,
    stats JSONB NOT NULL DEFAULT '[
        {"num_en": "10,000+", "num_bn": "১০,০০০+", "label_en": "Major & minor surgeries", "label_bn": "বড়-ছোট অপারেশন"},
        {"num_en": "300+", "num_bn": "৩০০+", "label_en": "Laparoscopic (keyhole) surgeries", "label_bn": "ল্যাপারোস্কপিক অপারেশন"},
        {"num_en": "250+", "num_bn": "২৫০+", "label_en": "Fistula operations", "label_bn": "ফিস্টুলা অপারেশন"},
        {"num_en": "100+", "num_bn": "১০০+", "label_en": "Longo (stapler) piles surgeries", "label_bn": "লংগো পদ্ধতিতে পাইলস অপারেশন"},
        {"num_en": "10+ yrs", "num_bn": "১০+ বছর", "label_en": "In practice since 2015", "label_bn": "২০১৫ থেকে চিকিৎসা দিচ্ছেন"},
        {"num_en": "11", "num_bn": "১১", "label_en": "Research publications", "label_bn": "গবেষণা প্রকাশনা"}
    ]'::JSONB,
    degrees_ticker JSONB NOT NULL DEFAULT '[
        {"en": "MBBS", "bn": "এমবিবিএস"},
        {"en": "BCS (Health) · 33rd BCS", "bn": "বিসিএস (স্বাস্থ্য) · ৩৩তম বিসিএস"},
        {"en": "FCPS (Surgery)", "bn": "এফসিপিএস (সার্জারি)"},
        {"en": "MACS (USA)", "bn": "এমএসিএস (আমেরিকা)"},
        {"en": "Life Member, SOSB", "bn": "আজীবন সদস্য, এসওএসবি"},
        {"en": "Life Member, SELSB", "bn": "আজীবন সদস্য, এসইএলএসবি"},
        {"en": "Assistant Professor of Surgery, MMCH", "bn": "সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ"},
        {"en": "Laparoscopy Training, SELSB", "bn": "ল্যাপারোস্কপি ট্রেনিং, এসইএলএসবি"}
    ]'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CATEGORIES TABLE
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

-- 6. CONDITIONS TABLE
CREATE TABLE IF NOT EXISTS public.conditions (
    slug TEXT PRIMARY KEY,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON DELETE CASCADE,
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

-- 7. SERIAL STEPS TABLE
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

-- 8. CHAMBERS TABLE
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

-- 9. REVIEWS TABLE
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

-- 10. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id SERIAL PRIMARY KEY,
    question_en TEXT NOT NULL,
    question_bn TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_bn TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON DELETE RESTRICT,
    excerpt_en TEXT NOT NULL,
    excerpt_bn TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_bn TEXT NOT NULL,
    cover_image TEXT DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. APPOINTMENTS TABLE (Patients form submissions)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    chamber_id INT REFERENCES public.chambers(id),
    chamber_name TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    problem_summary TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    source TEXT DEFAULT 'website',
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ROW LEVEL SECURITY (RLS) POLICIES
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

-- Public READ access for website visitors
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

-- Patient appointment submission (Public INSERT)
CREATE POLICY "Public Insert Appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- Authenticated Admin Full CRUD Access
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
