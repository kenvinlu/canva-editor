import { hex2rgb } from './hex2rgb';
import { rgb2hsv } from './rgb2hsv';

export const hex2hsv = (hex: string) => {
    const rgb = hex2rgb(hex);
    return rgb2hsv(rgb);
};
