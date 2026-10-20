"use client";

import React from "react";
import { useMockupStore } from "@/store/mockupStore";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ToastContainer = () => {
  const { toasts, removeToast } = useMockupStore();

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center space-y-2 max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto flex items-center justify-between space-x-2.5 px-3.5 py-2 rounded-2xl bg-[#1c1c1c]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl select-none"
          >
            <div className="flex items-center space-x-2">
              {toast.type === "warning" ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : toast.type === "info" ? (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-xs font-medium tracking-tight leading-none text-neutral-100">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
