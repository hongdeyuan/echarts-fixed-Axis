"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAxisOption = exports.getMinAndMax = exports.numberValid = exports.fixedNum = void 0;
// A double-precision floating-point number has 15 significant digits
var MAX_DECIMAL = 15;
/**
 * Solve the accuracy problem of js floating-point number, it can be rounded once when calculating the final result, and the scale is too small and it does not make sense
 *
 * @export
 * @param {(number | string)} num
 * @param {number} [decimal=8]
 * @returns {number}
 */
function fixedNum(num, decimal) {
    if (decimal === void 0) { decimal = MAX_DECIMAL; }
    var str = '' + num;
    if (str.indexOf('.') >= 0)
        str = Number.parseFloat(str).toFixed(decimal);
    return Number.parseFloat(str);
}
exports.fixedNum = fixedNum;
/**
 * Judge non-Infinity non-NaN number
 *
 * @export
 * @param {*} num
 * @returns {num is number}
 */
function numberValid(num) {
    return typeof num === 'number' && Number.isFinite(num);
}
exports.numberValid = numberValid;
function getMinAndMax(series) {
    var min = 0;
    var max = 0;
    series.forEach(function (s) {
        var _a;
        return (_a = s.data) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
            var _ = _a[0], value = _a[1];
            if (typeof min === 'undefined' || min > value)
                min = value;
            if (typeof max === 'undefined' || max < value)
                max = value;
        });
    });
    return [min, max];
}
exports.getMinAndMax = getMinAndMax;
/**
 * Calculate the ideal scale value, the scale interval size is generally 10 times a certain number in [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
 *
 * @export
 * @param {ScaleOption} option
 * @returns {GenerateAxisResult}
 */
function generateAxisOption(option) {
    // tslint:disable-next-line: prefer-const
    var _a = option.max, dataMax = _a === void 0 ? 0 : _a, _b = option.min, dataMin = _b === void 0 ? 0 : _b, _c = option.splitNumber, splitNumber = _c === void 0 ? 2 : _c, // SplitNumber is recommended to take a number such as 2 that is easily divisible by
    _d = option.magics, // SplitNumber is recommended to take a number such as 2 that is easily divisible by
    magics = _d === void 0 ? [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 150] : _d, _e = option.symmetrical, symmetrical = _e === void 0 ? false : _e, _f = option.deviation, deviation = _f === void 0 ? false : _f, _g = option.preferZero, preferZero = _g === void 0 ? true : _g;
    if (!numberValid(dataMax) || !numberValid(dataMin) || dataMax < dataMin) {
        return { splitNumber: splitNumber };
    }
    else if (dataMax === dataMin && dataMax === 0) {
        return {
            max: fixedNum(magics[0] * splitNumber),
            min: dataMin,
            interval: magics[0],
            splitNumber: splitNumber,
        };
    }
    else if (dataMax === dataMin) {
        preferZero = true;
    }
    if (!numberValid(splitNumber) || splitNumber <= 0)
        splitNumber = 4;
    if (preferZero && dataMax * dataMin > 0) {
        if (dataMax < 0)
            dataMax = 0;
        else
            dataMin = 0;
    }
    var tempGap = (dataMax - dataMin) / splitNumber;
    var multiple = Math.floor(Math.log10(tempGap) - 1);
    multiple = Math.pow(10, multiple);
    var tempStep = tempGap / multiple;
    var expectedStep = magics[0] * multiple;
    var storedMagicsIndex = -1;
    var index; // Current magic number index
    for (index = 0; index < magics.length; index++) {
        if (magics[index] > tempStep) {
            expectedStep = magics[index] * multiple; // Take the first magic number greater than tempStep and multiply it by multiple as the optimal interval expected
            break;
        }
    }
    var axisMax = dataMax;
    var axisMin = dataMin;
    function countDegree(step) {
        axisMax = parseInt('' + (dataMax / step + 1)) * step; // parseInt makes decimal ends -1.8 -> -1
        axisMin = parseInt('' + dataMin / step) * step;
        if (dataMax === 0)
            axisMax = 0; // Priority 0 scale
        if (dataMin === 0)
            axisMin = 0;
        if (symmetrical && axisMax * axisMin < 0) {
            var tm = Math.max(Math.abs(axisMax), Math.abs(axisMin));
            axisMax = tm;
            axisMin = -tm;
        }
    }
    if (dataMax > 1)
        countDegree(expectedStep);
    if (deviation) {
        return {
            max: fixedNum(axisMax),
            min: fixedNum(axisMin),
            interval: fixedNum(expectedStep),
            splitNumber: Math.round((axisMax - axisMin) / expectedStep),
        };
    }
    else if (!symmetrical || axisMax * axisMin > 0) {
        var tempSplitNumber = void 0;
        out: do {
            tempSplitNumber = Math.round((axisMax - axisMin) / expectedStep);
            if ((index - storedMagicsIndex) * (tempSplitNumber - splitNumber) < 0) {
                // Infinite loop
                while (tempSplitNumber < splitNumber) {
                    if ((axisMin - dataMin <= axisMax - dataMax && axisMin !== 0) || axisMax === 0) {
                        axisMin -= expectedStep;
                    }
                    else {
                        axisMax += expectedStep;
                    }
                    tempSplitNumber++;
                    if (tempSplitNumber === splitNumber)
                        break out;
                }
            }
            if (index >= magics.length - 1 || index <= 0 || tempSplitNumber === splitNumber)
                break;
            storedMagicsIndex = index;
            if (tempSplitNumber > splitNumber)
                expectedStep = magics[++index] * multiple;
            else
                expectedStep = magics[--index] * multiple;
            countDegree(expectedStep);
        } while (tempSplitNumber !== splitNumber);
    }
    axisMax = fixedNum(axisMax);
    axisMin = fixedNum(axisMin);
    var interval = fixedNum((axisMax - axisMin) / splitNumber);
    return {
        max: dataMax > 1 ? axisMax : dataMax,
        min: dataMin > 1 ? axisMin : 0,
        interval: interval,
        splitNumber: dataMax > 1 ? splitNumber : 1,
    };
}
exports.generateAxisOption = generateAxisOption;
