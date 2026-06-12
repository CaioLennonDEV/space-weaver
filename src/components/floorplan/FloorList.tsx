import { useState } from "react";
import { useFloorplan } from "@/lib/floorplan/store";
import { Plus, Trash2, Pencil, Check } from "lucide-react";

export function FloorList() {
  const { project, addFloor, deleteFloor, renameFloor, setActiveFloor } = useFloorplan();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Andares</h3>
        <button
          onClick={addFloor}
          className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
          Novo
        </button>
      </div>
      <ul className="flex flex-col gap-1">
        {project.floors.map((f) => {
          const active = f.id === project.activeFloorId;
          const editing = editingId === f.id;
          return (
            <li
              key={f.id}
              className={`group flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm ${
                active ? "border-primary bg-primary/10" : "border-transparent hover:bg-accent"
              }`}
            >
              {editing ? (
                <>
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        renameFloor(f.id, draft || f.name);
                        setEditingId(null);
                      }
                    }}
                    className="flex-1 rounded border border-input bg-background px-1 py-0.5 text-sm"
                  />
                  <button
                    onClick={() => {
                      renameFloor(f.id, draft || f.name);
                      setEditingId(null);
                    }}
                    className="rounded p-1 hover:bg-accent"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setActiveFloor(f.id)} className="flex-1 text-left">
                    {f.name}
                    <span className="ml-1 text-xs text-muted-foreground">({f.rooms.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(f.id);
                      setDraft(f.name);
                    }}
                    className="rounded p-1 opacity-0 hover:bg-accent group-hover:opacity-100"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {project.floors.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Excluir ${f.name}?`)) deleteFloor(f.id);
                      }}
                      className="rounded p-1 text-destructive opacity-0 hover:bg-destructive/10 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
