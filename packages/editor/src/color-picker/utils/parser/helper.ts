/// <reference lib="es2018.regexp" />

import { hex2rgb } from './hex2rgb';
import { rgb2hsv } from './rgb2hsv';
import { HSVAColor, RGBAColor } from './types';

export const parseColor = (color: string): HSVAColor => {
  try {
    let rgbColor;
    if (rgbColorRegex.test(color)) {
      rgbColor = parseRgba(color);
    } else if (hexColorRegex.test(color)) {
      rgbColor = parseHex(color);
    }

    if (rgbColor) {
      return rgb2hsv(rgbColor);
    }
  } catch (_) {
    console.warn(`Cannot parse ${color}`);
  }
  return { h: 0, s: 0, v: 0, a: 1 };
};

export const rgbColorRegex =
  /rgba?\((?<r>[.\d]+)[, ]+(?<g>[.\d]+)[, ]+(?<b>[.\d]+)(?:\s?[,\/]\s?(?<a>[.\d]+%?))?\)/i;
export const parseRgba = (color: string) => {
  const result = rgbColorRegex.exec(color);
  if (result?.groups) {
    return {
      r: parseInt(result.groups.r, 10),
      g: parseInt(result.groups.g, 10),
      b: parseInt(result.groups.b, 10),
      a: typeof result.groups.a !== 'undefined' ? parseInt(result.groups.a) : 1,
    } as RGBAColor;
  }
};

export const hexColorRegex = /^#[0-9A-F]{3,6}[0-9a-f]{0,2}$/i;
export const parseHex = (color: string): RGBAColor => {
  return hex2rgb(color);
};
