-- Add admin_reply and admin_id to chapter_reports
ALTER TABLE public.chapter_reports 
ADD COLUMN IF NOT EXISTS admin_reply TEXT,
ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add admin_reply and admin_id to comment_reports
ALTER TABLE public.comment_reports 
ADD COLUMN IF NOT EXISTS admin_reply TEXT,
ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update notifications type check constraint
-- Postgres doesn't allow easy modification of check constraints, so we drop and re-add
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('reply', 'like', 'system', 'admin_report', 'report_reply'));
