import type { CSSProperties, ReactElement } from 'react';

export interface DepthTextProps {
  text?: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: number;
  shadow?: boolean;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
}
export default function DepthText(props: DepthTextProps): ReactElement;
