"use client";

import { ScrollProgress } from "@/components/motion/scroll-progress-sections";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "components", label: "Components" },
  { id: "pricing", label: "Pricing" },
];

export function ScrollProgressSectionsPreview() {
  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center p-6 bg-muted/20">
      <ScrollProgress sections={SECTIONS} className="relative bottom-0 left-0 translate-x-0" />
    </div>
  );
}

export default ScrollProgressSectionsPreview;
