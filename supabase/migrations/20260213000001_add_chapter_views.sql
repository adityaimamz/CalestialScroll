
-- 1. Add views column to chapters
ALTER TABLE "public"."chapters" ADD COLUMN "views" bigint DEFAULT 0 NOT NULL;

-- 2. Backfill views from reading_history
-- Count how many times each chapter_id appears in reading_history and update chapters.views
WITH chapter_counts AS (
    SELECT chapter_id, COUNT(*) as view_count
    FROM reading_history
    GROUP BY chapter_id
)
UPDATE chapters
SET views = chapter_counts.view_count
FROM chapter_counts
WHERE chapters.id = chapter_counts.chapter_id;

-- 3. Create function to increment chapter views
CREATE OR REPLACE FUNCTION increment_chapter_views(_chapter_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE chapters
  SET views = views + 1
  WHERE id = _chapter_id;
END;
$$;
