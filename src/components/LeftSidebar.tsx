"use client";

import React, { useRef, useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { MockupTab } from "./sidebar/MockupTab";
import { FrameTab } from "./sidebar/FrameTab";
import { MiniSidebars, type MiniSidebarType } from "./sidebar/MiniSidebars";
import type { GeneratedGradient } from "@/utils/magicPalette";

export const LeftSidebar: React.FC = () => {
  const { config, updateConfig } = useMockupStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [magicGradients, setMagicGradients] = useState<GeneratedGradient[]>([]);
  const [activeMiniSidebar, setActiveMiniSidebar] = useState<MiniSidebarType>("none");

  const switchTab = (tab: "mockup" | "frame") => {
    updateConfig({ activeTab: tab });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: tab === "mockup" ? 0 : 228,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hidden lg:flex relative h-[calc(100vh-6.5rem)] my-auto ml-3 select-none z-30 shrink-0">
      <aside className="w-[228px] shrink-0 bg-[#1c1c1c] rounded-2xl flex flex-col h-full text-white overflow-hidden shadow-2xl border border-white/5 relative z-20">
        {/* Top Tabs: Mockup vs Frame with active indicator pill */}
        <div className="p-2 border-b border-[#262626] shrink-0">
          <div className="flex bg-[#141414] p-0.5 rounded-xl relative">
            <button
              onClick={() => switchTab("mockup")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                config.activeTab === "mockup"
                  ? "bg-[#282828] text-white shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Mockup
            </button>
            <button
              onClick={() => switchTab("frame")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                config.activeTab === "frame"
                  ? "bg-[#282828] text-white shadow-xs"
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
          {/* PÁGINA 1: MOCKUP CONTROLS */}
          <MockupTab
            onExtractPalette={(grads) => setMagicGradients(grads)}
            magicGradients={magicGradients}
          />

          {/* PÁGINA 2: FRAME CONTROLS */}
          <FrameTab
            activeMiniSidebar={activeMiniSidebar}
            setActiveMiniSidebar={setActiveMiniSidebar}
            magicGradients={magicGradients}
            setMagicGradients={setMagicGradients}
          />
        </div>
      </aside>

      {/* FLOATING MINI-SIDEBARS */}
      <MiniSidebars
        activeMiniSidebar={activeMiniSidebar}
        setActiveMiniSidebar={setActiveMiniSidebar}
      />
    </div>
  );
};
