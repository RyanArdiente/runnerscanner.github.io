import db from '/src/db/db.js';
import * as util from "/src/util/utility.js"

let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}

export async function getRaceInformation(startOrEnd) {
    try {
        const raceInfo = await db.race.get(1);
        if (_enableLogging)
            util.consoleLogMessage(`Race Information: ${raceInfo}`, 'getRaceInformation:');
        return startOrEnd == 'start' ? raceInfo.raceStart : raceInfo.raceEnd;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to retrieve race information error: ${error}`, 'getRaceInformation:');
    }

}
export default { getRaceInformation };