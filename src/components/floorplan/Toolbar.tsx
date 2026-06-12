import { useRef } from "react";
import { useFloorplan } from "@/lib/floorplan/store";
import { Square, MousePointer2, Trash2, Eraser, Copy, Save, FolderOpen, Download, Upload } from "lucide-react";

export function LeftToolbar() {
  const { addRoom, selectedRoomId, deleteRoom, duplicateRoom, clearFloor, setSelectedRoomId } = useFloorplan();

  return (
    <div className="flex w-14 flex-col items-center gap-1 border-r border-border bg-card py-3">
      <ToolBtn label="Selecionar" onClick={() => setSelectedRoomId(null)}>
        <MousePointer2 className="h-5 w-5" />
      </ToolBtn>
      <ToolBtn label="Adicionar sala" onClick={addRoom}>
        <Square className="h-5 w-5" />
      </ToolBtn>
      <ToolBtn label="Duplicar" onClick={() => selectedRoomId && duplicateRoom(selectedRoomId)} disabled={!selectedRoomId}>
        <Copy className="h-5 w-5" />
      </ToolBtn>
      <ToolBtn label="Excluir sala" onClick={() => selectedRoomId && deleteRoom(selectedRoomId)} disabled={!selectedRoomId}>
        <Trash2 className="h-5 w-5" />
      </ToolBtn>
      <div className="my-1 h-px w-8 bg-border" />
      <ToolBtn label="Limpar andar" onClick={() => confirm("Limpar todas as salas do andar?") && clearFloor()}>
        <Eraser className="h-5 w-5" />
      </ToolBtn>
    </div>
  );
}

function ToolBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

export function TopBar({ mode, setMode }: { mode: "2d" | "3d"; setMode: (m: "2d" | "3d") => void }) {
  const { project, setProject, saveLocal, loadLocal, exportJSON, importJSON } = useFloorplan();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Square className="h-4 w-4" />
        </div>
        <input
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="bg-transparent text-sm font-semibold focus:outline-none"
        />
      </div>

      <div className="ml-4 flex rounded-md border border-border p-0.5">
        <button
          onClick={() => setMode("2d")}
          className={`rounded px-3 py-1 text-xs font-medium ${mode === "2d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Editor 2D
        </button>
        <button
          onClick={() => setMode("3d")}
          className={`rounded px-3 py-1 text-xs font-medium ${mode === "3d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Visualizar 3D
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <TopBtn onClick={saveLocal} icon={<Save className="h-4 w-4" />} label="Salvar" />
        <TopBtn onClick={loadLocal} icon={<FolderOpen className="h-4 w-4" />} label="Carregar" />
        <TopBtn onClick={exportJSON} icon={<Download className="h-4 w-4" />} label="Exportar" />
        <TopBtn onClick={() => fileRef.current?.click()} icon={<Upload className="h-4 w-4" />} label="Importar" />
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJSON(f);
            e.target.value = "";
          }}
        />
      </div>
    </header>
  );
}

function TopBtn({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {icon}
      {label}
    </button>
  );
}
