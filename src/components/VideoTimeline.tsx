"use client";

import React, { useState } from "react";
import { Play, Pause, RotateCcw, Plus, Sparkles, Volume2 } from "lucide-react";

export const VideoTimeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime] = useState("0:10");

  return (
    <footer className="h-14 border-t border-[#262626] bg-[#121212] px-4 flex items-center justify-between z-30 select-none text-white">
      {/* Left Action: Add Animation */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2b2b2b] text-xs font-semibold text-neutral-200 transition-colors">
          <Plus className="w-3.5 h-3.5 text-neutral-400" />
          <span>Add Animation</span>
        </button>
      </div>

      {/* Center: Play/Pause and Timeline */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-sm active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span className="font-mono text-[11px]">
            {currentTime}/{totalTime}
          </span>
        </button>
      </div>

      {/* Right controls: Zoom / Sound */}
      <div className="flex items-center space-x-2 text-neutral-400">
        <button className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
