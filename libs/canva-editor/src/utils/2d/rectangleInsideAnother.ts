import { BoxData } from 'canva-editor/types';
import { isPointInsideBox } from './isPointInsideBox';
import { visualCorners } from './visualCorners';
import { getTransformStyle } from 'canva-editor/layers';

export const rectangleInsideAnother = (active: BoxData, target: BoxData) => {
    const activeMatrix = new WebKitCSSMatrix(getTransformStyle({ rotate: active.rotate }));
    const activeCorners = visualCorners(
        {
            width: active.boxSize.width,
            height: active.boxSize.height,
        },
        activeMatrix,
        {
            x: active.position.x,
            y: active.position.y,
        },
    );
    const targetMatrix = new WebKitCSSMatrix(getTransformStyle({ rotate: target.rotate }));
    const targetCorners = visualCorners(
        {
            width: target.boxSize.width,
            height: target.boxSize.height,
        },
        targetMatrix,
        {
            x: target.position.x,
            y: target.position.y,
        },
    );

    const activePoints = [activeCorners.nw, activeCorners.ne, activeCorners.se, activeCorners.sw];
    return !activePoints.find((point) => !isPointInsideBox(point, targetCorners));
};
