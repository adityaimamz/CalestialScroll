-- Migration to add Comments feature

-- 1. Create Comments Table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  novel_id UUID REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE, -- Nullable: If null, it's a novel comment
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Everyone can view comments (Public read)
CREATE POLICY "Anyone can view comments" 
ON public.comments FOR SELECT 
USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments" 
ON public.comments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
ON public.comments FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON public.comments FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Grant Permissions
GRANT ALL ON public.comments TO authenticated;
GRANT SELECT ON public.comments TO service_role;
GRANT ALL ON public.comments TO service_role;
