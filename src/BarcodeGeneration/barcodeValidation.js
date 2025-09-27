import * as util from "../util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}

util.enableLogging(_enableLogging);

export function validateBarcodeForm(id) {
    const generateBarcodeInput = document.getElementById(id);
    const inputValue = generateBarcodeInput.value;

    if (_enableLogging)
        util.consoleLogMessage(`type: ${typeof inputValue}, value: ${inputValue}`, "validateBarcodeForm")

    //Check if single number
    if (checkInputIsSingleNumber(inputValue)) {
        //do something
        if (_enableLogging)
            util.consoleLogMessage("Inside IF for single number", "validateBarcodeForm");

    } else if (checkInputIsNumberRange(inputValue)) {
        //do something
        if (_enableLogging)
            util.consoleLogMessage("Inside ELSE IF for number range", "validateBarcodeForm");
    }
}

function checkInputIsSingleNumber(value) {
    var isSingleNumber = false;

    isSingleNumber = util.isNumeric(value);
    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumeric check value: ${isSingleNumber}`);
        return isSingleNumber;
    }
    const val = Number(value);
    isSingleNumber = util.isNumber(val);

    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumber check value: ${isSingleNumber}`);
        return isSingleNumber;
    }

    isSingleNumber = util.isFinite(val);
    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isFinite check value: ${isSingleNumber}`);
        return isSingleNumber;
    }

    isSingleNumber = util.isInteger(val);
    if (_enableLogging)
        util.consoleLogMessage(`isInteger check value: ${isSingleNumber}`, 'checkInputIsSingleNumber:');

    return isSingleNumber;
}

function checkInputIsNumberRange(value) {
    var isNumberRange = false;

    isNumberRange = util.isNumberRange(value);
    if (!isNumberRange) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumberRange check value: ${isNumberRange}`, "checkInputIsNumberRange:");

        return isNumberRange;
    }
    const [start, end] = util.splitRange(value);
    if (_enableLogging) {
        util.consoleLogMessage(`type: ${typeof start}, value: ${start}`, "checkInputIsNumberRange:")
        util.consoleLogMessage(`type: ${typeof end}, value: ${end}`, "checkInputIsNumberRange:")
    }
    if (util.isNumberLarger(start, end)) {
        if (_enableLogging)
            util.consoleLogMessage(`Invalid range: start (${start}) must be less than or equal to end (${end}).`, "checkInputIsNumberRange:");
        return false;
    }
    isNumberRange = true;

    return isNumberRange;
}

export default { validateBarcodeForm };