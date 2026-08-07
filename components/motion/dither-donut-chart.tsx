"use client";
// beui.dev/components/motion/dither-donut-chart

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type PeriodKey = "1D" | "1W" | "1M" | "1Y" | "ALL";

export type SliceData = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type PeriodData = {
  label: string;
  total: number;
  slices: SliceData[];
};

const DEFAULT_PERIODS: Record<PeriodKey, PeriodData> = {
  "1D": {
    label: "24h Volume",
    total: 142580,
    slices: [
      { id: "sol", label: "SOL", value: 64161, color: "#9945FF" },
      { id: "usdc", label: "USDC", value: 39922, color: "#2775CA" },
      { id: "bonk", label: "BONK", value: 21387, color: "#FFA500" },
      { id: "jup", label: "JUP", value: 17110, color: "#34D399" },
    ],
  },
  "1W": {
    label: "7d Volume",
    total: 984200,
    slices: [
      { id: "sol", label: "SOL", value: 492100, color: "#9945FF" },
      { id: "usdc", label: "USDC", value: 295260, color: "#2775CA" },
      { id: "bonk", label: "BONK", value: 118104, color: "#FFA500" },
      { id: "jup", label: "JUP", value: 78736, color: "#34D399" },
    ],
  },
  "1M": {
    label: "30d Volume",
    total: 4210000,
    slices: [
      { id: "sol", label: "SOL", value: 1894500, color: "#9945FF" },
      { id: "usdc", label: "USDC", value: 1473500, color: "#2775CA" },
      { id: "bonk", label: "BONK", value: 505200, color: "#FFA500" },
      { id: "jup", label: "JUP", value: 336800, color: "#34D399" },
    ],
  },
  "1Y": {
    label: "1y Volume",
    total: 48500000,
    slices: [
      { id: "sol", label: "SOL", value: 26675000, color: "#9945FF" },
      { id: "usdc", label: "USDC", value: 14550000, color: "#2775CA" },
      { id: "bonk", label: "BONK", value: 4365000, color: "#FFA500" },
      { id: "jup", label: "JUP", value: 2910000, color: "#34D399" },
    ],
  },
  ALL: {
    label: "All-Time Volume",
    total: 124800000,
    slices: [
      { id: "sol", label: "SOL", value: 68640000, color: "#9945FF" },
      { id: "usdc", label: "USDC", value: 34944000, color: "#2775CA" },
      { id: "bonk", label: "BONK", value: 12480000, color: "#FFA500" },
      { id: "jup", label: "JUP", value: 8736000, color: "#34D399" },
    ],
  },
};

const PERIOD_KEYS: PeriodKey[] = ["1D", "1W", "1M", "1Y", "ALL"];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function sharesFromData(slices: SliceData[]): number[] {
  const sum = slices.reduce((acc, s) => acc + s.value, 0);
  if (sum === 0) return slices.map(() => 1 / slices.length);
  return slices.map((s) => s.value / sum);
}

export interface DitherDonutChartProps {
  periods?: Record<PeriodKey, PeriodData>;
  defaultPeriod?: PeriodKey;
  className?: string;
}

export function DitherDonutChart({
  periods = DEFAULT_PERIODS,
  defaultPeriod = "1D",
  className,
}: DitherDonutChartProps) {
  const [activePeriod, setActivePeriod] = useState<PeriodKey>(defaultPeriod);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const periodData = periods[activePeriod];
  const slices = periodData.slices;

  const targetRef = useRef<number[]>(sharesFromData(slices));
  const fromRef = useRef<number[]>(sharesFromData(slices));
  const dispRef = useRef<number[]>(sharesFromData(slices));
  const morphRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const ditherOffsetRef = useRef<number>(0);

  const changePeriod = (key: PeriodKey) => {
    if (key === activePeriod) return;
    const newShares = sharesFromData(periods[key].slices);
    fromRef.current = dispRef.current.slice();
    targetRef.current = newShares;
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

      ditherOffsetRef.current = (time / 40) % 16;

      if (morphRef.current) {
        const elapsed = time - startTimeRef.current;
        const duration = 500;
        const prog = Math.min(1, elapsed / duration);
        const e = 1 - Math.pow(2, -10 * prog);

        dispRef.current = targetRef.current.map(
          (to, i) => fromRef.current[i] + (to - fromRef.current[i]) * e,
        );

        if (prog >= 1) {
          morphRef.current = false;
        }
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const outerR = Math.min(width, height) / 2 - 16;
      const innerR = outerR * 0.58;
      const cornerR = 8;

      const currentShares = dispRef.current;
      const totalShares = currentShares.reduce((a, b) => a + b, 0) || 1;

      let startAngle = -Math.PI / 2;

      currentShares.forEach((share, idx) => {
        const angleSpan = (share / totalShares) * Math.PI * 2;
        const endAngle = startAngle + angleSpan;
        const sliceInfo = slices[idx];

        if (angleSpan <= 0.001) {
          startAngle = endAngle;
          return;
        }

        const isHovered = hoveredIdx === idx;
        const isAnyHovered = hoveredIdx !== null;
        const alpha = isAnyHovered ? (isHovered ? 1.0 : 0.3) : 1.0;

        const midAngle = startAngle + angleSpan / 2;
        const shiftX = isHovered ? Math.cos(midAngle) * 6 : 0;
        const shiftY = isHovered ? Math.sin(midAngle) * 6 : 0;

        ctx.save();
        ctx.translate(cx + shiftX, cy + shiftY);
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(0, 0, outerR, startAngle + 0.02, endAngle - 0.02, false);
        ctx.arc(0, 0, innerR, endAngle - 0.02, startAngle + 0.02, true);
        ctx.closePath();

        ctx.fillStyle = sliceInfo ? sliceInfo.color : "#666";
        ctx.fill();

        ctx.save();
        ctx.clip();

        const tileSize = isHovered ? 6 : 4;
        const ditherStep = tileSize * 2;
        const off = ditherOffsetRef.current;

        ctx.fillStyle = "rgba(0,0,0,0.18)";
        for (let x = -outerR; x <= outerR; x += ditherStep) {
          for (let y = -outerR; y <= outerR; y += ditherStep) {
            const shift = (Math.floor((x + y) / ditherStep) % 2) * tileSize;
            ctx.fillRect(
              x + ((off + shift) % ditherStep),
              y,
              tileSize,
              tileSize,
            );
          }
        }
        ctx.restore();

        if (isHovered) {
          ctx.strokeStyle = sliceInfo ? sliceInfo.color : "#fff";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = sliceInfo ? sliceInfo.color : "#000";
          ctx.shadowBlur = 12;
          ctx.stroke();
        } else {
          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
        startAngle = endAngle;
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hoveredIdx, slices]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const dist = Math.sqrt(x * x + y * y);
      const outerR = Math.min(rect.width, rect.height) / 2 - 16;
      const innerR = outerR * 0.58;

      if (dist < innerR || dist > outerR + 10) {
        setHoveredIdx(null);
        return;
      }

      let mouseAngle = Math.atan2(y, x);
      if (mouseAngle < -Math.PI / 2) {
        mouseAngle += Math.PI * 2;
      }

      const currentShares = dispRef.current;
      const totalShares = currentShares.reduce((a, b) => a + b, 0) || 1;
      let startAngle = -Math.PI / 2;

      for (let idx = 0; idx < currentShares.length; idx++) {
        const angleSpan = (currentShares[idx] / totalShares) * Math.PI * 2;
        const endAngle = startAngle + angleSpan;

        if (mouseAngle >= startAngle && mouseAngle < endAngle) {
          setHoveredIdx(idx);
          return;
        }
        startAngle = endAngle;
      }

      setHoveredIdx(null);
    },
    [],
  );

  const handleMouseLeave = () => setHoveredIdx(null);

  return (
    <div
      className={cn(
        "flex w-full max-w-[420px] flex-col rounded-3xl border border-border bg-card p-6 shadow-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Volume Allocation
          </p>
          <h3 className="text-lg font-bold text-foreground">
            Dither Donut Chart
          </h3>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          {PERIOD_KEYS.map((key) => (
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

      <div className="relative my-4 flex h-[280px] w-full items-center justify-center">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="h-full w-full cursor-pointer"
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePeriod}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {hoveredIdx !== null && slices[hoveredIdx]
                  ? slices[hoveredIdx].label
                  : periodData.label}
              </p>
              <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {hoveredIdx !== null && slices[hoveredIdx]
                  ? formatCurrency(slices[hoveredIdx].value)
                  : formatCurrency(periodData.total)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx;
          const sharePct = (
            ((dispRef.current[idx] ?? 0) /
              (dispRef.current.reduce((a, b) => a + b, 0) || 1)) *
            100
          ).toFixed(1);

          return (
            <div
              key={slice.id}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={cn(
                "flex items-center justify-between rounded-xl border p-2.5 transition-all cursor-pointer",
                isHovered
                  ? "border-foreground/30 bg-accent/60"
                  : "border-border/60 bg-background/50 hover:bg-accent/30",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-xs font-semibold text-foreground">
                  {slice.label}
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {sharePct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
