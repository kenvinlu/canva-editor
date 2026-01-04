export const hsv2hsl = ({ h, s, v, a }: { h: number; s: number; v: number; a: number }) => {
    const hh = ((200 - s) * v) / 100;

    return {
        h: h,
        s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
        l: hh / 2,
        a,
    };
};

export const hsv2hslString = ({ h, s, v, a }: { h: number; s: number; v: number; a: number }) => {
    const hsl = hsv2hsl({ h, s, v, a });
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`;
};
