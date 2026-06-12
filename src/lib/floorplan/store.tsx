import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { DEFAULT_PROJECT, type Floor, type ProjectData, type Room } from "./types";

const STORAGE_KEY = "floorplan-project-v1";

interface Ctx {
  project: ProjectData;
  setProject: (p: ProjectData) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  activeFloor: Floor;
  updateRoom: (id: string, patch: Partial<Room>) => void;
  addRoom: () => void;
  deleteRoom: (id: string) => void;
  duplicateRoom: (id: string) => void;
  clearFloor: () => void;
  addFloor: () => void;
  renameFloor: (id: string, name: string) => void;
  deleteFloor: (id: string) => void;
  setActiveFloor: (id: string) => void;
  saveLocal: () => void;
  loadLocal: () => void;
  exportJSON: () => void;
  importJSON: (file: File) => void;
}

const FloorplanCtx = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);

function loadInitial(): ProjectData {
  if (typeof window === "undefined") return DEFAULT_PROJECT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PROJECT;
}

export function FloorplanProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectData>(DEFAULT_PROJECT);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    setProject(loadInitial());
  }, []);

  const activeFloor = project.floors.find((f) => f.id === project.activeFloorId) ?? project.floors[0];

  const updateFloor = useCallback(
    (id: string, fn: (f: Floor) => Floor) => {
      setProject((p) => ({ ...p, floors: p.floors.map((f) => (f.id === id ? fn(f) : f)) }));
    },
    [],
  );

  const updateRoom: Ctx["updateRoom"] = (id, patch) => {
    updateFloor(activeFloor.id, (f) => ({
      ...f,
      rooms: f.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addRoom: Ctx["addRoom"] = () => {
    const newRoom: Room = {
      id: uid(),
      name: `Sala ${activeFloor.rooms.length + 1}`,
      x: 100,
      y: 100,
      width: 160,
      height: 120,
      color: "#a78bfa",
      type: "sala",
      wallHeight: 30,
    };
    updateFloor(activeFloor.id, (f) => ({ ...f, rooms: [...f.rooms, newRoom] }));
    setSelectedRoomId(newRoom.id);
  };

  const deleteRoom: Ctx["deleteRoom"] = (id) => {
    updateFloor(activeFloor.id, (f) => ({ ...f, rooms: f.rooms.filter((r) => r.id !== id) }));
    setSelectedRoomId(null);
  };

  const duplicateRoom: Ctx["duplicateRoom"] = (id) => {
    const room = activeFloor.rooms.find((r) => r.id === id);
    if (!room) return;
    const copy: Room = { ...room, id: uid(), name: room.name + " cópia", x: room.x + 20, y: room.y + 20 };
    updateFloor(activeFloor.id, (f) => ({ ...f, rooms: [...f.rooms, copy] }));
    setSelectedRoomId(copy.id);
  };

  const clearFloor: Ctx["clearFloor"] = () => {
    updateFloor(activeFloor.id, (f) => ({ ...f, rooms: [] }));
    setSelectedRoomId(null);
  };

  const addFloor: Ctx["addFloor"] = () => {
    const newFloor: Floor = { id: uid(), name: `${project.floors.length}º andar`, rooms: [] };
    setProject((p) => ({ ...p, floors: [...p.floors, newFloor], activeFloorId: newFloor.id }));
  };

  const renameFloor: Ctx["renameFloor"] = (id, name) => {
    setProject((p) => ({ ...p, floors: p.floors.map((f) => (f.id === id ? { ...f, name } : f)) }));
  };

  const deleteFloor: Ctx["deleteFloor"] = (id) => {
    setProject((p) => {
      if (p.floors.length <= 1) return p;
      const floors = p.floors.filter((f) => f.id !== id);
      return { ...p, floors, activeFloorId: floors[0].id };
    });
  };

  const setActiveFloor: Ctx["setActiveFloor"] = (id) => {
    setProject((p) => ({ ...p, activeFloorId: id }));
    setSelectedRoomId(null);
  };

  const saveLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  };

  const loadLocal = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setProject(JSON.parse(raw));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON: Ctx["importJSON"] = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result));
        setProject(data);
      } catch {
        alert("JSON inválido");
      }
    };
    reader.readAsText(file);
  };

  return (
    <FloorplanCtx.Provider
      value={{
        project,
        setProject,
        selectedRoomId,
        setSelectedRoomId,
        activeFloor,
        updateRoom,
        addRoom,
        deleteRoom,
        duplicateRoom,
        clearFloor,
        addFloor,
        renameFloor,
        deleteFloor,
        setActiveFloor,
        saveLocal,
        loadLocal,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </FloorplanCtx.Provider>
  );
}

export const useFloorplan = () => {
  const ctx = useContext(FloorplanCtx);
  if (!ctx) throw new Error("useFloorplan must be inside FloorplanProvider");
  return ctx;
};
