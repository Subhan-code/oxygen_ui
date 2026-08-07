"use client";
// beui.dev/components/motion/dither-bar-chart

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BarPeriodKey = "1D" | "1W" | "1M" | "1Y";

export type BarSegment = {
  key: string;
  color: string;
  h: number; // target height in px
  label: string;
  value: number;
};

export type BarColumn = {
  id: string;
  label: string;
  segments: BarSegment[];
};

export type BarChartPeriod = {
  label: string;
  columns: BarColumn[];
};

const DEFAULT_BAR_PERIODS: Record<BarPeriodKey, BarChartPeriod> = {
  "1D": {
    label: "Hourly Distribution",
    columns: [
      {
        id: "c1",
        label: "00:00",
        segments: [
          { key: "c1-a", color: "#3B82F6", h: 45, label: "Volume", value: 450 },
          { key: "c1-b", color: "#8B5CF6", h: 30, label: "Fees", value: 300 },
        ],
      },
      {
        id: "c2",
        label: "06:00",
        segments: [
          { key: "c2-a", color: "#3B82F6", h: 80, label: "Volume", value: 800 },
          { key: "c2-b", color: "#8B5CF6", h: 40, label: "Fees", value: 400 },
        ],
      },
      {
        id: "c3",
        label: "12:00",
        segments: [
          { key: "c3-a", color: "#3B82F6", h: 120, label: "Volume", value: 1200 },
          { key: "c3-b", color: "#8B5CF6", h: 55, label: "Fees", value: 550 },
        ],
      },
      {
        id: "c4",
        label: "18:00",
        segments: [
          { key: "c4-a", color: "#3B82F6", h: 95, label: "Volume", value: 950 },
          { key: "c4-b", color: "#8B5CF6", h: 45, label: "Fees", value: 450 },
        ],
      },
    ],
  },
  "1W": {
    label: "Weekly Distribution",
    columns: [
      {
        id: "c1",
        label: "Mon",
        segments: [
          { key: "c1-a", color: "#3B82F6", h: 90, label: "Volume", value: 900 },
          { key: "c1-b", color: "#8B5CF6", h: 50, label: "Fees", value: 500 },
        ],
      },
      {
        id: "c2",
        label: "Wed",
        segments: [
          { key: "c2-a", color: "#3B82F6", h: 140, label: "Volume", value: 1400 },
          { key: "c2-b", color: "#8B5CF6", h: 65, label: "Fees", value: 650 },
        ],
      },
      {
        id: "c3",
        label: "Fri",
        segments: [
          { key: "c3-a", color: "#3B82F6", h: 110, label: "Volume", value: 1100 },
          { key: "c3-b", color: "#8B5CF6", h: 50, label: "Fees", value: 500 },
        ],
      },
      {
        id: "c4",
        label: "Sun",
        segments: [
          { key: "c4-a", color: "#3B82F6", h: 70, label: "Volume", value: 700 },
          { key: "c4-b", color: "#8B5CF6", h: 35, label: "Fees", value: 350 },
        ],
      },
    ],
  },
  "1M": {
    label: "Monthly Distribution",
    columns: [
      {
        id: "c1",
        label: "Week 1",
        segments: [
          { key: "c1-a", color: "#3B82F6", h: 60, label: "Volume", value: 600 },
          { key: "c1-b", color: "#8B5CF6", h: 35, label: "Fees", value: 350 },
        ],
      },
      {
        id: "c2",
        label: "Week 2",
        segments: [
          { key: "c2-a", color: "#3B82F6", h: 105, label: "Volume", value: 1050 },
          { key: "c2-b", color: "#8B5CF6", h: 55, label: "Fees", value: 550 },
        ],
      },
      {
        id: "c3",
        label: "Week 3",
        segments: [
          { key: "c3-a", color: "#3B82F6", h: 150, label: "Volume", value: 1500 },
          { key: "c3-b", color: "#8B5CF6", h: 75, label: "Fees", value: 750 },
        ],
      },
      {
        id: "c4",
        label: "Week 4",
        segments: [
          { key: "c4-a", color: "#3B82F6", h: 130, label: "Volume", value: 1300 },
          { key: "c4-b", color: "#8B5CF6", h: 60, label: "Fees", value: 600 },
        ],
      },
    ],
  },
  "1Y": {
    label: "Yearly Distribution",
    columns: [
      {
        id: "c1",
        label: "Q1",
        segments: [
          { key: "c1-a", color: "#3B82F6", h: 110, label: "Volume", value: 1100 },
          { key: "c1-b", color: "#8B5CF6", h: 50, label: "Fees", value: 500 },
        ],
      },
      {
        id: "c2",
        label: "Q2",
        segments: [
          { key: "c2-a", color: "#3B82F6", h: 135, label: "Volume", value: 1350 },
          { key: "c2-b", color: "#8B5CF6", h: 60, label: "Fees", value: 600 },
        ],
      },
      {
        id: "c3",
        label: "Q3",
        segments: [
          { key: "c3-a", color: "#3B82F6", h: 90, label: "Volume", value: 900 },
          { key: "c3-b", color: "#8B5CF6", h: 40, label: "Fees", value: 400 },
        ],
      },
      {
        id: "c4",
        label: "Q4",
        segments: [
          { key: "c4-a", color: "#3B82F6", h: 160, label: "Volume", value: 1600 },
          { key: "c4-b", color: "#8B5CF6", h: 80, label: "Fees", value: 800 },
        ],
      },
    ],
  },
};

const BAR_PERIOD_KEYS: BarPeriodKey[] = ["1D", "1W", "1M", "1Y"];
const HIGHLIGHT_COLOR = "#60A5FA";

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function drawBand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  cell: number,
  alpha: number,
  hot: boolean,
  time: number,
) {
  if (h <= 0 || w <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.clip();

  const ditherSize = hot ? 5 : 3;
  const step = ditherSize * 2;
  const off = (time / 30) % step;

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  for (let px = x - step; px <= x + w + step; px += step) {
    for (let py = y - step; py <= y + h + step; py += step) {
      const shift = (Math.floor((px + py) / step) % 2) * ditherSize;
      ctx.fillRect(px + ((off + shift) % step), py, ditherSize, ditherSize);
    }
  }
  ctx.restore();

  if (hot) {
    ctx.strokeStyle = HIGHLIGHT_COLOR;
    ctx.lineWidth = 2;
    ctx.shadowColor = HIGHLIGHT_COLOR;
    ctx.shadowBlur = 10;
    ctx.stroke();
  }

  ctx.restore();
}

export interface DitherBarChartProps {
  periods?: Record<BarPeriodKey, BarChartPeriod>;
  defaultPeriod?: BarPeriodKey;
  className?: string;
}

export function DitherBarChart({
  periods = DEFAULT_BAR_PERIODS,
  defaultPeriod = "1D",
  className,
}: DitherBarChartProps) {
  const [activePeriod, setActivePeriod] = useState<BarPeriodKey>(defaultPeriod);
  const [hoveredColumnIdx, setHoveredColumnIdx] = useState<number | null>(null);
  const [hoveredSegIdx, setHoveredSegIdx] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  const drawnMapRef = useRef<Map<string, number>>(new Map());
  const fromMapRef = useRef<Map<string, number>>(new Map());
  const morphRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  const currentPeriodData = periods[activePeriod];
  const columns = currentPeriodData.columns;

  const changePeriod = (key: BarPeriodKey) => {
    if (key === activePeriod) return;
    fromMapRef.current = new Map(drawnMapRef.current);
    morphRef.current = true;
    startTimeRef.current = performance.now();
    setActivePeriod(key);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = (time: number) => {
      if (!running) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const elapsed = time - startTimeRef.current;
      const duration = 500;
      const prog = morphRef.current ? Math.min(1, elapsed / duration) : 1;

      if (prog >= 1) {
        morphRef.current = false;
      }

      const n = columns.length;
      const paddingX = 40;
      const bottomY = h - 36;
      const availableW = w - paddingX * 2;
      const barW = Math.min(48, (availableW / n) * 0.55);
      const gap = (availableW - barW * n) / (n + 1 || 1);

      columns.forEach((col, i) => {
        const x0 = paddingX + gap * (i + 1) + barW * i;
        const bp =
          1 -
          Math.pow(
            1 - clamp((prog - i * 0.05) / (1 - (n - 1) * 0.05), 0, 1),
            3,
          );

        let currentY = bottomY;
        const isColumnHovered = hoveredColumnIdx === i;

        col.segments.forEach((s, si) => {
          const fromH = fromMapRef.current.get(s.key) ?? 0;
          const segH = fromH + (s.h - fromH) * bp;
          drawnMapRef.current.set(s.key, segH);

          const isSegHovered = isColumnHovered && hoveredSegIdx === si;
          const isAnyHovered = hoveredColumnIdx !== null;

          let alpha = 1.0;
          if (isAnyHovered) {
            if (isColumnHovered) {
              alpha = isSegHovered ? 1.0 : 0.48;
            } else {
              alpha = 0.3;
            }
          }

          const hot = isSegHovered;
          drawBand(
            ctx,
            x0,
            currentY - segH,
            barW,
            segH,
            hot ? HIGHLIGHT_COLOR : s.color,
            4,
            alpha,
            hot,
            time,
          );

          currentY -= segH + 4;
        });
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [columns, hoveredColumnIdx, hoveredSegIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const n = columns.length;
    const paddingX = 40;
    const availableW = rect.width - paddingX * 2;
    const barW = Math.min(48, (availableW / n) * 0.55);
    const gap = (availableW - barW * n) / (n + 1 || 1);
    const bottomY = rect.height - 36;

    for (let i = 0; i < n; i++) {
      const x0 = paddingX + gap * (i + 1) + barW * i;
      if (x >= x0 && x <= x0 + barW) {
        let currentY = bottomY;
        const col = columns[i];

        for (let si = 0; si < col.segments.length; si++) {
          const segH = drawnMapRef.current.get(col.segments[si].key) ?? 0;
          if (y >= currentY - segH && y <= currentY) {
            setHoveredColumnIdx(i);
            setHoveredSegIdx(si);
            return;
          }
          currentY -= segH + 4;
        }

        setHoveredColumnIdx(i);
        setHoveredSegIdx(null);
        return;
      }
    }

    setHoveredColumnIdx(null);
    setHoveredSegIdx(null);
  };

  const handleMouseLeave = () => {
    setHoveredColumnIdx(null);
    setHoveredSegIdx(null);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-[440px] flex-col rounded-3xl border border-border bg-card p-6 shadow-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Staggered Bar Field
          </p>
          <h3 className="text-lg font-bold text-foreground">
            Dither Bar Chart
          </h3>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          {BAR_PERIOD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => changePeriod(key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                activePeriod === key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="relative my-4 flex h-[240px] w-full items-center justify-center">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="h-full w-full cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
        <span className="font-semibold text-muted-foreground">
          {currentPeriodData.label}
        </span>
        <AnimatePresence mode="wait">
          {hoveredColumnIdx !== null ? (
            <motion.span
              key={`${hoveredColumnIdx}-${hoveredSegIdx}`}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              className="font-mono font-bold text-foreground"
            >
              {columns[hoveredColumnIdx]?.label}:{" "}
              {hoveredSegIdx !== null && columns[hoveredColumnIdx]?.segments[hoveredSegIdx]
                ? `${columns[hoveredColumnIdx].segments[hoveredSegIdx].label} ($${columns[hoveredColumnIdx].segments[hoveredSegIdx].value})`
                : `$${columns[hoveredColumnIdx]?.segments.reduce((acc, s) => acc + s.value, 0)}`}
            </motion.span>
          ) : (
            <span className="text-muted-foreground">Hover bar to inspect</span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
