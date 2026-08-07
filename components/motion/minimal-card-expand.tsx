"use client";

// beui.dev/components/motion/minimal-card-expand
// Inspired by Family App & Skiper UI (skiper23) - Minimal Card Expand

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  Anchor,
  Bookmark,
  Check,
  Cloud,
  Copy,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type WalletCardItem = {
  id: string;
  name: string;
  balance: string;
  address?: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  subtextColor: string;
  buttonBg?: string;
};

const DEFAULT_CARDS: WalletCardItem[] = [
  {
    id: "gxuri",
    name: "Gxuri",
    balance: "1.03 ETH",
    address: "0x71C...3F9b",
    icon: Sparkles,
    bgColor: "bg-[#a845ff]", // Vibrant Family-style purple
    textColor: "text-white",
    subtextColor: "text-white/80",
    buttonBg: "bg-white/20 hover:bg-white/30 text-white",
  },
  {
    id: "savings",
    name: "Savings",
    balance: "25.08 ETH",
    address: "0x89A...1E4c",
    icon: Bookmark,
    bgColor: "bg-[#141414] border border-white/10",
    textColor: "text-white",
    subtextColor: "text-white/60",
    buttonBg: "bg-white/10 hover:bg-white/20 text-white",
  },
  {
    id: "staked",
    name: "Staked",
    balance: "0.04 ETH",
    address: "0x32B...9D1a",
    icon: Cloud,
    bgColor: "bg-[#00c6e0]", // Vibrant Cyan
    textColor: "text-white",
    subtextColor: "text-white/80",
    buttonBg: "bg-white/20 hover:bg-white/30 text-white",
  },
  {
    id: "spending",
    name: "Spending",
    balance: "0 ETH",
    address: "0x54F...8A2e",
    icon: Anchor,
    bgColor: "bg-[#2b7fff]", // Vibrant Blue
    textColor: "text-white",
    subtextColor: "text-white/80",
    buttonBg: "bg-white/20 hover:bg-white/30 text-white",
  },
];

export interface MinimalCardExpandProps {
  cards?: WalletCardItem[];
  className?: string;
}

export function MinimalCardExpand({
  cards = DEFAULT_CARDS,
  className,
}: MinimalCardExpandProps) {
  const [expandedId, setExpandedId] = useState<string | null>("gxuri");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Outside click to collapse card back to 2x2 grid
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpandedId(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleCopy = (e: React.MouseEvent, card: WalletCardItem) => {
    e.stopPropagation();
    if (card.address) {
      navigator.clipboard.writeText(card.address);
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const expandedCard = cards.find((c) => c.id === expandedId);
  const unexpandedCards = cards.filter((c) => c.id !== expandedId);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full max-w-[440px] flex-col items-center justify-center gap-3 p-4 select-none",
        className,
      )}
    >
      <LayoutGroup>
        {expandedCard ? (
          /* EXPANDED STATE: 1 Full-width card on top, 3 small cards below */
          <div className="flex w-full flex-col gap-3">
            {/* Top Full-width Expanded Card */}
            <motion.div
              layout
              layoutId={`card-container-${expandedCard.id}`}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 350, damping: 30 }
              }
              onClick={() => setExpandedId(null)}
              className={cn(
                "relative flex h-[190px] w-full flex-col justify-between rounded-[28px] p-6 shadow-xl cursor-pointer overflow-hidden",
                expandedCard.bgColor,
              )}
            >
              {/* Header inside expanded card */}
              <div className="flex items-start justify-between">
                <motion.div
                  layoutId={`card-icon-${expandedCard.id}`}
                  className="flex h-10 w-10 items-center justify-center text-white"
                >
                  <expandedCard.icon className="h-8 w-8 fill-current stroke-none" />
                </motion.div>

                {/* Copy Address CTA */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="button"
                  onClick={(e) => handleCopy(e, expandedCard)}
                  className="flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/30 transition-colors"
                >
                  {copiedId === expandedCard.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <span>Copy Address</span>
                      <Copy className="h-3.5 w-3.5 opacity-80" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Footer inside expanded card */}
              <div className="flex items-end justify-between">
                <div>
                  <motion.h4
                    layoutId={`card-title-${expandedCard.id}`}
                    className="text-2xl font-bold tracking-tight text-white"
                  >
                    {expandedCard.name}
                  </motion.h4>
                  <motion.p
                    layoutId={`card-balance-${expandedCard.id}`}
                    className="text-lg font-bold text-white/80"
                  >
                    {expandedCard.balance}
                  </motion.p>
                </div>

                {/* Customize Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md hover:bg-white/30 transition-colors"
                >
                  Customize
                </motion.button>
              </div>
            </motion.div>

            {/* Bottom 3 unexpanded cards row */}
            <div className="grid w-full grid-cols-3 gap-3">
              {unexpandedCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={`card-container-${card.id}`}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 350, damping: 30 }
                  }
                  onClick={() => setExpandedId(card.id)}
                  className={cn(
                    "relative flex h-[130px] flex-col justify-between rounded-[24px] p-4 shadow-md cursor-pointer overflow-hidden group hover:scale-[1.02] transition-transform",
                    card.bgColor,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <motion.div
                      layoutId={`card-icon-${card.id}`}
                      className="flex h-7 w-7 items-center justify-center text-white"
                    >
                      <card.icon className="h-6 w-6 fill-current stroke-none" />
                    </motion.div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(card.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <motion.h4
                      layoutId={`card-title-${card.id}`}
                      className="text-base font-bold tracking-tight text-white"
                    >
                      {card.name}
                    </motion.h4>
                    <motion.p
                      layoutId={`card-balance-${card.id}`}
                      className="text-xs font-bold text-white/70"
                    >
                      {card.balance}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* COLLAPSED STATE: 2x2 Grid of all 4 cards */
          <div className="grid w-full grid-cols-2 gap-3">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout
                layoutId={`card-container-${card.id}`}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 350, damping: 30 }
                }
                onClick={() => setExpandedId(card.id)}
                className={cn(
                  "relative flex h-[155px] flex-col justify-between rounded-[26px] p-5 shadow-lg cursor-pointer overflow-hidden hover:scale-[1.02] transition-transform",
                  card.bgColor,
                )}
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    layoutId={`card-icon-${card.id}`}
                    className="flex h-8 w-8 items-center justify-center text-white"
                  >
                    <card.icon className="h-7 w-7 fill-current stroke-none" />
                  </motion.div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(card.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <motion.h4
                    layoutId={`card-title-${card.id}`}
                    className="text-lg font-bold tracking-tight text-white"
                  >
                    {card.name}
                  </motion.h4>
                  <motion.p
                    layoutId={`card-balance-${card.id}`}
                    className="text-sm font-bold text-white/80"
                  >
                    {card.balance}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}

export default MinimalCardExpand;
