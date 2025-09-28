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
            barcodes = barcodeGenerationSingleNumber(inputValue);
            if (_enableLogging)
                util.consoleLogMessage(`barcodes: ${barcodes}`, "barcodeGenerator GenerateBarcodes:");
            break;
        case NumberRange:
            break;
        case CommaSeparatedList:
            break;
        default:
            break;
    }
    if (barcodes != "") {
        barcodeGeneration(outputContainer, barcodes);
    }
}

function barcodeGenerationSingleNumber(value) {
    var barcodes = '';
    if (value > 0)
        for (let index = 1; index <= value; index++) {
            barcodes += bcUtil.barcodeHtml(index);
        }
    return barcodes;
}

function barcodeGenerationNumberRange(value) {

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