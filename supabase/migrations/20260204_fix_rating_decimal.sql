-- Ensure rating column is DECIMAL to support float values like 4.5
ALTER TABLE public.novels 
ALTER COLUMN rating TYPE DECIMAL(3, 2);

-- Re-create the update function to ensure it calculates correctly (just in case)
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
