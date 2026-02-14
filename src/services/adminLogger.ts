import { supabase } from "@/integrations/supabase/client";

export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'BAN' | 'APPROVE' | 'REJECT';
export type EntityType = 'NOVEL' | 'CHAPTER' | 'USER' | 'COMMENT' | 'REVIEW';

export const logAdminAction = async (
    action_type: ActionType,
    entity_type: EntityType,
    entity_id: string | null,
    details: any = {}
) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('admin_logs')
            .insert({
                admin_id: user.id,
                action_type,
                entity_type,
                entity_id,
                details
            });

        if (error) {
            console.error('Failed to log admin action:', error);
        }
    } catch (error) {
        console.error('Error in logAdminAction:', error);
    }
};
