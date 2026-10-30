import Dexie, { type EntityTable } from "dexie";
import type { MockupConfig } from "@/types/mockup";

export interface SavedShot {
  id?: number;
  name: string;
  createdAt: number;
  config: MockupConfig;
  imageUrl: string | null;
  imageDimensions: { width: number; height: number } | null;
}

export type SavedProject = SavedShot;

export const db = new Dexie("FrameCraftStudioDB") as Dexie & {
  shots: EntityTable<SavedShot, "id">;
};

db.version(1).stores({
  shots: "++id, name, createdAt",
});
