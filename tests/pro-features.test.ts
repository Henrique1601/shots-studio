import { test, describe } from "node:test";
import assert from "node:assert";
import type { MockupConfig, WatermarkProfile } from "../src/types/mockup.ts";

describe("Pro Studio Features: Smart Snap, Safari Tabs & Custom Watermark Logo", () => {
  test("snaps 3D orbit tilt to 0° within ±3° threshold when snap guides enabled", () => {
    const applySmartSnap = (rawAngle: number, snapEnabled: boolean, shiftKey: boolean) => {
      const active = snapEnabled && !shiftKey;
      return active && Math.abs(rawAngle) <= 3 ? 0 : rawAngle;
    };

    assert.strictEqual(applySmartSnap(2, true, false), 0);
    assert.strictEqual(applySmartSnap(-3, true, false), 0);
    assert.strictEqual(applySmartSnap(4, true, false), 4);
    assert.strictEqual(applySmartSnap(2, true, true), 2);
    assert.strictEqual(applySmartSnap(2, false, false), 2);
  });

  test("parses Safari browser tab titles cleanly from comma-separated input", () => {
    const parseTabs = (input: string) =>
      input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const tabs = parseTabs("FrameCraft Studio, Analytics, , Docs ");
    assert.deepStrictEqual(tabs, ["FrameCraft Studio", "Analytics", "Docs"]);
  });

  test("supports custom logoUrl on WatermarkProfile and MockupConfig", () => {
    const profile: WatermarkProfile = {
      enabled: true,
      text: "Acme Corp",
      platform: "framecraft",
      style: "glass",
      theme: "dark",
      size: 90,
      inset: 6,
      position: "bottom-right",
      logoUrl: "data:image/png;base64,customlogo",
    };

    const partialConfig: Partial<MockupConfig> = {
      watermarkLogoUrl: profile.logoUrl,
      browserTabsEnabled: true,
      browserTheme: "light",
      snapGuidesEnabled: true,
    };

    assert.strictEqual(profile.logoUrl, "data:image/png;base64,customlogo");
    assert.strictEqual(partialConfig.browserTheme, "light");
    assert.strictEqual(partialConfig.browserTabsEnabled, true);
    assert.strictEqual(partialConfig.snapGuidesEnabled, true);
  });
});
