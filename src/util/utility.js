let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    if (isBoolean(enable)) {
        if (_enableLogging)
            consoleLogMessage(`_enableLogging: ${_enableLogging}`, 'utility:')
        _enableLogging = enable;
    }
}

export function isNumber(value) {
    const val = typeof value === "number";
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNumber:');
    return val;
}

export function isInteger(value) {
    const val = Number.isInteger(value);
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isInteger:');
    return val;
}

export function isFinite(value) {
    const val = Number.isFinite(value)
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isFinite:');
    return val;

}

export function isNumeric(value) {
    const val = !isNaN(value);
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNumeric:');
    return val;
}
export function isNegativeOrZero(value) {
    const val = value <= 0;
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNegativeOrZero:');
    return val;
}

export function isBoolean(value) {
    const val = typeof value === "boolean"
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isBoolean:');
    return val
}

export function isNumberRange(value) {
    const val = /^\d+\s*-\s*\d+$/.test(value)
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNumberRange:');
    return val
}

export function isNumberLarger(first, second) {
    const val = first > second;
    if (_enableLogging) {
        consoleLogMessage(`value: ${val}`, 'isNumberLarger:');
        consoleLogMessage(`first: ${first}, second: ${second}`, 'isNumberLarger:');
    }
    return val
}
export function areNumbersEqual(first, second) {
    const val = first == second;
    if (_enableLogging) {
        consoleLogMessage(`value: ${val}`, 'areNumbersEqual:');
        consoleLogMessage(`first: ${first}, second: ${second}`, 'areNumbersEqual:');
    }
    return val
}
export function splitRange(value) {
    var val = value.split("-").map((n) => parseInt(n.trim(), 10))
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'splitRange:');
    return val;
}

export function isCommaSeparatedList(value) {
    var cleanedList = splitCommaSeparatedList(value).join();
    var val = /^\d+(,\d+)*$/.test(cleanedList);
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isCommaSeparatedList:');
    return val;
}

export function splitCommaSeparatedList(value) {
    var uniqueVal = value.split(",").map((n) => parseInt(n.trim(), 10));
    var val = [...new Set(uniqueVal)];
    val = val.filter(number => number > 0);
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'splitCommaSeparatedList:');
    return val;
}




export function consoleLogMessage(value, funcName = '') {
    const message = `${funcName} ${value}`.trim();
    console.log(message);
}
export default { enableLogging, isNumber, isInteger, isFinite, isNumeric, isBoolean, isNegativeOrZero, isNumberRange, isNumberLarger, areNumbersEqual, splitRange, isCommaSeparatedList, splitCommaSeparatedList, consoleLogMessage };