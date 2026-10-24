import type { ShapesLayout } from "../types/mockup.ts";

export const SHAPES_LAYOUTS: ShapesLayout[] = [
  {
    name: "layout-1",
    layout: [
      { scale: 1.2, stick: "top left", x: -50, y: -50, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 0.8, stick: "top right", x: 70, y: -50, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 0.7, stick: "bottom right", x: 100, y: 20, rotate: -15, blur: 0, zIndex: -2 },
      { scale: 1.6, stick: "bottom left", x: -60, y: 20, rotate: 0, blur: 0, zIndex: 1 },
    ],
  },
  {
    name: "layout-7",
    layout: [
      { scale: 1.0, stick: "top left", x: -60, y: -50, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 0.5, stick: "top left", x: 80, y: -120, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 1.2, stick: "top right", x: 40, y: -20, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 0.7, stick: "bottom right", x: 80, y: 80, rotate: 0, blur: 0, zIndex: 2 },
      { scale: 0.8, stick: "bottom left", x: -20, y: 80, rotate: 0, blur: 0, zIndex: 1 },
      { scale: 0.6, stick: "bottom left", x: -100, y: 10, rotate: 0, blur: 0, zIndex: -1 },
    ],
  },
  {
    name: "layout-3",
    layout: [
      { scale: 0.8, stick: "top left", x: -60, y: -60, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 1.0, stick: "top left", x: 100, y: -60, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 0.7, stick: "top right", x: 100, y: 15, rotate: 0, blur: 0, zIndex: 1 },
      { scale: 1.2, stick: "bottom right", x: 40, y: 40, rotate: 0, blur: 0, zIndex: -1 },
      { scale: 1.1, stick: "bottom left", x: -50, y: 50, rotate: 0, blur: 0, zIndex: 1 },
      { scale: 0.5, stick: "bottom left", x: -130, y: -50, rotate: 0, blur: 0, zIndex: 1 },
    ],
  },
  {
    name: "layout-orbit",
    layout: [
      { scale: 1.3, stick: "top left", x: -40, y: -40, rotate: 15, blur: 0, zIndex: 1 },
      { scale: 0.9, stick: "top right", x: 50, y: -30, rotate: -20, blur: 0, zIndex: -1 },
      { scale: 1.4, stick: "bottom right", x: 60, y: 50, rotate: 30, blur: 0, zIndex: 2 },
      { scale: 0.8, stick: "bottom left", x: -50, y: 40, rotate: -10, blur: 0, zIndex: -1 },
      { scale: 0.6, stick: "top left", x: 60, y: -80, rotate: 45, blur: 0, zIndex: -2 },
    ],
  },
  {
    name: "layout-cascade",
    layout: [
      { scale: 1.5, stick: "top right", x: 80, y: -40, rotate: -15, blur: 0, zIndex: 2 },
      { scale: 1.1, stick: "top right", x: 20, y: 30, rotate: 25, blur: 0, zIndex: 1 },
      { scale: 0.8, stick: "bottom left", x: -60, y: 60, rotate: 10, blur: 0, zIndex: -1 },
      { scale: 0.5, stick: "bottom left", x: 30, y: 90, rotate: -30, blur: 0, zIndex: -2 },
    ],
  },
  {
    name: "layout-framing",
    layout: [
      { scale: 1.1, stick: "top left", x: -50, y: 0, rotate: -20, blur: 0, zIndex: 1 },
      { scale: 0.9, stick: "bottom left", x: -50, y: 0, rotate: 20, blur: 0, zIndex: 1 },
      { scale: 1.1, stick: "top right", x: 50, y: 0, rotate: 20, blur: 0, zIndex: 1 },
      { scale: 0.9, stick: "bottom right", x: 50, y: 0, rotate: -20, blur: 0, zIndex: 1 },
    ],
  },
  {
    name: "layout-constellation",
    layout: [
      { scale: 1.15, stick: "top left", x: -35, y: -45, rotate: 12, blur: 0, zIndex: 1 },
      { scale: 0.75, stick: "top right", x: 30, y: -55, rotate: -18, blur: 0, zIndex: -1 },
      { scale: 1.35, stick: "bottom right", x: 45, y: 40, rotate: 25, blur: 0, zIndex: 2 },
      { scale: 0.85, stick: "bottom left", x: -40, y: 35, rotate: -12, blur: 0, zIndex: 1 },
      { scale: 0.65, stick: "top left", x: 90, y: -70, rotate: 30, blur: 0, zIndex: -1 },
    ],
  },
  {
    name: "layout-vortex",
    layout: [
      { scale: 1.4, stick: "top left", x: -50, y: -20, rotate: -25, blur: 0, zIndex: 2 },
      { scale: 1.0, stick: "top right", x: 60, y: -40, rotate: 35, blur: 0, zIndex: -1 },
      { scale: 1.25, stick: "bottom right", x: 50, y: 30, rotate: -15, blur: 0, zIndex: 2 },
      { scale: 0.9, stick: "bottom left", x: -30, y: 60, rotate: 20, blur: 0, zIndex: -1 },
      { scale: 0.7, stick: "top left", x: 20, y: -80, rotate: -40, blur: 0, zIndex: -2 },
      { scale: 0.8, stick: "bottom right", x: -60, y: 80, rotate: 45, blur: 0, zIndex: 1 },
    ],
  },
  {
    name: "layout-diagonal",
    layout: [
      { scale: 1.5, stick: "top left", x: -40, y: -50, rotate: 15, blur: 0, zIndex: 2 },
      { scale: 1.1, stick: "top left", x: 50, y: -20, rotate: -10, blur: 0, zIndex: 1 },
      { scale: 1.2, stick: "bottom right", x: -20, y: 40, rotate: 20, blur: 0, zIndex: 1 },
      { scale: 1.6, stick: "bottom right", x: 60, y: 55, rotate: -25, blur: 0, zIndex: 2 },
    ],
  },
  {
    name: "layout-hero-duo",
    layout: [
      { scale: 1.85, stick: "top left", x: -55, y: -40, rotate: -15, blur: 0, zIndex: 2 },
      { scale: 1.75, stick: "bottom right", x: 55, y: 45, rotate: 25, blur: 0, zIndex: 2 },
      { scale: 0.65, stick: "top right", x: 45, y: -60, rotate: -10, blur: 0, zIndex: -1 },
      { scale: 0.75, stick: "bottom left", x: -35, y: 50, rotate: 15, blur: 0, zIndex: -1 },
    ],
  },
];

