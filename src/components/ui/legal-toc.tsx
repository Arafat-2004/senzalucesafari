"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ArrowUp } from "lucide-react";

interface Section {
    id: string;
    title: string;
}

interface LegalTableOfContentsProps {
    sections: Section[];
    title: string;
}

export default function LegalTableOfContents({ sections, title }: LegalTableOfContentsProps) {
    const [activeSection, setActiveSection] = useState("");
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            setShowBackToTop(window.scrollY > 400);

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
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth"
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <>
            {/* Table of Contents */}
            <nav className="bg-card border border-border/50 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-foreground mb-4 text-lg">{title}</h3>
                <ul className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
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
                                <span className="line-clamp-2">{section.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-primary text-white p-4 md:p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 z-50 min-h-[56px] min-w-[56px] md:min-h-[44px] md:min-w-[44px] flex items-center justify-center"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-6 h-6 md:w-5 md:h-5" />
                </button>
            )}
        </>
    );
}
