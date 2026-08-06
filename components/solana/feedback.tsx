"use client";

import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { useEffect, useState } from "react";
import { SPRING_PANEL, SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

// ─── LoadingSpinner ────────────────────────────────────────────────────────────

export type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-accent", sizeMap[size])} />
      {label && (
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

// ─── SkeletonCard ──────────────────────────────────────────────────────────────

export type SkeletonCardProps = {
  variant?: "token" | "nft" | "transaction" | "stat";
  className?: string;
};

export function SkeletonCard({ variant = "token", className }: SkeletonCardProps) {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  if (variant === "nft") {
    return (
      <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card w-64", className)}>
        <div className={cn("aspect-square w-full bg-muted", shimmer)} />
        <div className="flex flex-col gap-2 p-3.5">
          <div className={cn("h-3 w-16 rounded-full bg-muted", shimmer)} />
          <div className={cn("h-4 w-32 rounded-full bg-muted", shimmer)} />
          <div className={cn("mt-1 h-3 w-24 rounded-full bg-muted", shimmer)} />
        </div>
      </div>
    );
  }

  if (variant === "transaction") {
    return (
      <div className={cn("flex flex-col gap-2.5 rounded-2xl border border-border bg-card/60 p-4 w-full max-w-md", className)}>
        <div className="flex items-center justify-between">
          <div className={cn("h-4 w-40 rounded-full bg-muted", shimmer)} />
          <div className={cn("h-5 w-20 rounded-full bg-muted", shimmer)} />
        </div>
        <div className={cn("h-3 w-32 rounded-full bg-muted", shimmer)} />
        <div className="flex gap-4 mt-1">
          <div className={cn("h-3 w-20 rounded-full bg-muted", shimmer)} />
          <div className={cn("h-3 w-16 rounded-full bg-muted", shimmer)} />
        </div>
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div className={cn("flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 w-64", className)}>
        <div className={cn("h-3 w-24 rounded-full bg-muted", shimmer)} />
        <div className={cn("h-8 w-32 rounded-xl bg-muted", shimmer)} />
        <div className={cn("h-3 w-16 rounded-full bg-muted", shimmer)} />
      </div>
    );
  }

  // token (default)
  return (
    <div className={cn("flex items-center justify-between rounded-xl border border-border bg-card/40 p-3.5 w-full max-w-md", className)}>
      <div className="flex items-center gap-3">
        <div className={cn("h-8 w-8 rounded-full bg-muted", shimmer)} />
        <div className="flex flex-col gap-1.5">
          <div className={cn("h-3.5 w-16 rounded-full bg-muted", shimmer)} />
          <div className={cn("h-3 w-24 rounded-full bg-muted", shimmer)} />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className={cn("h-3.5 w-20 rounded-full bg-muted", shimmer)} />
        <div className={cn("h-3 w-14 rounded-full bg-muted", shimmer)} />
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_PRESS}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 py-14 px-6 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-xs">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </motion.div>
  );
}

// ─── ErrorState ───────────────────────────────────────────────────────────────

export type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_PRESS}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 py-12 px-6 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          transition={SPRING_PRESS}
          onClick={onRetry}
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── SuccessState ─────────────────────────────────────────────────────────────

export type SuccessStateProps = {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SuccessState({
  title = "Transaction confirmed",
  message = "Your Solana transaction has been finalized on-chain.",
  action,
  className,
}: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_PANEL}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-accent/30 bg-accent/5 py-12 px-6 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING_PRESS, delay: 0.1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/15"
      >
        <CheckCircle2 className="h-7 w-7 text-accent" />
      </motion.div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{message}</p>
      </div>
      {action}
    </motion.div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastProps = {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
  duration?: number;
  className?: string;
};

const TOAST_CONFIG: Record<ToastVariant, { icon: React.ReactNode; border: string; bg: string }> = {
  info: {
    icon: <Info className="h-4 w-4 text-blue-400" />,
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-accent" />,
    border: "border-accent/30",
    bg: "bg-accent/10",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-warning" />,
    border: "border-warning/30",
    bg: "bg-warning/10",
  },
  error: {
    icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
    border: "border-destructive/30",
    bg: "bg-destructive/10",
  },
};

export function Toast({
  variant = "info",
  title,
  description,
  onDismiss,
  duration = 4000,
  className,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const config = TOAST_CONFIG[variant];

  useEffect(() => {
    if (duration === 0) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={SPRING_PANEL}
          className={cn(
            "flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md",
            config.border,
            config.bg,
            "bg-card/90",
            className
          )}
        >
          <div className="mt-0.5 shrink-0">{config.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={() => { setVisible(false); setTimeout(() => onDismiss(), 300); }}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── ToastStack ───────────────────────────────────────────────────────────────

export type ToastItem = {
  id: string;
  variant?: ToastVariant;
  title: string;
  description?: string;
};

export type ToastStackProps = {
  toasts?: ToastItem[];
  onDismiss?: (id: string) => void;
  className?: string;
};

const DEFAULT_TOASTS: ToastItem[] = [
  { id: "1", variant: "success", title: "Transaction finalized", description: "Swap 1.35 SOL → 250 USDC confirmed on-chain." },
  { id: "2", variant: "info", title: "Airdrop detected", description: "You received 100 JUP from Jupuary drop." },
  { id: "3", variant: "warning", title: "High network congestion", description: "Consider raising your priority fee." },
];

export function ToastStack({
  toasts = DEFAULT_TOASTS,
  onDismiss,
  className,
}: ToastStackProps) {
  const [items, setItems] = useState(toasts);

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    onDismiss?.(id);
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full max-w-sm", className)}>
      <AnimatePresence mode="popLayout">
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 40, scale: 0.94 }}
            transition={SPRING_PANEL}
          >
            <Toast
              variant={t.variant}
              title={t.title}
              description={t.description}
              onDismiss={() => dismiss(t.id)}
              duration={0}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
