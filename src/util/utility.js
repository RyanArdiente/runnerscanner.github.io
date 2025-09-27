let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    if (isBoolean(enable))
        _enableLogging = enable;
}

export function isNumber(value) {
    const val = typeof value === "number";
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNumber');
    return val;
}

export function isInteger(value) {
    const val = Number.isInteger(value);
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isInteger');
    return val;
}

export function isFinite(value) {
    const val = Number.isFinite(value)
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isFinite');
    return val;

}

export function isNumeric(value) {
    const val = !isNaN(value);
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNumeric');
    return val;
}

export function isBoolean(value) {
    const val = typeof value === "boolean"
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isBoolean');
    return val
}

export function isNumberRange(value) {
    const val = /^\d+\s*-\s*\d+$/.test(value)
    if (_enableLogging)
        consoleLogMessage(`value: ${val}`, 'isNumberRange');
    return val
}

export function isNumberLarger(first, second) {
    const val = first > second;
    if (_enableLogging) {
        consoleLogMessage(`value: ${val}`, 'isNumberLarger');
        consoleLogMessage(`first: ${first}, second: ${second}`, 'isNumberLarger');
    }
    return val
}
export function splitRange(value) {
    var val = value.split("-").map((n) => parseInt(n.trim(), 10))
    return val;
}

export function consoleLogMessage(value, funcName = '') {
    const message = `${funcName} ${value}`.trim();
    console.log(message);
}
export default { enableLogging, isNumber, isInteger, isFinite, isNumeric, consoleLogMessage };