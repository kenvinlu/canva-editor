export const hsv2hwb = ({ h, s, v }: { h: number; s: number; v: number }) => {
    return {
        h,
        w: ((100 - s) * v) / 100,
        b: 100 - v,
    };
};
