"use client";
// beui.dev/components/motion/payments-bar-chart

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type PaymentPeriod = "Week" | "Month" | "Quarter" | "Year";

export type PaymentBranch = {
  id: string;
  name: string;
  seed: number;
};

const BRANCHES: PaymentBranch[] = [
  { id: "bishkek", name: "Bishkek", seed: 1 },
  { id: "osh", name: "Osh", seed: 2 },
  { id: "jalalabad", name: "Jalal-Abad", seed: 3 },
  { id: "karakol", name: "Karakol", seed: 4 },
];

const PERIOD_MULTIPLIERS: Record<PaymentPeriod, number> = {
  Week: 1,
  Month: 4,
  Quarter: 13,
  Year: 52,
};

const BANDS = [
  { key: "cash", label: "Cash", color: "#2563EB", share: 0.46 },
  { key: "qr", label: "QR", color: "#6E96F3", share: 0.31 },
  { key: "bank", label: "Bank", color: "#AFC7F9", share: 0.23 },
];

function computeBranchData(period: PaymentPeriod) {
  const mult = PERIOD_MULTIPLIERS[period];
  const baseTotal = 14500;

  return BRANCHES.map((b) => {
    const bands = BANDS.map((band, idx) => {
      const wobble = 0.9 + 0.14 * Math.sin(b.seed * 3.1 + idx * 1.7);
      const val = Math.round(baseTotal * mult * band.share * wobble * 0.25);
      return { ...band, value: val };
    });
    const total = bands.reduce((acc, band) => acc + band.value, 0);
    return { ...b, bands, total };
  });
}

export interface PaymentsBarChartProps {
  defaultPeriod?: PaymentPeriod;
  className?: string;
}

export function PaymentsBarChart({
  defaultPeriod = "Month",
  className,
}: PaymentsBarChartProps) {
  const [period, setPeriod] = useState<PaymentPeriod>(defaultPeriod);
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  const [hoveredBandKey, setHoveredBandKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const branchData = computeBranchData(period);
  const totalProcessed = branchData.reduce((acc, b) => acc + b.total, 0);

  const drawnHeightsRef = useRef<Map<string, number>>(new Map());
  const fromHeightsRef = useRef<Map<string, number>>(new Map());
  const morphRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  const changePeriod = (p: PaymentPeriod) => {
    if (p === period) return;
    fromHeightsRef.current = new Map(drawnHeightsRef.current);
    morphRef.current = true;
    startTimeRef.current = performance.now();
    setPeriod(p);
    setHoveredBranchId(null);
    setHoveredBandKey(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = (now: number) => {
      if (!running) return;

      timeRef.current += 0.02;

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

      const elapsed = now - startTimeRef.current;
      const duration = 620;
      const prog = morphRef.current ? Math.min(1, elapsed / duration) : 1;

      if (prog >= 1) morphRef.current = false;

      const nCols = branchData.length;
      const colWidth = w / nCols;
      const barWidth = Math.min(colWidth * 0.62, 54);
      const bottomY = h - 28;

      const maxVal = Math.max(...branchData.map((b) => b.total), 1);
      const maxBarH = h - 60;

      branchData.forEach((b, colIdx) => {
        const x0 = colWidth * colIdx + (colWidth - barWidth) / 2;
        const colStagger = colIdx * 0.05 * duration;
        const colElapsed = Math.max(0, elapsed - colStagger);
        const colProg = morphRef.current
          ? Math.min(1, colElapsed / (duration * 0.95))
          : 1;

        const easeOutCubic = 1 - Math.pow(1 - colProg, 3);

        let currentY = bottomY;

        b.bands.forEach((band, bandIdx) => {
          const key = `${b.id}-${band.key}`;
          const targetH = (band.value / maxVal) * maxBarH;
          const fromH = fromHeightsRef.current.get(key) ?? 0;
          const segH = fromH + (targetH - fromH) * easeOutCubic;
          drawnHeightsRef.current.set(key, segH);

          if (segH > 1) {
            ctx.save();

            const isBranchHovered = hoveredBranchId === b.id;
            const isBandHovered = isBranchHovered && hoveredBandKey === band.key;
            const isAnyHovered = hoveredBranchId !== null;

            let alpha = 1.0;
            if (isAnyHovered) {
              if (isBranchHovered) {
                alpha = isBandHovered ? 1.0 : 0.48;
              } else {
                alpha = 0.3;
              }
            }

            const hot = isBandHovered;
            const color = hot ? "#2563EB" : band.color;

            const yTop = currentY - segH;
            ctx.beginPath();

            const rBottom = bandIdx === 0 ? 7 : 5;
            const rTop = bandIdx === b.bands.length - 1 ? 8 : 5;

            ctx.roundRect(x0, yTop, barWidth, segH, [
              rTop,
              rTop,
              rBottom,
              rBottom,
            ]);
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.fill();

            ctx.clip();
            ctx.fillStyle = "rgba(255,255,255,0.22)";
            const cell = Math.max(3, Math.round(w / 200));

            for (let px = x0; px <= x0 + barWidth; px += cell) {
              for (let py = yTop; py <= currentY; py += cell) {
                const fullness = (currentY - py) / segH;
                const wave =
                  0.5 +
                  0.5 *
                    Math.sin(
                      timeRef.current + px * 0.08 + Math.cos(py * 0.08),
                    );
                const tileSize =
                  cell *
                  ((hot ? 0.48 : 0.34) + 0.36 * fullness + 0.26 * wave);
                ctx.fillRect(px, py, tileSize, tileSize);
              }
            }

            if (hot) {
              ctx.strokeStyle = "#2563EB";
              ctx.lineWidth = 1.75;
              ctx.shadowColor = "#2563EB";
              ctx.shadowBlur = 10;
              ctx.stroke();
            }

            ctx.restore();
          }

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
  }, [branchData, hoveredBandKey, hoveredBranchId, period]);

  return (
    <div
      className={cn(
        "flex w-full max-w-2xl flex-col rounded-3xl border border-border bg-[#FAFAFB] p-2 dark:bg-card shadow-2xl",
        className,
      )}
    >
      {/* Top Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Payments</span>
          <span className="text-xs font-semibold text-muted-foreground">
            This {period.toLowerCase()}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            ${totalProcessed.toLocaleString()}
          </span>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500 dark:bg-blue-500/20">
            {hoveredBranchId
              ? BRANCHES.find((b) => b.id === hoveredBranchId)?.name
              : "↑ 14%"}
          </span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {hoveredBranchId
            ? `at ${BRANCHES.find((b) => b.id === hoveredBranchId)?.name} this ${period.toLowerCase()}`
            : `processed this ${period.toLowerCase()}`}
        </p>
      </div>

      {/* Bottom Chart Card */}
      <div className="mt-2 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        {/* Legend */}
        <div className="mb-4 flex items-center gap-4">
          {BANDS.map((b) => (
            <div
              key={b.key}
              onMouseEnter={() => setHoveredBandKey(b.key)}
              onMouseLeave={() => setHoveredBandKey(null)}
              className={cn(
                "flex cursor-pointer items-center gap-2 transition-opacity",
                hoveredBandKey && hoveredBandKey !== b.key ? "opacity-40" : "opacity-100",
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: b.color }}
              />
              <span className="text-xs font-semibold text-muted-foreground">
                {b.label}
              </span>
            </div>
          ))}
        </div>

        {/* Canvas Plot */}
        <div className="relative h-[200px] w-full">
          <canvas ref={canvasRef} className="h-full w-full cursor-pointer" />
        </div>

        {/* Branch X-Axis Labels */}
        <div className="mt-2 grid grid-cols-4 text-center text-xs font-semibold text-muted-foreground">
          {BRANCHES.map((b) => (
            <span
              key={b.id}
              onMouseEnter={() => setHoveredBranchId(b.id)}
              onMouseLeave={() => setHoveredBranchId(null)}
              className={cn(
                "cursor-pointer transition-colors",
                hoveredBranchId === b.id ? "text-foreground font-bold" : "",
              )}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      {/* Period Switcher */}
      <div className="mt-2 flex items-center justify-center gap-1 rounded-full bg-muted/60 p-1">
        {(["Week", "Month", "Quarter", "Year"] as PaymentPeriod[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => changePeriod(p)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              period === p
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
