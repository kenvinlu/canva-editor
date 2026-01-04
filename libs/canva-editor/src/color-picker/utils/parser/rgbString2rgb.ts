export const rgb2rgbString = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) => {
    if (a === 1) {
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
};
