"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

// Country data with dial codes and flags
export const countries = [
    { code: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿" },
    { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
    { code: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬" },
    { code: "RW", name: "Rwanda", dial: "+250", flag: "🇷🇼" },
    { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
    { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
    { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
    { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
    { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
    { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
    { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
    { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
    { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
    { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
    { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
    { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
    { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
    { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
    { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
    { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
    { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
    { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
    { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
    { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
    { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
    { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
    { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
    { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
    { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
    { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
    { code: "ET", name: "Ethiopia", dial: "+251", flag: "🇪🇹" },
    { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
    { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦" },
    { code: "Other", name: "Other", dial: "+", flag: "GL" }
];

export interface Country {
    code: string;
    name: string;
    dial: string;
    flag: string;
}

interface CountrySelectorProps {
    selectedCountry: Country;
    onCountryChange: (country: Country) => void;
    phoneValue: string;
    onPhoneChange: (phone: string) => void;
    className?: string;
    error?: string;
}

export function CountrySelector({
    selectedCountry,
    onCountryChange,
    phoneValue,
    onPhoneChange,
    className = "",
    error
}: CountrySelectorProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.dial.includes(search) ||
        country.code.toLowerCase().includes(search.toLowerCase())
    );

    const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d\s-()]/g, '');
        onPhoneChange(value);
    };

    return (
        <div className={className}>
            <div className="flex gap-2">
                {/* Country Selector Dropdown */}
                <div className="relative w-36 sm:w-40 flex-shrink-0" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`w-full h-10 px-2 flex items-center gap-2 rounded-md border bg-background hover:bg-accent transition-colors ${error ? 'border-destructive' : 'border-input'
                            }`}
                    >
                        <span className="text-xl flex-shrink-0">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium text-foreground flex-shrink-0">{selectedCountry.dial}</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto flex-shrink-0" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                            {/* Search Input */}
                            <div className="p-2 border-b border-border">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search country..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full h-9 pl-8 pr-3 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Country List */}
                            <div className="max-h-64 overflow-y-auto">
                                {filteredCountries.length === 0 ? (
                                    <div className="p-3 text-sm text-muted-foreground text-center">
                                        No countries found
                                    </div>
                                ) : (
                                    filteredCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => {
                                                onCountryChange(country);
                                                setShowDropdown(false);
                                                setSearch("");
                                            }}
                                            className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-accent transition-colors ${selectedCountry.code === country.code
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-foreground'
                                                }`}
                                        >
                                            <span className="text-xl flex-shrink-0">{country.flag}</span>
                                            <span className="text-sm font-medium flex-1 text-left truncate">{country.name}</span>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">{country.dial}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone Input */}
                <div className="relative flex-1">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="tel"
                        placeholder="234 567 8900"
                        value={phoneValue}
                        onChange={handlePhoneInputChange}
                        className={`w-full h-10 pl-10 pr-3 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground ${error ? 'border-destructive' : 'border-input'
                            }`}
                    />
                </div>
            </div>

            {error && (
                <p className="text-danger mt-1 text-xs">{error}</p>
            )}
        </div>
    );
}

// Phone icon component (inline to avoid import issues)
function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}
