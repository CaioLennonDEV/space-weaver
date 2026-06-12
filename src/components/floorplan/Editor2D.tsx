import { useEffect, useRef, useState } from "react";
import { useFloorplan } from "@/lib/floorplan/store";
import type { Room } from "@/lib/floorplan/types";

type Drag =
  | { type: "move"; id: string; startX: number; startY: number; origX: number; origY: number }
  | { type: "resize"; id: string; startX: number; startY: number; origW: number; origH: number }
  | { type: "pan"; startX: number; startY: number; origTx: number; origTy: number };

export function Editor2D() {
  const { activeFloor, selectedRoomId, setSelectedRoomId, updateRoom } = useFloorplan();
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 });
  const [drag, setDrag] = useState<Drag | null>(null);

  const toLocal = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left - view.tx) / view.scale, y: (e.clientY - rect.top - view.ty) / view.scale };
  };

  const onPointerDownRoom = (e: React.PointerEvent, room: Room) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setSelectedRoomId(room.id);
    const p = toLocal(e);
    setDrag({ type: "move", id: room.id, startX: p.x, startY: p.y, origX: room.x, origY: room.y });
  };

  const onPointerDownHandle = (e: React.PointerEvent, room: Room) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const p = toLocal(e);
    setDrag({ type: "resize", id: room.id, startX: p.x, startY: p.y, origW: room.width, origH: room.height });
  };

  const onPointerDownBg = (e: React.PointerEvent) => {
    setSelectedRoomId(null);
    setDrag({ type: "pan", startX: e.clientX, startY: e.clientY, origTx: view.tx, origTy: view.ty });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    if (drag.type === "pan") {
      setView((v) => ({ ...v, tx: drag.origTx + (e.clientX - drag.startX), ty: drag.origTy + (e.clientY - drag.startY) }));
      return;
    }
    const p = toLocal(e);
    if (drag.type === "move") {
      updateRoom(drag.id, { x: Math.round(drag.origX + (p.x - drag.startX)), y: Math.round(drag.origY + (p.y - drag.startY)) });
    } else {
      updateRoom(drag.id, {
        width: Math.max(20, Math.round(drag.origW + (p.x - drag.startX))),
        height: Math.max(20, Math.round(drag.origH + (p.y - drag.startY))),
      });
    }
  };

  const onPointerUp = () => setDrag(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = -e.deltaY * 0.001;
      setView((v) => {
        const newScale = Math.min(4, Math.max(0.2, v.scale * (1 + delta)));
        const k = newScale / v.scale;
        return { scale: newScale, tx: mx - (mx - v.tx) * k, ty: my - (my - v.ty) * k };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const recenter = () => setView({ tx: 0, ty: 0, scale: 1 });

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted/30">
      <svg
        ref={svgRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDownBg}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
          </pattern>
          <pattern id="gridBig" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#grid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridBig)" />
        <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
          {activeFloor.rooms.map((room) => {
            const selected = room.id === selectedRoomId;
            return (
              <g key={room.id}>
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill={room.color}
                  fillOpacity={0.6}
                  stroke={selected ? "hsl(var(--ring))" : "#0f172a"}
                  strokeWidth={selected ? 3 : 1.5}
                  strokeDasharray={selected ? "6 4" : undefined}
                  className="cursor-move"
                  onPointerDown={(e) => onPointerDownRoom(e, room)}
                />
                <text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none fill-foreground text-xs font-medium"
                >
                  {room.name}
                </text>
                {selected && (
                  <rect
                    x={room.x + room.width - 8}
                    y={room.y + room.height - 8}
                    width={14}
                    height={14}
                    fill="hsl(var(--primary))"
                    stroke="white"
                    strokeWidth={2}
                    className="cursor-se-resize"
                    onPointerDown={(e) => onPointerDownHandle(e, room)}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={recenter}
          className="rounded-md bg-card px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-border hover:bg-accent"
        >
          Centralizar
        </button>
        <div className="rounded-md bg-card px-3 py-1.5 text-xs shadow-sm ring-1 ring-border">
          Zoom {Math.round(view.scale * 100)}%
        </div>
      </div>
      <div className="absolute left-3 top-3 rounded-md bg-card px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-border">
        Andar: {activeFloor.name}
      </div>
    </div>
  );
}
