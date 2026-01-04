// ref: https://swharden.com/blog/2022-02-01-point-in-rectangle/

import { Delta } from "canva-editor/types";

export const isPointInsideBox = (
    point: Delta,
    {
        nw,
        ne,
        se,
        sw,
    }: {
        nw: Delta;
        ne: Delta;
        se: Delta;
        sw: Delta;
    },
) => {
    const a1 = Math.sqrt((nw.x - ne.x) * (nw.x - ne.x) + (nw.y - ne.y) * (nw.y - ne.y));
    const a2 = Math.sqrt((ne.x - se.x) * (ne.x - se.x) + (ne.y - se.y) * (ne.y - se.y));
    const a3 = Math.sqrt((se.x - sw.x) * (se.x - sw.x) + (se.y - sw.y) * (se.y - sw.y));
    const a4 = Math.sqrt((sw.x - nw.x) * (sw.x - nw.x) + (sw.y - nw.y) * (sw.y - nw.y));

    const b1 = Math.sqrt((nw.x - point.x) * (nw.x - point.x) + (nw.y - point.y) * (nw.y - point.y));
    const b2 = Math.sqrt((ne.x - point.x) * (ne.x - point.x) + (ne.y - point.y) * (ne.y - point.y));
    const b3 = Math.sqrt((se.x - point.x) * (se.x - point.x) + (se.y - point.y) * (se.y - point.y));
    const b4 = Math.sqrt((sw.x - point.x) * (sw.x - point.x) + (sw.y - point.y) * (sw.y - point.y));

    const u1 = (a1 + b1 + b2) / 2;
    const u2 = (a2 + b2 + b3) / 2;
    const u3 = (a3 + b3 + b4) / 2;
    const u4 = (a4 + b4 + b1) / 2;

    const A1 = Math.sqrt(u1 * (u1 - a1) * (u1 - b1) * (u1 - b2));
    const A2 = Math.sqrt(u2 * (u2 - a2) * (u2 - b2) * (u2 - b3));
    const A3 = Math.sqrt(u3 * (u3 - a3) * (u3 - b3) * (u3 - b4));
    const A4 = Math.sqrt(u4 * (u4 - a4) * (u4 - b4) * (u4 - b1));

    const difference = A1 + A2 + A3 + A4 - a1 * a2;
    return difference < 1;
};
