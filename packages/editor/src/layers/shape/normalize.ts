/**
 * Fix clip path not work correctly on browser
 * @param number
 */
export const normalizeNumber = (number: number) => {
    if (number % 1 > 0 && number % 1 < 0.5) {
        return Math.round(number);
    }
    return Math.round(number * 1000) / 1000;
};
