import type { GenerateAxisOption, GenerateAxisResult, SerieItem } from './types';
/**
 * Solve the accuracy problem of js floating-point number, it can be rounded once when calculating the final result, and the scale is too small and it does not make sense
 *
 * @export
 * @param {(number | string)} num
 * @param {number} [decimal=8]
 * @returns {number}
 */
export declare function fixedNum(num: number | string, decimal?: number): number;
/**
 * Judge non-Infinity non-NaN number
 *
 * @export
 * @param {*} num
 * @returns {num is number}
 */
export declare function numberValid(num: any): num is number;
export declare function getMinAndMax(series: SerieItem[]): number[];
/**
 * Calculate the ideal scale value, the scale interval size is generally 10 times a certain number in [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
 *
 * @export
 * @param {ScaleOption} option
 * @returns {GenerateAxisResult}
 */
export declare function generateAxisOption(option: GenerateAxisOption): GenerateAxisResult;
