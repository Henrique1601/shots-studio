import type { MockupConfig } from "@/types/mockup";

export interface ExportWorkerRequest {
  taskId: string;
  slides: Array<{
    id: string;
    index: number;
    title: string;
    dataUrl: string;
  }>;
  format: "png" | "jpeg" | "webp";
  quality: number;
}

export interface ExportWorkerResponse {
  taskId: string;
  success: boolean;
  zipBlob?: Blob;
  error?: string;
  progress?: number;
}

/**
 * Generates an optimized zip archive of multiple slide images in a Web Worker friendly manner
 */
export async function createBatchZipArchive(
  slides: Array<{ filename: string; blob: Blob }>,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  slides.forEach((slide, idx) => {
    zip.file(slide.filename, slide.blob);
    if (onProgress) {
      onProgress(Math.round(((idx + 1) / slides.length) * 80));
    }
  });

  const content = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(80 + Math.round(metadata.percent * 0.2));
      }
    }
  );

  return content;
}
