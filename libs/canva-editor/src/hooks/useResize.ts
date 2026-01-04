import { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { getTransformStyle } from 'canva-editor/layers';
import { BoxData, BoxSize, Delta } from 'canva-editor/types';
import { Direction } from 'canva-editor/types/resize';
import { angleBetweenPoints } from 'canva-editor/utils/2d/angleBetwwenPoints';
import { distanceBetweenPoints } from 'canva-editor/utils/2d/distanceBetweenPoints';
import { getPositionChangesBetweenTwoCorners } from 'canva-editor/utils/2d/getPositionChangesBetweenTwoCorners';
import { getSizeWithRatio } from 'canva-editor/utils/2d/getSizeWithRatio';
import { horizontalAndVerticalChange } from 'canva-editor/utils/2d/horizontalAndVerticalChange';
import { visualCorners } from 'canva-editor/utils/2d/visualCorners';
import { useEditor } from '.';

export const useResize = (getData: () => BoxData) => {
    const { frameScale } = useEditor((state) => ({ frameScale: state.scale }));
    const MIN_WIDTH = 20;
    const MIN_HEIGHT = 20;
    return useMemo(
        () => ({
            getResized: (
                direction: Direction,
                original: { clientX: number; clientY: number },
                newPosition: { clientX: number; clientY: number },
                lockAspect: boolean,
            ): BoxData => {
                const { boxSize, position, rotate, scale } = getData();
                const ratio = boxSize.width / boxSize.height;
                const matrix = new WebKitCSSMatrix(getTransformStyle({ position, rotate }));
                const distance = distanceBetweenPoints(original, newPosition, frameScale);
                const change = horizontalAndVerticalChange(rotate, angleBetweenPoints(original, newPosition), distance);
                const newSize = getNewSize(boxSize, change, position, direction);
                const sizeWithLimit = {
                    ...newSize,
                    width: Math.max(MIN_WIDTH, newSize.width),
                    height: Math.max(MIN_HEIGHT, newSize.height),
                };
                const newSizeWithLockAspect = getSizeWithRatio(sizeWithLimit, ratio, lockAspect);
                const oldCorners = visualCorners(boxSize, matrix, position);
                const newCorners = visualCorners(newSizeWithLockAspect, matrix, newSizeWithLockAspect);
                const { changeX, changeY } = getPositionChangesBetweenTwoCorners(oldCorners, newCorners, direction);
                return {
                    boxSize: newSizeWithLockAspect,
                    position: {
                        x: newSizeWithLockAspect.x - changeX,
                        y: newSizeWithLockAspect.y - changeY,
                    },
                    rotate,
                    scale,
                };
            },
        }),
        [getData, frameScale],
    );
};

const getNewSize = (oldSize: BoxSize, change: BoxSize, position: Delta, direction: Direction) => {
    switch (direction) {
        case 'top':
            return {
                x: position.x,
                y: position.y + change.height,
                width: oldSize.width,
                height: oldSize.height - change.height,
            };
        case 'bottom':
            return {
                x: position.x,
                y: position.y,
                width: oldSize.width,
                height: oldSize.height + change.height,
            };
        case 'left':
            return {
                x: position.x + change.width,
                y: position.y,
                width: oldSize.width - change.width,
                height: oldSize.height,
            };
        case 'right':
            return {
                x: position.x,
                y: position.y,
                width: oldSize.width + change.width,
                height: oldSize.height,
            };
        case 'topLeft':
            return {
                x: position.x + change.width,
                y: position.y + change.height,
                width: oldSize.width - change.width,
                height: oldSize.height - change.height,
            };
        case 'bottomLeft':
            return {
                x: position.x + change.width,
                y: position.y,
                width: oldSize.width - change.width,
                height: oldSize.height + change.height,
            };
        case 'bottomRight':
            return {
                x: position.x,
                y: position.y,
                width: oldSize.width + change.width,
                height: oldSize.height + change.height,
            };
        default: //topRight
            return {
                x: position.x,
                y: position.y + change.height,
                width: oldSize.width + change.width,
                height: oldSize.height - change.height,
            };
    }
};

export const getImageSize = (
    box: BoxData,
    image: BoxData,
    direction: Direction,
    change: { width: number; height: number },
) => {
    const res = cloneDeep({
        boxSize: box.boxSize,
        position: box.position,
        rotate: box.rotate,
        scale: box.scale,
        image: {
            boxSize: image.boxSize,
            position: image.position,
            rotate: image.rotate,
        },
    });
    const imageRatio = image.boxSize.width / image.boxSize.height;
    if (change.width !== 0) {
        res.boxSize.width += change.width;
        if (direction.toLowerCase().includes('left')) {
            if (change.width > Math.abs(res.image.position.x)) {
                //resize image
                res.image.position.x = 0;
                const changeImageSize = change.width - Math.abs(image.position.x);
                res.image.boxSize.width += changeImageSize;
                res.image.boxSize.height += changeImageSize * imageRatio;
            } else {
                res.image.position.x += change.width;
            }
        }
        if (direction.toLowerCase().includes('right')) {
            if (change.width + box.boxSize.width - image.position.x > image.boxSize.width) {
                //resize image
                const changeImageSize = change.width + box.boxSize.width - image.position.x - image.boxSize.width;
                res.image.boxSize.width += changeImageSize;
                res.image.boxSize.height += changeImageSize * imageRatio;
            }
        }
    }
    if (change.height !== 0) {
        res.boxSize.height += change.height;
        if (direction.toLowerCase().includes('top')) {
            if (change.height > Math.abs(res.image.position.y)) {
                //resize image
                res.image.position.y = 0;
                const changeImageSize = change.height - Math.abs(image.position.y);
                res.image.boxSize.height += changeImageSize;
                res.image.boxSize.width += changeImageSize / imageRatio;
            } else {
                res.image.position.y += change.height;
            }
        }
        if (direction.toLowerCase().includes('bottom')) {
            if (change.height + box.boxSize.height - image.position.y > image.boxSize.height) {
                //resize image
                const changeImageSize = change.height + box.boxSize.height - image.position.y - image.boxSize.height;
                res.image.boxSize.height += changeImageSize;
                res.image.boxSize.width += changeImageSize / imageRatio;
            }
        }
    }
    return res;
};

export const getVideoSize = (
    box: BoxData,
    video: BoxData,
    direction: Direction,
    change: { width: number; height: number },
) => {
    const res = cloneDeep({
        boxSize: box.boxSize,
        position: box.position,
        rotate: box.rotate,
        scale: box.scale,
        image: {
            boxSize: video.boxSize,
            position: video.position,
            rotate: video.rotate,
        },
    });
    const imageRatio = video.boxSize.width / video.boxSize.height;
    if (change.width !== 0) {
        res.boxSize.width += change.width;
        if (direction.toLowerCase().includes('left')) {
            if (change.width > Math.abs(res.image.position.x)) {
                //resize image
                res.image.position.x = 0;
                const changeImageSize = change.width - Math.abs(video.position.x);
                res.image.boxSize.width += changeImageSize;
                res.image.boxSize.height += changeImageSize * imageRatio;
            } else {
                res.image.position.x += change.width;
            }
        }
        if (direction.toLowerCase().includes('right')) {
            if (change.width + box.boxSize.width - video.position.x > video.boxSize.width) {
                //resize image
                const changeImageSize = change.width + box.boxSize.width - video.position.x - video.boxSize.width;
                res.image.boxSize.width += changeImageSize;
                res.image.boxSize.height += changeImageSize * imageRatio;
            }
        }
    }
    if (change.height !== 0) {
        res.boxSize.height += change.height;
        if (direction.toLowerCase().includes('top')) {
            if (change.height > Math.abs(res.image.position.y)) {
                //resize image
                res.image.position.y = 0;
                const changeImageSize = change.height - Math.abs(video.position.y);
                res.image.boxSize.height += changeImageSize;
                res.image.boxSize.width += changeImageSize / imageRatio;
            } else {
                res.image.position.y += change.height;
            }
        }
        if (direction.toLowerCase().includes('bottom')) {
            if (change.height + box.boxSize.height - video.position.y > video.boxSize.height) {
                //resize image
                const changeImageSize = change.height + box.boxSize.height - video.position.y - video.boxSize.height;
                res.image.boxSize.height += changeImageSize;
                res.image.boxSize.width += changeImageSize / imageRatio;
            }
        }
    }
    return res;
};
