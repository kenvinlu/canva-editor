const convert = (num: number) => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

export const rgb2hex = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) => {
    const alphaHex = a < 1 ? convert(Math.round(a * 255)) : '';
    return '#' + [convert(r), convert(g), convert(b), alphaHex].join('');
};
