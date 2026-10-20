import { describe, it } from "node:test";
import assert from "node:assert";
import { DEVICE_SPECS, PRESET_GRADIENTS, SHAPES_LAYOUTS } from "../src/types/mockup.ts";

describe("Device Specs and Preset Integrity", () => {
  it("includes all supported frame types with valid aspect ratios", () => {
    const requiredFrames = [
      "screenshot",
      "browser",
      "minimal-desktop",
      "iphone-17",
      "iphone-16-pro",
      "macbook",
      "ipad-pro",
      "watch",
    ];

    for (const frame of requiredFrames) {
      const spec = DEVICE_SPECS[frame as keyof typeof DEVICE_SPECS];
      assert.ok(spec, `Frame ${frame} should have a spec defined`);
      assert.ok(spec.name, `Frame ${frame} must have a name`);
      assert.ok(spec.aspectRatio.includes("/"), `Frame ${frame} aspect ratio should contain '/'`);
    }
  });

  it("verifies screenBounds for physical device mockups", () => {
    const physicalDevices = ["iphone-17", "iphone-16-pro", "macbook", "ipad-pro", "watch"] as const;

    for (const device of physicalDevices) {
      const spec = DEVICE_SPECS[device];
      assert.strictEqual(spec.isDevice, true);
      assert.ok(spec.screenBounds, `Device ${device} must have screenBounds`);
      assert.ok(spec.screenBounds.width.endsWith("%"));
      assert.ok(spec.screenBounds.height.endsWith("%"));
      assert.ok(spec.maskSvg, `Device ${device} must have maskSvg`);
    }

    // Verify calibrated bounds for specific devices
    assert.strictEqual(DEVICE_SPECS["watch"].screenBounds?.top, "25.09%");
    assert.strictEqual(DEVICE_SPECS["watch"].screenBounds?.height, "50.00%");
    assert.strictEqual(DEVICE_SPECS["macbook"].screenBounds?.top, "18.65%");
    assert.strictEqual(DEVICE_SPECS["macbook"].screenBounds?.height, "64.67%");
    assert.strictEqual(DEVICE_SPECS["iphone-17"].screenBounds?.top, "10.00%");
    assert.strictEqual(DEVICE_SPECS["iphone-17"].screenBounds?.height, "80.00%");
  });

  it("verifies all preset gradients are valid linear-gradient syntax", () => {
    assert.ok(PRESET_GRADIENTS.length >= 12, "Should contain at least 12 rich gradient presets");
    for (const grad of PRESET_GRADIENTS) {
      assert.ok(grad.id, "Gradient must have an id");
      assert.ok(grad.name, "Gradient must have a name");
      assert.ok(
        grad.value.startsWith("linear-gradient"),
        `Gradient ${grad.id} must be a valid linear-gradient`
      );
    }
  });

  it("verifies shapes layouts have at least 6 rich presets", () => {
    assert.ok(SHAPES_LAYOUTS.length >= 6, "Should contain at least 6 shape layouts");
    for (const l of SHAPES_LAYOUTS) {
      assert.ok(l.name, "Layout must have a name");
      assert.ok(l.layout.length >= 4, "Layout must have at least 4 shape positions");
    }
  });
});
