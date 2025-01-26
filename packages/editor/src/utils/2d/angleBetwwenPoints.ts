import { CursorPosition } from "canva-editor/types";

export const angleBetweenPoints = (oldPos: CursorPosition, newPos: CursorPosition) => {
    return (Math.atan2(newPos.clientY - oldPos.clientY, newPos.clientX - oldPos.clientX) * 180) / Math.PI;
};
