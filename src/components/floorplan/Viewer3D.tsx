import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useFloorplan } from "@/lib/floorplan/store";
import type { Floor } from "@/lib/floorplan/types";

const SCALE = 0.02;

// Each check uses a FRESH canvas: once getContext("webgl2") fails on a canvas,
// that canvas is locked and getContext("webgl") on it returns null even when
// WebGL 1 works — a false negative that blocked the whole 3D view.
function isWebGLAvailable(): boolean {
  try {
    const tryCtx = (type: "webgl2" | "webgl" | "experimental-webgl") => {
      const canvas = document.createElement("canvas");
      return !!canvas.getContext(type);
    };
    return tryCtx("webgl2") || tryCtx("webgl") || tryCtx("experimental-webgl");
  } catch {
    return false;
  }
}

// Last-resort net: if WebGL context creation still fails inside the Canvas
// (renderer throws), show the fallback instead of crashing the app.
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error("WebGL renderer failed:", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function WebGLFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/30 p-8 text-center">
      <p className="text-sm font-medium">Não foi possível iniciar a visualização 3D</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        O navegador bloqueou o WebGL (necessário para o 3D). Abra a pré-visualização em uma aba
        separada, ou ative a aceleração de hardware nas configurações do navegador e recarregue a
        página.
      </p>
    </div>
  );
}

export function Viewer3D() {
  const { project, activeFloor } = useFloorplan();
  const [showAll, setShowAll] = useState(true);
  // null = ainda verificando; check runs after mount so SSR never decides it
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  const FLOOR_GAP = 1.8;
  const floorsToRender = showAll ? project.floors : [activeFloor];

  if (webglOk === null) {
    return <div className="h-full w-full bg-muted/30" />;
  }

  if (!webglOk) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative h-full w-full bg-muted/30">
      <CanvasErrorBoundary fallback={<WebGLFallback />}>
        <Canvas
          shadows
          camera={{ position: [10, 10, 14], fov: 50 }}
          gl={{ failIfMajorPerformanceCaveat: false }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 8]} intensity={1} castShadow />
          <Grid
            args={[40, 40]}
            cellColor="#94a3b8"
            sectionColor="#475569"
            infiniteGrid
            fadeDistance={40}
          />
          {floorsToRender.map((f, i) => (
            <FloorBlockSafe key={f.id} floor={f} baseY={showAll ? i * FLOOR_GAP : 0} />
          ))}
          <OrbitControls makeDefault />
        </Canvas>
      </CanvasErrorBoundary>
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
