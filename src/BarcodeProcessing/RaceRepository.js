import * as util from "/src/util/utility.js"
import rProvider from "/src/DB/Provider/RaceProvider.js"
import rPersistor from "/src/DB/Persistor/RacePersistor.js"


let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    _enableLogging = enable;
}
util.enableLogging(_enableLogging);

export async function getRaceInformation(startOrEnd) {
    try {
        const raceInfo = await rProvider.getRaceInformation(startOrEnd);
        if (!raceInfo)
            return null;
        const now = util.stringDateFormat(raceInfo, false);
        if (_enableLogging)
            util.consoleLogMessage(`raceInfo: ${raceInfo}`, 'getRaceInformation:');
        return now;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to retrieve raceInfo error: ${error}`, 'getRaceInformation:');
    }
}

export async function setRaceInformation(startOrEnd) {
    try {
        const raceInfo = await rPersistor.updateRace(startOrEnd);

        const now = util.stringDateFormat(raceInfo, false);

        if (_enableLogging)
            util.consoleLogMessage(`raceInfo: ${raceInfo}`, 'setRaceInformation:');
        return now;
    } catch (error) {
        if (_enableLogging)
            util.consoleLogMessage(`Failed to set raceInfo error: ${error}`, 'setRaceInformation:');
    }
}
export async function clearTable() {
    await rPersistor.clearTable();
}
export default { getRaceInformation, clearTable, setRaceInformation };