import { LayerId, BoxData } from 'canva-editor/types';
import React, { forwardRef, ForwardRefRenderFunction, Fragment } from 'react';
import { getTransformStyle } from '..';

interface SelectionBoxProps {
    selectedLayers?: Record<LayerId, BoxData>;
}
const SelectionBox: ForwardRefRenderFunction<HTMLDivElement, SelectionBoxProps> = ({ selectedLayers }, ref) => {
    return (
        <Fragment>
            <div
                ref={ref}
                css={{
                    border: '1px solid #3d8eff',
                    background: 'rgba(61, 142, 255, 0.2)',
                    position: 'absolute',
                }}
            />
            <div css={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
                {Object.entries(selectedLayers || {}).map(([layerId, { boxSize, position, rotate }]) => (
                    <div
                        key={layerId}
                        css={{
                            position: 'absolute',
                            border: '1px solid #3d8eff',
                            transform: getTransformStyle({ position, rotate }),
                            width: boxSize.width,
                            height: boxSize.height,
                        }}
                    />
                ))}
            </div>
        </Fragment>
    );
};
export default forwardRef<HTMLDivElement, SelectionBoxProps>(SelectionBox);
