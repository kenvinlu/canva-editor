import { forwardRef, ForwardRefRenderFunction, Fragment, PropsWithChildren, useContext } from 'react';
import CornerResizeHandler, { HANDLER_CORNER_SIZE } from './CornerResizeHandler';
import ResizeHandler, { HANDLER_SIZE } from './ResizeHandler';
import RotateHandle from './RotateHandle';
import { useEditor } from '../../hooks';
import { BoxSize, Delta } from 'canva-editor/types';
import { Direction, ResizeCallback } from 'canva-editor/types/resize';
import { useForwardedRef } from '../../hooks/useForwardedRef';
import { PageContext } from '../core/PageContext';
import { getTransformStyle } from '..';

interface ResizeBoxProps {
    boxSize: BoxSize;
    position: Delta;
    scale?: number;
    rotate: number;
    disabled: {
        vertical: boolean;
        horizontal: boolean;
        corners: boolean;
        rotate: boolean;
        scalable: boolean;
    };
    locked: boolean;
    onResizeStart?: ResizeCallback;
    onRouteStart: (e: TouchEvent | MouseEvent) => void;
}
const ControlBox: ForwardRefRenderFunction<HTMLDivElement, PropsWithChildren<ResizeBoxProps>> = (
    { boxSize, position, rotate, disabled, locked, onResizeStart, onRouteStart },
    ref,
) => {
    const boxRef = useForwardedRef<HTMLDivElement>(ref);
    const { pageIndex } = useContext(PageContext);
    const { imageEditor, isRotating, isDragging, frameScale, selectState, isGroup, resizeDirection, isPageLocked } =
        useEditor((state) => ({
            isGroup: state.selectedLayers[pageIndex].length > 1,
            imageEditor: state.imageEditor,
            isDragging: state.dragData.status,
            isRotating: state.rotateData.status,
            resizeDirection: state.resizeData.direction,
            frameScale: state.scale,
            selectState: state.selectData.status,
            isPageLocked: state.pages[pageIndex].layers.ROOT.data.locked,
        }));
    const handleResizeStart = (e: MouseEvent | TouchEvent, direction: Direction) => {
        onResizeStart && onResizeStart(e, direction);
    };

    if (imageEditor) {
        return null;
    }
    return (
        <div
            ref={boxRef}
            css={{
                position: 'absolute',
                zIndex: 1
            }}
            style={{
                transform: getTransformStyle({
                    position: { x: position.x * frameScale, y: position.y * frameScale },
                    rotate,
                }),
                width: boxSize.width * frameScale,
                height: boxSize.height * frameScale,
            }}
        >
            {!isDragging && !locked && !selectState && !isPageLocked && (
                <Fragment>
                    {!disabled.corners && !isRotating && (
                        <Fragment>
                            {(!resizeDirection || resizeDirection === 'topLeft') && (
                                <CornerResizeHandler
                                    top={-HANDLER_CORNER_SIZE}
                                    left={-HANDLER_CORNER_SIZE}
                                    direction={'topLeft'}
                                    isActive={resizeDirection === 'topLeft'}
                                    rotate={rotate}
                                    onResizeStart={handleResizeStart}
                                />
                            )}
                            {(!resizeDirection || resizeDirection === 'topRight') && (
                                <CornerResizeHandler
                                    top={-HANDLER_CORNER_SIZE}
                                    right={-HANDLER_CORNER_SIZE}
                                    direction={'topRight'}
                                    isActive={resizeDirection === 'topRight'}
                                    rotate={rotate}
                                    onResizeStart={handleResizeStart}
                                />
                            )}
                            {(!resizeDirection || resizeDirection === 'bottomLeft') && (
                                <CornerResizeHandler
                                    bottom={-HANDLER_CORNER_SIZE}
                                    left={-HANDLER_CORNER_SIZE}
                                    direction={'bottomLeft'}
                                    isActive={resizeDirection === 'bottomLeft'}
                                    rotate={rotate}
                                    onResizeStart={handleResizeStart}
                                />
                            )}
                            {(!resizeDirection || resizeDirection === 'bottomRight') && (
                                <CornerResizeHandler
                                    bottom={-HANDLER_CORNER_SIZE}
                                    right={-HANDLER_CORNER_SIZE}
                                    direction={'bottomRight'}
                                    isActive={resizeDirection === 'bottomRight'}
                                    rotate={rotate}
                                    onResizeStart={handleResizeStart}
                                />
                            )}
                        </Fragment>
                    )}
                    {!isGroup && !isRotating && (
                        <Fragment>
                            {!disabled.vertical && (
                                <Fragment>
                                    {(!resizeDirection || resizeDirection === 'top') && (
                                        <ResizeHandler
                                            width={'100%'}
                                            height={HANDLER_SIZE}
                                            top={-(HANDLER_SIZE / 2)}
                                            boxSize={boxSize}
                                            direction={'top'}
                                            isActive={resizeDirection === 'top'}
                                            rotate={rotate}
                                            onResizeStart={handleResizeStart}
                                        />
                                    )}
                                    {(!resizeDirection || resizeDirection === 'bottom') && (
                                        <ResizeHandler
                                            width={'100%'}
                                            height={HANDLER_SIZE}
                                            bottom={-(HANDLER_SIZE / 2)}
                                            direction={'bottom'}
                                            isActive={resizeDirection === 'bottom'}
                                            boxSize={boxSize}
                                            rotate={rotate}
                                            onResizeStart={handleResizeStart}
                                        />
                                    )}
                                </Fragment>
                            )}
                            {!disabled.horizontal && !isRotating && (
                                <Fragment>
                                    {(!resizeDirection || resizeDirection === 'left') && (
                                        <ResizeHandler
                                            width={HANDLER_SIZE}
                                            height={'100%'}
                                            left={-(HANDLER_SIZE / 2)}
                                            direction={'left'}
                                            isActive={resizeDirection === 'left'}
                                            boxSize={boxSize}
                                            rotate={rotate}
                                            onResizeStart={handleResizeStart}
                                        />
                                    )}
                                    {(!resizeDirection || resizeDirection === 'right') && (
                                        <ResizeHandler
                                            width={HANDLER_SIZE}
                                            height={'100%'}
                                            right={-(HANDLER_SIZE / 2)}
                                            direction={'right'}
                                            isActive={resizeDirection === 'right'}
                                            boxSize={boxSize}
                                            rotate={rotate}
                                            onResizeStart={handleResizeStart}
                                        />
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                    {!locked && !disabled.rotate && !resizeDirection && (
                        <RotateHandle rotate={rotate} onRotateStart={onRouteStart} />
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default forwardRef<HTMLDivElement, PropsWithChildren<ResizeBoxProps>>(ControlBox);
