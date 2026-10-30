"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { FrameType } from "@/types/mockup";
import {
  X,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Watch,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export const DeviceModal = () => {
  const { isDeviceModalOpen, setDeviceModalOpen, config, updateConfig, showToast } =
    useMockupStore();
  const [filter, setFilter] = useState<string>("all");

  if (!isDeviceModalOpen) return null;

  const handleSelectDevice = (device: FrameType, name: string) => {
    updateConfig({ frameType: device });
    setDeviceModalOpen(false);
    showToast(`Dispositivo selecionado: ${name} 📱`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-2xl max-h-[88vh] bg-[#1a1a1a] border border-[#2e2e2e] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
      >
        {/* Header with Title and Close Button */}
        <div className="p-4 px-5 border-b border-[#262626] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold tracking-tight text-white">
              Choose Device
            </span>
            <span className="text-xs text-neutral-400">
              • Official FrameCraft Collection
            </span>
          </div>
          <button
            onClick={() => setDeviceModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Category Filter Pills (Matching FrameCraft 1:1) */}
        <div className="px-5 py-3 border-b border-[#242424] flex items-center space-x-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-black shadow-md"
                : "bg-[#252525] text-neutral-300 hover:text-white hover:bg-[#2e2e2e]"
            }`}
          >
            All
          </button>

          {[
            { id: "phone", icon: Smartphone, label: "Phones" },
            { id: "tablet", icon: Tablet, label: "Tablets" },
            { id: "laptop", icon: Laptop, label: "Laptops" },
            { id: "desktop", icon: Tv, label: "Monitors" },
            { id: "watch", icon: Watch, label: "Watches" },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black shadow-md"
                    : "bg-[#252525] text-neutral-300 hover:text-white hover:bg-[#2e2e2e]"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Scrollable Device Content with Authentic FrameCraft Section Headers */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* SECTION 1: ESSENTIALS */}
          {(filter === "all" || filter === "desktop") && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Essentials
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#262626] text-[11px] font-medium text-neutral-300 border border-white/5">
                  See all
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Screenshot Card */}
                <button
                  onClick={() => handleSelectDevice("screenshot", "Screenshot")}
                  className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                    config.frameType === "screenshot"
                      ? "border-white/80 ring-1 ring-white/30"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Screenshot
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Adapts to media
                      </div>
                    </div>
                    {config.frameType === "screenshot" && (
                      <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Roadster Preview */}
                  <div className="w-full h-36 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 mb-3 border border-white/5">
                    <img
                      src="/shots-assets/mockups_Screenshot_thumbs_1.png"
                      alt="Screenshot"
                      className="max-h-full max-w-full object-contain drop-shadow-md rounded-md"
                    />
                  </div>

                  {/* Mini Style Pills */}
                  <div className="flex items-center space-x-1.5 pt-1">
                    <div className="w-7 h-5 rounded-sm bg-neutral-800 border border-white/10 overflow-hidden">
                      <img
                        src="/shots-assets/mockups_Screenshot_styles_default.png"
                        alt="Default"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-5 rounded-sm bg-neutral-800 border border-white/10 overflow-hidden">
                      <img
                        src="/shots-assets/mockups_Screenshot_styles_glass-light.png"
                        alt="Glass Light"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-5 rounded-sm bg-neutral-800 border border-white/10 overflow-hidden">
                      <img
                        src="/shots-assets/mockups_Screenshot_styles_outline.png"
                        alt="Outline"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#2d2d2d] text-[10px] text-neutral-400 font-semibold">
                      +9
                    </span>
                  </div>
                </button>

                {/* 2. Browser Card */}
                <button
                  onClick={() => handleSelectDevice("browser", "Browser")}
                  className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                    config.frameType === "browser"
                      ? "border-white/80 ring-1 ring-white/30"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Browser
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Adapts to media
                      </div>
                    </div>
                    {config.frameType === "browser" && (
                      <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Browser Preview */}
                  <div className="w-full h-36 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 mb-3 border border-white/5">
                    <div className="w-full h-full rounded-md bg-[#1f2023] border border-white/10 flex flex-col overflow-hidden shadow-md">
                      <div className="h-4 bg-[#2b2c31] px-2 flex items-center space-x-1 border-b border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1 bg-white/90 p-2 flex items-center justify-center">
                        <span className="text-[10px] text-neutral-800 font-mono">
                          Safari Light
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Style Pills */}
                  <div className="flex items-center space-x-1.5 pt-1">
                    <div className="w-7 h-5 rounded-sm bg-neutral-800 border border-white/10 overflow-hidden">
                      <img
                        src="/shots-assets/devices/safari_light.png"
                        alt="Safari Light"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-5 rounded-sm bg-neutral-800 border border-white/10 overflow-hidden">
                      <img
                        src="/shots-assets/mockups_Screenshot_styles_glass-dark.png"
                        alt="Dark"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-7 h-5 rounded-sm bg-neutral-800 border border-white/10 overflow-hidden">
                      <img
                        src="/shots-assets/mockups_Screenshot_styles_liquid-glass.png"
                        alt="Glass"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#2d2d2d] text-[10px] text-neutral-400 font-semibold">
                      +3
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: IPHONE 17 LINEUP */}
          {(filter === "all" || filter === "phone") && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  iPhone 17 Lineup
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#262626] text-[11px] font-medium text-neutral-300 border border-white/5">
                  See all
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. iPhone 17 */}
                <button
                  onClick={() => handleSelectDevice("iphone-17", "iPhone 17")}
                  className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                    config.frameType === "iphone-17"
                      ? "border-white/80 ring-1 ring-white/30"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        iPhone 17
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        402 / 874
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white text-black text-[10px] font-bold">
                      New
                    </span>
                  </div>

                  <div className="w-full h-44 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5 relative">
                    <img
                      src="/shots-assets/devices/iphone17_black.png"
                      alt="iPhone 17"
                      className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </button>

                {/* 2. iPhone 17 Air */}
                <button
                  onClick={() => handleSelectDevice("iphone-17-air", "iPhone 17 Air")}
                  className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                    config.frameType === "iphone-17-air"
                      ? "border-white/80 ring-1 ring-white/30"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        iPhone 17 Air
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        420 / 912
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white text-black text-[10px] font-bold">
                      New
                    </span>
                  </div>

                  <div className="w-full h-44 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5 relative">
                    <img
                      src="/shots-assets/devices/iphone17_black.png"
                      alt="iPhone 17 Air"
                      className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-200 scale-95"
                    />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: MORE DEVICES & COMPUTERS */}
          {(filter === "all" || filter === "phone" || filter === "tablet" || filter === "laptop" || filter === "desktop" || filter === "watch") && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Flagships & Workstations
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#262626] text-[11px] font-medium text-neutral-300 border border-white/5">
                  All Devices
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* iPhone 16 Pro */}
                {(filter === "all" || filter === "phone") && (
                  <button
                    onClick={() => handleSelectDevice("iphone-16-pro", "iPhone 16 Pro")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "iphone-16-pro"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">iPhone 16 Pro</div>
                        <div className="text-[10px] text-neutral-400">402 / 874</div>
                      </div>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/iphone16pro.png"
                        alt="iPhone 16 Pro"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* Google Pixel 9 Pro */}
                {(filter === "all" || filter === "phone") && (
                  <button
                    onClick={() => handleSelectDevice("pixel-9-pro", "Google Pixel 9 Pro")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "pixel-9-pro"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">Google Pixel 9 Pro</div>
                        <div className="text-[10px] text-neutral-400">Flagship Android</div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white text-[9px] font-bold">New</span>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/iphone17_black.png"
                        alt="Pixel 9 Pro"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* MacBook Pro 16 */}
                {(filter === "all" || filter === "laptop") && (
                  <button
                    onClick={() => handleSelectDevice("macbook", "MacBook Pro 16")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "macbook"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">MacBook Pro 16</div>
                        <div className="text-[10px] text-neutral-400">3456 / 2234</div>
                      </div>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/macbookpro16.png"
                        alt="MacBook Pro"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* iPad Pro 13 */}
                {(filter === "all" || filter === "tablet") && (
                  <button
                    onClick={() => handleSelectDevice("ipad-pro", "iPad Pro 13")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "ipad-pro"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">iPad Pro 13</div>
                        <div className="text-[10px] text-neutral-400">2048 / 2732</div>
                      </div>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/ipadpro13.png"
                        alt="iPad Pro"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* iMac 24" M4 */}
                {(filter === "all" || filter === "desktop") && (
                  <button
                    onClick={() => handleSelectDevice("imac-24", "iMac 24\" M4")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "imac-24"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">iMac 24&quot; M4</div>
                        <div className="text-[10px] text-neutral-400">4.5K Retina Display</div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white text-[9px] font-bold">M4</span>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/minimaldesktop.png"
                        alt="iMac 24"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* Apple Watch Ultra */}
                {(filter === "all" || filter === "watch") && (
                  <button
                    onClick={() => handleSelectDevice("watch", "Apple Watch Ultra")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "watch"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">Apple Watch Ultra</div>
                        <div className="text-[10px] text-neutral-400">410 / 502</div>
                      </div>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/watchultra.png"
                        alt="Apple Watch"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* Ultrawide 34" */}
                {(filter === "all" || filter === "desktop") && (
                  <button
                    onClick={() => handleSelectDevice("ultrawide-monitor", "Ultrawide 34\"")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "ultrawide-monitor"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">Ultrawide 34&quot;</div>
                        <div className="text-[10px] text-neutral-400">21 / 9 Studio Monitor</div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white text-[9px] font-bold">New</span>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/devices/minimaldesktop.png"
                        alt="Ultrawide Monitor"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}

                {/* Code Snippet Studio */}
                {(filter === "all" || filter === "desktop") && (
                  <button
                    onClick={() => handleSelectDevice("code", "Code Snippet")}
                    className={`p-4 rounded-2xl bg-[#222222] hover:bg-[#272727] border text-left transition-all flex flex-col justify-between group cursor-pointer relative ${
                      config.frameType === "code"
                        ? "border-white/80 ring-1 ring-white/30"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">Code Snippet</div>
                        <div className="text-[10px] text-neutral-400">Ray.so / Carbon IDE</div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white text-[9px] font-bold">New</span>
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                      <img
                        src="/shots-assets/mockups_Screenshot_styles_glass-dark.png"
                        alt="Code Snippet"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
