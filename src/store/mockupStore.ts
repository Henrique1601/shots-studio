import { create } from "zustand";
import { MockupConfig, PRESET_GRADIENTS, STYLE_OPTIONS, SlideItem } from "@/types/mockup";

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
  // Slides / Carousel Multi-page State
  slides: SlideItem[];
  activeSlideIndex: number;
  isCarouselOpen: boolean;
  setCarouselOpen: (open: boolean) => void;
  addSlide: () => void;
  duplicateSlide: (index: number) => void;
  removeSlide: (index: number) => void;
  setActiveSlideIndex: (index: number) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
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
  browserUrl: "framecraft.app/editor",
  watermark: true,
  noiseOverlay: false,
  portraitEffect: false,
  shapesSceneEnabled: false,
  shapesPack: "glass-blue",
  shapesLayoutName: "layout-7",
  shapesItems: [1, 2, 3, 4, 5, 6],
  animationPreset: "none",
  isAnimationPlaying: false,
  isTimelineOpen: false,
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
  watermarkText: "FrameCraft",
  watermarkPlatform: "shots",
  watermarkPosition: "top-left",
  watermarkStyle: "default",
  watermarkTheme: "dark",
  watermarkSize: 80,
  watermarkInset: 5,
  watermarkProfileIndex: 1,
  watermarkProfiles: [
    {
      enabled: false,
      text: "",
      platform: "none",
      style: "default",
      theme: "dark",
      size: 80,
      inset: 5,
      position: "top-left",
    },
    {
      enabled: true,
      text: "FrameCraft",
      platform: "shots",
      style: "default",
      theme: "dark",
      size: 80,
      inset: 5,
      position: "top-left",
    },
    {
      enabled: true,
      text: "@framecraft_app",
      platform: "twitter",
      style: "glass",
      theme: "dark",
      size: 85,
      inset: 6,
      position: "bottom-right",
    },
    {
      enabled: true,
      text: "Crafted in FrameCraft",
      platform: "instagram",
      style: "badge",
      theme: "light",
      size: 75,
      inset: 5,
      position: "bottom-left",
    },
  ],
  portraitLighting: "natural",
  portraitAperture: "f/2.8",
  vfxType: "none",
  vfxIntensity: 50,
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
  slides: [
    {
      id: "slide-1",
      title: "Slide 1",
      imageUrl: null,
      secondaryImageUrl: null,
      tertiaryImageUrl: null,
      config: defaultConfig,
    },
  ],
  activeSlideIndex: 0,
  isCarouselOpen: false,
  setCarouselOpen: (open) => set({ isCarouselOpen: open }),
  addSlide: () => {
    const { slides, config, imageUrl } = get();
    const newSlideId = `slide-${Date.now().toString(36)}`;
    const newSlide: SlideItem = {
      id: newSlideId,
      title: `Slide ${slides.length + 1}`,
      imageUrl: imageUrl,
      secondaryImageUrl: config.secondaryImageUrl || null,
      tertiaryImageUrl: config.tertiaryImageUrl || null,
      config: { ...config },
    };
    const nextSlides = [...slides, newSlide];
    set({
      slides: nextSlides,
      activeSlideIndex: nextSlides.length - 1,
      isCarouselOpen: true,
    });
    get().showToast(`Slide ${nextSlides.length} added`);
  },
  duplicateSlide: (index) => {
    const { slides } = get();
    if (!slides[index]) return;
    const target = slides[index];
    const duplicated: SlideItem = {
      ...target,
      id: `slide-${Date.now().toString(36)}`,
      title: `${target.title} (Copy)`,
      config: { ...target.config },
    };
    const nextSlides = [...slides];
    nextSlides.splice(index + 1, 0, duplicated);
    set({
      slides: nextSlides,
      activeSlideIndex: index + 1,
      config: { ...duplicated.config },
      imageUrl: duplicated.imageUrl,
    });
    get().showToast("Slide duplicated");
  },
  removeSlide: (index) => {
    const { slides, activeSlideIndex } = get();
    if (slides.length <= 1) {
      get().showToast("Cannot remove the only slide", "warning");
      return;
    }
    const nextSlides = slides.filter((_, i) => i !== index);
    const nextActive = Math.min(activeSlideIndex, nextSlides.length - 1);
    const activeSlide = nextSlides[nextActive];
    set({
      slides: nextSlides,
      activeSlideIndex: nextActive,
      config: { ...activeSlide.config },
      imageUrl: activeSlide.imageUrl,
    });
    get().showToast("Slide removed");
  },
  setActiveSlideIndex: (index) => {
    const { slides, activeSlideIndex, config, imageUrl } = get();
    if (index === activeSlideIndex || !slides[index]) return;
    // Save current active slide state first
    const updatedSlides = [...slides];
    if (updatedSlides[activeSlideIndex]) {
      updatedSlides[activeSlideIndex] = {
        ...updatedSlides[activeSlideIndex],
        config: { ...config },
        imageUrl,
      };
    }
    const targetSlide = updatedSlides[index];
    set({
      slides: updatedSlides,
      activeSlideIndex: index,
      config: { ...targetSlide.config },
      imageUrl: targetSlide.imageUrl,
    });
  },
  reorderSlides: (startIndex, endIndex) => {
    const { slides } = get();
    const result = Array.from(slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ slides: result, activeSlideIndex: endIndex });
  },
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
