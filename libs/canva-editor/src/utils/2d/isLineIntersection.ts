import { Delta } from "canva-editor/types";

export const isLineIntersection = (line1: [Delta, Delta], line2: [Delta, Delta]) => {
    const a_dx = line1[1].x - line1[0].x;
    const a_dy = line1[1].y - line1[0].y;
    const b_dx = line2[1].x - line2[0].x;
    const b_dy = line2[1].y - line2[0].y;
    const s = (-a_dy * (line1[0].x - line2[0].x) + a_dx * (line1[0].y - line2[0].y)) / (-b_dx * a_dy + a_dx * b_dy);
    const t = (+b_dx * (line1[0].y - line2[0].y) - b_dy * (line1[0].x - line2[0].x)) / (-b_dx * a_dy + a_dx * b_dy);
    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
};
