"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import LoadingFallback from "@/components/three/LoadingFallback";

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas"),
  { ssr: false }
);

const Experience = dynamic(
  () => import("@/components/three/InteractiveExperience"),
  { ssr: false }
);

type SceneCanvasProps = ComponentProps<typeof SceneCanvas>;

interface ThreeSceneProps extends Omit<SceneCanvasProps, "children" | "fallback"> {
  containerClassName?: string;
}

export default function ThreeScene({
  containerClassName = "",
  ...canvasProps
}: ThreeSceneProps) {
  return (
    <div
      className={`pointer-events-auto ${containerClassName}`}
      aria-hidden="true"
    >
      <SceneCanvas
        fallback={<LoadingFallback />}
        {...canvasProps}
      >
        <Experience />
      </SceneCanvas>
    </div>
  );
}
