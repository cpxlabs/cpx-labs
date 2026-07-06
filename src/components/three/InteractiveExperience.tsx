"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
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

export default function InteractiveExperience() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const scale = useMemo(
    () => new THREE.Vector3(1.1, 1.1, 1.1),
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

  useFrame((state) => {
    if (groupRef.current) {
      // Gently rotate group towards the normalized mouse pointer
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.35;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.08;
    }
    if (meshRef.current) {
      // Standard continuous spin
      meshRef.current.rotation.z += 0.005;
    }
  });

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

      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#c29fff" />

      <FloatingParticles count={250} />
      <FloatingShapes count={15} />

      <group ref={groupRef}>
        <Float
          speed={2.5}
          rotationIntensity={0.6}
          floatIntensity={1.3}
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
              emissiveIntensity={hovered ? 0.35 : 0.12}
              metalness={0.45}
              roughness={0.35}
              transparent
              opacity={0.88}
              wireframe={active}
            />
          </mesh>

          {/* Saturn-like Rings */}
          <mesh rotation={[Math.PI / 2.2, 0.4, 0]}>
            <torusGeometry args={[2.1, 0.015, 16, 100]} />
            <meshPhysicalMaterial
              color={BRAND_COLORS.light}
              emissive={BRAND_COLORS.purple}
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.2, 0.4, 0]}>
            <torusGeometry args={[2.3, 0.01, 16, 100]} />
            <meshPhysicalMaterial
              color={BRAND_COLORS.light}
              emissive={BRAND_COLORS.purple}
              emissiveIntensity={0.3}
              transparent
              opacity={0.2}
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}
