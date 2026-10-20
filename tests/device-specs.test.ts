import { describe, it } from "node:test";
import assert from "node:assert";
import { DEVICE_SPECS, PRESET_GRADIENTS } from "../src/types/mockup.ts";

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
});
