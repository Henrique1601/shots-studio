"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import {
  DEVICE_SPECS,
  STYLE_OPTIONS,
  SHADOW_OPTIONS,
  BorderRoundness,
  FrameStyle,
  ShadowMode,
  PRESET_GRADIENTS,
  ASPECT_RATIOS_STANDARD,
  ASPECT_RATIOS_SOCIAL,
  LAYOUT_PRESETS_LIST,
} from "@/types/mockup";
import {
  Smartphone,
  Layout,
  Compass,
  Download,
  X,
  ChevronDown,
  Sparkles,
  Sliders,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import confetti from "canvas-confetti";

export const MobileDrawer = () => {
  const {
    config,
    updateConfig,
    setDeviceModalOpen,
    showToast,
  } = useMockupStore();

  const [activeTab, setActiveTab] = useState<"mockup" | "frame" | "style" | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const deviceSpec = DEVICE_SPECS[config.frameType] || DEVICE_SPECS.screenshot;

  const handleExport = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    try {
      setIsExporting(true);
      const dataUrl = await htmlToImage.toPng(node, {
        quality: 0.95,
        pixelRatio: config.exportScale,
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.download = `shot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.3 },
      });
      showToast("Shot baixado com sucesso! 🚀");
    } catch (err) {
      console.error("Export error:", err);
      showToast("Erro ao exportar", "warning");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="lg:hidden">
      {/* 1. Backdrop when drawer is open */}
      <AnimatePresence>
        {activeTab !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTab(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* 2. Slide-up Bottom Drawer */}
      <AnimatePresence>
        {activeTab !== null && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-white/10 rounded-t-3xl max-h-[70vh] flex flex-col shadow-2xl select-none"
          >
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto my-2.5" />

            {/* Header with Close */}
            <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {activeTab === "mockup" && "Ajustes do Mockup"}
                  {activeTab === "frame" && "Configurações do Frame"}
                  {activeTab === "style" && "3D, Tilt & Layouts"}
                </span>
              </div>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1 rounded-full bg-white/10 text-neutral-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: MOCKUP CONTROLS */}
              {activeTab === "mockup" && (
                <div className="space-y-4">
                  {/* Device Picker */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Dispositivo
                    </label>
                    <button
                      onClick={() => {
                        setActiveTab(null);
                        setDeviceModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#222222] border border-white/5"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black/40 overflow-hidden flex items-center justify-center p-0.5">
                          <img
                            src={deviceSpec.deviceImg || "/shots-assets/image_mockup-icons_screenshot.png"}
                            alt={deviceSpec.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold text-white">{deviceSpec.name}</div>
                          <div className="text-[10px] text-neutral-400">
                            {deviceSpec.isDevice ? "Modelo de Aparelho" : "Adapta à Foto"}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>

                  {/* Browser & Desktop Title / URL */}
                  {(config.frameType === "browser" || config.frameType === "minimal-desktop") && (
                    <div>
                      <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                        URL ou Título da Janela
                      </label>
                      <input
                        type="text"
                        value={config.browserUrl ?? ""}
                        onChange={(e) => updateConfig({ browserUrl: e.target.value })}
                        placeholder={config.frameType === "minimal-desktop" ? "Studio Workspace" : "shots.so/editor"}
                        className="w-full px-3 py-2 rounded-xl bg-[#222222] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {/* Frame Style Options */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Estilo da Moldura
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {STYLE_OPTIONS.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateConfig({ frameStyle: style.id as FrameStyle })}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-medium transition-all ${
                            config.frameStyle === style.id
                              ? "bg-white/10 border-white text-white"
                              : "bg-[#222222] border-white/5 text-neutral-400 hover:text-white"
                          }`}
                        >
                          <div className="w-full h-8 rounded-lg bg-neutral-800 flex items-center justify-center mb-1 overflow-hidden">
                            <span className="text-[9px] text-neutral-400">{style.label.slice(0, 3)}</span>
                          </div>
                          <span className="truncate w-full text-center">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Roundness */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-medium text-neutral-400">Cantos Arredondados</label>
                      <span className="text-[10px] text-neutral-400 font-mono">{config.borderRadius}px</span>
                    </div>
                    <div className="flex bg-[#222222] p-0.5 rounded-xl mb-2">
                      {(["sharp", "curved", "round"] as BorderRoundness[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            const val = r === "sharp" ? 0 : r === "curved" ? 20 : 36;
                            updateConfig({ borderRoundness: r, borderRadius: val });
                          }}
                          className={`flex-1 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                            config.borderRoundness === r ? "bg-[#333333] text-white" : "text-neutral-400"
                          }`}
                        >
                          {r === "sharp" ? "Reto" : r === "curved" ? "Curvo" : "Redondo"}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={48}
                      value={config.borderRadius}
                      onChange={(e) => updateConfig({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-white"
                    />
                  </div>

                  {/* Shadows */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Sombra 3D
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {SHADOW_OPTIONS.map((sh) => (
                        <button
                          key={sh.id}
                          onClick={() => updateConfig({ shadowMode: sh.id as ShadowMode })}
                          className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                            config.shadowMode === sh.id
                              ? "bg-white text-black border-white"
                              : "bg-[#222222] text-neutral-300 border-white/5"
                          }`}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Opacidade</span>
                      <span className="font-mono">{config.shadowOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={config.shadowOpacity}
                      onChange={(e) => updateConfig({ shadowOpacity: Number(e.target.value) })}
                      className="w-full accent-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: FRAME CONTROLS */}
              {activeTab === "frame" && (
                <div className="space-y-4">
                  {/* Aspect Ratio */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Proporção do Frame
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[...ASPECT_RATIOS_STANDARD, ...ASPECT_RATIOS_SOCIAL.slice(0, 4)].map((ar) => (
                        <button
                          key={ar.id}
                          onClick={() => updateConfig({ aspectRatio: ar.id })}
                          className={`py-2 px-1.5 rounded-xl border text-[11px] font-medium transition-all text-center ${
                            config.aspectRatio === ar.id
                              ? "bg-white text-black border-white"
                              : "bg-[#222222] text-neutral-300 border-white/5 hover:bg-[#2a2a2a]"
                          }`}
                        >
                          <div className="font-semibold">{ar.id}</div>
                          <div className="text-[9px] opacity-70 truncate">{ar.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Presets */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Plano de Fundo (Gradients)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_GRADIENTS.map((g, idx) => (
                        <button
                          key={idx}
                          onClick={() => updateConfig({ backgroundValue: g.value })}
                          style={{ background: g.value }}
                          className={`h-11 rounded-xl border relative transition-all ${
                            config.backgroundValue === g.value
                              ? "ring-2 ring-white border-transparent scale-102"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          {config.backgroundValue === g.value && (
                            <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Watermark & VFX Toggles */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs font-medium text-white">Watermark Shots.so</span>
                      <button
                        onClick={() => updateConfig({ watermark: !config.watermark })}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          config.watermark ? "bg-white" : "bg-neutral-800"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full transition-transform ${
                            config.watermark ? "translate-x-4 bg-black" : "translate-x-0 bg-neutral-400"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs font-medium text-white">Objetos 3D Flutuantes</span>
                      <button
                        onClick={() => updateConfig({ shapesSceneEnabled: !config.shapesSceneEnabled })}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          config.shapesSceneEnabled ? "bg-white" : "bg-neutral-800"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full transition-transform ${
                            config.shapesSceneEnabled ? "translate-x-4 bg-black" : "translate-x-0 bg-neutral-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STYLE & 3D CONTROLS */}
              {activeTab === "style" && (
                <div className="space-y-4">
                  {/* Zoom Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-medium text-neutral-400">Zoom</label>
                      <span className="text-[10px] text-neutral-400 font-mono">{config.zoom}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={180}
                      value={config.zoom}
                      onChange={(e) => updateConfig({ zoom: Number(e.target.value) })}
                      className="w-full accent-white"
                    />
                  </div>

                  {/* Tilt Sliders */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-medium text-neutral-400">Inclinação Vertical (Tilt X)</label>
                        <span className="text-[10px] text-neutral-400 font-mono">{config.tiltX}°</span>
                      </div>
                      <input
                        type="range"
                        min={-45}
                        max={45}
                        value={config.tiltX}
                        onChange={(e) => updateConfig({ tiltX: Number(e.target.value) })}
                        className="w-full accent-white"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-medium text-neutral-400">Rotação Horizontal (Tilt Y)</label>
                        <span className="text-[10px] text-neutral-400 font-mono">{config.tiltY}°</span>
                      </div>
                      <input
                        type="range"
                        min={-45}
                        max={45}
                        value={config.tiltY}
                        onChange={(e) => updateConfig({ tiltY: Number(e.target.value) })}
                        className="w-full accent-white"
                      />
                    </div>
                  </div>

                  {/* 3D Layout Presets */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Presets de Ângulo 3D
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LAYOUT_PRESETS_LIST.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            updateConfig({
                              layoutPreset: p.id,
                              tiltX: p.tiltX,
                              tiltY: p.tiltY,
                              tiltZ: p.tiltZ,
                              zoom: p.zoom,
                            });
                          }}
                          className={`p-2 rounded-xl border text-xs font-medium text-left transition-all ${
                            config.layoutPreset === p.id
                              ? "bg-white text-black border-white"
                              : "bg-[#222222] text-neutral-300 border-white/5 hover:bg-[#2a2a2a]"
                          }`}
                        >
                          <div className="font-semibold">{p.label}</div>
                          <div className="text-[10px] opacity-70">
                            {p.tiltX}° / {p.tiltY}°
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Bottom Navigation Bar (Dock) */}
      <div className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between p-1.5 bg-[#1c1c1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <button
          onClick={() => setActiveTab(activeTab === "mockup" ? null : "mockup")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === "mockup" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          <Smartphone className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium">Mockup</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "frame" ? null : "frame")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === "frame" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          <Layout className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium">Frame</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "style" ? null : "style")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === "style" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-medium">3D / Presets</span>
        </button>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-white text-black font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">
            {isExporting ? "..." : "Exportar"}
          </span>
        </button>
      </div>
    </div>
  );
};
