"use client";

import { Html, useProgress } from "@react-three/drei";

export default function LoadingFallback() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-brand-900">
          <div
            className="h-full rounded-full bg-brand-400 transition-all duration-300 ease-out-expo"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-brand-300/60">
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}
