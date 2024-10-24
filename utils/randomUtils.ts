/**
 * Generates a random number within a given range [min, max].
 * @param min - Minimum value of the range (inclusive).
 * @param max - Maximum value of the range (inclusive).
 * @returns A random number within the specified range.
 */
export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}