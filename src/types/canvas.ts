﻿import React from "react";

export interface CanvasConfig {
  width: number;
  height: number;
  background: string;
  randomKey?: string;
}

export type RawColour = Uint8ClampedArray;
export type ColourObject = { colour: {}; alpha: number };
export type GetColourResponse = RawColour | ColourObject;
export type ColourFormat = "raw" | "hex" | "rgb" | "hsl";

export interface ArtTool {
  name: string;
  icon: React.ReactNode;
  trigger?: "up" | "down";
  subTools?: ArtTool[];
}

export interface Layer {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  locked: boolean;
  frames: { [key: number]: ImageData | null };
}

export interface ArtworkObject {
  layers: Layer[];
  frames: number[];
}

export interface CanvasEditorProps {
  setColour?: (colour: string, alpha: number) => void;
  currentColour?: ColourObject;
  currentTool?: ArtTool;
  config?: CanvasConfig;
}
