"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { useHotkey } from "@/hooks/use-hotkey";

interface CommandPaletteProps {
    navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

export function AdminCommandPalette({ navItems }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useHotkey([
        {
            key: "k",
            meta: true,
            handler: () => setOpen((p) => !p),
        },
    ]);

    const handleSelect = useCallback(
        (href: string) => {
            setOpen(false);
            router.push(href);
        },
        [router]
    );

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <CommandItem
                                key={item.href}
                                value={item.label}
                                onSelect={() => handleSelect(item.href)}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                <span>{item.label}</span>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
