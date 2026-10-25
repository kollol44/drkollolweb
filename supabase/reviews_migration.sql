-- ==================================================================================
-- Google Reviews & Dynamic QR Code Migration
-- Dr. Fahim Foysal Kollol Medical Platform
-- ==================================================================================

-- 1. Add google_review_url to reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS google_review_url TEXT DEFAULT '';

-- 2. Add google review and rating fields to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS google_review_url TEXT DEFAULT 'https://maps.google.com/?cid=drkollol';

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS google_rating NUMERIC DEFAULT 4.9;

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS google_review_count INT DEFAULT 54;

-- 3. Update existing reviews with fallback google_review_url if empty
UPDATE public.reviews
SET google_review_url = 'https://maps.google.com/?cid=drkollol'
WHERE google_review_url IS NULL OR google_review_url = '';

-- 4. Verify RLS Policies for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' AND policyname = 'Allow public read access to reviews'
    ) THEN
        CREATE POLICY "Allow public read access to reviews"
        ON public.reviews FOR SELECT
        TO public
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' AND policyname = 'Allow authenticated users full access to reviews'
    ) THEN
        CREATE POLICY "Allow authenticated users full access to reviews"
        ON public.reviews FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;
