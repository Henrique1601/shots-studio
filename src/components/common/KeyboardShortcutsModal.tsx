"use client";

import React, { useState } from "react";
import { Command, Keyboard, X } from "lucide-react";

export const KeyboardShortcutsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: "D", desc: "Abrir catálogo de aparelhos (Devices)" },
    { key: "T", desc: "Abrir galeria de templates prontos" },
    { key: "1", desc: "Mudar para aba 'Mockup' (aparelho, estilos)" },
    { key: "2", desc: "Mudar para aba 'Frame' (proporções, cores)" },
    { key: "Ctrl + C", desc: "Copiar imagem direto para o Clipboard" },
    { key: "Ctrl + E", desc: "Exportar imagem do mockup atual" },
    { key: "Ctrl + V", desc: "Colar imagem da área de transferência" },
    { key: "Ctrl + Z", desc: "Desfazer alteração (Undo)" },
    { key: "Ctrl + Y", desc: "Refazer alteração (Redo)" },
    { key: "Del / Backspace", desc: "Remover imagem atual do mockup" },
    { key: "Shift + Arrastar", desc: "Micro-ajuste de precisão 3D na órbita" },
    { key: "Duplo-Clique", desc: "Resetar rotação espacial para 0°" },
    { key: "Esc", desc: "Fechar modais abertos" },
  ];

  return (
    <>
      {/* Trigger Button in bottom-right corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 right-3 z-40 bg-[#1c1c1c]/90 hover:bg-[#282828] text-neutral-400 hover:text-white p-2 rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-all cursor-pointer flex items-center space-x-1.5 text-xs group"
        title="Atalhos de Teclado (?)"
      >
        <Keyboard className="w-3.5 h-3.5 group-hover:text-pink-400 transition-colors" />
        <span className="hidden sm:inline text-[11px] font-medium">Atalhos</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Command className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold tracking-tight">Atalhos de Teclado</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {shortcuts.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-[#222222] text-xs"
                >
                  <span className="text-neutral-300 font-medium text-[11px]">{sc.desc}</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-[#111111] border border-white/10 text-pink-400 font-mono text-[10px] font-bold shadow-xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[10px] text-neutral-500">
              Dica: Você também pode colar prints diretamente com <kbd className="px-1 py-0.5 rounded bg-black/40 text-neutral-300">Ctrl + V</kbd> em qualquer tela.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
