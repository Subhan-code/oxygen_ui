"use client";
// beui.dev/components/motion/pipeline-board

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BoardStage = {
  id: string;
  title: string;
  count?: number;
};

export type BoardCard = {
  id: string;
  stage: string;
  title: string;
  description?: string;
  tag?: string;
  value?: string;
};

const DEFAULT_STAGES: BoardStage[] = [
  { id: "lead", title: "To call", count: 3 },
  { id: "contacted", title: "In progress", count: 4 },
  { id: "proposal", title: "Proposal sent", count: 2 },
  { id: "won", title: "Deal won", count: 5 },
];

const DEFAULT_CARDS: BoardCard[] = [
  {
    id: "card-1",
    stage: "lead",
    title: "Draggable button",
    description: "Some description text that sits under the title and carries weight.",
    tag: "Design",
    value: "$4,200",
  },
  {
    id: "card-2",
    stage: "lead",
    title: "Op grid layout",
    description: "Grid component with animated item rearrangement.",
    tag: "UI",
    value: "$1,800",
  },
  {
    id: "card-3",
    stage: "lead",
    title: "Island avatar",
    description: "Dynamic island style avatar stack.",
    tag: "Avatar",
    value: "$950",
  },
  {
    id: "card-4",
    stage: "contacted",
    title: "Pipeline board",
    description: "Kanban and stacked list drag & drop board.",
    tag: "Board",
    value: "$8,500",
  },
  {
    id: "card-5",
    stage: "contacted",
    title: "Animated icons",
    description: "Bezier morphing SVG icon pack.",
    tag: "Icons",
    value: "$3,100",
  },
  {
    id: "card-6",
    stage: "proposal",
    title: "Gooey dropdown",
    description: "Liquid drop sheet transform with surface tension.",
    tag: "Motion",
    value: "$6,400",
  },
  {
    id: "card-7",
    stage: "won",
    title: "Member dialog",
    description: "Concentric corner dialog with glow and glossy CTAs.",
    tag: "Modal",
    value: "$12,000",
  },
];

const TILT_AT = 800;
const TILT_MAX = 8;
const LAND_EASE = [0.25, 0.7, 0.2, 1] as const;

export interface PipelineBoardProps {
  stages?: BoardStage[];
  initialCards?: BoardCard[];
  view?: "board" | "list";
  onCardsChange?: (cards: BoardCard[]) => void;
  className?: string;
}

export function PipelineBoard({
  stages = DEFAULT_STAGES,
  initialCards = DEFAULT_CARDS,
  view: initialView = "board",
  onCardsChange,
  className,
}: PipelineBoardProps) {
  const [cards, setCards] = useState<BoardCard[]>(initialCards);
  const [view, setView] = useState<"board" | "list">(initialView);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [targetSlot, setTargetSlot] = useState<{
    stage: string;
    index: number;
  } | null>(null);

  const reduce = useReducedMotion() ?? false;
  const boardRef = useRef<HTMLDivElement>(null);

  const screenX = useMotionValue(0);
  const vx = useVelocity(screenX);
  const tiltRaw = useTransform(vx, [-TILT_AT, TILT_AT], [-TILT_MAX, TILT_MAX], {
    clamp: true,
  });
  const tiltSpring = useSpring(tiltRaw, { stiffness: 300, damping: 30, mass: 0.6 });
  const tiltGain = useMotionValue(1);
  const tilt = useTransform(() => (reduce ? 0 : tiltSpring.get() * tiltGain.get()));

  const handleCardDragStart = (id: string, e: React.PointerEvent) => {
    setDraggedCardId(id);
    tiltGain.set(1);
  };

  const handleCardMove = (e: React.PointerEvent) => {
    if (!draggedCardId || !boardRef.current) return;
    screenX.set(e.clientX);
    const rect = boardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (view === "board") {
      const colWidth = rect.width / stages.length;
      const colIndex = Math.max(
        0,
        Math.min(stages.length - 1, Math.floor(px / colWidth)),
      );
      const stage = stages[colIndex];
      const stageCards = cards.filter((c) => c.stage === stage.id);
      const cardHeight = 80;
      const cardIndex = Math.max(
        0,
        Math.min(stageCards.length, Math.floor(py / cardHeight)),
      );

      setTargetSlot({ stage: stage.id, index: cardIndex });
    } else {
      const rowHeight = 70;
      const stageIndex = Math.max(
        0,
        Math.min(stages.length - 1, Math.floor(py / (rowHeight * 3))),
      );
      const stage = stages[stageIndex];
      setTargetSlot({ stage: stage.id, index: 0 });
    }
  };

  const handleCardDragEnd = () => {
    if (draggedCardId && targetSlot) {
      setCards((prev) => {
        const next = prev.map((c) =>
          c.id === draggedCardId ? { ...c, stage: targetSlot.stage } : c,
        );
        onCardsChange?.(next);
        return next;
      });
    }
    setDraggedCardId(null);
    setTargetSlot(null);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-4xl flex-col rounded-3xl border border-border bg-card p-6 shadow-xl",
        className,
      )}
    >
      {/* Header controls */}
      <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pipeline Board
          </p>
          <h3 className="text-xl font-bold text-foreground">Kanban & List View</h3>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setView("board")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              view === "board"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Board (Kanban)
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              view === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            List
          </button>
        </div>
      </div>

      {/* Board container */}
      <div
        ref={boardRef}
        onPointerMove={handleCardMove}
        onPointerUp={handleCardDragEnd}
        className={cn(
          "relative min-h-[380px] w-full gap-4 transition-all duration-300",
          view === "board"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "flex flex-col gap-6",
        )}
      >
        {stages.map((stage) => {
          const stageCards = cards.filter((c) => c.stage === stage.id);
          const isTargetStage = targetSlot?.stage === stage.id;

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl border border-border/60 bg-background/50 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {stage.title}
                  </span>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {stageCards.length}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {stageCards.map((card, idx) => {
                  const isDragging = draggedCardId === card.id;

                  return (
                    <motion.div
                      key={card.id}
                      layout
                      onPointerDown={(e) => handleCardDragStart(card.id, e)}
                      style={{ rotateZ: isDragging ? tilt : 0 }}
                      whileHover={{ scale: isDragging ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group relative cursor-grab rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all active:cursor-grabbing",
                        isDragging && "opacity-40 border-blue-500/50 shadow-lg",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          {card.title}
                        </span>
                        {card.value && (
                          <span className="text-xs font-bold text-emerald-500">
                            {card.value}
                          </span>
                        )}
                      </div>
                      {card.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {card.description}
                        </p>
                      )}
                      {card.tag && (
                        <div className="mt-3">
                          <span className="inline-block rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500 dark:bg-blue-500/20">
                            {card.tag}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Drop Hole Slot indicator */}
                {isTargetStage && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 72 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border-2 border-dashed border-blue-500/40 bg-blue-500/5"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
