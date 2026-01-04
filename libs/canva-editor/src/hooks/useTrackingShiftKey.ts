import { useEffect, useRef } from 'react';

export const useTrackingShiftKey = () => {
    const shiftKeyRef = useRef(false);
    useEffect(() => {
        const trackingShiftKey = (e: KeyboardEvent) => {
            shiftKeyRef.current = e.shiftKey;
        };
        window.addEventListener('keydown', trackingShiftKey, { capture: true }); // pass editor event
        window.addEventListener('keyup', trackingShiftKey, { capture: true });
        return () => {
            window.removeEventListener('keydown', trackingShiftKey, { capture: true });
            window.removeEventListener('keyup', trackingShiftKey, { capture: true });
        };
    }, []);
    return shiftKeyRef;
};
