import React, { useState } from "react";
import {
  ChevronDown,
  Aperture,
  Droplet,
  Contrast,
  Sparkles,
  Box,
  Wand2,
} from "lucide-react";
import { useMockupStore } from "@/store/mockupStore";
import {
  ASPECT_RATIOS_STANDARD,
  DEFAULT_RATIO_DIMENSIONS,
  PRESET_SOLIDS,
  PRESET_GRADIENTS,
  PRESET_MYSTIC,
  PRESET_DESKTOP,
  PRESET_PAPER_GLASS,
  PRESET_TAHOE,
} from "@/constants/presets";
import type { AspectRatioType } from "@/types/mockup";
import type { MiniSidebarType } from "./MiniSidebars";
import { extractPaletteFromImage, type GeneratedGradient } from "@/utils/magicPalette";

interface FrameTabProps {
  activeMiniSidebar: MiniSidebarType;
  setActiveMiniSidebar: (type: MiniSidebarType) => void;
  magicGradients: GeneratedGradient[];
  setMagicGradients: React.Dispatch<React.SetStateAction<GeneratedGradient[]>>;
}

export const FrameTab: React.FC<FrameTabProps> = ({
  activeMiniSidebar,
  setActiveMiniSidebar,
  magicGradients,
  setMagicGradients,
}) => {
  const { config, imageUrl, updateConfig, showToast } = useMockupStore();

  const [inputW, setInputW] = useState(config.customWidth.toString());
  const [inputH, setInputH] = useState(config.customHeight.toString());
  const [isRatioDropdownOpen, setIsRatioDropdownOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [bgCategory, setBgCategory] = useState<
    "transparent" | "color" | "image" | "unsplash"
  >(
    config.backgroundType === "transparent"
      ? "transparent"
      : config.backgroundType === "image"
      ? "image"
      : "color"
  );
  const [expandedSection, setExpandedSection] = useState<
    "none" | "solid" | "mystic" | "desktop" | "gradients"
  >("solid");

  const getRatioTitle = (ratio: AspectRatioType) => {
    if (ratio === "5:4") return "Default 5:4";
    const std = ASPECT_RATIOS_STANDARD.find((r) => r.id === ratio);
    if (std) return std.label;
    if (ratio === "custom") return "Custom";
    return ratio;
  };

  const getRatioCss = (ratio: AspectRatioType) => {
    if (ratio === "custom") {
      const w = config.customWidth || 1920;
      const h = config.customHeight || 1080;
      return `${w}/${h}`;
    }
    const parts = ratio.split("/").join(":").split(":").map(Number);
    if (parts[0] && parts[1]) return `${parts[0]}/${parts[1]}`;
    return "16/9";
  };

  const handleSelectRatio = (
    ratioId: AspectRatioType,
    overrideW?: number,
    overrideH?: number
  ) => {
    const defaults = DEFAULT_RATIO_DIMENSIONS[ratioId];
    const width = overrideW ?? defaults?.width ?? 1920;
    const height = overrideH ?? defaults?.height ?? 1080;

    updateConfig({
      aspectRatio: ratioId,
      customWidth: width,
      customHeight: height,
    });
    setInputW(width.toString());
    setInputH(height.toString());
    showToast(`Proporção selecionada: ${ratioId}`, "info");
  };

  const handleSetDimensions = () => {
    const parsedW = parseInt(inputW, 10);
    const parsedH = parseInt(inputH, 10);
    const w = Math.min(8192, Math.max(100, isNaN(parsedW) ? 1920 : parsedW));
    const h = Math.min(8192, Math.max(100, isNaN(parsedH) ? 1080 : parsedH));

    setInputW(w.toString());
    setInputH(h.toString());

    // Auto-detect matching standard ratio
    let matchedRatio: AspectRatioType = "custom";
    for (const [rId, dim] of Object.entries(DEFAULT_RATIO_DIMENSIONS)) {
      if (rId !== "custom" && dim.width === w && dim.height === h) {
        matchedRatio = rId as AspectRatioType;
        break;
      }
    }

    updateConfig({
      customWidth: w,
      customHeight: h,
      aspectRatio: matchedRatio,
    });
    showToast(`Dimensões aplicadas: ${w} × ${h}px`, "success");
  };

  const handleExtractMagicPalette = async () => {
    if (!imageUrl) {
      showToast("Envie uma imagem para extrair a paleta mágica!", "error");
      return;
    }
    setIsExtracting(true);
    try {
      const grads = await extractPaletteFromImage(imageUrl);
      setMagicGradients(grads);
      showToast("Paleta de estúdio extraída! ✨", "success");
    } catch {
      showToast("Não foi possível extrair cores da imagem", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="w-[228px] shrink-0 h-full overflow-y-auto p-3 space-y-3.5">
          {/* 1. TOP DROPDOWN TRIGGER CARD */}
          <div>
            <button
              onClick={() => setIsRatioDropdownOpen(!isRatioDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] border border-white/5 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                {/* Visual Ratio Icon */}
                <div className="w-8 h-8 rounded-lg bg-[#333333] border border-white/10 flex items-center justify-center p-1 shrink-0">
                  <div
                    style={{
                      aspectRatio: getRatioCss(config.aspectRatio),
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    className="w-full h-full bg-white/70 rounded-xs"
                  />
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {getRatioTitle(config.aspectRatio)}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {config.customWidth} × {config.customHeight}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 group-hover:text-white transition-transform shrink-0 ${
                  isRatioDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* 2. EXPANDED RATIO DROPDOWN ACCORDION / VIEW */}
          {isRatioDropdownOpen ? (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              {/* Custom W & H Inputs with Set button */}
              <div className="flex items-center space-x-1.5 bg-[#222222] p-1 rounded-xl">
                <div className="flex-1 flex items-center px-2 py-1 bg-[#181818] rounded-lg text-xs">
                  <span className="text-neutral-400 font-bold mr-1 text-[10px]">W</span>
                  <input
                    type="number"
                    min={100}
                    max={8192}
                    value={inputW}
                    onChange={(e) => setInputW(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSetDimensions()}
                    className="w-full bg-transparent outline-none text-white text-[11px]"
                    placeholder="1920"
                  />
                </div>
                <div className="flex-1 flex items-center px-2 py-1 bg-[#181818] rounded-lg text-xs">
                  <span className="text-neutral-400 font-bold mr-1 text-[10px]">H</span>
                  <input
                    type="number"
                    min={100}
                    max={8192}
                    value={inputH}
                    onChange={(e) => setInputH(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSetDimensions()}
                    className="w-full bg-transparent outline-none text-white text-[11px]"
                    placeholder="1080"
                  />
                </div>
                <button
                  onClick={handleSetDimensions}
                  className="px-2.5 py-1 bg-white text-black text-[11px] font-semibold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Set
                </button>
              </div>

              {/* Standard Ratios: 3x3 Grid (16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16) */}
              <div className="pt-1 border-t border-[#2a2a2a]">
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "16:9", label: "16:9" },
                      { id: "3:2", label: "3:2" },
                      { id: "4:3", label: "4:3" },
                      { id: "5:4", label: "5:4" },
                      { id: "1:1", label: "1:1" },
                      { id: "4:5", label: "4:5" },
                      { id: "3:4", label: "3:4" },
                      { id: "2:3", label: "2:3" },
                      { id: "9:16", label: "9:16" },
                    ] as const
                  ).map((item) => {
                    const isSelected = config.aspectRatio === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectRatio(item.id)}
                        className={`h-16 rounded-xl flex flex-col items-center justify-between p-2 border transition-all cursor-pointer ${
                          isSelected
                            ? "border-white bg-[#282828] text-white shadow-sm"
                            : "border-transparent bg-[#222222] hover:bg-[#262626] text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div className="flex-1 w-full flex items-center justify-center p-0.5">
                          <div
                            style={{
                              aspectRatio: getRatioCss(item.id),
                              maxWidth: "100%",
                              maxHeight: "100%",
                            }}
                            className={`w-full h-full rounded-xs transition-colors ${
                              isSelected ? "bg-white/80" : "bg-[#444]"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-bold leading-none mt-1">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social Media Section: Instagram */}
              <div className="pt-2 border-t border-[#2a2a2a] space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                  <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center p-0.5">
                    <div className="w-2.5 h-2.5 border border-white rounded-xs flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                  <span>Instagram</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Post", ratio: "1:1" as AspectRatioType, w: 1080, h: 1080, ratioText: "1:1" },
                    { label: "Portrait", ratio: "4:5" as AspectRatioType, w: 1080, h: 1350, ratioText: "4:5" },
                    { label: "Story", ratio: "9:16" as AspectRatioType, w: 1080, h: 1920, ratioText: "9:16" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleSelectRatio(item.ratio, item.w, item.h)}
                      className={`h-20 rounded-xl flex flex-col items-center justify-between p-2 border transition-all cursor-pointer ${
                        config.aspectRatio === item.ratio && config.customWidth === item.w && config.customHeight === item.h
                          ? "border-white bg-[#282828] text-white shadow-sm"
                          : "border-transparent bg-[#222222] hover:bg-[#262626] text-neutral-400 hover:text-white"
                      }`}
                    >
                      <div className="flex-1 w-full flex items-center justify-center">
                        <div
                          style={{
                            aspectRatio: getRatioCss(item.ratio),
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                          className="w-full h-full rounded-xs bg-[#444] flex items-center justify-center p-1"
                        >
                          <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center p-0.5">
                            <div className="w-2 h-2 border border-white rounded-xs flex items-center justify-center">
                              <div className="w-0.5 h-0.5 bg-white rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-1">
                        <div className="text-[10px] font-bold text-white leading-none">{item.label}</div>
                        <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{item.ratioText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media Section: Twitter */}
              <div className="pt-2 border-t border-[#2a2a2a] space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                  <svg className="w-4 h-4 text-[#1da1f2] fill-current" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                  <span>Twitter</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Tweet", ratio: "16:9" as AspectRatioType, w: 1200, h: 675, ratioText: "16:9" },
                    { label: "Cover", ratio: "3:1" as AspectRatioType, w: 1500, h: 500, ratioText: "3:1" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleSelectRatio(item.ratio, item.w, item.h)}
                      className={`h-20 rounded-xl flex flex-col items-center justify-between p-2 border transition-all cursor-pointer ${
                        config.aspectRatio === item.ratio && config.customWidth === item.w && config.customHeight === item.h
                          ? "border-white bg-[#282828] text-white shadow-sm"
                          : "border-transparent bg-[#222222] hover:bg-[#262626] text-neutral-400 hover:text-white"
                      }`}
                    >
                      <div className="flex-1 w-full flex items-center justify-center">
                        <div
                          style={{
                            aspectRatio: getRatioCss(item.ratio),
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                          className="w-full h-full rounded-xs bg-[#444] flex items-center justify-center p-1"
                        >
                          <svg className="w-3.5 h-3.5 text-[#1da1f2] fill-current" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-center mt-1">
                        <div className="text-[10px] font-bold text-white leading-none">{item.label}</div>
                        <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{item.ratioText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media Section: YouTube */}
              <div className="pt-2 border-t border-[#2a2a2a] space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                  <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Banner", ratio: "16:9" as AspectRatioType, w: 2560, h: 1440, ratioText: "16:9" },
                    { label: "Thumbnail", ratio: "16:9" as AspectRatioType, w: 1280, h: 720, ratioText: "16:9" },
                    { label: "Video", ratio: "16:9" as AspectRatioType, w: 1920, h: 1080, ratioText: "16:9" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleSelectRatio(item.ratio, item.w, item.h)}
                      className={`h-20 rounded-xl flex flex-col items-center justify-between p-2 border transition-all cursor-pointer ${
                        config.aspectRatio === item.ratio && config.customWidth === item.w && config.customHeight === item.h
                          ? "border-white bg-[#282828] text-white shadow-sm"
                          : "border-transparent bg-[#222222] hover:bg-[#262626] text-neutral-400 hover:text-white"
                      }`}
                    >
                      <div className="flex-1 w-full flex items-center justify-center">
                        <div
                          style={{
                            aspectRatio: "16/9",
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                          className="w-full h-full rounded-xs bg-[#444] flex items-center justify-center p-1"
                        >
                          <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                            <path d="M10 15l5-3-5-3v6z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="text-center mt-1">
                        <div className="text-[10px] font-bold text-white leading-none">{item.label}</div>
                        <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{item.ratioText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* 3. EFFECTS & WATERMARK (2x2 Grid) */}
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  EFFECTS & WATERMARK
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Portrait Button */}
                  <button
                    onClick={() =>
                      setActiveMiniSidebar(
                        activeMiniSidebar === "portrait" ? "none" : "portrait"
                      )
                    }
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      activeMiniSidebar === "portrait" || (config.backgroundBlur ?? 0) > 0
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Aperture className="w-4 h-4 text-white" />
                    <span className="text-[11px] font-semibold">Portrait</span>
                  </button>

                  {/* Watermark Button */}
                  <button
                    onClick={() =>
                      setActiveMiniSidebar(
                        activeMiniSidebar === "watermark" ? "none" : "watermark"
                      )
                    }
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      activeMiniSidebar === "watermark" || config.watermark
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Droplet className="w-4 h-4 text-white" />
                    <span className="text-[11px] font-semibold">Watermark</span>
                  </button>

                  {/* Bg Effects Button */}
                  <button
                    onClick={() =>
                      setActiveMiniSidebar(
                        activeMiniSidebar === "bg-effects" ? "none" : "bg-effects"
                      )
                    }
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      activeMiniSidebar === "bg-effects" || config.noiseOverlay || (config.grainIntensity ?? 0) > 0
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Contrast className="w-4 h-4 text-white" />
                    <span className="text-[11px] font-semibold">Bg Effects</span>
                  </button>

                  {/* VFX Button */}
                  <button
                    onClick={() =>
                      setActiveMiniSidebar(
                        activeMiniSidebar === "vfx" ? "none" : "vfx"
                      )
                    }
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      activeMiniSidebar === "vfx" || (config.vfxType && config.vfxType !== "none")
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-[11px] font-semibold">VFX</span>
                  </button>
                </div>
              </div>

              {/* 4. SCENE (None, Shadow, Shapes) */}
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  SCENE
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {/* None */}
                  <button
                    onClick={() => {
                      updateConfig({
                        shapesSceneEnabled: false,
                        shadowMode: "none",
                      });
                      setActiveMiniSidebar("none");
                      showToast("Cena limpa (sem sombra/shapes)", "info");
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1 border transition-all cursor-pointer ${
                      !config.shapesSceneEnabled && config.shadowMode === "none"
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-8 h-7 rounded-lg bg-[#333] flex items-center justify-center">
                      <span className="text-base text-neutral-400">⊘</span>
                    </div>
                    <span className="text-[10px] font-bold">None</span>
                  </button>

                  {/* Shadow */}
                  <button
                    onClick={() => {
                      const nextMode =
                        config.shadowMode === "none"
                          ? "spread"
                          : config.shadowMode === "spread"
                          ? "adaptive"
                          : "spread";
                      updateConfig({ shadowMode: nextMode });
                      showToast(`Sombra: ${nextMode}`, "success");
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all cursor-pointer ${
                      config.shadowMode !== "none"
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-full flex-1 rounded-lg bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] flex items-center justify-center shadow-lg">
                      <div className="w-4 h-5 bg-black/60 rounded-xs shadow-xl" />
                    </div>
                    <span className="text-[10px] font-bold mt-1">Shadow</span>
                  </button>

                  {/* Shapes */}
                  <button
                    onClick={() => {
                      const nextVal = !config.shapesSceneEnabled;
                      updateConfig({ shapesSceneEnabled: nextVal });
                      setActiveMiniSidebar(nextVal ? "shapes" : "none");
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all cursor-pointer ${
                      config.shapesSceneEnabled
                        ? "border-cyan-400 bg-cyan-500/10 text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-full flex-1 rounded-lg bg-gradient-to-tr from-cyan-950 via-indigo-900 to-purple-950 flex items-center justify-center overflow-hidden relative">
                      <div className="w-4 h-4 rounded-full bg-cyan-400/40 blur-[2px]" />
                      <Box className="w-3.5 h-3.5 text-cyan-300 relative z-10" />
                    </div>
                    <span className="text-[10px] font-bold mt-1">Shapes</span>
                  </button>
                </div>
              </div>

              {/* 5. BACKGROUND (Transparent, Color, Image, Unsplash) */}
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  BACKGROUND
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {/* Transparent */}
                  <button
                    onClick={() => {
                      setBgCategory("transparent");
                      updateConfig({
                        backgroundType: "transparent",
                        backgroundValue: "transparent",
                      });
                      showToast("Fundo transparente ativado!", "info");
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      config.backgroundType === "transparent"
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-[repeating-conic-gradient(#555_0%_25%,#333_0%_50%)] [background-size:8px_8px] border border-white/20" />
                    <span className="text-[9px] font-semibold truncate">Trans...</span>
                  </button>

                  {/* Color */}
                  <button
                    onClick={() => {
                      setBgCategory("color");
                      if (config.backgroundType === "transparent") {
                        updateConfig({
                          backgroundType: "solid",
                          backgroundValue: PRESET_SOLIDS[0].value,
                        });
                      }
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      bgCategory === "color" && config.backgroundType !== "transparent"
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-white shadow-md" />
                    <span className="text-[9px] font-semibold truncate">Color</span>
                  </button>

                  {/* Image */}
                  <button
                    onClick={() => {
                      setBgCategory("image");
                      updateConfig({
                        backgroundType: "image",
                        backgroundValue: PRESET_PAPER_GLASS[0].value,
                      });
                      showToast("Paper Glass aplicado!", "info");
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      bgCategory === "image" && config.backgroundType === "image"
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md overflow-hidden border border-white/10">
                      <img
                        src={PRESET_PAPER_GLASS[0].preview}
                        alt="Paper Glass"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-semibold truncate">Image</span>
                  </button>

                  {/* Unsplash */}
                  <button
                    onClick={() => {
                      setBgCategory("unsplash");
                      updateConfig({
                        backgroundType: "image",
                        backgroundValue: PRESET_TAHOE[0].value,
                      });
                      showToast("Tahoe 4K aplicado!", "info");
                    }}
                    className={`h-16 rounded-xl flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
                      bgCategory === "unsplash"
                        ? "border-white bg-[#282828] text-white"
                        : "border-transparent bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md overflow-hidden border border-white/10">
                      <img
                        src={PRESET_TAHOE[0].preview}
                        alt="Tahoe"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-semibold truncate">Unspl...</span>
                  </button>
                </div>
              </div>

              {/* 6. Magic ✨ Banner Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#241427] via-[#1c1c1c] to-[#18181b] border border-white/10 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="max-w-[125px]">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                      <span>Magic</span>
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    <p className="text-[9px] text-neutral-400 leading-tight mt-1">
                      Uses media in your mockup to generate magic backgrounds
                    </p>
                  </div>

                  {/* Visual stack of 2 tilted preview cards */}
                  <div className="relative w-14 h-12 shrink-0">
                    <div className="absolute top-0 right-1 w-9 h-7 rounded-sm bg-gradient-to-tr from-pink-500 to-indigo-600 rotate-6 shadow-md border border-white/20" />
                    <div className="absolute top-2 right-3 w-9 h-7 rounded-sm bg-black rotate-[-6deg] shadow-xl border border-white/30 flex items-center justify-center">
                      <div className="w-7 h-5 bg-neutral-800 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Extracted Swatches / Magic Palette Button */}
                <div className="mt-2.5 pt-2 border-t border-white/10">
                  <button
                    disabled={isExtracting}
                    onClick={handleExtractMagicPalette}
                    className="w-full py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className={`w-3 h-3 text-pink-400 ${isExtracting ? "animate-spin" : ""}`} />
                    <span>{isExtracting ? "Analisando..." : "Gerar Paleta Mágica"}</span>
                  </button>

                  {magicGradients.length > 0 && (
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {magicGradients.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            updateConfig({
                              backgroundType: "gradient",
                              backgroundValue: g.css,
                            });
                            showToast(`${g.name} aplicado!`, "success");
                          }}
                          style={{ background: g.preview }}
                          className="h-6 rounded-md border border-white/10 hover:scale-105 transition-transform cursor-pointer"
                          title={g.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 7. Solid Swatches Row (with Expand [v]) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-300">Solid</span>
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === "solid" ? "none" : "solid")
                    }
                    className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedSection === "solid" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === "solid" ? (
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#222222] border border-white/5">
                    {PRESET_SOLIDS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "solid",
                            backgroundValue: s.value,
                          })
                        }
                        style={{ background: s.value }}
                        className={`h-7 rounded-lg border transition-all cursor-pointer ${
                          config.backgroundValue === s.value
                            ? "ring-2 ring-white border-transparent scale-105"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={s.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    {PRESET_SOLIDS.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "solid",
                            backgroundValue: s.value,
                          })
                        }
                        style={{ background: s.value }}
                        className={`flex-1 h-7 rounded-lg border transition-all cursor-pointer ${
                          config.backgroundValue === s.value
                            ? "ring-2 ring-white border-transparent"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={s.name}
                      />
                    ))}
                    <button
                      onClick={() => setExpandedSection("solid")}
                      className="w-7 h-7 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 8. Mystic Caustics Swatches (From Screenshot media_1792516864205_d0935477.png) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-300">Mystic</span>
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === "mystic" ? "none" : "mystic")
                    }
                    className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedSection === "mystic" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === "mystic" ? (
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#222222] border border-white/5 animate-in fade-in duration-100">
                    {PRESET_MYSTIC.map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "gradient",
                            backgroundValue: m.value,
                          })
                        }
                        style={{ background: m.value }}
                        className={`h-9 rounded-xl border transition-all cursor-pointer ${
                          config.backgroundValue === m.value
                            ? "ring-2 ring-white border-transparent scale-105"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={m.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    {PRESET_MYSTIC.slice(0, 4).map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "gradient",
                            backgroundValue: m.value,
                          })
                        }
                        style={{ background: m.value }}
                        className={`flex-1 h-7 rounded-lg border transition-all cursor-pointer ${
                          config.backgroundValue === m.value
                            ? "ring-2 ring-white border-transparent"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={m.name}
                      />
                    ))}
                    <button
                      onClick={() => setExpandedSection("mystic")}
                      className="w-7 h-7 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 8.5 Desktop 4K Wallpapers Collection (Sequoia, Sonoma, Tahoe, Monterey, Pro Display XDR) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-300">Desktop 4K</span>
                  <button
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === "desktop" ? "none" : "desktop"
                      )
                    }
                    className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedSection === "desktop" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === "desktop" ? (
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#222222] border border-white/5 animate-in fade-in duration-100">
                    {PRESET_DESKTOP.map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "image",
                            backgroundValue: d.value,
                          })
                        }
                        style={{
                          backgroundImage: d.value,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        className={`h-9 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                          config.backgroundValue === d.value
                            ? "ring-2 ring-white border-transparent scale-105"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={d.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    {PRESET_DESKTOP.slice(0, 4).map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "image",
                            backgroundValue: d.value,
                          })
                        }
                        style={{
                          backgroundImage: d.value,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        className={`flex-1 h-7 rounded-lg border transition-all cursor-pointer ${
                          config.backgroundValue === d.value
                            ? "ring-2 ring-white border-transparent"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={d.name}
                      />
                    ))}
                    <button
                      onClick={() => setExpandedSection("desktop")}
                      className="w-7 h-7 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 9. Gradients Row */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-300">Gradients</span>
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === "gradients" ? "none" : "gradients")
                    }
                    className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedSection === "gradients" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === "gradients" ? (
                  <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-[#222222] border border-white/5 animate-in fade-in duration-100">
                    {PRESET_GRADIENTS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "gradient",
                            backgroundValue: g.value,
                          })
                        }
                        style={{ background: g.value }}
                        className={`h-8 rounded-lg border transition-all cursor-pointer ${
                          config.backgroundValue === g.value
                            ? "ring-2 ring-white border-transparent"
                            : "border-white/10 opacity-85 hover:opacity-100"
                        }`}
                        title={g.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    {PRESET_GRADIENTS.slice(0, 4).map((g) => (
                      <button
                        key={g.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "gradient",
                            backgroundValue: g.value,
                          })
                        }
                        style={{ background: g.value }}
                        className={`flex-1 h-7 rounded-lg border transition-all cursor-pointer ${
                          config.backgroundValue === g.value
                            ? "ring-2 ring-white border-transparent"
                            : "border-white/10 hover:scale-105"
                        }`}
                        title={g.name}
                      />
                    ))}
                    <button
                      onClick={() => setExpandedSection("gradients")}
                      className="w-7 h-7 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 10. Tahoe & Paper Glass (if Image or Unsplash selected) */}
              {(bgCategory === "image" || bgCategory === "unsplash") && (
                <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {bgCategory === "image" ? "Paper Glass 4K" : "Tahoe High Res"}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(bgCategory === "image" ? PRESET_PAPER_GLASS : PRESET_TAHOE).map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          updateConfig({
                            backgroundType: "image",
                            backgroundValue: item.value,
                          })
                        }
                        className={`h-11 rounded-lg overflow-hidden border transition-all cursor-pointer relative ${
                          config.backgroundValue === item.value
                            ? "ring-2 ring-white border-transparent"
                            : "border-white/10 opacity-85 hover:opacity-100"
                        }`}
                        title={item.name}
                      >
                        <img
                          src={item.preview}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 11. Text & Badges Annotations Drawer */}
              <div className="pt-2 border-t border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
                    TEXT & BADGES
                  </span>
                  <input
                    type="checkbox"
                    checked={config.annotationsEnabled}
                    onChange={(e) =>
                      updateConfig({ annotationsEnabled: e.target.checked })
                    }
                    className="w-3.5 h-3.5 accent-white cursor-pointer"
                  />
                </div>

                {config.annotationsEnabled && (
                  <div className="p-2.5 rounded-xl bg-[#242424] space-y-2 mt-1">
                    <div>
                      <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                        BADGE / PILL
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="text"
                          value={config.annotationBadge || ""}
                          onChange={(e) =>
                            updateConfig({ annotationBadge: e.target.value })
                          }
                          placeholder="Ex: NOVO V2.0"
                          className="flex-1 px-2 py-1 rounded-lg bg-[#181818] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none"
                        />
                        <input
                          type="color"
                          value={config.annotationBadgeColor || "#6366f1"}
                          onChange={(e) =>
                            updateConfig({ annotationBadgeColor: e.target.value })
                          }
                          className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          title="Badge Color"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                        HEADLINE
                      </div>
                      <input
                        type="text"
                        value={config.annotationHeadline || ""}
                        onChange={(e) =>
                          updateConfig({ annotationHeadline: e.target.value })
                        }
                        placeholder="Título chamativo..."
                        className="w-full px-2 py-1 rounded-lg bg-[#181818] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                        SUBTITLE
                      </div>
                      <input
                        type="text"
                        value={config.annotationSubtitle || ""}
                        onChange={(e) =>
                          updateConfig({ annotationSubtitle: e.target.value })
                        }
                        placeholder="Descrição secundária..."
                        className="w-full px-2 py-1 rounded-lg bg-[#181818] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
  );
};
