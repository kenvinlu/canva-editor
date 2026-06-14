import PageProvider from 'canva-editor/layers/core/PageContext';
import PageElement from 'canva-editor/layers/core/PageElement';
import { forwardRef, ForwardRefRenderFunction } from 'react';

export interface PageProps {
    pageIndex: number;
    isActive: boolean;
    width: number;
    height: number;
    scale: number;
}
const Page: ForwardRefRenderFunction<HTMLDivElement, PageProps> = (
    { pageIndex, width, height, scale, isActive },
    ref,
) => {
    return (
        <PageProvider pageIndex={pageIndex}>
            <div
                ref={ref}
                css={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: width * scale,
                    height: height * scale,
                    zIndex: 0,
                    margin: 0,
                }}
                style={{
                    visibility: isActive ? 'visible' : 'hidden',
                    opacity: isActive ? 1 : 0,
                }}
            >
                <div
                    css={{
                        width: width,
                        height: height,
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                        userSelect: 'none',
                        background: 'white',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        css={{
                            width: width * scale,
                            height: height * scale,
                            position: 'relative',
                            left: 0,
                            top: 0,
                        }}
                    >
                        <PageElement />
                    </div>
                </div>
            </div>
        </PageProvider>
    );
};

export default forwardRef<HTMLDivElement, PageProps>(Page);
