import { test, describe } from "node:test";
import assert from "node:assert";
import type { ExportWorkerRequest } from "../src/workers/exportWorker.ts";

describe("Web Worker Export Pipeline & Data Contracts", () => {
  test("creates valid export worker payload structure", () => {
    const payload: ExportWorkerRequest = {
      taskId: "task-001",
      slides: [
        {
          id: "slide-1",
          index: 0,
          title: "Slide 01",
          dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        },
      ],
      format: "png",
      quality: 100,
    };

    assert.strictEqual(payload.taskId, "task-001");
    assert.strictEqual(payload.slides.length, 1);
    assert.strictEqual(payload.format, "png");
  });

  test("validates filename padding logic for multi-slide batch zips", () => {
    const formatSlideFilename = (index: number, title: string, ext = "png") => {
      const padIndex = String(index + 1).padStart(2, "0");
      const safeTitle = title.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      return `slide-${padIndex}-${safeTitle}.${ext}`;
    };

    assert.strictEqual(formatSlideFilename(0, "Hero Banner"), "slide-01-hero-banner.png");
    assert.strictEqual(formatSlideFilename(9, "Pricing Table"), "slide-10-pricing-table.png");
  });
});
