import { HSVAColor } from './types';

export const isHSV = (color: Record<string, unknown>): color is HSVAColor => {
    return Object.keys(color).every((k) => ['h', 's', 'v', 'a'].includes(k));
};
