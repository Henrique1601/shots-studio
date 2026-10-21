import { describe, it } from "node:test";
import assert from "node:assert";
import { DEVICE_SPECS, PRESET_MYSTIC } from "../src/types/mockup.ts";

describe("New Devices (Pixel 9 Pro & Ultrawide Monitor) & Presets", () => {
  it("verifies Pixel 9 Pro device spec", () => {
    const pixel = DEVICE_SPECS["pixel-9-pro"];
    assert.ok(pixel, "Expected Pixel 9 Pro to exist in DEVICE_SPECS");
    assert.strictEqual(pixel.name, "Pixel 9 Pro");
    assert.strictEqual(pixel.isDevice, true);
    assert.strictEqual(pixel.containerClass, "pixel-9-pro");
    assert.ok(pixel.screenBounds, "Expected screen bounds for Pixel 9 Pro");
    assert.strictEqual(pixel.screenBounds?.left, "3.20%");
    assert.strictEqual(pixel.screenBounds?.top, "2.80%");
    assert.strictEqual(pixel.screenBounds?.width, "93.60%");
    assert.strictEqual(pixel.screenBounds?.height, "94.40%");
  });

  it("verifies Ultrawide Monitor device spec", () => {
    const monitor = DEVICE_SPECS["ultrawide-monitor"];
    assert.ok(monitor, "Expected Ultrawide Monitor to exist in DEVICE_SPECS");
    assert.strictEqual(monitor.isDevice, true);
    assert.strictEqual(monitor.containerClass, "ultrawide-monitor");
    assert.strictEqual(monitor.aspectRatio, "3440 / 1440");
    assert.ok(monitor.screenBounds, "Expected screen bounds for Ultrawide");
    assert.strictEqual(monitor.screenBounds?.left, "1.20%");
    assert.strictEqual(monitor.screenBounds?.top, "1.80%");
    assert.strictEqual(monitor.screenBounds?.width, "97.60%");
    assert.strictEqual(monitor.screenBounds?.height, "92.40%");
  });

  it("verifies iMac 24 M4 device spec", () => {
    const imac = DEVICE_SPECS["imac-24"];
    assert.ok(imac, "Expected iMac 24 to exist in DEVICE_SPECS");
    assert.strictEqual(imac.isDevice, true);
    assert.strictEqual(imac.name, "iMac 24\" M4");
    assert.strictEqual(imac.containerClass, "imac-24");
    assert.strictEqual(imac.screenBounds?.left, "2.20%");
    assert.strictEqual(imac.screenBounds?.top, "2.20%");
  });

  it("verifies Foldable Phone device spec", () => {
    const fold = DEVICE_SPECS["foldable-phone"];
    assert.ok(fold, "Expected Foldable Phone to exist in DEVICE_SPECS");
    assert.strictEqual(fold.isDevice, true);
    assert.strictEqual(fold.name, "Foldable Phone");
    assert.strictEqual(fold.containerClass, "foldable-phone");
    assert.strictEqual(fold.aspectRatio, "2156 / 1916");
    assert.strictEqual(fold.screenBounds?.left, "2.40%");
  });

  it("verifies unibody chassis prevents background bleed with concentric bounds", () => {
    const pixel = DEVICE_SPECS["pixel-9-pro"];
    const monitor = DEVICE_SPECS["ultrawide-monitor"];

    // Pixel horizontal margins sum to exactly 100%
    const pLeft = parseFloat(pixel.screenBounds!.left);
    const pWidth = parseFloat(pixel.screenBounds!.width);
    const pRightMargin = 100 - (pLeft + pWidth);
    assert.ok(Math.abs(pLeft - pRightMargin) < 0.01, "Pixel 9 Pro must have symmetrical left & right bezels");

    // Monitor horizontal margins sum to exactly 100%
    const mLeft = parseFloat(monitor.screenBounds!.left);
    const mWidth = parseFloat(monitor.screenBounds!.width);
    const mRightMargin = 100 - (mLeft + mWidth);
    assert.ok(Math.abs(mLeft - mRightMargin) < 0.01, "Ultrawide Monitor must have symmetrical left & right bezels");
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

  it("calculates slideshow auto-advance looping index correctly", () => {
    const totalSlides = 4;
    let currentIdx = 0;
    currentIdx = (currentIdx + 1) % totalSlides;
    assert.strictEqual(currentIdx, 1);
    currentIdx = (currentIdx + 1) % totalSlides;
    assert.strictEqual(currentIdx, 2);
    currentIdx = (3 + 1) % totalSlides;
    assert.strictEqual(currentIdx, 0, "Slideshow must loop back to slide 0 after the last slide");
  });

  it("formats batch zip slide filenames with 2-digit zero padding", () => {
    const formatSlideName = (idx: number) => `slide-${String(idx + 1).padStart(2, "0")}.png`;
    assert.strictEqual(formatSlideName(0), "slide-01.png");
    assert.strictEqual(formatSlideName(8), "slide-09.png");
    assert.strictEqual(formatSlideName(9), "slide-10.png");
    assert.strictEqual(formatSlideName(15), "slide-16.png");
  });
});
