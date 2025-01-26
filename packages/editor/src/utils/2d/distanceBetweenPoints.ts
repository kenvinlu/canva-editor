import { CursorPosition } from "canva-editor/types";

export const distanceBetweenPoints = (oldPos: CursorPosition, newPos: CursorPosition, scale?: number) => {
    const xDiff = newPos.clientX - oldPos.clientX;
    const yDiff = newPos.clientY - oldPos.clientY;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff) / (scale || 1);
};
