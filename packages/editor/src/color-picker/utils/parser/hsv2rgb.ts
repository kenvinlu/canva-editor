export const hsv2rgb = ({ h, s, v, a }: { h: number; s: number; v: number; a: number }) => {
    s = s / 100;
    v = v / 100;

    let rgb: any = [];
    const c = v * s;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));
    const m = v - c;

    if (hh >= 0 && hh < 1) {
        rgb = [c, x, 0];
    } else if (hh >= 1 && hh < 2) {
        rgb = [x, c, 0];
    } else if (hh >= 2 && hh < 3) {
        rgb = [0, c, x];
    } else if (h >= 3 && hh < 4) {
        rgb = [0, x, c];
    } else if (h >= 4 && hh < 5) {
        rgb = [x, 0, c];
    } else if (h >= 5 && hh <= 6) {
        rgb = [c, 0, x];
    } else {
        rgb = [0, 0, 0];
    }

    return {
        r: Math.round(255 * (rgb[0] + m)),
        g: Math.round(255 * (rgb[1] + m)),
        b: Math.round(255 * (rgb[2] + m)),
        a,
    };
};
