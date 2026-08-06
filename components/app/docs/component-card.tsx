import Link from "next/link";
import { NewBadge } from "@/components/app/docs/new-badge";

export function ComponentCard({
  categorySlug,
  slug,
  name,
  description,
  badge,
  launchedAt,
}: {
  categorySlug: string;
  slug: string;
  name: string;
  description: string;
  badge?: "new";
  launchedAt?: string;
}) {
  return (
    <Link
      href={`/components/${categorySlug}/${slug}`}
      className="group/card relative flex h-40 flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-card/75 backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] contain-[paint] dark:border-white/[0.12] dark:bg-card/45 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] group-hover/card:-translate-y-1 group-hover/card:scale-[1.01] group-hover/card:border-black/20 dark:group-hover/card:border-white/30 group-hover/card:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12)] dark:group-hover/card:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent transition-opacity duration-300 group-hover/card:via-white/80 dark:group-hover/card:via-white/40" />
      <div className="flex shrink-0 items-center justify-between gap-3 px-4.5 py-3">
        <h3 className="truncate font-display text-base font-semibold text-foreground">
          {name}
        </h3>
        {badge === "new" ? <NewBadge launchedAt={launchedAt} /> : null}
      </div>

      <div className="mx-2 mb-2 flex min-h-0 flex-1 items-start overflow-hidden rounded-[18px] bg-background/50 px-4 py-3.5 backdrop-blur-sm transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:bg-background/80 group-focus-visible/card:bg-background/80">
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}
