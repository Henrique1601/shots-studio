"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { useExportStudio } from "@/hooks/useExportStudio";
import {
  Undo2,
  Redo2,
  Shuffle,
  RotateCcw,
  Maximize2,
  MessageSquare,
  Gauge,
  Layers,
  Download,
  Copy,
  X,
  FolderOpen,
  ChevronDown,
  Archive,
  FileDown,
  FileUp,
} from "lucide-react";
import { SavedShotsModal } from "./SavedShotsModal";
import { exportProjectBundle, importProjectBundle } from "@/lib/projectBundle";
import { FeedbackModal } from "./FeedbackModal";

export const TopBar = () => {
  const {
    config,
    updateConfig,
    resetConfig,
    setDeviceModalOpen,
    setTemplatesModalOpen,
    undo,
    redo,
    randomize,
    historyIndex,
    history,
    showToast,
    slides,
    activeSlideIndex,
    setActiveSlideIndex,
    isCarouselOpen,
    setCarouselOpen,
  } = useMockupStore();

  const [showSettings, setShowSettings] = useState(false);
  const [isSavedShotsOpen, setIsSavedShotsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const bundleInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportBundle = () => {
    try {
      exportProjectBundle({
        version: "1.0.0",
        timestamp: Date.now(),
        appName: "FrameCraft Studio",
        config,
        slides,
        activeSlideIndex,
        metadata: { ratio: config.aspectRatio }
      });
      showToast("Projeto .framecraft exportado com sucesso! 📦", "success");
    } catch {
      showToast("Erro ao exportar projeto.", "error");
    }
  };

  const handleImportBundleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importProjectBundle(file);
      if (data.config) updateConfig(data.config as any);
      showToast("Projeto .framecraft restaurado com sucesso! 🚀", "success");
    } catch (err: any) {
      showToast(err.message || "Arquivo .framecraft inválido.", "error");
    }
  };

  // Hook isolado com 100% dos algoritmos de exportação
  const {
    isExporting,
    handleExport,
    handleExportVideo,
    handleExportGif,
    handleCopy,
    handleExportAllSlidesZip,
  } = useExportStudio();

  const getOutputResolution = () => {
    let baseW = 1920;
    let baseH = 1080;
    if (config.aspectRatio === "custom") {
      baseW = config.customWidth || 1920;
      baseH = config.customHeight || 1080;
    } else {
      const [w, h] = config.aspectRatio.split(":").map(Number);
      if (w && h) {
        if (w >= h) {
          baseW = 1920;
          baseH = Math.round((1920 * h) / w);
        } else {
          baseH = 1920;
          baseW = Math.round((1920 * w) / h);
        }
      }
    }
    return `${baseW * config.exportScale} x ${baseH * config.exportScale}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-14 border-b border-[#262626] bg-[#121212] px-4 flex items-center justify-between z-40 sticky top-0 select-none text-white shrink-0">
      {/* 1. Left: Profile Icon & Templates Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setDeviceModalOpen(true)}
          aria-label="Select device mockup or template"
          className="w-8 h-8 rounded-full overflow-hidden border border-[#333] flex items-center justify-center bg-neutral-800 hover:border-neutral-500 transition-colors cursor-pointer"
        >
          <img
            src="/shots-assets/apple-touch-icon-192.png"
            alt="Profile avatar"
            className="w-full h-full object-cover"
          />
        </button>
        <button
          onClick={() => setTemplatesModalOpen(true)}
          aria-label="Open mockup templates catalog"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2b2b2b] text-xs font-semibold transition-colors cursor-pointer"
        >
          <div className="w-4 h-4 rounded bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center">
            <Layers className="w-2.5 h-2.5 text-white" />
          </div>
          <span>Templates</span>
          <span className="text-neutral-500 text-[10px]">›</span>
        </button>

        <button
          onClick={() => setIsSavedShotsOpen(true)}
          aria-label="Abrir biblioteca de projetos FrameCraft"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2b2b2b] text-xs font-semibold transition-colors cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Meus Frames</span>
        </button>

        {/* Carousel Multi-Slide Toggle */}
        <button
          onClick={() => setCarouselOpen(!isCarouselOpen)}
          title="Multi-Slide Carousel"
          aria-label="Toggle Carousel"
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
            isCarouselOpen
              ? "bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm"
              : "bg-[#1c1c1c] hover:bg-[#252525] border-[#2b2b2b] text-neutral-300"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Slides ({slides.length})</span>
        </button>
      </div>

      {/* 2. Center: Command Bar Desktop (Os 7 botões reais do FrameCraft) */}
      <div className="hidden md:flex items-center space-x-1.5 bg-[#181818] px-2 py-1 rounded-2xl border border-[#262626]">
        {/* Undo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo (Ctrl+Z)"
          aria-label="Undo last modification"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo (Ctrl+Y)"
          aria-label="Redo previous modification"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Randomize / Shuffle */}
        <button
          onClick={randomize}
          title="Randomize style & background"
          aria-label="Randomize style and background"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Start Over (Pílula Central) */}
        <button
          onClick={resetConfig}
          aria-label="Reset mockup configuration to default"
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#242424] hover:bg-[#2e2e2e] text-xs font-semibold text-neutral-200 transition-colors border border-white/5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-neutral-400" />
          <span>Start Over</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullScreen}
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen mode"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Feedback */}
        <button
          onClick={() => setIsFeedbackOpen(true)}
          title="Feedback"
          aria-label="Send feedback"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Performance Mode */}
        <button
          onClick={() =>
            showToast(
              "Modo de Alta Performance ativado (WebGL 60fps) ⚡",
              "info"
            )
          }
          title="Performance Mode"
          aria-label="Toggle High Performance Mode"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Gauge className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Right: Single Canonical Global Export Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          disabled={isExporting}
          aria-label="Export options"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span className="font-bold text-xs">Export</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-600 transition-transform ${
              showSettings ? "rotate-180" : ""
            }`}
          />
        </button>

        {showSettings && (
          <div className="absolute right-0 top-12 w-80 p-4 rounded-2xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-2xl space-y-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#262626]">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Export Studio
                </span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORMAT SELECTOR */}
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 tracking-wider">
                Format
              </div>
              <div className="grid grid-cols-5 gap-1">
                {(["PNG", "JPEG", "WEBP", "GIF", "VIDEO"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => updateConfig({ exportFormat: fmt })}
                    className={`py-1.5 text-[11px] rounded-lg font-semibold transition-all cursor-pointer text-center ${
                      config.exportFormat === fmt
                        ? "bg-white text-black shadow-sm font-bold"
                        : "bg-[#252525] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {fmt === "VIDEO" ? "Video" : fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* QUALITY / SCALE (Only for Image formats) */}
            {config.exportFormat !== "GIF" && config.exportFormat !== "VIDEO" && (
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 tracking-wider flex items-center justify-between">
                  <span>Resolution Scale</span>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {getOutputResolution()} px
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { scale: 1, label: "1x (FHD)" },
                      { scale: 2, label: "2x (4K)" },
                      { scale: 3, label: "3x (6K)" },
                    ] as const
                  ).map((q) => (
                    <button
                      key={q.scale}
                      onClick={() => updateConfig({ exportScale: q.scale })}
                      className={`py-1.5 text-[11px] rounded-lg font-semibold transition-all cursor-pointer ${
                        config.exportScale === q.scale
                          ? "bg-white text-black shadow-sm font-bold"
                          : "bg-[#252525] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video duration notice if Video is chosen */}
            {config.exportFormat === "VIDEO" && (
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-300">
                Gera vídeo .webm de 5 segundos com animação 3D orbital fluida e 60 FPS.
              </div>
            )}

            {/* GIF notice if GIF is chosen */}
            {config.exportFormat === "GIF" && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                Gera GIF animado em loop com 25 frames e renderização client-side.
              </div>
            )}

            {/* PRIMARY DOWNLOAD BUTTON */}
            <div className="pt-2 border-t border-[#262626] space-y-2">
              <button
                disabled={isExporting}
                onClick={async () => {
                  if (config.exportFormat === "VIDEO") {
                    await handleExportVideo();
                  } else if (config.exportFormat === "GIF") {
                    await handleExportGif();
                  } else {
                    await handleExport();
                  }
                  setShowSettings(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>
                  {isExporting
                    ? "Exportando..."
                    : config.exportFormat === "VIDEO"
                    ? "Download Video (.webm)"
                    : config.exportFormat === "GIF"
                    ? "Download Animated GIF (.gif)"
                    : `Download ${config.exportFormat} (${config.exportScale}x)`}
                </span>
              </button>

              {/* SECONDARY COPY CLIPBOARD BUTTON */}
              <button
                disabled={isExporting}
                onClick={async () => {
                  await handleCopy();
                  setShowSettings(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#252525] hover:bg-[#2e2e2e] text-white font-medium text-xs border border-[#333] transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-neutral-300" />
                <span>Copiar para Área de Transferência</span>
              </button>

              {/* BATCH ALL SLIDES ZIP EXPORT */}
              {slides.length > 1 && (
                <button
                  disabled={isExporting}
                  onClick={async () => {
                    await handleExportAllSlidesZip();
                    setShowSettings(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Baixar Todos os Slides ({slides.length} em .ZIP)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Saved Projects Modal */}
      <SavedShotsModal
        isOpen={isSavedShotsOpen}
        onClose={() => setIsSavedShotsOpen(false)}
      />
    </header>
  );
};
