export const hwb2hsv = ({ h, w, b }: { h: number; w: number; b: number }, a: number) => {
    return {
        h,
        s: Math.max(0, Math.min(100, b === 100 ? 0 : 100 - (w / (100 - b)) * 100)),
        v: 100 - b,
        a,
    };
};
