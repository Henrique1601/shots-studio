/**
 * Magic Palette - Intelligent Color Quantizer & Harmonizer
 * Extracts dominant vibrant colors from user images and generates studio-grade gradients
 */

export interface GeneratedGradient {
  id: string;
  name: string;
  css: string;
  preview: string;
}

export function generateHarmonicGradients(
  color1: string,
  color2: string,
  color3?: string
): GeneratedGradient[] {
  const c3 = color3 || "#090d16";

  return [
    {
      id: "magic-mesh",
      name: "Vibrant Studio Mesh",
      css: `radial-gradient(at 15% 15%, ${color1} 0px, transparent 55%), radial-gradient(at 85% 85%, ${color2} 0px, transparent 50%), radial-gradient(at 50% 50%, ${color1}33 0px, transparent 65%), linear-gradient(135deg, #09090b 0%, #18181b 100%)`,
      preview: `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`,
    },
    {
      id: "magic-glow",
      name: "Ambient Accent Glow",
      css: `radial-gradient(circle at 50% 45%, ${color1}55 0%, transparent 65%), linear-gradient(145deg, #0d0f14 0%, #151821 50%, #07080a 100%)`,
      preview: `radial-gradient(circle, ${color1} 30%, #0d0f14 100%)`,
    },
    {
      id: "magic-duo",
      name: "Harmonic Linear Duo",
      css: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
      preview: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    },
    {
      id: "magic-aurora",
      name: "Deep Velvet Contrast",
      css: `radial-gradient(circle at 80% 20%, ${color2}66 0%, transparent 50%), radial-gradient(circle at 20% 80%, ${color1}44 0%, transparent 55%), linear-gradient(135deg, #050608 0%, ${c3} 50%, #030406 100%)`,
      preview: `linear-gradient(135deg, ${color1} 0%, #050608 100%)`,
    },
  ];
}

/**
 * Client-side color extractor using HTML5 Canvas API
 */
export async function extractPaletteFromImage(
  imageSrc: string
): Promise<GeneratedGradient[]> {
  if (typeof window === "undefined") {
    return generateHarmonicGradients("#6366f1", "#ec4899");
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(generateHarmonicGradients("#6366f1", "#ec4899"));
          return;
        }

        // Downscale to 32x32 for ultra-fast color analysis
        canvas.width = 32;
        canvas.height = 32;
        ctx.drawImage(img, 0, 0, 32, 32);

        const imgData = ctx.getImageData(0, 0, 32, 32).data;
        const colorCounts: Record<string, { r: number; g: number; b: number; count: number; sat: number }> = {};

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Skip transparent or near-black/near-white pixels
          if (a < 128) continue;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const sat = max === 0 ? 0 : delta / max;

          // Bucket to 16 color intervals
          const br = Math.round(r / 24) * 24;
          const bg = Math.round(g / 24) * 24;
          const bb = Math.round(b / 24) * 24;
          const key = `${br},${bg},${bb}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { r: br, g: bg, b: bb, count: 1, sat };
          } else {
            colorCounts[key].count++;
          }
        }

        const sorted = Object.values(colorCounts).sort((a, b) => {
          // Weight by frequency and saturation (prefer vibrant over muddy gray)
          const scoreA = a.count * (1 + a.sat * 2);
          const scoreB = b.count * (1 + b.sat * 2);
          return scoreB - scoreA;
        });

        const toHex = (c: { r: number; g: number; b: number }) =>
          `#${[c.r, c.g, c.b]
            .map((x) => Math.min(255, Math.max(0, x)).toString(16).padStart(2, "0"))
            .join("")}`;

        const c1 = sorted[0] ? toHex(sorted[0]) : "#6366f1";
        const c2 = sorted[1] ? toHex(sorted[1]) : "#ec4899";
        const c3 = sorted[2] ? toHex(sorted[2]) : "#3b82f6";

        resolve(generateHarmonicGradients(c1, c2, c3));
      } catch {
        resolve(generateHarmonicGradients("#6366f1", "#ec4899"));
      }
    };

    img.onerror = () => {
      resolve(generateHarmonicGradients("#6366f1", "#ec4899"));
    };

    img.src = imageSrc;
  });
}
