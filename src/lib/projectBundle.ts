import type { MockupConfig, SlideItem } from "@/types/mockup";

export interface FrameCraftProjectFile {
  version: "1.0.0";
  timestamp: number;
  appName: "FrameCraft Studio";
  config: MockupConfig;
  slides: SlideItem[];
  activeSlideIndex: number;
  metadata?: {
    author?: string;
    notes?: string;
    ratio?: string;
  };
}

/**
 * Serializes the current studio state into a downloadable .framecraft JSON file.
 */
export function exportProjectBundle(projectData: FrameCraftProjectFile): void {
  const jsonStr = JSON.stringify(projectData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `framecraft-project-${new Date().toISOString().slice(0, 10)}.framecraft`;
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates and imports a .framecraft file bundle.
 */
export async function importProjectBundle(file: File): Promise<FrameCraftProjectFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as FrameCraftProjectFile;
        if (!parsed.version || !parsed.config) {
          throw new Error("Arquivo .framecraft inválido ou incompatível.");
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo .framecraft"));
    reader.readAsText(file);
  });
}
