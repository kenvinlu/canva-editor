import { useRef } from 'react';
import { throttle } from 'lodash';
import { useEditor } from '../../hooks';
import { distanceBetweenPoints } from 'canva-editor/utils/2d/distanceBetweenPoints';
import { CursorPosition } from 'canva-editor/types';
import { horizontalAndVerticalChange } from 'canva-editor/utils/2d/horizontalAndVerticalChange';
import { angleBetweenPoints } from 'canva-editor/utils/2d/angleBetwwenPoints';
import { boundingRect } from 'canva-editor/utils/2d/boundingRect';
import { getPosition } from 'canva-editor/utils';

type DragData = {
    clientX: number;
    clientY: number;
    moveX: number;
    moveY: number;
};
export const useDrag = ({ getData, onDragStart }: { getData: () => number; onDragStart: () => void }) => {
    const { imageEditor, actions, scale } = useEditor((state) => {
        const imageEditor = state.imageEditor;
        return {
            imageEditor,
            scale: state.scale,
        };
    });
    const dragData = useRef<DragData>();
    const layer = imageEditor?.image;

    const bindDragEvents = () => {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('touchmove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd, { once: true });
        window.addEventListener('mouseleave', handleDragEnd, { once: true });
        window.addEventListener('touchend', handleDragEnd, { once: true });
    };

    const unbindDragEvents = () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('mouseleave', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
    };
    const calculatePosition = ({ clientX, clientY }: CursorPosition) => {
        const distance = distanceBetweenPoints(dragData.current as DragData, { clientX, clientY }, scale);
        const change = horizontalAndVerticalChange(
            getData(),
            angleBetweenPoints(dragData.current as DragData, { clientX, clientY }),
            distance,
        );
        return { x: change.width, y: change.height };
    };
    const handleDrag = throttle((e: MouseEvent | TouchEvent) => {
        if (!imageEditor || !layer || !dragData.current) {
            return;
        }
        e.stopPropagation();
        const { clientX, clientY } = getPosition(e);
        dragData.current.moveX = clientX;
        dragData.current.moveY = clientY;
        const change = calculatePosition({ clientX, clientY });
        const rect = boundingRect(
            imageEditor.boxSize,
            {
                x: layer.position.x + change.x,
                y: layer.position.y + change.y,
            },
            0,
        );
        const rmx = Math.min(Math.max(rect.x, rect.width - layer.boxSize.width), 0);
        const rmy = Math.min(Math.max(rect.y, rect.height - layer.boxSize.height), 0);
        if (imageEditor) {
            actions.updateImageEditor({
                image: imageEditor.image
                    ? {
                          position: {
                              x: rmx,
                              y: rmy,
                          },
                      }
                    : undefined
            });
        }
    }, 16);

    const handleDragEnd = () => {
        if (!imageEditor || !layer || !dragData.current) {
            return;
        }
        const { moveX: clientX, moveY: clientY } = dragData.current;
        const change = calculatePosition({ clientX, clientY });
        const rect = boundingRect(
            imageEditor.boxSize,
            {
                x: layer.position.x + change.x,
                y: layer.position.y + change.y,
            },
            0,
        );
        const rmx = Math.min(Math.max(rect.x, rect.width - layer.boxSize.width), 0);
        const rmy = Math.min(Math.max(rect.y, rect.height - layer.boxSize.height), 0);
        if (imageEditor) {
            actions.updateImageEditor({
                image: imageEditor.image
                    ? {
                          position: {
                              x: rmx,
                              y: rmy,
                          },
                      }
                    : undefined
            });
        }
        unbindDragEvents();
    };
    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        const { clientX, clientY } = getPosition(e.nativeEvent);
        dragData.current = {
            clientX,
            clientY,
            moveX: clientX,
            moveY: clientY,
        };
        onDragStart && onDragStart();
        bindDragEvents();
    };

    return {
        startDrag,
    };
};
