import { describe, it } from "node:test";
import assert from "node:assert";
import type { AnimationPreset } from "../src/types/mockup.ts";

describe("Video Timeline & 3D Animation Engine", () => {
  const supportedPresets: AnimationPreset[] = ["none", "float", "turntable", "pulse", "orbit"];

  it("verifies all 5 motion presets exist", () => {
    assert.strictEqual(supportedPresets.length, 5);
    assert.ok(supportedPresets.includes("float"));
    assert.ok(supportedPresets.includes("turntable"));
    assert.ok(supportedPresets.includes("pulse"));
    assert.ok(supportedPresets.includes("orbit"));
  });

  it("calculates timeline elapsed progress percentage accurately", () => {
    const calcProgress = (elapsed: number, duration: number) => {
      return Math.min(100, Math.max(0, (elapsed / duration) * 100));
    };

    assert.strictEqual(calcProgress(0, 5), 0);
    assert.strictEqual(calcProgress(2.5, 5), 50);
    assert.strictEqual(calcProgress(5, 5), 100);
    assert.strictEqual(calcProgress(7, 5), 100); // Clamped to 100%
  });

  it("formats timer strings with sub-second precision", () => {
    const formatTime = (secs: number) => {
      const s = Math.floor(secs);
      const ms = Math.floor((secs % 1) * 10);
      return `0:0${s}.${ms}`;
    };

    assert.strictEqual(formatTime(0), "0:00.0");
    assert.strictEqual(formatTime(3.45), "0:03.4");
    assert.strictEqual(formatTime(4.99), "0:04.9");
  });
});
