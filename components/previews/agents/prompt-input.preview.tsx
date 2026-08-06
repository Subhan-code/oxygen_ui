"use client";

import { PromptInput } from "@/components/agents/prompt-input";

export function PromptInputPreview() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[300px] w-full max-w-lg mx-auto">
      <PromptInput
        placeholder="Ask Oxygen AI to swap SOL, check RPC latency, or analyze wallet transactions..."
      />
    </div>
  );
}
export default PromptInputPreview;
