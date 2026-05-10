"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor, ArrowRight, Star, Mail } from "lucide-react";
import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">{title}</h3>
      {children}
    </div>
  );
}

function ColorSwatch({ name, value, className }: { name: string; value: string; className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg border border-border/50 shadow-sm ${className}`} />
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Design System</h1>
          <p className="text-muted-foreground">Living style guide for Senza Luce Safaris</p>
        </div>

        <Separator />

        {/* Colors */}
        <Section title="Brand Colors">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ColorSwatch name="Gold (Primary)" value="#D4A017" className="bg-[#D4A017]" />
            <ColorSwatch name="Gold Light" value="#FFD700" className="bg-[#FFD700]" />
            <ColorSwatch name="Gold Dark" value="#B8860B" className="bg-[#B8860B]" />
            <ColorSwatch name="Brown (Text)" value="#2B1D13" className="bg-[#2B1D13]" />
            <ColorSwatch name="Brown Darker" value="#1A1410" className="bg-[#1A1410]" />
            <ColorSwatch name="Green (Secondary)" value="#2D9B5E" className="bg-[#2D9B5E]" />
            <ColorSwatch name="Green Light" value="#4DB86F" className="bg-[#4DB86F]" />
            <ColorSwatch name="Cream (Accent)" value="#EEDFC4" className="bg-[#EEDFC4]" />
            <ColorSwatch name="Sage" value="#5E6B3A" className="bg-[#5E6B3A]" />
            <ColorSwatch name="Tan (Border)" value="#B9B680" className="bg-[#B9B680]" />
            <ColorSwatch name="Orange (Destructive)" value="#E67E22" className="bg-[#E67E22]" />
            <ColorSwatch name="White" value="#FFFFFF" className="bg-white border" />
          </div>
        </Section>

        <Separator />

        {/* Buttons */}
        <Section title="Buttons">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium">Variants</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="default">Default</Button>
                <Button variant="safari">Safari (Gold)</Button>
                <Button variant="adventure">Adventure (Green)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium">Sizes</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="xs">XS</Button>
                <Button size="sm">SM</Button>
                <Button size="default">Default</Button>
                <Button size="lg">LG</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium">With Icons</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="safari">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium">States</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button disabled>Disabled</Button>
                <Button variant="safari" disabled>Safari Disabled</Button>
                <Button variant="outline" disabled>Outline Disabled</Button>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Cards */}
        <Section title="Cards">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Standard card variant</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Content goes here with proper padding and typography.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="safari">
              <CardHeader>
                <CardTitle>Safari Card</CardTitle>
                <CardDescription>Hover to see lift effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Gold-tinted hover border with shadow lift.</p>
              </CardContent>
              <CardFooter>
                <Button variant="safari" size="sm">Book Now</Button>
              </CardFooter>
            </Card>

            <Card variant="destination">
              <CardHeader>
                <CardTitle>Destination Card</CardTitle>
                <CardDescription>Extra lift on hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">More pronounced hover elevation.</p>
              </CardContent>
              <CardFooter>
                <Button variant="adventure" size="sm">Explore</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Separator />

        {/* Form Elements */}
        <Section title="Form Elements">
          <div className="space-y-6 max-w-md">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Input</label>
              <Input placeholder="Enter text..." />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="checkbox-demo" />
                <label htmlFor="checkbox-demo" className="text-sm text-foreground">Checkbox</label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="switch-demo" />
                <label htmlFor="switch-demo" className="text-sm text-foreground">Switch</label>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Badges */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30">
              Safari Badge
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
              Premium Badge
            </span>
          </div>
        </Section>

        <Separator />

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Heading 1</h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Heading 2</h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl">Heading 3</h3>
            <p className="text-base sm:text-lg">Body text with default line-height and responsive sizing. The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-muted-foreground">Small / muted text style for descriptions and meta information.</p>
          </div>
        </Section>

        <Separator />

        {/* Loading States */}
        <Section title="Loading States">
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            </div>
          </div>
        </Section>

        <Separator />

        {/* Theme Toggle */}
        <Section title="Theme">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Dark</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">System</span>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Usage Guidelines */}
        <Section title="Guidelines">
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <div>
              <h4 className="text-foreground font-medium">Button Usage</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>variant="safari"</strong> — Primary CTA (gold, pill shape). Use for main actions.</li>
                <li><strong>variant="adventure"</strong> — Secondary CTA (green, pill shape). Use for alt actions.</li>
                <li><strong>variant="outline"</strong> — Outlined gold button. Use for tertiary actions.</li>
                <li><strong>variant="default"</strong> — Standard primary (rounded). Use in admin/forms.</li>
                <li>Always use <code>variant</code> prop. Do not use CSS button classes.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-medium">Card Usage</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>variant="safari"</strong> — Gold-tinted hover with lift. Use for tour cards.</li>
                <li><strong>variant="destination"</strong> — Extra lift on hover. Use for destination cards.</li>
                <li><strong>variant="default"</strong> — Standard card. Use for all other cases.</li>
                <li>Use <code>CardHeader / CardTitle / CardDescription / CardContent / CardFooter</code> sub-components.</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
