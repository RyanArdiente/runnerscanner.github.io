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
        return [true, "SingleNumber"];

    } else if (checkInputIsNumberRange(inputValue)) {
        //do something
        if (_enableLogging)
            util.consoleLogMessage("Inside ELSE IF for number range", "validateBarcodeForm");
        return [true, "NumberRange"];

    } else if (checkInputIsCommaSeparatedList(inputValue)) {
        //do something
        if (_enableLogging)
            util.consoleLogMessage("Inside ELSE IF 2 for comma-separated list", "validateBarcodeForm");
        return [true, "CommaSeparatedList"];
    } else
        return [false, "None"];


}

export function checkInputIsSingleNumber(value) {
    var isSingleNumber = false;

    isSingleNumber = util.isNumeric(value);
    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumeric check value: ${isSingleNumber}`, 'checkInputIsSingleNumber:');
        return isSingleNumber;
    }
    const val = Number(value);
    isSingleNumber = util.isNumber(val);

    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumber check value: ${isSingleNumber}`, 'checkInputIsSingleNumber:');
        return isSingleNumber;
    }

    isSingleNumber = util.isFinite(val);
    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isFinite check value: ${isSingleNumber}`, 'checkInputIsSingleNumber:');
        return isSingleNumber;
    }

    isSingleNumber = util.isInteger(val);
    if (!isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isInteger check value: ${isSingleNumber}`, 'checkInputIsSingleNumber:');
        return isSingleNumber;
    }
    //This check is different from the other checks so use ! to invert it to be similar to the other checks
    isSingleNumber = !util.isNegativeOrZero(val);
    if (isSingleNumber) {
        if (_enableLogging)
            util.consoleLogMessage(`isNegativeOrZero check value: ${isSingleNumber}`, 'checkInputIsSingleNumber:');
    }
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
            util.consoleLogMessage(`Invalid range: start (${start}) must be less than end (${end}).`, "checkInputIsNumberRange isNumberLarger:");
        return false;
    } else if (util.areNumbersEqual(start, end)) {
        if (_enableLogging)
            util.consoleLogMessage(`Invalid range: start (${start}) must be less than end (${end}).`, "checkInputIsNumberRange areNumbersEqual:");
        return false;
    }
    isNumberRange = true;

    return isNumberRange;
}

function checkInputIsCommaSeparatedList(value) {
    var isCommaSeparatedList = false;
    isCommaSeparatedList = util.isCommaSeparatedList(value);

    if (!isCommaSeparatedList) {
        if (_enableLogging)
            util.consoleLogMessage(`isCommaSeparatedList check value: ${isCommaSeparatedList}`, "checkInputIsCommaSeparatedList:");
    }

    return isCommaSeparatedList;
}

export default { validateBarcodeForm };