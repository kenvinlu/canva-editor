export const scalePath = (path: string, scale: number) => {
    const arr = path.split(' ');
    return arr
        .map((v) => {
            if (v.match(/^[+-]?\d+(\.\d+)?$/)) {
                return parseFloat(v) * scale;
            }
            return v;
        })
        .join(' ');
};
