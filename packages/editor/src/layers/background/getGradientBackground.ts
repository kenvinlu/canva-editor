import { GradientStyle } from "canva-editor/types";

export const getGradientBackground = (colors: string[], style: GradientStyle) => {
    const percent = 100 / (colors.length - 1);
    const colorList = colors.map((color, i) => {
        return `${color} ${i * percent}%`;
    });
    switch (style) {
        case 'leftToRight':
            return `linear-gradient(90deg, ${colorList.join(', ')})`;
        case 'topToBottom':
            return `linear-gradient(${colorList.join(', ')})`;
        case 'topLeftToBottomRight':
            return `linear-gradient(135deg, ${colorList.join(', ')})`;
        case 'circleCenter':
            return `radial-gradient(circle at 50% 50%, ${colorList.join(', ')})`;
        case 'circleTopLeft':
        default:
            return `radial-gradient(circle at 0% 0%, ${colorList.join(', ')})`;
    }
};
