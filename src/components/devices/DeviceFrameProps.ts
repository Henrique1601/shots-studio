import type { MockupConfig } from "@/types/mockup";

export interface DeviceFrameProps {
  config: MockupConfig;
  imageUrl: string | null;
  onSlotClick: () => void;
  isSecondary?: boolean;
  filterStyle?: string;
  panTransformStyle?: string;
}
