import { useState, useEffect } from "react";
import { Send, User as UserIcon, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentsSectionProps {
  novelId: string;
  chapterId?: string; // Optional: If present, fetch chapter comments. If null, fetch novel comments.
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

const CommentsSection = ({ novelId, chapterId }: CommentsSectionProps) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [novelId, chapterId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("comments" as any)
        .select("*")
        .eq("novel_id", novelId)
        .order("created_at", { ascending: false });

      if (chapterId) {
        query = query.eq("chapter_id", chapterId);
      } else {
        // Fetch comments where chapter_id is null (Novel level comments)
        query = query.is("chapter_id", null);
      }

      const { data: commentsData, error } = await query;

      if (error) throw error;

      // Fetch profiles for the comments
      const userIds = [...new Set((commentsData as any[]).map((c) => c.user_id))];
      let profilesMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles" as any)
          .select("id, username, avatar_url")
          .in("id", userIds);

        profilesData?.forEach((p: any) => {
          profilesMap[p.id] = p;
        });
      }

      const commentsWithProfiles = (commentsData as any[]).map((c) => ({
        ...c,
        profile: profilesMap[c.user_id],
      }));

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "Please login to post a comment." });
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments" as any).insert({
        user_id: user.id,
        novel_id: novelId,
        chapter_id: chapterId || null,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      toast({ title: "Success", description: "Comment posted!" });
      fetchComments(); // Refresh list
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {

      const { error } = await supabase.from("comments" as any).delete().eq("id", commentId);
      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== commentId));
      toast({ title: "Deleted", description: "Comment deleted." });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      {/* Input Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] bg-card border-border placeholder:text-muted-foreground"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-muted/30 p-4 rounded-lg text-center text-muted-foreground">
          Please <a href="/auth" className="text-primary hover:underline">login</a> to leave a comment.
        </div>
      )}

      {/* List Section */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card p-4 rounded-lg border border-border flex gap-4 animate-fade-in">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={comment.profile?.avatar_url || ""} />
                <AvatarFallback>
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">
                    {comment.profile?.username || "Anonymous User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">
                  {comment.content}
                </p>

                {user && (user.id === comment.user_id || isAdmin) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 -ml-2 mt-2"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
