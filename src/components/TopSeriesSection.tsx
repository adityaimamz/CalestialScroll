import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import SectionHeader from "@/components/SectionHeader";

type Novel = Tables<"novels">;

const GRADIENTS = [
  "from-violet-900/80 to-purple-900/80",
  "from-blue-900/80 to-cyan-900/80",
  "from-amber-900/80 to-orange-900/80",
  "from-emerald-900/80 to-teal-900/80",
];

const TopSeriesSection = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSeries();
  }, []);

  const fetchTopSeries = async () => {
    try {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .order("rating", { ascending: false })
        .limit(4);

      if (error) throw error;
      setNovels(data || []);
    } catch (error) {
      console.error("Error fetching top series:", error);
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
        title="Top Series" 
        subtitle="Most beloved stories by our readers"
        viewAllLink="/series"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {novels.map((novel, index) => (
          <div
            key={novel.id}
            className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} border border-border/50 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-card`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10">
              <span className="genre-pill mb-3 inline-block capitalize">
                {novel.genres?.[0] || "Fantasy"}
              </span>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {novel.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {novel.description}
              </p>
              <Button variant="surface" size="sm" asChild>
                <Link to={`/series/${novel.slug}`}>Learn More</Link>
              </Button>
            </div>
            
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSeriesSection;
