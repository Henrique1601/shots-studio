"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { DeviceFrameProps } from "./DeviceFrameProps";

export const FoldableFrame: React.FC<DeviceFrameProps> = ({
  config,
  imageUrl,
  onSlotClick,
  isSecondary = false,
  filterStyle,
}) => {
  return (
    <>
      {/* Opaque Chassis */}
      <div
        className="absolute inset-0 rounded-[28px] bg-[#090a0d] pointer-events-none z-5 shadow-2xl"
        style={{ background: "#090a0d" }}
      />

      {/* Screen Container */}
      <div
        style={{
          position: "absolute",
          left: "2.2%",
          top: "1.8%",
          width: "95.6%",
          height: "96.4%",
          borderRadius: "20px",
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

        {/* Center Crease subtle shadow */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 pointer-events-none z-15 bg-gradient-to-r from-transparent via-black/30 to-transparent" />

        {/* Punch-hole camera on right panel */}
        <div className="absolute top-3 right-[22%] w-3 h-3 rounded-full bg-black border border-neutral-800 z-30 pointer-events-none shadow-sm flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0a1224]" />
        </div>
      </div>

      {/* Chassis Border & Spine Notches */}
      <div className="absolute inset-0 rounded-[28px] pointer-events-none z-20 border-[7px] border-[#22242a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-b-sm bg-neutral-600 z-25 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-t-sm bg-neutral-600 z-25 pointer-events-none" />
    </>
  );
};
