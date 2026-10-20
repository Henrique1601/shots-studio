import { describe, it } from "node:test";
import assert from "node:assert";
import {
  DEVICE_SPECS,
  SOCIAL_MEDIA_PRESETS,
  PRESET_PAPER_GLASS,
  PRESET_TAHOE,
  SHAPES_LAYOUTS,
} from "../src/types/mockup.ts";
import { generateHarmonicGradients } from "../src/utils/magicPalette.ts";

describe("Elite Features: Magic Palette, Code Snippet, Social Presets & Backgrounds", () => {
  it("verifies code frame specification in DEVICE_SPECS", () => {
    const codeSpec = DEVICE_SPECS["code"];
    assert.ok(codeSpec, "code frame type must be registered in DEVICE_SPECS");
    assert.strictEqual(codeSpec.isDevice, false);
    assert.strictEqual(codeSpec.name, "Code Snippet");
    assert.strictEqual(codeSpec.aspectRatio, "16 / 10");
  });

  it("generates 4 valid harmonic gradients from color inputs via Magic Palette", () => {
    const grads = generateHarmonicGradients("#6366f1", "#ec4899", "#090d16");
    assert.strictEqual(grads.length, 4, "Should generate exactly 4 harmonic gradients");

    for (const g of grads) {
      assert.ok(g.id, "Gradient must have an id");
      assert.ok(g.name, "Gradient must have a descriptive title");
      assert.ok(g.css.includes("gradient"), "CSS must contain gradient functions");
      assert.ok(g.preview.includes("gradient"), "Preview must contain gradient function");
    }

    assert.ok(grads[0].css.includes("#6366f1"));
    assert.ok(grads[0].css.includes("#ec4899"));
  });

  it("verifies all social media resolution presets have correct dimensions and platform", () => {
    assert.ok(SOCIAL_MEDIA_PRESETS.length >= 8, "Must contain at least 8 social media presets");

    const expectedPlatforms = ["twitter", "instagram", "linkedin", "dribbble", "youtube", "producthunt"];
    for (const plat of expectedPlatforms) {
      const found = SOCIAL_MEDIA_PRESETS.some((p) => p.platform === plat);
      assert.ok(found, `Must contain preset for platform ${plat}`);
    }

    for (const p of SOCIAL_MEDIA_PRESETS) {
      assert.ok(p.width > 0, `${p.name} width must be positive`);
      assert.ok(p.height > 0, `${p.name} height must be positive`);
      assert.ok(p.badge.includes("×"), `${p.name} badge should display dimensions`);
    }

    // Verify Twitter post and Instagram square dimensions
    const twPost = SOCIAL_MEDIA_PRESETS.find((p) => p.id === "twitter-post");
    assert.strictEqual(twPost?.width, 1200);
    assert.strictEqual(twPost?.height, 675);

    const igSquare = SOCIAL_MEDIA_PRESETS.find((p) => p.id === "instagram-square");
    assert.strictEqual(igSquare?.width, 1080);
    assert.strictEqual(igSquare?.height, 1080);
  });

  it("verifies enhanced paper glass presets have rich 4K gradient values", () => {
    assert.ok(PRESET_PAPER_GLASS.length >= 5, "Must have at least 5 glass presets");
    for (const p of PRESET_PAPER_GLASS) {
      assert.ok(p.name.includes("4K"), `Glass preset ${p.name} should be high resolution`);
      assert.ok(p.value.includes("radial-gradient"), "Glass value must include radial caustics");
      assert.ok(p.value.includes("linear-gradient"), "Glass value must include linear base");
    }
  });

  it("verifies enhanced Tahoe presets are valid 4K landscape assets", () => {
    assert.ok(PRESET_TAHOE.length >= 4, "Must have at least 4 Tahoe presets");
    for (const t of PRESET_TAHOE) {
      assert.ok(t.value.includes("url('https://images.unsplash.com/"), "Tahoe must reference 4K Unsplash wallpapers");
      assert.ok(t.value.includes("center/cover no-repeat"), "Tahoe must contain background positioning");
    }
  });

  it("verifies shapes layouts include new dynamic scenes and zero-blur retina clarity", () => {
    assert.ok(SHAPES_LAYOUTS.length >= 10, "Should have 10 rich shapes layouts");

    const layoutNames = SHAPES_LAYOUTS.map((l) => l.name);
    assert.ok(layoutNames.includes("layout-constellation"));
    assert.ok(layoutNames.includes("layout-vortex"));
    assert.ok(layoutNames.includes("layout-diagonal"));
    assert.ok(layoutNames.includes("layout-hero-duo"));

    for (const l of SHAPES_LAYOUTS) {
      for (const shape of l.layout) {
        assert.ok(shape.blur <= 1, `Shape in ${l.name} should have crisp retina blur (<= 1px)`);
        assert.ok(shape.scale > 0, "Shape scale must be positive");
      }
    }
  });
});
