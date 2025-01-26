export const getSizeWithRatio = (
    size: { x: number; y: number; width: number; height: number },
    ratio: number,
    lockRatio: boolean,
) => {
    if (!lockRatio) {
        return size;
    }
    const newRatio = size.width / size.height;
    if (newRatio > ratio) {
        return {
            ...size,
            height: size.width / ratio,
        };
    } else if (newRatio < ratio) {
        return {
            ...size,
            width: size.height * ratio,
        };
    } else {
        return size;
    }
};
