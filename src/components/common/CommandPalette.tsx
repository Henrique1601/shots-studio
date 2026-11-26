"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { useExportStudio } from "@/hooks/useExportStudio";
import {
  DEVICE_SPECS,
  PRESET_MYSTIC,
  PRESET_GRADIENTS,
  PRESET_SOLIDS,
  FrameType,
} from "@/types/mockup";
import {
  Search,
  Smartphone,
  Sparkles,
  Download,
  Copy,
  Layers,
  Shuffle,
  RotateCcw,
  Magnet,
  Globe,
  Sun,
  Moon,
  LayoutGrid,
  CornerDownLeft,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Dispositivos" | "Estilos & Fundos" | "Modo & Canvas" | "Ações Rápidas";
  title: string;
  subtitle?: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandPalette = () => {
  const {
    config,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    updateConfig,
    setDeviceModalOpen,
    setTemplatesModalOpen,
    randomize,
    resetConfig,
    showToast,
  } = useMockupStore();

  const { handleExport, handleCopy } = useExportStudio();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = useMemo(() => {
    const deviceCommands: CommandItem[] = (Object.keys(DEVICE_SPECS) as FrameType[]).map(
      (key) => ({
        id: `device-${key}`,
        category: "Dispositivos",
        title: `Mudar para ${DEVICE_SPECS[key].name}`,
        subtitle: DEVICE_SPECS[key].aspectRatio,
        keywords: `device frame mockup ${key} ${DEVICE_SPECS[key].name}`.toLowerCase(),
        icon: Smartphone,
        action: () => {
          updateConfig({ frameType: key });
          showToast(`Frame: ${DEVICE_SPECS[key].name}`, "success");
        },
      })
    );

    const styleCommands: CommandItem[] = [
      {
        id: "bg-transparent",
        category: "Estilos & Fundos",
        title: "Fundo Transparente",
        subtitle: "Ideal para PNGs recortados",
        keywords: "fundo transparent png sem fundo".toLowerCase(),
        icon: Sparkles,
        action: () => {
          updateConfig({ backgroundType: "transparent", backgroundValue: "transparent" });
          showToast("Fundo transparente ativado!", "info");
        },
      },
      {
        id: "bg-mystic-aurora",
        category: "Estilos & Fundos",
        title: `Gradiente Mystic: ${PRESET_MYSTIC[0]?.name || "Aurora"}`,
        subtitle: "Caustic 4K Premium",
        keywords: "gradiente mystic aurora fundo background".toLowerCase(),
        icon: Sparkles,
        action: () => {
          if (PRESET_MYSTIC[0]) {
            updateConfig({ backgroundType: "gradient", backgroundValue: PRESET_MYSTIC[0].value });
            showToast(`Fundo: ${PRESET_MYSTIC[0].name}`, "success");
          }
        },
      },
      {
        id: "bg-gradient-official",
        category: "Estilos & Fundos",
        title: `Gradiente: ${PRESET_GRADIENTS[0]?.name || "Official"}`,
        subtitle: "Gradiente vibrante padrão",
        keywords: "gradiente official cosmic fundo".toLowerCase(),
        icon: Sparkles,
        action: () => {
          if (PRESET_GRADIENTS[0]) {
            updateConfig({ backgroundType: "gradient", backgroundValue: PRESET_GRADIENTS[0].value });
            showToast(`Fundo: ${PRESET_GRADIENTS[0].name}`, "success");
          }
        },
      },
      {
        id: "bg-solid-dark",
        category: "Estilos & Fundos",
        title: "Fundo Sólido Studio Dark",
        subtitle: "#111111 minimalista",
        keywords: "solid dark preto escuro minimal".toLowerCase(),
        icon: Moon,
        action: () => {
          updateConfig({
            backgroundType: "solid",
            backgroundValue: PRESET_SOLIDS[0]?.value || "#111111",
          });
          showToast("Fundo sólido escuro aplicado!", "info");
        },
      },
      {
        id: "browser-tabs-toggle",
        category: "Estilos & Fundos",
        title: config.browserTabsEnabled
          ? "Desativar Abas Reais do Safari"
          : "Ativar Abas Reais do Safari",
        subtitle: "Multi-tab bar para moldura Browser",
        keywords: "safari browser tabs abas navegador".toLowerCase(),
        icon: Globe,
        action: () => {
          const next = !config.browserTabsEnabled;
          updateConfig({ frameType: "browser", browserTabsEnabled: next });
          showToast(next ? "Abas do Safari ativadas! 🌐" : "Abas do Safari desativadas", "info");
        },
      },
      {
        id: "browser-theme-toggle",
        category: "Estilos & Fundos",
        title:
          config.browserTheme === "light"
            ? "Browser: Mudar para Dark Mode"
            : "Browser: Mudar para Light Mode",
        subtitle: "Alternar aparência da janela Safari",
        keywords: "browser light dark mode tema claro escuro safari".toLowerCase(),
        icon: config.browserTheme === "light" ? Moon : Sun,
        action: () => {
          const next = config.browserTheme === "light" ? "dark" : "light";
          updateConfig({ frameType: "browser", browserTheme: next });
          showToast(`Browser Theme: ${next === "light" ? "Light ☀️" : "Dark 🌙"}`, "info");
        },
      },
    ];

    const canvasCommands: CommandItem[] = [
      {
        id: "mode-single",
        category: "Modo & Canvas",
        title: "Modo Single Mockup",
        subtitle: "1 dispositivo centralizado",
        keywords: "single mode 1 dispositivo".toLowerCase(),
        icon: Layers,
        action: () => {
          updateConfig({ mockupMode: "single" });
          showToast("Modo Single ativado", "info");
        },
      },
      {
        id: "mode-duo",
        category: "Modo & Canvas",
        title: "Modo Duo Mockup",
        subtitle: "2 dispositivos lado a lado",
        keywords: "duo mode 2 dispositivos side by side".toLowerCase(),
        icon: Layers,
        action: () => {
          updateConfig({ mockupMode: "duo" });
          showToast("Modo Duo ativado! 📱📱", "success");
        },
      },
      {
        id: "mode-trio",
        category: "Modo & Canvas",
        title: "Modo Trio Mockup",
        subtitle: "3 dispositivos em vitrine",
        keywords: "trio mode 3 dispositivos".toLowerCase(),
        icon: Layers,
        action: () => {
          updateConfig({ mockupMode: "trio" });
          showToast("Modo Trio ativado! 📱📱📱", "success");
        },
      },
      {
        id: "snap-guides-toggle",
        category: "Modo & Canvas",
        title:
          config.snapGuidesEnabled !== false
            ? "Desativar Guias Magnéticas (Smart Snap)"
            : "Ativar Guias Magnéticas (Smart Snap)",
        subtitle: "Alinhamento automático no eixo 0°",
        keywords: "snap guides guias magneticas alinhamento".toLowerCase(),
        icon: Magnet,
        action: () => {
          const next = config.snapGuidesEnabled === false;
          updateConfig({ snapGuidesEnabled: next });
          showToast(next ? "Guias magnéticas ativadas 🧲" : "Guias magnéticas desativadas", "info");
        },
      },
      {
        id: "reset-tilt",
        category: "Modo & Canvas",
        title: "Resetar Rotação 3D (0°, 0°, 0°)",
        subtitle: "Centraliza ângulo do mockup",
        keywords: "reset tilt rotacao 3d centralizar".toLowerCase(),
        icon: RotateCcw,
        action: () => {
          updateConfig({ tiltX: 0, tiltY: 0, tiltZ: 0 });
          showToast("Rotação 3D zerada!", "info");
        },
      },
    ];

    const actionCommands: CommandItem[] = [
      {
        id: "action-export",
        category: "Ações Rápidas",
        title: `Exportar Imagem (${config.exportScale}x ${config.exportFormat})`,
        subtitle: "Atalho: Ctrl + E",
        keywords: "export download baixar salvar png".toLowerCase(),
        icon: Download,
        action: () => handleExport(),
      },
      {
        id: "action-copy",
        category: "Ações Rápidas",
        title: "Copiar Canvas para Área de Transferência",
        subtitle: "Atalho: Ctrl + C",
        keywords: "copy copiar clipboard".toLowerCase(),
        icon: Copy,
        action: () => handleCopy(),
      },
      {
        id: "action-templates",
        category: "Ações Rápidas",
        title: "Abrir Galeria de Templates",
        subtitle: "Atalho: T",
        keywords: "templates galeria presets modelos".toLowerCase(),
        icon: LayoutGrid,
        action: () => setTemplatesModalOpen(true),
      },
      {
        id: "action-devices",
        category: "Ações Rápidas",
        title: "Abrir Seletor de Dispositivos",
        subtitle: "Atalho: D",
        keywords: "devices dispositivos modal".toLowerCase(),
        icon: Smartphone,
        action: () => setDeviceModalOpen(true),
      },
      {
        id: "action-randomize",
        category: "Ações Rápidas",
        title: "Randomizar Estilo (Surprise Me)",
        subtitle: "Combinação aleatória de cores e ângulos",
        keywords: "randomize aleatorio shuffle".toLowerCase(),
        icon: Shuffle,
        action: () => {
          randomize();
          showToast("Estilo randomizado! ✨", "success");
        },
      },
      {
        id: "action-reset",
        category: "Ações Rápidas",
        title: "Resetar Todas Configurações",
        subtitle: "Restaura o estúdio ao padrão inicial",
        keywords: "resetar limpar tudo padrao".toLowerCase(),
        icon: RotateCcw,
        action: () => {
          resetConfig();
          showToast("Configurações resetadas!", "info");
        },
      },
    ];

    return [...actionCommands, ...canvasCommands, ...styleCommands, ...deviceCommands];
  }, [
    config.exportScale,
    config.exportFormat,
    config.browserTabsEnabled,
    config.browserTheme,
    config.snapGuidesEnabled,
    updateConfig,
    showToast,
    handleExport,
    handleCopy,
    setTemplatesModalOpen,
    setDeviceModalOpen,
    randomize,
    resetConfig,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 12);
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.keywords.includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const executeSelected = (item: CommandItem) => {
    setCommandPaletteOpen(false);
    item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      executeSelected(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/70 backdrop-blur-sm px-4"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-[#161618] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#1b1b1e]">
          <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite um comando, dispositivo, fundo ou ação (ex: iPhone, Duo, Exportar)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-500">
              Nenhum comando encontrado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => executeSelected(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/25 border border-indigo-500/40 text-white"
                      : "border border-transparent text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-indigo-500 text-white" : "bg-[#242428] text-neutral-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-[10px] text-neutral-400 truncate">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[#121214] border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-500">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navegar</span>
            <span>↵ Executar</span>
            <span>ESC Fechar</span>
          </div>
          <span className="font-mono text-indigo-400/80">FrameCraft Command Palette</span>
        </div>
      </div>
    </div>
  );
};
