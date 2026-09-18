export type RoomType = "sala" | "corredor" | "banheiro" | "cozinha" | "quarto" | "escritorio" | "outro";

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: RoomType;
  wallHeight: number;
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface ProjectData {
  name: string;
  floors: Floor[];
  activeFloorId: string;
}

export const DEFAULT_PROJECT: ProjectData = {
  name: "Meu Projeto teste",
  activeFloorId: "f1",
  floors: [
    {
      id: "f1",
      name: "Térreo",
      rooms: [
        { id: "r1", name: "Sala", x: 80, y: 80, width: 220, height: 160, color: "#60a5fa", type: "sala", wallHeight: 30 },
        { id: "r2", name: "Cozinha", x: 320, y: 80, width: 180, height: 160, color: "#f59e0b", type: "cozinha", wallHeight: 30 },
      ],
    },
  ],
};

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "sala", label: "Sala" },
  { value: "corredor", label: "Corredor" },
  { value: "banheiro", label: "Banheiro" },
  { value: "cozinha", label: "Cozinha" },
  { value: "quarto", label: "Quarto" },
  { value: "escritorio", label: "Escritório" },
  { value: "outro", label: "Outro" },
];
