import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { BoxData, CursorPosition } from 'canva-editor/types';
import { CornerDirection } from 'canva-editor/types/resize';
import { useResize } from 'canva-editor/hooks/useResize';
import { getPosition } from 'canva-editor/utils';

type ResizeRef = {
    clientX: number;
    clientY: number;
    last: CursorPosition;
    isResizing: boolean;
    e?: MouseEvent | TouchEvent;
    direction: CornerDirection;
    lockAspect: boolean;
};
export const useResizeImage = ({
    getData,
    onResizeStart,
    onResize,
    onResizeEnd,
    lockAspect = false,
}: {
    getData: () => BoxData;
    onResizeStart: (e: MouseEvent | TouchEvent, direction: CornerDirection) => void;
    onResize: (data: BoxData, direction: CornerDirection, oldPos: CursorPosition, newPos: CursorPosition) => void;
    onResizeEnd?: (data: BoxData) => void;
    lockAspect?: boolean;
}) => {
    const resizeRef = useRef<ResizeRef>({
        clientX: 0,
        clientY: 0,
        last: {
            clientX: 0,
            clientY: 0,
        },
        direction: 'topRight',
        isResizing: false,
        lockAspect,
    });
    const { getResized } = useResize(getData);

    const getNewSize = (clientX: number, clientY: number): BoxData => {
        return getResized(
            resizeRef.current.direction,
            resizeRef.current,
            { clientX, clientY },
            resizeRef.current.lockAspect,
        );
    };

    const handleResize = throttle((e: TouchEvent | MouseEvent) => {
        e.stopPropagation();
        resizeRef.current.e = e;
        const { clientX, clientY } = getPosition(e);
        resizeRef.current.last = {
            clientX,
            clientY,
        };
        const newData = getNewSize(clientX, clientY);
        onResize(newData, resizeRef.current.direction, resizeRef.current, { clientX, clientY });
    }, 16);

    const handleResizeEnd = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        const { clientX, clientY } = resizeRef.current.last;
        const newData = getNewSize(clientX, clientY);
        onResizeEnd && onResizeEnd(newData);
        unbindEvents();
    };
    const bindEvents = () => {
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('touchmove', handleResize);
        window.addEventListener('mouseup', handleResizeEnd, { once: true });
        window.addEventListener('mouseleave', handleResizeEnd, { once: true });
        window.addEventListener('touchend', handleResizeEnd, { once: true });
    };

    const unbindEvents = () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('touchmove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
        window.removeEventListener('mouseleave', handleResizeEnd);
        window.removeEventListener('touchend', handleResizeEnd);
    };
    useEffect(() => {
        const lockAspectFn = (e: KeyboardEvent) => {
            resizeRef.current.lockAspect = lockAspect || e.shiftKey;
            if (resizeRef.current.e && resizeRef.current.isResizing) {
                handleResize(resizeRef.current.e);
            }
        };
        window.addEventListener('keydown', lockAspectFn);
        window.addEventListener('keyup', lockAspectFn);
        return () => {
            window.removeEventListener('keydown', lockAspectFn);
            window.removeEventListener('keyup', lockAspectFn);
        };
    }, [handleResize]);

    const startResize = (e: MouseEvent | TouchEvent, direction: CornerDirection) => {
        const { clientX, clientY } = getPosition(e);
        resizeRef.current = {
            clientX,
            clientY,
            last: {
                clientX,
                clientY,
            },
            direction,
            e,
            isResizing: true,
            lockAspect,
        };
        onResizeStart(e, direction);
        bindEvents();
    };
    return {
        startResize,
    };
};
