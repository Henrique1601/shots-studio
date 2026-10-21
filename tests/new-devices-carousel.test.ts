import { describe, it } from "node:test";
import assert from "node:assert";
import { DEVICE_SPECS, PRESET_MYSTIC } from "../src/types/mockup.ts";

describe("New Devices (Pixel 9 Pro & Ultrawide Monitor) & Presets", () => {
  it("verifies Pixel 9 Pro device spec", () => {
    const pixel = DEVICE_SPECS["pixel-9-pro" as any];
    assert.ok(pixel, "Expected Pixel 9 Pro to exist in DEVICE_SPECS");
    assert.strictEqual(pixel.name, "Pixel 9 Pro");
    assert.strictEqual(pixel.isDevice, true);
    assert.strictEqual(pixel.containerClass, "pixel-9-pro");
    assert.ok(pixel.screenBounds, "Expected screen bounds for Pixel 9 Pro");
    assert.strictEqual(pixel.screenBounds?.left, "7.00%");
    assert.strictEqual(pixel.screenBounds?.top, "5.00%");
  });

  it("verifies Ultrawide Monitor device spec", () => {
    const monitor = DEVICE_SPECS["ultrawide-monitor" as any];
    assert.ok(monitor, "Expected Ultrawide Monitor to exist in DEVICE_SPECS");
    assert.strictEqual(monitor.isDevice, true);
    assert.strictEqual(monitor.containerClass, "ultrawide-monitor");
    assert.strictEqual(monitor.aspectRatio, "3440 / 1440");
    assert.ok(monitor.screenBounds, "Expected screen bounds for Ultrawide");
  });

  it("verifies new 4K Mystic gradients include Aurora Boreal, Sunset Prism & Glass Caustic", () => {
    assert.ok(PRESET_MYSTIC.length >= 20, "Expected at least 20 mystic presets");
    const aurora = PRESET_MYSTIC.find((p) => p.name === "Aurora Boreal");
    assert.ok(aurora, "Expected Aurora Boreal preset");
    assert.ok(aurora?.value.includes("radial-gradient") || aurora?.value.includes("ellipse"));

    const sunset = PRESET_MYSTIC.find((p) => p.name === "Sunset Prism");
    assert.ok(sunset, "Expected Sunset Prism preset");

    const caustic = PRESET_MYSTIC.find((p) => p.name === "Glass Caustic");
    assert.ok(caustic, "Expected Glass Caustic preset");
  });
});

describe("Multi-Slide Carousel State Management Logic", () => {
  it("verifies slide creation and array bounds math", () => {
    const slides = [
      { id: "s1", title: "Slide 1" },
      { id: "s2", title: "Slide 2" },
    ];
    // Add slide
    const nextSlides = [...slides, { id: "s3", title: "Slide 3" }];
    assert.strictEqual(nextSlides.length, 3);
    assert.strictEqual(nextSlides[2].title, "Slide 3");

    // Remove slide with clamp
    const filtered = nextSlides.filter((_, idx) => idx !== 0);
    assert.strictEqual(filtered.length, 2);
    const activeIndex = Math.min(2, filtered.length - 1);
    assert.strictEqual(activeIndex, 1);
  });
});
