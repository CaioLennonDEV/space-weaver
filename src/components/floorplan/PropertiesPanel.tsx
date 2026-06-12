import { useFloorplan } from "@/lib/floorplan/store";
import { ROOM_TYPES, type RoomType } from "@/lib/floorplan/types";
import { Trash2, Copy } from "lucide-react";

export function PropertiesPanel() {
  const { activeFloor, selectedRoomId, updateRoom, deleteRoom, duplicateRoom } = useFloorplan();
  const room = activeFloor.rooms.find((r) => r.id === selectedRoomId);

  if (!room) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Selecione uma sala para editar suas propriedades.
      </div>
    );
  }

  const field = "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm";

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Propriedades</h3>
        <div className="flex gap-1">
          <button
            onClick={() => duplicateRoom(room.id)}
            className="rounded-md p-1.5 hover:bg-accent"
            title="Duplicar"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteRoom(room.id)}
            className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Field label="Nome">
        <input className={field} value={room.name} onChange={(e) => updateRoom(room.id, { name: e.target.value })} />
      </Field>

      <Field label="Tipo">
        <select
          className={field}
          value={room.type}
          onChange={(e) => updateRoom(room.id, { type: e.target.value as RoomType })}
        >
          {ROOM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="X">
          <input type="number" className={field} value={room.x} onChange={(e) => updateRoom(room.id, { x: +e.target.value })} />
        </Field>
        <Field label="Y">
          <input type="number" className={field} value={room.y} onChange={(e) => updateRoom(room.id, { y: +e.target.value })} />
        </Field>
        <Field label="Largura">
          <input type="number" className={field} value={room.width} onChange={(e) => updateRoom(room.id, { width: +e.target.value })} />
        </Field>
        <Field label="Altura">
          <input type="number" className={field} value={room.height} onChange={(e) => updateRoom(room.id, { height: +e.target.value })} />
        </Field>
      </div>

      <Field label="Cor">
        <div className="flex items-center gap-2">
          <input type="color" value={room.color} onChange={(e) => updateRoom(room.id, { color: e.target.value })} className="h-8 w-12 cursor-pointer rounded border border-input" />
          <input className={field} value={room.color} onChange={(e) => updateRoom(room.id, { color: e.target.value })} />
        </div>
      </Field>

      <Field label={`Altura 3D (${room.wallHeight})`}>
        <input
          type="range"
          min={10}
          max={120}
          value={room.wallHeight}
          onChange={(e) => updateRoom(room.id, { wallHeight: +e.target.value })}
          className="w-full"
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
