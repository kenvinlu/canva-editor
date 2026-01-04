import { forwardRef, ForwardRefRenderFunction, PropsWithChildren } from 'react';
import { BoxSize } from '../types';
import { getTransformStyle } from '../layers';

const PageRender: ForwardRefRenderFunction<HTMLDivElement, PropsWithChildren<{ boxSize: BoxSize; scale: number }>> = (
    { boxSize, scale, children },
    ref,
) => {
    return (
        <div
            ref={ref}
            css={{
                position: 'absolute',
                width: boxSize.width,
                height: boxSize.height,
                transformOrigin: '0px 0px',
                overflow: 'hidden',
            }}
            style={{
                width: boxSize.width,
                height: boxSize.height,
                transform: getTransformStyle({ scale }),
            }}
        >
            {children}
        </div>
    );
};
export default forwardRef<HTMLDivElement, PropsWithChildren<{ boxSize: BoxSize; scale: number }>>(PageRender);
