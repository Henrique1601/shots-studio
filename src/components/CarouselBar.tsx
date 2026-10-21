"use client";

import React from "react";
import { useMockupStore } from "@/store/mockupStore";
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CarouselBar = () => {
  const {
    slides,
    activeSlideIndex,
    isCarouselOpen,
    setCarouselOpen,
    addSlide,
    duplicateSlide,
    removeSlide,
    setActiveSlideIndex,
  } = useMockupStore();

  if (!isCarouselOpen) {
    return (
      <button
        onClick={() => setCarouselOpen(true)}
        className="fixed bottom-5 left-5 z-40 px-3.5 py-2 rounded-full bg-[#18181b]/90 backdrop-blur-md border border-white/10 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all shadow-xl flex items-center space-x-2 cursor-pointer group"
      >
        <Layers className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
        <span>Carousel ({slides.length})</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94vw] bg-[#141416]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl flex flex-col space-y-2 select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Top Header of Carousel Bar */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center space-x-2 text-neutral-300 font-medium">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Carousel Slides ({slides.length})</span>
          <span className="text-[10px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">
            Active: #{activeSlideIndex + 1}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Prev / Next */}
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
            <button
              disabled={activeSlideIndex === 0}
              onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-neutral-400 px-1">
              {activeSlideIndex + 1}/{slides.length}
            </span>
            <button
              disabled={activeSlideIndex === slides.length - 1}
              onClick={() =>
                setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))
              }
              className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setCarouselOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Minimize Carousel Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Scroll Track */}
      <div className="flex items-center space-x-2.5 overflow-x-auto py-1 px-1 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {slides.map((slide, index) => {
            const isActive = index === activeSlideIndex;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.85, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className={`relative group shrink-0 rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                  isActive
                    ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.35)] ring-1 ring-blue-500/50 bg-[#1e1e24]"
                    : "border-white/10 hover:border-white/25 bg-[#18181c]"
                }`}
                style={{ width: 110, height: 75 }}
                onClick={() => setActiveSlideIndex(index)}
              >
                {/* Thumbnail Preview Area */}
                <div
                  className="w-full flex-1 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: slide.config?.backgroundValue || "#111",
                  }}
                >
                  {slide.imageUrl ? (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-3/4 h-3/4 object-contain rounded drop-shadow"
                    />
                  ) : (
                    <div className="w-10 h-7 rounded border border-white/20 bg-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-white/50">
                        {slide.config?.frameType.slice(0, 4)}
                      </span>
                    </div>
                  )}

                  {/* Slide Number Badge */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono font-semibold text-white">
                    #{index + 1}
                  </div>
                </div>

                {/* Thumbnail Action Overlay */}
                <div className="h-5 px-1.5 bg-[#121214] flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="truncate max-w-[55px] font-medium text-neutral-300">
                    {slide.title}
                  </span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(index);
                      }}
                      className="hover:text-blue-400 cursor-pointer"
                      title="Duplicate Slide"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                    {slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSlide(index);
                        }}
                        className="hover:text-red-400 cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add New Slide Button */}
        <button
          onClick={addSlide}
          className="shrink-0 rounded-xl border border-dashed border-white/15 hover:border-blue-400/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center space-y-1 text-neutral-400 hover:text-white cursor-pointer"
          style={{ width: 85, height: 75 }}
          title="Add New Slide"
        >
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium">Add</span>
        </button>
      </div>
    </div>
  );
};
