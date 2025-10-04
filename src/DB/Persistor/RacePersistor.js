import db from '/src/db/db.js';
import * as util from "/src/util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}

util.enableLogging(_enableLogging);

async function updateRace(startOrEnd) {
    try {
        var date = Date.now();
        if (startOrEnd == 'start')
            await db.race.update(1, { 'raceStart': date });
        else
            await db.race.update(1, { 'raceEnd': date })

        if (_enableLogging)
            util.consoleLogMessage(`Race updated with race${startOrEnd}: ${date}`, 'updateRace:');
        return date;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to update race error: ${error}`, 'updateRace:');
        return null;
    }
}

async function clearTable() {
    try {
        await db.race.clear().populate(async() => {
            // This code will run only when the database is first created or upgraded to version 2.
            await db.race.add({ id: 1, raceStart: null, raceEnd: null });
        });
        if (_enableLogging)
            util.consoleLogMessage(`Race Table has been cleared.`, 'clearTable:');
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to clear Barcode Table error: ${error}`, 'clearTable:');
    }
}

export default { updateRace, clearTable }