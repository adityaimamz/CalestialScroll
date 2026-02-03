-- Migration untuk menambah fitur Bookmarks, Ratings, Views, dan Reading History

-- 1. Create Bookmarks Table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  novel_id UUID REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, novel_id)
);

-- 2. Create Novel Ratings Table
CREATE TABLE public.novel_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  novel_id UUID REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL,
  rating_value INTEGER NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, novel_id)
);

-- 3. Create Reading History Table
CREATE TABLE public.reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  novel_id UUID REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id)
);

-- 4. Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novel_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Bookmarks: Users can manage their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Ratings: Users can manage their own ratings
CREATE POLICY "Anyone can view ratings" ON public.novel_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own ratings" ON public.novel_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.novel_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.novel_ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Reading History: Users can manage their own history
CREATE POLICY "Users can view own history" ON public.reading_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.reading_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON public.reading_history FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 6. Functions

-- Function to increment novel views atomically
CREATE OR REPLACE FUNCTION public.increment_novel_views(_novel_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.novels
  SET views = views + 1
  WHERE id = _novel_id;
$$;

-- Function to update average rating on novel
CREATE OR REPLACE FUNCTION public.update_novel_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.novels
  SET rating = (
    SELECT COALESCE(ROUND(AVG(rating_value), 2), 0)
    FROM public.novel_ratings
    WHERE novel_id = COALESCE(NEW.novel_id, OLD.novel_id)
  )
  WHERE id = COALESCE(NEW.novel_id, OLD.novel_id);
  RETURN NULL;
END;
$$;

-- Trigger to auto-update rating
CREATE TRIGGER on_rating_change
AFTER INSERT OR UPDATE OR DELETE ON public.novel_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_novel_rating();

-- Grant permissions explicitly (Safe measure)
GRANT ALL ON public.bookmarks TO authenticated;
GRANT ALL ON public.novel_ratings TO authenticated;
GRANT ALL ON public.reading_history TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
GRANT ALL ON public.novel_ratings TO service_role;
GRANT ALL ON public.reading_history TO service_role;

-- Allow public to read ratings (aggregate info usually public need join?) 
-- Actually we aggregate on novels table, so direct access to novel_ratings might not be needed for public, 
-- but "Anyone can view ratings" policy above covers it if we want to show "User X rated 5 stars".
