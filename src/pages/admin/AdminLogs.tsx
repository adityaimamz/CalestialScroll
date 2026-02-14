import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldAlert, BookOpen, FileText, User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface AdminLog {
    id: string;
    action_type: string;
    entity_type: string;
    entity_id: string | null;
    details: any;
    created_at: string;
    admin_id: string;
    admin?: {
        username: string | null;
        avatar_url: string | null;
    };
}

export default function AdminLogs() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            // Fetch logs without joins
            const { data: logsData, error } = await supabase
                .from("admin_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;

            // Get unique admin IDs
            const adminIds = [...new Set(logsData.map(log => log.admin_id))];

            // Fetch profiles separately
            const { data: profilesData } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", adminIds);

            // Create lookup map
            const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

            // Combine data
            const formattedLogs = logsData.map((log: any) => ({
                ...log,
                admin: profilesMap.get(log.admin_id)
            }));

            setLogs(formattedLogs);
        } catch (error) {
            console.error("Error fetching logs:", error);
            toast({
                title: "Error",
                description: "Failed to load admin logs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case "CREATE":
                return "default";
            case "UPDATE":
                return "secondary";
            case "DELETE":
                return "destructive";
            case "BAN":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getEntityIcon = (entity: string) => {
        switch (entity) {
            case "NOVEL":
                return <BookOpen className="h-4 w-4" />;
            case "CHAPTER":
                return <FileText className="h-4 w-4" />;
            case "USER":
                return <User className="h-4 w-4" />;
            case "COMMENT":
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <ShieldAlert className="h-4 w-4" />;
        }
    };

    const formatDetails = (details: any) => {
        if (!details) return "-";
        try {
            if (typeof details === 'object') {
                return Object.entries(details)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
            }
            return String(details);
        } catch (e) {
            return "-";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Admin Logs</h2>
                <p className="text-muted-foreground">Audit trail of admin and moderator actions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Admin/Mod</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No activity logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={log.admin?.avatar_url || ""} />
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-sm">{log.admin?.username || "Unknown"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getActionColor(log.action_type) as any}>
                                                    {log.action_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getEntityIcon(log.entity_type)}
                                                    <span>{log.entity_type}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px] truncate" title={formatDetails(log.details)}>
                                                {formatDetails(log.details)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground text-sm">
                                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
