"use client";

import { BlurShimmerText } from "@/components/motion/blur-shimmer-text";

export function BlurShimmerTextPreview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[160px] p-6">
      <BlurShimmerText
        texts={[
          "Staggered Character Blur Reveal",
          "Smooth Motion Transition",
          "Extracted from ratneshc.com",
        ]}
        interval={2.5}
        blur={6}
        className="text-lg font-mono font-medium text-foreground"
      />
    </div>
  );
}

export default BlurShimmerTextPreview;
