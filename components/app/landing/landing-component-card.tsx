"use client";

import { ArrowUpRight } from "lucide-react";
import { useInView } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { NewBadge } from "@/components/app/docs/new-badge";
import { PreviewFit } from "@/components/app/landing/preview-fit";
import { getPreview, previews } from "@/components/previews";
import type { ComponentEntry } from "@/lib/registry";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "wide" | "feature";

const VARIANT_SPAN: Record<CardVariant, string> = {
  default: "",
  wide: "sm:col-span-2",
  feature: "sm:col-span-2 sm:row-span-2",
};

export function LandingComponentCard({
  component,
  category = "motion",
  variant = "default",
  previewKey,
}: {
  component: ComponentEntry;
  category?: string;
  variant?: CardVariant;
  previewKey?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldRenderPreview = useInView(cardRef, {
    once: true,
    margin: "0px",
  });
  const Preview = previewKey
    ? previews[previewKey]
    : getPreview(category, component.slug);
  const [hover, setHover] = useState(false);
  const feature = variant === "feature";

  return (
    <article
      ref={cardRef}
      className={cn("group/card relative h-full", VARIANT_SPAN[variant])}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Link
        href={`/components/${category}/${component.slug}`}
        prefetch={false}
        aria-label={`View ${component.name}`}
        className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-black/[0.08] bg-card/75 backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] contain-[paint] dark:border-white/[0.12] dark:bg-card/45 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.4)] group-hover/card:-translate-y-1.5 group-hover/card:scale-[1.008] group-hover/card:border-black/20 dark:group-hover/card:border-white/30 group-hover/card:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] dark:group-hover/card:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.6)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent transition-opacity duration-300 group-hover/card:via-white/80 dark:group-hover/card:via-white/40" />
        {shouldRenderPreview ? (
          <PreviewFit hover={hover} maxScale={feature ? 1 : 0.82}>
            {Preview ? <Preview /> : null}
          </PreviewFit>
        ) : (
          <div
            aria-hidden="true"
            className="relative m-2 mb-0 min-h-0 flex-1 rounded-[20px] bg-background/50"
          />
        )}

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-black/[0.06] bg-card/40 px-5 py-4 backdrop-blur-md dark:border-white/[0.08]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-accent uppercase">
                {category}
              </span>
              {component.badge === "new" ? (
                <NewBadge launchedAt={component.launchedAt} />
              ) : null}
            </div>
            <h3
              className={cn(
                "mt-1 truncate font-display font-semibold tracking-tight text-foreground",
                feature ? "text-lg" : "text-[0.95rem]",
              )}
            >
              {component.name}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
              {component.description}
            </p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 opacity-70 transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-accent group-hover/card:text-accent-fg group-hover/card:opacity-100">
            <ArrowUpRight
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
