import db from '/src/db/db.js';
import * as util from "/src/util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}
util.enableLogging(_enableLogging);

export async function getAllBarcodes() {
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