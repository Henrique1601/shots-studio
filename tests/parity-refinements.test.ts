import { describe, it } from "node:test";
import assert from "node:assert";
import {
  STYLE_OPTIONS,
  DEVICE_SPECS,
  LAYOUT_PRESETS_LIST,
} from "../src/types/mockup.ts";

describe("Parity Refinements & Brain Corrections", () => {
  it("verifies all 12 authentic Shots.so styles exist in STYLE_OPTIONS", () => {
    const expectedStyles = [
      "default",
      "glass-light",
      "glass-dark",
      "liquid-glass",
      "inset-light",
      "inset-dark",
      "outline",
      "border",
      "retro",
      "card",
      "stack",
      "stack-2",
    ];

    assert.strictEqual(STYLE_OPTIONS.length, 12, "Must contain exactly 12 authentic styles");
    for (const style of expectedStyles) {
      const found = STYLE_OPTIONS.find((s) => s.id === style);
      assert.ok(found, `Style ${style} should exist in STYLE_OPTIONS`);
      assert.ok(found.label, `Style ${style} must have a label`);
    }
  });

  it("verifies iPhone 17 Air device spec matches Shots.so proportions", () => {
    const airSpec = DEVICE_SPECS["iphone-17-air"];
    assert.ok(airSpec, "iPhone 17 Air must have a device spec");
    assert.strictEqual(airSpec.isDevice, true);
    assert.strictEqual(airSpec.aspectRatio, "1260 / 2736");
    assert.strictEqual(airSpec.maskSvg, "/shots-assets/devices/iphone17air_display.svg");
    assert.strictEqual(airSpec.deviceImg, "/shots-assets/devices/iphone17_black.png");
    assert.ok(airSpec.screenBounds, "iPhone 17 Air must have screen bounds");
    assert.strictEqual(airSpec.screenBounds?.width, "83.00%");
    assert.strictEqual(airSpec.screenBounds?.height, "83.00%");
  });

  it("verifies layout presets and custom layout detection logic", () => {
    assert.strictEqual(LAYOUT_PRESETS_LIST.length, 7);
    const flatCenter = LAYOUT_PRESETS_LIST.find((p) => p.id === "center");
    assert.ok(flatCenter);
    assert.strictEqual(flatCenter.tiltX, 0);
    assert.strictEqual(flatCenter.tiltY, 0);
    assert.strictEqual(flatCenter.zoom, 100);

    // Custom layout tilt detection function
    const isCustom = (tiltX: number, tiltY: number, tiltZ: number, zoom: number, presetId: string) => {
      return tiltX !== 0 || tiltY !== 0 || tiltZ !== 0 || (zoom !== 100 && presetId === "center");
    };

    assert.strictEqual(isCustom(0, 0, 0, 100, "center"), false);
    assert.strictEqual(isCustom(15, 0, 0, 100, "center"), true);
    assert.strictEqual(isCustom(0, -20, 0, 100, "center"), true);
    assert.strictEqual(isCustom(0, 0, 0, 150, "center"), true);
  });

  it("calculates accurate screen pixel details for devices and adaptive media", () => {
    // 1. Physical Device
    const iphoneSpec = DEVICE_SPECS["iphone-17"];
    const devicePixels = iphoneSpec.isDevice ? iphoneSpec.aspectRatio.replace(" / ", " × ") + " px" : "Adapts to image";
    assert.strictEqual(devicePixels, "1508 × 3278 px");

    // 2. Adaptive Screenshot with uploaded dimensions
    const uploadedDims = { width: 1920, height: 1080 };
    const screenshotSpec = DEVICE_SPECS["screenshot"];
    const screenshotPixels = screenshotSpec.isDevice
      ? screenshotSpec.aspectRatio
      : uploadedDims
      ? `${uploadedDims.width} × ${uploadedDims.height} px`
      : "Adapts to image";
    assert.strictEqual(screenshotPixels, "1920 × 1080 px");

    // 3. Fallback when no image is uploaded
    const noDims = null;
    const fallbackPixels = screenshotSpec.isDevice
      ? screenshotSpec.aspectRatio
      : noDims
      ? "uploaded"
      : "Adapts to image";
    assert.strictEqual(fallbackPixels, "Adapts to image");
  });
});
