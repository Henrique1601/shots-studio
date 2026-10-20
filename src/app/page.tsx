"use client";

import React, { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { MockupCanvas } from "@/components/MockupCanvas";
import { DeviceModal } from "@/components/DeviceModal";
import { VideoTimeline } from "@/components/VideoTimeline";
import { MobileDrawer } from "@/components/MobileDrawer";
import { ToastContainer } from "@/components/ToastContainer";
import { useMockupStore } from "@/store/mockupStore";

export default function Home() {
  const { setImageUrl, setImageDimensions, undo, redo, showToast, setDeviceModalOpen } = useMockupStore();

  // Global Keyboard Shortcuts (Ctrl+V, Ctrl+Z, Ctrl+Y, Delete, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        showToast("Desfazer (Undo) ↩️", "info");
      } else if (
        (modKey && e.key.toLowerCase() === "y") ||
        (modKey && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
        showToast("Refazer (Redo) ↪️", "info");
      } else if (e.key === "Delete" || e.key === "Backspace") {
        setImageUrl(null);
        setImageDimensions(null);
        showToast("Imagem removida do mockup", "info");
      } else if (e.key === "Escape") {
        setDeviceModalOpen(false);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
              setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
              setImageUrl(url);
              showToast("Imagem colada com sucesso! ✨");
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
  }, [setImageUrl, setImageDimensions, undo, redo, showToast, setDeviceModalOpen]);

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

      {/* Mobile Bottom Dock & Controls Drawer */}
      <MobileDrawer />

      {/* Modal para Escolha de Dispositivos (iPhone 17, Mac, Browser) */}
      <DeviceModal />

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
}
