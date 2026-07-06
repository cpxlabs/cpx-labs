"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const BRAND_COLORS = {
  purple: new THREE.Color("#a164ff"),
  light: new THREE.Color("#c29fff"),
  dark: new THREE.Color("#5d13c8"),
};

function FloatingParticles({ count = 200 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
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
        size={0.05}
        color="#c29fff"
        sizeAttenuation
        transparent
        opacity={0.4}
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

function Planet({ active, hovered, onClick, onPointerOver, onPointerOut }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture("/cosmic-bg.png");

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }

    if (groupRef.current) {
      const s = active ? 1.25 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          color={active ? BRAND_COLORS.light : BRAND_COLORS.purple}
          emissive={active ? BRAND_COLORS.purple : BRAND_COLORS.dark}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          metalness={0.8}
          roughness={0.2}
          bumpMap={texture}
          bumpScale={0.05}
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

      {/* Saturn-like Rings - More refined */}
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

  useFrame((state) => {
    if (groupRef.current) {
      // Gently rotate group towards the normalized mouse pointer
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.35;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.08;
    }
  });

  return (
    <>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
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
        >
          <Suspense fallback={null}>
            <Planet
              active={active}
              hovered={hovered}
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
