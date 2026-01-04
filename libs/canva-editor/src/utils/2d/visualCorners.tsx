import { BoxSize, Delta } from 'canva-editor/types';
import { applyToPoint } from '../applyToPoint';

export const visualCorners = (size: BoxSize, matrix: WebKitCSSMatrix, position: Delta) => {
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;
    const nw = { x: -halfWidth, y: -halfHeight };
    const ne = { x: halfWidth, y: -halfHeight };
    const sw = { x: -halfWidth, y: halfHeight };
    const se = { x: halfWidth, y: halfHeight };
    const tnw = applyToPoint(matrix, nw);
    const tne = applyToPoint(matrix, ne);
    const tsw = applyToPoint(matrix, sw);
    const tse = applyToPoint(matrix, se);
    return {
        nw: {
            x: tnw.x + halfWidth + position.x,
            y: tnw.y + halfHeight + position.y,
        },
        ne: {
            x: tne.x + halfWidth + position.x,
            y: tne.y + halfHeight + position.y,
        },
        sw: {
            x: tsw.x + halfWidth + position.x,
            y: tsw.y + halfHeight + position.y,
        },
        se: {
            x: tse.x + halfWidth + position.x,
            y: tse.y + halfHeight + position.y,
        },
    };
};
