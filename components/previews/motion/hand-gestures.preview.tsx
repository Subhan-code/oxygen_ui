"use client";

import { HandGesturesDemo } from "@/components/motion/hand-gestures";

export function HandGesturesPreview() {
  return (
    <div className="flex min-h-[340px] w-full items-center justify-center p-6">
      <HandGesturesDemo />
    </div>
  );
}

export default HandGesturesPreview;
