import db from '/src/db/db.js';
import * as util from "/src/util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}

util.enableLogging(_enableLogging);

async function addBarcode(barcodeId, timestamp) {
    try {
        const id = await db.barcodes.add({ barcodeId, timestamp })
        if (_enableLogging)
            util.consoleLogMessage(`Barcode added with ID: ${id}`, 'addBarcode:');
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to add barcode error: ${error}`, 'addBarcode:');
    }
}

async function clearTable() {
    try {
        await db.barcodes.clear();
        if (_enableLogging)
            util.consoleLogMessage(`Barcode Table has been cleared.`, 'clearTable:');
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to clear Barcode Table error: ${error}`, 'clearTable:');
    }
}

export default { addBarcode, clearTable };