import { isLineIntersection } from './isLineIntersection';
import { cornersToLines } from './cornersToLines';
import { Delta } from 'canva-editor/types';

export const isBoxIntersectionAnother = (
    rect1: {
        nw: Delta;
        ne: Delta;
        se: Delta;
        sw: Delta;
    },
    rect2: {
        nw: Delta;
        ne: Delta;
        se: Delta;
        sw: Delta;
    },
) => {
    const lineOfRect1 = cornersToLines(rect1);
    const lineOfRect2 = cornersToLines(rect2);
    const error: Record<string, string[]> = {
        rect1: [],
        rect2: [],
    };
    const err = ['top', 'right', 'bottom', 'left'];
    lineOfRect1.forEach((line1, index1) => {
        return lineOfRect2.forEach((line2, index2) => {
            const check = !isLineIntersection(line1, line2);
            if (!check) {
                error.rect1.push(err[index1]);
                error.rect2.push(err[index2]);
            }
            /*
            return !isLineIntersection(
                [
                    { x: Math.round(line1[0].x), y: Math.round(line1[0].y) },
                    { x: Math.round(line1[1].x), y: Math.round(line1[1].y) },
                ],
                [
                    { x: Math.round(line2[0].x), y: Math.round(line2[0].y) },
                    { x: Math.round(line2[1].x), y: Math.round(line2[1].y) },
                ],
            );*/
        });
    });
    return error;
};
