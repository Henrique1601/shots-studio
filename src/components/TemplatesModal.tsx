"use client";

import React, { useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { CURATED_TEMPLATES, TemplatePreset } from "@/types/mockup";
import { X, Sparkles, Layout, Smartphone, Share2, Layers, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const TemplatesModal = () => {
  const { isTemplatesModalOpen, setTemplatesModalOpen, updateConfig, showToast } =
    useMockupStore();
  const [filter, setFilter] = useState<string>("all");

  if (!isTemplatesModalOpen) return null;

  const filtered =
    filter === "all"
      ? CURATED_TEMPLATES
      : CURATED_TEMPLATES.filter((t) => t.category === filter);

  const handleApplyTemplate = (tpl: TemplatePreset) => {
    updateConfig(tpl.config);
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.2 },
    });
    showToast(`Template "${tpl.name}" aplicado! 🚀`, "success");
    setTemplatesModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-3xl max-h-[88vh] bg-[#161616] border border-[#2b2b2b] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Galeria de Templates
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-medium">
                  8 Presets
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Composições profissionais prontas para aplicar em 1 clique
              </p>
            </div>
          </div>
          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 border-b border-[#222222] flex items-center space-x-1.5 overflow-x-auto bg-[#131313]">
          {[
            { id: "all", label: "Todos", icon: Layout },
            { id: "marketing", label: "Marketing & SaaS", icon: Sparkles },
            { id: "social", label: "Redes Sociais", icon: Share2 },
            { id: "mobile", label: "Mobile Apps", icon: Smartphone },
            { id: "minimal", label: "Minimal Studio", icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
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

        {/* Grid List of Templates */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((tpl) => (
              <motion.button
                key={tpl.id}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleApplyTemplate(tpl)}
                className="p-4 rounded-2xl bg-[#1c1c1c] hover:bg-[#232323] border border-[#2c2c2c] hover:border-neutral-500 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-lg relative overflow-hidden"
              >
                {/* Background visual banner preview */}
                <div
                  style={{ background: tpl.config.backgroundValue }}
                  className="w-full h-24 rounded-xl mb-3 overflow-hidden border border-white/10 relative flex items-center justify-center p-2 shadow-inner"
                >
                  <div className="absolute inset-0 bg-black/15" />
                  {tpl.badge && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-white/10 shadow-sm z-10">
                      {tpl.badge}
                    </span>
                  )}
                  {tpl.config.annotationsEnabled && tpl.config.annotationHeadline && (
                    <div className="relative z-10 text-center px-2">
                      <div className="text-xs font-extrabold text-white drop-shadow truncate max-w-[200px]">
                        {tpl.config.annotationHeadline}
                      </div>
                      <div className="text-[9px] text-white/80 drop-shadow truncate max-w-[200px]">
                        {tpl.config.annotationSubtitle}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between w-full">
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {tpl.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                      {tpl.tagline}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white transition-colors uppercase ml-2 shrink-0">
                    {tpl.config.aspectRatio || "16:9"}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
