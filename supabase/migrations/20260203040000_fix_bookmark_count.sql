-- Create function to get total bookmark count for a novel (bypassing RLS)
CREATE OR REPLACE FUNCTION public.get_novel_bookmark_count(_novel_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT count(*)::INTEGER
  FROM public.bookmarks
  WHERE novel_id = _novel_id;
$$;

-- Ensure bookmarks table exists and has RLS (in case it was missing)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    novel_id UUID REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, novel_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their OWN bookmarks (if not already exists)
-- Note: 'DO NOTHING' isn't standard SQL for CREATE POLICY, so we drop and recreate to be safe
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
