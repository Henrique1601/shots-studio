"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clapperboard,
  Repeat,
  Compass,
  Activity,
  Layers,
  ChevronDown,
  ChevronsLeftRight,
} from "lucide-react";
import { useMockupStore } from "@/store/mockupStore";
import { AnimationPreset } from "@/types/mockup";
import { motion, AnimatePresence } from "framer-motion";

export const VideoTimeline = () => {
  const { config, updateConfig, showToast } = useMockupStore();
  const [elapsed, setElapsed] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const duration = config.animationDuration || 5;
  const isTimelineOpen = !!config.isTimelineOpen;

  const animationPresets: {
    id: AnimationPreset;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "none", label: "Static", icon: Layers },
    { id: "float", label: "Float", icon: Sparkles },
    { id: "turntable", label: "Spin 3D", icon: Compass },
    { id: "pulse", label: "Breathe", icon: Activity },
    { id: "orbit", label: "Orbit", icon: Clapperboard },
  ];

  // Animation Loop Timer when playing
  useEffect(() => {
    if (!config.isAnimationPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setElapsed((prev) => {
        const next = prev + delta;
        if (next >= duration) {
          if (isLooping) {
            return next % duration;
          } else {
            updateConfig({ isAnimationPlaying: false });
            return 0;
          }
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [config.isAnimationPlaying, duration, isLooping, updateConfig]);

  const togglePlay = () => {
    if (!config.isAnimationPlaying) {
      if (config.animationPreset === "none") {
        updateConfig({
          animationPreset: "float",
          isAnimationPlaying: true,
        });
        showToast("Animação Flutuante 3D ativada ✨", "info");
      } else {
        updateConfig({ isAnimationPlaying: true });
      }
    } else {
      updateConfig({ isAnimationPlaying: false });
    }
  };

  const handleReset = () => {
    setElapsed(0);
    lastTimeRef.current = null;
    showToast("Timeline reiniciada (0:00) ⏱️", "info");
  };

  const selectPreset = (preset: AnimationPreset) => {
    updateConfig({
      animationPreset: preset,
      isAnimationPlaying: preset !== "none",
    });
    if (preset !== "none") {
      showToast(`Preset de animação: ${preset.toUpperCase()} ativado 🎬`);
    }
  };

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs % 1) * 10);
    return `0:0${s}.${ms}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (elapsed / duration) * 100));

  return (
    <div className="hidden lg:block relative z-40 select-none">
      <AnimatePresence mode="wait">
        {!isTimelineOpen ? (
          /* Floating Compact "Animate" Pill (media_1792581935252_6819bb16.png) */
          <motion.div
            key="animate-pill"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40"
          >
            <button
              onClick={() => {
                updateConfig({ isTimelineOpen: true });
                if (config.animationPreset === "none") {
                  updateConfig({ animationPreset: "float" });
                }
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1c1c1c]/90 hover:bg-[#252525] border border-white/15 text-white text-xs font-semibold backdrop-blur-xl shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            >
              <ChevronsLeftRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span>Animate</span>
              {config.isAnimationPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              )}
            </button>
          </motion.div>
        ) : (
          /* Expanded Full Video Timeline Bar */
          <motion.footer
            key="expanded-timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 inset-x-0 h-14 border-t border-[#262626] bg-[#121212]/95 backdrop-blur-xl px-4 flex items-center justify-between z-40 text-white shrink-0 shadow-2xl"
          >
            {/* 1. Left: Presets de Movimento */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-1">
                Motion:
              </span>
              <div className="flex items-center space-x-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
                {animationPresets.map((p) => {
                  const Icon = p.icon;
                  const isActive = config.animationPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPreset(p.id)}
                      aria-label={`Select ${p.label} animation preset`}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#2c2c2c] text-white shadow-sm border border-white/10"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isActive ? "text-pink-400" : ""}`} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Center: Play/Pause, Scrubber & Timer */}
            <div className="flex items-center space-x-3 w-[360px]">
              {/* Play / Pause Pill */}
              <button
                onClick={togglePlay}
                aria-label={config.isAnimationPlaying ? "Pause animation" : "Play animation"}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                {config.isAnimationPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{config.isAnimationPlaying ? "Pause" : "Play"}</span>
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                title="Reset to 0:00"
                aria-label="Reset timeline playhead"
                className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Dynamic Progress Scrubber */}
              <div className="flex-1 flex flex-col justify-center space-y-1">
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                    setElapsed(ratio * duration);
                  }}
                  className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden relative cursor-pointer group"
                >
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full transition-all duration-75 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                  <span>{formatTime(elapsed)}</span>
                  <span>0:0{duration}.0</span>
                </div>
              </div>
            </div>

            {/* 3. Right: Duration, Loop and Collapse Button */}
            <div className="flex items-center space-x-2">
              {/* Loop toggle */}
              <button
                onClick={() => {
                  setIsLooping(!isLooping);
                  showToast(isLooping ? "Loop desativado" : "Loop contínuo ativado 🔁", "info");
                }}
                title={isLooping ? "Loop enabled" : "Loop disabled"}
                aria-label="Toggle animation loop"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isLooping
                    ? "bg-[#252525] border-white/20 text-indigo-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

              {/* Duration selector */}
              <div className="flex items-center space-x-1 bg-[#1a1a1a] p-0.5 rounded-xl border border-white/5 text-[10px]">
                {([3, 5, 10] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      updateConfig({ animationDuration: d });
                      showToast(`Duração ajustada para ${d}s ⏱️`, "info");
                    }}
                    aria-label={`Set animation duration to ${d} seconds`}
                    className={`px-2 py-0.5 rounded-md font-mono transition-colors cursor-pointer ${
                      duration === d
                        ? "bg-[#2f2f2f] text-white font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>

              {/* Collapse Button */}
              <button
                onClick={() => updateConfig({ isTimelineOpen: false })}
                title="Recolher Timeline"
                aria-label="Collapse animation timeline"
                className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};
