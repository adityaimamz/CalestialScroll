import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface RecentComment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    novel_id: string;
    chapter_id: string | null;
    chapter_number?: number | null;
    novel_title?: string;
    novel_slug?: string;
    user_profile?: {
        username: string | null;
        avatar_url: string | null;
    };
}

interface RecentUser {
    id: string;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
}

export default function Activity() {
    const [comments, setComments] = useState<RecentComment[]>([]);
    const [users, setUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        setLoading(true);
        try {
            // Fetch recent comments without joins
            const { data: commentsData, error: commentsError } = await supabase
                .from("comments")
                .select("id, content, created_at, user_id, novel_id, chapter_id")
                .order("created_at", { ascending: false })
                .limit(20);

            if (commentsError) throw commentsError;

            // Get unique user IDs and novel IDs
            const userIds = [...new Set(commentsData.map(c => c.user_id))];
            const novelIds = [...new Set(commentsData.map(c => c.novel_id))];

            // Fetch profiles separately
            const { data: profilesData } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", userIds);

            // Fetch novels separately
            const { data: novelsData } = await supabase
                .from("novels")
                .select("id, title, slug")
                .in("id", novelIds);

            // Create lookup maps
            const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
            const novelsMap = new Map(novelsData?.map(n => [n.id, n]) || []);

            // Get unique chapter IDs (filter out nulls)
            const chapterIds = [...new Set(commentsData.filter(c => c.chapter_id).map(c => c.chapter_id))];

            // Fetch chapters separately to get chapter_number
            let chaptersMap = new Map();
            if (chapterIds.length > 0) {
                const { data: chaptersData } = await supabase
                    .from("chapters")
                    .select("id, chapter_number")
                    .in("id", chapterIds);
                chaptersMap = new Map(chaptersData?.map(ch => [ch.id, ch]) || []);
            }

            // Combine data
            const formattedComments = commentsData.map((c: any) => ({
                id: c.id,
                content: c.content,
                created_at: c.created_at,
                user_id: c.user_id,
                novel_id: c.novel_id,
                chapter_id: c.chapter_id,
                chapter_number: c.chapter_id ? chaptersMap.get(c.chapter_id)?.chapter_number : null,
                novel_title: novelsMap.get(c.novel_id)?.title,
                novel_slug: novelsMap.get(c.novel_id)?.slug,
                user_profile: profilesMap.get(c.user_id),
            }));

            // Fetch recent joined users
            const { data: usersData, error: usersError } = await supabase
                .from("profiles")
                .select("id, username, avatar_url, created_at")
                .order("created_at", { ascending: false })
                .limit(10);

            if (usersError) throw usersError;

            setComments(formattedComments);
            setUsers(usersData || []);
        } catch (error) {
            console.error("Error fetching activity:", error);
            toast({
                title: "Error",
                description: "Gagal memuat aktivitas",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">User Activity</h2>
                <p className="text-muted-foreground">Pantau aktivitas terbaru pengguna</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Comments */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Komentar Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-6">
                                {comments.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">Belum ada komentar</p>
                                ) : (
                                    comments.map((comment) => {
                                        // Use slug instead of novel_id for URL
                                        const novelSlug = comment.novel_slug || comment.novel_id;
                                        const commentUrl = comment.chapter_number
                                            ? `/series/${novelSlug}/chapter/${comment.chapter_number}`
                                            : `/series/${novelSlug}`;

                                        return (
                                            <Link
                                                key={comment.id}
                                                to={commentUrl}
                                                className="flex gap-4 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={comment.user_profile?.avatar_url || ""} />
                                                    <AvatarFallback>
                                                        <User className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium leading-none">
                                                            {comment.user_profile?.username || "Anonymous"}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">
                                                            • {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground/90 line-clamp-2">
                                                        {comment.content}
                                                    </p>
                                                    {comment.novel_title && (
                                                        <p className="text-xs text-muted-foreground">
                                                            di <span className="font-medium text-primary">{comment.novel_title}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Pengguna Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-4">
                                {users.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">Belum ada pengguna</p>
                                ) : (
                                    users.map((user) => (
                                        <div key={user.id} className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar_url || ""} />
                                                <AvatarFallback>
                                                    <User className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user.username || "Anonymous"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Bergabung {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
