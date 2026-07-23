"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Prevent hydration mismatch
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration mount pattern
        setMounted(true);

    }, []);

    const toggleTheme = () => {
        // Cycle through: light -> dark -> system -> light
        setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return <></>;
    }

    const currentTheme = theme;
    const getIconAndLabel = () => {
        if (currentTheme === "light") {
            return {
                icon: <Moon className="h-5 w-5" />,
                label: "Switch to dark mode (currently light)"
            };
        } else if (currentTheme === "dark") {
            return {
                icon: <Monitor className="h-5 w-5" />,
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
            className="h-10 w-10 min-h-10 min-w-10 rounded-lg"
        >
            {icon}
        </Button>
    );
}
