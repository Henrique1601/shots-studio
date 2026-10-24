import { useState } from "react";
import * as htmlToImage from "html-to-image";
import confetti from "canvas-confetti";
import JSZip from "jszip";
import { useMockupStore } from "@/store/mockupStore";

export function useExportStudio() {
  const {
    config,
    updateConfig,
    showToast,
    slides,
    activeSlideIndex,
    setActiveSlideIndex,
  } = useMockupStore();

  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = {
    quality: 0.95,
    pixelRatio: config.exportScale,
    cacheBust: false,
    skipFonts: true,
    filter: (node: HTMLElement) => {
      if (node.tagName === "SCRIPT" || node.tagName === "INPUT") return false;
      return true;
    },
  };

  const handleExport = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    if (config.exportFormat === "GIF") {
      await handleExportGif();
      return;
    }

    try {
      setIsExporting(true);
      let dataUrl: string;
      if (config.exportFormat === "JPEG") {
        dataUrl = await htmlToImage.toJpeg(node, exportOptions);
      } else {
        dataUrl = await htmlToImage.toPng(node, exportOptions);
      }

      const link = document.createElement("a");
      link.download = `shot-${Date.now()}.${config.exportFormat.toLowerCase()}`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.15 },
      });
      showToast(`Shot exportado com sucesso (${config.exportFormat})! 🚀`);
    } catch (err) {
      console.error("Export error:", err);
      showToast("Erro ao exportar imagem", "warning");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportVideo = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    try {
      setIsExporting(true);
      showToast("Gravando clipe de vídeo WebM... 🎬", "info");

      const initialCanvas = await htmlToImage.toCanvas(node, { pixelRatio: 1.5 });
      const recordCanvas = document.createElement("canvas");
      recordCanvas.width = initialCanvas.width;
      recordCanvas.height = initialCanvas.height;
      const ctx = recordCanvas.getContext("2d");
      if (!ctx) return;

      const stream = recordCanvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `shot-clip-${Date.now()}.webm`;
        a.click();
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.15 },
        });
        showToast("Vídeo exportado com sucesso (.webm)! 🎥");
        setIsExporting(false);
      };

      recorder.start();

      const durationMs = 3000;
      const startTime = Date.now();

      const captureFrame = async () => {
        if (Date.now() - startTime >= durationMs) {
          recorder.stop();
          return;
        }
        try {
          const frameCanvas = await htmlToImage.toCanvas(node, { pixelRatio: 1.5 });
          ctx.drawImage(frameCanvas, 0, 0);
        } catch {}
        requestAnimationFrame(captureFrame);
      };

      captureFrame();
    } catch (err) {
      console.error("Video export error:", err);
      showToast("Navegador não suporta gravação direta", "warning");
      setIsExporting(false);
    }
  };

  const handleExportGif = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    try {
      setIsExporting(true);
      showToast("Capturando quadros para o GIF animado... 🎞️", "info");

      const wasPlaying = config.isAnimationPlaying;
      if (!wasPlaying) {
        updateConfig({ isAnimationPlaying: true });
      }

      const frames: string[] = [];
      const frameCount = 14;
      const delayMs = 120;

      for (let i = 0; i < frameCount; i++) {
        const frameData = await htmlToImage.toPng(node, {
          pixelRatio: 0.85,
          skipFonts: true,
          filter: (n: HTMLElement) => n.tagName !== "SCRIPT" && n.tagName !== "INPUT",
        });
        frames.push(frameData);
        await new Promise((r) => setTimeout(r, delayMs));
      }

      if (!wasPlaying) {
        updateConfig({ isAnimationPlaying: false });
      }

      showToast("Codificando GIF animado em loop... ⚙️", "info");

      const gifshot = (await import("gifshot")).default;
      gifshot.createGIF(
        {
          images: frames,
          gifWidth: Math.min(640, Math.round(node.clientWidth * 0.8)),
          gifHeight: Math.min(480, Math.round(node.clientHeight * 0.8)),
          interval: 0.12,
          numWorkers: 2,
        },
        (obj) => {
          if (!obj.error && obj.image) {
            const link = document.createElement("a");
            link.download = `shot-animated-${Date.now()}.gif`;
            link.href = obj.image;
            link.click();
            confetti({ particleCount: 80, spread: 65, origin: { y: 0.2 } });
            showToast("GIF animado exportado com sucesso! 🎉", "success");
          } else {
            console.error("GIF error:", obj.errorMsg);
            showToast("Erro na geração do GIF animado", "warning");
          }
          setIsExporting(false);
        }
      );
    } catch (err) {
      console.error("GIF export failed:", err);
      showToast("Falha ao exportar GIF animado", "warning");
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    const node = document.getElementById("mockup-export-container");
    if (!node) return;
    try {
      const blob = await htmlToImage.toBlob(node, exportOptions);
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showToast("Copiado para a área de transferência! 📋");
      }
    } catch (e) {
      console.error("Copy error:", e);
      showToast("Erro ao copiar imagem", "warning");
    }
  };

  const handleExportAllSlidesZip = async () => {
    if (slides.length <= 1) {
      showToast("Adicione pelo menos 2 slides no carrossel para exportar em lote!", "info");
      return;
    }
    const node = document.getElementById("mockup-export-container");
    if (!node) return;

    setIsExporting(true);
    showToast("Iniciando renderização em lote dos slides... 📦", "info");

    try {
      const zip = new JSZip();
      const originalIndex = activeSlideIndex;

      for (let i = 0; i < slides.length; i++) {
        showToast(`Renderizando slide ${i + 1} de ${slides.length}... ⏳`, "info");
        setActiveSlideIndex(i);
        // Pause to ensure canvas renders slide state
        await new Promise((resolve) => setTimeout(resolve, 320));

        const dataUrl = await htmlToImage.toPng(node, exportOptions);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`slide-${String(i + 1).padStart(2, "0")}.png`, base64Data, { base64: true });
      }

      // Restore user's current slide
      setActiveSlideIndex(originalIndex);

      showToast("Compactando arquivo .ZIP... 🗜️", "info");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.download = `framecraft-carrossel-${Date.now()}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.2 },
      });
      showToast(`Carrossel de ${slides.length} slides exportado com sucesso em .ZIP! 🎉`, "success");
    } catch (err) {
      console.error("Batch ZIP export error:", err);
      showToast("Erro ao exportar carrossel em lote", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
    handleExportVideo,
    handleExportGif,
    handleCopy,
    handleExportAllSlidesZip,
  };
}
