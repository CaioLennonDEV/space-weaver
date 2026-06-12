import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FloorplanProvider } from "@/lib/floorplan/store";
import { Editor2D } from "@/components/floorplan/Editor2D";
import { Viewer3D } from "@/components/floorplan/Viewer3D";
import { PropertiesPanel } from "@/components/floorplan/PropertiesPanel";
import { FloorList } from "@/components/floorplan/FloorList";
import { LeftToolbar, TopBar } from "@/components/floorplan/Toolbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Floorplan Studio — Editor 2D e Visualização 3D" },
      { name: "description", content: "Desenhe plantas internas em 2D com SVG e visualize em 3D. Salas, andares e exportação JSON." },
    ],
  }),
  component: Index,
});

function Index() {
  const [mode, setMode] = useState<"2d" | "3d">("2d");

  return (
    <FloorplanProvider>
      <div className="flex h-screen flex-col bg-background">
        <TopBar mode={mode} setMode={setMode} />
        <div className="flex flex-1 overflow-hidden">
          <LeftToolbar />
          <aside className="w-56 overflow-y-auto border-r border-border bg-card">
            <FloorList />
          </aside>
          <main className="flex-1 overflow-hidden">
            {mode === "2d" ? <Editor2D /> : <Viewer3D />}
          </main>
          <aside className="w-72 overflow-y-auto border-l border-border bg-card">
            <PropertiesPanel />
          </aside>
        </div>
      </div>
    </FloorplanProvider>
  );
}
