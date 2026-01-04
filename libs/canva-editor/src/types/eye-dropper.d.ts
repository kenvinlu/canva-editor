interface EyeDropper {
    open(): Promise<{ sRGBHex: string }>;
}

interface Window {
    EyeDropper: {
        new (): EyeDropper;
    };
} 