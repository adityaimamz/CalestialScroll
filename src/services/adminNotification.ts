import { supabase } from "@/integrations/supabase/client";

export const notifyAdmins = async (
    type: 'admin_report',
    entityId: string,
    message: string // Generic message or report text
) => {
    try {
        // 1. Fetch all admins (users with role 'admin')
        const { data: admins, error: adminError } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin');

        if (adminError || !admins || admins.length === 0) {
            console.error("Error fetching admins or no admins found:", adminError);
            return;
        }

        // 2. Create notifications for each admin
        const notifications = admins.map(admin => ({
            user_id: admin.user_id,
            actor_id: null,
            type: type,
            entity_id: entityId,
            is_read: false,
        }));

        const { error: insertError } = await supabase
            .from('notifications')
            .insert(notifications);

        if (insertError) {
            console.error("Error creating admin notifications:", insertError);
        }
    } catch (error) {
        console.error("Exception in notifyAdmins:", error);
    }
};

export const notifyUser = async (
    userId: string,
    type: 'report_reply',
    entityId: string, // The Report ID
    actorId: string // The Admin ID
) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                actor_id: actorId,
                type: type,
                entity_id: entityId,
                is_read: false,
            });

        if (error) {
            console.error("Error notifying user:", error);
        }
    } catch (error) {
        console.error("Exception in notifyUser:", error);
    }
};
