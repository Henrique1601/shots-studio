"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { DeviceFrameProps } from "./DeviceFrameProps";

export const IMacFrame: React.FC<DeviceFrameProps> = ({
  config,
  imageUrl,
  onSlotClick,
  isSecondary = false,
  filterStyle,
}) => {
  return (
    <>
      {/* iMac 24" M4 Desktop Stand */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
        <div className="w-14 h-12 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] border-x border-black/5 shadow-md" />
        <div className="w-44 h-2.5 rounded-sm bg-gradient-to-b from-[#f8fafc] to-[#cbd5e1] border border-white/60 shadow-[0_12px_24px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Opaque Chassis */}
      <div
        className="absolute inset-0 rounded-2xl bg-[#0c0d10] pointer-events-none z-5 shadow-2xl border-[3.5px] border-[#e2e8f0]"
        style={{ background: "#0c0d10" }}
      />

      {/* Screen Container */}
      <div
        style={{
          position: "absolute",
          left: "2.5%",
          top: "3.5%",
          width: "95%",
          height: "71.3%",
          borderRadius: "4px",
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

      {/* iMac 24" Modern Frame & Signature Bottom Chin */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 flex flex-col justify-between">
        <div className="w-full h-5 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-black ring-1 ring-white/20 shadow-sm flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-[#1e293b]" />
          </div>
        </div>
        <div className="h-[25.2%] bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] rounded-b-[12px] border-t border-black/10 flex items-center justify-center shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500/40 shadow-sm" />
        </div>
      </div>
    </>
  );
};
