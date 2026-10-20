#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Initialize FrameCraft Studio MCP Server
const server = new McpServer({
  name: "framecraft-mcp",
  version: "1.0.0",
});

// Catalog Constants
const DEVICES = [
  { id: "iphone-17", name: "iPhone 17", type: "mobile", ratio: "1508 / 3278" },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", type: "mobile", ratio: "1508 / 3279" },
  { id: "macbook", name: "MacBook Pro 16", type: "laptop", ratio: "4893 / 3164" },
  { id: "ipad-pro", name: "iPad Pro 13", type: "tablet", ratio: "2560 / 3415" },
  { id: "watch", name: "Apple Watch Ultra", type: "wearable", ratio: "1640 / 2009" },
  { id: "browser", name: "Safari / Chrome Browser", type: "desktop", ratio: "16 / 10" },
  { id: "minimal-desktop", name: "Minimal Desktop Window", type: "desktop", ratio: "16 / 10" },
  { id: "screenshot", name: "Direct Screenshot Frame", type: "frame", ratio: "4 / 3" },
  { id: "code", name: "Code Snippet Studio (Ray.so / Carbon)", type: "code", ratio: "16 / 10" },
];

const SOCIAL_PRESETS = [
  { id: "twitter-post", platform: "twitter", name: "X / Twitter Post", width: 1200, height: 675, ratio: "16:9" },
  { id: "twitter-header", platform: "twitter", name: "X / Twitter Header", width: 1500, height: 500, ratio: "3:1" },
  { id: "instagram-square", platform: "instagram", name: "Instagram Square", width: 1080, height: 1080, ratio: "1:1" },
  { id: "instagram-story", platform: "instagram", name: "Instagram Story / Reel", width: 1080, height: 1920, ratio: "9:16" },
  { id: "linkedin-post", platform: "linkedin", name: "LinkedIn Post", width: 1200, height: 627, ratio: "16:9" },
  { id: "dribbble-shot", platform: "dribbble", name: "Dribbble Shot", width: 1600, height: 1200, ratio: "4:3" },
  { id: "youtube-thumb", platform: "youtube", name: "YouTube Thumbnail", width: 1280, height: 720, ratio: "16:9" },
  { id: "producthunt-gallery", platform: "producthunt", name: "Product Hunt Gallery", width: 1270, height: 760, ratio: "16:10" },
];

const GRADIENT_PRESETS = [
  { id: "cosmic-fusion", name: "Cosmic Fusion", css: "linear-gradient(135deg, rgb(255, 110, 196) 0%, rgb(120, 115, 245) 50%, rgb(0, 212, 255) 100%)" },
  { id: "glass-prism-4k", name: "Prism Crystal 4K", css: "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.75) 0%, transparent 45%), radial-gradient(circle at 82% 82%, rgba(147, 197, 253, 0.5) 0%, transparent 50%), linear-gradient(135deg, #e0e7ff 0%, #fae8ff 45%, #c7d2fe 100%)" },
  { id: "obsidian-mirror-4k", name: "Obsidian Mirror 4K", css: "radial-gradient(circle at 50% 10%, rgba(129, 140, 248, 0.4) 0%, transparent 55%), radial-gradient(circle at 85% 90%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), linear-gradient(135deg, #090d16 0%, #1e1b4b 55%, #030712 100%)" },
  { id: "tahoe-valley-4k", name: "Tahoe Valley 4K", css: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat" },
  { id: "sierra-night-4k", name: "Sierra Night 4K", css: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat" },
];

// TOOL 1: List all available presets
server.tool(
  "framecraft_list_presets",
  "Lists all available mockup devices, frames, social media aspect ratios, and background presets in FrameCraft Studio",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              devices: DEVICES,
              socialPresets: SOCIAL_PRESETS,
              backgroundPresets: GRADIENT_PRESETS,
              shapesCollections: [
                "glass-blue",
                "glass-pink",
                "metal",
                "metal-gradient-dark",
                "metal-gradient-light",
                "inflatable",
                "plushy",
              ],
              shapesLayouts: [
                "layout-1 (Corners)",
                "layout-7 (Cluster)",
                "layout-3 (Diagonal)",
                "layout-orbit (Orbit)",
                "layout-cascade (Cascade)",
                "layout-framing (Framing)",
                "layout-constellation (Constellation)",
                "layout-vortex (Vortex)",
                "layout-diagonal (Dynamic)",
                "layout-hero-duo (Hero Duo)",
              ],
              codeThemes: ["one-dark", "dracula", "tokyo-night", "github-dark", "monokai"],
              codeLanguages: ["typescript", "javascript", "python", "rust", "go", "html", "css", "json", "sql"],
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// TOOL 2: Create a complete mockup configuration
server.tool(
  "framecraft_create_mockup",
  "Creates a ready-to-use FrameCraft Studio mockup configuration with devices, backgrounds, 3D tilt, annotations and shadows",
  {
    image: z.string().describe("Image URL or file path for the primary mockup screen"),
    frameType: z
      .enum(["screenshot", "browser", "minimal-desktop", "iphone-17", "iphone-16-pro", "macbook", "ipad-pro", "watch", "code"])
      .default("iphone-17")
      .describe("Device mockup or frame style"),
    background: z
      .string()
      .default("cosmic-fusion")
      .describe("Background preset ID ('cosmic-fusion', 'glass-prism-4k', 'obsidian-mirror-4k', 'tahoe-valley-4k') or custom CSS gradient/hex"),
    tiltX: z.number().min(-45).max(45).default(0).describe("Vertical 3D tilt angle (-45 to 45 degrees)"),
    tiltY: z.number().min(-45).max(45).default(0).describe("Horizontal 3D rotation angle (-45 to 45 degrees)"),
    headline: z.string().optional().describe("Top or bottom headline overlay banner"),
    badge: z.string().optional().describe("Accent badge tag (e.g. 'NEW', '2.0', 'BETA')"),
    subtitle: z.string().optional().describe("Descriptive subtitle text under the headline"),
    watermarkText: z.string().default("FrameCraft").describe("Custom watermark or brand signature text"),
    backgroundBlur: z.number().min(0).max(40).default(0).describe("Studio Depth of Field Bokeh blur (0 to 40px)"),
    grainIntensity: z.number().min(0).max(100).default(0).describe("Film grain texture intensity (0 to 100%)"),
    aspectRatio: z.enum(["16:9", "1:1", "4:5", "9:16", "3:1", "16:10", "custom"]).default("16:9").describe("Canvas aspect ratio"),
  },
  async ({
    image,
    frameType,
    background,
    tiltX,
    tiltY,
    headline,
    badge,
    subtitle,
    watermarkText,
    backgroundBlur,
    grainIntensity,
    aspectRatio,
  }) => {
    // Resolve background
    let bgValue = background;
    const foundPreset = GRADIENT_PRESETS.find((p) => p.id === background);
    if (foundPreset) {
      bgValue = foundPreset.css;
    }

    const config = {
      frameType,
      imageUrl: image,
      backgroundValue: bgValue,
      tiltX,
      tiltY,
      tiltZ: 0,
      zoom: 100,
      padding: 64,
      borderRadius: 16,
      shadowMode: "adaptive",
      shadowOpacity: 45,
      aspectRatio,
      watermark: !!watermarkText,
      watermarkText: watermarkText || "FrameCraft",
      backgroundBlur,
      grainIntensity,
      annotationsEnabled: !!headline || !!badge,
      annotationHeadline: headline || "",
      annotationBadge: badge || "",
      annotationSubtitle: subtitle || "",
      annotationPosition: "top",
      annotationAlign: "center",
      annotationBadgeColor: "#6366f1",
      exportScale: 2,
      exportFormat: "PNG",
    };

    return {
      content: [
        {
          type: "text",
          text: `### 📸 FrameCraft Studio Mockup Configuration Created Successfully!\n\n` +
            `* **Device:** \`${frameType}\`\n` +
            `* **Canvas Ratio:** \`${aspectRatio}\` (Export scale 2x Retina)\n` +
            `* **3D Tilt:** TiltX: \`${tiltX}°\`, TiltY: \`${tiltY}°\`\n` +
            `* **Depth of Field:** \`${backgroundBlur}px\` Bokeh Blur\n` +
            `* **Film Grain:** \`${grainIntensity}%\`\n` +
            (headline ? `* **Headline Banner:** "${headline}" [${badge || ""}]\n` : "") +
            `\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``,
        },
      ],
    };
  }
);

// TOOL 3: Automated Social Media Post Mockup Generator
server.tool(
  "framecraft_social_post",
  "Creates an automated, platform-optimized social media post mockup for Twitter, Instagram, LinkedIn, Dribbble, YouTube or Product Hunt",
  {
    platform: z.enum(["twitter", "instagram", "linkedin", "dribbble", "youtube", "producthunt"]).describe("Target social media platform"),
    image: z.string().describe("Screenshot or media URL/path to present"),
    headline: z.string().describe("Main hook or launch headline"),
    subtitle: z.string().optional().describe("Secondary tagline or description"),
    badge: z.string().default("NEW").describe("Badge tag (e.g. 'v2.0', 'LAUNCH', 'SAAS')"),
    device: z.enum(["iphone-17", "macbook", "browser", "code", "screenshot"]).default("iphone-17").describe("Device framing"),
    theme: z.enum(["dark", "glass", "tahoe", "vibrant", "cosmic"]).default("dark").describe("Visual mood"),
  },
  async ({ platform, image, headline, subtitle, badge, device, theme }) => {
    const preset = SOCIAL_PRESETS.find((p) => p.platform === platform) || SOCIAL_PRESETS[0];

    // Select theme background
    let bg = "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #030712 100%)";
    let bgBlur = 0;
    if (theme === "glass") {
      bg = "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.75) 0%, transparent 45%), linear-gradient(135deg, #e0e7ff 0%, #fae8ff 45%, #c7d2fe 100%)";
    } else if (theme === "tahoe") {
      bg = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat";
      bgBlur = 12; // studio bokeh for landscape
    } else if (theme === "vibrant") {
      bg = "linear-gradient(135deg, rgb(255, 110, 196) 0%, rgb(120, 115, 245) 50%, rgb(0, 212, 255) 100%)";
    }

    // Isometric 3D angle recommendations for high CTR
    const tiltX = device === "browser" || device === "code" ? 0 : 8;
    const tiltY = device === "browser" || device === "code" ? 0 : -14;

    const mockup = {
      platform,
      dimensions: `${preset.width}x${preset.height}`,
      aspectRatio: preset.ratio,
      customWidth: preset.width,
      customHeight: preset.height,
      frameType: device,
      imageUrl: image,
      backgroundValue: bg,
      backgroundBlur: bgBlur,
      grainIntensity: 15,
      tiltX,
      tiltY,
      tiltZ: 0,
      zoom: 100,
      shadowMode: "adaptive",
      shadowOpacity: 50,
      annotationsEnabled: true,
      annotationHeadline: headline,
      annotationSubtitle: subtitle || "",
      annotationBadge: badge,
      annotationPosition: platform === "instagram" ? "bottom" : "top",
      annotationAlign: "center",
      annotationBadgeColor: platform === "twitter" ? "#0284c7" : platform === "linkedin" ? "#2563eb" : "#ec4899",
      watermark: true,
      watermarkPlatform: platform === "twitter" ? "twitter" : platform === "instagram" ? "instagram" : "shots",
      watermarkText: "@framecraft_app",
      exportScale: 2,
    };

    return {
      content: [
        {
          type: "text",
          text: `### 🚀 Automated Social Post Generated for ${preset.name}!\n\n` +
            `* **Platform Target:** \`${platform.toUpperCase()}\`\n` +
            `* **Dimensions:** \`${preset.width} × ${preset.height}\` (\`${preset.ratio}\`)\n` +
            `* **Device Frame:** \`${device}\` with dynamic 3D angle (\`tiltX: ${tiltX}°, tiltY: ${tiltY}°\`)\n` +
            `* **Headline:** "${headline}" [${badge}]\n` +
            `* **Studio Polish:** Bokeh blur: \`${bgBlur}px\`, Film grain: \`15%\`\n\n` +
            `\`\`\`json\n${JSON.stringify(mockup, null, 2)}\n\`\`\``,
        },
      ],
    };
  }
);

// TOOL 4: Ray.so / Carbon Code Snippet Studio Generator
server.tool(
  "framecraft_code_snippet",
  "Creates a professional code snippet frame mockup (Ray.so / Carbon style) with syntax highlighting, IDE title and themes",
  {
    code: z.string().describe("Source code snippet string"),
    language: z.enum(["typescript", "javascript", "python", "rust", "go", "html", "css", "json", "sql"]).default("typescript"),
    theme: z.enum(["one-dark", "dracula", "tokyo-night", "github-dark", "monokai"]).default("one-dark"),
    title: z.string().default("snippet.ts").describe("File name or window title displayed in the macOS title bar"),
    showLineNumbers: z.boolean().default(true).describe("Show line numbers gutter"),
    background: z.enum(["glass", "obsidian", "mesh", "gradient"]).default("obsidian"),
  },
  async ({ code, language, theme, title, showLineNumbers, background }) => {
    let bg = "radial-gradient(circle at 50% 10%, rgba(129, 140, 248, 0.4) 0%, transparent 55%), linear-gradient(135deg, #090d16 0%, #1e1b4b 55%, #030712 100%)";
    if (background === "glass") {
      bg = "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.75) 0%, transparent 45%), linear-gradient(135deg, #e0e7ff 0%, #fae8ff 45%, #c7d2fe 100%)";
    } else if (background === "mesh") {
      bg = "linear-gradient(135deg, rgb(255, 110, 196) 0%, rgb(120, 115, 245) 50%, rgb(0, 212, 255) 100%)";
    }

    const config = {
      frameType: "code",
      codeSnippet: code,
      codeLanguage: language,
      codeTheme: theme,
      codeTitle: title,
      codeShowLineNumbers: showLineNumbers,
      backgroundValue: bg,
      aspectRatio: "16:10",
      customWidth: 1600,
      customHeight: 1000,
      padding: 56,
      borderRadius: 16,
      shadowMode: "adaptive",
      shadowOpacity: 55,
      tiltX: 0,
      tiltY: 0,
      tiltZ: 0,
      zoom: 100,
      watermark: true,
      watermarkText: "FrameCraft/code",
      backgroundBlur: 0,
      grainIntensity: 10,
    };

    return {
      content: [
        {
          type: "text",
          text: `### 💻 Code Snippet Studio Mockup Created!\n\n` +
            `* **Title:** \`${title}\` (${language.toUpperCase()})\n` +
            `* **Theme:** \`${theme}\`\n` +
            `* **Line Numbers:** ${showLineNumbers ? "Enabled" : "Disabled"}\n` +
            `* **Lines of Code:** ${code.split("\n").length}\n\n` +
            `\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``,
        },
      ],
    };
  }
);

// TOOL 5: Magic Palette Gradient Generator
server.tool(
  "framecraft_magic_palette",
  "Generates 4 harmonious studio gradients from one or more hex colors",
  {
    colors: z.array(z.string()).min(1).max(3).describe("Array of 1 to 3 hex color codes (e.g. ['#6366f1', '#ec4899'])"),
  },
  async ({ colors }) => {
    const c1 = colors[0] || "#6366f1";
    const c2 = colors[1] || "#ec4899";
    const c3 = colors[2] || "#090d16";

    const gradients = [
      {
        id: "magic-mesh",
        name: "Vibrant Studio Mesh",
        css: `radial-gradient(at 15% 15%, ${c1} 0px, transparent 55%), radial-gradient(at 85% 85%, ${c2} 0px, transparent 50%), radial-gradient(at 50% 50%, ${c1}33 0px, transparent 65%), linear-gradient(135deg, #09090b 0%, #18181b 100%)`,
      },
      {
        id: "magic-glow",
        name: "Ambient Accent Glow",
        css: `radial-gradient(circle at 50% 45%, ${c1}55 0%, transparent 65%), linear-gradient(145deg, #0d0f14 0%, #151821 50%, #07080a 100%)`,
      },
      {
        id: "magic-duo",
        name: "Harmonic Linear Duo",
        css: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      },
      {
        id: "magic-aurora",
        name: "Deep Velvet Contrast",
        css: `radial-gradient(circle at 80% 20%, ${c2}66 0%, transparent 50%), radial-gradient(circle at 20% 80%, ${c1}44 0%, transparent 55%), linear-gradient(135deg, #050608 0%, ${c3} 50%, #030406 100%)`,
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: `### ✨ Magic Studio Gradients Generated!\n\n` +
            gradients
              .map((g) => `#### ${g.name} (\`${g.id}\`)\n\`\`\`css\n${g.css}\n\`\`\``)
              .join("\n\n"),
        },
      ],
    };
  }
);

// Start the Stdio Server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((error) => {
  console.error("Fatal error starting FrameCraft Studio MCP Server:", error);
  process.exit(1);
});
