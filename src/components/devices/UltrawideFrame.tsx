"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { DeviceFrameProps } from "./DeviceFrameProps";

export const UltrawideFrame: React.FC<DeviceFrameProps> = ({
  config,
  imageUrl,
  onSlotClick,
  isSecondary = false,
  filterStyle,
}) => {
  return (
    <>
      {/* Desktop Stand behind monitor */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
        <div className="w-16 h-10 bg-gradient-to-b from-[#25262c] to-[#141518] border-x border-white/10 shadow-lg flex items-center justify-center">
          <div className="w-6 h-3 rounded-full bg-[#0a0a0c] border border-white/10 shadow-inner" />
        </div>
        <div className="w-56 h-3 rounded-md bg-gradient-to-b from-[#2a2b30] via-[#1e1f23] to-[#131416] border border-white/15 shadow-[0_12px_24px_rgba(0,0,0,0.6)] flex items-center justify-center">
          <div className="w-52 h-[1px] bg-white/15" />
        </div>
      </div>

      {/* Opaque Chassis */}
      <div
        className="absolute inset-0 rounded-xl bg-[#0c0d10] pointer-events-none z-5 shadow-2xl"
        style={{ background: "#0c0d10" }}
      />

      {/* Screen Container */}
      <div
        style={{
          position: "absolute",
          left: "0.8%",
          top: "1.8%",
          width: "98.4%",
          height: "92.8%",
          borderRadius: "6px",
        }}
        className="overflow-hidden bg-[#0a0a0a] flex items-center justify-center cursor-pointer z-10"
        onClick={onSlotClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={isSecondary ? "Secondary device media" : "Uploaded media"}
            style={{
              objectFit: config.imageFit || "cover",
              objectPosition: `50% ${config.imagePositionY ?? 50}%`,
              filter: filterStyle,
            }}
            className="w-full h-full block select-none pointer-events-none transition-all duration-150"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-white/20 shadow-md">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xs font-semibold text-white tracking-tight mb-0.5">
              {isSecondary ? "2nd Device Media" : "Drop or Paste"}
            </h3>
            <p className="text-[10px] text-neutral-400">
              {isSecondary ? "Click to upload" : "Images & Videos"}
            </p>
          </div>
        )}
      </div>

      {/* Modern 3-Side Micro-Bezel & Brushed Aluminum Bottom Chin */}
      <div className="absolute inset-0 rounded-xl pointer-events-none z-20 border-[5px] border-[#18191c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-end">
        <div className="h-5 bg-gradient-to-r from-[#17181c] via-[#212328] to-[#17181c] border-t border-white/10 flex items-center justify-between px-5 rounded-b-[7px]">
          <div className="w-4 h-1 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        </div>
      </div>
    </>
  );
};
