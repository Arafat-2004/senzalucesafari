"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Section {
    id: string;
    title: string;
}

interface MobileTableOfContentsProps {
    sections: Section[];
    title?: string;
}

export default function MobileTableOfContents({ sections, title = "Contents" }: MobileTableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth"
            });
            setIsOpen(false);
        }
    };

    return (
        <div className="lg:hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls="mobile-toc-list"
            >
                <span className="font-semibold text-foreground">{title}</span>
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-primary" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-primary" />
                )}
            </button>

            {isOpen && (
                <div
                    id="mobile-toc-list"
                    className="mt-2 bg-card border border-border/50 rounded-xl p-4 max-h-[60vh] overflow-y-auto"
                >
                    <ul className="space-y-2">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    onClick={() => scrollToSection(section.id)}
                                    className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
