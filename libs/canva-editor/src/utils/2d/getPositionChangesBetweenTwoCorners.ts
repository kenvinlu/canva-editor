import { Direction } from 'canva-editor/types/resize';
import { visualCorners } from './visualCorners';

type Corner = ReturnType<typeof visualCorners>;
export const getPositionChangesBetweenTwoCorners = (oldCorners: Corner, newCorners: Corner, direction: Direction) => {
    let changeX: number, changeY: number;
    switch (direction) {
        case 'topRight':
            changeX = newCorners.sw.x - oldCorners.sw.x;
            changeY = newCorners.sw.y - oldCorners.sw.y;
            break;
        case 'bottomLeft':
            changeX = newCorners.ne.x - oldCorners.ne.x;
            changeY = newCorners.ne.y - oldCorners.ne.y;
            break;
        case 'top':
        case 'left':
        case 'topLeft':
            changeX = newCorners.se.x - oldCorners.se.x;
            changeY = newCorners.se.y - oldCorners.se.y;
            break;
        default:
            changeX = newCorners.nw.x - oldCorners.nw.x;
            changeY = newCorners.nw.y - oldCorners.nw.y;
    }
    return {
        changeX,
        changeY,
    };
};
