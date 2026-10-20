export type FrameType =
  | "screenshot"
  | "browser"
  | "minimal-desktop"
  | "iphone-17"
  | "iphone-16-pro"
  | "macbook"
  | "ipad-pro"
  | "watch";

export type FrameStyle =
  | "default"
  | "glass-light"
  | "glass-dark"
  | "liquid-glass"
  | "inset-light"
  | "inset-dark"
  | "outline"
  | "border"
  | "retro"
  | "card"
  | "stack"
  | "stack-2";

export type BorderRoundness = "sharp" | "curved" | "round";

export type ShadowMode = "none" | "spread" | "hug" | "adaptive";

export type LayoutPreset =
  | "center"
  | "isometric-left"
  | "isometric-right"
  | "tilt-forward"
  | "tilt-backward"
  | "bottom-cut"
  | "side-angle";

export type AnimationPreset =
  | "none"
  | "float"
  | "turntable"
  | "pulse"
  | "orbit";

export type AspectRatioType =
  | "16:9"
  | "3:2"
  | "4:3"
  | "5:4"
  | "1:1"
  | "4:5"
  | "3:4"
  | "2:3"
  | "9:16"
  | "3:1"
  | "10:21"
  | "16:10"
  | "custom";

export interface ShapeObject {
  scale: number;
  stick: string;
  x: number;
  y: number;
  rotate: number;
  blur: number;
  zIndex: number;
}

export interface ShapesLayout {
  name: string;
  layout: ShapeObject[];
}

export interface MockupConfig {
  activeTab: "mockup" | "frame";
  frameType: FrameType;
  frameStyle: FrameStyle;
  borderRoundness: BorderRoundness;
  borderRadius: number;
  shadowMode: ShadowMode;
  shadowOpacity: number; // 10 - 70 in Shots.so
  showMockup: boolean;
  padding: number;
  scale: number;
  zoom: number; // 75% to 400%
  tiltX: number; // -45 to 45
  tiltY: number; // -45 to 45
  tiltZ: number; // -45 to 45
  backgroundType: "gradient" | "solid" | "image";
  backgroundValue: string;
  aspectRatio: AspectRatioType;
  customWidth: number;
  customHeight: number;
  layoutPreset: LayoutPreset;
  exportScale: 1 | 2 | 3; // 1x (FHD), 2x (4K), 3x (6K)
  exportFormat: "PNG" | "JPEG" | "WEBP";
  browserUrl?: string;
  // Effects & Watermark
  watermark: boolean;
  noiseOverlay: boolean;
  portraitEffect: boolean;
  // 3D Shapes Scene
  shapesSceneEnabled: boolean;
  shapesPack: "glass-blue" | "glass-pink" | "plushy";
  shapesLayoutName: string;
  shapesItems: number[];
  // Animation & Motion
  animationPreset: AnimationPreset;
  isAnimationPlaying: boolean;
  animationDuration: number;
}

export interface DeviceSpec {
  name: string;
  aspectRatio: string;
  isDevice: boolean;
  deviceImg?: string;
  maskSvg?: string;
  screenBounds?: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
  scaleMultiplier?: number;
  containerClass?: string;
}

export const DEVICE_SPECS: Record<FrameType, DeviceSpec> = {
  screenshot: {
    name: "Screenshot",
    aspectRatio: "4 / 3",
    isDevice: false,
  },
  browser: {
    name: "Browser",
    aspectRatio: "16 / 10",
    isDevice: false,
  },
  "minimal-desktop": {
    name: "Minimal Desktop",
    aspectRatio: "16 / 10",
    isDevice: false,
    deviceImg: "/shots-assets/devices/minimaldesktop.png",
  },
  "iphone-17": {
    name: "iPhone 17",
    aspectRatio: "1508 / 3278",
    isDevice: true,
    deviceImg: "/shots-assets/devices/iphone17_black.png",
    maskSvg: "/shots-assets/devices/iphone17_display.svg",
    screenBounds: {
      left: "10.01%",
      top: "14.61%",
      width: "79.91%",
      height: "75.35%",
    },
    containerClass: "iphone-17",
  },
  "iphone-16-pro": {
    name: "iPhone 16 Pro",
    aspectRatio: "1508 / 3279",
    isDevice: true,
    deviceImg: "/shots-assets/devices/iphone16pro_portrait.png",
    maskSvg: "/shots-assets/devices/iphone16pro_display.svg",
    screenBounds: {
      left: "10.01%",
      top: "14.61%",
      width: "79.91%",
      height: "75.35%",
    },
    containerClass: "iphone-16-pro",
  },
  macbook: {
    name: "MacBook Pro 16",
    aspectRatio: "4893 / 3164",
    isDevice: true,
    deviceImg: "/shots-assets/devices/macbook_portrait_silver.png",
    maskSvg: "/shots-assets/devices/macbook_portrait_display.svg",
    screenBounds: {
      left: "16.70%",
      top: "18.62%",
      width: "66.61%",
      height: "64.66%",
    },
    containerClass: "macbook-pro-16",
  },
  "ipad-pro": {
    name: "iPad Pro 13",
    aspectRatio: "2560 / 3415",
    isDevice: true,
    deviceImg: "/shots-assets/devices/ipad_portrait_spacegray.png",
    maskSvg: "/shots-assets/devices/ipad_portrait_display.svg",
    screenBounds: {
      left: "9.96%",
      top: "9.99%",
      width: "80.04%",
      height: "80.00%",
    },
    containerClass: "ipad-pro-13",
  },
  watch: {
    name: "Apple Watch Ultra",
    aspectRatio: "1640 / 2009",
    isDevice: true,
    deviceImg: "/shots-assets/devices/watch_portrait_ultra.png",
    maskSvg: "/shots-assets/devices/watch_portrait_display.svg",
    screenBounds: {
      left: "24.94%",
      top: "25.04%",
      width: "50.06%",
      height: "49.98%",
    },
    containerClass: "watch-ultra",
  },
};

export const SHAPES_LAYOUTS: ShapesLayout[] = [
  {
    name: "layout-1",
    layout: [
      { scale: 1.2, stick: "top left", x: -50, y: -50, rotate: 0, blur: 1, zIndex: -1 },
      { scale: 0.8, stick: "top right", x: 70, y: -50, rotate: 0, blur: 0.5, zIndex: -1 },
      { scale: 0.7, stick: "bottom right", x: 100, y: 20, rotate: -15, blur: 3, zIndex: -2 },
      { scale: 1.6, stick: "bottom left", x: -60, y: 20, rotate: 0, blur: 1.5, zIndex: 1 },
    ],
  },
  {
    name: "layout-7",
    layout: [
      { scale: 1.0, stick: "top left", x: -60, y: -50, rotate: 0, blur: 0.5, zIndex: -1 },
      { scale: 0.5, stick: "top left", x: 80, y: -120, rotate: 0, blur: 1.5, zIndex: -1 },
      { scale: 1.2, stick: "top right", x: 40, y: -20, rotate: 0, blur: 0.5, zIndex: -1 },
      { scale: 0.7, stick: "bottom right", x: 80, y: 80, rotate: 0, blur: 0, zIndex: 2 },
      { scale: 0.8, stick: "bottom left", x: -20, y: 80, rotate: 0, blur: 0, zIndex: 1 },
      { scale: 0.6, stick: "bottom left", x: -100, y: 10, rotate: 0, blur: 1.5, zIndex: -1 },
    ],
  },
  {
    name: "layout-3",
    layout: [
      { scale: 0.8, stick: "top left", x: -60, y: -60, rotate: 0, blur: 0.5, zIndex: -1 },
      { scale: 1.0, stick: "top left", x: 100, y: -60, rotate: 0, blur: 0.5, zIndex: -1 },
      { scale: 0.7, stick: "top right", x: 100, y: 15, rotate: 0, blur: 0, zIndex: 1 },
      { scale: 1.2, stick: "bottom right", x: 40, y: 40, rotate: 0, blur: 0.5, zIndex: -1 },
      { scale: 1.1, stick: "bottom left", x: -50, y: 50, rotate: 0, blur: 0.5, zIndex: 1 },
      { scale: 0.5, stick: "bottom left", x: -130, y: -50, rotate: 0, blur: 0, zIndex: 1 },
    ],
  },
];

export const STYLE_OPTIONS = [
  { id: "default", label: "Default", img: "/shots-assets/mockups_Screenshot_styles_default.png" },
  { id: "glass-light", label: "Glass Light", img: "/shots-assets/mockups_Screenshot_styles_glass-light.png" },
  { id: "glass-dark", label: "Glass Dark", img: "/shots-assets/mockups_Screenshot_styles_glass-dark.png" },
  { id: "liquid-glass", label: "Liquid Glass", img: "/shots-assets/mockups_Screenshot_styles_liquid-glass.png" },
  { id: "inset-light", label: "Inset Light", img: "/shots-assets/mockups_Screenshot_styles_inset-light.png" },
  { id: "inset-dark", label: "Inset Dark", img: "/shots-assets/mockups_Screenshot_styles_inset-dark.png" },
  { id: "outline", label: "Outline", img: "/shots-assets/mockups_Screenshot_styles_outline.png" },
  { id: "border", label: "Border", img: "/shots-assets/mockups_Screenshot_styles_border.png" },
];

export const SHADOW_OPTIONS = [
  { id: "none", label: "None", img: "/shots-assets/image_shadow-modes_shadow-none.jpeg" },
  { id: "spread", label: "Spread", img: "/shots-assets/image_shadow-modes_shadow-spread.jpeg" },
  { id: "hug", label: "Hug", img: "/shots-assets/image_shadow-modes_shadow-hug.jpeg" },
  { id: "adaptive", label: "Adaptive", img: "/shots-assets/image_shadow-modes_shadow-adaptive.jpeg" },
];

export const LAYOUT_PRESETS_LIST: { id: LayoutPreset; label: string; tiltX: number; tiltY: number; tiltZ: number; zoom: number }[] = [
  { id: "center", label: "Flat Center", tiltX: 0, tiltY: 0, tiltZ: 0, zoom: 100 },
  { id: "isometric-left", label: "Isometric Left", tiltX: 25, tiltY: -35, tiltZ: 15, zoom: 110 },
  { id: "isometric-right", label: "Isometric Right", tiltX: 25, tiltY: 35, tiltZ: -15, zoom: 110 },
  { id: "tilt-forward", label: "Perspective Tilt", tiltX: 30, tiltY: 0, tiltZ: 0, zoom: 105 },
  { id: "tilt-backward", label: "Rear Elevation", tiltX: -20, tiltY: 10, tiltZ: -5, zoom: 100 },
  { id: "bottom-cut", label: "Bottom Focus", tiltX: 15, tiltY: -10, tiltZ: 0, zoom: 125 },
  { id: "side-angle", label: "Side Angle", tiltX: 10, tiltY: 40, tiltZ: -5, zoom: 110 },
];

export const ASPECT_RATIOS_STANDARD: { id: AspectRatioType; label: string }[] = [
  { id: "16:9", label: "16:9" },
  { id: "3:2", label: "3:2" },
  { id: "4:3", label: "4:3" },
  { id: "5:4", label: "5:4" },
  { id: "1:1", label: "1:1" },
  { id: "4:5", label: "4:5" },
  { id: "3:4", label: "3:4" },
  { id: "2:3", label: "2:3" },
  { id: "9:16", label: "9:16" },
];

export const ASPECT_RATIOS_SOCIAL: { id: AspectRatioType; label: string; ratio: string }[] = [
  { id: "1:1", label: "Post", ratio: "1:1" },
  { id: "4:5", label: "Portrait", ratio: "4:5" },
  { id: "9:16", label: "Story", ratio: "9:16" },
  { id: "16:9", label: "Tweet", ratio: "16:9" },
  { id: "3:1", label: "Cover", ratio: "3:1" },
  { id: "16:9", label: "Banner", ratio: "16:9" },
  { id: "16:9", label: "Thumbnail", ratio: "16:9" },
  { id: "4:3", label: "Shot", ratio: "4:3" },
];

export const PRESET_GRADIENTS = [
  {
    id: "shots-official",
    name: "Shots Official",
    value: "linear-gradient(140deg, rgb(255, 100, 50) 12.8%, rgb(255, 0, 101) 43.52%, rgb(123, 46, 255) 84.34%)",
  },
  {
    id: "shots-sunset-glow",
    name: "Sunset Glow",
    value: "linear-gradient(140deg, rgb(244, 229, 240), rgb(229, 54, 171), rgb(92, 3, 188), rgb(14, 7, 37))",
  },
  {
    id: "shots-pastels",
    name: "Pastel Dream",
    value: "linear-gradient(135deg, rgb(238, 221, 243), rgb(238, 146, 177), rgb(99, 48, 180))",
  },
  {
    id: "shots-sky-coral",
    name: "Sky Coral",
    value: "linear-gradient(113.96deg, rgb(69, 190, 232) 13.54%, rgb(214, 161, 172) 50%, rgb(232, 140, 93) 85.42%)",
  },
  {
    id: "shots-mint-punch",
    name: "Mint Punch",
    value: "linear-gradient(113.96deg, rgb(69, 233, 159) 11.98%, rgb(213, 168, 155) 50%, rgb(232, 70, 152) 85.42%)",
  },
  {
    id: "cosmic-indigo",
    name: "Cosmic Indigo",
    value: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
  },
  {
    id: "tahoe-dark",
    name: "Tahoe Dark",
    value: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  {
    id: "hyper-violet",
    name: "Hyper Violet",
    value: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    value: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)",
  },
  {
    id: "midnight-obsidian",
    name: "Midnight Obsidian",
    value: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    value: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)",
  },
  {
    id: "hyperion-gold",
    name: "Hyperion Gold",
    value: "linear-gradient(135deg, #FFE000 0%, #799F0C 100%)",
  },
];

export const PRESET_PAPER_GLASS = [
  {
    id: "glass-1",
    name: "Glass 1",
    value: "url('/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-1.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-1.jpg",
  },
  {
    id: "glass-2",
    name: "Glass 2",
    value: "url('/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-2.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-2.jpg",
  },
  {
    id: "glass-3",
    name: "Glass 3",
    value: "url('/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-3.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-3.jpg",
  },
  {
    id: "glass-4",
    name: "Glass 4",
    value: "url('/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-4.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-4.jpg",
  },
  {
    id: "glass-5",
    name: "Glass 5",
    value: "url('/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-5.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-5.jpg",
  },
];

export const PRESET_TAHOE = [
  {
    id: "tahoe-day",
    name: "Tahoe Day",
    value: "url('/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-landscape-day.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-landscape-day.jpg",
  },
  {
    id: "tahoe-night",
    name: "Tahoe Night",
    value: "url('/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-landscape-night.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-landscape-night.jpg",
  },
  {
    id: "tahoe-light",
    name: "Tahoe Light",
    value: "url('/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-light.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-light.jpg",
  },
  {
    id: "tahoe-dark-desk",
    name: "Tahoe Dark",
    value: "url('/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-dark.jpg') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-dark.jpg",
  },
];

export const PRESET_SOLIDS = [
  { id: "solid-black", name: "Deep Black", value: "#000000" },
  { id: "solid-studio", name: "Studio Dark", value: "#111111" },
  { id: "solid-slate", name: "Cyber Slate", value: "#1e293b" },
  { id: "solid-indigo", name: "Neon Indigo", value: "#4338ca" },
  { id: "solid-emerald", name: "Emerald", value: "#065f46" },
  { id: "solid-white", name: "Clean White", value: "#ffffff" },
];
