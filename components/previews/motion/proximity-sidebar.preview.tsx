"use client";

import { ProximitySidebar } from "@/components/motion/proximity-sidebar";

const SECTIONS = [
  { id: "intro", label: "Introduction", level: 1 as const },
  { id: "setup", label: "Quick Setup", level: 2 as const },
  { id: "usage", label: "Basic Usage", level: 3 as const },
  { id: "api", label: "API Reference", level: 2 as const },
  { id: "props", label: "Component Props", level: 3 as const },
];

export function ProximitySidebarPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center p-6 bg-muted/20">
      <ProximitySidebar sections={SECTIONS} side="left" />
    </div>
  );
}

export default ProximitySidebarPreview;
