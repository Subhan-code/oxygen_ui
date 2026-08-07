import type { Metadata } from "next";
import Link from "next/link";
import { ComponentCard } from "@/components/app/docs/component-card";
import { registry } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Original Library Components — Oxygen UI",
  description:
    "Explore the original pre-existing beUI motion primitives, AI agent UI components, and composed product blocks.",
};

const NEW_SLUGS = new Set([
  "identity",
  "network",
  "assets",
  "transactions",
  "application",
  "nft-tilt-card",
  "solana-wallet-button",
  "crypto-ticker-marquee",
  "defi-dex-tabs",
  "solana-address-input",
  "token-select",
  "protocol-switch",
  "blur-shimmer",
]);

export default function ExistingComponentsPage() {
  const motionCat = registry.find((c) => c.slug === "motion");
  const agentsCat = registry.find((c) => c.slug === "agents");
  const blocksCat = registry.find((c) => c.slug === "blocks");

  const motionComponents = (motionCat?.components ?? []).filter(
    (c) => !NEW_SLUGS.has(c.slug),
  );
  const agentComponents = agentsCat?.components ?? [];
  const blockComponents = blocksCat?.components ?? [];

  const totalCount =
    motionComponents.length + agentComponents.length + blockComponents.length;

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
            Original Library
          </span>
          <span className="text-xs text-muted-foreground">
            {totalCount} pre-existing components
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Original Library Components
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          This catalog contains the pre-existing beUI core library — featuring low-level Motion primitives, AI Agent UI components, and rich composed product blocks.
        </p>

        {/* Quick nav filter buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="#motion-primitives"
            className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Motion Primitives ({motionComponents.length})
          </a>
          <a
            href="#agent-components"
            className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            AI Agent UI ({agentComponents.length})
          </a>
          <a
            href="#composed-blocks"
            className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Composed Blocks ({blockComponents.length})
          </a>
        </div>
      </div>

      {/* Motion Primitives Section */}
      <section id="motion-primitives" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Motion Primitives
            </h2>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg">
              {motionComponents.length} components
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Base interactive motion components for navigation, buttons, selects, sheets, text reveals, and sliders.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {motionComponents.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug="motion"
              slug={comp.slug}
              name={comp.name}
              description={comp.description}
              badge={comp.badge}
              launchedAt={comp.launchedAt}
            />
          ))}
        </div>
      </section>

      {/* AI Agent UI Section */}
      <section id="agent-components" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              AI Agent Components
            </h2>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg">
              {agentComponents.length} components
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Animated React components for LLM chats, reasoning state, streamed code blocks, tool approvals, and human-in-the-loop decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {agentComponents.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug="agents"
              slug={comp.slug}
              name={comp.name}
              description={comp.description}
              badge={comp.badge}
              launchedAt={comp.launchedAt}
            />
          ))}
        </div>
      </section>

      {/* Composed Blocks Section */}
      <section id="composed-blocks" className="scroll-mt-24 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Composed Blocks
            </h2>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg">
              {blockComponents.length} components
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete product widgets including cross-chain swaps, dynamic island, command palettes, notification stacks, and infinite masonry.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {blockComponents.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug="blocks"
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
              Want to see newly added custom components?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check out the newly built Solana primitives, Web3 motion tools, and custom UI primitives added to Oxygen UI.
            </p>
          </div>
          <Link
            href="/components/created"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View Created Components →
          </Link>
        </div>
      </div>
    </div>
  );
}
