"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const BRAND_COLORS = {
  purple: new THREE.Color("#a164ff"),
  light: new THREE.Color("#c29fff"),
  dark: new THREE.Color("#5d13c8"),
};

function FloatingParticles({ count = 250 }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Store original positions for reference in wave calculations
  const [originalPositions, particlesPosition] = useMemo(() => {
    const orig = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return [orig, pos];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow background rotation
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
      
      // Floating sinusoidal wave motion
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] = originalPositions[i * 3 + 1] + Math.sin(time + originalPositions[i * 3]) * 0.15;
        positions[i * 3] = originalPositions[i * 3] + Math.cos(time * 0.5 + originalPositions[i * 3 + 2]) * 0.1;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c29fff"
        sizeAttenuation
        transparent
        opacity={0.35}
      />
    </points>
  );
}

function FloatingShapes({ count = 10 }) {
  const shapes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2,
      speed: 0.5 + Math.random() * 1.5,
      type: Math.floor(Math.random() * 3),
    }));
  }, [count]);

  return (
    <>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          position={shape.position}
          rotation={shape.rotation}
          speed={shape.speed}
          rotationIntensity={2}
          floatIntensity={2}
        >
          <mesh scale={shape.scale}>
            {shape.type === 0 && <octahedronGeometry />}
            {shape.type === 1 && <tetrahedronGeometry />}
            {shape.type === 2 && <boxGeometry args={[1, 1, 1]} />}
            <meshPhysicalMaterial
              color={BRAND_COLORS.purple}
              emissive={BRAND_COLORS.dark}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

interface PlanetProps {
  active: boolean;
  hovered: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: () => void;
  dragging: boolean;
  setDragging: (v: boolean) => void;
}

function Planet({ active, hovered, onClick, onPointerOver, onPointerOut, dragging, setDragging }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  const currentScale = useRef(1.0);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const planeIntersection = useRef(new THREE.Vector3());

  // Global mouseup release trigger
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragging(false);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [setDragging]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }

    if (groupRef.current) {
      // Lerp transition for target scale
      const targetScale = active ? 1.35 : (hovered ? 1.15 : 1.0);
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
      
      // Organic pulsation
      const pulseFactor = Math.sin(time * 2.5) * 0.02;
      const s = currentScale.current + pulseFactor;
      groupRef.current.scale.set(s, s, s);

      // Drag/move calculation projected on standard camera depth plane
      if (dragging) {
        state.raycaster.ray.intersectPlane(planeRef.current, planeIntersection.current);
        groupRef.current.position.lerp(planeIntersection.current, 0.25);
      }
    }

    // Pulsate emissive intensity dynamically
    if (materialRef.current) {
      const baseEmissive = active ? 0.5 : 0.2;
      const pulse = Math.sin(time * 3.5) * 0.08;
      materialRef.current.emissiveIntensity = baseEmissive + pulse + (hovered ? 0.3 : 0);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
    >
      <mesh
        ref={meshRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color={active ? BRAND_COLORS.light : BRAND_COLORS.purple}
          emissive={active ? BRAND_COLORS.purple : BRAND_COLORS.dark}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Atmosphere/Glow */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={BRAND_COLORS.light}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Saturn-like Rings */}
      <group rotation={[Math.PI / 2.2, 0.4, 0]}>
        {[2.0, 2.1, 2.3, 2.5].map((radius, i) => (
          <mesh key={radius}>
            <torusGeometry args={[radius, 0.01 + i * 0.005, 16, 100]} />
            <meshPhysicalMaterial
              color={BRAND_COLORS.light}
              emissive={BRAND_COLORS.purple}
              emissiveIntensity={0.5 - i * 0.1}
              transparent
              opacity={0.4 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function InteractiveExperience() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "grab";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActive((prev) => !prev);
  };

  useFrame((state) => {
    // Mouse Interaction: Rotate group towards cursor position (disabled while dragging for precision)
    if (groupRef.current && !dragging) {
      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.4;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.08;
    }
  });

  return (
    <>
      {/* Enable orbit zoom/pan only when NOT dragging the planet */}
      <OrbitControls
        enabled={!dragging}
        enableZoom={true}
        enablePan={true}
        minDistance={3.5}
        maxDistance={10}
        rotateSpeed={0.5}
        dampingFactor={0.05}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />

      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#c29fff" />
      <directionalLight position={[-3, 2, -3]} intensity={0.5} color="#c29fff" />

      <FloatingParticles count={300} />
      <FloatingShapes count={20} />

      <group ref={groupRef}>
        <Float
          speed={2}
          rotationIntensity={0.4}
          floatIntensity={1}
          enabled={!dragging}
        >
          <Suspense fallback={null}>
            <Planet
              active={active}
              hovered={hovered}
              dragging={dragging}
              setDragging={setDragging}
              onClick={handleClick}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            />
          </Suspense>
        </Float>
      </group>
    </>
  );
}
