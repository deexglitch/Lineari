import type { CSSProperties, ReactElement } from "react";

export interface SilkProps {
  color?: string;
  sheenColor?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  noiseIntensity?: number;
  sheen?: number;
  depth?: number;
  glow?: number;
  ripple?: number;
  wave?: number;
  variation?: number;
  mouseInteraction?: boolean;
  interactionStrength?: number;
  clickRipple?: boolean;
  intro?: boolean;
  fade?: number;
  lightMode?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare const Silk: (props: SilkProps) => ReactElement;
export default Silk;