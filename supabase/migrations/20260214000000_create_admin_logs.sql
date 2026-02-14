-- Create admin_logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'BAN', 'APPROVE', 'REJECT'
    entity_type TEXT NOT NULL, -- 'NOVEL', 'CHAPTER', 'USER', 'COMMENT', 'REVIEW'
    entity_id UUID, -- Can be null if entity is deleted and we don't want strict FK, or just for reference
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and Moderators can view logs
CREATE POLICY "Admins and Moderators can view admin logs"
ON public.admin_logs
FOR SELECT
USING (
  public.is_admin_or_moderator(auth.uid())
);

-- Policy: Admins and Moderators can insert logs
CREATE POLICY "Admins and Moderators can insert admin logs"
ON public.admin_logs
FOR INSERT
WITH CHECK (
  public.is_admin_or_moderator(auth.uid())
);

-- Grant access
GRANT SELECT, INSERT ON public.admin_logs TO authenticated;
GRANT SELECT, INSERT ON public.admin_logs TO service_role;
