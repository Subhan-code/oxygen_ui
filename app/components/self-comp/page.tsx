"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/app/copy-button";
import { getPreview } from "@/components/previews";
import { cn } from "@/lib/utils";

export type SelfCompItem = {
  slug: string;
  categorySlug: string;
  name: string;
  description: string;
  badge?: "new" | "updated";
  launchedAt?: string;
  tags: string[];
};

const SELF_COMPONENTS: SelfCompItem[] = [
  // Product Blocks & Interactive Interfaces
  {
    slug: "minimal-card-expand",
    categorySlug: "motion",
    name: "Minimal Card Expand (Skiper23)",
    description: "Interactive Family wallet interface with expandable cards, 2x2 to top-banner layout morphing, copy address feedback, and outside click collapse.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Wallet", "Family App", "Morphing", "Cards"],
  },
  {
    slug: "family-wallet-auth",
    categorySlug: "motion",
    name: "Family Wallet Auth (Skiper21)",
    description: "Authentication interface with social sign-ins, email/phone/passkey tab bar, 6-digit OTP verification, and wallet connection drawer.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Auth", "Family App", "OTP", "Wallets"],
  },
  {
    slug: "prediction-market",
    categorySlug: "motion",
    name: "Prediction Market",
    description: "Trade ticket with Buy/Sell order modes, outcome selection, rolling numeric input, quick add chips, and stateful trade execution.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["DeFi", "Trade", "Ticket"],
  },
  {
    slug: "overflow-actions",
    categorySlug: "motion",
    name: "Overflow Actions",
    description: "Connected action pill rail that springs open to reveal additional contextual controls.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Rail", "Actions", "Pill"],
  },
  {
    slug: "expandable-tabs",
    categorySlug: "motion",
    name: "Expandable Tabs",
    description: "Dynamic Island-inspired tab dock where active tabs expand into labeled pills with morphing height view panels.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Tabs", "Dynamic Island", "Dock"],
  },
  {
    slug: "swipeable-list",
    categorySlug: "motion",
    name: "Swipeable List",
    description: "Mobile-style touch & mouse list rows that swipe left/right to reveal action rails with drag physics.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Swipe", "Gestures", "List"],
  },
  {
    slug: "pipeline-board",
    categorySlug: "motion",
    name: "Pipeline Board",
    description: "Kanban and stacked list drag & drop board with pickup snapshot hit-testing, velocity tilt spring, and land tween easing.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Kanban", "Drag & Drop", "Board"],
  },
  {
    slug: "add-member-dialog",
    categorySlug: "motion",
    name: "Add Member Dialog",
    description: "Concentric corner dialog (inner = outer - padding), zero-shift SwapWord text morphing, formatUS phone input, and 3-beat LoaderCheck animation.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Modal", "Concentric", "Loader"],
  },
  {
    slug: "gooey-droplet-sheet",
    categorySlug: "motion",
    name: "Gooey Droplet Sheet",
    description: "Liquid panel transform supporting Full Width (spread='never') and The Bead (spread='always') modes with surface tension physics.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Gooey", "Liquid", "Sheet"],
  },

  // Data Visualization & Canvas Charts
  {
    slug: "members-plan-donut-chart",
    categorySlug: "motion",
    name: "Members by Plan Donut Chart",
    description: "Canvas donut chart with 5 plans, drifting square dither tile fill, 500ms angle morphing, exploded wedge hover, and period switcher.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Canvas", "Dither", "Donut Chart"],
  },
  {
    slug: "payments-bar-chart",
    categorySlug: "motion",
    name: "Payments Stacked Bar Chart",
    description: "Canvas stacked bar chart card with 3-band stacked bars, 4 columns, legend chips, continuous wave drift, and staggered height morphing.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Canvas", "Dither", "Bar Chart"],
  },
  {
    slug: "members-line-chart",
    categorySlug: "motion",
    name: "Members Growth Line Chart",
    description: "Canvas area line chart with crisp dither tiles fill, 7D/14D/30D/90D range selector, lerped cursor glow, and single-spring X & Y scrubber.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Canvas", "Dither", "Line Chart", "Scrubber"],
  },
  {
    slug: "dither-donut-chart",
    categorySlug: "motion",
    name: "Dither Donut Chart",
    description: "Procedural drifting square-tile dither donut chart with exploding wedge hover interaction and center readout.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Canvas", "Dither"],
  },
  {
    slug: "dither-bar-chart",
    categorySlug: "motion",
    name: "Dither Bar Chart",
    description: "Canvas bar chart rendering drifting square dither tiles per segment with staggered height morphing.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Canvas", "Dither", "Bars"],
  },
  {
    slug: "direct-scrubber-chart",
    categorySlug: "motion",
    name: "Direct Scrubber Chart",
    description: "Direct manipulation curve scrubber tracking target X & Y on a single spring configuration with day snapping.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Scrubber", "Spring"],
  },
  {
    slug: "hand-gestures",
    categorySlug: "motion",
    name: "Hand Gestures Glyphs",
    description: "Vector path-morphing hand gesture glyphs (Minimize, Palm/Clench, OK Sign) using pure 1-path bezier morphs.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Bezier", "SVG Morph", "Icons"],
  },

  // Navigation & Minimap Layouts
  {
    slug: "scroll-progress-sections",
    categorySlug: "motion",
    name: "Scroll Progress Sections",
    description: "Floating squircle scroll progress pill with SVG progress ring indicator that morphs into a section selection menu.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Scroll", "Progress", "Squircle"],
  },
  {
    slug: "github-activity",
    categorySlug: "motion",
    name: "GitHub Activity Grid",
    description: "Interactive contribution grid with live API fetching, custom color scales, portal tooltips, and expandable repository drawer.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["GitHub", "Grid", "Drawer"],
  },
  {
    slug: "proximity-sidebar",
    categorySlug: "motion",
    name: "Proximity Sidebar",
    description: "Proximity-aware minimap navigation sidebar with magnetic dash scaling based on cursor position.",
    badge: "new",
    launchedAt: "2026-08-07",
    tags: ["Minimap", "Proximity", "Sidebar"],
  },
];

export default function SelfCompPage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [search, setSearch] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    SELF_COMPONENTS.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredComponents = useMemo(() => {
    return SELF_COMPONENTS.filter((comp) => {
      const matchesTag =
        selectedTag === "All" || comp.tags.includes(selectedTag);
      const matchesSearch =
        comp.name.toLowerCase().includes(search.toLowerCase()) ||
        comp.description.toLowerCase().includes(search.toLowerCase()) ||
        comp.slug.toLowerCase().includes(search.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [search, selectedTag]);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-500 dark:bg-blue-500/20 mb-3">
            ✨ Showcase Gallery ({SELF_COMPONENTS.length} Components)
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Self Components
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
            All self-created UI blocks, interactive wallet interfaces, canvas dither charts, vector morph glyphs, and layout primitives in one dedicated showcase.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
          {/* Tag Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  selectedTag === tag
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Component Showcase Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredComponents.map((comp) => {
            const PreviewComp = getPreview(comp.categorySlug, comp.slug);
            const installCmd = `npx shadcn add @beui/${comp.slug}`;

            return (
              <div
                key={comp.slug}
                className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-xl transition-all hover:border-foreground/30 overflow-hidden"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {comp.name}
                      </h3>
                      {comp.badge && (
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-500 dark:bg-blue-500/20">
                          {comp.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {comp.description}
                    </p>
                  </div>
                </div>

                {/* Live Preview Container */}
                <div className="relative mb-4 flex min-h-[340px] w-full items-center justify-center rounded-2xl border border-border/60 bg-muted/20 p-4 overflow-hidden">
                  {PreviewComp ? (
                    <PreviewComp />
                  ) : (
                    <div className="text-sm font-semibold text-muted-foreground">
                      Preview Loading...
                    </div>
                  )}
                </div>

                {/* Footer Controls & Tags */}
                <div className="mt-auto flex flex-col gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {comp.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background p-2">
                    <code className="truncate text-xs font-mono text-muted-foreground">
                      {installCmd}
                    </code>
                    <CopyButton value={installCmd} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
