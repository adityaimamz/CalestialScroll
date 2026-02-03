import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import heroBanner from "@/assets/hero-banner.jpg";

type Novel = Tables<"novels"> & {
  chapters_count?: number;
};

const HeroSection = () => {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNovel();
  }, []);

  const fetchFeaturedNovel = async () => {
    try {
      // Fetch the highest rated novel
      const { data, error } = await supabase
        .from("novels")
        .select("*, chapters(count)")
        .order("rating", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setNovel({
          ...data,
          chapters_count: data.chapters?.[0]?.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching hero novel:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-muted/20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </section>
    );
  }

  if (!novel) return null;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={novel.cover_url || heroBanner}
          alt={novel.title}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = heroBanner;
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative section-container h-full flex items-center py-16 md:py-24">
        <div className="max-w-xl animate-fade-in">
          <span className="status-badge status-badge-ongoing mb-4 inline-block capitalize">
            {novel.status}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            {novel.title}
          </h1>
          
          <p className="text-muted-foreground text-base md:text-lg mb-6 line-clamp-3">
            {novel.description}
          </p>

          <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-accent font-semibold">{novel.rating || "N/A"}</span>
              ★ Rating
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{novel.chapters_count || 0} Chapters</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/series/${novel.slug}`}>Start Reading</Link>
            </Button>
            <Button variant="surface" size="lg">
              Add to Library
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
