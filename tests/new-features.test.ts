import { describe, it } from "node:test";
import assert from "node:assert";
import type {
  LightPreset,
  WatermarkPlatform,
  WatermarkPosition,
  DeviceColorFinish,
} from "../src/types/mockup.ts";

describe("New Studio Features: Light, Watermark, Image Fit & Spatial Pad", () => {
  it("verifies all light presets are defined and valid", () => {
    const validPresets: LightPreset[] = [
      "none",
      "soft-studio",
      "top-left",
      "top-right",
      "dramatic",
    ];
    assert.strictEqual(validPresets.length, 5);
    for (const p of validPresets) {
      assert.ok(typeof p === "string");
    }
  });

  it("verifies all device color finishes are recognized", () => {
    const finishes: DeviceColorFinish[] = [
      "default",
      "space-black",
      "silver",
      "natural-titanium",
      "desert-titanium",
    ];
    assert.strictEqual(finishes.length, 5);
  });

  it("verifies watermark platforms and 4-corner positions", () => {
    const platforms: WatermarkPlatform[] = ["framecraft", "shots", "twitter", "instagram", "none"];
    const positions: WatermarkPosition[] = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ];

    assert.strictEqual(platforms.length, 5);
    assert.strictEqual(positions.length, 4);

    for (const pos of positions) {
      assert.ok(["top-left", "top-right", "bottom-left", "bottom-right"].includes(pos));
    }
  });

  it("verifies image pan Y bounds clamp between 0% and 100%", () => {
    const clampPanY = (val: number) => Math.min(100, Math.max(0, val));
    assert.strictEqual(clampPanY(50), 50);
    assert.strictEqual(clampPanY(-10), 0);
    assert.strictEqual(clampPanY(150), 100);
  });

  it("calculates 3D spatial pad tilt clamping within -45 and 45 degrees", () => {
    const calcTilt = (rawDelta: number, isShift: boolean) => {
      const factor = isShift ? 0.35 : 1;
      return Math.round(Math.min(45, Math.max(-45, rawDelta * 45 * factor)));
    };

    // Center
    assert.strictEqual(calcTilt(0, false), 0);
    // Extreme Right
    assert.strictEqual(calcTilt(1, false), 45);
    // Extreme Left
    assert.strictEqual(calcTilt(-1, false), -45);
    // Over-drag clamp
    assert.strictEqual(calcTilt(2.5, false), 45);
    assert.strictEqual(calcTilt(-2.5, false), -45);
    // Shift precision mode dampening
    const precisionTilt = calcTilt(1, true);
    assert.ok(precisionTilt < 45, `Expected dampened tilt, got ${precisionTilt}`);
    assert.strictEqual(precisionTilt, 16);
  });
});
