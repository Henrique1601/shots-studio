"use client";

import { useCanvasOrbit } from "@/hooks/useCanvasOrbit";
import { CanvasOverlays } from "./canvas/CanvasOverlays";

import React, { useRef, useState, useEffect } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { SHAPES_LAYOUTS, DEVICE_SPECS, parseAspectRatio } from "@/types/mockup";
import { Plus, RotateCcw, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, type Transition } from "framer-motion";
import { CodeSnippetFrame } from "./CodeSnippetFrame";

export const MockupCanvas = () => {
  const {
    config,
    imageUrl,
    imageDimensions,
    activeSlideIndex,
    setImageUrl,
    setSecondaryImageUrl,
    setTertiaryImageUrl,
    setImageDimensions,
    updateConfig,
    showToast,
  } = useMockupStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const tertiaryFileInputRef = useRef<HTMLInputElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [wrapperSize, setWrapperSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Canvas 3D Orbit & Tilt Hook
  const {
    isOrbiting,
    handlePointerDownOrbit,
    handlePointerMoveOrbit,
    handlePointerUpOrbit,
    handleDoubleClickCanvas,
  } = useCanvasOrbit();

  useEffect(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setWrapperSize({ width: rect.width, height: rect.height });
      }
    };

    measure();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setWrapperSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    resizeObserver.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const deviceSpec = DEVICE_SPECS[config.frameType] || DEVICE_SPECS.screenshot;

  // Exact 4-layer box-shadow formula from Shots.so for rectangular frames
  const getShotsShadow = () => {
    if (config.shadowMode === "none") return "none";
    const opacity = (config.shadowOpacity / 100) * 0.4;
    switch (config.shadowMode) {
      case "spread":
        return `rgba(0, 0, 0, ${opacity * 1.5}) 0px 25px 50px -12px, rgba(0, 0, 0, ${opacity}) 0px 0px 30px 0px`;
      case "hug":
        return `rgba(0, 0, 0, ${opacity * 1.8}) 0px 8px 24px -4px, rgba(0, 0, 0, ${opacity}) 0px 2px 6px 0px`;
      case "adaptive":
      default:
        return `rgba(0, 0, 0, ${opacity}) 0px 10.472px 15.708px -23.8px, rgba(0, 0, 0, ${opacity}) 0px 31.416px 47.124px -23.8px, rgba(0, 0, 0, ${opacity}) 0px 62.832px 94.2481px -23.8px, rgba(0, 0, 0, ${opacity}) 0px 104.72px 157.08px -23.8px`;
    }
  };

  // Realistic alpha-hugging drop-shadow for transparent PNG physical device mockups (prevents square box shadows)
  const getDeviceShadowFilter = () => {
    if (config.shadowMode === "none") return undefined;
    const opacity = (config.shadowOpacity / 100) * 0.45;
    switch (config.shadowMode) {
      case "spread":
        return `drop-shadow(0px 24px 38px rgba(0, 0, 0, ${opacity * 1.5})) drop-shadow(0px 6px 14px rgba(0, 0, 0, ${opacity * 0.9}))`;
      case "hug":
        return `drop-shadow(0px 10px 18px rgba(0, 0, 0, ${opacity * 1.7}))`;
      case "adaptive":
      default:
        return `drop-shadow(0px 12px 24px rgba(0, 0, 0, ${opacity * 0.9})) drop-shadow(0px 32px 54px rgba(0, 0, 0, ${opacity * 1.25}))`;
    }
  };

  // Specular screen reflection glare gradient
  const getGlareGradient = () => {
    switch (config.lightPreset) {
      case "soft-studio":
        return "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 70%)";
      case "top-left":
        return "radial-gradient(ellipse at 15% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0) 75%)";
      case "top-right":
        return "radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0) 75%)";
      case "dramatic":
        return "linear-gradient(110deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.25) 25%, rgba(0,0,0,0.5) 50%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0) 100%)";
      case "none":
      default:
        return "none";
    }
  };

  // Physical device chassis finish tint filter
  const getDeviceFinishFilter = () => {
    switch (config.deviceColor) {
      case "space-black":
        return "brightness(0.7) contrast(1.15)";
      case "silver":
        return "brightness(1.22) contrast(1.05)";
      case "natural-titanium":
        return "sepia(0.25) hue-rotate(-20deg) brightness(1.08)";
      case "desert-titanium":
        return "sepia(0.4) hue-rotate(5deg) saturate(1.25) brightness(1.1)";
      case "default":
      default:
        return undefined;
    }
  };

  // Google Pixel 9 Pro titanium color finish palette
  const getPixelFrameColors = () => {
    switch (config.deviceColor) {
      case "space-black":
        return {
          border: "#18181b",
          shadow: "inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 0 2px #09090b",
          button: "#3f3f46",
        };
      case "silver":
        return {
          border: "#e4e4e7",
          shadow: "inset 0 0 0 1px rgba(255,255,255,0.8), 0 0 0 2px #71717a",
          button: "#a1a1aa",
        };
      case "natural-titanium":
        return {
          border: "#a8a29e",
          shadow: "inset 0 0 0 1px rgba(255,255,255,0.3), 0 0 0 2px #44403c",
          button: "#78716c",
        };
      case "desert-titanium":
        return {
          border: "#d4a373",
          shadow: "inset 0 0 0 1px rgba(255,255,255,0.4), 0 0 0 2px #8a5a36",
          button: "#b07d58",
        };
      case "default":
      default:
        return {
          border: "#27272a",
          shadow: "inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 0 2px #18181b",
          button: "#52525b",
        };
    }
  };

  const processUploadedFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageUrl(url);
    };
    img.src = url;
  };

  const processSecondaryFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSecondaryImageUrl(url);
    showToast("Segunda imagem carregada com sucesso! 📱", "success");
  };

  const processTertiaryFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setTertiaryImageUrl(url);
    showToast("Terceira imagem carregada com sucesso! 📱", "success");
  };

  const handlePrimarySlotClick = () => {
    fileInputRef.current?.click();
  };

  const handleSecondarySlotClick = () => {
    secondaryFileInputRef.current?.click();
  };

  const handleTertiarySlotClick = () => {
    tertiaryFileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processUploadedFile(file);
    }
  };

  // Determine frame aspect ratio via unified parser
  const { ratio: frameRatio } = parseAspectRatio(
    config.aspectRatio,
    config.customWidth,
    config.customHeight
  );

  // Determine mockup natural aspect ratio
  const getMockupRatio = () => {
    if (deviceSpec.isDevice) {
      const [w, h] = deviceSpec.aspectRatio.split("/").map((s) => Number(s.trim()));
      if (w && h) return w / h;
      return 1;
    }
    if (imageDimensions && imageDimensions.width && imageDimensions.height) {
      return imageDimensions.width / imageDimensions.height;
    }
    return config.frameType === "browser" ? 16 / 10 : 4 / 3;
  };

  const mockupRatio = getMockupRatio();
  const isDuo = config.mockupMode === "duo";
  const isTrio = config.mockupMode === "trio";
  const effectiveMockupRatio = isTrio
    ? mockupRatio * 3 + 0.25
    : isDuo
    ? mockupRatio * 2 + 0.15
    : mockupRatio;

  // Intelligent Auto-Contain:
  // If mockup is taller than frame, clamp height. If wider, clamp width.
  const isMockupTallerThanFrame = effectiveMockupRatio < frameRatio;

  // Exact contained canvas dimensions bounded by available workspace
  const getCanvasDimensions = () => {
    if (!wrapperSize.width || !wrapperSize.height) {
      return {
        aspectRatio: `${frameRatio}`,
        maxWidth: "92%",
        maxHeight: "92%",
        width: frameRatio >= 1 ? "100%" : "auto",
        height: frameRatio < 1 ? "100%" : "auto",
      };
    }

    const availWidth = wrapperSize.width * 0.92;
    const availHeight = wrapperSize.height * 0.92;
    const availRatio = availWidth / availHeight;

    let targetWidth: number;
    let targetHeight: number;

    if (frameRatio > availRatio) {
      // Constrained by width
      targetWidth = availWidth;
      targetHeight = availWidth / frameRatio;
    } else {
      // Constrained by height
      targetHeight = availHeight;
      targetWidth = availHeight * frameRatio;
    }

    return {
      width: `${Math.round(targetWidth)}px`,
      height: `${Math.round(targetHeight)}px`,
      aspectRatio: `${frameRatio}`,
      maxWidth: "96%",
      maxHeight: "96%",
    };
  };

  const currentShapesLayout =
    SHAPES_LAYOUTS.find((l) => l.name === config.shapesLayoutName) ||
    SHAPES_LAYOUTS[0];

  // Dynamic motion presets for live playback (Float, Turntable, Breathe, Orbit)
  const getMotionAnimation = (): {
    animate: Record<string, string | number | number[]>;
    transition?: Transition;
  } => {
    if (!config.isAnimationPlaying || config.animationPreset === "none") {
      return {
        animate: {
          x: 0,
          y: 0,
          rotateX: config.tiltX,
          rotateY: config.tiltY,
          rotateZ: config.tiltZ,
          scale: (config.zoom / 100) * (config.scale || 1),
        },
        transition: { type: "spring", stiffness: 320, damping: 28 },
      };
    }

    const dur = config.animationDuration || 5;

    switch (config.animationPreset) {
      case "float":
        return {
          animate: {
            y: [-12, 12, -12],
            rotateZ: [config.tiltZ - 2, config.tiltZ + 2, config.tiltZ - 2],
            rotateX: config.tiltX,
            rotateY: config.tiltY,
            scale: config.zoom / 100,
          },
          transition: {
            repeat: Infinity,
            duration: dur,
            ease: "easeInOut",
          },
        };
      case "turntable":
        return {
          animate: {
            rotateY: [config.tiltY - 24, config.tiltY + 24, config.tiltY - 24],
            rotateX: config.tiltX,
            rotateZ: config.tiltZ,
            scale: config.zoom / 100,
            y: 0,
          },
          transition: {
            repeat: Infinity,
            duration: dur,
            ease: "easeInOut",
          },
        };
      case "pulse":
        return {
          animate: {
            scale: [
              config.zoom / 100,
              (config.zoom / 100) * 1.08,
              config.zoom / 100,
            ],
            rotateX: config.tiltX,
            rotateY: config.tiltY,
            rotateZ: config.tiltZ,
            y: 0,
          },
          transition: {
            repeat: Infinity,
            duration: dur,
            ease: "easeInOut",
          },
        };
      case "orbit":
        return {
          animate: {
            rotateX: [config.tiltX - 8, config.tiltX + 8, config.tiltX - 8],
            rotateY: [config.tiltY - 14, config.tiltY + 14, config.tiltY - 14],
            y: [-8, 8, -8],
            rotateZ: config.tiltZ,
            scale: config.zoom / 100,
          },
          transition: {
            repeat: Infinity,
            duration: dur,
            ease: "easeInOut",
          },
        };
      default:
        return {
          animate: {
            x: 0,
            y: 0,
            rotateX: config.tiltX,
            rotateY: config.tiltY,
            rotateZ: config.tiltZ,
            scale: config.zoom / 100,
          },
        };
    }
  };

  // Reusable renderer for physical devices, code snippet or browser/screenshot frames
  const renderMockupItem = (
    currentImg: string | null,
    onSlotClick: () => void,
    isSecondary = false
  ) => {
    // 1. Ray.so / Carbon Code Snippet Studio
    if (config.frameType === "code") {
      return (
        <div
          style={{
            boxShadow: getShotsShadow(),
            borderRadius: `${config.borderRadius}px`,
            aspectRatio: `${mockupRatio}`,
          }}
          className="w-full h-full relative flex items-center justify-center transition-all duration-300"
        >
          <CodeSnippetFrame
            code={config.codeSnippet || ""}
            language={config.codeLanguage}
            theme={config.codeTheme}
            showLineNumbers={config.codeShowLineNumbers}
            title={config.codeTitle}
            borderRadius={config.borderRadius}
          />
        </div>
      );
    }

    // 2. Physical Device Mockups (iPhone, MacBook, iPad, Watch, Pixel 9 Pro, Ultrawide Monitor, iMac 24, Foldable)
    if (deviceSpec.isDevice) {
      const isPixel = config.frameType === "pixel-9-pro";
      const isUltrawide = config.frameType === "ultrawide-monitor";
      const isIMac = config.frameType === "imac-24";
      const isFoldable = config.frameType === "foldable-phone";
      const pixelColors = isPixel ? getPixelFrameColors() : null;

      return (
        <div
          style={{
            aspectRatio: deviceSpec.aspectRatio,
            filter: getDeviceShadowFilter(),
          }}
          className="w-full h-full relative flex items-center justify-center transition-all duration-300"
        >
          {/* Ultrawide Monitor Desktop Stand (placed behind monitor at z-0) */}
          {isUltrawide && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
              {/* Stand Stem / Neck with metallic gradient & cable grommet accent */}
              <div className="w-16 h-10 bg-gradient-to-b from-[#25262c] to-[#141518] border-x border-white/10 shadow-lg flex items-center justify-center">
                <div className="w-6 h-3 rounded-full bg-[#0a0a0c] border border-white/10 shadow-inner" />
              </div>
              {/* Heavy-duty weighted desktop base */}
              <div className="w-56 h-3 rounded-md bg-gradient-to-b from-[#2a2b30] via-[#1e1f23] to-[#131416] border border-white/15 shadow-[0_12px_24px_rgba(0,0,0,0.6)] flex items-center justify-center">
                <div className="w-52 h-[1px] bg-white/15" />
              </div>
            </div>
          )}

          {/* iMac 24" M4 Desktop Stand (placed behind chassis at z-0) */}
          {isIMac && (
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
              {/* Stand Stem */}
              <div className="w-14 h-12 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] border-x border-black/5 shadow-md" />
              {/* Sleek Aluminum Rectangular Foot */}
              <div className="w-44 h-2.5 rounded-sm bg-gradient-to-b from-[#f8fafc] to-[#cbd5e1] border border-white/60 shadow-[0_12px_24px_rgba(0,0,0,0.5)]" />
            </div>
          )}

          {/* Opaque Chassis Body (Solid 100% background to completely prevent canvas gradient bleed-through) */}
          {isPixel ? (
            <div
              className="absolute inset-0 rounded-[48px] bg-[#0c0d0f] pointer-events-none z-5 shadow-2xl"
              style={{ background: "#0c0d0f" }}
            />
          ) : isUltrawide ? (
            <div
              className="absolute inset-0 rounded-xl bg-[#0c0d10] pointer-events-none z-5 shadow-2xl"
              style={{ background: "#0c0d10" }}
            />
          ) : isIMac ? (
            <div
              className="absolute inset-0 rounded-2xl bg-[#0c0d10] pointer-events-none z-5 shadow-2xl border-[3.5px] border-[#e2e8f0]"
              style={{ background: "#0c0d10" }}
            />
          ) : isFoldable ? (
            <div
              className="absolute inset-0 rounded-[28px] bg-[#090a0d] pointer-events-none z-5 shadow-2xl"
              style={{ background: "#090a0d" }}
            />
          ) : (
            /* Opaque black backing plate for PNG-based devices (iPhone, iPad, Watch, MacBook) */
            <div
              className="absolute bg-[#020202] pointer-events-none"
              style={{
                left: deviceSpec.screenBounds?.left ?? "0%",
                top: deviceSpec.screenBounds?.top ?? "0%",
                width: deviceSpec.screenBounds?.width ?? "100%",
                height: deviceSpec.screenBounds?.height ?? "100%",
                borderRadius: deviceSpec.containerClass?.includes("iphone")
                  ? "48px"
                  : deviceSpec.containerClass?.includes("ipad")
                  ? "24px"
                  : deviceSpec.containerClass?.includes("watch")
                  ? "36px"
                  : "4px",
                transform: "scale(1.02)",
                transformOrigin: "center",
                zIndex: 5,
              }}
            />
          )}

          {/* Calibrated Screen Mask & Media Container (under bezel cutout) */}
          <div
            style={{
              position: "absolute",
              left: deviceSpec.screenBounds?.left ?? "0%",
              top: deviceSpec.screenBounds?.top ?? "0%",
              width: deviceSpec.screenBounds?.width ?? "100%",
              height: deviceSpec.screenBounds?.height ?? "100%",
              borderRadius: isPixel
                ? "36px"
                : isUltrawide
                ? "6px"
                : isIMac
                ? "4px"
                : isFoldable
                ? "20px"
                : undefined,
              maskImage: deviceSpec.maskSvg ? `url("${deviceSpec.maskSvg}")` : undefined,
              WebkitMaskImage: deviceSpec.maskSvg ? `url("${deviceSpec.maskSvg}")` : undefined,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
            className="overflow-hidden bg-[#0a0a0a] flex items-center justify-center cursor-pointer z-10"
            onClick={onSlotClick}
          >
            {currentImg ? (
              <img
                src={currentImg}
                alt={isSecondary ? "Secondary device media" : "Uploaded media"}
                style={{
                  objectFit: config.imageFit || "cover",
                  objectPosition: `50% ${config.imagePositionY ?? 50}%`,
                }}
                className="w-full h-full block select-none pointer-events-none transition-all duration-150"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-white/20 shadow-md">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs font-semibold text-white tracking-tight mb-0.5">
                  {isSecondary ? "2nd Device Media" : "Drop or Paste"}
                </h3>
                <p className="text-[10px] text-neutral-400">
                  {isSecondary ? "Click to upload" : "Images & Videos"}
                </p>
              </div>
            )}

            {/* Specular Screen Glare / Reflection Layer */}
            {config.lightPreset !== "none" && (
              <div
                className="absolute inset-0 pointer-events-none z-15 mix-blend-screen transition-opacity duration-200"
                style={{
                  background: getGlareGradient(),
                  opacity: (config.lightIntensity ?? 35) / 100,
                }}
              />
            )}

            {/* Foldable Phone Center Crease Subtle Shadow */}
            {isFoldable && (
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 pointer-events-none z-15 bg-gradient-to-r from-transparent via-black/30 to-transparent" />
            )}

            {/* Pixel 9 Pro Centered Punch-Hole Camera with realistic lens reflections */}
            {isPixel && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-neutral-800 z-30 pointer-events-none shadow-sm flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a1224] ring-1 ring-white/10 flex items-center justify-center shadow-inner">
                  <div className="w-1 h-1 rounded-full bg-white/40 -translate-x-[0.5px] -translate-y-[0.5px]" />
                </div>
              </div>
            )}

            {/* Foldable Phone Punch-Hole Camera on right screen */}
            {isFoldable && (
              <div className="absolute top-3 right-[22%] w-3 h-3 rounded-full bg-black border border-neutral-800 z-30 pointer-events-none shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0a1224]" />
              </div>
            )}
          </div>

          {/* Pixel 9 Pro Physical Hardware Overlays (Titanium Band, Buttons, Antenna & Ear-piece) */}
          {isPixel && pixelColors && (
            <>
              {/* Outer Metallic Bezel Band */}
              <div
                className="absolute inset-0 rounded-[48px] pointer-events-none z-20 border-[9px] shadow-sm transition-all duration-300"
                style={{
                  borderColor: pixelColors.border,
                  boxShadow: pixelColors.shadow,
                }}
              />
              {/* Top Ear-piece Speaker Grille */}
              <div className="absolute top-[1.2%] left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full bg-[#18191c] border-b border-white/10 z-25 pointer-events-none" />
              {/* Right Side Physical Buttons: Power & Volume Rocker */}
              <div
                className="absolute -right-[3px] top-[18%] w-[3px] h-[30px] rounded-r-sm pointer-events-none z-20 shadow-sm"
                style={{ background: pixelColors.button }}
              />
              <div
                className="absolute -right-[3px] top-[26%] w-[3px] h-[58px] rounded-r-sm pointer-events-none z-20 shadow-sm"
                style={{ background: pixelColors.button }}
              />
            </>
          )}

          {/* Ultrawide Monitor Modern 3-Side Micro-Bezel & Brushed Aluminum Bottom Chin */}
          {isUltrawide && (
            <div className="absolute inset-0 rounded-xl pointer-events-none z-20 border-[5px] border-[#18191c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-end">
              {/* Brushed Aluminum Bottom Chin Bar */}
              <div className="h-5 bg-gradient-to-r from-[#17181c] via-[#212328] to-[#17181c] border-t border-white/10 flex items-center justify-between px-5 rounded-b-[7px]">
                {/* Subtle brand pip / accent */}
                <div className="w-4 h-1 rounded-full bg-white/20" />
                {/* Power status LED indicator with soft glow */}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
            </div>
          )}

          {/* iMac 24" M4 Modern Frame & Signature Pastel Chin */}
          {isIMac && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 flex flex-col justify-between">
              {/* Top Center Stage 12MP Camera Pip */}
              <div className="w-full h-5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black ring-1 ring-white/20 shadow-sm flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-[#1e293b]" />
                </div>
              </div>
              {/* Signature Pastel / Silver Bottom Chin */}
              <div className="h-[25.2%] bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] rounded-b-[12px] border-t border-black/10 flex items-center justify-center shadow-inner">
                {/* Minimalist Apple Logo Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/40 shadow-sm" />
              </div>
            </div>
          )}

          {/* Foldable Phone Hardware Frame & Spine Notches */}
          {isFoldable && (
            <>
              {/* Outer chassis border */}
              <div className="absolute inset-0 rounded-[28px] pointer-events-none z-20 border-[7px] border-[#22242a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]" />
              {/* Top & Bottom Hinge Notches */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-b-sm bg-neutral-600 z-25 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-t-sm bg-neutral-600 z-25 pointer-events-none" />
            </>
          )}

          {/* 3. Device Bezel Overlay (PNG with transparent screen cutout & Finish Tint) */}
          {deviceSpec.deviceImg && (
            <img
              src={deviceSpec.deviceImg}
              alt={deviceSpec.name}
              style={{
                filter: getDeviceFinishFilter(),
              }}
              className="absolute inset-0 w-full h-full object-fill block select-none pointer-events-none z-20 transition-all duration-300"
            />
          )}
        </div>
      );
    }

    /* SCREENSHOT / BROWSER MOCKUP RENDERER */
    return (
      <div
        style={{
          boxShadow: getShotsShadow(),
          borderRadius: `${config.borderRadius}px`,
          aspectRatio: `${mockupRatio}`,
        }}
        className={cn(
          "w-full h-full overflow-hidden relative flex flex-col items-center justify-center transition-all duration-300",
          config.frameStyle === "glass-dark" && "bg-neutral-900/60 backdrop-blur-xl border border-white/20",
          config.frameStyle === "glass-light" && "bg-white/40 backdrop-blur-xl border border-white/40",
          config.frameStyle === "liquid-glass" && "bg-gradient-to-br from-white/25 via-white/5 to-white/10 border border-white/30 backdrop-blur-2xl",
          config.frameStyle === "inset-light" && "bg-white border border-neutral-300 shadow-inner",
          config.frameStyle === "inset-dark" && "bg-[#111111] border border-neutral-800 shadow-inner",
          config.frameStyle === "outline" && "border-2 border-white/80 bg-black/40",
          config.frameStyle === "border" && "border-4 border-black bg-[#161616]",
          config.frameStyle === "retro" && "border-8 border-[#222222] ring-1 ring-white/10 bg-[#e8e8ed] shadow-2xl",
          config.frameStyle === "card" && "bg-white p-2.5 sm:p-3.5 shadow-2xl border border-neutral-200",
          config.frameStyle === "stack" && "bg-white/95 border border-white/40 shadow-2xl relative",
          config.frameStyle === "stack-2" && "bg-white/95 border border-white/40 shadow-2xl relative",
          config.frameStyle === "default" && "bg-[#0d0d0d]"
        )}
      >
        {/* Browser & Minimal Desktop Header */}
        {(config.frameType === "browser" || config.frameType === "minimal-desktop") && (
          <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-900/90 border-b border-white/10 shrink-0 select-none">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
            </div>
            <div className="h-5 px-3 rounded-md bg-white/5 border border-white/5 text-[9px] text-neutral-300 flex items-center justify-center font-mono max-w-[220px] truncate">
              {config.browserUrl || (config.frameType === "minimal-desktop" ? "Studio Workspace" : "shots.so/editor")}
            </div>
            <div className="w-8" />
          </div>
        )}

        {/* Stacked Underlay Cards for Stack & Stack-2 Styles */}
        {config.frameStyle === "stack" && (
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute inset-0 translate-y-3 translate-x-3 rounded-[inherit] bg-white/20 border border-white/10 shadow-lg" />
            <div className="absolute inset-0 translate-y-1.5 translate-x-1.5 rounded-[inherit] bg-white/40 border border-white/20 shadow-md" />
          </div>
        )}
        {config.frameStyle === "stack-2" && (
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute inset-0 rotate-3 rounded-[inherit] bg-white/25 border border-white/15 shadow-lg" />
            <div className="absolute inset-0 -rotate-2 rounded-[inherit] bg-white/45 border border-white/25 shadow-md" />
          </div>
        )}

        {/* Media Content */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer bg-[#0d0d0d] overflow-hidden"
          onClick={onSlotClick}
        >
          {currentImg ? (
            <img
              src={currentImg}
              alt={isSecondary ? "Secondary mockup" : "Uploaded mockup"}
              style={{
                objectFit: config.imageFit || "cover",
                objectPosition: `50% ${config.imagePositionY ?? 50}%`,
              }}
              className="w-full h-full block select-none transition-all duration-150"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center group">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20 shadow-md">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight mb-1">
                {isSecondary ? "2nd Media Slot" : "Drop or Paste"}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isSecondary ? "Click to upload" : "Images & Videos"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };


  // Dynamic CSS filter string for image grading
  const getImageFilterStyle = (): React.CSSProperties => {
    const filters: string[] = [];
    if (config.brightness !== undefined && config.brightness !== 100) {
      filters.push(`brightness(${config.brightness}%)`);
    }
    if (config.contrast !== undefined && config.contrast !== 100) {
      filters.push(`contrast(${config.contrast}%)`);
    }
    if (config.saturation !== undefined && config.saturation !== 100) {
      filters.push(`saturate(${config.saturation}%)`);
    }
    if (config.grayscale) {
      filters.push("grayscale(100%)");
    }
    if (config.sepia) {
      filters.push("sepia(100%)");
    }
    if (config.hueRotate && config.hueRotate !== 0) {
      filters.push(`hue-rotate(${config.hueRotate}deg)`);
    }
    return filters.length ? { filter: filters.join(" ") } : {};
  };

  const getCanvasBackgroundStyle = (): React.CSSProperties => {
    if (config.backgroundType === "transparent") {
      return {
        backgroundImage:
          "repeating-conic-gradient(#222222 0% 25%, #181818 0% 50%)",
        backgroundSize: "20px 20px",
        backgroundPosition: "50%",
      };
    }
    const bg = config.backgroundValue || "#000000";
    if (bg.includes("gradient(")) {
      return {
        background: bg,
      };
    }
    if (
      config.backgroundType === "image" ||
      bg.startsWith("url(") ||
      bg.startsWith("http://") ||
      bg.startsWith("https://") ||
      bg.startsWith("/") ||
      bg.startsWith("data:")
    ) {
      const cleanUrl = bg.startsWith("url(")
        ? bg.replace(/^url\(['"]?/, "").replace(/['"]?\).*$/, "")
        : bg;
      return {
        backgroundImage: `url('${cleanUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    return {
      backgroundColor: bg,
    };
  };

  return (
    <div
      ref={canvasWrapperRef}
      className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-hidden bg-black relative select-none w-full h-full"
    >
      {/* Outer Remotion Canvas Frame */}
      <div
        id="mockup-export-container"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onPointerDown={handlePointerDownOrbit}
        onPointerMove={handlePointerMoveOrbit}
        onPointerUp={handlePointerUpOrbit}
        onDoubleClick={handleDoubleClickCanvas}
        style={{
          padding: `${config.padding}px`,
          ...getCanvasDimensions(),
          boxSizing: "border-box",
        }}
        className={cn(
          "rounded-2xl transition-all duration-300 flex items-center justify-center shadow-2xl relative overflow-hidden bg-black",
          isOrbiting ? "cursor-grabbing select-none" : "cursor-grab",
          isDragging && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-black"
        )}
      >
        {/* Studio Background Layer with Depth-of-Field Bokeh Blur */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            ...getCanvasBackgroundStyle(),
            filter: (config.backgroundBlur ?? 0) > 0 ? `blur(${config.backgroundBlur}px)` : undefined,
            transform: (config.backgroundBlur ?? 0) > 0 ? "scale(1.08)" : undefined,
            transformOrigin: "center",
          }}
        />

        {/* Film Grain & Analogue Texture Overlay */}
        {(config.noiseOverlay || (config.grainIntensity ?? 0) > 0) && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-10 transition-opacity duration-200"
            style={{
              backgroundImage: `url('/shots-assets/noise.svg')`,
              opacity: (config.grainIntensity ?? 0) > 0 ? config.grainIntensity / 100 : 0.25,
            }}
          />
        )}

        {/* Canvas Visual Overlays: VFX, Lighting, Annotations, Watermarks, 3D Shapes */}
        <CanvasOverlays config={config} currentShapesLayout={currentShapesLayout} />

        {/* 3D Spatial Container with Auto-Contain & Smooth Spring Physics */}
        {config.showMockup && (
          <motion.div
            key={`slide-view-${activeSlideIndex}`}
            {...getMotionAnimation()}
            style={{
              width: isMockupTallerThanFrame
                ? "auto"
                : isTrio
                ? "94%"
                : isDuo
                ? "86%"
                : "78%",
              height: isMockupTallerThanFrame
                ? isTrio
                  ? "88%"
                  : isDuo
                  ? "84%"
                  : "78%"
                : "auto",
              aspectRatio: `${effectiveMockupRatio}`,
              maxWidth: "96%",
              maxHeight: "94%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
              perspective: "150em",
              transformOrigin: "center",
            }}
          >
            {isTrio ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ gap: `${config.duoGap ?? 24}px` }}
              >
                {/* 1. Left Device */}
                <div
                  className="h-full flex items-center justify-center transition-transform duration-300 flex-1 max-w-[34%]"
                  style={{
                    aspectRatio: `${mockupRatio}`,
                    transform:
                      config.animationPreset === "none"
                        ? "rotateZ(-3deg) translateY(10px) scale(0.96)"
                        : undefined,
                  }}
                >
                  {renderMockupItem(
                    imageUrl,
                    handlePrimarySlotClick,
                    false
                  )}
                </div>

                {/* 2. Center Device (Elevated) */}
                <div
                  className="h-full flex items-center justify-center transition-transform duration-300 flex-1 max-w-[34%] z-15"
                  style={{
                    aspectRatio: `${mockupRatio}`,
                    transform:
                      config.animationPreset === "none"
                        ? "translateY(-4px) scale(1.02)"
                        : undefined,
                  }}
                >
                  {renderMockupItem(
                    config.secondaryImageUrl || imageUrl,
                    handleSecondarySlotClick,
                    true
                  )}
                </div>

                {/* 3. Right Device */}
                <div
                  className="h-full flex items-center justify-center transition-transform duration-300 flex-1 max-w-[34%]"
                  style={{
                    aspectRatio: `${mockupRatio}`,
                    transform:
                      config.animationPreset === "none"
                        ? "rotateZ(3deg) translateY(10px) scale(0.96)"
                        : undefined,
                  }}
                >
                  {renderMockupItem(
                    config.tertiaryImageUrl || imageUrl,
                    handleTertiarySlotClick,
                    true
                  )}
                </div>
              </div>
            ) : isDuo ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ gap: `${config.duoGap ?? 32}px` }}
              >
                {/* Left Device / Media */}
                <div
                  className="h-full flex items-center justify-center transition-transform duration-300 flex-1 max-w-[50%]"
                  style={{
                    aspectRatio: `${mockupRatio}`,
                    transform:
                      config.animationPreset === "none"
                        ? "rotateZ(-2deg) translateY(6px)"
                        : undefined,
                  }}
                >
                  {renderMockupItem(imageUrl, handlePrimarySlotClick, false)}
                </div>

                {/* Right Device / Media */}
                <div
                  className="h-full flex items-center justify-center transition-transform duration-300 flex-1 max-w-[50%]"
                  style={{
                    aspectRatio: `${mockupRatio}`,
                    transform:
                      config.animationPreset === "none"
                        ? "rotateZ(2deg) translateY(-6px)"
                        : undefined,
                  }}
                >
                  {renderMockupItem(
                    config.secondaryImageUrl || imageUrl,
                    handleSecondarySlotClick,
                    true
                  )}
                </div>
              </div>
            ) : (
              renderMockupItem(imageUrl, handlePrimarySlotClick, false)
            )}
          </motion.div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processUploadedFile(f);
          }}
        />
        <input
          ref={secondaryFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processSecondaryFile(f);
          }}
        />
        <input
          ref={tertiaryFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processTertiaryFile(f);
          }}
        />
      </div>

      {/* Floating 3D Orbit Helper / Instructions */}
      <div className="absolute bottom-5 left-5 z-40 hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-900/85 border border-white/10 text-[11px] text-neutral-300 backdrop-blur-md shadow-lg pointer-events-none select-none">
        <Compass className={cn("w-3.5 h-3.5 text-cyan-400", isOrbiting && "animate-spin")} />
        <span>
          {isOrbiting ? "Rotating 3D Scene..." : "Drag canvas to orbit 3D • Shift for precision • 2x click reset"}
        </span>
      </div>

      {/* Floating Quick Reset for 3D Angle */}
      {(config.tiltX !== 0 || config.tiltY !== 0 || config.tiltZ !== 0 || config.zoom !== 100) && (
        <button
          onClick={() => updateConfig({ tiltX: 0, tiltY: 0, tiltZ: 0, zoom: 100 })}
          className="absolute bottom-5 right-5 z-40 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/15 text-xs text-neutral-200 hover:text-white hover:bg-neutral-800 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-[-90deg] transition-transform" />
          <span>Reset 3D Angle</span>
        </button>
      )}
    </div>
  );
};
