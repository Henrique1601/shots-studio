import { describe, it } from "node:test";
import assert from "node:assert";

describe("Intelligent Auto-Contain & Aspect Ratio Math", () => {
  const getFrameRatio = (aspectRatio: string, customWidth?: number, customHeight?: number): number => {
    if (aspectRatio === "custom") {
      return (customWidth || 1920) / (customHeight || 1080);
    }
    const [w, h] = aspectRatio.split(":").map(Number);
    if (w && h) return w / h;
    return 16 / 9;
  };

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
    const ratio = getFrameRatio("16:9");
    assert.strictEqual(ratio, 16 / 9);
  });

  it("calculates standard 1:1 square frame ratio accurately", () => {
    const ratio = getFrameRatio("1:1");
    assert.strictEqual(ratio, 1);
  });

  it("calculates vertical 9:16 mobile frame ratio accurately", () => {
    const ratio = getFrameRatio("9:16");
    assert.strictEqual(ratio, 9 / 16);
  });

  it("calculates custom dimensions ratio correctly", () => {
    const ratio = getFrameRatio("custom", 2560, 1440);
    assert.strictEqual(ratio, 2560 / 1440);
  });

  it("correctly identifies when a vertical mobile mockup is taller than a landscape 16:9 frame", () => {
    // iPhone 17 (1508 / 3278 ~ 0.46) in 16:9 (1.777)
    const mockupRatio = getMockupRatio(true, "1508 / 3278");
    const frameRatio = getFrameRatio("16:9");
    assert.strictEqual(isMockupTallerThanFrame(mockupRatio, frameRatio), true);
  });

  it("correctly identifies when a landscape browser mockup is wider than a vertical 9:16 frame", () => {
    // Browser (16 / 10 = 1.6) in 9:16 (0.5625)
    const mockupRatio = getMockupRatio(false, "", null, "browser");
    const frameRatio = getFrameRatio("9:16");
    assert.strictEqual(isMockupTallerThanFrame(mockupRatio, frameRatio), false);
  });
});
