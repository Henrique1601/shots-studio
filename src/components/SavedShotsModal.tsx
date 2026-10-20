"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, FolderOpen, Save, Clock, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, SavedShot } from "@/lib/db";
import { useMockupStore } from "@/store/mockupStore";

interface SavedShotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedShotsModal: React.FC<SavedShotsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { config, imageUrl, imageDimensions, updateConfig, setImageUrl, setImageDimensions, showToast } =
    useMockupStore();
  const [shots, setShots] = useState<SavedShot[]>([]);
  const [shotName, setShotName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchShots = async () => {
    try {
      const allShots = await db.shots.orderBy("createdAt").reverse().toArray();
      setShots(allShots);
    } catch (e) {
      console.error("Failed to load saved shots:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchShots();
      setShotName(`Shot #${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    }
  }, [isOpen]);

  const handleSaveCurrent = async () => {
    if (!shotName.trim()) return;
    try {
      setLoading(true);
      await db.shots.add({
        name: shotName.trim(),
        createdAt: Date.now(),
        config: { ...config },
        imageUrl,
        imageDimensions,
      });
      showToast(`Projeto "${shotName}" salvo com sucesso! 💾`);
      setShotName("");
      await fetchShots();
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar projeto no banco local", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadShot = (shot: SavedShot) => {
    updateConfig(shot.config);
    setImageUrl(shot.imageUrl);
    setImageDimensions(shot.imageDimensions);
    showToast(`Projeto "${shot.name}" restaurado! 📂`);
    onClose();
  };

  const handleDeleteShot = async (id?: number) => {
    if (!id) return;
    try {
      await db.shots.delete(id);
      showToast("Projeto removido da biblioteca", "info");
      await fetchShots();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#161616] border border-[#2c2c2c] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Meus Shots Salvos</h2>
              <p className="text-[11px] text-neutral-400">
                Biblioteca local persistida (IndexedDB)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close saved shots modal"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Save Current Bar */}
        <div className="p-4 border-b border-[#222] bg-[#1a1a1a] flex items-center space-x-2">
          <input
            type="text"
            value={shotName}
            onChange={(e) => setShotName(e.target.value)}
            placeholder="Nome do novo shot..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-[#121212] border border-[#333] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSaveCurrent}
            disabled={loading || !shotName.trim()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Shot Atual</span>
          </button>
        </div>

        {/* Shots List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {shots.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Nenhum projeto salvo na biblioteca local.</p>
              <p className="text-[10px] text-neutral-600 mt-1">
                Salve sua composição atual para reutilizar a qualquer momento!
              </p>
            </div>
          ) : (
            shots.map((shot) => (
              <div
                key={shot.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1c1c1c] border border-white/5 hover:border-white/20 transition-all group"
              >
                <div
                  onClick={() => handleLoadShot(shot)}
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#242424] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {shot.imageUrl ? (
                      <img
                        src={shot.imageUrl}
                        alt={shot.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-800 to-neutral-700 text-[10px] text-neutral-400 font-mono">
                        {shot.config.frameType.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {shot.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-neutral-400 mt-0.5 font-mono">
                      <span>{shot.config.frameType}</span>
                      <span>•</span>
                      <span>{shot.config.aspectRatio}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{new Date(shot.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 pl-2">
                  <button
                    onClick={() => handleLoadShot(shot)}
                    className="px-2.5 py-1 rounded-lg bg-[#2c2c2c] hover:bg-white hover:text-black text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Abrir
                  </button>
                  <button
                    onClick={() => handleDeleteShot(shot.id)}
                    aria-label={`Delete shot ${shot.name}`}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
