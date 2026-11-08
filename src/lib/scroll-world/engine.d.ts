export interface ScrollWorldSection {
  id: string;
  label?: string;
  still?: string;
  stillMobile?: string;
  clip?: string;
  clipMobile?: string;
  accent?: string;
  scroll?: number;
  linger?: number;
  copyAt?: number;
  remap?: number[];
  frames?: { base: string; count: number; ext?: string };
  framesMobile?: { base: string; count: number; ext?: string };
  eyebrow?: string;
  title?: string;
  body?: string;
  tags?: string[];
  cta?: { primary?: { label: string; href: string }; secondary?: { label: string; href: string } };
}
export interface ScrollWorldConfig {
  brand?: { name: string; href?: string };
  cta?: { label: string; href: string };
  topbar?: boolean;
  nav?: boolean;
  atmosphere?: boolean;
  hint?: string;
  diveScroll?: number;
  connScroll?: number;
  crossfade?: number;
  sections: ScrollWorldSection[];
  connectors?: (string | null)[];
  connectorsMobile?: (string | null)[];
}
export function mountScrollWorld(container: HTMLElement, config: ScrollWorldConfig): { end: () => number; progress: (i: number) => number; preload: (onProgress?: (p: number) => void) => Promise<void>; destroy: () => void };
