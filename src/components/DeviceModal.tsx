"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { FrameType } from "@/types/mockup";
import {
  X,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  Grid,
} from "lucide-react";

export const DeviceModal = () => {
  const { isDeviceModalOpen, setDeviceModalOpen, updateConfig } =
    useMockupStore();
  const [filter, setFilter] = useState<string>("all");

  if (!isDeviceModalOpen) return null;

  const devices: {
    id: FrameType;
    category: "essentials" | "iphone" | "mac" | "watch";
    name: string;
    sub: string;
    badge?: string;
    img: string;
  }[] = [
    {
      id: "screenshot",
      category: "essentials",
      name: "Screenshot",
      sub: "Adapts to media",
      img: "/shots-assets/mockups_Screenshot_thumbs_1.png",
    },
    {
      id: "browser",
      category: "essentials",
      name: "Browser",
      sub: "Adapts to media",
      img: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-light.jpg",
    },
    {
      id: "iphone-17",
      category: "iphone",
      name: "iPhone 17",
      sub: "402 / 874",
      badge: "New",
      img: "/shots-assets/apple-touch-icon-512.png",
    },
    {
      id: "iphone-17-air",
      category: "iphone",
      name: "iPhone 17 Air",
      sub: "420 / 912",
      badge: "New",
      img: "/shots-assets/apple-touch-icon-192.png",
    },
    {
      id: "macbook",
      category: "mac",
      name: "MacBook Pro",
      sub: "1512 / 982",
      img: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-dark.jpg",
    },
    {
      id: "watch",
      category: "watch",
      name: "Apple Watch Ultra",
      sub: "410 / 502",
      img: "/shots-assets/preview_cosmic_1.jpg",
    },
  ];

  const handleSelectDevice = (device: FrameType) => {
    updateConfig({ frameType: device });
    setDeviceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none p-4">
      <div className="w-full max-w-xl max-h-[85vh] bg-[#161616] border border-[#2b2b2b] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="p-4 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">Choose Device</span>
          </div>
          <button
            onClick={() => setDeviceModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#222222] flex items-center space-x-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All", icon: Grid },
            { id: "iphone", label: "iPhone", icon: Smartphone },
            { id: "ipad", label: "iPad", icon: Tablet },
            { id: "mac", label: "Mac", icon: Laptop },
            { id: "browser", label: "Display", icon: Monitor },
            { id: "watch", label: "Watch", icon: Watch },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filter === item.id
                    ? "bg-white text-black shadow-sm"
                    : "bg-[#202020] text-neutral-300 hover:text-white hover:bg-[#282828]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid List of Devices */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-200">
                Essentials
              </span>
              <span className="text-[11px] text-neutral-500 hover:text-white cursor-pointer">
                See all
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {devices
                .filter(
                  (d) =>
                    d.category === "essentials" ||
                    (filter !== "all" && d.category === filter)
                )
                .map((device) => (
                  <button
                    key={device.id}
                    onClick={() => handleSelectDevice(device.id)}
                    className="p-3 rounded-2xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#2b2b2b] hover:border-neutral-500 text-left transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {device.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {device.sub}
                        </div>
                      </div>
                      {device.badge && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white text-[9px] font-bold uppercase">
                          {device.badge}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden border border-white/5 flex items-center justify-center p-2 group-hover:scale-102 transition-transform">
                      <img
                        src={device.img}
                        alt={device.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-200">
                iPhone 17 Lineup
              </span>
              <span className="text-[11px] text-neutral-500 hover:text-white cursor-pointer">
                See all
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {devices
                .filter((d) => d.category === "iphone")
                .map((device) => (
                  <button
                    key={device.id}
                    onClick={() => handleSelectDevice(device.id)}
                    className="p-3 rounded-2xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#2b2b2b] hover:border-neutral-500 text-left transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {device.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {device.sub}
                        </div>
                      </div>
                      {device.badge && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-white text-[9px] font-bold uppercase">
                          {device.badge}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden border border-white/5 flex items-center justify-center p-2 group-hover:scale-102 transition-transform">
                      <img
                        src={device.img}
                        alt={device.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
