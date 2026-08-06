"use client";

import { ArrowLeftRight, Layers, Lock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";

export function TabsPreview() {
  const [active, setActive] = useState("swap");

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[300px]">
      <Tabs value={active} onValueChange={setActive} variant="pill">
        <TabsList>
          <TabsTrigger value="swap">
            <span className="flex items-center gap-1.5 font-medium"><ArrowLeftRight className="h-3.5 w-3.5" /> DEX Swap</span>
          </TabsTrigger>
          <TabsTrigger value="pools">
            <span className="flex items-center gap-1.5 font-medium"><Layers className="h-3.5 w-3.5" /> Liquidity Pools</span>
          </TabsTrigger>
          <TabsTrigger value="staking">
            <span className="flex items-center gap-1.5 font-medium"><Lock className="h-3.5 w-3.5" /> SOL Staking</span>
          </TabsTrigger>
          <TabsTrigger value="perps">
            <span className="flex items-center gap-1.5 font-medium"><TrendingUp className="h-3.5 w-3.5" /> 100x Perps</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-xl border border-border bg-card p-4 text-xs font-mono text-muted-foreground">
        Active Section: <span className="text-accent font-bold uppercase">{active}</span>
      </div>
    </div>
  );
}
export default TabsPreview;
