"use client";

import React, { useState, useRef } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { LAYOUT_PRESETS_LIST } from "@/types/mockup";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export const RightSidebar = () => {
  const { config, updateConfig, showToast } = useMockupStore();
  const [activeMode, setActiveMode] = useState<"zoom" | "tilt">("zoom");
  const padRef = useRef<HTMLDivElement>(null);
  const [isDraggingPad, setIsDraggingPad] = useState(false);
  const isCustomTilted = config.tiltX !== 0 || config.tiltY !== 0 || config.tiltZ !== 0 || (config.zoom !== 100 && config.layoutPreset === "center");

  const updateTiltFromPointer = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rawDeltaX = (e.clientX - centerX) / (rect.width / 2);
    const rawDeltaY = (e.clientY - centerY) / (rect.height / 2);

    const factor = e.shiftKey ? 0.35 : 1;
    const newTiltY = Math.round(Math.min(45, Math.max(-45, rawDeltaX * 45 * factor)));
    const newTiltX = Math.round(Math.min(45, Math.max(-45, -rawDeltaY * 45 * factor)));

    updateConfig({ tiltX: newTiltX, tiltY: newTiltY });
  };

  const handlePadPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingPad(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateTiltFromPointer(e);
  };

  const handlePadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPad) return;
    updateTiltFromPointer(e);
  };

  const handlePadPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingPad) {
      setIsDraggingPad(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePadDoubleClick = () => {
    updateConfig({ tiltX: 0, tiltY: 0, tiltZ: 0 });
    showToast("Ângulo 3D resetado para o centro! 🎯", "info");
  };

  return (
    <aside className="hidden lg:flex w-[228px] shrink-0 bg-[#1c1c1c] rounded-2xl flex-col h-[calc(100vh-6.5rem)] my-auto mr-3 select-none text-white overflow-hidden shadow-2xl border border-white/5">
      {/* Device Mode / Multi-Device Layout: 1 (Single), 2 (Duo), 3 (Trio) */}
      <div className="p-2 border-b border-[#262626]">
        <div className="flex bg-[#141414] p-0.5 rounded-xl">
          <button
            onClick={() => {
              updateConfig({ mockupMode: "single" });
              showToast("Layout: 1 Aparelho (Single) 📱", "info");
            }}
            title="Single Device (1)"
            className={`flex-1 py-1 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              config.mockupMode === "single"
                ? "bg-[#282828] text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span
              className={`w-1.5 h-3 rounded-sm ${
                config.mockupMode === "single" ? "bg-white" : "bg-neutral-500"
              }`}
            />
          </button>
          <button
            onClick={() => {
              updateConfig({ mockupMode: "duo" });
              showToast("Layout: 2 Aparelhos (Duo) 📱📱", "info");
            }}
            title="Duo Devices (2)"
            className={`flex-1 py-1 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              config.mockupMode === "duo"
                ? "bg-[#282828] text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span className="flex space-x-0.5">
              <span
                className={`w-1 h-3 rounded-sm ${
                  config.mockupMode === "duo" ? "bg-white" : "bg-neutral-500"
                }`}
              />
              <span
                className={`w-1 h-3 rounded-sm ${
                  config.mockupMode === "duo" ? "bg-white" : "bg-neutral-500"
                }`}
              />
            </span>
          </button>
          <button
            onClick={() => {
              updateConfig({ mockupMode: "trio" });
              showToast("Layout: 3 Aparelhos (Trio) 📱📱📱", "info");
            }}
            title="Trio Devices (3)"
            className={`flex-1 py-1 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              config.mockupMode === "trio"
                ? "bg-[#282828] text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span className="flex space-x-0.5">
              <span
                className={`w-0.5 h-3 rounded-sm ${
                  config.mockupMode === "trio" ? "bg-white" : "bg-neutral-500"
                }`}
              />
              <span
                className={`w-0.5 h-3 rounded-sm ${
                  config.mockupMode === "trio" ? "bg-white" : "bg-neutral-500"
                }`}
              />
              <span
                className={`w-0.5 h-3 rounded-sm ${
                  config.mockupMode === "trio" ? "bg-white" : "bg-neutral-500"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {/* Zoom vs Tilt Segmented Control */}
        <div>
          <div className="flex bg-[#141414] p-0.5 rounded-xl mb-2.5">
            <button
              onClick={() => setActiveMode("zoom")}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeMode === "zoom"
                  ? "bg-[#282828] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Zoom
            </button>
            <button
              onClick={() => setActiveMode("tilt")}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeMode === "tilt"
                  ? "bg-[#282828] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Tilt
            </button>
          </div>

          {/* Interactive Spatial Pad (3D orientation indicator with Drag & Drop) */}
          <div
            ref={padRef}
            onPointerDown={handlePadPointerDown}
            onPointerMove={handlePadPointerMove}
            onPointerUp={handlePadPointerUp}
            onDoubleClick={handlePadDoubleClick}
            className={cn(
              "w-full h-28 rounded-xl bg-[#141414] flex items-center justify-center relative overflow-hidden select-none border transition-colors",
              isDraggingPad
                ? "border-cyan-500/80 cursor-grabbing shadow-inner shadow-cyan-500/10"
                : "border-white/5 hover:border-white/20 cursor-grab"
            )}
            title="Arraste para rotacionar 3D (Shift para precisão, clique duplo para resetar)"
          >
            {/* Subtle Crosshair grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/40" />
              <div className="h-full w-[1px] bg-white/40 absolute" />
            </div>

            {/* 3D Wireframe / Plate that tilts in 3D */}
            <div
              style={{
                transform: `perspective(300px) rotateX(${config.tiltX}deg) rotateY(${config.tiltY}deg) rotateZ(${config.tiltZ}deg) scale(${config.zoom / 180})`,
                transition: isDraggingPad ? "none" : "transform 0.125s ease-out",
              }}
              className="w-20 h-14 rounded-lg bg-[#242424] border border-white/25 shadow-xl flex items-center justify-center relative pointer-events-none"
            >
              {/* Dynamic illuminated indicator dot */}
              <div className="w-5 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300" />
              </div>
            </div>

            {/* Helper Labels */}
            <div className="absolute bottom-1.5 inset-x-0 text-center text-[10px] text-neutral-400 font-sans pointer-events-none">
              {isDraggingPad ? `X: ${config.tiltX}° · Y: ${config.tiltY}°` : "Hold ⇧ for precision"}
            </div>
          </div>

          {/* Exact Shots.so Zoom Slider (75% to 400%) */}
          {activeMode === "zoom" ? (
            <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#222222] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px] font-medium">Zoom</span>
              <div className="flex items-center space-x-2.5 flex-1 max-w-[130px] ml-2">
                <input
                  type="range"
                  min="75"
                  max="400"
                  value={config.zoom}
                  onChange={(e) =>
                    updateConfig({ zoom: Number(e.target.value) })
                  }
                  className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[11px] text-white font-mono w-9 text-right font-medium">
                  {config.zoom}%
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-neutral-400 text-[11px]">Tilt X</span>
                <div className="flex items-center space-x-2 w-32">
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={config.tiltX}
                    onChange={(e) =>
                      updateConfig({ tiltX: Number(e.target.value) })
                    }
                    className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-300 w-6 text-right font-mono">
                    {config.tiltX}°
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-neutral-400 text-[11px]">Tilt Y</span>
                <div className="flex items-center space-x-2 w-32">
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={config.tiltY}
                    onChange={(e) =>
                      updateConfig({ tiltY: Number(e.target.value) })
                    }
                    className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-300 w-6 text-right font-mono">
                    {config.tiltY}°
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LAYOUT PRESETS (or BASE LAYOUT when flat) */}
        <div>
          <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-2">
            {isCustomTilted ? "LAYOUT PRESETS" : "BASE LAYOUT"}
          </div>

          <div className="space-y-2">
            {/* Custom Layout Card (Shows prominently with white border when tilted away from flat center) */}
            {isCustomTilted && (
              <div className="w-full p-1.5 rounded-xl border border-white/80 bg-[#262626] text-left transition-all relative overflow-hidden shadow-lg">
                <div className="w-full h-20 rounded-lg bg-black/40 flex items-center justify-center relative overflow-hidden">
                  <div
                    style={{
                      transform: `perspective(300px) rotateX(${config.tiltX}deg) rotateY(${config.tiltY}deg) rotateZ(${config.tiltZ}deg) scale(${Math.min(1.4, config.zoom / 180)})`,
                    }}
                    className="w-24 h-16 rounded-md bg-[#161616] border border-white/30 shadow-2xl flex items-center justify-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                  </div>

                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                    <button
                      onClick={() =>
                        updateConfig({
                          tiltX: 0,
                          tiltY: 0,
                          tiltZ: 0,
                          zoom: 100,
                          layoutPreset: "center",
                        })
                      }
                      className="px-3 py-1 rounded-full bg-black/90 hover:bg-black border border-white/30 text-[10px] font-semibold text-white flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 cursor-pointer"
                      title="Reset to Flat Center"
                    >
                      <X className="w-3 h-3 text-neutral-300" />
                      <span>Custom Layout</span>
                    </button>
                  </div>
                </div>
                <div className="mt-1 px-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white">
                    Custom Layout
                  </span>
                  <span className="text-[9px] text-neutral-400 font-mono">
                    {config.zoom}%
                  </span>
                </div>
              </div>
            )}

            {LAYOUT_PRESETS_LIST.map((preset) => {
              const isSelected = !isCustomTilted && config.layoutPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() =>
                    updateConfig({
                      layoutPreset: preset.id,
                      tiltX: preset.tiltX,
                      tiltY: preset.tiltY,
                      tiltZ: preset.tiltZ,
                      zoom: preset.zoom,
                    })
                  }
                  className={`w-full p-1.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "border-white bg-[#262626]"
                      : "border-transparent bg-[#222222] hover:bg-[#282828]"
                  }`}
                >
                  <div className="w-full h-20 rounded-lg bg-black/40 flex items-center justify-center relative overflow-hidden">
                    <div
                      style={{
                        transform: `perspective(300px) rotateX(${preset.tiltX}deg) rotateY(${preset.tiltY}deg) rotateZ(${preset.tiltZ}deg) scale(0.6)`,
                      }}
                      className="w-24 h-16 rounded-md bg-[#161616] border border-white/20 shadow-lg flex items-center justify-center"
                    >
                      <div className="w-3 h-3 rounded-full bg-white/20" />
                    </div>
                  </div>
                  <div className="mt-1 px-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-neutral-300">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">
                      {preset.zoom}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
