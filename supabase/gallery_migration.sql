-- ==================================================================================
-- Gallery Photos & Videos Migration
-- Dr. Fahim Foysal Kollol Medical Platform
-- ==================================================================================

-- 1. Create Gallery Photos Table
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id TEXT PRIMARY KEY DEFAULT ('photo_' || replace(gen_random_uuid()::TEXT, '-', '')),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    caption_en TEXT DEFAULT '',
    caption_bn TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Gallery Videos Table
CREATE TABLE IF NOT EXISTS public.gallery_videos (
    id TEXT PRIMARY KEY DEFAULT ('vid_' || replace(gen_random_uuid()::TEXT, '-', '')),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description_en TEXT DEFAULT '',
    description_bn TEXT DEFAULT '',
    video_url TEXT NOT NULL,
    video_type TEXT NOT NULL DEFAULT 'youtube',
    video_id TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Automatic updated_at Triggers
DROP TRIGGER IF EXISTS trg_gallery_photos_updated ON public.gallery_photos;
CREATE TRIGGER trg_gallery_photos_updated BEFORE UPDATE ON public.gallery_photos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_gallery_videos_updated ON public.gallery_videos;
CREATE TRIGGER trg_gallery_videos_updated BEFORE UPDATE ON public.gallery_videos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Public Read Gallery Photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Public Read Gallery Videos" ON public.gallery_videos;
DROP POLICY IF EXISTS "Admin All Gallery Photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Admin All Gallery Videos" ON public.gallery_videos;

-- Public Read Policies
CREATE POLICY "Public Read Gallery Photos" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery Videos" ON public.gallery_videos FOR SELECT USING (true);

-- Admin / Service Role Full Access Policies
CREATE POLICY "Admin All Gallery Photos" ON public.gallery_photos FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admin All Gallery Videos" ON public.gallery_videos FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_photos_order ON public.gallery_photos(sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_cat ON public.gallery_photos(category);
CREATE INDEX IF NOT EXISTS idx_gallery_videos_order ON public.gallery_videos(sort_order ASC, created_at DESC);

-- 6. Storage Bucket for Gallery (if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Gallery Bucket" ON storage.objects;
CREATE POLICY "Public Access Gallery Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated Upload Gallery Bucket" ON storage.objects;
CREATE POLICY "Authenticated Upload Gallery Bucket" ON storage.objects FOR ALL USING (bucket_id = 'gallery' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated'));
