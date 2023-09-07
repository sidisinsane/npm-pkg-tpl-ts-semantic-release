/**
 * Generate an array of numbers within a specified range.
 *
 * @param {number} start - The starting value of the range (inclusive).
 * @param {number} stop - The ending value of the range (inclusive).
 * @param {number} [step=1] - The step size between values (default is 1).
 * @returns {number[]} - An array of numbers within the specified range.
 * @example
 * const range = arrayRange(1, 10, 2);
 * console.log(range); // Output: [1, 3, 5, 7, 9]
 */
export function arrayRange(
  start: number,
  stop: number,
  step: number = 1,
): number[] {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );
}

/**
 * Pads a number with leading zeros to ensure a minimum number of digits.
 *
 * @param {number} num - The number to pad.
 * @param {number} [targetLength=2] - The length of the resulting string once the current str has been padded.
 * @returns {string} - The padded number as a string.
 * @example
 * const paddedNumber = padLeadingZeros(7, 3);
 * console.log(paddedNumber); // Output: "007"
 */
export function padLeadingZeros(num: number, targetLength: number = 2): string {
  return num.toString().padStart(targetLength, "0");
}
