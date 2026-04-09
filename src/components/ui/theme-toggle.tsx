"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);

        // Function to apply theme
        const applyTheme = (dark: boolean) => {
            setIsDark(dark);
            if (dark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            applyTheme(true);
        } else if (savedTheme === "light") {
            applyTheme(false);
        } else {
            // No saved preference - use system preference
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            applyTheme(systemPrefersDark);
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            // Only auto-switch if user hasn't manually set a preference
            const userPreference = localStorage.getItem("theme");
            if (!userPreference || userPreference === "system") {
                applyTheme(e.matches);
            }
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => {
        // Cycle through: light -> dark -> system -> light
        const currentTheme = localStorage.getItem("theme");
        let newTheme: string;

        if (currentTheme === "light") {
            newTheme = "dark";
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else if (currentTheme === "dark") {
            newTheme = "system";
            // Apply current system preference
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(systemPrefersDark);
            if (systemPrefersDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else {
            // system or null -> light
            newTheme = "light";
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", newTheme);
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    const currentTheme = localStorage.getItem("theme");
    const getIconAndLabel = () => {
        if (currentTheme === "light") {
            return {
                icon: <Moon className="h-5 w-5" />,
                label: "Switch to dark mode (currently light)"
            };
        } else if (currentTheme === "dark") {
            return {
                icon: <span className="text-sm font-semibold">A</span>,
                label: "Switch to system preference (currently dark)"
            };
        } else {
            return {
                icon: <Sun className="h-5 w-5" />,
                label: "Switch to light mode (currently following system)"
            };
        }
    };

    const { icon, label } = getIconAndLabel();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            className="min-h-[44px] min-w-[44px]"
        >
            {icon}
        </Button>
    );
}
