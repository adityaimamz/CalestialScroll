
-- 1. Create daily_site_views table
CREATE TABLE IF NOT EXISTS "public"."daily_site_views" (
    "date" date NOT NULL,
    "views" bigint DEFAULT 0 NOT NULL,
    CONSTRAINT "daily_site_views_pkey" PRIMARY KEY ("date")
);

-- 2. Enable RLS and add policy (read-only for everyone or admins, let's say public read for simplicity of dashboard fetching)
ALTER TABLE "public"."daily_site_views" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."daily_site_views"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- 3. Backfill from reading_history (Logins only - partial data)
INSERT INTO "public"."daily_site_views" ("date", "views")
SELECT date_trunc('day', read_at)::date, count(*)
FROM "public"."reading_history"
GROUP BY 1
ON CONFLICT ("date") DO UPDATE
SET "views" = "public"."daily_site_views"."views" + EXCLUDED."views";

-- 4. Update increment function to also log to daily_site_views
CREATE OR REPLACE FUNCTION increment_chapter_views(_chapter_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Increment total chapter views
  UPDATE chapters
  SET views = views + 1
  WHERE id = _chapter_id;

  -- Increment daily site views
  INSERT INTO daily_site_views (date, views)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (date)
  DO UPDATE SET views = daily_site_views.views + 1;
END;
$$;
