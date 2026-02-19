-- Update notification types to include specific report types
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('reply', 'like', 'system', 'admin_report', 'admin_chapter_report', 'admin_comment_report', 'report_reply'));
-- Kept 'admin_report' just in case of any lingering data/code, but will move to specific ones.

-- Allow Admins to insert notifications (for replies)
CREATE POLICY "Admins can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  public.is_admin_or_moderator(auth.uid())
);

-- Function to notify admins on new report
CREATE OR REPLACE FUNCTION public.handle_new_report_notification()
RETURNS TRIGGER AS $$
DECLARE
    admin_record RECORD;
    notif_type TEXT;
BEGIN
    IF TG_TABLE_NAME = 'chapter_reports' THEN
        notif_type := 'admin_chapter_report';
    ELSIF TG_TABLE_NAME = 'comment_reports' THEN
        notif_type := 'admin_comment_report';
    ELSE
        RETURN NEW;
    END IF;

    -- Iterate over all admins
    FOR admin_record IN SELECT user_id FROM public.user_roles WHERE role = 'admin'
    LOOP
        INSERT INTO public.notifications (user_id, actor_id, type, entity_id, is_read)
        VALUES (admin_record.user_id, NEW.user_id, notif_type, NEW.id, FALSE);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic notification
DROP TRIGGER IF EXISTS on_chapter_report_created ON public.chapter_reports;
CREATE TRIGGER on_chapter_report_created
AFTER INSERT ON public.chapter_reports
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_report_notification();

DROP TRIGGER IF EXISTS on_comment_report_created ON public.comment_reports;
CREATE TRIGGER on_comment_report_created
AFTER INSERT ON public.comment_reports
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_report_notification();
