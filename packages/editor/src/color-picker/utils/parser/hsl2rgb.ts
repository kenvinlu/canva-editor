import { hsl2hsv } from './hsl2hsv';
import { hsv2rgb } from './hsv2rgb';

export const hsl2rgb = (hsl: { h: number; s: number; l: number; a: number }) => {
    const hsv = hsl2hsv(hsl);
    return hsv2rgb(hsv);
};
