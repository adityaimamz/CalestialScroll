import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getBadgeInfo } from "@/lib/badgeSystem";
import BadgeListModal from "./BadgeListModal";

interface UserBadgeProps {
    chapterCount: number;
    size?: "sm" | "md";
    className?: string;
}

const UserBadge = ({ chapterCount, size = "sm", className = "" }: UserBadgeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const tier = getBadgeInfo(chapterCount);

    // Dynamic Custom Style for coloring and glow
    const style: React.CSSProperties = {
        backgroundColor: `${tier.color}20`, // 20% opacity
        color: tier.color,
        border: `1px solid ${tier.color}20`,
        boxShadow: tier.glow ? `0 0 8px ${tier.color}60` : "none",
        textShadow: tier.glow ? `0 0 4px ${tier.color}40` : "none",
        cursor: "pointer",
    };

    return (
        <>
            <Badge
                variant="secondary" // Changed from outline to secondary for filled look base
                className={`hover:brightness-110 transition-all active:scale-95 select-none ${className} ${size === "sm" ? "text-[10px] px-2 h-5 rounded-md" : "text-xs px-2.5 py-0.5 rounded-md"
                    }`}
                style={style}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
            >
                {tier.name}
            </Badge>

            <BadgeListModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                currentCount={chapterCount}
            />
        </>
    );
};

export default UserBadge;
