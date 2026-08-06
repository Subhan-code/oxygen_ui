"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { MoonIcon, Sun01Icon } from "@/components/app/icons";
import { buttonVariants } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme, resolvedTheme } = useTheme();

  const handleToggle = React.useCallback(() => {
    const currentTheme = resolvedTheme || theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, theme, setTheme]);

  useHotkeys("d", handleToggle);

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative size-9 rounded-2xl border border-black/5 bg-card/60 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-card/40 shadow-xs hover:shadow-md",
          className
        )}
        onClick={handleToggle}
        aria-label="Toggle Mode"
      >
        <Sun01Icon className="block size-4.5 text-foreground transition-transform duration-300 dark:hidden" />
        <MoonIcon className="hidden size-4.5 text-foreground transition-transform duration-300 dark:block" />
        <span className="sr-only">Toggle Theme</span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={10}
        className="py-2 pr-2 pl-3 text-[0.85rem]"
      >
        <div className="flex items-center gap-2.5">
          Toggle Mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
