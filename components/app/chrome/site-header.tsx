"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "@/components/app/chrome/mobile-nav";
import { SiteSearch } from "@/components/app/chrome/site-search";
import { GithubIcon } from "@/components/app/icons";
import { PressLink } from "@/components/app/press-link";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { cn } from "@/lib/utils";

function formatStarCount(count: number) {
  if (count >= 1000) {
    const val = Math.round(count / 100) / 10;
    return `${val}k`;
  }
  return String(count);
}

export function SiteHeader({
  githubStarCount,
}: {
  githubStarCount: number | null;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isCreated = pathname === "/components/created";
  const isExisting = pathname === "/components/existing";
  const isSolana = pathname.startsWith("/components/solana");
  const isComponents = pathname.startsWith("/components/motion");
  const isBlocks = pathname.startsWith("/components/blocks");
  const isComponentsRoute = pathname.startsWith("/components");
  const formattedStarCount =
    typeof githubStarCount === "number"
      ? formatStarCount(githubStarCount)
      : null;

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 8);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "relative flex h-14 items-center justify-between gap-4",
          isComponentsRoute
            ? "w-full px-4 md:px-6 xl:px-8"
            : "mx-auto max-w-7xl px-4",
        )}
      >
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-bold tracking-tight text-foreground"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-accent-fg font-mono font-black text-xs shadow-xs">
              O2
            </div>
            <span>Oxygen UI</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/components/created"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isCreated
                  ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 font-semibold"
                  : "text-emerald-600 dark:text-emerald-400/90 hover:bg-emerald-500/10",
              )}
            >
              <span>Created</span>
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold">
                NEW
              </span>
            </Link>
            <Link
              href="/components/existing"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isExisting
                  ? "bg-accent/15 text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Original Library
            </Link>
            <Link
              href="/components/solana"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSolana
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Solana
            </Link>
            <Link
              href="/components/motion"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isComponents
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Motion
            </Link>
            <Link
              href="/components/blocks"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isBlocks
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Blocks
            </Link>
          </nav>
        </div>

        <nav className="flex items-center gap-3">
          <SiteSearch />
          <PressLink
            href="https://github.com/Subhan-code/oxygen_ui"
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card/20 px-3 py-2 text-xs font-medium text-foreground hover:border-(--color-border-strong)"
            aria-label={
              formattedStarCount
                ? `Star on GitHub, ${formattedStarCount} stars`
                : "Star on GitHub"
            }
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              {formattedStarCount ? <span>{formattedStarCount}</span> : null}
            </span>
          </PressLink>
          <ThemeToggle
            variant="rectangle"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card/20 text-muted-foreground transition-colors hover:text-foreground"
          />
        </nav>
      </div>
    </header>
  );
}
