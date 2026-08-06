"use client";

import { CircleDashed, FileText, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NewBadge } from "@/components/app/docs/new-badge";
import {
  type CommandItem,
  CommandPalette,
} from "@/components/motion/command-palette";
import { registry } from "@/lib/registry";
import { cn } from "@/lib/utils";

const SEARCH_EXAMPLES = [
  "Search SOL balance...",
  "Search Base58 address...",
  "Search DEX Swap widget...",
  "Search RPC status...",
  "Search Transaction timeline...",
  "Search cNFT cards...",
  "Search Priority Fee gauge...",
];

const PAGES = [
  {
    slug: "motion-patterns",
    name: "Motion Patterns & Guides",
    href: "/docs/motion-patterns",
  },
];

export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIdx((prev) => (prev + 1) % SEARCH_EXAMPLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const items = useMemo<CommandItem[]>(
    () => [
      ...registry.flatMap((cat) =>
        cat.components.map((comp) => ({
          id: `${cat.slug}-${comp.slug}`,
          label: comp.name,
          group: cat.name,
          keywords: [comp.slug, cat.name],
          icon: CircleDashed,
          badge:
            comp.badge === "new" ? (
              <NewBadge launchedAt={comp.launchedAt} />
            ) : undefined,
          onSelect: () => router.push(`/components/${cat.slug}/${comp.slug}`),
        })),
      ),
      ...PAGES.map((page) => ({
        id: page.slug,
        label: page.name,
        group: "Pages",
        keywords: [page.slug],
        icon: FileText,
        onSelect: () => router.push(page.href),
      })),
    ],
    [router],
  );

  return (
    <>
      <button
        type="button"
        aria-label="Search components"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative flex h-9 w-48 items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 text-sm text-muted-foreground backdrop-blur-md transition-all duration-300 ease-out hover:w-[201.6px] hover:border-accent hover:text-foreground hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-56 sm:hover:w-[235.2px]",
          className,
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-foreground transition-transform group-hover:scale-110" />
        <div className="relative flex-1 h-5 overflow-hidden text-left">
          <AnimatePresence mode="wait">
            <motion.span
              key={exampleIdx}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center text-xs font-mono text-muted-foreground group-hover:text-foreground truncate"
            >
              {SEARCH_EXAMPLES[exampleIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </button>
      <CommandPalette
        items={items}
        open={open}
        onOpenChange={setOpen}
        placeholder="Search Solana primitives & components..."
      />
    </>
  );
}
