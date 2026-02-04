import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import TopSeriesSection from "@/components/TopSeriesSection";
import PopularSection from "@/components/PopularSection";
import NewReleasesSection from "@/components/NewReleasesSection";
import GenresSection from "@/components/GenresSection";
import SneakPeeksSection from "@/components/SneakPeeksSection";
import RecentUpdatesSection from "@/components/RecentUpdatesSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (!scrollToElement()) {
        // Retry for async content
        const intervalId = setInterval(() => {
          if (scrollToElement()) {
            clearInterval(intervalId);
          }
        }, 100);

        // Stop retrying after 2 seconds
        setTimeout(() => clearInterval(intervalId), 2000);
      }
    }
  }, [location]);

  return (
    <main>
      <HeroSection />
      <AnnouncementsSection />
      <TopSeriesSection />
      {/* <PopularSection /> */}
      <NewReleasesSection />
      <GenresSection />
      {/* <SneakPeeksSection /> */}
      <RecentUpdatesSection />
    </main>
  );
};

export default Index;
