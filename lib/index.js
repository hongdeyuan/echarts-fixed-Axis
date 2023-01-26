"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function fixedAxis(option) {
    var axis = option.axis, series = option.series, splitNumber = option.splitNumber, magics = option.magics;
    var _a = (0, utils_1.getMinAndMax)(series), axisMin = _a[0], axisMax = _a[1];
    var fixedAxisOptions = (0, utils_1.generateAxisOption)({
        max: axisMax,
        min: axisMin,
        splitNumber: splitNumber,
        magics: magics,
    });
    return Object.assign(axis, fixedAxisOptions);
}
exports.default = fixedAxis;
