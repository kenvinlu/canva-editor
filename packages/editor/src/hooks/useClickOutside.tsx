import { RefObject, useCallback, useEffect, useRef } from 'react';

type Handler = (event: MouseEvent) => void;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
    options?: AddEventListenerOptions,
): void => {
    const savedHandler = useRef(handler);
    const handleFunc = useCallback(
        (event: MouseEvent) => {
            const el = ref?.current;
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            savedHandler.current(event);
        },
        [ref, savedHandler],
    );
    useEffect(() => {
        window.addEventListener(mouseEvent, handleFunc, options);
        return () => {
            window.removeEventListener(mouseEvent, handleFunc, options);
        };
    }, [handleFunc]);
};

export default useClickOutside;
