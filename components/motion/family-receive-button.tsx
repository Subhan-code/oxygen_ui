"use client";

// beui.dev/components/motion/family-receive-button
// Inspired by Family App - Animated Receive Confirmation Modal

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { Check, Fingerprint, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FamilyReceiveButtonProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FamilyReceiveButton({
  title = "Confirm",
  description = "Are you sure you want to receive hell load of money?",
  className,
}: FamilyReceiveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const reduce = useReducedMotion();

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-6 select-none", className)}>
      {/* Trigger Receive Pill Button */}
      {!isOpen && (
        <motion.button
          layoutId="receive-modal-container"
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-48 items-center justify-center rounded-full bg-[#00aaff] font-bold text-white shadow-lg hover:bg-[#00aaff]/90 active:scale-95 transition-all"
        >
          <motion.span layoutId="receive-button-text">Receive</motion.span>
        </motion.button>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              layoutId="receive-modal-container"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[360px] rounded-[28px] border border-white/10 bg-[#121212] p-6 text-white shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sky-400 hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <p className="my-5 text-sm font-medium leading-relaxed text-white/70">
                {description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-12 w-full rounded-2xl bg-white/10 font-bold text-white hover:bg-white/20 active:scale-95 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all",
                    isSuccess
                      ? "bg-emerald-500"
                      : "bg-[#00aaff] hover:bg-[#00aaff]/90",
                  )}
                >
                  {isSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Received!</span>
                    </>
                  ) : (
                    <motion.span layoutId="receive-button-text">Receive</motion.span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FamilyReceiveButton;
