import { create } from "zustand";
import { MockupConfig, PRESET_GRADIENTS, STYLE_OPTIONS } from "@/types/mockup";

export interface ToastItem {
  id: string;
  message: string;
  type?: "success" | "info" | "warning" | "error";
}

interface MockupStore {
  config: MockupConfig;
  imageUrl: string | null;
  imageDimensions: { width: number; height: number } | null;
  isDeviceModalOpen: boolean;
  isExportSettingsOpen: boolean;
  isTemplatesModalOpen: boolean;
  history: MockupConfig[];
  historyIndex: number;
  toasts: ToastItem[];
  showToast: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  setImageUrl: (url: string | null) => void;
  setSecondaryImageUrl: (url: string | null) => void;
  setTertiaryImageUrl: (url: string | null) => void;
  setImageDimensions: (dims: { width: number; height: number } | null) => void;
  setDeviceModalOpen: (open: boolean) => void;
  setExportSettingsOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
  updateConfig: (partial: Partial<MockupConfig>) => void;
  undo: () => void;
  redo: () => void;
  randomize: () => void;
  resetConfig: () => void;
}

const defaultConfig: MockupConfig = {
  activeTab: "mockup",
  frameType: "screenshot",
  frameStyle: "default",
  borderRoundness: "curved",
  borderRadius: 20,
  shadowMode: "adaptive",
  shadowOpacity: 40,
  showMockup: true,
  padding: 48,
  scale: 1,
  zoom: 100,
  tiltX: 0,
  tiltY: 0,
  tiltZ: 0,
  backgroundType: "gradient",
  backgroundValue: PRESET_GRADIENTS[0].value,
  aspectRatio: "16:9",
  customWidth: 1920,
  customHeight: 1080,
  layoutPreset: "center",
  exportScale: 1,
  exportFormat: "PNG",
  browserUrl: "shots.so/editor",
  watermark: true,
  noiseOverlay: false,
  portraitEffect: false,
  shapesSceneEnabled: false,
  shapesPack: "glass-blue",
  shapesLayoutName: "layout-7",
  shapesItems: [1, 2, 3, 4, 5, 6],
  animationPreset: "none",
  isAnimationPlaying: false,
  animationDuration: 5,
  mockupMode: "single",
  secondaryImageUrl: null,
  tertiaryImageUrl: null,
  duoGap: 24,
  annotationsEnabled: false,
  annotationHeadline: "Your Headline Here",
  annotationSubtitle: "Craft beautiful mockups in seconds",
  annotationBadge: "NEW",
  annotationBadgeColor: "#6366f1",
  annotationPosition: "top",
  annotationAlign: "center",
  customColor1: "#6366f1",
  customColor2: "#ec4899",
  customGradientAngle: 135,
  imageFit: "cover",
  imagePositionY: 50,
  lightPreset: "soft-studio",
  lightIntensity: 35,
  watermarkText: "Shots.so",
  watermarkPlatform: "shots",
  watermarkPosition: "top-left",
  deviceColor: "default",
  backgroundBlur: 0,
  grainIntensity: 0,
  codeSnippet: `function calculateMetrics(data: Dataset): Result {
  const normalized = normalize(data);
  return analyze(normalized);
}`,
  codeLanguage: "typescript",
  codeTheme: "one-dark",
  codeShowLineNumbers: true,
  codeTitle: "metrics.ts",
};

export const useMockupStore = create<MockupStore>((set, get) => ({
  config: defaultConfig,
  imageUrl: null,
  imageDimensions: null,
  isDeviceModalOpen: false,
  isExportSettingsOpen: false,
  isTemplatesModalOpen: false,
  history: [defaultConfig],
  historyIndex: 0,
  toasts: [],
  showToast: (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 2800);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
  setImageUrl: (url) => set({ imageUrl: url }),
  setSecondaryImageUrl: (url) => {
    set((state) => ({
      config: { ...state.config, secondaryImageUrl: url },
    }));
  },
  setTertiaryImageUrl: (url) => {
    set((state) => ({
      config: { ...state.config, tertiaryImageUrl: url },
    }));
  },
  setImageDimensions: (dims) => set({ imageDimensions: dims }),
  setDeviceModalOpen: (open) => set({ isDeviceModalOpen: open }),
  setExportSettingsOpen: (open) => set({ isExportSettingsOpen: open }),
  setTemplatesModalOpen: (open) => set({ isTemplatesModalOpen: open }),
  updateConfig: (partial) => {
    const current = get().config;
    const nextConfig = { ...current, ...partial };
    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push(nextConfig);
    set({
      config: nextConfig,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        config: history[historyIndex - 1],
      });
    }
  },
  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        config: history[historyIndex + 1],
      });
    }
  },
  randomize: () => {
    const randGradient = PRESET_GRADIENTS[Math.floor(Math.random() * PRESET_GRADIENTS.length)];
    const randStyle = STYLE_OPTIONS[Math.floor(Math.random() * STYLE_OPTIONS.length)];
    const rounds: ("sharp" | "curved" | "round")[] = ["sharp", "curved", "round"];
    const randRound = rounds[Math.floor(Math.random() * rounds.length)];
    get().updateConfig({
      backgroundValue: randGradient.value,
      frameStyle: randStyle.id as any,
      borderRoundness: randRound,
      borderRadius: randRound === "sharp" ? 0 : randRound === "curved" ? 20 : 36,
    });
  },
  resetConfig: () =>
    set({
      config: defaultConfig,
      imageUrl: null,
      imageDimensions: null,
      history: [defaultConfig],
      historyIndex: 0,
    }),
}));
