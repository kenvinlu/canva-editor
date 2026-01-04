export type RGBAColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type HSLAColor = {
    h: number;
    s: number;
    l: number;
    a: number;
};

export type HSVColor = {
    h: number;
    s: number;
    v: number;
};

export type HSVAColor = HSVColor & {
    a: number;
};
