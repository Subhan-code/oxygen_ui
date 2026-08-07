"use client";
// beui.dev/components/motion/members-plan-donut-chart

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type PlanPeriod = "Week" | "Month" | "Quarter" | "Year";

export type PlanItem = {
  id: string;
  label: string;
  color: string;
  base: number;
};

const PLANS: PlanItem[] = [
  { id: "unlimited", label: "Unlimited", color: "#2563EB", base: 1240 },
  { id: "pass", label: "30-day pass", color: "#4C7BEF", base: 980 },
  { id: "pack", label: "10-class pack", color: "#6E96F3", base: 620 },
  { id: "dropin", label: "Drop-in", color: "#93B4F6", base: 410 },
  { id: "student", label: "Student", color: "#AFC7F9", base: 300 },
];

const PERIOD_MULTIPLIERS: Record<PlanPeriod, number> = {
  Week: 0.42,
  Month: 1.0,
  Quarter: 2.6,
  Year: 8.4,
};

const PERIODS: PlanPeriod[] = ["Week", "Month", "Quarter", "Year"];

function computeValues(period: PlanPeriod) {
  const mult = PERIOD_MULTIPLIERS[period];
  const pIdx = PERIODS.indexOf(period);

  return PLANS.map((plan, i) => {
    const w = 0.78 + 0.4 * (0.5 + 0.5 * Math.sin(i * 1.9 + pIdx * 1.3));
    const val = Math.round(plan.base * mult * w);
    return { ...plan, value: val };
  });
}

export interface MembersPlanDonutChartProps {
  defaultPeriod?: PlanPeriod;
  className?: string;
}

export function MembersPlanDonutChart({
  defaultPeriod = "Month",
  className,
}: MembersPlanDonutChartProps) {
  const [period, setPeriod] = useState<PlanPeriod>(defaultPeriod);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const planData = computeValues(period);
  const grandTotal = planData.reduce((acc, p) => acc + p.value, 0);
  const shares = planData.map((p) => (grandTotal > 0 ? p.value / grandTotal : 0));

  const fromRef = useRef<number[]>(shares);
  const targetRef = useRef<number[]>(shares);
  const dispRef = useRef<number[]>(shares);
  const morphRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  const changePeriod = (p: PlanPeriod) => {
    if (p === period) return;
    fromRef.current = dispRef.current.slice();
    targetRef.current = computeValues(p).map((pl) =>
      computeValues(p).reduce((a, b) => a + b.value, 0) > 0
        ? pl.value / computeValues(p).reduce((a, b) => a + b.value, 0)
        : 0,
    );
    morphRef.current = true;
    startTimeRef.current = performance.now();
    setPeriod(p);
    setHoveredId(null);
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
      const size = Math.min(rect.width, rect.height) || 200;

      canvas.width = Math.ceil(size * dpr);
      canvas.height = Math.ceil(size * dpr);

      ctx.save();
      ctx.scale((size / 200) * dpr, (size / 200) * dpr);
      ctx.clearRect(0, 0, 200, 200);

      const elapsed = now - startTimeRef.current;
      const duration = 500;
      const prog = morphRef.current ? Math.min(1, elapsed / duration) : 1;

      if (prog >= 1) {
        morphRef.current = false;
      }

      const e = 1 - Math.pow(2, -10 * prog);
      dispRef.current = targetRef.current.map(
        (t, i) => (fromRef.current[i] ?? 0) + (t - (fromRef.current[i] ?? 0)) * e,
      );

      const cx = 100;
      const cy = 100;
      const outerR = 86;
      const innerR = 55;
      const gapRad = 0.07;

      let startAngle = -Math.PI / 2;

      dispRef.current.forEach((share, idx) => {
        const sweepAngle = share * Math.PI * 2;
        const endAngle = startAngle + sweepAngle;
        const actualStart = startAngle + gapRad / 2;
        const actualEnd = endAngle - gapRad / 2;
        const plan = PLANS[idx];
        const isHovered = hoveredId === plan.id;
        const isAnyHovered = hoveredId !== null;

        if (actualEnd > actualStart) {
          ctx.save();

          const midAngle = (actualStart + actualEnd) / 2;
          if (isHovered) {
            const shiftX = Math.cos(midAngle) * 6;
            const shiftY = Math.sin(midAngle) * 6;
            ctx.translate(shiftX, shiftY);
            ctx.shadowColor = plan.color;
            ctx.shadowBlur = 10;
          }

          ctx.beginPath();
          ctx.arc(cx, cy, outerR, actualStart, actualEnd, false);
          ctx.arc(cx, cy, innerR, actualEnd, actualStart, true);
          ctx.closePath();

          let alpha = 0.72;
          if (isAnyHovered) {
            alpha = isHovered ? 1.0 : 0.216;
          }

          ctx.globalAlpha = alpha;
          ctx.fillStyle = plan.color;
          ctx.fill();

          ctx.clip();
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          const cell = 4.6;

          for (let px = cx - outerR; px <= cx + outerR; px += cell) {
            for (let py = cy - outerR; py <= cy + outerR; py += cell) {
              const dist = Math.hypot(px - cx, py - cy);
              if (dist >= innerR && dist <= outerR) {
                const angle = Math.atan2(py - cy, px - cx);
                let normAngle = angle;
                if (normAngle < -Math.PI / 2) normAngle += Math.PI * 2;

                if (normAngle >= actualStart && normAngle <= actualEnd) {
                  const fullness = (dist - innerR) / (outerR - innerR);
                  const wave =
                    0.5 +
                    0.5 *
                      Math.sin(
                        timeRef.current + px * 0.1 + Math.cos(py * 0.1),
                      );
                  const tileSize =
                    cell *
                    ((isHovered ? 0.46 : 0.34) +
                      0.36 * fullness +
                      0.26 * wave);
                  ctx.fillRect(px, py, tileSize, tileSize);
                }
              }
            }
          }

          ctx.restore();
        }

        startAngle = endAngle;
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [hoveredId, period]);

  return (
    <div
      className={cn(
        "flex w-full max-w-2xl flex-col rounded-3xl border border-border bg-card p-6 shadow-xl",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Members by plan
          </p>
          <h3 className="text-xl font-bold text-foreground">
            Plan Distribution
          </h3>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => changePeriod(p)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                period === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main body */}
      <div className="my-6 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* Ring Canvas */}
        <div className="relative flex h-[220px] w-full items-center justify-center">
          <canvas
            ref={canvasRef}
            className="h-[200px] w-[200px] cursor-pointer"
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {grandTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              total members
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {planData.map((plan) => {
            const isHovered = hoveredId === plan.id;
            const isAnyHovered = hoveredId !== null;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredId(plan.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all duration-150",
                  isHovered
                    ? "bg-blue-500/10 dark:bg-blue-500/20"
                    : isAnyHovered
                      ? "opacity-40"
                      : "hover:bg-muted/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-sm shadow-sm"
                    style={{ backgroundColor: plan.color }}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {plan.label}
                  </span>
                </div>

                <span className="font-mono text-sm font-bold text-foreground">
                  {plan.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
