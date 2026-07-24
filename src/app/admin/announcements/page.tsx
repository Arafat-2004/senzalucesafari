"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/lib/ui/toast';
import { AdminPageHeader } from '../components';
import { HolidayBanner } from '@/components/layout/holiday-banner';
import {
    Megaphone,
    Save,
    Loader2,
    CheckCircle2,
    Eye,
    Zap,
    Sparkles,
    Gift,
    AlertTriangle,
    Globe,
    Compass,
    Crown,
    Clock,
    RotateCcw
} from 'lucide-react';

interface AppSettings {
    bannerEnabled?: boolean;
    bannerText?: string | null;
    bannerLink?: string | null;
    bannerType?: string | null;
}

const BANNER_PLACEHOLDERS: Record<string, string> = {
    signature: "Discover untamed wilderness with Senza Luce Safari — bespoke expeditions crafted just for you. 🌿",
    savanna_sunrise: "Wake to golden horizons — sunrise game drives across the Serengeti are now available. Book yours today. 🌅",
    savanna_night: "Experience the magic of the African night sky on our exclusive stargazing safari. Limited dates. 🌙⭐",
    wildlife: "Track the Big Five with expert guides through Tanzania's most iconic wildlife corridors. 🐘🦁",
    migration: "The Great Wildebeest Migration is underway — witness one of nature's greatest spectacles now. 🦬",
    conservation: "Safari with purpose. A portion of every booking supports our wildlife conservation partners. 🌱",
    luxury: "Indulge in our ultra-luxury lodge collection — private butlers, fine dining, and boundless wilderness. 👑",
    adventure: "Push your limits with our adventure safari — hiking, cycling, and night drives across the savanna. 🏕️",
    special_offer: "Limited-time offer: Save 15% on select safari packages booked this month. Use code SAFARI15. 🎉",
    early_bird: "Book your 2026 safari before 31 March and save 20% — our best early bird rates ever. 🐦",
    last_minute: "Last-minute deal — 3-day Serengeti escape from $890pp. Only 4 spots remaining! ⚡",
    new_destination: "New! Explore the remote shores of Lake Tanganyika — now available for exclusive bookings. 🌍",
    group_travel: "Planning a group safari? Groups of 8+ receive complimentary airport transfers and a private guide. 👥",
    honeymoon: "Begin your forever story in Africa — romantic honeymoon safaris with private tent camps. 💍",
    anniversary: "Celebrate your milestone anniversary with a once-in-a-lifetime safari experience. 🥂🎊",
    christmas: "Wishing you a Merry Christmas! Save 10% on festive-season safaris booked before Jan 5th. 🎄✨",
    newyear: "Ring in the New Year under Africa's stars — book your New Year's Eve safari now. 🥂🌟",
    eid: "Eid Mubarak from Senza Luce Safari! Special rates for Eid holiday travel. 🌙✨",
    easter: "Happy Easter! Spring safari specials — family-friendly tours from $650pp for Easter week. 🌸",
    blackfriday: "BLACK FRIDAY: Up to 30% off selected safari packages. 48-hour sale — don't miss it! 🏷️",
    travel_advisory: "Important: Entry requirements for Tanzania have changed. Please review before travelling. ⚠️",
    weather_notice: "Weather update: Short rains expected this week across the Serengeti. Safari drives continue as normal. 🌦️",
    maintenance: "Our booking system will be offline 02:00–04:00 EAT on Sunday for scheduled maintenance. 🔧",
    critical_update: "URGENT: Please check your booking confirmation — payment details need to be re-verified immediately. 🚨",
};

const QUICK_PRESETS = [
    { label: "Christmas", type: "christmas", link: "/safaris-tours", icon: Gift },
    { label: "New Year", type: "newyear", link: "/safaris-tours", icon: Sparkles },
    { label: "Great Migration", type: "migration", link: "/safaris-tours", icon: Compass },
    { label: "Early Bird", type: "early_bird", link: "/enquiry", icon: Clock },
    { label: "Luxury Elite", type: "luxury", link: "/accommodations", icon: Crown },
    { label: "Special Offer", type: "special_offer", link: "/safaris-tours", icon: Zap },
    { label: "Travel Advisory", type: "travel_advisory", link: "/contact", icon: AlertTriangle },
];

export default function AdminAnnouncementsPage() {
    const [settings, setSettings] = useState<AppSettings>({
        bannerEnabled: false,
        bannerText: '',
        bannerLink: '/safaris-tours',
        bannerType: 'signature',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.ok ? res.json() : {})
            .then((data: AppSettings) => {
                setSettings({
                    bannerEnabled: Boolean(data.bannerEnabled),
                    bannerText: data.bannerText ?? '',
                    bannerLink: data.bannerLink ?? '/safaris-tours',
                    bannerType: data.bannerType ?? 'signature',
                });
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bannerEnabled: settings.bannerEnabled,
                    bannerText: settings.bannerText,
                    bannerLink: settings.bannerLink,
                    bannerType: settings.bannerType,
                }),
            });

            if (res.ok) {
                showToast('Announcement banner configuration updated successfully', { type: 'success' });
            } else {
                showToast('Failed to update announcement banner', { type: 'error' });
            }
        } catch {
            showToast('An error occurred while saving settings', { type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = (type: string, link: string) => {
        const text = BANNER_PLACEHOLDERS[type] ?? '';
        setSettings(s => ({
            ...s,
            bannerEnabled: true,
            bannerType: type,
            bannerLink: link,
            bannerText: text,
        }));
        showToast(`Loaded ${type.replace('_', ' ')} preset into editor`, { type: 'info' });
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const currentTheme = settings.bannerType ?? 'signature';
    const textLength = (settings.bannerText ?? '').length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Announcement Banners"
                description="Manage global promotional banners, festive greetings, and operational notices displayed across the public site."
            >
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Announcement
                </Button>
            </AdminPageHeader>

            {/* Quick Presets Bar */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Quick Campaign Launchers
                    </CardTitle>
                    <CardDescription className="text-xs">
                        One-click load high-performing presets with pre-configured color schemes, links, and messages.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 pt-0">
                    {QUICK_PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        const isSelected = settings.bannerType === preset.type;
                        return (
                            <Button
                                key={preset.type}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => applyPreset(preset.type, preset.link)}
                                className="gap-1.5 text-xs rounded-full"
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {preset.label}
                            </Button>
                        );
                    })}
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Main Controls Panel */}
                <div className="lg:col-span-7 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Megaphone className="h-5 w-5 text-primary" />
                                    Banner Controls
                                </span>
                                <Badge variant={settings.bannerEnabled ? "default" : "secondary"}>
                                    {settings.bannerEnabled ? "ACTIVE ON PUBLIC SITE" : "HIDDEN"}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Configure the visibility, visual style, call-to-action link, and wording.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Enable Switch */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="bannerEnabled" className="font-semibold text-base">Enable Announcement Banner</Label>
                                    <p className="text-xs text-muted-foreground">Publish or hide the top banner across all public pages.</p>
                                </div>
                                <Switch
                                    id="bannerEnabled"
                                    checked={!!settings.bannerEnabled}
                                    onCheckedChange={v => setSettings({ ...settings, bannerEnabled: v })}
                                />
                            </div>

                            {/* Theme Select */}
                            <div className="space-y-2">
                                <Label htmlFor="bannerType">Banner Theme Style</Label>
                                <Select
                                    value={currentTheme}
                                    onValueChange={v => {
                                        const prevRec = BANNER_PLACEHOLDERS[currentTheme ?? 'signature'] ?? '';
                                        const currentText = settings.bannerText ?? '';
                                        const shouldAutoFill = currentText === '' || currentText === prevRec;
                                        setSettings({
                                            ...settings,
                                            bannerType: v,
                                            bannerText: shouldAutoFill ? (BANNER_PLACEHOLDERS[v ?? 'signature'] ?? '') : currentText,
                                        });
                                    }}
                                >
                                    <SelectTrigger id="bannerType" className="w-full">
                                        <SelectValue placeholder="Select theme style" />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-[min(440px,90vw)] max-h-72">
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">🌿 Senza Luce Core</SelectLabel>
                                            <SelectItem value="signature">Signature — Safari Green &amp; Gold</SelectItem>
                                            <SelectItem value="savanna_sunrise">Savanna Sunrise — Burnt Orange &amp; Amber</SelectItem>
                                            <SelectItem value="savanna_night">Savanna Night — Midnight &amp; Gold</SelectItem>
                                            <SelectItem value="wildlife">Wildlife Safari — Earth, Amber &amp; Clay</SelectItem>
                                            <SelectItem value="migration">Great Migration — Umber &amp; Dusty Gold</SelectItem>
                                            <SelectItem value="conservation">Conservation — Teal, Forest &amp; Cream</SelectItem>
                                            <SelectItem value="luxury">Luxury Elite — Obsidian &amp; Gold</SelectItem>
                                            <SelectItem value="adventure">Adventure — Cobalt Blue &amp; Orange</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">🏷️ Campaigns &amp; Offers</SelectLabel>
                                            <SelectItem value="special_offer">Special Offer — Green &amp; Gold</SelectItem>
                                            <SelectItem value="early_bird">Early Bird — Dawn Yellow &amp; Green</SelectItem>
                                            <SelectItem value="last_minute">Last Minute — Red &amp; White</SelectItem>
                                            <SelectItem value="new_destination">New Destination — Teal &amp; Gold</SelectItem>
                                            <SelectItem value="group_travel">Group Travel — Indigo &amp; Amber</SelectItem>
                                            <SelectItem value="honeymoon">Honeymoon — Rose Wine &amp; Ivory</SelectItem>
                                            <SelectItem value="anniversary">Anniversary — Forest &amp; Champagne</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">🎉 Seasonal &amp; Celebrations</SelectLabel>
                                            <SelectItem value="christmas">Christmas — Crimson &amp; Festive Gold</SelectItem>
                                            <SelectItem value="newyear">New Year — Midnight &amp; Starlight</SelectItem>
                                            <SelectItem value="eid">Eid Mubarak — Emerald &amp; Gold</SelectItem>
                                            <SelectItem value="easter">Easter Spring — Lilac &amp; Purple</SelectItem>
                                            <SelectItem value="blackfriday">Black Friday — Obsidian &amp; Neon Pink</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">⚙️ Operations &amp; Notices</SelectLabel>
                                            <SelectItem value="travel_advisory">Travel Advisory — Charcoal &amp; Amber</SelectItem>
                                            <SelectItem value="weather_notice">Weather Notice — Slate &amp; Sky Blue</SelectItem>
                                            <SelectItem value="maintenance">Maintenance — Alert Amber</SelectItem>
                                            <SelectItem value="critical_update">Critical Update — Emergency Red</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Action Link Select */}
                            <div className="space-y-2">
                                <Label htmlFor="bannerLink">Action Link (CTA Destination)</Label>
                                <Select
                                    value={settings.bannerLink ?? '_none'}
                                    onValueChange={v => setSettings({ ...settings, bannerLink: v === '_none' ? null : v })}
                                >
                                    <SelectTrigger id="bannerLink" className="w-full">
                                        <SelectValue placeholder="No link — banner-only" />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-[min(360px,90vw)] max-h-72">
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">No Action</SelectLabel>
                                            <SelectItem value="_none">No link (banner only)</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">🗺️ Safari &amp; Tours</SelectLabel>
                                            <SelectItem value="/safaris-tours">/safaris-tours — All Tours</SelectItem>
                                            <SelectItem value="/destinations">/destinations — All Destinations</SelectItem>
                                            <SelectItem value="/accommodations">/accommodations — Lodges &amp; Camps</SelectItem>
                                            <SelectItem value="/vehicles">/vehicles — Vehicle Fleet</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">📋 Booking &amp; Enquiries</SelectLabel>
                                            <SelectItem value="/enquiry">/enquiry — Send an Enquiry</SelectItem>
                                            <SelectItem value="/contact">/contact — Contact Us</SelectItem>
                                            <SelectItem value="/favourites">/favourites — Saved Tours</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel className="font-bold text-primary px-2 py-1.5 text-xs tracking-wider">📚 Content Pages</SelectLabel>
                                            <SelectItem value="/blog">/blog — Latest Articles</SelectItem>
                                            <SelectItem value="/about">/about — About Senza Luce</SelectItem>
                                            <SelectItem value="/faq">/faq — FAQs</SelectItem>
                                            <SelectItem value="/support">/support — Help &amp; Support</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="bannerText">Announcement Message (Editable)</Label>
                                    <span className={`text-xs ${textLength > 120 ? 'text-amber-500 font-semibold' : 'text-muted-foreground'}`}>
                                        {textLength} chars
                                    </span>
                                </div>
                                <textarea
                                    id="bannerText"
                                    rows={3}
                                    value={settings.bannerText ?? ''}
                                    onChange={e => setSettings({ ...settings, bannerText: e.target.value })}
                                    className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Type your announcement message here..."
                                />
                                <div className="flex items-center justify-between pt-1">
                                    <p className="text-xs text-muted-foreground">
                                        Selecting a theme auto-fills a recommended message. Edit as needed.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const rec = BANNER_PLACEHOLDERS[currentTheme ?? 'signature'] ?? '';
                                            setSettings(s => ({ ...s, bannerText: rec }));
                                            showToast('Reset message to theme suggestion', { type: 'info' });
                                        }}
                                        className="h-7 text-xs gap-1"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        Reset to Default
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Real-time Simulator & Preview */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                Live Public Site Preview
                            </CardTitle>
                            <CardDescription>
                                Exact rendering of how the banner appears to visitors on desktop &amp; mobile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
                                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-b pb-2">
                                    <span className="flex items-center gap-1.5">
                                        <Globe className="h-3.5 w-3.5" />
                                        senzalucesafari.com
                                    </span>
                                    <span>{settings.bannerEnabled ? "🟢 Live Rendering" : "⚪ Disabled (Preview Only)"}</span>
                                </div>

                                {/* Banner Component Container */}
                                <div className="rounded-lg overflow-hidden border shadow-sm">
                                    <HolidayBanner
                                        text={settings.bannerText || 'Sample announcement message preview text goes here.'}
                                        link={settings.bannerLink}
                                        type={currentTheme}
                                    />
                                </div>

                                <p className="text-[11px] text-muted-foreground text-center">
                                    {settings.bannerEnabled 
                                        ? "This banner is active and visible on the website."
                                        : "Toggle 'Enable Announcement Banner' and Save to make this live."}
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    {saving ? "Saving Changes..." : "Publish Announcement Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
