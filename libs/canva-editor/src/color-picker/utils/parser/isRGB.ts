import { RGBAColor } from './types';

export const isRGB = (color: Record<string, unknown> | string): color is RGBAColor => {
    return Object.keys(color).every((k) => ['r', 'g', 'b', 'a'].includes(k));
};
