import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageRender from './PageRender';
import { throttle } from 'lodash';
import { GlobalStyle, getUsedFonts } from '../layers';
import { SerializedPage } from 'canva-editor/types';
import { renderPages } from 'canva-editor/utils/deserialize';

type Timeout = ReturnType<typeof setTimeout>;
let timeout: Timeout;
export interface FrameProps {
    width: number;
    height: number;
    data: SerializedPage[];
}
export const Frame: FC<FrameProps> = ({ width, height, data }) => {
    const pageRef = useRef<HTMLDivElement[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [size, setSize] = useState({ width, height, scale: 1 });
    const fonts = getUsedFonts(data);
    const moveSlide = useCallback(
        (number: number) => {
            setActiveSlide((prevState) => {
                const value = (prevState + number) % data.length;
                if (value >= 0) {
                    return value;
                } else {
                    return data.length + value;
                }
            });
        },
        [setActiveSlide, data.length],
    );

    const runSlide = useCallback(() => {
        timeout = setTimeout(() => {
            moveSlide(1);
        }, 5000);
        return () => {
            clearTimeout(timeout);
        };
    }, [moveSlide, activeSlide]);
    useEffect(() => {
        const updateSize = throttle(() => {
            timeout && clearTimeout(timeout);
            const { innerWidth, innerHeight } = window;
            const ratio = innerWidth / innerHeight;
            const pageRatio = width / height;
            const w = ratio > pageRatio ? innerHeight * pageRatio : innerWidth;
            const h = ratio > pageRatio ? innerHeight : innerWidth / pageRatio;
            const scale = w / width;
            setSize({
                width: w,
                height: h,
                scale,
            });
            if (pageRef.current) {
                pageRef.current.forEach((page) => {
                    page.style.cssText = `transform: scale(${scale})`;
                });
            }
            runSlide();
        }, 16);
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, [width, height, runSlide]);
    const pages = useMemo(() => renderPages(data), [width, height]);
    return (
        <div
            css={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <GlobalStyle fonts={fonts} />
            {pages.map((page, idx) => (
                <div
                    key={idx}
                    css={{
                        width: size.width,
                        height: size.height,
                        position: 'absolute',
                        opacity: idx === activeSlide ? 1 : 0,
                        zIndex: idx === activeSlide ? 1 : 0,
                        transition: 'opacity .5s ease-in-out',
                    }}
                >
                    <PageRender
                        ref={(el) => (el ? (pageRef.current[idx] = el) : null)}
                        boxSize={{ width, height }}
                        scale={size.scale}
                    >
                        {page}
                    </PageRender>
                </div>
            ))}
        </div>
    );
};
