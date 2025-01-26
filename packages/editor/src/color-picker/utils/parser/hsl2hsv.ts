export const hsl2hsv = ({ h, s, l, a }: { h: number; s: number; l: number; a: number }) => {
    s *= (l < 50 ? l : 100 - l) / 100;

    return {
        h: h,
        s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
        v: l + s,
        a,
    };
};
