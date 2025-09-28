import * as util from "../util/utility.js"
import * as bcUtil from "../util/htmlCreator.js"

let _enableLogging = false; //Default set to false
const SingleNumber = 'SingleNumber';
const NumberRange = 'NumberRange';
const CommaSeparatedList = 'CommaSeparatedList'
const settings = {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 50,
    displayValue: true,
};

export function enableLogging(enable) {
    _enableLogging = enable;
}


util.enableLogging(_enableLogging);


export function GenerateBarcodes(containerId, barcodeInputId, generationType) {
    const outputContainer = document.getElementById(containerId);
    const generateBarcodeInput = document.getElementById(barcodeInputId);
    const inputValue = generateBarcodeInput.value;
    outputContainer.innerHTML = "";

    var barcodes = '';
    switch (generationType) {
        case SingleNumber:
            barcodes = barcodeGenerationSingleOrRangeNumber(inputValue);
            if (_enableLogging)
                util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator SingleNumber:");
            break;
        case NumberRange:
            var [start, end] = util.splitRange(inputValue);
            end = end + 1; //added to make end inclusive
            barcodes = barcodeGenerationSingleOrRangeNumber(start, end);
            if (_enableLogging)
                util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator NumberRange:");
            break;
        case CommaSeparatedList:
            barcodes = barcodeGenerationCommaSeparated(inputValue);
            if (_enableLogging)
                util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator CommaSeparated:");
            break;
        default:
            break;
    }
    if (barcodes != "") {
        barcodeGeneration(outputContainer, barcodes);
    }
}

function barcodeGenerationSingleOrRangeNumber(value, maxValue = 1) {
    var barcodes = '';
    if (value > 0) {
        if (maxValue > 1) {
            for (let index = value; index < maxValue; index++) {
                barcodes += bcUtil.barcodeHtml(index);
            }
        } else {
            for (let index = 1; index <= value; index++) {
                barcodes += bcUtil.barcodeHtml(index);
            }
        }

    }
    if (_enableLogging)
        util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator barcodeGenerationSingleOrRangeNumber:");
    return barcodes;
}

function barcodeGenerationCommaSeparated(value) {
    var barcodes = '';
    var val = util.splitCommaSeparatedList(value);
    if (val.length) {
        val = val.sort((A, B) => A - B);
        for (let index = 0; index < val.length; index++) {
            if (!util.isNegativeOrZero(val[index]))
                barcodes += bcUtil.barcodeHtml(val[index]);
        }
    }
    if (_enableLogging)
        util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator barcodeGenerationSingleOrRangeNumber:");
    return barcodes;
}


function barcodeGeneration(outputContainer, value) {
    outputContainer.innerHTML = value;
    const barcodes = document.querySelectorAll('.rsBarcodes');
    if (_enableLogging)
        util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator barcodeGeneration:");
    barcodes.forEach(barcode => {
        var val = barcode.id;
        var num = val.split('-')[1];
        setupBarcodeJS(val, num);
    });
}

function setupBarcodeJS(value, num) {
    //        (ID, Display, settings object)
    JsBarcode(`#${value}`, `${num}`, settings);
}

export default { GenerateBarcodes };