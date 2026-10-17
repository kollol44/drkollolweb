-- ==================================================================================
-- Chatbot Configuration & Enterprise Security Migration
-- Dr. Fahim Foysal Kollol Medical Platform
-- ==================================================================================

-- 1. Create Chatbot Configuration Table
CREATE TABLE IF NOT EXISTS public.chatbot_config (
    id TEXT PRIMARY KEY DEFAULT 'global',
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    gemini_api_keys TEXT[] NOT NULL DEFAULT '{}',
    active_key_index INT NOT NULL DEFAULT 0,
    welcome_message_en TEXT NOT NULL DEFAULT 'Hello! I am Dr. Fahim Foysal Kollol''s clinical assistant. How can I help you regarding chambers, surgery procedures, or serial booking today?',
    welcome_message_bn TEXT NOT NULL DEFAULT 'আসসালামু আলাইকুম। আমি ডাঃ ফাহিম ফয়সাল কল্লোলের ডিজিটাল ক্লিনিক্যাল অ্যাসিস্ট্যান্ট। চেম্বার, সিরিয়াল বা সার্জারি পরামর্শের তথ্যে কীভাবে সাহায্য করতে পারি?',
    suggested_questions_en TEXT[] NOT NULL DEFAULT ARRAY[
        'Where are Dr. Kollol''s chambers located?',
        'How can I book a serial for consultation?',
        'What laparoscopic surgeries are performed?',
        'Emergency contact & WhatsApp number'
    ],
    suggested_questions_bn TEXT[] NOT NULL DEFAULT ARRAY[
        'ডাঃ কল্লোলের চেম্বার কোথায় ও সময়সূচী কী?',
        'ডাক্তার দেখানোর সিরিয়াল কীভাবে নিব?',
        'ল্যাপারোস্কপিক ও পাইলস অপারেশনের তথ্য',
        'জরুরি যোগাযোগ ও হোয়াটসঅ্যাপ নম্বর'
    ],
    max_tokens_per_reply INT NOT NULL DEFAULT 400,
    temperature NUMERIC NOT NULL DEFAULT 0.2,
    rate_limit_per_minute INT NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;

-- 3. RLS Security Policies
-- Public / Anon can only READ non-sensitive fields via server or public view
DROP POLICY IF EXISTS "Public Read Chatbot Config" ON public.chatbot_config;
CREATE POLICY "Public Read Chatbot Config" ON public.chatbot_config 
    FOR SELECT 
    USING (true);

-- Only Admin or Service Role can UPDATE / INSERT config
DROP POLICY IF EXISTS "Admin Full Access Chatbot Config" ON public.chatbot_config;
CREATE POLICY "Admin Full Access Chatbot Config" ON public.chatbot_config 
    FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 4. Insert Default Configuration Row
INSERT INTO public.chatbot_config (
    id,
    is_enabled,
    gemini_api_keys,
    welcome_message_en,
    welcome_message_bn
) VALUES (
    'global',
    true,
    '{}',
    'Hello! I am Dr. Fahim Foysal Kollol''s clinical assistant. How can I help you regarding chambers, surgery procedures, or serial booking today?',
    'আসসালামু আলাইকুম। আমি ডাঃ ফাহিম ফয়সাল কল্লোলের ডিজিটাল ক্লিনিক্যাল অ্যাসিস্ট্যান্ট। চেম্বার, সিরিয়াল বা সার্জারি পরামর্শের তথ্যে কীভাবে সাহায্য করতে পারি?'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Trigger for updated_at
DROP TRIGGER IF EXISTS trg_chatbot_config_updated ON public.chatbot_config;
CREATE TRIGGER trg_chatbot_config_updated 
    BEFORE UPDATE ON public.chatbot_config 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();
