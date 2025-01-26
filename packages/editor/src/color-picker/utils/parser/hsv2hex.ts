import { hsv2rgb } from './hsv2rgb';
import { rgb2hex } from './rgb2hex';

export const hsv2hex = ({ h, s, v, a }: { h: number; s: number; v: number; a: number }) => {
    const rgb = hsv2rgb({ h, s, v, a });
    return rgb2hex(rgb);
};
