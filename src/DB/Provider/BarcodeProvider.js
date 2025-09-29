import db from '../db.js';
import * as util from "../../util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}

async function getAllBarcodes() {
    try {
        const allBarcodes = await db.barcodes.toArray();
        if (_enableLogging)
            util.consoleLogMessage(`All barcodes: ${allBarcodes}`, 'getAllBarcodes:');
        return allBarcodes;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to retrieve barcodes error: ${error}`, 'getAllBarcodes:');
    }
}

export default { getAllBarcodes };