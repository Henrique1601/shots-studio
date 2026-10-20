"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { LAYOUT_PRESETS_LIST } from "@/types/mockup";
import {
  Upload,
  Copy,
  SlidersHorizontal,
  X,
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import confetti from "canvas-confetti";

export const RightSidebar = () => {
  const { config, updateConfig, showToast } = useMockupStore();
  const [activeMode, setActiveMode] = useState<"zoom" | "tilt">("zoom");
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = {
    quality: 0.95,
    pixelRatio: config.exportScale,
    cacheBust: false,
    skipFonts: true,
    filter: (node: HTMLElement) => {
      if (node.tagName === "SCRIPT" || node.tagName === "INPUT") return false;
      return true;
    },
  };

  const handleExport = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    try {
      setIsExporting(true);
      const dataUrl = await htmlToImage.toPng(node, exportOptions);
      const link = document.createElement("a");
      link.download = `shot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.15 },
      });
      showToast(`Exportado com sucesso (${config.exportFormat})! 🚀`);
    } catch (err) {
      console.error("Export error:", err);
      showToast("Erro ao exportar", "warning");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;
    try {
      const blob = await htmlToImage.toBlob(node, exportOptions);
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showToast("Copiado para a área de transferência! 📋");
      }
    } catch (e) {
      console.error("Copy error:", e);
      showToast("Erro ao copiar", "warning");
    }
  };

  return (
    <aside className="hidden lg:flex w-[228px] shrink-0 bg-[#1c1c1c] rounded-2xl flex-col h-[calc(100vh-6.5rem)] my-auto mr-3 select-none text-white overflow-hidden shadow-2xl border border-white/5">
      {/* Top Export Bar */}
      <div className="p-2 border-b border-[#262626] space-y-2">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 rotate-180" />
            <span>
              {isExporting ? "Exporting..." : `Export ${config.exportScale}x · ${config.exportFormat}`}
            </span>
          </button>
          <button
            onClick={handleCopy}
            title="Copy image"
            className="p-1.5 rounded-xl bg-[#282828] hover:bg-[#333333] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            title="Export settings"
            className="p-1.5 rounded-xl bg-[#282828] hover:bg-[#333333] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport Presets: 1 col, 2 cols, 3 cols */}
        <div className="flex bg-[#141414] p-0.5 rounded-xl">
          <button className="flex-1 py-1 flex items-center justify-center text-white bg-[#282828] rounded-lg">
            <span className="w-1.5 h-3 bg-white rounded-sm" />
          </button>
          <button className="flex-1 py-1 flex items-center justify-center text-neutral-400 hover:text-white">
            <span className="flex space-x-0.5">
              <span className="w-1 h-3 bg-neutral-500 rounded-sm" />
              <span className="w-1 h-3 bg-neutral-500 rounded-sm" />
            </span>
          </button>
          <button className="flex-1 py-1 flex items-center justify-center text-neutral-400 hover:text-white">
            <span className="flex space-x-0.5">
              <span className="w-0.5 h-3 bg-neutral-500 rounded-sm" />
              <span className="w-0.5 h-3 bg-neutral-500 rounded-sm" />
              <span className="w-0.5 h-3 bg-neutral-500 rounded-sm" />
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

          {/* Interactive Spatial Pad (3D orientation indicator) */}
          <div className="w-full h-28 rounded-xl bg-[#141414] flex items-center justify-center relative overflow-hidden">
            <div
              style={{
                transform: `perspective(300px) rotateX(${config.tiltX}deg) rotateY(${config.tiltY}deg) rotateZ(${config.tiltZ}deg) scale(${config.zoom / 180})`,
                transition: "transform 0.125s linear",
              }}
              className="w-20 h-14 rounded-lg bg-[#242424] border border-white/20 shadow-xl flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="absolute bottom-1.5 left-2 text-[9px] text-neutral-500 font-mono">
              Hold ⇧ for precision
            </div>
          </div>

          {/* Exact Shots.so Zoom Slider (75% to 400%) */}
          {activeMode === "zoom" ? (
            <div className="mt-2.5 flex items-center justify-between text-xs px-1">
              <span className="text-neutral-400 text-[11px]">Zoom</span>
              <div className="flex items-center space-x-2 w-32">
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
                <span className="text-[10px] text-neutral-300 w-8 text-right font-mono">
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

        {/* LAYOUT PRESETS */}
        <div>
          <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-2">
            LAYOUT PRESETS
          </div>

          <div className="space-y-2">
            {LAYOUT_PRESETS_LIST.map((preset) => {
              const isSelected = config.layoutPreset === preset.id;
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

                    {isSelected && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#111111]/90 border border-white/20 text-[9px] font-semibold text-white flex items-center gap-1 shadow-md">
                          <X className="w-2.5 h-2.5 text-neutral-400" />
                          Custom Layout
                        </span>
                      </div>
                    )}
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
