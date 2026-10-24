import { useState, useRef } from "react";
import { useMockupStore } from "@/store/mockupStore";

export function useCanvasOrbit() {
  const { config, updateConfig, showToast } = useMockupStore();
  const [isOrbiting, setIsOrbiting] = useState(false);
  const orbitStartRef = useRef<{ x: number; y: number; tiltX: number; tiltY: number } | null>(null);

  const handlePointerDownOrbit = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest(".cursor-pointer")
    ) {
      return;
    }

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    setIsOrbiting(true);
    orbitStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      tiltX: config.tiltX,
      tiltY: config.tiltY,
    };
  };

  const handlePointerMoveOrbit = (e: React.PointerEvent) => {
    if (!isOrbiting || !orbitStartRef.current) return;

    const deltaX = e.clientX - orbitStartRef.current.x;
    const deltaY = e.clientY - orbitStartRef.current.y;

    // Shift key enables precision micro-adjustments
    const factor = e.shiftKey ? 0.08 : 0.22;
    const newTiltY = Math.round(
      Math.max(-45, Math.min(45, orbitStartRef.current.tiltY + deltaX * factor))
    );
    const newTiltX = Math.round(
      Math.max(-45, Math.min(45, orbitStartRef.current.tiltX - deltaY * factor))
    );

    updateConfig({
      tiltX: newTiltX,
      tiltY: newTiltY,
    });
  };

  const handlePointerUpOrbit = (e: React.PointerEvent) => {
    if (isOrbiting) {
      setIsOrbiting(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      orbitStartRef.current = null;
    }
  };

  const handleDoubleClickCanvas = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest(".cursor-pointer")
    ) {
      return;
    }
    updateConfig({ tiltX: 0, tiltY: 0 });
    showToast("Rotação 3D resetada (0°, 0°)", "info");
  };

  return {
    isOrbiting,
    handlePointerDownOrbit,
    handlePointerMoveOrbit,
    handlePointerUpOrbit,
    handleDoubleClickCanvas,
  };
}
