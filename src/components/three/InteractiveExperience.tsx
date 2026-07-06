"use client";

import { useRef, useState, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const BRAND_COLORS = {
  purple: new THREE.Color("#a164ff"),
  light: new THREE.Color("#c29fff"),
  dark: new THREE.Color("#5d13c8"),
};

export default function InteractiveExperience() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const scale = useMemo(
    () => new THREE.Vector3(1, 1, 1),
    []
  );

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActive((prev) => !prev);
  };

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#c29fff" />

      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={1.2}
      >
        <mesh
          ref={meshRef}
          scale={scale}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <icosahedronGeometry args={[1.2, 1]} />
          <meshPhysicalMaterial
            color={active ? BRAND_COLORS.light : BRAND_COLORS.purple}
            emissive={active ? BRAND_COLORS.purple : BRAND_COLORS.dark}
            emissiveIntensity={hovered ? 0.3 : 0.08}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.85}
            wireframe={active}
          />
        </mesh>
      </Float>
    </>
  );
}
