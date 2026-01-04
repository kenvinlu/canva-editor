import { HSLAColor } from './types';

export const isHSL = (color: Record<string, unknown>): color is HSLAColor => {
    return Object.keys(color).every((k) => ['h', 's', 'l', 'a'].includes(k));
};
