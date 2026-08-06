import Link from "next/link";
import { GithubIcon } from "@/components/app/icons";
import { registry } from "@/lib/registry";

const FOOTER_LIMIT = 5;

export function SiteFooter() {
  const solanaCat = registry.find((c) => c.slug === "solana");
  const agentsCat = registry.find((c) => c.slug === "agents");
  const motionCat = registry.find((c) => c.slug === "motion");
  const blocksCat = registry.find((c) => c.slug === "blocks");

  const solanaList = (solanaCat?.components ?? []).slice(0, FOOTER_LIMIT);
  const agentsList = (agentsCat?.components ?? []).slice(0, FOOTER_LIMIT);
  const motionList = (motionCat?.components ?? []).slice(0, FOOTER_LIMIT);
  const blocksList = (blocksCat?.components ?? []).slice(0, FOOTER_LIMIT);

  return (
    <footer className="w-full border-t border-black/5 bg-background/50 px-4 pt-16 pb-12 backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent text-accent-fg font-mono font-black text-xs shadow-xs">
                O2
              </div>
              <span className="font-display text-lg font-semibold">Oxygen UI</span>
            </Link>
            <p className="mt-3 max-w-[280px] text-xs leading-relaxed text-muted-foreground">
              Animated React UI components and AI agent primitives. Copy-paste source code via the shadcn CLI registry.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://github.com/starc007/ui-components"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <GithubIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://x.com/saurra3h"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X / Twitter"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Solana */}
          <div>
            <p className="mb-3.5 text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground/80">
              Solana
            </p>
            <ul className="space-y-2 text-xs">
              {solanaList.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/components/solana/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components/solana"
                  className="font-medium text-accent transition-colors hover:text-accent/80"
                >
                  View all ({solanaCat?.components.length ?? 0})
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Agents */}
          <div>
            <p className="mb-3.5 text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground/80">
              AI Agents
            </p>
            <ul className="space-y-2 text-xs">
              {agentsList.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/components/agents/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components/agents"
                  className="font-medium text-accent transition-colors hover:text-accent/80"
                >
                  View all ({agentsCat?.components.length ?? 0})
                </Link>
              </li>
            </ul>
          </div>

          {/* Motion Components */}
          <div>
            <p className="mb-3.5 text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground/80">
              Components
            </p>
            <ul className="space-y-2 text-xs">
              {motionList.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/components/motion/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components/motion"
                  className="font-medium text-accent transition-colors hover:text-accent/80"
                >
                  View all ({motionCat?.components.length ?? 0})
                </Link>
              </li>
            </ul>
          </div>

          {/* Blocks */}
          <div>
            <p className="mb-3.5 text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground/80">
              Blocks
            </p>
            <ul className="space-y-2 text-xs">
              {blocksList.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/components/blocks/${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components/blocks"
                  className="font-medium text-accent transition-colors hover:text-accent/80"
                >
                  View all ({blocksCat?.components.length ?? 0})
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row dark:border-white/10">
          <p className="text-xs text-muted-foreground">
            © 2026 Oxygen UI / beUI. MIT License.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="https://github.com/starc007/ui-components" target="_blank" className="hover:text-foreground">
              GitHub
            </Link>
            <Link href="/docs/motion-patterns" className="hover:text-foreground">
              Docs
            </Link>
            <Link href="/llms.txt" className="hover:text-foreground">
              llms.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
