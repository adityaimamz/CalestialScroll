-- Change admin_logs FK from auth.users to public.profiles to allow Postgrest joins
-- We need to drop the existing constraint. Since we don't know the exact auto-generated name reliably,
-- we'll try the standard naming convention. If it fails, we might need to inspect.
-- However, creating it with REFERENCES auth.users typically creates 'admin_logs_admin_id_fkey'.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'admin_logs_admin_id_fkey'
        AND table_name = 'admin_logs'
    ) THEN
        ALTER TABLE public.admin_logs DROP CONSTRAINT admin_logs_admin_id_fkey;
    END IF;
END $$;

-- Now add the new constraint referencing profiles
ALTER TABLE public.admin_logs
ADD CONSTRAINT admin_logs_admin_id_fkey
FOREIGN KEY (admin_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;
