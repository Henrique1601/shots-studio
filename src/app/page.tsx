"use client";

import React, { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { MockupCanvas } from "@/components/MockupCanvas";
import { DeviceModal } from "@/components/DeviceModal";
import { TemplatesModal } from "@/components/TemplatesModal";
import { VideoTimeline } from "@/components/VideoTimeline";
import { CarouselBar } from "@/components/CarouselBar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { ToastContainer } from "@/components/ToastContainer";
import { KeyboardShortcutsModal } from "@/components/common/KeyboardShortcutsModal";
import { useMockupStore } from "@/store/mockupStore";
import { useExportStudio } from "@/hooks/useExportStudio";

export default function Home() {
  const {
    setImageUrl,
    setImageDimensions,
    updateConfig,
    undo,
    redo,
    showToast,
    isDeviceModalOpen,
    isTemplatesModalOpen,
    setDeviceModalOpen,
    setTemplatesModalOpen,
  } = useMockupStore();

  const { handleExport, handleCopy } = useExportStudio();

  // Global Keyboard Shortcuts Engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // 1. D: Toggle Devices Modal
      if (e.key.toLowerCase() === "d" && !modKey && !e.altKey) {
        e.preventDefault();
        setDeviceModalOpen(!isDeviceModalOpen);
        return;
      }

      // 2. T: Toggle Templates Modal
      if (e.key.toLowerCase() === "t" && !modKey && !e.altKey) {
        e.preventDefault();
        setTemplatesModalOpen(!isTemplatesModalOpen);
        return;
      }

      // 3. Tab switching with keys '1' and '2'
      if (e.key === "1" && !modKey && !e.altKey) {
        e.preventDefault();
        updateConfig({ activeTab: "mockup" });
        showToast("Aba: Mockup", "info");
        return;
      }
      if (e.key === "2" && !modKey && !e.altKey) {
        e.preventDefault();
        updateConfig({ activeTab: "frame" });
        showToast("Aba: Frame", "info");
        return;
      }

      // 4. Ctrl + C: Copy to Clipboard
      if (modKey && e.key.toLowerCase() === "c" && !e.shiftKey) {
        // If text is highlighted, let native copy work
        if (window.getSelection()?.toString().length) return;
        e.preventDefault();
        handleCopy();
        return;
      }

      // 5. Ctrl + E: Trigger Quick Export
      if (modKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        handleExport();
        return;
      }

      // 6. Ctrl + Z: Undo
      if (modKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        showToast("Desfazer (Undo) ↩️", "info");
        return;
      }

      // 7. Ctrl + Y or Ctrl + Shift + Z: Redo
      if (
        (modKey && e.key.toLowerCase() === "y") ||
        (modKey && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
        showToast("Refazer (Redo) ↪️", "info");
        return;
      }

      // 8. Delete / Backspace: Clear media
      if (e.key === "Delete" || e.key === "Backspace") {
        setImageUrl(null);
        setImageDimensions(null);
        showToast("Imagem removida do mockup", "info");
        return;
      }

      // 9. Escape: Close open modals
      if (e.key === "Escape") {
        setDeviceModalOpen(false);
        setTemplatesModalOpen(false);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault();
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
              setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
              setImageUrl(url);
              showToast("Imagem colada da área de transferência! 📋", "success");
            };
            img.src = url;
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste);
    };
  }, [
    setImageUrl,
    setImageDimensions,
    updateConfig,
    undo,
    redo,
    showToast,
    isDeviceModalOpen,
    isTemplatesModalOpen,
    setDeviceModalOpen,
    setTemplatesModalOpen,
    handleCopy,
    handleExport,
  ]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0d0d0d] text-white flex flex-col font-sans select-none">
      {/* Top Navigation */}
      <TopBar />

      {/* Main Workspace with Dual Sidebars */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Edições do Mockup / Estilos / Bordas / Sombras */}
        <LeftSidebar />

        {/* Center: Canvas de Visualização 3D com Watermark Shots.so */}
        <MockupCanvas />

        {/* Right: Layouts, Presets 3D, Zoom, Tilt e Exportação */}
        <RightSidebar />
      </div>

      {/* Bottom: Timeline de Animação e Vídeo */}
      <VideoTimeline />

      {/* Multi-Slide Carousel Bar */}
      <CarouselBar />

      {/* Mobile Bottom Dock & Controls Drawer */}
      <MobileDrawer />

      {/* Modal para Escolha de Dispositivos (iPhone 17, Mac, Browser) */}
      <DeviceModal />

      {/* Modal da Galeria de Templates Curados */}
      <TemplatesModal />

      {/* Global Keyboard Shortcuts Modal (?) */}
      <KeyboardShortcutsModal />

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
}
