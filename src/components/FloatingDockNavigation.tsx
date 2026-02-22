import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconBooks, IconBookmark, IconTags } from "@tabler/icons-react";

export function FloatingDockNavigation() {
    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-muted-foreground" />
            ),
            href: "/",
        },
        {
            title: "Series",
            icon: (
                <IconBooks className="h-full w-full text-muted-foreground" />
            ),
            href: "/series",
        },
        {
            title: "Bookmarks",
            icon: (
                <IconBookmark className="h-full w-full text-muted-foreground" />
            ),
            href: "/bookmarks",
        },
        {
            title: "Genres",
            icon: (
                <IconTags className="h-full w-full text-muted-foreground" />
            ),
            href: "/genres",
        },
    ];

    return (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 md:hidden">
            <FloatingDock
                mobileClassName="translate-y-0"
                items={links}
            />
        </div>
    );
}
