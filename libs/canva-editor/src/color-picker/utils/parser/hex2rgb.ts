export const hex2rgb = (hex: string) => {
    if (hex[0] === '#') hex = hex.substring(1);

    if (hex.length < 6) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
            a: hex.length === 4 ? Math.round((parseInt(hex[3] + hex[3], 16) / 255) * 100) / 100 : 1,
        };
    }

    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: hex.length === 8 ? Math.round((parseInt(hex.substring(6, 8), 16) / 255) * 100) / 100 : 1,
    };
};

export const hex2rgbString = (hex: string) => {
    const { r, g, b, a } = hex2rgb(hex);
    if (a === 1) {
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
};
