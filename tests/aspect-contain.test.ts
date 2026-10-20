import { describe, it } from "node:test";
import assert from "node:assert";
import {
  parseAspectRatio,
  ASPECT_RATIOS_STANDARD,
  DEFAULT_RATIO_DIMENSIONS,
} from "../src/types/mockup.ts";

describe("Intelligent Auto-Contain & Aspect Ratio Math", () => {
  const getMockupRatio = (
    isDevice: boolean,
    deviceAspectRatio: string,
    imageDimensions?: { width: number; height: number } | null,
    frameType?: string
  ): number => {
    if (isDevice) {
      const [w, h] = deviceAspectRatio.split("/").map((s) => Number(s.trim()));
      if (w && h) return w / h;
      return 1;
    }
    if (imageDimensions && imageDimensions.width && imageDimensions.height) {
      return imageDimensions.width / imageDimensions.height;
    }
    return frameType === "browser" || frameType === "minimal-desktop" ? 16 / 10 : 4 / 3;
  };

  const isMockupTallerThanFrame = (mockupRatio: number, frameRatio: number): boolean => {
    return mockupRatio < frameRatio;
  };

  it("calculates standard 16:9 frame ratio accurately", () => {
    const { ratio } = parseAspectRatio("16:9");
    assert.strictEqual(ratio, 16 / 9);
  });

  it("calculates standard 1:1 square frame ratio accurately", () => {
    const { ratio } = parseAspectRatio("1:1");
    assert.strictEqual(ratio, 1);
  });

  it("calculates vertical 9:16 mobile frame ratio accurately", () => {
    const { ratio } = parseAspectRatio("9:16");
    assert.strictEqual(ratio, 9 / 16);
  });

  it("calculates panoramic 3:1 frame ratio accurately", () => {
    const { ratio } = parseAspectRatio("3:1");
    assert.strictEqual(ratio, 3);
  });

  it("calculates custom dimensions ratio correctly", () => {
    const { ratio, width, height } = parseAspectRatio("custom", 2560, 1440);
    assert.strictEqual(ratio, 2560 / 1440);
    assert.strictEqual(width, 2560);
    assert.strictEqual(height, 1440);
  });

  it("handles custom dimensions with fallback for invalid or 0 numbers", () => {
    const { ratio, width, height } = parseAspectRatio("custom", 0, -100);
    assert.strictEqual(width, 1920);
    assert.strictEqual(height, 1080);
    assert.strictEqual(ratio, 1920 / 1080);
  });

  it("contains all 12 standard ratios in ASPECT_RATIOS_STANDARD", () => {
    const expectedRatios = [
      "16:9", "16:10", "3:2", "4:3", "5:4", "1:1",
      "4:5", "3:4", "2:3", "9:16", "10:21", "3:1"
    ];
    assert.strictEqual(ASPECT_RATIOS_STANDARD.length, 12);
    for (const id of expectedRatios) {
      const found = ASPECT_RATIOS_STANDARD.find((item) => item.id === id);
      assert.ok(found, `Expected ratio ${id} to exist in ASPECT_RATIOS_STANDARD`);
    }
  });

  it("maps valid pixel dimensions for all standard ratios in DEFAULT_RATIO_DIMENSIONS", () => {
    for (const item of ASPECT_RATIOS_STANDARD) {
      const dims = DEFAULT_RATIO_DIMENSIONS[item.id];
      assert.ok(dims, `Expected default dimensions for ${item.id}`);
      assert.ok(dims.width > 0);
      assert.ok(dims.height > 0);
      const computedRatio = dims.width / dims.height;
      const expectedRatio = parseAspectRatio(item.id).ratio;
      assert.ok(
        Math.abs(computedRatio - expectedRatio) < 0.01,
        `Ratio mismatch for ${item.id}: computed ${computedRatio} vs expected ${expectedRatio}`
      );
    }
  });

  it("calculates contained canvas dimensions without exceeding parent bounds", () => {
    const availWidth = 1200;
    const availHeight = 800;
    const availRatio = availWidth / availHeight; // 1.5

    // 16:9 (ratio 1.777 > 1.5 => width constrained)
    const { ratio: r16_9 } = parseAspectRatio("16:9");
    const w1 = r16_9 > availRatio ? availWidth : availHeight * r16_9;
    const h1 = r16_9 > availRatio ? availWidth / r16_9 : availHeight;
    assert.ok(w1 <= availWidth);
    assert.ok(h1 <= availHeight);
    assert.strictEqual(Math.round(w1 / h1 * 100), Math.round(r16_9 * 100));

    // 9:16 (ratio 0.5625 < 1.5 => height constrained)
    const { ratio: r9_16 } = parseAspectRatio("9:16");
    const w2 = r9_16 > availRatio ? availWidth : availHeight * r9_16;
    const h2 = r9_16 > availRatio ? availWidth / r9_16 : availHeight;
    assert.ok(w2 <= availWidth);
    assert.ok(h2 <= availHeight);
    assert.strictEqual(Math.round(w2 / h2 * 100), Math.round(r9_16 * 100));
  });

  it("correctly identifies when a vertical mobile mockup is taller than a landscape 16:9 frame", () => {
    const mockupRatio = getMockupRatio(true, "1508 / 3278");
    const { ratio: frameRatio } = parseAspectRatio("16:9");
    assert.strictEqual(isMockupTallerThanFrame(mockupRatio, frameRatio), true);
  });

  it("correctly identifies when a landscape browser mockup is wider than a vertical 9:16 frame", () => {
    const mockupRatio = getMockupRatio(false, "", null, "browser");
    const { ratio: frameRatio } = parseAspectRatio("9:16");
    assert.strictEqual(isMockupTallerThanFrame(mockupRatio, frameRatio), false);
  });
});
