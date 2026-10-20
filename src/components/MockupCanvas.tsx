"use client";

import React, { useRef, useState, useEffect } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { SHAPES_LAYOUTS, DEVICE_SPECS, parseAspectRatio } from "@/types/mockup";
import { Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, type Transition } from "framer-motion";

export const MockupCanvas = () => {
  const {
    config,
    imageUrl,
    imageDimensions,
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
    animate: Record<string, any>;
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
          scale: config.zoom / 100,
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

  // Reusable renderer for physical devices or browser/screenshot frames
  const renderMockupItem = (
    currentImg: string | null,
    onSlotClick: () => void,
    isSecondary = false
  ) => {
    if (deviceSpec.isDevice) {
      return (
        <div
          style={{
            aspectRatio: deviceSpec.aspectRatio,
            filter: getDeviceShadowFilter(),
          }}
          className="w-full h-full relative flex items-center justify-center transition-all duration-300"
        >
          {/* 1. Black underlay plate (extends slightly under bezel to eliminate canvas bleed) */}
          <div
            style={{
              position: "absolute",
              left: deviceSpec.screenBounds?.left ?? "0%",
              top: deviceSpec.screenBounds?.top ?? "0%",
              width: deviceSpec.screenBounds?.width ?? "100%",
              height: deviceSpec.screenBounds?.height ?? "100%",
              transform: "scale(1.025)",
              transformOrigin: "center",
              backgroundColor: "#000000",
              borderRadius: deviceSpec.name.includes("iPhone")
                ? "54px"
                : deviceSpec.name.includes("Watch")
                ? "42px"
                : "16px",
            }}
            className="pointer-events-none z-5"
          />

          {/* 2. Screen Mask & Media Container (under bezel cutout) */}
          <div
            style={{
              position: "absolute",
              left: deviceSpec.screenBounds?.left ?? "0%",
              top: deviceSpec.screenBounds?.top ?? "0%",
              width: deviceSpec.screenBounds?.width ?? "100%",
              height: deviceSpec.screenBounds?.height ?? "100%",
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
          </div>

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
        style={{
          background: config.backgroundValue,
          padding: `${config.padding}px`,
          ...getCanvasDimensions(),
          boxSizing: "border-box",
        }}
        className={cn(
          "rounded-2xl transition-all duration-300 flex items-center justify-center shadow-2xl relative overflow-hidden",
          isDragging && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-black"
        )}
      >
        {/* Noise Overlay */}
        {config.noiseOverlay && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
            style={{ backgroundImage: `url('/shots-assets/noise.svg')` }}
          />
        )}

        {/* Canvas Annotations (Floating Text & Badges Overlay) */}
        {config.annotationsEnabled && (
          <div
            className={cn(
              "absolute inset-x-0 z-30 pointer-events-none px-8 py-6 flex flex-col",
              config.annotationPosition === "top" ? "top-0" : "bottom-0",
              config.annotationAlign === "left" && "items-start text-left",
              config.annotationAlign === "center" && "items-center text-center",
              config.annotationAlign === "right" && "items-end text-right"
            )}
          >
            {config.annotationBadge && (
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-white shadow-lg mb-2"
                style={{ backgroundColor: config.annotationBadgeColor || "#6366f1" }}
              >
                {config.annotationBadge}
              </div>
            )}
            {config.annotationHeadline && (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
                {config.annotationHeadline}
              </h2>
            )}
            {config.annotationSubtitle && (
              <p className="text-sm sm:text-base text-white/80 font-medium mt-1 max-w-xl drop-shadow">
                {config.annotationSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Custom Watermark / Brand Signature Badge */}
        {config.watermark && (
          <div
            className={cn(
              "absolute z-30 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white pointer-events-none shadow-md",
              config.watermarkPosition === "top-left" && "top-4 left-4",
              config.watermarkPosition === "top-right" && "top-4 right-4",
              config.watermarkPosition === "bottom-left" && "bottom-4 left-4",
              config.watermarkPosition === "bottom-right" && "bottom-4 right-4"
            )}
          >
            {config.watermarkPlatform === "shots" && (
              <div className="w-3.5 h-3.5 rounded-md bg-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-black rounded-sm" />
              </div>
            )}
            {config.watermarkPlatform === "twitter" && (
              <span className="font-bold text-[11px] leading-none text-white px-0.5">𝕏</span>
            )}
            {config.watermarkPlatform === "instagram" && (
              <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">
                ◎
              </div>
            )}
            <div className="text-[10px] font-medium leading-none">
              {config.watermarkPlatform === "shots" && (
                <span className="text-white/60">Made with </span>
              )}
              <span className="font-bold text-white">
                {config.watermarkText || "Shots.so"}
              </span>
            </div>
          </div>
        )}

        {/* 3D Shapes Scene (Flutuantes Volumétricas) */}
        {config.shapesSceneEnabled &&
          currentShapesLayout.layout.map((shape, idx) => {
            const itemNumber = config.shapesItems[idx % config.shapesItems.length] || 1;
            const imgSrc = `/shots-assets/3d-shapes/${config.shapesPack}/full/${itemNumber}.avif`;
            return (
              <motion.img
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: shape.scale }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                src={imgSrc}
                alt="3D Shape"
                className="absolute pointer-events-none"
                style={{
                  top: shape.stick.includes("top") ? 0 : undefined,
                  bottom: shape.stick.includes("bottom") ? 0 : undefined,
                  left: shape.stick.includes("left") ? 0 : undefined,
                  right: shape.stick.includes("right") ? 0 : undefined,
                  transform: `translateX(${shape.x}%) translateY(${shape.y}%) rotate(${shape.rotate}deg)`,
                  filter: `blur(${shape.blur}px)`,
                  zIndex: shape.zIndex < 0 ? 0 : 25,
                  maxWidth: "230px",
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            );
          })}

        {/* 3D Spatial Container with Auto-Contain & Smooth Spring Physics */}
        {config.showMockup && (
          <motion.div
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
                    () => fileInputRef.current?.click(),
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
                    () => secondaryFileInputRef.current?.click(),
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
                    () => tertiaryFileInputRef.current?.click(),
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
                  {renderMockupItem(imageUrl, () => fileInputRef.current?.click(), false)}
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
                    () => secondaryFileInputRef.current?.click(),
                    true
                  )}
                </div>
              </div>
            ) : (
              renderMockupItem(imageUrl, () => fileInputRef.current?.click(), false)
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
