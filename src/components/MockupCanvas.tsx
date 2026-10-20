"use client";

import React, { useRef, useState } from "react";
import { useMockupStore } from "@/store/mockupStore";
import { SHAPES_LAYOUTS, DEVICE_SPECS } from "@/types/mockup";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const MockupCanvas = () => {
  const {
    config,
    imageUrl,
    imageDimensions,
    setImageUrl,
    setImageDimensions,
  } = useMockupStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const deviceSpec = DEVICE_SPECS[config.frameType] || DEVICE_SPECS.screenshot;

  // Exact 4-layer box-shadow formula from Shots.so
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

  const processUploadedFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageUrl(url);
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processUploadedFile(file);
    }
  };

  const getCanvasAspectStyle = () => {
    if (config.aspectRatio === "custom") {
      return {
        aspectRatio: `${config.customWidth} / ${config.customHeight}`,
      };
    }
    const [w, h] = config.aspectRatio.split(":").map(Number);
    if (w && h) {
      return { aspectRatio: `${w} / ${h}` };
    }
    return { minHeight: "560px" };
  };

  const currentShapesLayout =
    SHAPES_LAYOUTS.find((l) => l.name === config.shapesLayoutName) ||
    SHAPES_LAYOUTS[0];

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-hidden bg-black relative select-none">
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
          ...getCanvasAspectStyle(),
          maxHeight: "92%",
          maxWidth: "92%",
        }}
        className={cn(
          "rounded-2xl transition-all duration-300 flex items-center justify-center shadow-2xl relative overflow-hidden"
        )}
      >
        {/* Noise Overlay */}
        {config.noiseOverlay && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
            style={{ backgroundImage: `url('/shots-assets/noise.svg')` }}
          />
        )}

        {/* Made with Shots.so Watermark Badge */}
        {config.watermark && (
          <div className="absolute top-4 left-4 z-30 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-md bg-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-black rounded-sm" />
            </div>
            <div className="text-[10px] font-medium leading-none">
              <span className="text-white/60">Made with </span>
              <span className="font-bold text-white">Shots.so</span>
            </div>
          </div>
        )}

        {/* 3D Shapes Scene (Flutuantes Volumétricas) */}
        {config.shapesSceneEnabled &&
          currentShapesLayout.layout.map((shape, idx) => {
            const itemNumber = config.shapesItems[idx % config.shapesItems.length] || 1;
            const imgSrc = `/shots-assets/3d-shapes/${config.shapesPack}/${itemNumber}.avif`;
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

        {/* 3D Spatial Container with Smooth Spring Physics */}
        {config.showMockup && (
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              width: deviceSpec.isDevice ? "65%" : "75%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
              transform: `perspective(150em) rotateX(${config.tiltX}deg) rotateY(${config.tiltY}deg) rotateZ(${config.tiltZ}deg) scale(${config.zoom / 100})`,
              transition: "transform 0.125s linear",
              transformOrigin: "center",
            }}
          >
            {/* DEVICE MOCKUP RENDERER (iPhone 17, Macbook Pro, iPad Pro, Apple Watch) */}
            {deviceSpec.isDevice ? (
              <div
                style={{
                  aspectRatio: deviceSpec.aspectRatio,
                  boxShadow: getShotsShadow(),
                }}
                className="w-full relative flex items-center justify-center transition-all duration-300"
              >
                {/* 1. Device Bezel Asset Frame (Overlay) */}
                <div
                  className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
                  style={{
                    transform: `scale(${deviceSpec.scaleMultiplier || 1})`,
                    transformOrigin: "center",
                  }}
                >
                  <img
                    src={deviceSpec.deviceImg}
                    alt={deviceSpec.name}
                    className="w-full h-full object-contain block select-none pointer-events-none"
                  />
                </div>

                {/* 2. Screen Mask & Media Container */}
                <div
                  style={{
                    aspectRatio: deviceSpec.aspectRatio,
                    maskImage: `url("${deviceSpec.maskSvg}")`,
                    WebkitMaskImage: `url("${deviceSpec.maskSvg}")`,
                    maskSize: "100% 100%",
                    WebkitMaskSize: "100% 100%",
                  }}
                  className="w-full h-full relative z-10 overflow-hidden bg-[#0d0d0d] flex items-center justify-center cursor-pointer"
                  onClick={() => !imageUrl && fileInputRef.current?.click()}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded media"
                      className="w-full h-full object-cover block select-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center group">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-white/20 shadow-md">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xs font-semibold text-white tracking-tight mb-0.5">
                        Drop or Paste
                      </h3>
                      <p className="text-[10px] text-neutral-400">
                        Images & Videos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* SCREENSHOT / BROWSER MOCKUP RENDERER */
              <div
                style={{
                  boxShadow: getShotsShadow(),
                  borderRadius: `${config.borderRadius}px`,
                  aspectRatio: imageDimensions
                    ? `${imageDimensions.width} / ${imageDimensions.height}`
                    : "4 / 3",
                  maxHeight: "85%",
                }}
                className={cn(
                  "w-full overflow-hidden relative flex flex-col items-center justify-center transition-all duration-300",
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
                {/* Browser Header */}
                {config.frameType === "browser" && (
                  <div className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900/80 border-b border-white/10">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="h-4 px-3 rounded bg-white/5 text-[9px] text-neutral-400 flex items-center justify-center">
                      shots.so/editor
                    </div>
                    <div className="w-8" />
                  </div>
                )}

                {/* Media Content */}
                <div
                  className="relative w-full h-full flex items-center justify-center cursor-pointer bg-[#0d0d0d]"
                  onClick={() => !imageUrl && fileInputRef.current?.click()}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded mockup"
                      className="w-full h-full object-contain block select-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center group">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/20 shadow-md">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-tight mb-1">
                        Drop or Paste
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Images & Videos
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
      </div>
    </div>
  );
};
