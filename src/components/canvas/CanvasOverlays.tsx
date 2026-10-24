import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MockupConfig, ShapesLayout } from "@/types/mockup";

interface CanvasOverlaysProps {
  config: MockupConfig;
  currentShapesLayout: ShapesLayout;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  config,
  currentShapesLayout,
}) => {
  return (
    <>
      {/* Studio VFX Atmospheric Overlays */}
      {config.vfxType && config.vfxType !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-screen transition-opacity duration-200"
          style={{ opacity: (config.vfxIntensity ?? 50) / 100 }}
        >
          {config.vfxType === "vhs" && (
            <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
          )}
          {config.vfxType === "tv" && (
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_100%,100%_3px]" />
          )}
          {config.vfxType === "vhs-glitch" && (
            <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,0,0,0.2),rgba(0,255,255,0.2)),linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_100%,100%_6px]" />
          )}
          {config.vfxType === "tech-glitch" && (
            <div className="w-full h-full bg-[linear-gradient(to_right,#00ffff20_1px,transparent_1px),linear-gradient(to_bottom,#ff00ff20_1px,transparent_1px)] bg-[size:28px_28px]" />
          )}
          {config.vfxType === "light-leak" && (
            <div className="w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,100,50,0.6)_0%,rgba(255,0,128,0.35)_40%,transparent_75%)] mix-blend-color-dodge" />
          )}
          {config.vfxType === "particles" && (
            <div className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.5)_1px,transparent_2px),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.5)_1.5px,transparent_3px),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.4)_2px,transparent_4px)] bg-[size:100px_100px]" />
          )}
          {config.vfxType === "glitter" && (
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.7)_1px,transparent_2px),radial-gradient(circle_at_25%_75%,rgba(255,220,100,0.6)_1px,transparent_2px)] bg-[size:60px_60px]" />
          )}
          {config.vfxType === "noise" && (
            <div className="w-full h-full bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:3px_3px]" />
          )}
        </div>
      )}

      {/* Apple-Style Studio Portrait Lighting Overlays */}
      {config.portraitLighting && config.portraitLighting !== "natural" && (
        <div className="absolute inset-0 pointer-events-none z-15 transition-all duration-300">
          {config.portraitLighting === "studio" && (
            <div
              className="w-full h-full mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.3) 100%)",
              }}
            />
          )}
          {config.portraitLighting === "contour" && (
            <div
              className="w-full h-full mix-blend-hard-light"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)",
              }}
            />
          )}
          {config.portraitLighting === "stage" && (
            <div
              className="w-full h-full mix-blend-multiply"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 25%, transparent 30%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.92) 100%)",
              }}
            />
          )}
        </div>
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
          style={{
            transform: `scale(${(config.watermarkSize ?? 80) / 80})`,
            transformOrigin:
              config.watermarkPosition === "top-left"
                ? "top left"
                : config.watermarkPosition === "top-right"
                ? "top right"
                : config.watermarkPosition === "bottom-left"
                ? "bottom left"
                : "bottom right",
            margin: `${(config.watermarkInset ?? 5) * 2}px`,
          }}
          className={cn(
            "absolute z-30 flex items-center space-x-1.5 px-3 py-1.5 rounded-full pointer-events-none transition-all shadow-md",
            config.watermarkPosition === "top-left" && "top-3 left-3",
            config.watermarkPosition === "top-right" && "top-3 right-3",
            config.watermarkPosition === "bottom-left" && "bottom-3 left-3",
            config.watermarkPosition === "bottom-right" && "bottom-3 right-3",
            // Style variations
            (!config.watermarkStyle || config.watermarkStyle === "default") &&
              "bg-black/50 backdrop-blur-md border border-white/10 text-white",
            config.watermarkStyle === "shadow" &&
              "bg-transparent text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-transparent",
            config.watermarkStyle === "glass" &&
              "bg-white/15 backdrop-blur-xl border border-white/30 text-white shadow-xl",
            config.watermarkStyle === "badge" &&
              (config.watermarkTheme === "light"
                ? "bg-white text-black font-bold shadow-xl border-0"
                : "bg-black text-white font-bold border border-white/20 shadow-xl")
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
              <span className="opacity-60">Made with </span>
            )}
            <span className="font-bold">
              {config.watermarkText || "Shots.so"}
            </span>
          </div>
        </div>
      )}

      {/* 3D Shapes Scene (Flutuantes Volumétricas) */}
      {config.shapesSceneEnabled &&
        currentShapesLayout.layout.map((shape, idx) => {
          const shapesItems = config.shapesItems?.length ? config.shapesItems : [1, 2, 3, 4, 5, 6];
          const itemNumber = shapesItems[idx % shapesItems.length] || 1;
          const pack = config.shapesPack || "glass-blue";
          const imgSrc =
            pack === "metal"
              ? `/shots-assets/3d-shapes/metal/${itemNumber}.avif`
              : `/shots-assets/3d-shapes/${pack}/full/${itemNumber}.avif`;
          return (
            <motion.img
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: shape.scale }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              src={imgSrc}
              alt="3D Shape"
              className="absolute pointer-events-none drop-shadow-2xl"
              style={{
                top: shape.stick.includes("top") ? 0 : undefined,
                bottom: shape.stick.includes("bottom") ? 0 : undefined,
                left: shape.stick.includes("left") ? 0 : undefined,
                right: shape.stick.includes("right") ? 0 : undefined,
                transform: `translateX(${shape.x}%) translateY(${shape.y}%) rotate(${shape.rotate}deg)`,
                filter: shape.blur > 0 ? `blur(${shape.blur}px)` : undefined,
                zIndex: shape.zIndex < 0 ? 0 : 25,
                maxWidth: "300px",
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes("/full/")) {
                  target.src = target.src.replace("/full/", "/");
                } else {
                  target.style.display = "none";
                }
              }}
            />
          );
        })}
    </>
  );
};
