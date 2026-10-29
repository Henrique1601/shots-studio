"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { DeviceFrameProps } from "./DeviceFrameProps";

export const PixelFrame: React.FC<DeviceFrameProps & { pixelColors: { border: string; shadow: string; button: string } }> = ({
  config,
  imageUrl,
  onSlotClick,
  isSecondary = false,
  filterStyle,
  pixelColors,
}) => {
  return (
    <>
      {/* Opaque Chassis Body */}
      <div
        className="absolute inset-0 rounded-[48px] bg-[#0c0d0f] pointer-events-none z-5 shadow-2xl"
        style={{ background: "#0c0d0f" }}
      />

      {/* Screen Container */}
      <div
        style={{
          position: "absolute",
          left: "2.8%",
          top: "1.3%",
          width: "94.4%",
          height: "97.4%",
          borderRadius: "36px",
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

        {/* Punch-Hole Camera */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-neutral-800 z-30 pointer-events-none shadow-sm flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a1224] ring-1 ring-white/10 flex items-center justify-center shadow-inner">
            <div className="w-1 h-1 rounded-full bg-white/40 -translate-x-[0.5px] -translate-y-[0.5px]" />
          </div>
        </div>
      </div>

      {/* Titanium Bezel Band & Buttons */}
      <div
        className="absolute inset-0 rounded-[48px] pointer-events-none z-20 border-[9px] shadow-sm transition-all duration-300"
        style={{
          borderColor: pixelColors.border,
          boxShadow: pixelColors.shadow,
        }}
      />
      <div className="absolute top-[1.2%] left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full bg-[#18191c] border-b border-white/10 z-25 pointer-events-none" />
      <div
        className="absolute -right-[3px] top-[18%] w-[3px] h-[30px] rounded-r-sm pointer-events-none z-20 shadow-sm"
        style={{ background: pixelColors.button }}
      />
      <div
        className="absolute -right-[3px] top-[26%] w-[3px] h-[58px] rounded-r-sm pointer-events-none z-20 shadow-sm"
        style={{ background: pixelColors.button }}
      />
    </>
  );
};
