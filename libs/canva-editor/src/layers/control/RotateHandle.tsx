import React, { FC, useCallback, useContext } from 'react';
import { useEditor } from 'canva-editor/hooks';
import { EditorContext } from 'canva-editor/components/editor/EditorContext';
import RotateIcon from 'canva-editor/icons/RotateIcon';

interface ResizeHandlerProps {
    rotate: number;
    onRotateStart: (e: TouchEvent | MouseEvent) => void;
}
const RotateHandle: FC<ResizeHandlerProps> = ({ rotate, onRotateStart }) => {
    const { isRotating } = useEditor((state) => ({ isRotating: state.rotateData.status }));
    const {
        config: { editorAssetsUrl },
    } = useContext(EditorContext);
    const handleRotateStart = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
            e.stopPropagation();
            onRotateStart(e.nativeEvent);
        },
        [onRotateStart],
    );
    const roundRotate = Math.round(rotate / 10);
    return (
        <div
            css={{
                bottom: rotate < 230 && rotate > 130 ? '50%' : -48,
                position: 'absolute',
                left: rotate < 230 && rotate > 130 ? `calc(100% + 48px)` : '50%',
                transform: rotate < 230 && rotate > 130 ? 'translateY(50%)' : 'translateX(-50%)',
                pointerEvents: 'auto',
                display: isRotating ? 'none' : 'block',
            }}
        >
            <div>
                <div
                    css={{
                        background: 'white',
                        boxShadow: '0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3)',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        color: '#0d1216',
                        ':hover': {
                            cursor: `url('${editorAssetsUrl}/cursors/rotate/${
                                roundRotate === 36 ? 0 : roundRotate
                            }.png') 12 12, auto;`,
                        },
                    }}
                    onMouseDown={handleRotateStart}
                    onTouchStart={handleRotateStart}
                >
                    <RotateIcon />
                </div>
            </div>
            {isRotating && (
                <div
                    css={{
                        position: 'absolute',
                        left: 60,
                        top: 36,
                        whiteSpace: 'nowrap',
                        background: '#1E1E2D',
                        padding: '3px 8px',
                        borderRadius: 4,
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 700,
                    }}
                >
                    {Math.round(rotate)}°
                </div>
            )}
        </div>
    );
};

export default RotateHandle;
