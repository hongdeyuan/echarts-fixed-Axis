export interface ScaleOption {
  /**
   * Maximum data
   *
   * @type {(number | undefined)}
   * @memberof ScaleOption
   */
  max: number | undefined;
  /**
   * Data minimum
   * @type {(number | undefined)}
   * @memberof ScaleOption
   */
  min: number | undefined;
  /**
   * Expected to be divided into several intervals
   *
   * @type {number}
   * @memberof ScaleOption
   */
  splitNumber?: number;
  /**
   * Whether the positive and negative intervals need to be symmetric when there are data with different signs
   *
   * @type {boolean}
   * @memberof ScaleOption
   */
  symmetrical?: boolean;
  /**
   * Whether to allow errors in the number of intervals actually divided
   *
   * @type {boolean}
   * @memberof ScaleOption
   */
  deviation?: boolean;
  /**
   * Whether to take priority to 0 scale
   *
   * @type {boolean}
   * @memberof ScaleOption
   */
  preferZero?: boolean;
}
export interface ScaleResult {
  max?: number;
  min?: number;
  interval?: number;
  splitNumber?: number;
}

// A double-precision floating-point number has 15 significant digits
const maxDecimal = 15;
/**
 * Solve the accuracy problem of js floating-point number, it can be rounded once when calculating the final result, and the scale is too small and it does not make sense
 *
 * @export
 * @param {(number | string)} num
 * @param {number} [decimal=8]
 * @returns {number}
 */
export function fixedNum(num: number | string, decimal: number = maxDecimal): number {
  let str: string = '' + num;
  if (str.indexOf('.') >= 0) str = Number.parseFloat(str).toFixed(decimal);
  return Number.parseFloat(str);
}

/**
 * Judge non-Infinity non-NaN number
 *
 * @export
 * @param {*} num
 * @returns {num is number}
 */
export function numberValid(num: any): num is number {
  return typeof num === 'number' && Number.isFinite(num);
}

/**
 * Calculate the ideal scale value, the scale interval size is generally 10 times a certain number in [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
 *
 * @export
 * @param {ScaleOption} option
 * @returns {ScaleResult}
 */
export function scaleCompute(option: ScaleOption): ScaleResult {
  option = {
    splitNumber: 2, // SplitNumber is recommended to take a number such as 2 that is easily divisible by
    symmetrical: false,
    deviation: false,
    preferZero: true,
    ...option,
  };
  const magics: number[] = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 150]; // Join 150 to form a closed loop
  // tslint:disable-next-line: prefer-const
  let {
    max: dataMax = 0,
    min: dataMin = 0,
    splitNumber = 2,
    symmetrical,
    deviation,
    preferZero,
  } = option;
  if (!numberValid(dataMax) || !numberValid(dataMin) || dataMax < dataMin) {
    return { splitNumber };
  } else if (dataMax === dataMin && dataMax === 0) {
    return {
      max: fixedNum(magics[0] * splitNumber),
      min: dataMin,
      interval: magics[0],
      splitNumber,
    };
  } else if (dataMax === dataMin) {
    preferZero = true;
  }

  if (!numberValid(splitNumber) || splitNumber <= 0) splitNumber = 4;
  if (preferZero && dataMax * dataMin > 0) {
    if (dataMax < 0) dataMax = 0;
    else dataMin = 0;
  }
  const tempGap: number = (dataMax - dataMin) / splitNumber;
  let multiple: number = Math.floor(Math.log10(tempGap) - 1);
  multiple = Math.pow(10, multiple);
  const tempStep: number = tempGap / multiple;
  let expectedStep: number = magics[0] * multiple;
  let storedMagicsIndex: number = -1;
  let index: number; // Current magic number index
  for (index = 0; index < magics.length; index++) {
    if (magics[index] > tempStep) {
      expectedStep = magics[index] * multiple; // Take the first magic number greater than tempStep and multiply it by multiple as the optimal interval expected
      break;
    }
  }

  let axisMax: number = dataMax;
  let axisMin: number = dataMin;
  function countDegree(step: number): void {
    axisMax = parseInt('' + (dataMax / step + 1)) * step; // parseInt makes decimal ends -1.8 -> -1
    axisMin = parseInt('' + dataMin / step) * step;
    if (dataMax === 0) axisMax = 0; // Priority 0 scale
    if (dataMin === 0) axisMin = 0;
    if (symmetrical && axisMax * axisMin < 0) {
      const tm: number = Math.max(Math.abs(axisMax), Math.abs(axisMin));
      axisMax = tm;
      axisMin = -tm;
    }
  }
  if (dataMax > 1) countDegree(expectedStep);
  if (deviation) {
    return {
      max: fixedNum(axisMax),
      min: fixedNum(axisMin),
      interval: fixedNum(expectedStep),
      splitNumber: Math.round((axisMax - axisMin) / expectedStep),
    };
  } else if (!symmetrical || axisMax * axisMin > 0) {
    let tempSplitNumber: number;
    out: do {
      tempSplitNumber = Math.round((axisMax - axisMin) / expectedStep);
      if ((index - storedMagicsIndex) * (tempSplitNumber - splitNumber) < 0) {
        // Infinite loop
        while (tempSplitNumber < splitNumber) {
          if ((axisMin - dataMin <= axisMax - dataMax && axisMin !== 0) || axisMax === 0) {
            axisMin -= expectedStep;
          } else {
            axisMax += expectedStep;
          }
          tempSplitNumber++;
          if (tempSplitNumber === splitNumber) break out;
        }
      }
      if (index >= magics.length - 1 || index <= 0 || tempSplitNumber === splitNumber) break;
      storedMagicsIndex = index;
      if (tempSplitNumber > splitNumber) expectedStep = magics[++index] * multiple;
      else expectedStep = magics[--index] * multiple;
      countDegree(expectedStep);
    } while (tempSplitNumber !== splitNumber);
  }

  axisMax = fixedNum(axisMax);
  axisMin = fixedNum(axisMin);
  const interval: number = fixedNum((axisMax - axisMin) / splitNumber);
  return {
    max: dataMax > 1 ? axisMax : dataMax,
    min: dataMin > 1 ? axisMin : 0,
    interval,
    splitNumber: dataMax > 1 ? splitNumber : 1,
  };
}
