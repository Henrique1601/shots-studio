"use client";

import React, { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { MockupCanvas } from "@/components/MockupCanvas";
import { DeviceModal } from "@/components/DeviceModal";
import { VideoTimeline } from "@/components/VideoTimeline";
import { useMockupStore } from "@/store/mockupStore";

export default function Home() {
  const { setImageUrl } = useMockupStore();

  // Colar imagens diretamente da área de transferência (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [setImageUrl]);

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

      {/* Modal para Escolha de Dispositivos (iPhone 17, Mac, Browser) */}
      <DeviceModal />
    </div>
  );
}
