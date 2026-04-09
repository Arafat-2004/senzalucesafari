"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface Section {
    id: string;
    title: string;
}

interface TableOfContentsProps {
    sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
    const [activeSection, setActiveSection] = useState("");
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;

            // Check if TOC should be sticky
            setIsSticky(window.scrollY > 600);

            // Find active section
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Account for sticky header
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth"
            });
        }
    };

    if (!sections || sections.length === 0) return null;

    return (
        <nav
            className={`bg-card border border-border/50 rounded-xl p-4 transition-all duration-300 ${isSticky ? 'fixed top-20 right-4 w-64 shadow-lg z-40 max-h-[calc(100vh-6rem)] overflow-y-auto' : ''
                }`}
        >
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">On This Page</h3>
            <ul className="space-y-2">
                {sections.map((section) => (
                    <li key={section.id}>
                        <button
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left flex items-center gap-2 text-sm transition-colors hover:text-primary ${activeSection === section.id
                                ? 'text-primary font-semibold'
                                : 'text-muted-foreground'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{section.title}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
