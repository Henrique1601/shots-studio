export type FrameType =
  | "screenshot"
  | "browser"
  | "minimal-desktop"
  | "iphone-17"
  | "iphone-17-air"
  | "iphone-16-pro"
  | "pixel-9-pro"
  | "macbook"
  | "ipad-pro"
  | "ultrawide-monitor"
  | "imac-24"
  | "foldable-phone"
  | "watch"
  | "code";

export type CodeLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "html"
  | "css"
  | "json"
  | "rust"
  | "go"
  | "sql";

export type CodeTheme =
  | "one-dark"
  | "dracula"
  | "tokyo-night"
  | "github-dark"
  | "monokai";

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

export type LightPreset =
  | "none"
  | "soft-studio"
  | "top-left"
  | "top-right"
  | "dramatic";

export type WatermarkPlatform = "framecraft" | "shots" | "twitter" | "instagram" | "none";
export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type WatermarkStyle = "default" | "shadow" | "glass" | "badge";
export type WatermarkTheme = "light" | "dark";

export interface SlideItem {
  id: string;
  title: string;
  imageUrl: string | null;
  secondaryImageUrl?: string | null;
  tertiaryImageUrl?: string | null;
  config: MockupConfig;
}

export type PortraitLightingMode = "natural" | "studio" | "contour" | "stage";

export interface WatermarkProfile {
  enabled: boolean;
  text: string;
  platform: WatermarkPlatform;
  style: WatermarkStyle;
  theme: WatermarkTheme;
  size: number;
  inset: number;
  position: WatermarkPosition;
}

export type VfxType =
  | "none"
  | "noise"
  | "vhs"
  | "tv"
  | "vhs-glitch"
  | "tech-glitch"
  | "light-leak"
  | "particles"
  | "glitter";

export type DeviceColorFinish =
  | "default"
  | "space-black"
  | "silver"
  | "natural-titanium"
  | "desert-titanium";

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
  shadowOpacity: number; // 10 - 70 in FrameCraft Studio
  showMockup: boolean;
  padding: number;
  scale: number;
  zoom: number; // 75% to 400%
  tiltX: number; // -45 to 45
  tiltY: number; // -45 to 45
  tiltZ: number; // -45 to 45
  backgroundType: "gradient" | "solid" | "image" | "transparent";
  backgroundValue: string;
  aspectRatio: AspectRatioType;
  customWidth: number;
  customHeight: number;
  layoutPreset: LayoutPreset;
  exportScale: 1 | 2 | 3; // 1x (FHD), 2x (4K), 3x (6K)
  exportFormat: "PNG" | "JPEG" | "WEBP" | "GIF" | "VIDEO";
  browserUrl?: string;
  // Effects & Watermark
  watermark: boolean;
  noiseOverlay: boolean;
  portraitEffect: boolean;
  portraitLighting?: PortraitLightingMode;
  portraitAperture?: string;
  watermarkStyle?: WatermarkStyle;
  watermarkTheme?: WatermarkTheme;
  watermarkSize?: number;
  watermarkInset?: number;
  watermarkProfileIndex?: number;
  watermarkProfiles?: WatermarkProfile[];
  vfxType?: VfxType;
  vfxIntensity?: number;
  // 3D Shapes Scene
  shapesSceneEnabled: boolean;
  shapesPack:
    | "glass-blue"
    | "glass-pink"
    | "inflatable"
    | "metal"
    | "metal-gradient-dark"
    | "metal-gradient-light"
    | "plushy";
  shapesLayoutName: string;
  shapesItems: number[];
  // Animation & Motion
  animationPreset: AnimationPreset;
  isAnimationPlaying: boolean;
  isTimelineOpen?: boolean;
  animationDuration: number;
  // Duo / Multi-Device Mode (Single, Duo, Trio)
  mockupMode: "single" | "duo" | "trio";
  secondaryImageUrl?: string | null;
  tertiaryImageUrl?: string | null;
  duoGap: number;
  // Text Annotations
  annotationsEnabled: boolean;
  annotationHeadline: string;
  annotationSubtitle: string;
  annotationBadge: string;
  annotationBadgeColor: string;
  annotationPosition: "top" | "bottom";
  annotationAlign: "left" | "center" | "right";
  // Custom Color / Gradient
  customColor1: string;
  customColor2: string;
  customGradientAngle: number;
  // Image Fit & Pan
  imageFit: "cover" | "contain";
  imagePositionY: number; // 0% (top) to 100% (bottom)
  // Lighting & Glare
  lightPreset: LightPreset;
  lightIntensity: number; // 0 to 100
  // Custom Watermark
  watermarkText: string;
  watermarkPlatform: WatermarkPlatform;
  watermarkPosition: WatermarkPosition;
  // Device Color Finish
  deviceColor: DeviceColorFinish;
  // Depth of Field (Background Bokeh Blur)
  backgroundBlur: number; // 0 to 40 (px)
  // Film Grain & Texture
  grainIntensity: number; // 0 to 100 (%)
  // Code Snippet Studio
  codeSnippet?: string;
  codeLanguage?: CodeLanguage;
  codeTheme?: CodeTheme;
  codeShowLineNumbers?: boolean;
  codeTitle?: string;
  // Image Grading & Filters
  brightness?: number; // 50 to 150 (%)
  contrast?: number;   // 50 to 150 (%)
  saturation?: number; // 0 to 200 (%)
  grayscale?: boolean;
  sepia?: boolean;
  hueRotate?: number;  // 0 to 360 (deg)
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


export interface SocialMediaPreset {
  id: string;
  name: string;
  platform: "twitter" | "instagram" | "linkedin" | "dribbble" | "youtube" | "producthunt";
  width: number;
  height: number;
  aspectRatio: AspectRatioType;
  badge: string;
}


export interface TemplatePreset {
  id: string;
  name: string;
  tagline: string;
  category: "marketing" | "social" | "mobile" | "minimal";
  badge?: string;
  config: Partial<MockupConfig>;
}


// Re-export constants and presets for 100% backwards compatibility
export * from "../constants/shapes.ts";
export * from "../constants/presets.ts";

