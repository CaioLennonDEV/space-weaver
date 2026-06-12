import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useState } from "react";
import { useFloorplan } from "@/lib/floorplan/store";
import type { Floor } from "@/lib/floorplan/types";

const SCALE = 0.02;

function FloorBlock({ floor, baseY }: { floor: Floor; baseY: number }) {
  return (
    <group position={[0, baseY, 0]}>
      {floor.rooms.map((room) => {
        const w = room.width * SCALE;
        const d = room.height * SCALE;
        const h = room.wallHeight * SCALE * 5;
        const x = room.x * SCALE + w / 2;
        const z = room.y * SCALE + d / 2;
        return (
          <group key={room.id} position={[x, 0, z]}>
            {/* floor */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial color={room.color} />
            </mesh>
            {/* walls (box shell) */}
            <mesh position={[0, h / 2, 0]} castShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={room.color} transparent opacity={0.45} />
            </mesh>
            {/* edges */}
            <lineSegments position={[0, h / 2, 0]}>
              <edgesGeometry args={[ /* @ts-expect-error - r3f args */ undefined]} attach="geometry" />
              <lineBasicMaterial color="#0f172a" />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}

export function Viewer3D() {
  const { project, activeFloor } = useFloorplan();
  const [showAll, setShowAll] = useState(true);

  const FLOOR_GAP = 1.8;
  const floorsToRender = showAll ? project.floors : [activeFloor];

  return (
    <div className="relative h-full w-full bg-muted/30">
      <Canvas shadows camera={{ position: [10, 10, 14], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 8]} intensity={1} castShadow />
        <Grid args={[40, 40]} cellColor="#94a3b8" sectionColor="#475569" infiniteGrid fadeDistance={40} />
        {floorsToRender.map((f, i) => (
          <FloorBlockSafe key={f.id} floor={f} baseY={showAll ? i * FLOOR_GAP : 0} />
        ))}
        <OrbitControls makeDefault />
      </Canvas>
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <div className="rounded-md bg-card px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-border">
          Andar atual: {activeFloor.name}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-md bg-card px-3 py-1.5 text-xs shadow-sm ring-1 ring-border">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Mostrar todos os andares
        </label>
      </div>
    </div>
  );
}

// Simplified FloorBlock without edges geometry issue
function FloorBlockSafe({ floor, baseY }: { floor: Floor; baseY: number }) {
  return (
    <group position={[0, baseY, 0]}>
      {floor.rooms.map((room) => {
        const w = room.width * SCALE;
        const d = room.height * SCALE;
        const h = Math.max(0.3, room.wallHeight * SCALE * 5);
        const x = room.x * SCALE + w / 2;
        const z = room.y * SCALE + d / 2;
        return (
          <group key={room.id} position={[x, 0, z]}>
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial color={room.color} />
            </mesh>
            <mesh position={[0, h / 2, 0]} castShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={room.color} transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
