import { EditorContext } from 'canva-editor/components/editor/EditorContext';
import { CornerDirection, Direction } from 'canva-editor/types/resize';
import React, { FC, useContext } from 'react';

export const HANDLER_CORNER_SIZE = 16;

interface CornerResizeHandlerProps {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    isActive: boolean;
    direction: CornerDirection;
    rotate: number;
    onResizeStart: (e: TouchEvent | MouseEvent, direction: Direction) => void;
}
const CornerResizeHandler: FC<CornerResizeHandlerProps> = ({
    isActive,
    top,
    left,
    bottom,
    right,
    direction,
    rotate,
    onResizeStart,
}) => {
    const {
        config: { editorAssetsUrl },
    } = useContext(EditorContext);
    const rd = {
        bottomLeft: 45,
        topLeft: 135,
        topRight: 225,
        bottomRight: 315,
    };
    const file = Math.round(((rotate + rd[direction] + 90) % 180) / 10);
    const handleResizeStart = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        onResizeStart(e.nativeEvent, direction);
    };
    return (
        <div
            css={{
                top,
                left,
                bottom,
                right,
                position: 'absolute',
                width: 32,
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                onTouchStart={(e) => {
                    e.stopPropagation();
                    handleResizeStart(e);
                }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    handleResizeStart(e);
                }}
                css={{
                    width: HANDLER_CORNER_SIZE,
                    height: HANDLER_CORNER_SIZE,
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ':hover': {
                        cursor: `url('${editorAssetsUrl}/cursors/resize/${file}.png') 12 12, auto`,
                    },
                }}
            >
                <div
                    css={{
                        background: isActive ? '#3d8eff' : 'white',
                        width: 12,
                        height: 12,
                        position: 'absolute',
                        borderRadius: '50%',
                        boxShadow: '0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3)',
                        pointerEvents: 'none',
                        ':hover': {
                            background: '#3d8eff',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default CornerResizeHandler;
