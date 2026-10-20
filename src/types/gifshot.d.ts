declare module "gifshot" {
  export interface CreateGifOptions {
    images?: (string | HTMLCanvasElement | HTMLImageElement)[];
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    frameDuration?: number;
    sampleInterval?: number;
    numWorkers?: number;
  }

  export interface CreateGifResult {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image: string; // base64 data url
  }

  export function createGIF(
    options: CreateGifOptions,
    callback: (obj: CreateGifResult) => void
  ): void;

  export function isSupported(): boolean;
}
