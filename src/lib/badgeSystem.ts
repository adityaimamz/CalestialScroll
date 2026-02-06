
export interface BadgeTier {
  name: string;
  color: string; // Hex code for custom styling
  minChapters: number;
  glow?: boolean;
}

export const BADGE_TIERS: BadgeTier[] = [
  { name: "Martial Apprentice", color: "#BFC5CC", minChapters: 0 },
  { name: "Martial Warrior", color: "#4DA6FF", minChapters: 10 }, //10
  { name: "Martial Master", color: "#22C55E", minChapters: 20 }, //50
  { name: "Great Martial Master", color: "#4338CA", minChapters: 30 }, //100
  { name: "Martial Lord", color: "#FBBF24", minChapters: 40 }, //200
  { name: "Martial King", color: "#7C3AED", minChapters: 50 }, //500
  { name: "Martial Grandmaster", color: "#DC2626", minChapters: 60 }, //1000
  { name: "Martial Emperor", color: "#F97316", minChapters: 70 }, //2000
  { name: "Martial Supreme", color: "#F3F4F6", minChapters: 80, glow: true }, //5000
  { name: "Martial Sovereign", color: "#6D28D9", minChapters: 90, glow: true }, //10000
  { name: "Martial God", color: "#FFF4B0", minChapters: 100, glow: true }, //20000
];

export const getBadgeInfo = (chapterCount: number): BadgeTier => {
  // Find the highest tier that meets the requirement
  let currentTier = BADGE_TIERS[0];
  for (const tier of BADGE_TIERS) {
    if (chapterCount >= tier.minChapters) {
      currentTier = tier;
    } else {
      break;
    }
  }
  return currentTier;
};

export const getNextBadge = (chapterCount: number): BadgeTier | null => {
  for (const tier of BADGE_TIERS) {
    if (chapterCount < tier.minChapters) {
      return tier;
    }
  }
  return null; // Max rank reached
};
