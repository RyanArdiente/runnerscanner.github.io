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


export default { barcodeHtml };