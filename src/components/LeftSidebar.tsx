"use client";

import React, { useRef, useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import {
  STYLE_OPTIONS,
  SHADOW_OPTIONS,
  BorderRoundness,
  PRESET_GRADIENTS,
  PRESET_MYSTIC,
  PRESET_DESKTOP,
  PRESET_PAPER_GLASS,
  PortraitLightingMode,
  PRESET_TAHOE,
  PRESET_SOLIDS,
  ASPECT_RATIOS_STANDARD,
  AspectRatioType,
  DEFAULT_RATIO_DIMENSIONS,
  DEVICE_SPECS,
  VfxType,
  FrameStyle,
  ShadowMode,
  CodeLanguage,
  WatermarkProfile,
} from "@/types/mockup";
import {
  ChevronDown,
  Sparkles,
  Plus,
  Eye,
  EyeOff,
  SunMedium,
  Box,
  Wand2,
  Code2,
  Aperture,
  Droplet,
  Ban,
  Contrast,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { extractPaletteFromImage, GeneratedGradient } from "@/utils/magicPalette";

export const LeftSidebar = () => {
  const {
    config,
    imageUrl,
    setImageUrl,
    setSecondaryImageUrl,
    setTertiaryImageUrl,
    setImageDimensions,
    updateConfig,
    setDeviceModalOpen,
    showToast,
  } = useMockupStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const tertiaryFileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [inputW, setInputW] = useState(config.customWidth.toString());
  const [inputH, setInputH] = useState(config.customHeight.toString());
  const [showAdjustLight, setShowAdjustLight] = useState(false);
  const [magicGradients, setMagicGradients] = useState<GeneratedGradient[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // Frame Tab & Mini-Sidebars state (Shots.so 1:1)
  const [isRatioDropdownOpen, setIsRatioDropdownOpen] = useState(false);
  const [activeMiniSidebar, setActiveMiniSidebar] = useState<
    "none" | "portrait" | "watermark" | "bg-effects" | "vfx" | "shapes"
  >("none");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setImageUrl(url);
      };
      img.src = url;
    }
  };

  const handleSecondaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSecondaryImageUrl(url);
      showToast("Segunda imagem carregada! 📱", "success");
    }
  };

  const handleTertiaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTertiaryImageUrl(url);
      showToast("Terceira imagem carregada! 📱", "success");
    }
  };

  const switchTab = (tab: "mockup" | "frame") => {
    updateConfig({ activeTab: tab });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: tab === "mockup" ? 0 : 228,
        behavior: "smooth",
      });
    }
  };

  const deviceSpec = DEVICE_SPECS[config.frameType] || DEVICE_SPECS.screenshot;

  return (
    <div className="hidden lg:flex relative h-[calc(100vh-6.5rem)] my-auto ml-3 select-none z-30 shrink-0">
      <aside className="w-[228px] shrink-0 bg-[#1c1c1c] rounded-2xl flex flex-col h-full text-white overflow-hidden shadow-2xl border border-white/5 relative z-20">
      {/* Top Tabs: Mockup vs Frame with active indicator pill */}
      <div className="p-2 border-b border-[#262626] shrink-0">
        <div className="flex bg-[#141414] p-0.5 rounded-xl relative">
          <button
            onClick={() => switchTab("mockup")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              config.activeTab === "mockup"
                ? "bg-[#282828] text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Mockup
          </button>
          <button
            onClick={() => switchTab("frame")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              config.activeTab === "frame"
                ? "bg-[#282828] text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Frame
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container for Tabs */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-hidden overflow-y-hidden scroll-smooth w-[228px]"
      >
        {/* ================= PÁGINA 1: MOCKUP CONTROLS ================= */}
        <div className="w-[228px] shrink-0 h-full overflow-y-auto p-3 space-y-4">
          {/* Device Selector Card */}
          <div>
            <button
              onClick={() => setDeviceModalOpen(true)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#242424] hover:bg-[#2c2c2c] transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-black/40 overflow-hidden flex items-center justify-center p-0.5">
                  <img
                    src={
                      deviceSpec.deviceImg ||
                      "/shots-assets/image_mockup-icons_screenshot.png"
                    }
                    alt={deviceSpec.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold capitalize text-white truncate max-w-[120px]">
                    {deviceSpec.name}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {deviceSpec.isDevice ? "Device Mockup" : "Adapts To Media"}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            </button>

            {/* Magic Preset pill */}
            <div className="mt-1.5 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#222222] text-xs">
              <div className="flex items-center space-x-1.5 text-neutral-300">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-[11px] font-medium">Magic Preset</span>
              </div>
              <div className="flex items-center space-x-1 text-neutral-400 font-mono">
                <button className="hover:text-white px-1">‹</button>
                <button className="hover:text-white px-1">›</button>
              </div>
            </div>

            {/* Device Color Finish (Titanium & Metal Finishes) */}
            {deviceSpec.isDevice && (
              <div className="mt-2.5">
                <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1">
                  FINISH / ACABAMENTO
                </div>
                <div className="grid grid-cols-3 gap-1 text-[9px]">
                  {(
                    [
                      { id: "default", label: "Default" },
                      { id: "space-black", label: "Black" },
                      { id: "silver", label: "Silver" },
                      { id: "natural-titanium", label: "Natural" },
                      { id: "desert-titanium", label: "Desert" },
                    ] as const
                  ).map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => updateConfig({ deviceColor: finish.id })}
                      className={`py-1 px-1 rounded-lg border text-center transition-all cursor-pointer truncate ${
                        config.deviceColor === finish.id
                          ? "border-white bg-[#333] text-white font-semibold"
                          : "border-transparent bg-[#1e1e1e] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {finish.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Browser / Desktop Window Title or URL */}
          {(config.frameType === "browser" || config.frameType === "minimal-desktop") && (
            <div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
                WINDOW URL / TITLE
              </div>
              <input
                type="text"
                value={config.browserUrl ?? ""}
                onChange={(e) => updateConfig({ browserUrl: e.target.value })}
                placeholder={config.frameType === "minimal-desktop" ? "Studio Workspace" : "shots.so/editor"}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#222222] border border-neutral-700 hover:border-neutral-500 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Ray.so / Carbon Code Snippet Studio Settings */}
          {config.frameType === "code" && (
            <div className="space-y-3 p-2.5 rounded-xl bg-[#242424] border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-300 tracking-wider flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CODE STUDIO</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  IDE
                </span>
              </div>

              {/* Title / Filename */}
              <div>
                <label className="text-[9px] text-neutral-400 uppercase font-semibold block mb-1">
                  File Name / Window Title
                </label>
                <input
                  type="text"
                  value={config.codeTitle ?? "metrics.ts"}
                  onChange={(e) => updateConfig({ codeTitle: e.target.value })}
                  placeholder="index.ts"
                  className="w-full px-2 py-1 rounded bg-[#181818] border border-neutral-700 text-xs text-white font-mono"
                />
              </div>

              {/* Language Selector */}
              <div>
                <label className="text-[9px] text-neutral-400 uppercase font-semibold block mb-1">
                  Language / Sintaxe
                </label>
                <select
                  value={config.codeLanguage ?? "typescript"}
                  onChange={(e) =>
                    updateConfig({
                      codeLanguage: e.target.value as CodeLanguage,
                    })
                  }
                  className="w-full px-2 py-1.5 rounded bg-[#181818] border border-neutral-700 text-xs text-white capitalize cursor-pointer"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                  <option value="sql">SQL</option>
                </select>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-[9px] text-neutral-400 uppercase font-semibold block mb-1">
                  Theme / Paleta Visual
                </label>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {(
                    [
                      { id: "one-dark", label: "One Dark" },
                      { id: "dracula", label: "Dracula" },
                      { id: "tokyo-night", label: "Tokyo Night" },
                      { id: "github-dark", label: "GitHub Dark" },
                      { id: "monokai", label: "Monokai" },
                    ] as const
                  ).map((th) => (
                    <button
                      key={th.id}
                      onClick={() => updateConfig({ codeTheme: th.id })}
                      className={`py-1 px-1.5 rounded border text-center transition-all cursor-pointer truncate ${
                        config.codeTheme === th.id
                          ? "border-cyan-400 bg-cyan-400/10 text-white font-semibold"
                          : "border-transparent bg-[#1e1e1e] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Numbers Toggle */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-neutral-300">Show Line Numbers</span>
                <input
                  type="checkbox"
                  checked={config.codeShowLineNumbers ?? true}
                  onChange={(e) =>
                    updateConfig({ codeShowLineNumbers: e.target.checked })
                  }
                  className="accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Code Snippet Textarea */}
              <div>
                <label className="text-[9px] text-neutral-400 uppercase font-semibold block mb-1">
                  Code Snippet
                </label>
                <textarea
                  rows={5}
                  value={config.codeSnippet ?? ""}
                  onChange={(e) => updateConfig({ codeSnippet: e.target.value })}
                  placeholder="// Paste your code here..."
                  className="w-full px-2 py-1.5 rounded bg-[#181818] border border-neutral-700 text-xs text-neutral-200 font-mono resize-y focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* LAYOUT MODE (Single, Duo, Trio) */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              LAYOUT MODE
            </div>
            <div className="flex bg-[#222222] p-0.5 rounded-xl">
              <button
                onClick={() => updateConfig({ mockupMode: "single" })}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                  config.mockupMode === "single"
                    ? "bg-[#333333] text-white font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                1 Single
              </button>
              <button
                onClick={() => updateConfig({ mockupMode: "duo" })}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                  config.mockupMode === "duo"
                    ? "bg-[#333333] text-white font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                2 Duo
              </button>
              <button
                onClick={() => updateConfig({ mockupMode: "trio" })}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                  config.mockupMode === "trio"
                    ? "bg-[#333333] text-white font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                3 Trio
              </button>
            </div>
          </div>

          {/* Media Upload Area (Slot 1) */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              {config.mockupMode !== "single" ? "1º DISPOSITIVO (MEDIA)" : "MEDIA"}
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-20 rounded-xl bg-[#222222] hover:bg-[#282828] border border-dashed border-neutral-700 hover:border-neutral-500 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#303030] group-hover:bg-[#383838] flex items-center justify-center mb-1 transition-colors">
                <Plus className="w-3.5 h-3.5 text-neutral-200 group-hover:text-white" />
              </div>
              <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200">
                {imageUrl ? "Substituir 1ª mídia" : "Drop media or click to choose"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Image Fit & Pan Controls */}
          {imageUrl && (
            <div className="p-2 rounded-xl bg-[#222222] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Enquadramento</span>
                <div className="flex bg-[#181818] p-0.5 rounded-lg text-[10px]">
                  <button
                    onClick={() => updateConfig({ imageFit: "cover" })}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      config.imageFit === "cover" ? "bg-[#333] text-white font-semibold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Cover
                  </button>
                  <button
                    onClick={() => updateConfig({ imageFit: "contain" })}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      config.imageFit === "contain" ? "bg-[#333] text-white font-semibold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Contain
                  </button>
                </div>
              </div>

              {/* Vertical Pan (Scroll) */}
              <div className="flex items-center justify-between text-xs px-0.5">
                <span className="text-neutral-400 text-[10px]">Posição Y</span>
                <div className="flex items-center space-x-2 w-28">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.imagePositionY ?? 50}
                    onChange={(e) => updateConfig({ imagePositionY: Number(e.target.value) })}
                    className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-300 w-6 text-right font-mono">
                    {config.imagePositionY ?? 50}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY MEDIA (Slot 2 for Duo or Trio) */}
          {(config.mockupMode === "duo" || config.mockupMode === "trio") && (
            <div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
                2º DISPOSITIVO (MEDIA)
              </div>
              <div
                onClick={() => secondaryFileInputRef.current?.click()}
                className="w-full h-16 rounded-xl bg-[#222222] hover:bg-[#282828] border border-dashed border-neutral-700 hover:border-neutral-500 flex flex-col items-center justify-center cursor-pointer transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#303030] group-hover:bg-[#383838] flex items-center justify-center mb-1 transition-colors">
                  <Plus className="w-3 h-3 text-neutral-200 group-hover:text-white" />
                </div>
                <span className="text-[9px] text-neutral-400 group-hover:text-neutral-200">
                  {config.secondaryImageUrl ? "Substituir 2ª imagem" : "Upload 2nd device media"}
                </span>
              </div>
              <input
                ref={secondaryFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSecondaryUpload}
              />
            </div>
          )}

          {/* TERTIARY MEDIA (Slot 3 for Trio) */}
          {config.mockupMode === "trio" && (
            <div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
                3º DISPOSITIVO (MEDIA)
              </div>
              <div
                onClick={() => tertiaryFileInputRef.current?.click()}
                className="w-full h-16 rounded-xl bg-[#222222] hover:bg-[#282828] border border-dashed border-neutral-700 hover:border-neutral-500 flex flex-col items-center justify-center cursor-pointer transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#303030] group-hover:bg-[#383838] flex items-center justify-center mb-1 transition-colors">
                  <Plus className="w-3 h-3 text-neutral-200 group-hover:text-white" />
                </div>
                <span className="text-[9px] text-neutral-400 group-hover:text-neutral-200">
                  {config.tertiaryImageUrl ? "Substituir 3ª imagem" : "Upload 3rd device media"}
                </span>
              </div>
              <input
                ref={tertiaryFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleTertiaryUpload}
              />
            </div>
          )}

          {/* Spacing Slider for Duo / Trio */}
          {(config.mockupMode === "duo" || config.mockupMode === "trio") && (
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-neutral-400 text-[11px]">Multi Spacing</span>
              <div className="flex items-center space-x-2 w-28">
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={config.duoGap ?? 24}
                  onChange={(e) =>
                    updateConfig({ duoGap: Number(e.target.value) })
                  }
                  className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-neutral-300 w-4 text-right">
                  {config.duoGap ?? 24}
                </span>
              </div>
            </div>
          )}

          {/* STYLE Selector */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-2">
              STYLE
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => updateConfig({ frameStyle: style.id as FrameStyle })}
                  className={`flex flex-col items-center p-1 rounded-xl border transition-all cursor-pointer ${
                    config.frameStyle === style.id
                      ? "border-white bg-[#2e2e2e]"
                      : "border-transparent bg-[#222222] hover:bg-[#282828]"
                  }`}
                >
                  <div className="w-full h-10 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center mb-1">
                    <img
                      src={style.img}
                      alt={style.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-300 truncate w-full text-center">
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* BORDER Roundness */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              BORDER
            </div>
            <div className="flex bg-[#222222] p-0.5 rounded-xl">
              {(
                [
                  { id: "sharp", label: "Sharp", val: 0 },
                  { id: "curved", label: "Curved", val: 20 },
                  { id: "round", label: "Round", val: 36 },
                ] as const
              ).map((b) => (
                <button
                  key={b.id}
                  onClick={() =>
                    updateConfig({
                      borderRoundness: b.id as BorderRoundness,
                      borderRadius: b.val,
                    })
                  }
                  className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                    config.borderRoundness === b.id
                      ? "bg-[#333333] text-white font-medium"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Exact Radius Slider (0 to 40) */}
            <div className="mt-2.5 flex items-center justify-between text-xs px-1">
              <span className="text-neutral-400 text-[11px]">Radius</span>
              <div className="flex items-center space-x-2 w-28">
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={config.borderRadius}
                  onChange={(e) =>
                    updateConfig({ borderRadius: Number(e.target.value) })
                  }
                  className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-neutral-300 w-4 text-right">
                  {config.borderRadius}
                </span>
              </div>
            </div>
          </div>

          {/* SHADOW Selector */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-2">
              SHADOW
            </div>
            <div className="grid grid-cols-4 gap-1">
              {SHADOW_OPTIONS.map((shadow) => (
                <button
                  key={shadow.id}
                  onClick={() => updateConfig({ shadowMode: shadow.id as ShadowMode })}
                  className={`flex flex-col items-center p-1 rounded-xl border transition-all cursor-pointer ${
                    config.shadowMode === shadow.id
                      ? "border-white bg-[#2e2e2e]"
                      : "border-transparent bg-[#222222] hover:bg-[#282828]"
                  }`}
                >
                  <div className="w-full h-8 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center mb-1">
                    <img
                      src={shadow.img}
                      alt={shadow.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] text-neutral-300">
                    {shadow.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Exact Opacity Slider (10 to 70) */}
            <div className="mt-2.5 flex items-center justify-between text-xs px-1">
              <span className="text-neutral-400 text-[11px]">Opacity</span>
              <div className="flex items-center space-x-2 w-28">
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={config.shadowOpacity}
                  onChange={(e) =>
                    updateConfig({ shadowOpacity: Number(e.target.value) })
                  }
                  className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-neutral-300 w-4 text-right">
                  {config.shadowOpacity}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAdjustLight(!showAdjustLight)}
              className="w-full mt-2.5 py-1.5 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] text-[11px] text-neutral-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <SunMedium className="w-3.5 h-3.5 text-neutral-400" />
              <span>{showAdjustLight ? "Fechar Luz" : "Adjust Light"}</span>
            </button>

            {showAdjustLight && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#1e1e1e] space-y-2 border border-white/5 animate-in fade-in duration-150">
                <div className="text-[9px] text-neutral-400 font-semibold uppercase">
                  Reflexo & Luz da Tela
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  {(
                    [
                      { id: "none", label: "Sem Luz" },
                      { id: "soft-studio", label: "Soft Studio" },
                      { id: "top-left", label: "Top-Left" },
                      { id: "top-right", label: "Top-Right" },
                      { id: "dramatic", label: "Dramatic" },
                    ] as const
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updateConfig({ lightPreset: preset.id })}
                      className={`py-1 px-1.5 rounded-lg border text-center transition-all cursor-pointer truncate ${
                        config.lightPreset === preset.id
                          ? "border-cyan-400 bg-cyan-400/10 text-white font-medium"
                          : "border-transparent bg-[#161616] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {config.lightPreset !== "none" && (
                  <div className="pt-1.5 border-t border-[#2a2a2a] flex items-center justify-between text-xs px-0.5">
                    <span className="text-neutral-400 text-[10px]">Intensidade</span>
                    <div className="flex items-center space-x-2 w-28">
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={config.lightIntensity ?? 35}
                        onChange={(e) =>
                          updateConfig({ lightIntensity: Number(e.target.value) })
                        }
                        className="w-full accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] text-neutral-300 w-6 text-right font-mono">
                        {config.lightIntensity ?? 35}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* VISIBILITY */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              VISIBILITY
            </div>
            <button
              onClick={() => updateConfig({ showMockup: !config.showMockup })}
              className="w-full py-2 px-3 rounded-xl bg-[#242424] hover:bg-[#2c2c2c] text-xs font-medium text-neutral-200 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {config.showMockup ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Hide Mockup</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Show Mockup</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= PÁGINA 2: FRAME CONTROLS (EXATA DO SHOTS.SO) ================= */}
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
      </div>

      </aside>

      {/* ================= FLOATING MINI-SIDEBARS ("MINI SIDEBARS DAS OPÇÕES") ================= */}
      {activeMiniSidebar !== "none" && (
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
      )}
    </div>
  );
};
