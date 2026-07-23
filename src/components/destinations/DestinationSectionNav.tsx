"use client";

import { useEffect, useState, type ElementType } from "react";
import { CalendarDays, Camera, Compass, Info, Map, PawPrint, Route, Sparkles, TentTree } from "lucide-react";

interface Section {
    id: string;
    title: string;
}

const icons: Record<string, ElementType> = {
    overview: Info,
    wildlife: PawPrint,
    activities: Sparkles,
    "best-time": CalendarDays,
    accommodations: TentTree,
    itineraries: Route,
    tours: Compass,
    gallery: Camera,
    "travel-tips": Map,
};

export default function DestinationSectionNav({ sections }: { sections: Section[] }) {
    const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "overview");

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveSection(visible.target.id);
            },
            { rootMargin: "-22% 0px -68% 0px", threshold: [0.05, 0.2, 0.5] },
        );

        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sections]);

    const goToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <nav className="sticky top-20 z-40 border-y border-border/70 bg-background/95 shadow-sm backdrop-blur-xl" aria-label="Destination guide sections">
            <div className="container px-4">
                <div className="scrollbar-hide flex min-h-14 items-stretch gap-1 overflow-x-auto py-1">
                    {sections.map(section => {
                        const Icon = icons[section.id] ?? Info;
                        const active = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => goToSection(section.id)}
                                aria-current={active ? "location" : undefined}
                                className={`relative flex min-w-max items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                            >
                                <Icon className="h-4 w-4" />
                                {section.title}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
