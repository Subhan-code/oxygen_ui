"use client";

import { MinimalCardExpand } from "@/components/motion/minimal-card-expand";

export function MinimalCardExpandPreview() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-6 bg-zinc-950">
      <MinimalCardExpand />
    </div>
  );
}

export default MinimalCardExpandPreview;
