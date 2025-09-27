import * as barcodeValidate from "/src/BarcodeGeneration/barcodeValidation.js"
import * as util from "/src/util/utility.js"


window.onload = function() {
    var _enableLogging = true;
    barcodeValidate.enableLogging(_enableLogging);
    // Your JavaScript code to run after the page loads 
    if (_enableLogging)
        util.consoleLogMessage("Page and all resources fully loaded!", "index.js onload");
    // // Example: Manipulate DOM elements 
    UIkit.navbar('#test');
    UIkit.switcher('.uk-switcher');
    UIkit.tab('#component-nav-tabs', { connect: '#component-nav-tabs' });
    UIkit.svg('#barcodez');
    UIkit.grid('#homeGrid');
    UIkit.grid('#barcodeGrid');


    JsBarcode("#barcodez", "Hi!");

    const barcodeForm = document.getElementById('generateBarcodeForm');
    barcodeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        barcodeValidate.validateBarcodeForm('barcodeInput')
    });
};