import {
    forwardRef,
    ForwardRefRenderFunction,
    PropsWithChildren,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { throttle } from 'lodash';
import { useForwardedRef } from '../../hooks/useForwardedRef';
import { Delta } from 'canva-editor/types';

type PopoverPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end';
export interface PopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    placement: PopoverPlacement;
    onClose: () => void;
    offsets?: { [K in PopoverPlacement]?: Delta };
}

const PopoverWrapper: ForwardRefRenderFunction<HTMLDivElement, PropsWithChildren<PopoverProps>> = (
    { open, children, anchorEl, placement = 'bottom-end', onClose, offsets },
    ref,
) => {
    const boxRef = useForwardedRef(ref);
    const contentRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Delta>({ x: -9999, y: -9999 });
    const [transform, setTransform] = useState<Delta>({ x: -9999, y: -9999 });
    useEffect(() => {
        const updatePosition = throttle(() => {
            if (anchorEl) {
                const rect = anchorEl.getBoundingClientRect();
                const [anchor] = placement.split('-');
                const pos = {
                    x: rect.x,
                    y: rect.y,
                };
                if (anchor === 'right') {
                    pos.x += rect.width;
                }
                if (anchor === 'bottom') {
                    pos.y += rect.height;
                }
                if (anchor === 'top') {
                    pos.y -= rect.height;
                }
                if (anchor === 'left') {
                    pos.x -= rect.width;
                }
                setPosition(pos);
            }
        }, 16);
        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [open]);

    useEffect(() => {
        const handleFunc = (e: MouseEvent) => {
            const box = boxRef.current;
            let clickOutside = true;
            if (box) {
                for (let i = 0; i < box.children.length; i++) {
                    const node = box.children[i];
                    if (node.contains(e.target as Node)) {
                        clickOutside = false;
                    }
                }
            }
            if (clickOutside) {
                onClose();
            }
        };
        window.addEventListener('mousedown', handleFunc, { capture: true });
        return () => {
            window.removeEventListener('mousedown', handleFunc, { capture: true });
        };
    }, []);
    useEffect(() => {
        const update = () => {
            const [anchor, verticalPos] = placement.split('-');
            if (anchorEl) {
                const contentRect = contentRef.current?.getBoundingClientRect() as DOMRect;
                const rect = anchorEl.getBoundingClientRect();

                const transform = {
                    x: 0,
                    y: 0,
                };
                if (anchor === 'top') {
                    transform.y = -contentRect.height + rect.height;
                    if (verticalPos === 'end') {
                        transform.x = -contentRect.width + rect.width;
                    }
                } else if (anchor === 'bottom' && verticalPos === 'end') {
                    transform.x = -contentRect.width + rect.width;
                }
                setTransform(transform);
            } else {
                setTransform({ x: 0, y: 0 });
            }
        };
        const observer = new MutationObserver(update);
        contentRef.current &&
            observer.observe(contentRef.current, {
                subtree: true,
                childList: true,
                attributes: true,
            });
        return () => {
            observer.disconnect();
        };
    }, [placement, anchorEl]);
    const pos = useMemo(() => {
        if (offsets && offsets[placement]) {
            const offset = offsets[placement] as Delta;
            return {
                x: position.x + offset.x,
                y: position.y + offset.y,
            };
        } else {
            return position;
        }
    }, [offsets, position]);
    return (
        <div
            ref={boxRef}
            css={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1040,
            }}
        >
            <div
                ref={contentRef}
                css={{
                    position: 'absolute',
                    top: pos.y,
                    left: pos.x,
                    transform: `translate(${transform.x}px, ${transform.y}px)`,
                    boxShadow: '0 0 0 1px rgba(64,87,109,.07),0 2px 12px rgba(53,71,90,.2)',
                    borderRadius: 4,
                }}
            >
                <div css={{ background: '#fff' }}>{children}</div>
            </div>
        </div>
    );
};

export default forwardRef<HTMLDivElement, PropsWithChildren<PopoverProps>>(PopoverWrapper);
