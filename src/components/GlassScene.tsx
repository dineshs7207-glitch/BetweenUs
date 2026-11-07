"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Drink } from "@/lib/drinks";

const GLASS_H = 2.4;
const R_TOP = 0.86;
const R_BOTTOM = 0.7;
const WALL = 0.05;
const BASE = 0.12; // thick glass bottom
const INNER_H = GLASS_H - BASE - 0.06;

const radiusAt = (y: number) => R_BOTTOM + (R_TOP - R_BOTTOM) * (y / GLASS_H);

function useGlassGeometry() {
  return useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(R_BOTTOM - 0.04, 0));
    pts.push(new THREE.Vector2(R_BOTTOM, 0.04));
    pts.push(new THREE.Vector2(R_TOP, GLASS_H));
    pts.push(new THREE.Vector2(R_TOP - WALL, GLASS_H));
    pts.push(new THREE.Vector2(R_BOTTOM - WALL, BASE));
    pts.push(new THREE.Vector2(0, BASE));
    const g = new THREE.LatheGeometry(pts, 64);
    g.translate(0, -GLASS_H / 2, 0);
    return g;
  }, []);
}

type Live = { colors: THREE.Color[]; heights: number[]; ice: number };

function Liquid({ drink }: { drink: Drink }) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const ice = useRef<THREE.Group>(null);
  const live = useRef<Live>({
    colors: drink.layers.map((l) => new THREE.Color(l.color)),
    heights: drink.layers.map((l) => l.height),
    ice: drink.ice ? 1 : 0,
  });
  const target = useMemo(() => drink.layers.map((l) => new THREE.Color(l.color)), [drink]);

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0025, dt); // frame-rate independent easing
    const L = live.current;
    let y = -GLASS_H / 2 + BASE;
    L.heights.forEach((h, i) => {
      L.heights[i] = h + (drink.layers[i].height - h) * k;
      L.colors[i].lerp(target[i], k);
      const m = meshes.current[i];
      if (!m) return;
      const hh = Math.max(0.0001, L.heights[i] * INNER_H);
      const yb = y - (-GLASS_H / 2);
      const q = (v: number) => Math.round(v * 250) / 250; // limit geometry rebuilds
      const rb = q(radiusAt(yb) - WALL - 0.01);
      const rt = q(radiusAt(yb + hh) - WALL - 0.01);
      m.scale.set(1, hh, 1);
      m.position.y = y + hh / 2;
      (m.material as THREE.MeshPhysicalMaterial).color.copy(L.colors[i]);
      m.visible = hh > 0.002;
      const geo = m.geometry as THREE.CylinderGeometry;
      if (geo.parameters.radiusTop !== rt || geo.parameters.radiusBottom !== rb) {
        m.geometry.dispose();
        m.geometry = new THREE.CylinderGeometry(rt, rb, 1, 48, 1);
      }
      y += hh;
    });
    L.ice += ((drink.ice ? 1 : 0) - L.ice) * k;
    if (ice.current) {
      const s = Math.max(0.0001, L.ice);
      ice.current.children.forEach((c, i) => {
        c.scale.setScalar(s);
        c.rotation.y += dt * (0.15 + i * 0.05);
      });
      ice.current.position.y = Math.min(y, GLASS_H / 2 - 0.25) - 0.18;
    }
  });

  return (
    <group>
      {[0, 1, 2].map((i) => (
        // Drawn after the glass's back wall (renderOrder) so the wall never greys the drink
        <mesh key={i} ref={(m) => { meshes.current[i] = m; }} renderOrder={1}>
          <cylinderGeometry args={[0.7, 0.7, 1, 48, 1]} />
          <meshStandardMaterial roughness={0.7} metalness={0} transparent opacity={1} />
        </mesh>
      ))}
      <group ref={ice}>
        {[
          [-0.28, 0.05, 0.12, 0.4],
          [0.25, -0.02, -0.15, 1.1],
          [0.02, 0.12, 0.3, 2.2],
        ].map(([x, y, z, r], i) => (
          <RoundedBox key={i} renderOrder={1.5} args={[0.42, 0.42, 0.42]} radius={0.08} smoothness={3} position={[x, y, z]} rotation={[r, r * 0.6, r * 0.3]}>
            <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.55} roughness={0.12} clearcoat={1} />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

function Glass({ drink }: { drink: Drink }) {
  const group = useRef<THREE.Group>(null);
  const geo = useGlassGeometry();

  useFrame(({ pointer }, dt) => {
    if (!group.current) return;
    const k = 1 - Math.pow(0.02, dt);
    group.current.rotation.y += (pointer.x * 0.45 - group.current.rotation.y) * k;
    group.current.rotation.x += (-pointer.y * 0.18 - group.current.rotation.x) * k;
  });

  return (
    <group ref={group}>
      <Liquid drink={drink} />
      {/* Back wall of the glass sits behind the liquid; the front wall is a thin
          sheen so the drink colours read true through it. */}
      <mesh geometry={geo} renderOrder={0}>
        <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.22} roughness={0.05} clearcoat={1} side={THREE.BackSide} depthWrite={false} depthTest={false} />
      </mesh>
      <mesh geometry={geo} renderOrder={2}>
        <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.08} roughness={0.05} clearcoat={1} clearcoatRoughness={0.05} side={THREE.FrontSide} depthWrite={false} />
      </mesh>
      {/* Rim highlight */}
      <mesh position={[0, GLASS_H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R_TOP - WALL / 2, WALL / 2, 8, 64]} />
        <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.6} clearcoat={1} />
      </mesh>
    </group>
  );
}

export default function GlassScene({ drink }: { drink: Drink }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 32, position: [0, 0.4, 6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#FFE8D0" />
      <pointLight position={[0, 1, 3]} intensity={2.5} distance={8} color="#FFFFFF" />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
        <Glass drink={drink} />
      </Float>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.35} scale={5} blur={2.6} far={2.5} />
    </Canvas>
  );
}
