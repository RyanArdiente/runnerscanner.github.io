import * as util from "/src/util/utility.js"
import bProvider from "/src/DB/Provider/BarcodeProvider.js"
import bPersistor from "/src/DB/Persistor/BarcodePersistor.js"

let _enableLogging = false; //Default set to false
let _scanCooldown = 15000; // default cooldown in ms

export function enableLogging(enable) {
    _enableLogging = enable;
}

util.enableLogging(_enableLogging);

async function addBarcode(barcodeId) {
    try {
        const timestamp = Date.now();
        await bPersistor.addBarcode(barcodeId, timestamp);
        if (_enableLogging)
            util.consoleLogMessage(`Created new barcode: {${barcodeId}, ${timestamp}}`, "addBarcode:");
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Error occured while trying to add new barcode. error: ${error}`, "addBarcode:");
    }
}
export async function clearBarcodeTable() {
    try {
        await bPersistor.clearTable();
        if (_enableLogging)
            util.consoleLogMessage(`Clear Barcode table successful`, "clearBarcodeTable:");
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Error occured while trying to clear Barcode table. error: ${error}`, "clearBarcodeTable:");
    }
}
export async function getAllBarcodes() {
    try {
        var barcodes = await bProvider.getAllBarcodes();

        // Sort using the raw timestamp
        //barcodes = util.sortBarcodeResultByIdandTimestamp(barcodes);

        // Add a formatted field for display instead of overwriting timestamp
        for (const barcode of barcodes) {
            const now = new Date(barcode.timestamp); // original timestamp still intact

            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
            barcode.barcodeId = Number(barcode.barcodeId);
            barcode.formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
        }
        if (_enableLogging)
            util.consoleLogMessage(`Get all Barcodes retrieved. barcodes: ${barcodes}`, "getAllBarcodes:");
        return barcodes;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Error occured while trying to get all barcodes. error: ${error}`, "getAllBarcodes:");
    }
}
export async function getAllBarcodeCounts() {
    try {
        var barcodes = await bProvider.getAllBarcodes();
        var counts = barcodes.reduce((accumulator, currentObject) => {
            const id = currentObject.barcodeId;
            accumulator[id] = (accumulator[id] || 0) + 1;
            return accumulator;
        }, {});
        const keys = Object.keys(counts);
        const values = Object.values(counts);
        var returnCount = [];
        for (let index = 0; index < keys.length; index++) {
            const count = { 'barcodeId': `${keys[index]}`, 'Counted': `${values[index]}` };

            returnCount.push(count);

        }
        if (_enableLogging)
            util.consoleLogMessage(`Get all Barcodes retrieved. barcodes: ${barcodes}`, "getAllBarcodeCounts:");
        return returnCount;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Error occured while trying to get all barcodes. error: ${error}`, "getAllBarcodeCounts:");
    }
}
export function handleScan(barcode) {
    const SCAN_COOLDOWN = _scanCooldown; // in milliseconds
    const now = Date.now();
    const lastScans = JSON.parse(localStorage.getItem("scanData") || "{}");
    const messageDiv = document.getElementById("Message");



    if (lastScans[barcode]) {
        const diff = now - lastScans[barcode];

        if (diff < SCAN_COOLDOWN) {
            if (_enableLogging)
                util.consoleLogMessage(`Scan ignored for barcode: ${barcode}, only ${diff}ms since last scan.`, 'handleScan:');
            messageDiv.innerText = `Scan ignored for barcode: ${barcode}, only ${diff/1000} seconds since last scan.`;
            messageDiv.classList.add('uk-alert-warning');
            messageDiv.classList.remove('uk-alert-success');
            return false;
        } else {
            // Cooldown has passed → remove the old record
            delete lastScans[barcode];
            if (_enableLogging)
                util.consoleLogMessage(` Cooldown has passed, removed barcode record: ${barcode}`, 'handleScan:');
        }
    }
    if (!validateBarcode(barcode))
        return false;

    // Record new scan timestamp
    lastScans[barcode] = now;
    localStorage.setItem("scanData", JSON.stringify(lastScans));
    addBarcode(barcode);
    if (_enableLogging)
        util.consoleLogMessage(`Valid scan recorded for ${barcode} at ${new Date(now).toLocaleTimeString()}`, 'handleScan:');
    messageDiv.innerText = `Valid scan recorded for ${barcode} at ${new Date(now).toLocaleTimeString()}`;

    messageDiv.classList.remove('uk-alert-warning');
    messageDiv.classList.add('uk-alert-success');
    return true;
}


function validateBarcode(value) {
    var passedValidation = false;

    passedValidation = util.isNumeric(value);
    if (!passedValidation) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumeric check value: ${passedValidation}`, 'validateBarcode:');
        return passedValidation;
    }
    const val = Number(value);
    passedValidation = util.isNumber(val);

    if (!passedValidation) {
        if (_enableLogging)
            util.consoleLogMessage(`isNumber check value: ${passedValidation}`, 'validateBarcode:');
        return passedValidation;
    }

    passedValidation = util.isFinite(val);
    if (!passedValidation) {
        if (_enableLogging)
            util.consoleLogMessage(`isFinite check value: ${passedValidation}`, 'validateBarcode:');
        return passedValidation;
    }

    passedValidation = util.isInteger(val);
    if (!passedValidation) {
        if (_enableLogging)
            util.consoleLogMessage(`isInteger check value: ${passedValidation}`, 'validateBarcode:');
        return passedValidation;
    }
    //This check is different from the other checks so use ! to invert it to be similar to the other checks
    passedValidation = !util.isNegativeOrZero(val);
    if (passedValidation) {
        if (_enableLogging)
            util.consoleLogMessage(`isNegativeOrZero check value: ${passedValidation}`, 'validateBarcode:');
    }
    return passedValidation;
}
export default { handleScan, getAllBarcodes };