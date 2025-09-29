import Dexie from '../../src/dexie.min.js'

const db = new Dexie('RunnerScanner');
db.version(1).stores({ barcodes: `++id, barcodeid, timestamp` })

export default db;