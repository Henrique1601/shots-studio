import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://framecraft.app"),
  title: "FrameCraft — 3D Mockup Generator & Visual Craft Studio",
  description:
    "Craft studio-grade 3D device mockups for iPhone 17, MacBook Pro, iPad, Apple Watch, and Desktop. High-resolution export in 4K/6K, intelligent auto-contain, and studio lighting.",
  keywords: [
    "framecraft",
    "mockup generator",
    "3d mockup",
    "device mockup",
    "iphone 17 mockup",
    "macbook mockup",
    "screenshot beautifier",
    "presentation studio",
  ],
  authors: [{ name: "Henrique Bezerra" }],
  openGraph: {
    title: "FrameCraft — 3D Mockup Generator & Visual Studio",
    description:
      "Craft high-fidelity 3D device mockups directly in your browser. iPhone 17, MacBook Pro, Watch Ultra and sleek Browser frames.",
    url: "https://framecraft.app",
    siteName: "FrameCraft",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/shots-assets/apple-touch-icon-512.png",
        width: 512,
        height: 512,
        alt: "FrameCraft Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameCraft — 3D Mockup Generator & Visual Studio",
    description:
      "Craft high-fidelity 3D device mockups directly in your browser. iPhone 17, MacBook Pro, Watch Ultra and sleek Browser frames.",
    images: ["/shots-assets/apple-touch-icon-512.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/shots-assets/apple-touch-icon-192.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
