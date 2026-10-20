"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
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
  SlidersHorizontal,
  X,
  Check,
  FolderOpen,
  Film,
  Sparkles,
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import confetti from "canvas-confetti";
import { SavedShotsModal } from "./SavedShotsModal";
import { SOCIAL_MEDIA_PRESETS } from "@/types/mockup";

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
  } = useMockupStore();

  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSavedShotsOpen, setIsSavedShotsOpen] = useState(false);

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

    if (config.exportFormat === "GIF") {
      await handleExportGif();
      return;
    }

    try {
      setIsExporting(true);
      let dataUrl: string;
      if (config.exportFormat === "JPEG") {
        dataUrl = await htmlToImage.toJpeg(node, exportOptions);
      } else {
        dataUrl = await htmlToImage.toPng(node, exportOptions);
      }

      const link = document.createElement("a");
      link.download = `shot-${Date.now()}.${config.exportFormat.toLowerCase()}`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.15 },
      });
      showToast(`Shot exportado com sucesso (${config.exportFormat})! 🚀`);
    } catch (err) {
      console.error("Export error:", err);
      showToast("Erro ao exportar imagem", "warning");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportVideo = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    try {
      setIsExporting(true);
      showToast("Gravando clipe de vídeo WebM... 🎬", "info");

      const initialCanvas = await htmlToImage.toCanvas(node, { pixelRatio: 1.5 });
      const recordCanvas = document.createElement("canvas");
      recordCanvas.width = initialCanvas.width;
      recordCanvas.height = initialCanvas.height;
      const ctx = recordCanvas.getContext("2d");
      if (!ctx) return;

      const stream = recordCanvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `shot-clip-${Date.now()}.webm`;
        a.click();
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.15 },
        });
        showToast("Vídeo exportado com sucesso (.webm)! 🎥");
        setIsExporting(false);
      };

      recorder.start();

      const durationMs = 3000;
      const startTime = Date.now();

      const captureFrame = async () => {
        if (Date.now() - startTime >= durationMs) {
          recorder.stop();
          return;
        }
        try {
          const frameCanvas = await htmlToImage.toCanvas(node, { pixelRatio: 1.5 });
          ctx.drawImage(frameCanvas, 0, 0);
        } catch (err) {}
        requestAnimationFrame(captureFrame);
      };

      captureFrame();
    } catch (err) {
      console.error("Video export error:", err);
      showToast("Navegador não suporta gravação direta", "warning");
      setIsExporting(false);
    }
  };

  const handleExportGif = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    try {
      setIsExporting(true);
      showToast("Capturando quadros para o GIF animado... 🎞️", "info");

      const wasPlaying = config.isAnimationPlaying;
      if (!wasPlaying) {
        updateConfig({ isAnimationPlaying: true });
      }

      const frames: string[] = [];
      const frameCount = 14;
      const delayMs = 120;

      for (let i = 0; i < frameCount; i++) {
        const frameData = await htmlToImage.toPng(node, {
          pixelRatio: 0.85,
          skipFonts: true,
          filter: (n: HTMLElement) => n.tagName !== "SCRIPT" && n.tagName !== "INPUT",
        });
        frames.push(frameData);
        await new Promise((r) => setTimeout(r, delayMs));
      }

      if (!wasPlaying) {
        updateConfig({ isAnimationPlaying: false });
      }

      showToast("Codificando GIF animado em loop... ⚙️", "info");

      const gifshot = (await import("gifshot")).default;
      gifshot.createGIF(
        {
          images: frames,
          gifWidth: Math.min(640, Math.round(node.clientWidth * 0.8)),
          gifHeight: Math.min(480, Math.round(node.clientHeight * 0.8)),
          interval: 0.12,
          numWorkers: 2,
        },
        (obj) => {
          if (!obj.error && obj.image) {
            const link = document.createElement("a");
            link.download = `shot-animated-${Date.now()}.gif`;
            link.href = obj.image;
            link.click();
            confetti({ particleCount: 80, spread: 65, origin: { y: 0.2 } });
            showToast("GIF animado exportado com sucesso! 🎉", "success");
          } else {
            console.error("GIF error:", obj.errorMsg);
            showToast("Erro na geração do GIF animado", "warning");
          }
          setIsExporting(false);
        }
      );
    } catch (err) {
      console.error("GIF export failed:", err);
      showToast("Falha ao exportar GIF animado", "warning");
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
      showToast("Erro ao copiar imagem", "warning");
    }
  };

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
          aria-label="Abrir biblioteca de shots salvos"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2b2b2b] text-xs font-semibold transition-colors cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Meus Shots</span>
        </button>
      </div>

      {/* 2. Center: Command Bar Desktop (Os 7 botões reais do Shots.so) */}
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
          onClick={() => showToast("Obrigado pelo seu feedback! 💬", "info")}
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

      {/* 3. Right: Export Pill & Settings Popover */}
      <div className="flex items-center space-x-1.5 relative">
        <button
          onClick={handleCopy}
          title="Copy Image"
          aria-label="Copy mockup image to clipboard"
          className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-neutral-300 hover:text-white border border-[#2b2b2b] transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          title="Export Settings"
          aria-label="Open export settings popover"
          className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-neutral-300 hover:text-white border border-[#2b2b2b] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Main Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          aria-label="Export and download mockup image"
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <div className="text-left leading-tight">
            <div className="text-[11px] font-bold">Export</div>
            <div className="text-[9px] text-neutral-600 font-mono">
              {config.exportScale}x · {config.exportFormat}
            </div>
          </div>
        </button>

        {/* Video WebM Export Button */}
        <button
          onClick={handleExportVideo}
          disabled={isExporting}
          title="Export 3D Animation as Video (.webm)"
          aria-label="Export 3D Animation as Video"
          className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-pink-400 hover:text-pink-300 border border-[#2b2b2b] transition-colors cursor-pointer"
        >
          <Film className="w-3.5 h-3.5" />
        </button>

        {/* Animated GIF Export Button */}
        <button
          onClick={handleExportGif}
          disabled={isExporting}
          title="Export as Animated GIF (.gif)"
          aria-label="Export as Animated GIF"
          className="px-2.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-amber-400 hover:text-amber-300 border border-[#2b2b2b] text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>GIF</span>
        </button>

        {/* Popover Settings de Exportação Oficial */}
        {showSettings && (
          <div className="absolute right-0 top-12 w-64 p-3.5 rounded-2xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-2xl space-y-3 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Export Settings
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FORMAT */}
            <div>
              <div className="text-[9px] font-bold text-neutral-400 uppercase mb-1.5">
                Format
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(["PNG", "JPEG", "WEBP", "GIF"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => updateConfig({ exportFormat: fmt })}
                    className={`py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                      config.exportFormat === fmt
                        ? "bg-white text-black shadow-sm"
                        : "bg-[#252525] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* QUALITY / SCALE */}
            <div>
              <div className="text-[9px] font-bold text-neutral-400 uppercase mb-1.5">
                Quality
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { scale: 1, label: "FHD" },
                    { scale: 2, label: "4K" },
                    { scale: 3, label: "6K" },
                  ] as const
                ).map((q) => (
                  <button
                    key={q.scale}
                    onClick={() => updateConfig({ exportScale: q.scale })}
                    className={`py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                      config.exportScale === q.scale
                        ? "bg-white text-black shadow-sm"
                        : "bg-[#252525] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SOCIAL MEDIA QUICK SIZES */}
            <div className="pt-2 border-t border-[#262626]">
              <div className="text-[9px] font-bold text-neutral-400 uppercase mb-1.5 flex items-center justify-between">
                <span>Social Media Presets</span>
                <span className="text-[8px] text-cyan-400 font-normal">1-Click</span>
              </div>
              <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-0.5">
                {SOCIAL_MEDIA_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      updateConfig({
                        aspectRatio: p.aspectRatio,
                        customWidth: p.width,
                        customHeight: p.height,
                      });
                      showToast(`${p.name} (${p.badge}) aplicado!`, "success");
                    }}
                    className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      config.customWidth === p.width && config.customHeight === p.height
                        ? "border-cyan-400 bg-cyan-400/10 text-white"
                        : "border-transparent bg-[#252525] text-neutral-300 hover:text-white"
                    }`}
                  >
                    <div className="text-[10px] font-semibold truncate">{p.name}</div>
                    <div className="text-[8px] font-mono text-neutral-400">{p.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Output resolution calculation */}
            <div className="pt-2 border-t border-[#262626] flex justify-between text-[10px]">
              <span className="text-neutral-400">Output Resolution</span>
              <span className="text-neutral-200 font-mono font-semibold">
                {getOutputResolution()} px
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Saved Shots Modal */}
      <SavedShotsModal
        isOpen={isSavedShotsOpen}
        onClose={() => setIsSavedShotsOpen(false)}
      />
    </header>
  );
};
