"use client";

import * as React from "react";
import { Tooltip as MotionTooltip } from "@/components/motion/tooltip";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  children: React.ReactNode;
}

export function Tooltip({ children }: TooltipProps) {
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find(
    (child) =>
      React.isValidElement(child) &&
      (child.type as { displayName?: string })?.displayName === "TooltipTrigger",
  ) || childrenArray[0];

  const content = childrenArray.find(
    (child) =>
      React.isValidElement(child) &&
      (child.type as { displayName?: string })?.displayName === "TooltipContent",
  );

  if (!React.isValidElement(trigger)) {
    return <>{children}</>;
  }

  const triggerElement = (trigger as React.ReactElement<{ render?: React.ReactElement }>).props?.render
    ? (trigger as React.ReactElement<{ render?: React.ReactElement }>).props.render
    : trigger;

  return (
    <MotionTooltip
      content={content}
      side={(content as React.ReactElement<{ side?: "top" | "right" | "bottom" | "left" }>)?.props?.side || "bottom"}
      className={(content as React.ReactElement<{ className?: string }>)?.props?.className}
    >
      {React.isValidElement(triggerElement) ? (
        triggerElement
      ) : (
        <span>{triggerElement}</span>
      )}
    </MotionTooltip>
  );
}

export function TooltipTrigger({
  className,
  render,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { render?: React.ReactElement }) {
  if (render) {
    return React.cloneElement(render, props);
  }
  return (
    <div className={cn("inline-flex cursor-default", className)} {...props}>
      {children}
    </div>
  );
}
TooltipTrigger.displayName = "TooltipTrigger";

export function TooltipContent({
  className,
  children,
  side = "bottom",
  sideOffset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}) {
  return (
    <div
      className={cn(
        "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
TooltipContent.displayName = "TooltipContent";
