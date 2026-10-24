import type {
  FrameType,
  DeviceSpec,
  LayoutPreset,
  AspectRatioType,
  SocialMediaPreset,
  TemplatePreset,
} from "../types/mockup.ts";

// Device specifications
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
      top: "10.00%",
      width: "79.98%",
      height: "80.00%",
    },
    containerClass: "iphone-17",
  },
  "iphone-17-air": {
    name: "iPhone 17 Air",
    aspectRatio: "1260 / 2736",
    isDevice: true,
    deviceImg: "/shots-assets/devices/iphone17_black.png",
    maskSvg: "/shots-assets/devices/iphone17air_display.svg",
    screenBounds: {
      left: "8.50%",
      top: "8.50%",
      width: "83.00%",
      height: "83.00%",
    },
    containerClass: "iphone-17-air",
  },
  "iphone-16-pro": {
    name: "iPhone 16 Pro",
    aspectRatio: "1508 / 3279",
    isDevice: true,
    deviceImg: "/shots-assets/devices/iphone16pro_portrait.png",
    maskSvg: "/shots-assets/devices/iphone16pro_display.svg",
    screenBounds: {
      left: "10.01%",
      top: "10.00%",
      width: "79.98%",
      height: "80.00%",
    },
    containerClass: "iphone-16-pro",
  },
  "pixel-9-pro": {
    name: "Pixel 9 Pro",
    aspectRatio: "1440 / 3120",
    isDevice: true,
    screenBounds: {
      left: "3.20%",
      top: "2.80%",
      width: "93.60%",
      height: "94.40%",
    },
    containerClass: "pixel-9-pro",
  },
  macbook: {
    name: "MacBook Pro 16",
    aspectRatio: "4893 / 3164",
    isDevice: true,
    deviceImg: "/shots-assets/devices/macbook_portrait_silver.png",
    maskSvg: "/shots-assets/devices/macbook_portrait_display.svg",
    screenBounds: {
      left: "16.70%",
      top: "18.65%",
      width: "66.65%",
      height: "64.70%",
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
      left: "10.00%",
      top: "10.00%",
      width: "80.00%",
      height: "80.00%",
    },
    containerClass: "ipad-pro-13",
  },
  "ultrawide-monitor": {
    name: "Ultrawide 34\"",
    aspectRatio: "3440 / 1440",
    isDevice: true,
    screenBounds: {
      left: "1.20%",
      top: "1.80%",
      width: "97.60%",
      height: "92.40%",
    },
    containerClass: "ultrawide-monitor",
  },
  "imac-24": {
    name: "iMac 24\" M4",
    aspectRatio: "16 / 11.8",
    isDevice: true,
    screenBounds: {
      left: "2.20%",
      top: "2.20%",
      width: "95.60%",
      height: "72.00%",
    },
    containerClass: "imac-24",
  },
  "foldable-phone": {
    name: "Foldable Phone",
    aspectRatio: "2156 / 1916",
    isDevice: true,
    screenBounds: {
      left: "2.40%",
      top: "2.50%",
      width: "95.20%",
      height: "95.00%",
    },
    containerClass: "foldable-phone",
  },
  watch: {
    name: "Apple Watch Ultra",
    aspectRatio: "1640 / 2009",
    isDevice: true,
    deviceImg: "/shots-assets/devices/watch_portrait_ultra.png",
    maskSvg: "/shots-assets/devices/watch_portrait_display.svg",
    screenBounds: {
      left: "25.00%",
      top: "25.09%",
      width: "50.00%",
      height: "50.00%",
    },
    containerClass: "watch-ultra",
  },
  code: {
    name: "Code Snippet",
    aspectRatio: "16 / 10",
    isDevice: false,
  },
};


// Style, shadow and layout presets
export const STYLE_OPTIONS = [
  { id: "default", label: "Default", img: "/shots-assets/mockups_Screenshot_styles_default.png" },
  { id: "glass-light", label: "Glass Light", img: "/shots-assets/mockups_Screenshot_styles_glass-light.png" },
  { id: "glass-dark", label: "Glass Dark", img: "/shots-assets/mockups_Screenshot_styles_glass-dark.png" },
  { id: "liquid-glass", label: "Liquid Glass", img: "/shots-assets/mockups_Screenshot_styles_liquid-glass.png" },
  { id: "inset-light", label: "Inset Light", img: "/shots-assets/mockups_Screenshot_styles_inset-light.png" },
  { id: "inset-dark", label: "Inset Dark", img: "/shots-assets/mockups_Screenshot_styles_inset-dark.png" },
  { id: "outline", label: "Outline", img: "/shots-assets/mockups_Screenshot_styles_outline.png" },
  { id: "border", label: "Border", img: "/shots-assets/mockups_Screenshot_styles_border.png" },
  { id: "retro", label: "Retro", img: "/shots-assets/mockups_Screenshot_styles_default.png" },
  { id: "card", label: "Card", img: "/shots-assets/mockups_Screenshot_styles_glass-light.png" },
  { id: "stack", label: "Stack", img: "/shots-assets/mockups_Screenshot_styles_inset-light.png" },
  { id: "stack-2", label: "Stack 2", img: "/shots-assets/mockups_Screenshot_styles_inset-dark.png" },
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
  { id: "16:10", label: "16:10" },
  { id: "3:2", label: "3:2" },
  { id: "4:3", label: "4:3" },
  { id: "5:4", label: "5:4" },
  { id: "1:1", label: "1:1" },
  { id: "4:5", label: "4:5" },
  { id: "3:4", label: "3:4" },
  { id: "2:3", label: "2:3" },
  { id: "9:16", label: "9:16" },
  { id: "10:21", label: "10:21" },
  { id: "3:1", label: "3:1" },
];

export const DEFAULT_RATIO_DIMENSIONS: Record<AspectRatioType, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "16:10": { width: 1920, height: 1200 },
  "3:2": { width: 1800, height: 1200 },
  "4:3": { width: 1600, height: 1200 },
  "5:4": { width: 1920, height: 1536 },
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
  "3:4": { width: 1080, height: 1440 },
  "2:3": { width: 1200, height: 1800 },
  "9:16": { width: 1080, height: 1920 },
  "10:21": { width: 1080, height: 2268 },
  "3:1": { width: 1500, height: 500 },
  "custom": { width: 1920, height: 1080 },
};

export const parseAspectRatio = (
  aspectRatio: AspectRatioType,
  customWidth?: number,
  customHeight?: number
): { width: number; height: number; ratio: number } => {
  if (aspectRatio === "custom" || (!aspectRatio.includes(":") && !aspectRatio.includes("/"))) {
    const parsedW = Number(customWidth);
    const parsedH = Number(customHeight);
    const w = !isNaN(parsedW) && parsedW > 0 ? parsedW : 1920;
    const h = !isNaN(parsedH) && parsedH > 0 ? parsedH : 1080;
    return { width: w, height: h, ratio: w / h };
  }
  const defaults = DEFAULT_RATIO_DIMENSIONS[aspectRatio];
  const parts = aspectRatio.split("/").join(":").split(":").map(Number);
  const ratio = parts[0] && parts[1] ? parts[0] / parts[1] : 16 / 9;
  const width =
    customWidth && customWidth > 0
      ? customWidth
      : defaults?.width ?? (parts[0] ? parts[0] * 120 : 1920);
  const height =
    customHeight && customHeight > 0
      ? customHeight
      : defaults?.height ?? (parts[1] ? parts[1] * 120 : 1080);
  return { width, height, ratio };
};

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

export const PRESET_MYSTIC = [
  { id: "mystic-1", name: "Aura Blue", value: "radial-gradient(circle at 50% 120%, #2563eb 0%, #1e1b4b 60%, #030712 100%)" },
  { id: "mystic-2", name: "Violet Arch", value: "radial-gradient(circle at 50% 120%, #9333ea 0%, #ec4899 50%, #fdf2f8 100%)" },
  { id: "mystic-3", name: "Cosmic Ripple", value: "radial-gradient(circle at 50% 110%, #6366f1 0%, #a855f7 40%, #09090b 100%)" },
  { id: "mystic-4", name: "Indigo Wave", value: "radial-gradient(circle at 0% 100%, #3b82f6 0%, #1d4ed8 40%, #0f172a 100%)" },
  { id: "mystic-5", name: "Vortex Bloom", value: "radial-gradient(circle at 50% 50%, #f472b6 0%, #a855f7 50%, #fdf4ff 100%)" },
  { id: "mystic-6", name: "Mint Emerald", value: "radial-gradient(circle at 50% 110%, #10b981 0%, #06b6d4 50%, #f0fdf4 100%)" },
  { id: "mystic-7", name: "Neon Swirl", value: "radial-gradient(circle at 70% 30%, #f43f5e 0%, #ec4899 40%, #fef2f2 100%)" },
  { id: "mystic-8", name: "Sunset Peach", value: "radial-gradient(circle at 50% 120%, #f97316 0%, #ec4899 50%, #fff7ed 100%)" },
  { id: "mystic-9", name: "Cotton Candy", value: "radial-gradient(circle at 30% 70%, #ec4899 0%, #f472b6 40%, #faf5ff 100%)" },
  { id: "mystic-10", name: "Magenta Dome", value: "radial-gradient(circle at 50% 110%, #e11d48 0%, #fb7185 50%, #fff1f2 100%)" },
  { id: "mystic-11", name: "Apricot Warm", value: "radial-gradient(circle at 50% 120%, #fb923c 0%, #f43f5e 50%, #fff7ed 100%)" },
  { id: "mystic-12", name: "Periwinkle Mist", value: "radial-gradient(circle at 50% 110%, #818cf8 0%, #c084fc 50%, #eff6ff 100%)" },
  { id: "mystic-13", name: "Lavender Glow", value: "radial-gradient(circle at 20% 80%, #a855f7 0%, #e879f9 50%, #faf5ff 100%)" },
  { id: "mystic-14", name: "Dawn Mint", value: "radial-gradient(circle at 50% 110%, #2dd4bf 0%, #38bdf8 50%, #f0fdfa 100%)" },
  { id: "mystic-15", name: "Amber Beam", value: "radial-gradient(circle at 20% 100%, #eab308 0%, #ca8a04 40%, #1c1917 100%)" },
  { id: "mystic-16", name: "Tahoe Mist", value: "radial-gradient(circle at 50% 120%, #0284c7 0%, #0f172a 70%, #020617 100%)" },
  { id: "mystic-17", name: "Aurora Boreal", value: "radial-gradient(ellipse at 50% 100%, #10b981 0%, #06b6d4 30%, #3b82f6 60%, #050b14 100%)" },
  { id: "mystic-18", name: "Sunset Prism", value: "radial-gradient(ellipse at 70% 120%, #ff007a 0%, #7928ca 40%, #ff4b4b 75%, #18001e 100%)" },
  { id: "mystic-19", name: "Glass Caustic", value: "radial-gradient(circle at 30% 20%, #e0e7ff 0%, #a5b4fc 35%, #6366f1 70%, #1e1b4b 100%)" },
  { id: "mystic-20", name: "Emerald Cyber", value: "radial-gradient(ellipse at 20% 110%, #00f2fe 0%, #4facfe 50%, #000c24 100%)" },
];

export const PRESET_DESKTOP = [
  {
    id: "desktop-sequoia-dawn",
    name: "Sequoia Dawn",
    value: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-sequoia-dark",
    name: "Sequoia Night",
    value: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-sonoma-horizon",
    name: "Sonoma Horizon",
    value: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-sonoma-hills",
    name: "Sonoma Hills",
    value: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-tahoe-aerial",
    name: "Lake Tahoe 4K",
    value: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-monterey-glow",
    name: "Monterey Canyon",
    value: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-ventura-amber",
    name: "Ventura Waves",
    value: "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-bigsur-dusk",
    name: "Big Sur Dusk",
    value: "url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-pro-display-abstract",
    name: "Pro Display XDR",
    value: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-studio-minimal",
    name: "Minimal Concrete",
    value: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-aurora-fjord",
    name: "Nordic Aurora",
    value: "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-tokyo-night",
    name: "Tokyo Cyber",
    value: "url('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-alps-snow",
    name: "Alps Summit",
    value: "url('https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-desert-dunes",
    name: "Sahara Sunset",
    value: "url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-fluid-chroma",
    name: "Fluid Chroma",
    value: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "desktop-iceland-moss",
    name: "Iceland Canyon",
    value: "url('https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=3840&q=95')",
    preview: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=300&q=80",
  },
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
    name: "Prism Crystal 4K",
    value: "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.75) 0%, transparent 45%), radial-gradient(circle at 82% 82%, rgba(147, 197, 253, 0.5) 0%, transparent 50%), linear-gradient(135deg, #e0e7ff 0%, #fae8ff 45%, #c7d2fe 100%)",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-1.jpg",
  },
  {
    id: "glass-2",
    name: "Frosted Silk 4K",
    value: "radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.85) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(243, 232, 255, 0.65) 0%, transparent 45%), linear-gradient(135deg, #fdfbf7 0%, #f3f4f6 50%, #e2e8f0 100%)",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-2.jpg",
  },
  {
    id: "glass-3",
    name: "Obsidian Mirror 4K",
    value: "radial-gradient(circle at 50% 10%, rgba(129, 140, 248, 0.4) 0%, transparent 55%), radial-gradient(circle at 85% 90%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), linear-gradient(135deg, #090d16 0%, #1e1b4b 55%, #030712 100%)",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-3.jpg",
  },
  {
    id: "glass-4",
    name: "Liquid Cyber 4K",
    value: "radial-gradient(circle at 90% 90%, rgba(244, 63, 94, 0.45) 0%, transparent 50%), radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.5) 0%, transparent 55%), linear-gradient(135deg, #09090b 0%, #18181b 50%, #030712 100%)",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-4.jpg",
  },
  {
    id: "glass-5",
    name: "Aurora Caustic 4K",
    value: "radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.45) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.4) 0%, transparent 50%), linear-gradient(135deg, #022c22 0%, #064e3b 50%, #011612 100%)",
    preview: "/shots-assets/display-assets_backgrounds_paper-glass_preview_glass-5.jpg",
  },
];

export const PRESET_TAHOE = [
  {
    id: "tahoe-day",
    name: "Tahoe Valley 4K",
    value: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-landscape-day.jpg",
  },
  {
    id: "tahoe-night",
    name: "Sierra Night 4K",
    value: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-landscape-night.jpg",
  },
  {
    id: "tahoe-light",
    name: "Alpine Mist 4K",
    value: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-light.jpg",
  },
  {
    id: "tahoe-dark-desk",
    name: "Pacific Horizon 4K",
    value: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat",
    preview: "/shots-assets/display-assets_backgrounds_desktop_preview_tahoe-dark.jpg",
  },
];


// Social media presets
export const SOCIAL_MEDIA_PRESETS: SocialMediaPreset[] = [
  {
    id: "twitter-post",
    name: "X / Twitter Post",
    platform: "twitter",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    badge: "1200×675",
  },
  {
    id: "twitter-header",
    name: "X / Twitter Header",
    platform: "twitter",
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
    badge: "1500×500",
  },
  {
    id: "instagram-square",
    name: "Instagram Square",
    platform: "instagram",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    badge: "1080×1080",
  },
  {
    id: "instagram-story",
    name: "Instagram Story / Reel",
    platform: "instagram",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    badge: "1080×1920",
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    platform: "linkedin",
    width: 1200,
    height: 627,
    aspectRatio: "16:9",
    badge: "1200×627",
  },
  {
    id: "dribbble-shot",
    name: "Dribbble Shot",
    platform: "dribbble",
    width: 1600,
    height: 1200,
    aspectRatio: "4:3",
    badge: "1600×1200",
  },
  {
    id: "youtube-thumb",
    name: "YouTube Thumbnail",
    platform: "youtube",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
    badge: "1280×720",
  },
  {
    id: "producthunt-gallery",
    name: "Product Hunt Gallery",
    platform: "producthunt",
    width: 1270,
    height: 760,
    aspectRatio: "16:10",
    badge: "1270×760",
  },
];


// Solid backgrounds
export const PRESET_SOLIDS = [
  { id: "solid-black", name: "Deep Black", value: "#000000" },
  { id: "solid-studio", name: "Studio Dark", value: "#111111" },
  { id: "solid-slate", name: "Cyber Slate", value: "#1e293b" },
  { id: "solid-indigo", name: "Neon Indigo", value: "#4338ca" },
  { id: "solid-emerald", name: "Emerald", value: "#065f46" },
  { id: "solid-white", name: "Clean White", value: "#ffffff" },
];


// Curated templates
export const CURATED_TEMPLATES: TemplatePreset[] = [
  {
    id: "saas-launch",
    name: "SaaS Launch Pro",
    tagline: "Minimal desktop window, floating 3D shapes & dark gradient",
    category: "marketing",
    badge: "Trending",
    config: {
      frameType: "minimal-desktop",
      backgroundType: "gradient",
      backgroundValue: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
      aspectRatio: "16:9",
      customWidth: 1920,
      customHeight: 1080,
      shapesSceneEnabled: true,
      shapesPack: "metal",
      shapesLayoutName: "layout-orbit",
      shadowMode: "adaptive",
      shadowOpacity: 45,
      watermark: true,
      annotationsEnabled: true,
      annotationHeadline: "Ship Faster with AI",
      annotationSubtitle: "The all-in-one developer workspace",
      annotationBadge: "v2.0 LAUNCH",
      annotationBadgeColor: "#6366f1",
      annotationPosition: "top",
      annotationAlign: "center",
    },
  },
  {
    id: "mobile-app-store",
    name: "Mobile App Showcase",
    tagline: "iPhone 17 on Tahoe Nature wallpaper with clean shadow",
    category: "mobile",
    badge: "Popular",
    config: {
      frameType: "iphone-17",
      backgroundType: "image",
      backgroundValue: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat",
      aspectRatio: "4:5",
      customWidth: 1080,
      customHeight: 1350,
      shapesSceneEnabled: false,
      shadowMode: "adaptive",
      shadowOpacity: 40,
      watermark: false,
      annotationsEnabled: true,
      annotationHeadline: "Crafted for iOS 18",
      annotationSubtitle: "Available now on the App Store",
      annotationBadge: "FEATURED",
      annotationBadgeColor: "#ec4899",
      annotationPosition: "bottom",
      annotationAlign: "center",
    },
  },
  {
    id: "twitter-release",
    name: "X / Twitter Announcement",
    tagline: "High-contrast browser mockup with Shots Official gradient",
    category: "social",
    config: {
      frameType: "browser",
      backgroundType: "gradient",
      backgroundValue: "linear-gradient(140deg, rgb(255, 100, 50) 12.8%, rgb(255, 0, 101) 43.52%, rgb(123, 46, 255) 84.34%)",
      aspectRatio: "16:9",
      customWidth: 1920,
      customHeight: 1080,
      shapesSceneEnabled: false,
      shadowMode: "spread",
      shadowOpacity: 50,
      watermark: true,
      annotationsEnabled: false,
    },
  },
  {
    id: "story-reel-viral",
    name: "Instagram Story & Reel",
    tagline: "Vertical 9:16 iPhone 17 on Paper Glass 4K",
    category: "social",
    badge: "Story",
    config: {
      frameType: "iphone-17",
      backgroundType: "image",
      backgroundValue: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 60%), linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
      aspectRatio: "9:16",
      customWidth: 1080,
      customHeight: 1920,
      shapesSceneEnabled: true,
      shapesPack: "glass-pink",
      shapesLayoutName: "layout-cascade",
      shadowMode: "adaptive",
      shadowOpacity: 45,
      watermark: false,
      annotationsEnabled: true,
      annotationHeadline: "Tap To Learn More",
      annotationSubtitle: "Swipe up or check link in bio",
      annotationBadge: "NEW DROP",
      annotationBadgeColor: "#a855f7",
      annotationPosition: "bottom",
      annotationAlign: "center",
    },
  },
  {
    id: "dribbble-shot",
    name: "Dribbble Design Case",
    tagline: "iPad Pro 13 on Pastel Dream gradient in 4:3 format",
    category: "marketing",
    config: {
      frameType: "ipad-pro",
      backgroundType: "gradient",
      backgroundValue: "linear-gradient(135deg, rgb(238, 221, 243), rgb(238, 146, 177), rgb(99, 48, 180))",
      aspectRatio: "4:3",
      customWidth: 1600,
      customHeight: 1200,
      shapesSceneEnabled: false,
      shadowMode: "spread",
      shadowOpacity: 35,
      watermark: false,
      annotationsEnabled: false,
    },
  },
  {
    id: "duo-product-hunt",
    name: "Product Hunt Duo",
    tagline: "Two devices side-by-side with Sunset Glow and Badge",
    category: "marketing",
    badge: "Duo Mode",
    config: {
      frameType: "iphone-17",
      mockupMode: "duo",
      duoGap: 28,
      backgroundType: "gradient",
      backgroundValue: "linear-gradient(140deg, rgb(244, 229, 240), rgb(229, 54, 171), rgb(92, 3, 188), rgb(14, 7, 37))",
      aspectRatio: "16:9",
      customWidth: 1920,
      customHeight: 1080,
      shapesSceneEnabled: false,
      shadowMode: "adaptive",
      shadowOpacity: 45,
      watermark: true,
      annotationsEnabled: true,
      annotationHeadline: "Product of the Day #1",
      annotationSubtitle: "Join 10,000+ creators building with Shots",
      annotationBadge: "LIVE ON PRODUCT HUNT",
      annotationBadgeColor: "#ea580c",
      annotationPosition: "top",
      annotationAlign: "center",
    },
  },
  {
    id: "minimal-dark-studio",
    name: "Minimal Studio Dark",
    tagline: "Solid black matte background, pure focus on product",
    category: "minimal",
    config: {
      frameType: "iphone-16-pro",
      backgroundType: "solid",
      backgroundValue: "#000000",
      aspectRatio: "1:1",
      customWidth: 1080,
      customHeight: 1080,
      shapesSceneEnabled: false,
      shadowMode: "none",
      watermark: false,
      annotationsEnabled: false,
    },
  },
  {
    id: "macbook-tahoe-desk",
    name: "MacBook Pacific Horizon",
    tagline: "MacBook Pro 16 on 4K Pacific Horizon with natural depth",
    category: "minimal",
    config: {
      frameType: "macbook",
      backgroundType: "image",
      backgroundValue: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat",
      aspectRatio: "16:10",
      customWidth: 1920,
      customHeight: 1200,
      shapesSceneEnabled: false,
      shadowMode: "adaptive",
      shadowOpacity: 40,
      watermark: true,
      annotationsEnabled: false,
    },
  },
];

