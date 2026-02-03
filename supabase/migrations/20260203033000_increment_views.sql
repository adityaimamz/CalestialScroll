-- Create function to increment novel views
CREATE OR REPLACE FUNCTION public.increment_novel_views(_novel_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.novels
  SET views = views + 1
  WHERE id = _novel_id;
$$;
