﻿import React from "react";

export type Colour = { r: number; g: number; b: number; a: number };
export type ColourFormat = "raw" | "hex" | "rgb" | "hsl";
export type ToolToggleSettings = "always-eraser" | "last-tool" | "smart-toggle";

export interface ArtStoreProperties {
  keyIdentifier: string;
  canvasSize: { width: number; height: number };
  canvasBackground: string;
  selectedLayer: number;
  selectedFrame: number;
  previousTool: number;
  selectedTool: number;
  toolToggleSetting: ToolToggleSettings;
  selectedColour: string;
  currentAlpha: number;
  colourPalette: string[];
  isSaving: boolean;
  selectedArea: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
}

export interface ArtStoreState extends ArtStoreProperties {
  setIsSaving: (isSaving: boolean) => void;
  setKeyIdentifier: (key: string) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  setCanvasBackground: (background: string) => void;
  setSelectedLayer: (layer: number) => void;
  setSelectedFrame: (frame: number | ((prevFrame: number) => number)) => void;
  setPreviousTool: (tool: number) => void;
  setSelectedTool: (tool: number) => void;
  setToolToggleSetting: (setting: ToolToggleSettings) => void;
  setSelectedColour: (colour: string) => void;
  setColourPalette: (colours: string[]) => void;
  updateColourInPalette: (colour: string, index: number) => void;
  addColourToPalette: (colour: string) => void;
  setCurrentAlpha: (alpha: number) => void;
  setSelectedArea: (area: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  }) => void;
  reset: () => void;
}

export interface CanvasConfig {
  keyIdentifier?: string;
  canvasSize: { width: number; height: number };
  canvasBackground: string;
}

export interface DrawingTool {
  name: string;
  icon: React.ReactNode;
  trigger?: "up" | "down";
  doAfter?: boolean;
}

export interface FileTool {
  name: string;
  icon: React.ReactNode;
}

export interface Artwork {
  id?: number;
  keyIdentifier?: string;
  layers: Layer[];
  frames: number[];
}

export interface Layer {
  name: string;
  opacity: number;
  visible: boolean;
  locked: boolean;
  frames: Frame;
}

export interface Frame {
  [key: number]: ImageData | null;
}
