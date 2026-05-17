export type FontFamily = "display" | "sans" | "mono";
export type BrandColor = "burgundy" | "cream" | "tinta" | "mostaza";
export type Animation = "none" | "fade-up" | "fade-in" | "slide-left" | "scale-in";

export interface SliderProp {
  value: number;
  unit: "vw" | "vh" | "px" | "rem";
  min: number;
  max: number;
  step: number;
}

export interface FontProp {
  value: FontFamily;
  options: FontFamily[];
}

export interface ColorProp {
  value: BrandColor;
  options: BrandColor[];
}

export interface ImageProp {
  value: string;
  folder: string;
}

export interface AnimationProp {
  value: Animation;
  options: Animation[];
}

export interface TextElement {
  type: "text";
  props: Record<string, SliderProp | FontProp | ColorProp | AnimationProp | string>;
}

export interface ImageElement {
  type: "image";
  props: Record<string, SliderProp | ImageProp | AnimationProp>;
}

export type DesignElement = TextElement | ImageElement;

export interface Zone {
  label: string;
  elements: Record<string, DesignElement>;
}

export interface PageConfig {
  page: string;
  zones: Record<string, Zone>;
}
