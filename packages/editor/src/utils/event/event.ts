export const isMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => {
    return Boolean(
        ((event as MouseEvent).clientX || (event as MouseEvent).clientX === 0) &&
            ((event as MouseEvent).clientY || (event as MouseEvent).clientY === 0),
    );
};
export const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
    return Boolean((event as TouchEvent).touches && (event as TouchEvent).touches.length);
};

export const getPosition = (event: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
    if (isTouchEvent(event)) {
        return event.touches[0];
    }
    return event;
};
