export function objectIncludes(object1: Record<string, unknown>, object2: Record<string, unknown>): boolean {
    const keys = Object.keys(object2);
    if (!keys.length) {
        return true;
    }

    return keys.every((key) => {
        return object2[key] === object1[key];
    });
}
