"use client";
// beui.dev/components/motion/direct-scrubber-chart

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type KpiKey = "revenue" | "users" | "conversions";
export type RangeKey = "7D" | "30D" | "90D";

const KPI_DATA: Record<
  KpiKey,
  Record<RangeKey, { label: string; unit: string; values: number[] }>
> = {
  revenue: {
    "7D": {
      label: "Revenue",
      unit: "$",
      values: [1200, 1850, 1400, 2200, 3100, 2800, 3950],
    },
    "30D": {
      label: "Revenue",
      unit: "$",
      values: [
        800, 1100, 950, 1300, 1700, 1500, 1900, 2400, 2100, 2600, 3100, 2900,
        3400, 3800, 4200,
      ],
    },
    "90D": {
      label: "Revenue",
      unit: "$",
      values: [500, 900, 1200, 1800, 2400, 2900, 3500, 4100, 4900, 5600],
    },
  },
  users: {
    "7D": {
      label: "Active Users",
      unit: "",
      values: [320, 410, 380, 520, 680, 610, 790],
    },
    "30D": {
      label: "Active Users",
      unit: "",
      values: [
        200, 250, 240, 310, 400, 390, 480, 560, 530, 620, 710, 690, 800, 890,
        960,
      ],
    },
    "90D": {
      label: "Active Users",
      unit: "",
      values: [150, 220, 310, 440, 580, 690, 810, 930, 1120, 1350],
    },
  },
  conversions: {
    "7D": {
      label: "Conversions",
      unit: "%",
      values: [2.1, 2.4, 2.3, 2.9, 3.5, 3.2, 4.1],
    },
    "30D": {
      label: "Conversions",
      unit: "%",
      values: [
        1.8, 1.9, 2.1, 2.3, 2.6, 2.8, 3.1, 3.4, 3.3, 3.7, 3.9, 4.2, 4.5, 4.8,
        5.1,
      ],
    },
    "90D": {
      label: "Conversions",
      unit: "%",
      values: [1.2, 1.6, 2.0, 2.5, 3.1, 3.6, 4.0, 4.6, 5.2, 5.8],
    },
  },
};

const TOP = 20;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function buildSvgPath(data: number[], top = TOP): string {
  const n = data.length;
  if (n === 0) return "";
  const max = Math.max(...data, 1);

  const points = data.map((val, idx) => {
    const x = n > 1 ? (idx / (n - 1)) * 100 : 50;
    const y = top + (1 - val / max) * (100 - top);
    return { x, y };
  });

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return path;
}

export interface DirectScrubberChartProps {
  className?: string;
}

export function DirectScrubberChart({ className }: DirectScrubberChartProps) {
  const [activeKpi, setActiveKpi] = useState<KpiKey>("revenue");
  const [activeRange, setActiveRange] = useState<RangeKey>("7D");

  const scrubRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const dataset = KPI_DATA[activeKpi][activeRange];
  const data = dataset.values;
  const n = data.length;

  const [scrubIndex, setScrubIndex] = useState<number>(n - 1);

  const targetX = useMotionValue(100);
  const targetY = useMotionValue(
    TOP + (1 - (data[n - 1] ?? 0) / Math.max(...data, 1)) * (100 - TOP),
  );

  const springCfg = { stiffness: 650, damping: 42, mass: 0.5 };
  const sx = useSpring(targetX, springCfg);
  const sy = useSpring(targetY, springCfg);

  const updateScrub = useCallback(
    (clientX: number) => {
      if (!scrubRef.current) return;
      const rect = scrubRef.current.getBoundingClientRect();
      const f = clamp((clientX - rect.left) / rect.width, 0, 1);
      const idx = n > 1 ? Math.round(f * (n - 1)) : 0;
      const max = Math.max(...data, 1);

      const x = n > 1 ? (idx / (n - 1)) * 100 : 50;
      const y = TOP + (1 - data[idx] / max) * (100 - TOP);

      targetX.set(x);
      targetY.set(y);
      setScrubIndex(idx);
    },
    [data, n, targetX, targetY],
  );

  useEffect(() => {
    const idx = clamp(scrubIndex, 0, n - 1);
    const max = Math.max(...data, 1);
    const x = n > 1 ? (idx / (n - 1)) * 100 : 50;
    const y = TOP + (1 - data[idx] / max) * (100 - TOP);

    targetX.set(x);
    targetY.set(y);
    setScrubIndex(idx);
  }, [activeKpi, activeRange, data, n, scrubIndex, targetX, targetY]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateScrub(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateScrub(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
  };

  const currentValue = data[scrubIndex] ?? 0;
  const pathD = buildSvgPath(data, TOP);

  return (
    <div
      className={cn(
        "flex w-full max-w-[440px] flex-col rounded-3xl border border-border bg-card p-6 shadow-xl",
        className,
      )}
    >
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          {(["revenue", "users", "conversions"] as KpiKey[]).map((kpi) => (
            <button
              key={kpi}
              type="button"
              onClick={() => setActiveKpi(kpi)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
                activeKpi === kpi
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {kpi}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          {(["7D", "30D", "90D"] as RangeKey[]).map((rng) => (
            <button
              key={rng}
              type="button"
              onClick={() => setActiveRange(rng)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                activeRange === rng
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {rng}
            </button>
          ))}
        </div>
      </div>

      {/* Scrub readout */}
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {dataset.label} (Day {scrubIndex + 1})
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {dataset.unit === "$"
              ? `$${currentValue.toLocaleString()}`
              : `${currentValue.toLocaleString()}${dataset.unit}`}
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
          Direct Spring Scrubber
        </span>
      </div>

      {/* Interactive Chart Canvas */}
      <div
        ref={scrubRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative my-4 h-[180px] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-2"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          {/* Morphing Curve Path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            className="text-blue-500"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Fill Gradient area */}
          <motion.path
            d={`${pathD} L 100 100 L 0 100 Z`}
            fill="currentColor"
            className="text-blue-500/10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </svg>

        {/* Dual-axis Spring Marker */}
        <motion.div
          style={{
            left: useTransform(sx, (v) => `${v}%`),
            top: useTransform(sy, (v) => `${v}%`),
          }}
          className="pointer-events-none absolute -ml-3 -mt-3 flex h-6 w-6 items-center justify-center"
        >
          <span className="absolute h-6 w-6 animate-ping rounded-full bg-blue-500/30" />
          <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-600 shadow-md dark:border-zinc-900" />
        </motion.div>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Drag or tap anywhere to scrub curve with zero-lag dual-axis spring
      </p>
    </div>
  );
}
