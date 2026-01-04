import { rgb2hsv } from './rgb2hsv';
import { hsv2hsl } from './hsv2hsl';

export const rgb2hsl = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) => {
    return hsv2hsl(rgb2hsv({ r, g, b, a }));
};

export const rgbString2hsl = (rgb: string) => {
    const colors = ['r', 'g', 'b', 'a'];
    const colorArr = rgb
        .slice(rgb.indexOf('(') + 1, rgb.indexOf(')'))
        .split(',')
        .map((c) => c.trim());
    const obj: { r: number; g: number; b: number; a: number } = { r: 0, g: 0, b: 0, a: 1 };
    colorArr.forEach((k, i) => {
        const key = colors[i] as keyof typeof obj;
        obj[key] = parseInt(k, 10);
    });
    return hsv2hsl(rgb2hsv(obj));
};
