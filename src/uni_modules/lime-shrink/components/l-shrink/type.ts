// @ts-nocheck
export interface IShrinkOptions {
  quality?: number;
  success?: () => void;
  error?: () => void;
  createImage?: () => HTMLImageElement;
  createCanvas?: () => HTMLCanvasElement;
}
export interface IShrinkImageOptions {
  quality?: number;
}
export interface IOffscreenCanvas extends UniApp.OffscreenCanvas {
  createImage: () => HTMLImageElement;
}
export type IFileTyep = string | File;
