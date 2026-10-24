import React from "react";
import {
  Contrast,
  X,
  Sparkles,
  ChevronLeft,
  Ban,
  Droplet,
  ChevronRight,
  ImageIcon,
  Aperture,
  Box,
  SunMedium,
} from "lucide-react";
import { useMockupStore } from "@/store/mockupStore";
import { SHAPES_LAYOUTS } from "@/constants/shapes";
import type {
  PortraitLightingMode,
  WatermarkPlatform,
  WatermarkPosition,
  WatermarkStyle,
  WatermarkTheme,
  WatermarkProfile,
  VfxType,
} from "@/types/mockup";

export type MiniSidebarType =
  | "none"
  | "bg-effects"
  | "vfx"
  | "watermark"
  | "portrait"
  | "shapes";

interface MiniSidebarsProps {
  activeMiniSidebar: MiniSidebarType;
  setActiveMiniSidebar: (type: MiniSidebarType) => void;
}

export const MiniSidebars: React.FC<MiniSidebarsProps> = ({
  activeMiniSidebar,
  setActiveMiniSidebar,
}) => {
  const { config, updateConfig } = useMockupStore();

  const handleSwitchWatermarkProfile = (targetIdx: number) => {
    const profiles = config.watermarkProfiles || [];
    const targetProfile = profiles[targetIdx];
    if (!targetProfile) return;
    updateConfig({
      watermarkProfileIndex: targetIdx,
      watermark: targetProfile.enabled,
      watermarkText: targetProfile.text,
      watermarkPlatform: targetProfile.platform,
      watermarkStyle: targetProfile.style,
      watermarkTheme: targetProfile.theme,
      watermarkSize: targetProfile.size,
      watermarkInset: targetProfile.inset,
      watermarkPosition: targetProfile.position,
    });
  };

  const handleUpdateActiveWatermark = (updates: Partial<WatermarkProfile>) => {
    const activeIdx = config.watermarkProfileIndex ?? 0;
    const profiles = [...(config.watermarkProfiles || [])];
    const currentProfile = profiles[activeIdx] || {
      enabled: activeIdx > 0,
      text: "",
      platform: "none",
      style: "default",
      theme: "dark",
      size: 80,
      inset: 5,
      position: "top-left",
    };
    const updatedProfile = { ...currentProfile, ...updates };
    profiles[activeIdx] = updatedProfile;

    updateConfig({
      ...updates,
      ...(updates.enabled !== undefined ? { watermark: updates.enabled } : {}),
      ...(updates.text !== undefined ? { watermarkText: updates.text } : {}),
      ...(updates.platform !== undefined ? { watermarkPlatform: updates.platform } : {}),
      ...(updates.style !== undefined ? { watermarkStyle: updates.style } : {}),
      ...(updates.theme !== undefined ? { watermarkTheme: updates.theme } : {}),
      ...(updates.size !== undefined ? { watermarkSize: updates.size } : {}),
      ...(updates.inset !== undefined ? { watermarkInset: updates.inset } : {}),
      ...(updates.position !== undefined ? { watermarkPosition: updates.position } : {}),
      watermarkProfiles: profiles,
    });
  };

  if (activeMiniSidebar === "none") return null;

  return (
    <div className="absolute left-[240px] top-0 z-50 w-72 bg-[#1c1c1c] rounded-2xl border border-white/10 shadow-2xl p-4 text-white space-y-3.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
      {/* A. Background Effects Mini-Sidebar (media_1792516812407_0f130f7c.png) */}
          {activeMiniSidebar === "bg-effects" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Contrast className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    Background effects
                  </span>
                </div>
                <button
                  onClick={() => setActiveMiniSidebar("none")}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Noise */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium">Noise</span>
                  <span className="font-mono text-neutral-400 text-[11px]">
                    {config.grainIntensity ?? 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.grainIntensity ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateConfig({
                      grainIntensity: val,
                      noiseOverlay: val > 0,
                    });
                  }}
                  className="w-full accent-white h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium">Blur</span>
                  <span className="font-mono text-neutral-400 text-[11px]">
                    {config.backgroundBlur ?? 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={config.backgroundBlur ?? 0}
                  onChange={(e) =>
                    updateConfig({ backgroundBlur: Number(e.target.value) })
                  }
                  className="w-full accent-white h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* B. VFX Mini-Sidebar (media_1792516793378_76724419.png) */}
          {activeMiniSidebar === "vfx" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    VFX
                  </span>
                </div>
                <button
                  onClick={() => setActiveMiniSidebar("none")}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3x3 Grid of Presets */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "none", label: "None", icon: "⊘" },
                  { id: "noise", label: "Noise", bg: "bg-neutral-800" },
                  { id: "vhs", label: "VHS", bg: "bg-slate-800" },
                  { id: "tv", label: "TV", bg: "bg-indigo-950" },
                  { id: "vhs-glitch", label: "VHS Glitch", bg: "bg-emerald-950" },
                  { id: "tech-glitch", label: "Tech Glitch", bg: "bg-zinc-900" },
                  { id: "light-leak", label: "Light Leak", bg: "bg-rose-950" },
                  { id: "particles", label: "Particles", bg: "bg-neutral-900" },
                  { id: "glitter", label: "Glitter", bg: "bg-amber-950" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateConfig({ vfxType: item.id as VfxType })}
                    className={`h-14 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all cursor-pointer ${
                      (config.vfxType || "none") === item.id
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#262626] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className={`w-full flex-1 rounded-md ${item.bg || "bg-[#333]"} flex items-center justify-center text-xs text-neutral-300 font-mono`}>
                      {item.icon || "◈"}
                    </div>
                    <span className="text-[9px] font-bold mt-0.5 truncate max-w-full">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Adjust: Intensity */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                  ADJUST
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 text-[11px]">Intensity</span>
                  <span className="font-mono text-neutral-400 text-[11px]">
                    {config.vfxIntensity ?? 50}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.vfxIntensity ?? 50}
                  onChange={(e) =>
                    updateConfig({ vfxIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-white h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* C. Watermark Mini-Sidebar Carousel Profile System (media_1792516766485_2167325f.png) */}
          {activeMiniSidebar === "watermark" && (() => {
            const activeIdx = config.watermarkProfileIndex ?? 0;

            return (
              <div className="space-y-3.5">
                {/* 1. Carousel Header with Navigation Arrows */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() =>
                        handleSwitchWatermarkProfile((activeIdx - 1 + 4) % 4)
                      }
                      className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Perfil Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateActiveWatermark({ enabled: !config.watermark })
                      }
                      className="flex items-center space-x-1.5 text-xs font-bold text-white cursor-pointer px-1 py-0.5 rounded hover:bg-white/5"
                    >
                      {activeIdx === 0 ? (
                        <>
                          <Ban className="w-3.5 h-3.5 text-neutral-400" />
                          <span>No watermark</span>
                        </>
                      ) : (
                        <>
                          <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {config.watermarkText ? config.watermarkText : `Watermark #${activeIdx}`}
                          </span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleSwitchWatermarkProfile((activeIdx + 1) % 4)
                      }
                      className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Próximo Perfil"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveMiniSidebar("none")}
                    className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. 4-Dot Carousel Pager (• • • •) */}
                <div className="flex items-center justify-center space-x-2 py-0.5">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const isActive = activeIdx === slotIdx;
                    return (
                      <button
                        key={slotIdx}
                        onClick={() => handleSwitchWatermarkProfile(slotIdx)}
                        className={`transition-all rounded-full cursor-pointer ${
                          isActive
                            ? "w-2.5 h-2.5 bg-white shadow-sm ring-2 ring-white/20"
                            : "w-1.5 h-1.5 bg-neutral-600 hover:bg-neutral-400"
                        }`}
                        title={
                          slotIdx === 0
                            ? "Slot 0: Sem marca d'água"
                            : `Slot ${slotIdx}: Perfil personalizado`
                        }
                      />
                    );
                  })}
                </div>

                {/* Watermark Text Input & Upload */}
                <div className="flex items-center space-x-1.5 bg-[#242424] p-1.5 rounded-xl border border-white/5">
                  <button
                    onClick={() => {
                      const nextPlatform =
                        config.watermarkPlatform === "shots"
                          ? "twitter"
                          : config.watermarkPlatform === "twitter"
                          ? "instagram"
                          : "shots";
                      handleUpdateActiveWatermark({ platform: nextPlatform });
                    }}
                    className="p-1.5 rounded-lg bg-[#181818] text-white hover:bg-[#333] transition-colors cursor-pointer"
                    title="Mudar Ícone da Marca"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={config.watermarkText || ""}
                    onChange={(e) =>
                      handleUpdateActiveWatermark({
                        text: e.target.value,
                        enabled: true,
                      })
                    }
                    placeholder="Watermark / Marca"
                    className="flex-1 bg-transparent outline-none text-xs text-white placeholder-neutral-500"
                  />
                </div>

                {/* STYLE */}
                <div className="space-y-1.5">
                  <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                    STYLE
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[9px]">
                    {(
                      [
                        { id: "default", label: "Default" },
                        { id: "shadow", label: "Shadow" },
                        { id: "glass", label: "Glass" },
                        { id: "badge", label: "Badge" },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        onClick={() =>
                          handleUpdateActiveWatermark({
                            style: st.id,
                            enabled: true,
                          })
                        }
                        className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer truncate ${
                          (config.watermarkStyle || "default") === st.id
                            ? "border-white bg-[#282828] text-white font-bold"
                            : "border-transparent bg-[#222222] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Theme Light / Dark */}
                  <div className="flex bg-[#222222] p-0.5 rounded-xl text-xs font-semibold mt-1">
                    <button
                      onClick={() => handleUpdateActiveWatermark({ theme: "light" })}
                      className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                        config.watermarkTheme === "light"
                          ? "bg-white text-black shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => handleUpdateActiveWatermark({ theme: "dark" })}
                      className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                        config.watermarkTheme !== "light"
                          ? "bg-[#333] text-white shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* SIZE & POSITION */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                    SIZE & POSITION
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Position 4-corners selector */}
                    <div className="p-2 rounded-xl bg-[#222222] flex flex-col items-center justify-between">
                      <div className="w-8 h-8 grid grid-cols-2 gap-1 p-0.5 bg-[#181818] rounded-md">
                        {(
                          [
                            { id: "top-left", pos: "TL" },
                            { id: "top-right", pos: "TR" },
                            { id: "bottom-left", pos: "BL" },
                            { id: "bottom-right", pos: "BR" },
                          ] as const
                        ).map((p) => (
                          <button
                            key={p.id}
                            onClick={() =>
                              handleUpdateActiveWatermark({
                                position: p.id,
                                enabled: true,
                              })
                            }
                            className={`rounded-xs transition-colors cursor-pointer ${
                              config.watermarkPosition === p.id
                                ? "bg-white"
                                : "bg-[#333] hover:bg-[#555]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-neutral-400 mt-1 font-semibold">
                        Position
                      </span>
                    </div>

                    {/* Size */}
                    <div className="p-2 rounded-xl bg-[#222222] flex flex-col items-center justify-between">
                      <input
                        type="number"
                        min={40}
                        max={160}
                        value={config.watermarkSize ?? 80}
                        onChange={(e) =>
                          handleUpdateActiveWatermark({
                            size: Number(e.target.value),
                            enabled: true,
                          })
                        }
                        className="w-full bg-[#181818] text-center font-bold text-xs py-1 rounded text-white outline-none"
                      />
                      <span className="text-[9px] text-neutral-400 mt-1 font-semibold">
                        Size
                      </span>
                    </div>

                    {/* Inset */}
                    <div className="p-2 rounded-xl bg-[#222222] flex flex-col items-center justify-between">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={config.watermarkInset ?? 5}
                        onChange={(e) =>
                          handleUpdateActiveWatermark({
                            inset: Number(e.target.value),
                            enabled: true,
                          })
                        }
                        className="w-full bg-[#181818] text-center font-bold text-xs py-1 rounded text-white outline-none"
                      />
                      <span className="text-[9px] text-neutral-400 mt-1 font-semibold">
                        Inset
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* D. Portrait Depth-of-Field & Studio Lighting Mini-Sidebar */}
          {activeMiniSidebar === "portrait" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Aperture className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    Portrait & Depth of Field
                  </span>
                </div>
                <button
                  onClick={() => setActiveMiniSidebar("none")}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 1. Aperture F-Stop Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    APERTURE (F-STOP)
                  </span>
                  <span className="font-mono text-cyan-400 text-[11px]">
                    {config.portraitAperture || "f/2.8"}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1 text-[9px]">
                  {[
                    { f: "f/1.4", blur: 32 },
                    { f: "f/2.0", blur: 24 },
                    { f: "f/2.8", blur: 16 },
                    { f: "f/4.0", blur: 10 },
                    { f: "f/5.6", blur: 6 },
                    { f: "f/8.0", blur: 2 },
                  ].map((item) => (
                    <button
                      key={item.f}
                      onClick={() =>
                        updateConfig({
                          portraitAperture: item.f,
                          backgroundBlur: item.blur,
                          portraitEffect: true,
                        })
                      }
                      className={`py-1 rounded-lg border text-center font-mono transition-all cursor-pointer ${
                        (config.portraitAperture || "f/2.8") === item.f
                          ? "border-cyan-400 bg-cyan-400/20 text-white font-bold shadow-sm"
                          : "border-transparent bg-[#222222] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {item.f}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Bokeh Blur Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium text-[11px]">Bokeh Blur</span>
                  <span className="font-mono text-cyan-400 text-[11px]">
                    {config.backgroundBlur ?? 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={config.backgroundBlur ?? 0}
                  onChange={(e) =>
                    updateConfig({
                      backgroundBlur: Number(e.target.value),
                      portraitEffect: Number(e.target.value) > 0,
                    })
                  }
                  className="w-full accent-cyan-400 h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 3. Apple-Style Portrait Lighting Modes */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                  PORTRAIT LIGHTING
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: "natural", label: "Natural Light", desc: "Default studio", icon: SunMedium },
                      { id: "studio", label: "Studio Light", desc: "Soft face glow", icon: Sparkles },
                      { id: "contour", label: "Contour Light", desc: "Dramatic rim", icon: Contrast },
                      { id: "stage", label: "Stage Light", desc: "Dark backdrop", icon: Aperture },
                    ] as const
                  ).map((mode) => {
                    const IconComp = mode.icon;
                    const isSelected = (config.portraitLighting || "natural") === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() =>
                          updateConfig({
                            portraitLighting: mode.id as PortraitLightingMode,
                            portraitEffect: true,
                          })
                        }
                        className={`p-2 rounded-xl flex items-center space-x-2 border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400/10 text-white shadow-sm"
                            : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? "bg-cyan-400/20 text-cyan-300" : "bg-[#181818] text-neutral-400"}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[10px] font-bold truncate leading-tight">
                            {mode.label}
                          </div>
                          <div className="text-[8px] text-neutral-400 truncate">
                            {mode.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* E. 3D Shapes Mini-Sidebar */}
          {activeMiniSidebar === "shapes" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    3D Shapes Scene
                  </span>
                </div>
                <button
                  onClick={() => setActiveMiniSidebar("none")}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collections */}
              <div className="space-y-1.5">
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                  Shapes Pack
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  {(
                    [
                      { id: "glass-blue", label: "Glass Blue" },
                      { id: "glass-pink", label: "Glass Pink" },
                      { id: "metal", label: "Metal 3D" },
                      { id: "metal-gradient-dark", label: "Dark Metal" },
                      { id: "metal-gradient-light", label: "Light Metal" },
                      { id: "inflatable", label: "Inflatable" },
                      { id: "plushy", label: "Plushy" },
                    ] as const
                  ).map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() =>
                        updateConfig({
                          shapesPack: pack.id,
                          shapesSceneEnabled: true,
                        })
                      }
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer truncate ${
                        config.shapesPack === pack.id
                          ? "border-cyan-400 bg-cyan-400/10 text-white font-bold"
                          : "border-transparent bg-[#222222] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {pack.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Patterns */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                  Layout Pattern (10 Layouts)
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] max-h-40 overflow-y-auto pr-1">
                  {(
                    [
                      { id: "layout-1", label: "Corners" },
                      { id: "layout-7", label: "Cluster" },
                      { id: "layout-3", label: "Diagonal" },
                      { id: "layout-orbit", label: "Orbit" },
                      { id: "layout-cascade", label: "Cascade" },
                      { id: "layout-framing", label: "Framing" },
                      { id: "layout-constellation", label: "Constellation" },
                      { id: "layout-vortex", label: "Vortex" },
                      { id: "layout-diagonal", label: "Dynamic" },
                      { id: "layout-hero-duo", label: "Hero Duo" },
                    ] as const
                  ).map((lay) => (
                    <button
                      key={lay.id}
                      onClick={() =>
                        updateConfig({
                          shapesLayoutName: lay.id,
                          shapesSceneEnabled: true,
                        })
                      }
                      className={`py-1.5 px-1.5 rounded-lg border text-center transition-all cursor-pointer truncate ${
                        config.shapesLayoutName === lay.id
                          ? "border-cyan-400 bg-cyan-400/10 text-white font-bold"
                          : "border-transparent bg-[#222222] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {lay.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

    </div>
  );
};
