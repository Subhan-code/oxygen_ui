"use client";
// beui.dev/components/motion/members-line-chart

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RangeDays = 7 | 14 | 30 | 90;

function generateSeries(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const t = days > 1 ? i / (days - 1) : 0;
    const base = 9 + t * 23;
    const wave = 6 * Math.sin(i * 0.7 + 1) + 3 * Math.sin(i * 1.9);
    return Math.max(3, Math.round(base + wave));
  });
}

const TOP_HEADROOM = 16; // 16% headroom above max

export interface MembersLineChartProps {
  defaultDays?: RangeDays;
  className?: string;
}

export function MembersLineChart({
  defaultDays = 30,
  className,
}: MembersLineChartProps) {
  const [days, setDays] = useState<RangeDays>(defaultDays);
  const [scrubIdx, setScrubIdx] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const scrubRef = useRef<HTMLDivElement>(null);

  const series = generateSeries(days);
  const maxVal = Math.max(...series, 1);
  const currentTotal = series.reduce((a, b) => a + b, 0);

  const targetX = useMotionValue(100);
  const targetY = useMotionValue(0);
  const springCfg = { stiffness: 650, damping: 42, mass: 0.5 };
  const sx = useSpring(targetX, springCfg);
  const sy = useSpring(targetY, springCfg);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!scrubRef.current) return;
    const rect = scrubRef.current.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(f * (days - 1));
    const val = series[idx] ?? 0;

    targetX.set((idx / (days - 1)) * 100);
    targetY.set(
      TOP_HEADROOM + (1 - val / maxVal) * (100 - TOP_HEADROOM),
    );
    setScrubIdx(idx);
  };

  const handlePointerLeave = () => {
    setScrubIdx(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let time = 0;

    const render = () => {
      if (!running) return;
      time += 0.03;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cell = Math.max(3, Math.round(w / 180));
      const cols = Math.floor(w / cell);
      const rows = Math.floor(h / cell);

      for (let c = 0; c < cols; c++) {
        const xFrac = c / cols;
        const sIdx = Math.min(days - 1, Math.floor(xFrac * days));
        const val = series[sIdx] ?? 0;
        const norm = val / maxVal;
        const curveH = norm * (h * (1 - TOP_HEADROOM / 100));
        const curveY = h - curveH;

        for (let r = 0; r < rows; r++) {
          const py = r * cell;
          if (py >= curveY) {
            const distFromCurve = (py - curveY) / (h - curveY);
            ctx.fillStyle = `rgba(37,99,235,${(0.15 + 0.65 * (1 - distFromCurve)).toFixed(2)})`;
            const size = cell * (0.4 + 0.3 * Math.sin(time + c * 0.1 + r * 0.1));
            ctx.fillRect(c * cell, py, size, size);
          }
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [days, maxVal, series]);

  return (
    <div
      className={cn(
        "flex w-full max-w-xl flex-col rounded-3xl border border-border bg-[#FAFAFB] p-2 dark:bg-card shadow-2xl",
        className,
      )}
    >
      {/* KPI Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">New members</span>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500">
            +629 ↑ 80%
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
          +{currentTotal.toLocaleString()}
        </div>
      </div>

      {/* Chart Card */}
      <div className="mt-2 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Members Growth ({days}D)
          </span>
          <span className="text-xs font-bold text-foreground">
            {scrubIdx !== null
              ? `Day ${scrubIdx + 1}: +${series[scrubIdx]} members`
              : "Scrub curve to inspect"}
          </span>
        </div>

        <div
          ref={scrubRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative h-[180px] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-border/60 bg-background/40"
        >
          <canvas ref={canvasRef} className="h-full w-full" />

          {/* Dual-axis Spring Marker */}
          {scrubIdx !== null && (
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
          )}
        </div>
      </div>

      {/* Range Selector Pill */}
      <div className="mt-2 flex items-center justify-center gap-1 rounded-full bg-muted/60 p-1">
        {([7, 14, 30, 90] as RangeDays[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays(d)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              days === d
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {d}D
          </button>
        ))}
      </div>
    </div>
  );
}
