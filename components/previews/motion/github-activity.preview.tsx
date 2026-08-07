"use client";

import { GitHubActivity } from "@/components/motion/github-activity";

const SAMPLE_REPOS = [
  { name: "oxygen_ui", count: 42 },
  { name: "motion", count: 18 },
  { name: "next.js", count: 12 },
];

export function GitHubActivityPreview() {
  return (
    <div className="flex min-h-[350px] w-full items-center justify-center p-6 bg-muted/20">
      <GitHubActivity
        username="Subhan-code"
        repos={SAMPLE_REPOS}
        showMonths
        defaultOpen={false}
      />
    </div>
  );
}

export default GitHubActivityPreview;
