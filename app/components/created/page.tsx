import type { Metadata } from "next";
import Link from "next/link";
import { ComponentCard } from "@/components/app/docs/component-card";

export const metadata: Metadata = {
  title: "Created & Custom Components — Oxygen UI",
  description:
    "Explore newly created Solana primitives, Web3 React motion components, and custom UI components added to Oxygen UI.",
};

const CREATED_SOLANA = [
  {
    slug: "identity",
    categorySlug: "solana",
    name: "Identity & Accounts",
    description: "Address displays, verified .sol badges, real-time Base58 validators, and public key inputs.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "network",
    categorySlug: "solana",
    name: "Network & RPC",
    description: "Cluster switchers (Mainnet, Devnet, Testnet, Localnet), RPC latency gauges, connection status banners, and live slot counters.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "assets",
    categorySlug: "solana",
    name: "Assets & Portfolio",
    description: "SOL & USD balance tickers, SPL token rows, compressed NFT cards, and portfolio allocation bars.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "transactions",
    categorySlug: "solana",
    name: "Transactions & Execution",
    description: "Transaction cards, 4-step execution state machines (Build -> Sign -> Send -> Finalize), signature displays, and CU fee gauges.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "application",
    categorySlug: "solana",
    name: "Application UI & Metrics",
    description: "dApp metric tiles, live activity streams, virtualized Solana tables, TPS gauges, and priority fee selectors.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
];

const CREATED_CRYPTO_MOTION = [
  {
    slug: "nft-tilt-card",
    categorySlug: "motion",
    name: "NFT Tilt Card",
    description: "3D perspective tilt on hover for Solana NFT cards with cursor-tracked glare.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "solana-wallet-button",
    categorySlug: "motion",
    name: "Solana Wallet Button",
    description: "Spring-pressed Wallet Connect button plus Stateful Swap and Magnetic action buttons.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "crypto-ticker-marquee",
    categorySlug: "motion",
    name: "Crypto Ticker Marquee",
    description: "Live streaming token ticker marquee with price changes, SOL/USDC volume badges, and hover pause.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "defi-dex-tabs",
    categorySlug: "motion",
    name: "DeFi DEX Navigation Tabs",
    description: "Segmented swap/pools/farm/stake tab bar with spring gliding background indicator.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "solana-address-input",
    categorySlug: "motion",
    name: "Solana Address Input",
    description: "Base58 address validator input with instant feedback, copy action, and error states.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "token-select",
    categorySlug: "motion",
    name: "Token Select Dropdown",
    description: "Web3 token dropdown selector (SOL, USDC, BONK, JUP) with liquid unfold animation.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "protocol-switch",
    categorySlug: "motion",
    name: "Protocol Fee Switch",
    description: "Priority fee switch toggle (Normal, Fast, Turbo) with spring thumb animation.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
  {
    slug: "expanding-arrow-button",
    categorySlug: "motion",
    name: "Animated CTA Buttons",
    description: "Expressive call-to-action buttons with expanding, hold, and slide interactions.",
    badge: "new" as const,
    launchedAt: "2026-07-16",
  },
  {
    slug: "add-member-dialog",
    categorySlug: "motion",
    name: "Add Member Dialog",
    description: "Morphing modal dialog with concentric corner system, smooth role text swap, US phone formatting, loader-to-check state machine, and glow/glossy CTA buttons.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "dither-donut-chart",
    categorySlug: "motion",
    name: "Dither Donut Chart",
    description: "Canvas donut chart with drifting square-tile dither fill, smooth angle morphing between period changes, hover wedge explosion with glow, and center period total.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "gooey-droplet-sheet",
    categorySlug: "motion",
    name: "Gooey Droplet Sheet",
    description: "Velocity-driven liquid droplet panel transform supporting full-width sheet and bead modes with liquid pinch and surface tension radius.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "dither-bar-chart",
    categorySlug: "motion",
    name: "Dither Bar Chart",
    description: "Canvas bar chart with a field of drifting square tiles, staggered morphing per column from current height, hover recolor/glow, and alpha dimming.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "direct-scrubber-chart",
    categorySlug: "motion",
    name: "Direct Scrubber Chart",
    description: "Direct manipulation curve scrubber with dual-axis x & y spring tracking, day snapping, and smooth KPI/range morphing without remounting.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "hand-gestures",
    categorySlug: "motion",
    name: "Hand Gestures",
    description: "Vector morphing hand gesture glyphs (Minimize, Palm/Clench, OK Sign) using pure bezier path morphs and self-contained CSS keyframes.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "pipeline-board",
    categorySlug: "motion",
    name: "Pipeline Board",
    description: "Kanban and stacked list drag & drop board with pickup snapshot hit-testing, velocity tilt spring, and land tween easing.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "members-plan-donut-chart",
    categorySlug: "motion",
    name: "Members by Plan Donut Chart",
    description: "Canvas donut chart with 5 plans, drifting square dither tile fill, 500ms angle morphing, exploded wedge hover, and period switcher.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "payments-bar-chart",
    categorySlug: "motion",
    name: "Payments Stacked Bar Chart",
    description: "Canvas stacked bar chart card with 3-band stacked bars, 4 columns, legend chips, continuous wave drift, and staggered height morphing.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "members-line-chart",
    categorySlug: "motion",
    name: "Members Line Chart",
    description: "Canvas area line chart with crisp dither tiles fill, 7D/14D/30D/90D range selector, lerped cursor glow, and single-spring X & Y scrubber.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
];

const CREATED_UI_PRIMITIVES = [
  {
    slug: "blur-shimmer",
    categorySlug: "motion",
    name: "Blur & Shimmer Text Reveal",
    description: "Glowing animated shimmer text effect with blur and staggered character reveals.",
    badge: "new" as const,
    launchedAt: "2026-08-05",
  },
];

const CREATED_BLOCKS = [
  {
    slug: "prediction-market",
    categorySlug: "blocks",
    name: "Prediction Market",
    description: "Prediction market trade ticket with buy/sell modes, outcome prices, rolling amount entry, quick add chips and trade states.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "overflow-actions",
    categorySlug: "blocks",
    name: "Overflow Actions",
    description: "Connected pill rail for primary actions that springs open to reveal extra controls.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "expandable-tabs",
    categorySlug: "blocks",
    name: "Expandable Tabs",
    description: "Icon tab bar where active tab expands to labelled pill with height-morphing panel.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
  {
    slug: "swipeable-list",
    categorySlug: "blocks",
    name: "Swipeable List",
    description: "Mobile-style list rows that swipe left or right to reveal contextual action buttons.",
    badge: "new" as const,
    launchedAt: "2026-08-07",
  },
];

export default function CreatedComponentsPage() {
  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
            Added / Custom Components
          </span>
          <span className="text-xs text-muted-foreground">
            {CREATED_SOLANA.length + CREATED_CRYPTO_MOTION.length + CREATED_UI_PRIMITIVES.length + CREATED_BLOCKS.length} components created
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Newly Created Components
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          These components were custom-built and added to Oxygen UI. They include production-ready Solana React primitives, Web3 motion components, Base58 validators, DEX interfaces, and specialized product UI blocks.
        </p>

        {/* Quick nav filter buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="#product-blocks"
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-500 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            ⚡ Product UI Blocks ({CREATED_BLOCKS.length})
          </a>
          <a
            href="#solana-primitives"
            className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Solana Primitives ({CREATED_SOLANA.length})
          </a>
          <a
            href="#crypto-motion"
            className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Crypto & Web3 Motion ({CREATED_CRYPTO_MOTION.length})
          </a>
          <a
            href="#text-effects"
            className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Text Effects ({CREATED_UI_PRIMITIVES.length})
          </a>
        </div>
      </div>

      {/* Product Blocks Section */}
      <section id="product-blocks" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Product UI Blocks
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
                4 blocks
              </span>
            </div>
            <Link
              href="/components/new-blocks"
              className="text-xs font-semibold text-emerald-500 hover:underline dark:text-emerald-400"
            >
              View Dedicated Page →
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Interactive, spring-animated composed widgets for prediction market trade tickets, expandable action rails, dynamic tab docks, and touch swipeable lists.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CREATED_BLOCKS.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug={comp.categorySlug}
              slug={comp.slug}
              name={comp.name}
              description={comp.description}
              badge={comp.badge}
              launchedAt={comp.launchedAt}
            />
          ))}
        </div>
      </section>

      {/* Solana Section */}
      <section id="solana-primitives" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Solana React Primitives
            </h2>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg">
              5 components
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Production-ready Solana UI primitives for cluster status, Base58 identity, transaction timelines, balance tickers, and dApp dashboards.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CREATED_SOLANA.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug={comp.categorySlug}
              slug={comp.slug}
              name={comp.name}
              description={comp.description}
              badge={comp.badge}
              launchedAt={comp.launchedAt}
            />
          ))}
        </div>
      </section>

      {/* Crypto Motion Section */}
      <section id="crypto-motion" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Crypto & Web3 Motion
            </h2>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg">
              8 components
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Animated Web3 components for wallet connects, NFT 3D cards, DEX tabs, token selectors, and priority fee switches.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CREATED_CRYPTO_MOTION.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug={comp.categorySlug}
              slug={comp.slug}
              name={comp.name}
              description={comp.description}
              badge={comp.badge}
              launchedAt={comp.launchedAt}
            />
          ))}
        </div>
      </section>

      {/* Text Effects Section */}
      <section id="text-effects" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Text & UI Effects
            </h2>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg">
              1 component
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            High-performance text animation and shimmer reveal effects built with Motion and Tailwind CSS.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CREATED_UI_PRIMITIVES.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug={comp.categorySlug}
              slug={comp.slug}
              name={comp.name}
              description={comp.description}
              badge={comp.badge}
              launchedAt={comp.launchedAt}
            />
          ))}
        </div>
      </section>

      {/* Switch link */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Looking for pre-existing library components?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the original beUI component library including general Motion primitives, AI Agent UI, and composed product blocks.
            </p>
          </div>
          <Link
            href="/components/existing"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View Original Library →
          </Link>
        </div>
      </div>
    </div>
  );
}
