"use client";

import { PipelineBoard } from "@/components/motion/pipeline-board";

export function PipelineBoardPreview() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-6">
      <PipelineBoard />
    </div>
  );
}

export default PipelineBoardPreview;
