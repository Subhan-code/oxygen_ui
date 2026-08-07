"use client";
// beui.dev/components/blocks/swipeable-list

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type SwipeSide = "left" | "right";

export type SwipeableListValue = {
  id: string;
  side: SwipeSide;
};

export type SwipeActionTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export type SwipeAction = {
  id: string;
  label: ReactNode;
  icon: ReactNode;
  tone?: SwipeActionTone;
  disabled?: boolean;
  onClick?: (item: SwipeableListItem) => void;
};

export type SwipeableListItem = {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  content?: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  disabled?: boolean;
};

export type SwipeableListClassNames = {
  root?: string;
  item?: string;
  rail?: string;
  action?: string;
  surface?: string;
  leading?: string;
  content?: string;
  title?: string;
  description?: string;
  meta?: string;
};

export interface SwipeableListProps {
  items: SwipeableListItem[];
  value?: SwipeableListValue | null;
  defaultValue?: SwipeableListValue | null;
  onValueChange?: (value: SwipeableListValue | null) => void;
  onAction?: (payload: {
    item: SwipeableListItem;
    action: SwipeAction;
    side: SwipeSide;
  }) => void;
  actionWidth?: number;
  revealThreshold?: number;
  closeOnAction?: boolean;
  className?: string;
  classNames?: SwipeableListClassNames;
  renderItem?: (item: SwipeableListItem) => ReactNode;
}

// Distance-based release spring keeps short rebounds and full reveals feeling
// equally direct, closer to native mobile list interactions.
const ROW_SETTLE = {
  type: "spring",
  stiffness: 560,
  damping: 48,
  mass: 0.82,
  restDelta: 0.5,
  restSpeed: 8,
} as const;
const OPEN_DISTANCE_RATIO = 0.46;
const CLOSE_DISTANCE_RATIO = 0.72;
const OPEN_VELOCITY = 720;
const CLOSE_VELOCITY = 320;
const FLING_DISTANCE = 14;
const RELEASE_VELOCITY_LIMIT = 1500;

const ACTION_TONE_CLASS: Record<SwipeActionTone, string> = {
  neutral: "text-muted-foreground group-hover:text-foreground",
  primary: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-destructive",
};

function useControllableSwipeValue({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: SwipeableListValue | null;
  defaultValue?: SwipeableListValue | null;
  onValueChange?: (value: SwipeableListValue | null) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const isControlled = value !== undefined;
  const currentValue = value ?? internalValue;

  const setValue = useCallback(
    (next: SwipeableListValue | null) => {
      if (!isControlled) {
        setInternalValue(next);
      }

      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return [currentValue, setValue] as const;
}

function isActionableSide(value: number, sideWidth: number) {
  return sideWidth > 0 && Math.abs(value) > 0;
}

function clampReleaseVelocity(velocity: number) {
  return Math.max(
    -RELEASE_VELOCITY_LIMIT,
    Math.min(RELEASE_VELOCITY_LIMIT, velocity),
  );
}

function SwipeActionButton({
  action,
  actionWidth,
  side,
  focusable,
  onAction,
  className,
}: {
  action: SwipeAction;
  actionWidth: number;
  side: SwipeSide;
  focusable: boolean;
  onAction: (action: SwipeAction, side: SwipeSide) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={action.disabled}
      tabIndex={focusable ? 0 : -1}
      aria-label={typeof action.label === "string" ? action.label : undefined}
      onClick={() => onAction(action, side)}
      className={cn(
        "group flex h-full shrink-0 items-center justify-center outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={{ width: actionWidth }}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full transition-[background-color,color,transform] duration-150 group-hover:bg-background group-active:scale-95",
          ACTION_TONE_CLASS[action.tone ?? "neutral"],
        )}
      >
        {action.icon}
      </span>
      <span className="sr-only">{action.label}</span>
    </button>
  );
}

export function SwipeableList({
  items,
  value,
  defaultValue = null,
  onValueChange,
  onAction,
  actionWidth = 72,
  revealThreshold = 0.4,
  closeOnAction = true,
  className,
  classNames,
  renderItem,
}: SwipeableListProps) {
  const [openValue, setOpenValue] = useControllableSwipeValue({
    value,
    defaultValue,
    onValueChange,
  });

  return (
    <div className={cn("flex w-full flex-col gap-2", className, classNames?.root)}>
      {items.map((item) => (
        <SwipeableListRow
          key={item.id}
          item={item}
          actionWidth={actionWidth}
          revealThreshold={revealThreshold}
          openValue={openValue}
          setOpenValue={setOpenValue}
          closeOnAction={closeOnAction}
          onAction={onAction}
          classNames={classNames}
          renderItem={renderItem}
        />
      ))}
    </div>
  );
}

function SwipeableListRow({
  item,
  actionWidth,
  revealThreshold,
  openValue,
  setOpenValue,
  closeOnAction,
  onAction,
  classNames,
  renderItem,
}: {
  item: SwipeableListItem;
  actionWidth: number;
  revealThreshold: number;
  openValue: SwipeableListValue | null;
  setOpenValue: (value: SwipeableListValue | null) => void;
  closeOnAction: boolean;
  onAction?: SwipeableListProps["onAction"];
  classNames?: SwipeableListClassNames;
  renderItem?: (item: SwipeableListItem) => ReactNode;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const animationRef = useRef<{ stop: () => void } | null>(null);
  const commandedTargetRef = useRef(0);
  const leftActions = item.leftActions ?? [];
  const rightActions = item.rightActions ?? [];
  const leftWidth = leftActions.length * actionWidth;
  const rightWidth = rightActions.length * actionWidth;
  const openSide = openValue?.id === item.id ? openValue.side : null;
  const targetX =
    openSide === "left"
      ? leftWidth
      : openSide === "right"
        ? -rightWidth
        : 0;

  useEffect(() => {
    if (animationRef.current) animationRef.current.stop();
    animationRef.current = animate(x, targetX, {
      type: "spring",
      stiffness: 400,
      damping: 35,
    });
  }, [openSide, targetX, x]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > leftWidth * 0.4 || velocity > 300) {
      if (leftActions.length > 0) setOpenValue({ id: item.id, side: "left" });
    } else if (offset < -rightWidth * 0.4 || velocity < -300) {
      if (rightActions.length > 0) setOpenValue({ id: item.id, side: "right" });
    } else {
      setOpenValue(null);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card",
        classNames?.item,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-between">
        <div className="flex h-full items-center" style={{ width: leftWidth }}>
          {leftActions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                act.onClick?.(item);
                setOpenValue(null);
              }}
              style={{ width: actionWidth }}
              className="flex h-full items-center justify-center font-semibold text-white bg-blue-600"
            >
              {act.label}
            </button>
          ))}
        </div>
        <div
          className="flex h-full items-center justify-end"
          style={{ width: rightWidth }}
        >
          {rightActions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                act.onClick?.(item);
                setOpenValue(null);
              }}
              style={{ width: actionWidth }}
              className={cn(
                "flex h-full items-center justify-center font-semibold text-white",
                act.tone === "danger"
                  ? "bg-red-600"
                  : "bg-zinc-700",
              )}
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -rightWidth, right: leftWidth }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 bg-card p-4 text-foreground cursor-grab active:cursor-grabbing"
      >
        {renderItem ? (
          renderItem(item)
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}