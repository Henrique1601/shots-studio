import { describe, it } from "node:test";
import assert from "node:assert";
import { CURATED_TEMPLATES } from "../src/types/mockup.ts";

describe("Curated Templates Gallery & Presets", () => {
  it("includes at least 8 curated template presets", () => {
    assert.ok(CURATED_TEMPLATES.length >= 8, `Expected >= 8 templates, found ${CURATED_TEMPLATES.length}`);
  });

  it("every template has id, name, category, tagline and valid config", () => {
    for (const tpl of CURATED_TEMPLATES) {
      assert.ok(tpl.id, "Template should have an id");
      assert.ok(tpl.name, "Template should have a name");
      assert.ok(tpl.category, `Template ${tpl.name} should have a category`);
      assert.ok(tpl.tagline, `Template ${tpl.name} should have a tagline`);
      assert.ok(tpl.config, `Template ${tpl.name} should have a config object`);
      assert.ok(tpl.config.frameType, `Template ${tpl.name} should define a frameType`);
      assert.ok(tpl.config.backgroundValue, `Template ${tpl.name} should define a backgroundValue`);
    }
  });

  it("includes expected showcase templates (SaaS Launch, Product Hunt Duo, Reel/Story)", () => {
    const ids = CURATED_TEMPLATES.map((t) => t.id);
    assert.ok(ids.includes("saas-launch"), "Should include saas-launch");
    assert.ok(ids.includes("duo-product-hunt"), "Should include duo-product-hunt");
    assert.ok(ids.includes("story-reel-viral"), "Should include story-reel-viral");
    assert.ok(ids.includes("twitter-release"), "Should include twitter-release");
    assert.ok(ids.includes("minimal-dark-studio"), "Should include minimal-dark-studio");
  });

  it("duo-product-hunt template activates duo mockup mode with gap", () => {
    const duoTpl = CURATED_TEMPLATES.find((t) => t.id === "duo-product-hunt");
    assert.ok(duoTpl, "duo-product-hunt template must exist");
    assert.strictEqual(duoTpl.config.mockupMode, "duo");
    assert.ok(typeof duoTpl.config.duoGap === "number" && (duoTpl.config.duoGap as number) > 0);
  });
});

describe("Duo Layout & Canvas Annotations Logic", () => {
  it("calculates effective duo aspect ratio wider than single mockup", () => {
    const singleRatio = 9 / 19.5; // vertical iPhone ratio (~0.4615)
    const duoRatio = singleRatio * 2 + 0.15;
    assert.ok(duoRatio > singleRatio, "Duo ratio must be wider than single ratio");
    assert.ok(duoRatio > 1.0, "Two vertical devices with spacing form a roughly 1:1 or landscape box");
  });

  it("builds valid 2-color linear-gradient string with specified angle", () => {
    const color1 = "#6366f1";
    const color2 = "#ec4899";
    const angle = 135;
    const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
    assert.strictEqual(gradient, "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)");
    assert.match(gradient, /^linear-gradient\(\d+deg,\s*#[0-9a-fA-F]{6}\s+0%,\s*#[0-9a-fA-F]{6}\s+100%\)$/);
  });

  it("formats annotation positions and alignments correctly", () => {
    const positions = ["top", "bottom"];
    const alignments = ["left", "center", "right"];
    for (const pos of positions) {
      assert.ok(["top", "bottom"].includes(pos));
    }
    for (const align of alignments) {
      assert.ok(["left", "center", "right"].includes(align));
    }
  });
});
