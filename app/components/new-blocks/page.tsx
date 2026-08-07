import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { ExpandableTabsPreview } from "@/components/previews/blocks/expandable-tabs.preview";
import { OverflowActionsPreview } from "@/components/previews/blocks/overflow-actions.preview";
import { PredictionMarketPreview } from "@/components/previews/blocks/prediction-market.preview";
import { SwipeableListPreview } from "@/components/previews/blocks/swipeable-list.preview";

export const metadata: Metadata = {
  title: "New Product Blocks — Oxygen UI",
  description:
    "Interactive, spring-animated product components added to Oxygen UI — Prediction Market, Overflow Actions, Expandable Tabs, and Swipeable List.",
};

const BLOCKS = [
  {
    slug: "prediction-market",
    name: "Prediction Market",
    badge: "Interactive Block",
    tagline: "Order ticket with rolling currency entry & spring status feedback",
    description:
      "A complete prediction market trade ticket supporting Buy/Sell order modes, outcome selection, rolling numeric input with layout animations, quick amount chips, max balance calculation, and stateful trade execution buttons.",
    preview: <PredictionMarketPreview />,
    installCmd: "npx shadcn@latest add https://beui.dev/r/prediction-market.json",
    docUrl: "/components/blocks/prediction-market",
    features: [
      "Buy / Sell order modes with controllable state",
      "Outcome selection with price indicators in cents",
      "Animated character-by-character currency input",
      "Rolling number ticker for win/receive payouts",
      "Stateful trade button (idle, placing, filled)",
    ],
  },
  {
    slug: "overflow-actions",
    name: "Overflow Actions",
    badge: "Navigation Block",
    tagline: "Connected action rail with spring layout expansion",
    description:
      "A compact pill rail for primary actions that smoothly springs open to reveal additional contextual items, keeping your interface clean while offering quick access to secondary tools.",
    preview: <OverflowActionsPreview />,
    installCmd: "npx shadcn@latest add https://beui.dev/r/overflow-actions.json",
    docUrl: "/components/blocks/overflow-actions",
    features: [
      "Smooth layout springs for expanding/collapsing",
      "Touch & keyboard accessible action buttons",
      "Blur and scale transitions on extra items",
      "Hover-capable detection for touch devices",
      "Reduced motion safe animations",
    ],
  },
  {
    slug: "expandable-tabs",
    name: "Expandable Tabs",
    badge: "Navigation Dock",
    tagline: "Expanding icon tab bar with morphing view panel",
    description:
      "An iOS Dynamic Island-inspired tab dock where the active tab expands into a labeled pill. The top panel smoothly morphs height and cross-fades content on tab changes.",
    preview: <ExpandableTabsPreview />,
    installCmd: "npx shadcn@latest add https://beui.dev/r/expandable-tabs.json",
    docUrl: "/components/blocks/expandable-tabs",
    features: [
      "Dynamic shell spring following active panel dimensions",
      "Label width auto-measuring with ResizeObserver",
      "Blur cross-fade content transitions between views",
      "Keyboard Escape and outside click dismiss",
      "Accessible WAI-ARIA tablist structure",
    ],
  },
  {
    slug: "swipeable-list",
    name: "Swipeable List",
    badge: "Mobile UI Block",
    tagline: "Touch & mouse list rows with spring action reveals",
    description:
      "Native-feeling list rows that swipe left or right to reveal contextual action buttons with distance-based spring physics, velocity drag momentum, and action confirmation.",
    preview: <SwipeableListPreview />,
    installCmd: "npx shadcn@latest add https://beui.dev/r/swipeable-list.json",
    docUrl: "/components/blocks/swipeable-list",
    features: [
      "Distance & velocity-based drag release spring",
      "Left and right action rails with customizable tones",
      "Controlled and uncontrolled swipe states",
      "Intert/aria-hidden management for offscreen actions",
      "Item removal & queue restore functionality",
    ],
  },
];

export default function NewBlocksPage() {
  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card via-card/80 to-background p-8 md:p-10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Newly Added UI Blocks
            </span>
            <span className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-xs text-muted-foreground">
              4 Composed Widgets
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Product UI Blocks & Motion Components
          </h1>

          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore newly added product UI blocks designed for high-conversion web applications, trading tickets, compact action bars, tab docks, and mobile list interactions. Copy the source code directly into your project.
          </p>

          {/* Quick jump pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {BLOCKS.map((block) => (
              <a
                key={block.slug}
                href={`#${block.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{block.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Blocks Showcase Grid */}
      <div className="space-y-16">
        {BLOCKS.map((block, idx) => (
          <section
            key={block.slug}
            id={block.slug}
            className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
              {/* Info Column */}
              <div className="space-y-5 lg:col-span-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    0{idx + 1}
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
                    {block.badge}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {block.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-emerald-500 dark:text-emerald-400">
                    {block.tagline}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {block.description}
                </p>

                {/* Features */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Features
                  </p>
                  <ul className="space-y-1.5">
                    {block.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions & Links */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href={block.docUrl}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View Documentation
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <div className="rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-[11px] font-mono text-muted-foreground">
                    {block.installCmd.replace("npx shadcn@latest add ", "")}
                  </div>
                </div>
              </div>

              {/* Live Interactive Preview Box */}
              <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-background/50 p-6 backdrop-blur-sm lg:col-span-7">
                <div className="w-full">{block.preview}</div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom Switcher Banner */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Looking for Solana primitives or motion components?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse newly created Solana React primitives, Web3 motion tools, and the full Oxygen UI catalog.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/components/created"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Created Components →
            </Link>
            <Link
              href="/components/existing"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Original Catalog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
