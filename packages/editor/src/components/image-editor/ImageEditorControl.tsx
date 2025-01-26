import React, { FC, useEffect, useRef } from 'react';
import { useEditor } from '../../hooks';
import ImageEditorHandler from './ImageEditorHandler';
import { ImageLayerProps } from '../../layers/ImageLayer';
import { useResizeImage } from './useResizeImage';
import { useLinkedRef } from '../../hooks/useLinkedRef';
import { useDrag } from './useDrag';
import { BoxData, ImageEditorData } from 'canva-editor/types';
import { distanceBetweenPoints } from 'canva-editor/utils/2d/distanceBetweenPoints';
import { horizontalAndVerticalChange } from 'canva-editor/utils/2d/horizontalAndVerticalChange';
import { angleBetweenPoints } from 'canva-editor/utils/2d/angleBetwwenPoints';
import { getTransformStyle } from 'canva-editor/layers';

const ImageEditorControl: FC = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [resizeData, getResizeData, setResizeData] = useLinkedRef<BoxData>();
    const [, getDragData, setDragData] = useLinkedRef<number>();
    const { imageEditor, actions, scale } = useEditor((state) => {
        const imageEditor = state.imageEditor as ImageEditorData;
        return {
            imageEditor,
            scale: state.scale,
            originalLayer: state.pages[imageEditor.pageIndex].layers[imageEditor.layerId],
        };
    });
    const layer = imageEditor.image;
    /*
    const { startRotate } = useRotate({
        getData: getRotateData as () => { centerX: number; centerY: number },
        onRotateStart: () => {
            if (ref.current && imageEditor) {
                const rect = ref.current.getBoundingClientRect();
                const centerX = (rect.width + rect.x * 2) / 2;
                const centerY = (rect.height + rect.y * 2) / 2;
                setRotateData({ centerX, centerY });
            }
        },
        onRotate: (degrees) => {
            if (imageEditor) {
                const imagePos = positionOfObjectInsideAnother(imageEditor, imageEditor.image);
                let visualImage = visualCorners(
                    imageEditor.image.boxSize,
                    new WebKitCSSMatrix(getTransformStyle({ rotate: degrees })),
                    imagePos,
                );
                const visualBox = visualCorners(
                    imageEditor.boxSize,
                    new WebKitCSSMatrix(getTransformStyle({ rotate: imageEditor.rotate })),
                    imageEditor.position,
                );
                const change = {
                    width: 0,
                    height: 0,
                };
                const ratio = imageEditor.image.boxSize.width / imageEditor.image.boxSize.height;
                while (isBoxIntersectionAnother(visualBox, visualImage).rect2.length !== 0) {
                    change.width += 1;
                    change.height += ratio;
                    visualImage = visualCorners(
                        {
                            width: imageEditor.image.boxSize.width + change.width,
                            height: imageEditor.image.boxSize.height + change.height,
                        },
                        new WebKitCSSMatrix(getTransformStyle({ rotate: degrees })),
                        {
                            x: imagePos.x - change.width / 2,
                            y: imagePos.y - change.height / 2,
                        },
                    );
                }
                imageEditorActions.update({
                    image: {
                        rotate: degrees - imageEditor.rotate,
                        boxSize: {
                            width: imageEditor.image.boxSize.width + change.width,
                            height: imageEditor.image.boxSize.height + change.height,
                        },
                        position: {
                            x: imageEditor.image.position.x - change.width / 2,
                            y: imageEditor.image.position.y - change.height / 2,
                        },
                    },
                });
            }
        },
    });
*/
    const { startDrag } = useDrag({
        getData: getDragData as () => number,
        onDragStart: () => {
            if (imageEditor) {
                setDragData(imageEditor.rotate);
            }
        },
    });

    useEffect(() => {
        const handleFunc = (event: MouseEvent) => {
            const el = ref?.current;
            const boxEl = boxRef?.current;
            if (
                !el ||
                el.contains(event.target as Node) ||
                (imageEditor.layerId !== 'ROOT' && boxEl?.contains(event.target as Node))
            ) {
                return;
            }
            actions.closeImageEditor();
        };
        window.addEventListener('mousedown', handleFunc, { capture: true });
        return () => {
            window.removeEventListener('mousedown', handleFunc, { capture: true });
        };
    }, []);
    const { startResize: handleResizeImageStart } = useResizeImage({
        lockAspect: true,
        getData: getResizeData as () => BoxData,
        onResizeStart: () => {
            if (layer) {
                setResizeData({
                    boxSize: layer.boxSize,
                    position: layer.position,
                    rotate: layer.rotate,
                });
            }
        },
        onResize: ({ boxSize, position, rotate }, direction) => {
            if (imageEditor && resizeData.current && layer) {
                let changeX = Math.min(position.x, 0);
                let changeY = Math.min(position.y, 0);
                let width = boxSize.width;
                let height = boxSize.height;
                const ratio = resizeData.current.boxSize.width / resizeData.current.boxSize.height;
                const diffX = resizeData.current.position.x * -1 - resizeData.current.position.y * -1 * ratio; // > 0 ? y : x
                const diffY = resizeData.current.position.y * -1 - (resizeData.current.position.x * -1) / ratio;
                const rateByX = resizeData.current.position.x / resizeData.current.position.y;
                if (['topLeft'].includes(direction)) {
                    const ratio = imageEditor.boxSize.width / imageEditor.boxSize.height;
                    const mY = position.y - changeY;
                    const mX = position.x - changeX;
                    if (mY > 0 || mX > 0) {
                        if (rateByX > ratio) {
                            changeX = -diffX;
                            width += position.x - changeX;
                            height += +position.y;
                        } else {
                            changeY = -diffY;
                            width += position.x;
                            height += +position.y - changeY;
                        }
                    }
                } else if (
                    direction === 'bottomRight' &&
                    (boxSize.width < imageEditor.boxSize.width - layer.position.x ||
                        boxSize.height < imageEditor.boxSize.height - layer.position.y)
                ) {
                    const minWidth = Math.max(boxSize.width, imageEditor.boxSize.width - layer.position.x);
                    const minHeight = Math.max(boxSize.height, imageEditor.boxSize.height - layer.position.y);
                    if (minWidth / minHeight > ratio) {
                        width = imageEditor.boxSize.width - layer.position.x;
                        height = width / ratio;
                    } else if (minWidth / minHeight < ratio) {
                        height = imageEditor.boxSize.height - layer.position.y;
                        width = height * ratio;
                    }
                } else if (
                    direction === 'topRight' &&
                    (position.y > 0 || boxSize.width < imageEditor.boxSize.width - resizeData.current.position.x)
                ) {
                    const minWidth = imageEditor.boxSize.width - resizeData.current.position.x;
                    const diffRight = resizeData.current?.boxSize.width - minWidth;
                    const rateByX = (diffRight / resizeData.current.position.y) * -1;
                    if (rateByX > ratio) {
                        height = Math.max(
                            resizeData.current.boxSize.height + resizeData.current.position.y,
                            boxSize.height,
                        );
                        width = height * ratio;
                    } else {
                        width = Math.max(imageEditor.boxSize.width - resizeData.current.position.x, boxSize.width);
                        height = width / ratio;
                        changeY = resizeData.current.position.y + diffRight / ratio;
                    }
                } else if (
                    direction === 'bottomLeft' &&
                    (position.x > 0 || boxSize.height < imageEditor.boxSize.height - resizeData.current.position.y)
                ) {
                    const minHeight = imageEditor.boxSize.height - resizeData.current.position.y;
                    const diffBottom = resizeData.current?.boxSize.height - minHeight;
                    const rateByY = (diffBottom / resizeData.current.position.x) * -1 || 0;
                    if (rateByY > ratio) {
                        width = Math.max(
                            resizeData.current.boxSize.width + resizeData.current.position.x,
                            boxSize.width,
                        );
                        height = width / ratio;
                    } else {
                        height = Math.max(imageEditor.boxSize.height - resizeData.current.position.y, boxSize.height);
                        width = height * ratio;
                        changeX = resizeData.current.position.x + diffBottom * ratio;
                    }
                }
                actions.updateImageEditor({
                    image: {
                        boxSize: {
                            width: width,
                            height: height,
                        },
                        position: {
                            x: changeX,
                            y: changeY,
                        },
                        rotate,
                    },
                });
            }
        },
    });
    const { startResize: handleResizeLayerStart } = useResizeImage({
        getData: getResizeData as () => BoxData,
        onResizeStart: () => {
            if (imageEditor) {
                setResizeData({
                    boxSize: imageEditor.boxSize,
                    position: imageEditor.position,
                    rotate: imageEditor.rotate,
                });
            }
        },
        onResize: ({ boxSize, position, rotate }, direction, oldPos, newPos) => {
            if (imageEditor && resizeData.current && layer) {
                const distance = distanceBetweenPoints(oldPos, newPos, scale);
                const change = horizontalAndVerticalChange(
                    imageEditor.rotate,
                    angleBetweenPoints(oldPos, newPos),
                    distance,
                );
                let x = layer.position.x;
                let y = layer.position.y;
                switch (direction) {
                    case 'topLeft':
                        x -= change.width;
                        y -= change.height;
                        break;
                    case 'bottomLeft':
                        x -= change.width;
                        break;
                    case 'topRight':
                        y -= change.height;
                        break;
                }
                const changeX = Math.min(x, 0);
                const changeY = Math.min(y, 0);
                actions.updateImageEditor({
                    boxSize: {
                        width: Math.min(boxSize.width + (changeX - x), layer.boxSize.width + changeX),
                        height: Math.min(boxSize.height + (changeY - y), layer.boxSize.height + changeY),
                    },
                    position: {
                        x: Math.max(position.x, resizeData.current.position.x + layer.position.x),
                        y: Math.max(position.y, resizeData.current.position.y + layer.position.y),
                    },
                    rotate,
                    image: {
                        position: {
                            x: changeX,
                            y: changeY,
                        },
                    },
                });
            }
        },
        onResizeEnd: ({ boxSize, position, rotate }) => {
            if (imageEditor) {
                actions.setProp<ImageLayerProps>(imageEditor.pageIndex, imageEditor.layerId, {
                    boxSize,
                    position,
                    rotate,
                });
            }
        },
    });

    if (!layer) {
        return null;
    }

    return (
        <div css={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
            <div
                css={{
                    width: imageEditor.boxSize.width * scale,
                    height: imageEditor.boxSize.height * scale,
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    transform: getTransformStyle({
                        position: {
                            x: imageEditor.position.x * scale,
                            y: imageEditor.position.y * scale,
                        },
                        rotate: imageEditor.rotate,
                    }),
                }}
            >
                <div
                    ref={ref}
                    css={{
                        width: layer.boxSize.width * scale,
                        height: layer.boxSize.height * scale,
                        left: 0,
                        top: 0,
                        position: 'absolute',
                        outline: '2px solid rgba(61, 142, 255,.5)',
                        boxShadow: '0 0 0 1px hsla(0,0%,100%,.07), inset 0 0 0 1px hsla(0,0%,100%,.07)',
                        transform: getTransformStyle({
                            position: {
                                x: layer.position.x * scale,
                                y: layer.position.y * scale,
                            },
                            rotate: layer.rotate,
                        }),
                    }}
                    onTouchStart={startDrag}
                    onMouseDown={startDrag}
                >
                    <div css={{ position: 'absolute', inset: -12, pointerEvents: 'auto', cursor: 'move' }}></div>
                    <ImageEditorHandler direction={'topLeft'} onResizeStart={handleResizeImageStart} />
                    <ImageEditorHandler direction={'topRight'} onResizeStart={handleResizeImageStart} />
                    <ImageEditorHandler direction={'bottomRight'} onResizeStart={handleResizeImageStart} />
                    <ImageEditorHandler direction={'bottomLeft'} onResizeStart={handleResizeImageStart} />
                </div>
            </div>
        </div>
    );
};

export default ImageEditorControl;
