"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Suspense, type ReactNode } from "react";

interface SceneCanvasProps extends Omit<CanvasProps, "children"> {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function SceneCanvas({
  children,
  fallback,
  camera = { position: [0, 0, 6], fov: 45, near: 0.1, far: 100 },
  dpr = [1, 2],
  gl = {
    antialias: true,
    toneMapping: 3,
    toneMappingExposure: 1.2,
  },
  shadows = false,
  style,
  ...props
}: SceneCanvasProps) {
  return (
    <Canvas
      camera={camera}
      dpr={dpr}
      gl={gl}
      shadows={shadows}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}
      {...props}
    >
      <Suspense fallback={fallback ?? null}>
        {children}
      </Suspense>
    </Canvas>
  );
}
