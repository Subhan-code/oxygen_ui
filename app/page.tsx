import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { InstallCommand } from "@/components/app/docs/install-command";
import { Hero } from "@/components/app/landing/hero";
import { LandingComponentCard } from "@/components/app/landing/landing-component-card";
import { WorkCta } from "@/components/app/landing/work-cta";
import { isComponentNew } from "@/lib/component-status";
import { registry } from "@/lib/registry";

const CURATED: { category: string; slug: string }[] = [
  { category: "solana", slug: "identity" },
  { category: "solana", slug: "network" },
  { category: "solana", slug: "assets" },
  { category: "solana", slug: "transactions" },
  { category: "solana", slug: "application" },
  { category: "motion", slug: "solana-wallet-button" },
  { category: "motion", slug: "nft-tilt-card" },
  { category: "motion", slug: "crypto-ticker-marquee" },
  { category: "motion", slug: "defi-dex-tabs" },
  { category: "motion", slug: "protocol-switch" },
  { category: "motion", slug: "solana-address-input" },
  { category: "motion", slug: "token-select" },
  { category: "blocks", slug: "swap" },
  { category: "blocks", slug: "wallet-card" },
  { category: "blocks", slug: "prediction-market" },
];

const GRID_CLASS =
  "grid grid-cols-1 gap-4 [grid-auto-rows:19rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:self-auto"
        >
          Browse animated React components
          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  const newComponents = registry
    .flatMap((category) =>
      category.components
        .filter((component) => isComponentNew(component))
        .map((component) => {
          const newVariant = component.examples
            ?.filter((example) => isComponentNew(example))
            .sort((a, b) =>
              (b.launchedAt ?? "").localeCompare(a.launchedAt ?? ""),
            )[0];

          return {
            category: category.slug,
            previewKey: newVariant?.previewKey,
            component: newVariant
              ? {
                  ...component,
                  name: newVariant.name,
                  description:
                    newVariant.description ?? component.description,
                  launchedAt: newVariant.launchedAt,
                }
              : component,
          };
        }),
    )
    // Newest first: most recently launched components lead the section.
    .sort((a, b) =>
      (b.component.launchedAt ?? "").localeCompare(a.component.launchedAt ?? ""),
    );
  const newComponentKeys = new Set(
    newComponents.map(
      ({ category, component }) => `${category}/${component.slug}`,
    ),
  );
  const curatedComponents = CURATED.flatMap(({ category, slug }) => {
    const cat = registry.find((c) => c.slug === category);
    const comp = cat?.components.find((c) => c.slug === slug);
    return comp ? [{ category, component: comp }] : [];
  }).filter(
    ({ category, component }) =>
      !newComponentKeys.has(`${category}/${component.slug}`),
  );

  return (
    <div className="relative">
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-20 md:pt-28">
        <Hero />
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-24">
        <p className="mb-5 text-center text-sm text-muted-foreground">
          Built on Framer Motion. Distributed via shadcn.
        </p>
        <InstallCommand />
      </section>

      {newComponents.length ? (
        <section className="mx-auto max-w-7xl border-t border-border px-4 pb-16 pt-14">
          <SectionHeader eyebrow="New" title="Recently launched" />
          <div className={GRID_CLASS}>
            {newComponents.map(({ category, component, previewKey }) => (
              <LandingComponentCard
                key={`${category}-${component.slug}`}
                component={component}
                category={category}
                previewKey={previewKey}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl border-t border-border px-4 pb-16 pt-14">
        <SectionHeader
          eyebrow="Components"
          title="Motion primitives"
          href="/components/motion"
        />
        <div className={GRID_CLASS}>
          {curatedComponents.map(({ category, component }) => (
            <LandingComponentCard
              key={`${category}-${component.slug}`}
              component={component}
              category={category}
            />
          ))}
        </div>
      </section>

      <WorkCta />

      <SiteFooter />
    </div>
  );
}
