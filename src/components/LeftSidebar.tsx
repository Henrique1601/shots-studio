"use client";

import React, { useRef, useState, useEffect } from "react";
import { useMockupStore } from "@/store/mockupStore";
import {
  STYLE_OPTIONS,
  SHADOW_OPTIONS,
  BorderRoundness,
  PRESET_GRADIENTS,
  PRESET_PAPER_GLASS,
  PRESET_TAHOE,
  PRESET_SOLIDS,
  ASPECT_RATIOS_STANDARD,
  ASPECT_RATIOS_SOCIAL,
  AspectRatioType,
  DEFAULT_RATIO_DIMENSIONS,
  DEVICE_SPECS,
} from "@/types/mockup";
import {
  ChevronDown,
  Sparkles,
  Plus,
  Eye,
  EyeOff,
  SunMedium,
  Box,
  Sliders,
  Check,
  Wand2,
  Code2,
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
  const [bgTab, setBgTab] = useState<
    "gradients" | "glass" | "tahoe" | "solid" | "magic" | "custom"
  >("gradients");
  const [showAdjustLight, setShowAdjustLight] = useState(false);
  const [magicGradients, setMagicGradients] = useState<GeneratedGradient[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

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

  useEffect(() => {
    setInputW(config.customWidth.toString());
    setInputH(config.customHeight.toString());
  }, [config.customWidth, config.customHeight]);

  const handleSelectRatio = (ratioId: AspectRatioType) => {
    const defaults = DEFAULT_RATIO_DIMENSIONS[ratioId];
    if (defaults) {
      updateConfig({
        aspectRatio: ratioId,
        customWidth: defaults.width,
        customHeight: defaults.height,
      });
      setInputW(defaults.width.toString());
      setInputH(defaults.height.toString());
    } else {
      updateConfig({ aspectRatio: ratioId });
    }
    showToast(`Proporção selecionada: ${ratioId}`, "info");
  };

  const handleSetDimensions = () => {
    const parsedW = parseInt(inputW, 10);
    const parsedH = parseInt(inputH, 10);
    const w = Math.min(8192, Math.max(100, isNaN(parsedW) ? 1920 : parsedW));
    const h = Math.min(8192, Math.max(100, isNaN(parsedH) ? 1080 : parsedH));

    setInputW(w.toString());
    setInputH(h.toString());
    updateConfig({
      customWidth: w,
      customHeight: h,
      aspectRatio: "custom",
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
    <aside className="hidden lg:flex w-[228px] shrink-0 bg-[#1c1c1c] rounded-2xl flex-col h-[calc(100vh-6.5rem)] my-auto ml-3 select-none text-white overflow-hidden shadow-2xl border border-white/5 relative z-20">
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
                      codeLanguage: e.target.value as any,
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
                  onClick={() => updateConfig({ frameStyle: style.id as any })}
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
                  onClick={() => updateConfig({ shadowMode: shadow.id as any })}
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
        <div className="w-[228px] shrink-0 h-full overflow-y-auto p-3 space-y-4">
          {/* DIMENSIONS: Inputs W & H with Set button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
                DIMENSIONS
              </span>
              {config.aspectRatio === "custom" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                  Custom
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 bg-[#222222] p-1 rounded-xl">
              <div className="flex-1 flex items-center px-2 py-1 bg-[#181818] rounded-lg text-xs">
                <span className="text-neutral-500 mr-1 text-[10px]">W</span>
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
                <span className="text-neutral-500 mr-1 text-[10px]">H</span>
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
          </div>

          {/* STANDARD ASPECT RATIOS */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              STANDARD RATIOS
            </div>
            <div className="grid grid-cols-3 gap-1">
              {ASPECT_RATIOS_STANDARD.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectRatio(item.id)}
                  className={`py-1.5 text-center text-xs rounded-lg transition-all cursor-pointer ${
                    config.aspectRatio === item.id
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-[#222222] text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* SOCIAL MEDIA RATIOS */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              SOCIAL MEDIA
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ASPECT_RATIOS_SOCIAL.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRatio(item.id)}
                  className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                    config.aspectRatio === item.id
                      ? "border-white bg-[#2e2e2e]"
                      : "border-transparent bg-[#222222] hover:bg-[#282828]"
                  }`}
                >
                  <div className="text-[11px] font-semibold text-white">
                    {item.label}
                  </div>
                  <div className="text-[9px] text-neutral-400">{item.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* TEXT & BADGES ANNOTATIONS */}
          <div>
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

                <div className="flex items-center space-x-1 pt-1">
                  <div className="flex-1">
                    <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                      POSIÇÃO
                    </div>
                    <div className="flex bg-[#181818] p-0.5 rounded-lg text-[10px]">
                      <button
                        onClick={() => updateConfig({ annotationPosition: "top" })}
                        className={`flex-1 py-1 rounded transition-colors ${
                          config.annotationPosition === "top"
                            ? "bg-[#333] text-white font-medium"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        Top
                      </button>
                      <button
                        onClick={() =>
                          updateConfig({ annotationPosition: "bottom" })
                        }
                        className={`flex-1 py-1 rounded transition-colors ${
                          config.annotationPosition === "bottom"
                            ? "bg-[#333] text-white font-medium"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        Bottom
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                      ALINHAR
                    </div>
                    <div className="flex bg-[#181818] p-0.5 rounded-lg text-[10px]">
                      {(
                        [
                          { id: "left", label: "L" },
                          { id: "center", label: "C" },
                          { id: "right", label: "R" },
                        ] as const
                      ).map((a) => (
                        <button
                          key={a.id}
                          onClick={() => updateConfig({ annotationAlign: a.id })}
                          className={`flex-1 py-1 rounded transition-colors ${
                            config.annotationAlign === a.id
                              ? "bg-[#333] text-white font-medium"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EFFECTS & WATERMARK */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              EFFECTS & WATERMARK
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#222222] text-xs">
                <span className="text-neutral-300 text-[11px]">Watermark / Assinatura</span>
                <input
                  type="checkbox"
                  checked={config.watermark}
                  onChange={(e) => updateConfig({ watermark: e.target.checked })}
                  className="w-3.5 h-3.5 accent-white cursor-pointer"
                />
              </div>

              {/* Watermark Customization Drawer */}
              {config.watermark && (
                <div className="p-2.5 rounded-xl bg-[#1e1e1e] space-y-2 border border-white/5 animate-in fade-in duration-150">
                  <div>
                    <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                      TEXTO / ARROBA DA MARCA
                    </div>
                    <input
                      type="text"
                      value={config.watermarkText || ""}
                      onChange={(e) => updateConfig({ watermarkText: e.target.value })}
                      placeholder="Ex: @seunome ou Shots.so"
                      className="w-full px-2 py-1 rounded-lg bg-[#141414] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                      ÍCONE / PLATAFORMA
                    </div>
                    <div className="flex bg-[#141414] p-0.5 rounded-lg text-[9px]">
                      {(
                        [
                          { id: "shots", label: "Shots" },
                          { id: "twitter", label: "𝕏" },
                          { id: "instagram", label: "Insta" },
                          { id: "none", label: "Texto" },
                        ] as const
                      ).map((plat) => (
                        <button
                          key={plat.id}
                          onClick={() => updateConfig({ watermarkPlatform: plat.id })}
                          className={`flex-1 py-1 rounded transition-colors cursor-pointer ${
                            config.watermarkPlatform === plat.id
                              ? "bg-[#333] text-white font-medium"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {plat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] text-neutral-400 font-semibold mb-1">
                      CANTO DO CANVAS
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[9px]">
                      {(
                        [
                          { id: "top-left", label: "TL" },
                          { id: "top-right", label: "TR" },
                          { id: "bottom-left", label: "BL" },
                          { id: "bottom-right", label: "BR" },
                        ] as const
                      ).map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => updateConfig({ watermarkPosition: pos.id })}
                          className={`py-1 rounded text-center transition-colors cursor-pointer ${
                            config.watermarkPosition === pos.id
                              ? "bg-white text-black font-semibold"
                              : "bg-[#141414] text-neutral-400 hover:text-white"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#222222] text-xs">
                <span className="text-neutral-300 text-[11px]">Noise Texture</span>
                <input
                  type="checkbox"
                  checked={config.noiseOverlay}
                  onChange={(e) =>
                    updateConfig({ noiseOverlay: e.target.checked })
                  }
                  className="w-3.5 h-3.5 accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SCENE (None, Shapes) */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              SCENE
            </div>
            <div className="p-2.5 rounded-xl bg-[#242424] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">
                    3D Shapes Scene
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.shapesSceneEnabled}
                  onChange={(e) =>
                    updateConfig({ shapesSceneEnabled: e.target.checked })
                  }
                  className="w-3.5 h-3.5 accent-white cursor-pointer"
                />
              </div>

              {config.shapesSceneEnabled && (
                <div className="space-y-2 pt-2 border-t border-[#333]">
                  <div className="text-[9px] text-neutral-400 uppercase font-semibold">
                    Shapes Pack (7 Collections)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
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
                        onClick={() => updateConfig({ shapesPack: pack.id })}
                        className={`py-1 px-1.5 rounded text-[9px] font-medium border text-center transition-all cursor-pointer ${
                          config.shapesPack === pack.id
                            ? "border-cyan-400 bg-cyan-400/10 text-white"
                            : "border-transparent bg-[#1c1c1c] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {pack.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-[9px] text-neutral-400 uppercase font-semibold">
                    Layout Pattern (10 Layouts)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
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
                        onClick={() => updateConfig({ shapesLayoutName: lay.id })}
                        className={`py-1 rounded text-[9px] font-medium border text-center transition-all cursor-pointer ${
                          config.shapesLayoutName === lay.id
                            ? "border-cyan-400 bg-cyan-400/10 text-white font-semibold"
                            : "border-transparent bg-[#1c1c1c] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BACKGROUND PRESETS CATEGORIZED */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
                BACKGROUNDS
              </span>
            </div>

            {/* Background Category Selector */}
            <div className="flex bg-[#141414] p-0.5 rounded-lg mb-2 text-[10px] font-medium">
              {(
                [
                  { id: "gradients", label: "Grad" },
                  { id: "glass", label: "Glass" },
                  { id: "tahoe", label: "Tahoe" },
                  { id: "solid", label: "Solid" },
                  { id: "magic", label: "Magic ✨" },
                  { id: "custom", label: "Custom" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setBgTab(t.id)}
                  className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
                    bgTab === t.id
                      ? "bg-[#282828] text-white shadow-sm font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 1. Gradients */}
            {bgTab === "gradients" && (
              <div className="grid grid-cols-2 gap-1.5">
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
                    className={`h-9 rounded-lg transition-all cursor-pointer ${
                      config.backgroundValue === g.value
                        ? "ring-2 ring-white scale-102"
                        : "opacity-85 hover:opacity-100"
                    }`}
                    title={g.name}
                  />
                ))}
              </div>
            )}

            {/* 2. Paper Glass */}
            {bgTab === "glass" && (
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_PAPER_GLASS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      updateConfig({
                        backgroundType: "image",
                        backgroundValue: p.value,
                      })
                    }
                    className={`h-11 rounded-lg overflow-hidden border transition-all cursor-pointer relative ${
                      config.backgroundValue === p.value
                        ? "ring-2 ring-white border-transparent"
                        : "border-white/10 opacity-85 hover:opacity-100"
                    }`}
                    title={p.name}
                  >
                    <img
                      src={p.preview}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 3. Tahoe */}
            {bgTab === "tahoe" && (
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_TAHOE.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      updateConfig({
                        backgroundType: "image",
                        backgroundValue: t.value,
                      })
                    }
                    className={`h-11 rounded-lg overflow-hidden border transition-all cursor-pointer relative ${
                      config.backgroundValue === t.value
                        ? "ring-2 ring-white border-transparent"
                        : "border-white/10 opacity-85 hover:opacity-100"
                    }`}
                    title={t.name}
                  >
                    <img
                      src={t.preview}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 4. Solid */}
            {bgTab === "solid" && (
              <div className="grid grid-cols-3 gap-1.5">
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
                    className={`h-9 rounded-lg border transition-all cursor-pointer ${
                      config.backgroundValue === s.value
                        ? "ring-2 ring-white scale-102 border-transparent"
                        : "border-white/10 opacity-85 hover:opacity-100"
                    }`}
                    title={s.name}
                  />
                ))}
              </div>
            )}

            {/* 5. Magic Palette Extractor */}
            {bgTab === "magic" && (
              <div className="space-y-3 p-2.5 rounded-xl bg-[#242424] border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-300 tracking-wider">
                    MAGIC PALETTE
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">
                    AI Auto
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  Extrai cores dominantes da sua screenshot e gera gradientes harmônicos automaticamente.
                </p>

                <button
                  disabled={isExtracting}
                  onClick={handleExtractMagicPalette}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isExtracting ? "animate-spin" : ""}`} />
                  <span>{isExtracting ? "Analisando Cores..." : "Extrair Cores da Imagem"}</span>
                </button>

                {magicGradients.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#333]">
                    <div className="text-[9px] text-neutral-400 uppercase font-semibold mb-1">
                      Gradientes Harmônicos Gerados
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
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
                          className={`h-11 rounded-lg border transition-all cursor-pointer flex items-end p-1 text-[9px] text-white font-medium shadow-md ${
                            config.backgroundValue === g.css
                              ? "ring-2 ring-white border-transparent"
                              : "border-white/10 opacity-90 hover:opacity-100"
                          }`}
                          title={g.name}
                        >
                          <span className="bg-black/60 px-1 py-0.5 rounded text-[8px] truncate max-w-full backdrop-blur-xs">
                            {g.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Custom Solid & Gradient Builder */}
            {bgTab === "custom" && (
              <div className="space-y-3 p-2.5 rounded-xl bg-[#242424]">
                {/* Solid Color Picker */}
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase font-semibold mb-1">
                    Cor Sólida Customizada
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.customColor1 || "#0f172a"}
                      onChange={(e) => {
                        const col = e.target.value;
                        updateConfig({
                          customColor1: col,
                          backgroundType: "solid",
                          backgroundValue: col,
                        });
                      }}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={config.customColor1 || "#0f172a"}
                      onChange={(e) => {
                        const col = e.target.value;
                        updateConfig({
                          customColor1: col,
                          backgroundType: "solid",
                          backgroundValue: col,
                        });
                      }}
                      className="flex-1 px-2 py-1 rounded bg-[#181818] border border-neutral-700 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                {/* 2-Stop Gradient Builder */}
                <div className="pt-2 border-t border-[#333] space-y-2">
                  <div className="text-[9px] text-neutral-400 uppercase font-semibold">
                    Gradiente 2 Cores
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex items-center space-x-1.5 bg-[#181818] p-1 rounded-lg">
                      <input
                        type="color"
                        value={config.customColor1 || "#6366f1"}
                        onChange={(e) =>
                          updateConfig({ customColor1: e.target.value })
                        }
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-[10px] font-mono text-neutral-300">
                        {config.customColor1 || "#6366f1"}
                      </span>
                    </div>
                    <span className="text-neutral-500 text-xs">→</span>
                    <div className="flex-1 flex items-center space-x-1.5 bg-[#181818] p-1 rounded-lg">
                      <input
                        type="color"
                        value={config.customColor2 || "#ec4899"}
                        onChange={(e) =>
                          updateConfig({ customColor2: e.target.value })
                        }
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-[10px] font-mono text-neutral-300">
                        {config.customColor2 || "#ec4899"}
                      </span>
                    </div>
                  </div>

                  {/* Angle Slider */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-neutral-400 text-[10px]">
                      Ângulo ({config.customGradientAngle ?? 135}°)
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={config.customGradientAngle ?? 135}
                      onChange={(e) =>
                        updateConfig({
                          customGradientAngle: Number(e.target.value),
                        })
                      }
                      className="w-24 accent-white h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const c1 = config.customColor1 || "#6366f1";
                      const c2 = config.customColor2 || "#ec4899";
                      const ang = config.customGradientAngle ?? 135;
                      const gradVal = `linear-gradient(${ang}deg, ${c1} 0%, ${c2} 100%)`;
                      updateConfig({
                        backgroundType: "gradient",
                        backgroundValue: gradVal,
                      });
                      showToast("Gradiente aplicado ao canvas! ✨", "success");
                    }}
                    className="w-full py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Aplicar Gradiente
                  </button>
                </div>
              </div>
            )}

            {/* Depth of Field (Background Bokeh Blur) Slider */}
            <div className="mt-4 pt-3 border-t border-[#2a2a2a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Depth of Field (Bokeh)
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {config.backgroundBlur ?? 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={config.backgroundBlur ?? 0}
                onChange={(e) => updateConfig({ backgroundBlur: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
              />
              <div className="grid grid-cols-4 gap-1 text-[8px]">
                {[
                  { label: "None", val: 0 },
                  { label: "Subtle", val: 8 },
                  { label: "Studio", val: 18 },
                  { label: "Bokeh", val: 32 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => updateConfig({ backgroundBlur: preset.val })}
                    className={`py-0.5 rounded border text-center transition-all cursor-pointer ${
                      (config.backgroundBlur ?? 0) === preset.val
                        ? "border-cyan-400 bg-cyan-400/10 text-white font-bold"
                        : "border-transparent bg-[#1c1c1c] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Film Grain & Analogue Texture Overlay Slider */}
            <div className="mt-3 pt-3 border-t border-[#2a2a2a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Film Grain & Noise
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {config.grainIntensity ?? 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.grainIntensity ?? 0}
                onChange={(e) => updateConfig({ grainIntensity: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1 bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
              />
              <div className="grid grid-cols-4 gap-1 text-[8px]">
                {[
                  { label: "0% Off", val: 0 },
                  { label: "15% Fine", val: 15 },
                  { label: "35% Film", val: 35 },
                  { label: "60% Retro", val: 60 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => updateConfig({ grainIntensity: preset.val })}
                    className={`py-0.5 rounded border text-center transition-all cursor-pointer ${
                      (config.grainIntensity ?? 0) === preset.val
                        ? "border-cyan-400 bg-cyan-400/10 text-white font-bold"
                        : "border-transparent bg-[#1c1c1c] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
