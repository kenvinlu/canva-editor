import React, { FC, useCallback, useMemo } from 'react';
import { CornerDirection } from 'canva-editor/types/resize';
import { CSSObject } from '@emotion/react';

interface ImageEditorHandlerProps {
    direction: CornerDirection;
    onResizeStart: (e: TouchEvent | MouseEvent, direction: CornerDirection) => void;
}
const ImageEditorHandler: FC<ImageEditorHandlerProps> = ({ direction, onResizeStart }) => {
    const css = useMemo(() => {
        const res: CSSObject = {};
        if (direction.toLowerCase().includes('top')) {
            res.top = -16;
        }
        if (direction.toLowerCase().includes('left')) {
            res.left = -16;
        }
        if (direction.toLowerCase().includes('bottom')) {
            res.bottom = -16;
        }
        if (direction.toLowerCase().includes('right')) {
            res.right = -16;
        }
        return res;
    }, [direction]);

    const handleResizeStart = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.stopPropagation();
            onResizeStart(e.nativeEvent, direction);
        },
        [onResizeStart, direction],
    );
    return (
        <div
            css={{
                height: 32,
                width: 32,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                zIndex: 50,
                ...css,
            }}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
        >
            <div
                css={{
                    borderRadius: '50%',
                    cursor: 'auto',
                    width: 12,
                    height: 12,
                    background: 'white',
                    boxShadow: '0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3)',
                }}
            />
        </div>
    );
};

export default ImageEditorHandler;
