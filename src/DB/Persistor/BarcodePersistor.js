import { consoleLogMessage } from '../../util/utility';
import db from '../db.js';
import * as util from "../util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}


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