import { getPosition } from 'canva-editor/utils';
import { throttle } from 'lodash';

export const useRotate = ({
    getData,
    onRotateStart,
    onRotate,
    onRotateEnd,
}: {
    getData: () => { centerX: number; centerY: number };
    onRotateStart: () => void;
    onRotate: (degrees: number) => void;
    onRotateEnd?: (degrees: number) => void;
}) => {
    const handleRotate = throttle((e: MouseEvent | TouchEvent) => {
        const { clientX, clientY } = getPosition(e);
        const radians = Math.atan2(clientY - getData().centerY, clientX - getData().centerX);
        const degrees = (radians * 180) / Math.PI - 90;
        onRotate && onRotate((degrees + 360) % 360);
    }, 16);

    const handleRotateEnd = (e: MouseEvent | TouchEvent) => {
        const { clientX, clientY } = getPosition(e);
        const radians = Math.atan2(clientY - getData().centerY, clientX - getData().centerX);
        const degrees = (radians * 180) / Math.PI - 90;
        onRotateEnd && onRotateEnd((degrees + 360) % 360);
        unbindRotateEvents();
    };
    const bindRotateEvents = () => {
        window.addEventListener('mousemove', handleRotate);
        window.addEventListener('mouseup', handleRotateEnd, { once: true });
        //window.addEventListener('scroll', handleScroll);
    };

    const unbindRotateEvents = () => {
        window.removeEventListener('mousemove', handleRotate);
    };

    const startRotate = () => {
        onRotateStart();
        bindRotateEvents();
    };

    return {
        startRotate,
    };
};
