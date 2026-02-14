import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { BADGE_TIERS, getBadgeStageInfo, BadgeTier, GOD_STAGES } from "@/lib/badgeSystem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Check, Crown, Zap, Circle, Star, Layers, Diamond, Sparkles } from "lucide-react";

interface BadgeListModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentCount: number;
}

// Component untuk visual stage indicator
const StageIndicator = ({
    maxStages,
    currentStage,
    stageLabel,
    tierStyle,
    isUnlocked
}: {
    maxStages: number;
    currentStage: number;
    stageLabel: string;
    tierStyle: BadgeTier['style'];
    isUnlocked: boolean;
}) => {
    const getStageIcon = (filled: boolean) => {
        const iconProps = { className: "w-2.5 h-2.5", ...(filled ? { fill: "currentColor" } : {}) };
        switch (stageLabel) {
            case 'Chakra': return <Circle {...iconProps} />;
            case 'Star': return <Star {...iconProps} />;
            case 'Realm': return <Sparkles {...iconProps} />;
            default: return <Circle {...iconProps} />;
        }
    };

    return (
        <div className="flex items-center gap-0.5 flex-wrap">
            {Array.from({ length: maxStages }).map((_, i) => {
                const isStageUnlocked = i < currentStage;
                return (
                    <span
                        key={i}
                        className="transition-all duration-300"
                        style={{
                            color: isUnlocked && isStageUnlocked ? (tierStyle.border === 'transparent' ? '#FFD700' : tierStyle.border) : '#71717a',
                            opacity: isUnlocked && isStageUnlocked ? 1 : 0.3,
                            filter: isUnlocked && isStageUnlocked ? `drop-shadow(0 0 2px ${tierStyle.border === 'transparent' ? '#FFD700' : tierStyle.border}50)` : 'none'
                        }}
                    >
                        {getStageIcon(isUnlocked && isStageUnlocked)}
                    </span>
                );
            })}
        </div>
    );
};

const BadgeListModal = ({ isOpen, onOpenChange, currentCount }: BadgeListModalProps) => {
    const currentTierIndex = BADGE_TIERS.filter(tier => currentCount >= tier.minChapters).length - 1;

    // Dapatkan info stage detail untuk user saat ini
    const userBadgeInfo = getBadgeStageInfo(currentCount);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader className="mb-2 shrink-0">
                    <DialogTitle className="flex items-center justify-center sm:justify-start gap-2 text-xl">
                        <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        Cultivation Realm
                    </DialogTitle>
                    <DialogDescription>
                        Ascend through the realms by reading more chapters!
                    </DialogDescription>
                </DialogHeader>

                {/* User Stats Summary */}
                <div className="py-2 shrink-0">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Current Cultivation</span>
                            <span className="font-bold text-lg text-primary flex items-center gap-2 mt-1">
                                {userBadgeInfo.name}
                                <span className="text-sm font-normal text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border">
                                    {userBadgeInfo.isGodTier && userBadgeInfo.godStageName
                                        ? userBadgeInfo.godStageName
                                        : `${userBadgeInfo.currentStage} ${userBadgeInfo.stageLabel}`
                                    }
                                </span>
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Total Read</span>
                            <div className="font-mono font-bold text-lg">{currentCount} Ch</div>
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[60vh] pr-4 -mr-4">
                    <div className="space-y-3 pb-4 px-1">
                        {BADGE_TIERS.map((tier, index) => {
                            const isUnlocked = index <= currentTierIndex;
                            const isCurrent = index === currentTierIndex;
                            const isGod = tier.style.glow === "rainbow";

                            // Base styles logic
                            let containerClass = "relative p-3 rounded-lg border flex items-center gap-4 transition-all duration-300 ";
                            let containerStyle: React.CSSProperties = {};

                            if (isUnlocked) {
                                containerClass += "opacity-100 ";
                                if (isCurrent) {
                                    containerClass += "bg-accent/10 ";
                                    if (isGod) {
                                        containerStyle.boxShadow = "inset 0 0 20px rgba(255, 215, 0, 0.15)";
                                        containerStyle.border = "1px solid rgba(255, 215, 0, 0.5)";
                                    } else {
                                        containerStyle.borderColor = tier.style.border;
                                        containerStyle.borderLeftWidth = "4px";
                                    }
                                } else {
                                    containerStyle.borderColor = "transparent";
                                    containerStyle.background = "transparent";
                                }
                            } else {
                                containerClass += "opacity-40 grayscale bg-muted/20 border-transparent";
                            }

                            return (
                                <div
                                    key={tier.name}
                                    className={containerClass}
                                    style={containerStyle}
                                >
                                    {/* Icon Status */}
                                    <div className="shrink-0 flex flex-col items-center gap-1">
                                        {isUnlocked ? (
                                            <div className={`rounded-full p-1 shadow-sm ${isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <Lock className="w-4 h-4 text-muted-foreground/50" />
                                        )}
                                    </div>

                                    {/* Badge Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex flex-col gap-1">
                                                {/* BADGE VISUAL */}
                                                <div
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border select-none w-fit"
                                                    style={{
                                                        background: tier.style.background,
                                                        color: tier.style.color,
                                                        borderColor: isGod ? '#FFFFFF' : tier.style.border,
                                                        boxShadow: isGod
                                                            ? "0 0 10px rgba(255,255,255,0.5), 0 0 5px rgba(255,0,255,0.3)"
                                                            : (tier.style.glow ? `0 0 5px ${tier.style.glow}60` : 'none'),
                                                        textShadow: tier.style.textShadow || 'none',
                                                        backgroundClip: isGod ? "padding-box" : "border-box"
                                                    }}
                                                >
                                                    {tier.name}
                                                </div>

                                                {/* Visual Stage Indicator */}
                                                <StageIndicator
                                                    maxStages={tier.maxStages}
                                                    currentStage={isCurrent ? userBadgeInfo.currentStage : isUnlocked ? tier.maxStages : 0}
                                                    stageLabel={tier.stageLabel}
                                                    tierStyle={tier.style}
                                                    isUnlocked={isUnlocked}
                                                />
                                            </div>

                                            {/* Requirement Text */}
                                            <span className="text-xs font-mono font-medium text-muted-foreground">
                                                {tier.minChapters}+ Ch
                                            </span>
                                        </div>

                                        {/* Current Progress Indicator */}
                                        {isCurrent && (
                                            <div className="mt-2">
                                                <div className="flex justify-between text-[10px] mb-1 text-primary/80">
                                                    <span className="flex items-center gap-1">
                                                        <Zap className="w-3 h-3" />
                                                        {isGod && userBadgeInfo.godStageName
                                                            ? userBadgeInfo.godStageName
                                                            : 'Current Progress'}
                                                    </span>
                                                    <span>
                                                        {isGod && userBadgeInfo.godStageName
                                                            ? `${userBadgeInfo.currentStage} / ${tier.maxStages}`
                                                            : `${userBadgeInfo.currentStage} / ${tier.maxStages} ${tier.stageLabel}`
                                                        }
                                                    </span>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{
                                                            width: `${(userBadgeInfo.currentStage / tier.maxStages) * 100}%`,
                                                            backgroundColor: isGod ? '#FFD700' : tier.style.border
                                                        }}
                                                    />
                                                </div>
                                                {/* God Sub-Realm List */}
                                                {isGod && (
                                                    <div className="mt-2 space-y-1">
                                                        {GOD_STAGES.map((gs) => {
                                                            const isReached = currentCount >= gs.minChapters;
                                                            return (
                                                                <div key={gs.stage} className={`flex items-center justify-between text-[10px] px-2 py-1 rounded ${isReached ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground/50'}`}>
                                                                    <span className="flex items-center gap-1.5">
                                                                        {isReached ? <Sparkles className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                                        <span className="font-medium">{gs.name}</span>
                                                                        <span className="opacity-60">{gs.chineseName}</span>
                                                                    </span>
                                                                    <span className="font-mono text-[9px]">{gs.minChapters}+ Ch</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default BadgeListModal;