import * as util from "/src/util/utility.js"
import bProvider from "/src/DB/Provider/BarcodeProvider.js"
import bPersistor from "/src/DB/Persistor/BarcodePersistor.js"
let _enableLogging = false; //Default set to false
// Time threshold (ms) to prevent duplicate scans
const SCAN_COOLDOWN = 5000; // 5 seconds for testing
//const SCAN_COOLDOWN = 30000 // THIS WILL BE THE INITIAL COOLDOWN

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
async function getAllBarcodes(sortOrder) {
    try {
        var barcodes = await bProvider.getAllBarcodes();
        if (_enableLogging)
            util.consoleLogMessage(`Get all Barcodes retrieved. barcodes: {barcodes}`, "getAllBarcodes:");
        return barcodes;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Error occured while trying to get all barcodes. error: ${error}`, "getAllBarcodes:");
    }
}

export function handleScan(barcode) {
    const now = Date.now();
    const lastScans = JSON.parse(localStorage.getItem("scanData") || "{}");

    if (lastScans[barcode]) {
        const diff = now - lastScans[barcode];

        if (diff < SCAN_COOLDOWN) {
            if (_enableLogging)
                util.consoleLogMessage(`Scan ignored for barcode: ${barcode}, only ${diff}ms since last scan.`, 'handleScan:');
            return false;
        } else {
            // Cooldown has passed → remove the old record
            delete lastScans[barcode];
            if (_enableLogging)
                util.consoleLogMessage(` Cooldown has passed, removed barcode record: ${barcode}`, 'handleScan:');
        }
    }

    // Record new scan timestamp
    lastScans[barcode] = now;
    localStorage.setItem("scanData", JSON.stringify(lastScans));
    addBarcode(barcode);
    if (_enableLogging)
        util.consoleLogMessage(`Valid scan recorded for ${barcode} at ${new Date(now).toLocaleTimeString()}`, 'handleScan:');
    return true;
}


export default { handleScan, getAllBarcodes };