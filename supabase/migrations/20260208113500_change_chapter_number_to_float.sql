-- Change chapter_number from INTEGER to DOUBLE PRECISION (Float) to support decimal chapters (e.g. 158.5)
ALTER TABLE public.chapters ALTER COLUMN chapter_number TYPE DOUBLE PRECISION;
