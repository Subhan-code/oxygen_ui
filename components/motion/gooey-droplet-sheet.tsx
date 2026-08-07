"use client";
// beui.dev/components/motion/gooey-droplet-sheet

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type GooeySpreadMode = "never" | "always";

const SHEET_MIN = 24;
const SHEET_MAX = 158;
const DD_BEAD_W = 76;
const DD_FULL_W = 220;
const PINCH_MAX = 0.3;
const PINCH_V = 70;

function easeOutQuad(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return 1 - (1 - clamped) * (1 - clamped);
}

function easeOutCubic(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return 1 - Math.pow(1 - clamped, 3);
}

export interface GooeyDropletSheetProps {
  spread?: GooeySpreadMode;
  defaultSpread?: GooeySpreadMode;
  className?: string;
}

export function GooeyDropletSheet({
  spread,
  defaultSpread = "always",
  className,
}: GooeyDropletSheetProps) {
  const [mode, setMode] = useState<GooeySpreadMode>(spread ?? defaultSpread);
  const [isExpanded, setIsExpanded] = useState(false);

  const rawP = useMotionValue(0);
  const p = useSpring(rawP, { stiffness: 320, damping: 28 });
  const vp = useVelocity(p);

  useEffect(() => {
    rawP.set(isExpanded ? 1 : 0);
  }, [isExpanded, rawP]);

  // Top edge: 20 -> 48 via easeOutQuad
  const y = useTransform(p, (v) => 20 + 28 * easeOutQuad(v / 0.45));

  // Height transform
  const heightNever = useTransform(() => SHEET_MIN + (SHEET_MAX - SHEET_MIN) * p.get());
  const heightAlways = useTransform(() => SHEET_MIN + (SHEET_MAX - SHEET_MIN) * easeOutCubic(p.get()));

  // Width transform
  const widthNever = useTransform(() => DD_FULL_W);
  const widthAlways = useTransform(() => {
    const base = DD_BEAD_W + (DD_FULL_W - DD_BEAD_W) * p.get();
    const pinch = Math.min(PINCH_MAX, Math.abs(vp.get()) / PINCH_V);
    return base * (1 - pinch);
  });

  // Border Radius transform
  const radiusNever = useTransform(() => 6 + 2 * p.get());
  const radiusAlways = useTransform(() => {
    const v = p.get();
    const curW = widthAlways.get();
    const curH = heightAlways.get();
    const round = Math.min(curW, curH) / 2;
    return round * (1 - v) + 8 * v;
  });

  const activeHeight = mode === "never" ? heightNever : heightAlways;
  const activeWidth = mode === "never" ? widthNever : widthAlways;
  const activeRadius = mode === "never" ? radiusNever : radiusAlways;

  return (
    <div
      className={cn(
        "flex w-full max-w-[380px] flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-xl",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Gooey Droplet Sheet
          </h3>
          <p className="text-xs text-muted-foreground">
            Velocity-driven liquid pinch & surface tension
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setMode("never")}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              mode === "never"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Full Width
          </button>
          <button
            type="button"
            onClick={() => setMode("always")}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              mode === "always"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            The Bead
          </button>
        </div>
      </div>

      <div className="relative flex h-[240px] w-full items-start justify-center overflow-hidden pt-4">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="z-20 inline-flex h-10 w-[220px] items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-md transition-transform active:scale-95 hover:bg-blue-500"
        >
          {isExpanded ? "Peel Sheet Up" : "Peel Sheet Down"}
        </button>

        {/* Morphing Gooey Droplet Sheet */}
        <motion.div
          style={{
            y,
            width: activeWidth,
            height: activeHeight,
            borderRadius: activeRadius,
          }}
          className="absolute z-10 flex flex-col items-center justify-center overflow-hidden border border-blue-400/40 bg-gradient-to-b from-blue-500/90 to-blue-700/95 text-white shadow-2xl backdrop-blur-md"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center p-4 text-center"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  {mode === "always" ? "Droplet Bloomed" : "Sheet Expanded"}
                </span>
                <p className="mt-1 text-sm font-bold text-white">
                  Liquid Surface Morph
                </p>
                <p className="mt-1 text-[11px] text-blue-100/80">
                  {mode === "always"
                    ? "Velocity pinch relaxed into wide sheet"
                    : "Sheet peeled down at constant width"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-semibold text-blue-200"
              >
                {mode === "always" ? "Bead" : "Min"}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex w-full items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span>Mode: <strong className="text-foreground">{mode}</strong></span>
        <span>State: <strong className="text-foreground">{isExpanded ? "Expanded" : "Collapsed"}</strong></span>
      </div>
    </div>
  );
}
