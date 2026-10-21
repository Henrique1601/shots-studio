"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMockupStore } from "@/store/mockupStore";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJIS = [
  { id: "angry", emoji: "🤬", label: "Angry" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "smirk", emoji: "😏", label: "Smirking" },
  { id: "cool", emoji: "😎", label: "Cool" },
  { id: "love", emoji: "😍", label: "Love" },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useMockupStore();
  const [selectedEmoji, setSelectedEmoji] = useState<string>("cool");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackText("");
      showToast("Obrigado pelo seu feedback! Ele foi enviado com sucesso. 💬", "success");
      onClose();
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window matching media_1792581653995_64e8b20f.png */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-[340px] bg-[#1c1c1c] border border-white/10 rounded-3xl p-5 text-white shadow-2xl z-10 select-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Send feedback,
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                We read them all!
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Emoji Rating Row */}
          <div className="flex items-center justify-between px-1 mb-5">
            {EMOJIS.map((item) => {
              const isSelected = selectedEmoji === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedEmoji(item.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/20 scale-115 ring-2 ring-white/40 shadow-lg"
                      : "hover:bg-white/10 opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                  title={item.label}
                >
                  {item.emoji}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                How can we improve your experience?
              </label>
              <textarea
                rows={5}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full rounded-2xl bg-[#262626] border border-white/5 p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30 resize-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!feedbackText.trim() || isSubmitting}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                feedbackText.trim() && !isSubmitting
                  ? "bg-neutral-300 hover:bg-white text-black shadow-md active:scale-98"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
