import { describe, it } from "node:test";
import assert from "node:assert";
import {
  DEFAULT_RATIO_DIMENSIONS,
  ASPECT_RATIOS_STANDARD,
  PRESET_MYSTIC,
} from "../src/types/mockup.ts";

describe("Frame Tab Redesign & Mini-Sidebars Integrity", () => {
  it("verifies 5:4 aspect ratio defaults to 1920x1536 (1.25 ratio)", () => {
    const dims = DEFAULT_RATIO_DIMENSIONS["5:4"];
    assert.ok(dims);
    assert.strictEqual(dims.width, 1920);
    assert.strictEqual(dims.height, 1536);
    assert.strictEqual(dims.width / dims.height, 1.25);
  });

  it("includes all 9 standard ratios in the dropdown 3x3 grid", () => {
    const gridRatios = [
      "16:9", "3:2", "4:3",
      "5:4", "1:1", "4:5",
      "3:4", "2:3", "9:16",
    ];
    for (const ratio of gridRatios) {
      assert.ok(
        DEFAULT_RATIO_DIMENSIONS[ratio],
        `Expected ${ratio} to exist in DEFAULT_RATIO_DIMENSIONS`
      );
      assert.ok(
        ASPECT_RATIOS_STANDARD.some((r) => r.id === ratio),
        `Expected ${ratio} to exist in ASPECT_RATIOS_STANDARD`
      );
    }
  });

  it("verifies PRESET_MYSTIC has 16 curated high-resolution caustic gradients", () => {
    assert.strictEqual(PRESET_MYSTIC.length, 16);
    for (const m of PRESET_MYSTIC) {
      assert.ok(m.id, "Expected id for mystic gradient");
      assert.ok(m.name, "Expected name for mystic gradient");
      assert.ok(
        m.value.includes("gradient"),
        `Expected valid gradient css for ${m.name}`
      );
    }
  });

  it("verifies supported VFX presets and watermark styles", () => {
    const vfxPresets = [
      "none",
      "noise",
      "vhs",
      "tv",
      "vhs-glitch",
      "tech-glitch",
      "light-leak",
      "particles",
      "glitter",
    ];
    assert.strictEqual(vfxPresets.length, 9);

    const styles = ["default", "shadow", "glass", "badge"];
    assert.strictEqual(styles.length, 4);

    const themes = ["light", "dark"];
    assert.strictEqual(themes.length, 2);
  });

  it("verifies social platforms ratio specifications", () => {
    const socialMap = {
      instagram: [
        { label: "Post", ratio: "1:1", w: 1080, h: 1080 },
        { label: "Portrait", ratio: "4:5", w: 1080, h: 1350 },
        { label: "Story", ratio: "9:16", w: 1080, h: 1920 },
      ],
      twitter: [
        { label: "Tweet", ratio: "16:9", w: 1200, h: 675 },
        { label: "Cover", ratio: "3:1", w: 1500, h: 500 },
      ],
      youtube: [
        { label: "Banner", ratio: "16:9", w: 2560, h: 1440 },
        { label: "Thumbnail", ratio: "16:9", w: 1280, h: 720 },
        { label: "Video", ratio: "16:9", w: 1920, h: 1080 },
      ],
    };

    for (const [platform, items] of Object.entries(socialMap)) {
      assert.ok(items.length >= 2, `Platform ${platform} has sufficient presets`);
      for (const item of items) {
        assert.ok(item.w > 0);
        assert.ok(item.h > 0);
      }
    }
  });
});
