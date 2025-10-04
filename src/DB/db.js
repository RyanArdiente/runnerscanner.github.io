const db = new Dexie('RunnerScanner');
//db.version(1).stores({ barcodes: `++id, barcodeid, timestamp` });
db.version(2).stores({ barcodes: `++id, barcodeid, timestamp`, race: `++id, raceStart, raceEnd` });
db.on('populate', async function() {
    // This code will run only when the database is first created or upgraded to version 2.
    await db.race.add({ raceStart: null, raceEnd: null });
});
export async function populateInitialTable() {
    const count = await db.race.count();
    if (count === 0) {
        await db.race.bulkAdd([
            { raceStart: null, raceEnd: null }
        ]);
    }
}
export async function deleteDatabase() {
    await db.delete();
}
export default db;