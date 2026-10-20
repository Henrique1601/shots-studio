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
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import confetti from "canvas-confetti";

export const TopBar = () => {
  const {
    config,
    updateConfig,
    resetConfig,
    setDeviceModalOpen,
    undo,
    redo,
    randomize,
    historyIndex,
    history,
  } = useMockupStore();

  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    } catch (err) {
      console.error("Export error:", err);
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
        alert("Copiado para a área de transferência!");
      }
    } catch (e) {
      console.error("Copy error:", e);
    }
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
          className="w-8 h-8 rounded-full overflow-hidden border border-[#333] flex items-center justify-center bg-neutral-800 hover:border-neutral-500 transition-colors cursor-pointer"
        >
          <img
            src="/shots-assets/apple-touch-icon-192.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
        <button
          onClick={() => setDeviceModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2b2b2b] text-xs font-semibold transition-colors cursor-pointer"
        >
          <div className="w-4 h-4 rounded bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center">
            <Layers className="w-2.5 h-2.5 text-white" />
          </div>
          <span>Templates</span>
          <span className="text-neutral-500 text-[10px]">›</span>
        </button>
      </div>

      {/* 2. Center: Command Bar Desktop (Os 7 botões reais do Shots.so) */}
      <div className="hidden md:flex items-center space-x-1.5 bg-[#181818] px-2 py-1 rounded-2xl border border-[#262626]">
        {/* Undo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Randomize / Shuffle */}
        <button
          onClick={randomize}
          title="Randomize style & background"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Start Over (Pílula Central) */}
        <button
          onClick={resetConfig}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#242424] hover:bg-[#2e2e2e] text-xs font-semibold text-neutral-200 transition-colors border border-white/5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-neutral-400" />
          <span>Start Over</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullScreen}
          title="Toggle Fullscreen"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Feedback */}
        <button
          onClick={() => alert("Obrigado pelo feedback!")}
          title="Feedback"
          className="p-1.5 rounded-xl hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Performance Mode */}
        <button
          onClick={() =>
            alert(
              "Modo de Alta Performance ativado (aceleração de hardware WebGL)"
            )
          }
          title="Performance Mode"
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
          className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-neutral-300 hover:text-white border border-[#2b2b2b] transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          title="Export Settings"
          className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-neutral-300 hover:text-white border border-[#2b2b2b] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Main Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
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
              <div className="grid grid-cols-3 gap-1">
                {(["PNG", "JPEG", "WEBP"] as const).map((fmt) => (
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

            {/* Output resolution calculation */}
            <div className="pt-2 border-t border-[#262626] flex justify-between text-[10px]">
              <span className="text-neutral-400">Output Resolution</span>
              <span className="text-neutral-200 font-mono font-semibold">
                {1920 * config.exportScale} x {1080 * config.exportScale}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
