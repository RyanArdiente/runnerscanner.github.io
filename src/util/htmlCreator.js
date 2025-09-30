let _enableLogging = false; //Default set to false

export function enableLogging(enable) {
    if (isBoolean(enable))
        _enableLogging = enable;
}

export function barcodeHtml(value) {
    //create a new element
    var html = `<div class='uk-width-1-5'><svg key=${value} id='barcode-${value}' class='rsBarcodes' uk-svg></svg></div>`;
    return html;
}

export function allResultsTableCreate(allResults, tableId) {
    new gridjs.Grid({
        columns: [{
                id: "barcodeId",
                name: "Runner",
                sort: {
                    direction: 'desc'
                }
            },
            {
                id: "formattedTime",
                name: "Time",
                sort: {
                    enabled: true,
                    compare: (a, b) => new Date(a) - new Date(b) // proper chronological sort
                }
            }
        ],
        data: allResults,
        sort: true,

        pagination: {
            limit: 10,
            summary: false
        }
    }).render(document.getElementById(tableId));
}

export function allCountsTableCreate(allCounts, tableId) {
    new gridjs.Grid({
        columns: [{
            id: "barcodeId",
            name: "Runner",

        }, {
            id: "Counted",
            name: "Laps Counted",

        }],
        data: allCounts,
        pagination: {
            limit: 10,
            summary: false
        }
    }).render(document.getElementById(tableId));
}

export default { barcodeHtml, allResultsTableCreate, allCountsTableCreate };