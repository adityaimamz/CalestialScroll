import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import NovelCard from "@/components/NovelCard";
import SectionHeader from "@/components/SectionHeader";

type Novel = Tables<"novels"> & {
  chapters_count?: number;
};

const NewReleasesSection = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewReleases();
  }, []);

  const fetchNewReleases = async () => {
    try {
      const { data, error } = await supabase
        .from("novels")
        .select("*, chapters(count)")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      if (data) {
        const novelsWithChapterCount = data.map(novel => ({
          ...novel,
          chapters_count: novel.chapters?.[0]?.count || 0,
        }));
        setNovels(novelsWithChapterCount);
      }
    } catch (error) {
      console.error("Error fetching new releases:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-spacing section-container flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  if (novels.length === 0) return null;

  return (
    <section className="section-spacing section-container">
      <SectionHeader 
        title="New Releases" 
        subtitle="Fresh stories just started"
        viewAllLink="/new"
      />
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {novels.map((novel) => (
          <NovelCard
            key={novel.id}
            id={novel.id}
            slug={novel.slug}
            title={novel.title}
            cover={novel.cover_url || ""}
            rating={novel.rating || 0}
            status={novel.status as any}
            chapters={novel.chapters_count || 0}
            genre={novel.genres?.[0] || "Unknown"}
            size="medium"
          />
        ))}
      </div>
    </section>
  );
};

export default NewReleasesSection;
