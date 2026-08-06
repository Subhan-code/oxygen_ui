"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { PressLink } from "@/components/app/press-link";
import { BlurShimmerText } from "@/components/motion/blur-shimmer-text";
import { TextReveal } from "@/components/motion/text-reveal";
import { EASE_OUT } from "@/lib/ease";

const HEADLINE = ["Solana-first UI primitives", "built for Web3 developers"];
const HEADLINE_WORDS = HEADLINE.reduce((n, l) => n + l.split(" ").length, 0);
const STAGGER = 0.09;
const START = 0.12;

export function Hero() {
  const headlineEnd = START + HEADLINE_WORDS * STAGGER;
  const subDelay = headlineEnd + 0.05;
  const ctaDelay = subDelay + 0.25;

  return (
    <div className="mx-auto max-w-7xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.05 }}
        className="flex justify-center"
      >
        <PressLink
          href="/components/solana"
          className="group mb-7 inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Oxygen UI Monorepo · 54+ Solana Primitives & Base58 Core
          <ArrowUpRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </PressLink>
      </motion.div>

      <TextReveal
        as="h1"
        text={HEADLINE}
        delay={START}
        stagger={STAGGER}
        className="mx-auto font-display text-5xl font-semibold leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl"
      />

      <div className="mt-4 flex justify-center">
        <BlurShimmerText
          texts={[
            "Software Engineering & Web3 Primitives",
            "Smooth Transitions & Micro-Animations",
            "High Performance React 19 Motion Library",
          ]}
          interval={3}
          blur={8}
          className="text-sm font-mono text-accent"
        />
      </div>

      <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-7 text-muted-foreground">
        Open-source, Solana-first React UI primitive library and design system monorepo.
        54+ primitives for address validation, cluster status, token cards, and transaction timelines.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: ctaDelay }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <PressLink
          href="/components/solana"
          className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-transparent bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] focus-visible:outline-none"
        >
          Explore Solana Primitives
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </PressLink>
        <PressLink
          href="/components/motion"
          className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Browse All Components
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </PressLink>
      </motion.div>
    </div>
  );
}
