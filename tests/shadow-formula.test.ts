import { describe, it } from "node:test";
import assert from "node:assert";

describe("FrameCraft Studio 4-Layer Shadow Formulas", () => {
  const getFrameCraftShadow = (shadowMode: "none" | "spread" | "hug" | "adaptive", shadowOpacity: number) => {
    if (shadowMode === "none") return "none";
    const opacity = (shadowOpacity / 100) * 0.4;
    switch (shadowMode) {
      case "spread":
        return `rgba(0, 0, 0, ${opacity * 1.5}) 0px 25px 50px -12px, rgba(0, 0, 0, ${opacity}) 0px 0px 30px 0px`;
      case "hug":
        return `rgba(0, 0, 0, ${opacity * 1.8}) 0px 8px 24px -4px, rgba(0, 0, 0, ${opacity}) 0px 2px 6px 0px`;
      case "adaptive":
      default:
        return `rgba(0, 0, 0, ${opacity}) 0px 10.472px 15.708px -23.8px, rgba(0, 0, 0, ${opacity}) 0px 31.416px 47.124px -23.8px, rgba(0, 0, 0, ${opacity}) 0px 62.832px 94.2481px -23.8px, rgba(0, 0, 0, ${opacity}) 0px 104.72px 157.08px -23.8px`;
    }
  };

  it("returns 'none' when shadowMode is none", () => {
    assert.strictEqual(getFrameCraftShadow("none", 40), "none");
  });

  it("returns spread formula with correct opacity scalar", () => {
    const shadow = getFrameCraftShadow("spread", 40);
    assert.ok(shadow.includes("0px 25px 50px -12px"));
    assert.ok(shadow.includes("rgba(0, 0, 0, 0.24"));
  });

  it("returns hug formula with tight offset box shadow", () => {
    const shadow = getFrameCraftShadow("hug", 50);
    assert.ok(shadow.includes("0px 8px 24px -4px"));
    assert.ok(shadow.includes("rgba(0, 0, 0, 0.36"));
  });

  it("returns official 4-layer adaptive shadow with 4 rgba entries", () => {
    const shadow = getFrameCraftShadow("adaptive", 40);
    const rgbaCount = (shadow.match(/rgba/g) || []).length;
    assert.strictEqual(rgbaCount, 4);
    assert.ok(shadow.includes("104.72px 157.08px -23.8px"));
  });
});
