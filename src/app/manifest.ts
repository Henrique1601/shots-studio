import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FrameCraft Studio — Mockup Generator 3D",
    short_name: "FrameCraft",
    description: "Create stunning 3D device mockups directly in your browser with FrameCraft Studio.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#121212",
    icons: [
      {
        src: "/shots-assets/apple-touch-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/shots-assets/apple-touch-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
