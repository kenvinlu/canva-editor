// ref: https://stackoverflow.com/questions/69147768/how-to-calculate-a-bounding-box-for-a-rectangle-rotated-around-its-center
import { BoxSize, Delta } from "canva-editor/types";

export const boundingRect = (boxSize: BoxSize, position: Delta, rotate: number) => {
    const radians = (rotate * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const width = boxSize.width * Math.abs(cos) + boxSize.height * Math.abs(sin);
    const height = boxSize.width * Math.abs(sin) + boxSize.height * Math.abs(cos);
    const centerX = position.x + boxSize.width / 2;
    const centerY = position.y + boxSize.height / 2;
    return {
        width,
        height,
        centerX,
        centerY,
        x: centerX - width / 2,
        y: centerY - height / 2,
    };
};
