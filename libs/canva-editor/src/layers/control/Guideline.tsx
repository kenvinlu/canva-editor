import { useEditor } from 'canva-editor/hooks';
import React, { FC } from 'react';

const Guideline: FC = () => {
    const { guideline, frameScale } = useEditor((state) => ({ guideline: state.guideline, frameScale: state.scale }));
    if (!guideline.vertical.length && !guideline.horizontal.length) return null;
    return (
        <div>
            {guideline.horizontal.map((line, i) => (
                <div
                    key={i}
                    css={{
                        position: 'absolute',
                        top: line.y * frameScale,
                        left: line.x1 * frameScale,
                        width: (line.x2 - line.x1) * frameScale,
                        borderTopWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: '#3d8eff',
                    }}
                />
            ))}
            {guideline.vertical.map((line, i) => (
                <div
                    key={i}
                    css={{
                        position: 'absolute',
                        top: line.y1 * frameScale,
                        left: line.x * frameScale,
                        height: (line.y2 - line.y1) * frameScale,
                        borderLeftWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: '#3d8eff',
                    }}
                />
            ))}
        </div>
    );
};

export default Guideline;
