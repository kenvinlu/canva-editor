export {};
interface ColorSelectionOptions {
    signal?: AbortSignal;
}

interface ColorSelectionResult {
    sRGBHex: string;
}

interface EyeDropper {
    open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

interface EyeDropperConstructor {
    new (): EyeDropper;
}
declare global {
    interface Window {
        EyeDropper?: EyeDropperConstructor;
    }
    interface Array<T> {
        findLastIndex(
          predicate: (value: T, index: number, obj: T[]) => unknown,
          thisArg?: any
        ): number
    }
}
