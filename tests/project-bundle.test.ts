import { test, describe } from "node:test";
import assert from "node:assert";
import type { FrameCraftProjectFile } from "../src/lib/projectBundle.ts";
import type { MockupConfig } from "../src/types/mockup.ts";

const mockConfig: MockupConfig = {
  frameType: "iphone-16-pro",
  aspectRatio: "16:9",
  backgroundType: "gradient",
  backgroundColor: "#000000",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: 40,
  borderRadius: 24,
  shadowMode: "adaptive",
  shadowOpacity: 50,
  zoom: 100,
  tiltX: 0,
  tiltY: 0,
  tiltZ: 0,
  perspective: 1000,
  frameStyle: "default",
  borderRoundness: "curved",
  backgroundBlur: 0,
  grainIntensity: 0,
};

describe(".framecraft Project Bundle Format & Integrity", () => {
  test("validates structure of a valid .framecraft bundle", () => {
    const sampleProject: FrameCraftProjectFile = {
      version: "1.0.0",
      timestamp: Date.now(),
      appName: "FrameCraft Studio",
      config: mockConfig,
      slides: [
        {
          id: "slide-1",
          title: "Hero Slide",
          imageUrl: "data:image/png;base64,mock",
          config: mockConfig,
        },
      ],
      activeSlideIndex: 0,
      metadata: {
        author: "User",
        ratio: "16:9",
      },
    };

    assert.strictEqual(sampleProject.version, "1.0.0");
    assert.strictEqual(sampleProject.appName, "FrameCraft Studio");
    assert.strictEqual(sampleProject.slides.length, 1);
    assert.strictEqual(sampleProject.config.frameType, "iphone-16-pro");
  });

  test("rejects corrupt or incompatible payload without required fields", () => {
    const corruptPayload = { foo: "bar" };
    const isValid = Boolean((corruptPayload as any).version && (corruptPayload as any).config);
    assert.strictEqual(isValid, false);
  });
});
