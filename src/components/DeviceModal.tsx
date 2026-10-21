"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { FrameType, DEVICE_SPECS } from "@/types/mockup";
import {
  X,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  Grid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DeviceModal = () => {
  const { isDeviceModalOpen, setDeviceModalOpen, updateConfig } =
    useMockupStore();
  const [filter, setFilter] = useState<string>("all");

  if (!isDeviceModalOpen) return null;

  const deviceList: {
    id: FrameType;
    category: "essentials" | "iphone" | "android" | "mac" | "tablets" | "watch";
    name: string;
    sub: string;
    badge?: string;
    thumb: string;
  }[] = [
    {
      id: "screenshot",
      category: "essentials",
      name: "Screenshot",
      sub: "Adapts to media",
      thumb: "/shots-assets/mockups_Screenshot_thumbs_1.png",
    },
    {
      id: "browser",
      category: "essentials",
      name: "Browser",
      sub: "Adapts to media",
      thumb: "/shots-assets/devices/safari_light.png",
    },
    {
      id: "code",
      category: "essentials",
      name: "Code Snippet",
      sub: "Ray.so / Carbon IDE",
      badge: "New",
      thumb: "/shots-assets/mockups_Screenshot_styles_glass-dark.png",
    },
    {
      id: "minimal-desktop",
      category: "mac",
      name: "Minimal Desktop",
      sub: "16 / 10 Window",
      badge: "New",
      thumb: "/shots-assets/devices/minimaldesktop.png",
    },
    {
      id: "ultrawide-monitor",
      category: "mac",
      name: "Ultrawide 34\"",
      sub: "21 / 9 Studio Monitor",
      badge: "New",
      thumb: "/shots-assets/devices/minimaldesktop.png",
    },
    {
      id: "iphone-17",
      category: "iphone",
      name: "iPhone 17",
      sub: "402 / 874",
      badge: "New",
      thumb: "/shots-assets/devices/iphone17_black.png",
    },
    {
      id: "iphone-16-pro",
      category: "iphone",
      name: "iPhone 16 Pro",
      sub: "402 / 874",
      thumb: "/shots-assets/devices/iphone16pro.png",
    },
    {
      id: "pixel-9-pro",
      category: "android",
      name: "Google Pixel 9 Pro",
      sub: "Flagship Android",
      badge: "New",
      thumb: "/shots-assets/devices/iphone17_black.png",
    },
    {
      id: "macbook",
      category: "mac",
      name: "MacBook Pro 16",
      sub: "3456 / 2234",
      thumb: "/shots-assets/devices/macbookpro16.png",
    },
    {
      id: "ipad-pro",
      category: "tablets",
      name: "iPad Pro 13",
      sub: "2048 / 2732",
      thumb: "/shots-assets/devices/ipadpro13.png",
    },
    {
      id: "watch",
      category: "watch",
      name: "Apple Watch Ultra",
      sub: "410 / 502",
      thumb: "/shots-assets/devices/watchultra.png",
    },
  ];

  const handleSelectDevice = (device: FrameType) => {
    updateConfig({ frameType: device });
    setDeviceModalOpen(false);
  };

  const filteredDevices =
    filter === "all"
      ? deviceList
      : deviceList.filter((d) => d.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm select-none p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-xl max-h-[85vh] bg-[#161616] border border-[#2b2b2b] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-[#242424] flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide">
            Choose Device
          </span>
          <button
            onClick={() => setDeviceModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#222222] flex items-center space-x-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All", icon: Grid },
            { id: "iphone", label: "iPhone", icon: Smartphone },
            { id: "android", label: "Android", icon: Smartphone },
            { id: "tablets", label: "iPad", icon: Tablet },
            { id: "mac", label: "Mac & Desktop", icon: Laptop },
            { id: "watch", label: "Watch", icon: Watch },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  filter === item.id
                    ? "bg-white text-black shadow-sm font-semibold"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredDevices.map((device) => (
              <motion.button
                key={device.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectDevice(device.id)}
                className="p-3.5 rounded-2xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#2b2b2b] hover:border-neutral-500 text-left transition-all flex flex-col justify-between group cursor-pointer"
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
                <div className="w-full h-32 rounded-xl bg-black/40 overflow-hidden border border-white/5 flex items-center justify-center p-2">
                  <img
                    src={device.thumb}
                    alt={device.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
