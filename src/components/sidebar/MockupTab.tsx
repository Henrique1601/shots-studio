import React, { useRef, useState } from "react";
import {
  ChevronDown,
  Sparkles,
  Code2,
  Plus,
  Focus,
  EyeOff,
  Eye,
} from "lucide-react";
import { useMockupStore } from "@/store/mockupStore";
import {
  DEVICE_SPECS,
  STYLE_OPTIONS,
  SHADOW_OPTIONS,
} from "@/constants/presets";
import type {
  FrameStyle,
  ShadowMode,
  BorderRoundness,
  LightPreset,
  DeviceColorFinish,
  CodeLanguage,
  CodeTheme,
} from "@/types/mockup";
import { extractPaletteFromImage, type GeneratedGradient } from "@/utils/magicPalette";

interface MockupTabProps {
  onExtractPalette?: (gradients: GeneratedGradient[]) => void;
  magicGradients?: GeneratedGradient[];
}

export const MockupTab: React.FC<MockupTabProps> = ({ onExtractPalette }) => {
  const {
    config,
    imageUrl,
    imageDimensions,
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

  const [showAdjustLight, setShowAdjustLight] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

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

  const handleExtractMagicPalette = async () => {
    if (!imageUrl) {
      showToast("Envie uma imagem para extrair a paleta mágica!", "error");
      return;
    }
    setIsExtracting(true);
    try {
      const grads = await extractPaletteFromImage(imageUrl);
      if (onExtractPalette) onExtractPalette(grads);
      showToast("Paleta de estúdio extraída! ✨", "success");
    } catch {
      showToast("Não foi possível extrair cores da imagem", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  const deviceSpec = DEVICE_SPECS[config.frameType] || DEVICE_SPECS.screenshot;

  return (
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
            <div className="grid grid-cols-3 gap-1.5">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => updateConfig({ frameStyle: style.id as FrameStyle })}
                  className={`flex flex-col items-center p-1 rounded-xl border transition-all cursor-pointer ${
                    config.frameStyle === style.id
                      ? "border-white bg-[#2e2e2e] shadow-sm"
                      : "border-transparent bg-[#222222] hover:bg-[#282828]"
                  }`}
                >
                  <div className="w-full h-9 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center mb-1 relative border border-white/5">
                    {style.id === "retro" ? (
                      <div className="w-6 h-5 rounded-xs border-2 border-neutral-700 bg-neutral-200 shadow-sm" />
                    ) : style.id === "card" ? (
                      <div className="w-6 h-5 rounded-sm bg-white border border-neutral-300 shadow-md" />
                    ) : style.id === "stack" ? (
                      <div className="relative w-6 h-5">
                        <div className="absolute inset-0 translate-y-1 translate-x-1 rounded-xs bg-white/20 border border-white/10" />
                        <div className="absolute inset-0 rounded-xs bg-white/80 shadow-md" />
                      </div>
                    ) : style.id === "stack-2" ? (
                      <div className="relative w-6 h-5">
                        <div className="absolute inset-0 rotate-6 rounded-xs bg-white/30" />
                        <div className="absolute inset-0 rounded-xs bg-white/90 shadow-md" />
                      </div>
                    ) : (
                      <img
                        src={style.img}
                        alt={style.label}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-300 truncate w-full text-center">
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
            {/* More Styles Pill */}
            <div className="mt-1.5 flex justify-center">
              <button
                type="button"
                className="w-full py-1 rounded-xl bg-[#222222] hover:bg-[#282828] text-neutral-400 hover:text-white text-xs flex items-center justify-center transition-colors cursor-pointer border border-white/5"
                title="More Style Finishes"
              >
                •••
              </button>
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

            {/* Exact Integrated Capsule Opacity Slider (10 to 70) */}
            <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#242424] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px] font-medium">Opacity</span>
              <div className="flex items-center space-x-2 w-28 ml-2">
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
                <span className="text-[11px] text-white font-mono w-5 text-right font-medium">
                  {config.shadowOpacity}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAdjustLight(!showAdjustLight)}
              className="w-full mt-2.5 py-1.5 rounded-xl bg-[#242424] hover:bg-[#2c2c2c] border border-white/5 text-[11px] text-neutral-200 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer font-medium"
            >
              <Focus className="w-3.5 h-3.5 text-neutral-400" />
              <span>{showAdjustLight ? "Close Adjustments" : "Adjust Light"}</span>
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
              className="w-full py-2 px-3 rounded-xl bg-[#242424] hover:bg-[#2c2c2c] text-xs font-medium text-neutral-200 flex items-center justify-center space-x-2 transition-all cursor-pointer border border-white/5"
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

          {/* DETAILS (Exact Shots.so Spec) */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-wider mb-1.5">
              DETAILS
            </div>
            <div className="p-3 rounded-2xl bg-[#242424] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-[11px]">Device</span>
                <span className="font-semibold text-white text-[11px]">{deviceSpec.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-[11px]">Screen pixels</span>
                <span className="font-medium text-neutral-200 text-[11px]">
                  {deviceSpec.isDevice
                    ? (deviceSpec.aspectRatio.replace(" / ", " × ") + " px")
                    : imageDimensions
                    ? `${imageDimensions.width} × ${imageDimensions.height} px`
                    : "Adapts to image"}
                </span>
              </div>
            </div>
          </div>
        </div>
  );
};
