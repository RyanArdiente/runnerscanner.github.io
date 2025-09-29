import * as barcodeValidate from "/src/BarcodeGeneration/barcodeValidation.js"
import * as barcodeGenerator from "/src/BarcodeGeneration/barcodeGenerator.js"
import * as camera from "/src/util/cameraInit.js"
import * as barcodeRepository from "/src/BarcodeProcessing/BarcodeRepository.js"

import * as util from "/src/util/utility.js"


window.onload = function() {
    var _enableLogging = true;
    var _cameraEnabled = false;
    barcodeValidate.enableLogging(_enableLogging);
    barcodeGenerator.enableLogging(_enableLogging);
    util.enableLogging(_enableLogging);

    // Your JavaScript code to run after the page loads 
    if (_enableLogging)
        util.consoleLogMessage("Page and all resources fully loaded!", "index.js onload");
    // // Example: Manipulate DOM elements 
    UIkit.navbar('#runnerscannerNavbar');
    UIkit.switcher('.uk-switcher');
    UIkit.tab('#component-nav-tabs', { connect: '#component-nav-tabs' });
    UIkit.svg('#barcodez');
    UIkit.grid('#homeGrid');
    UIkit.grid('#barcodeGrid');
    UIkit.formCustom('#generateBarcodeForm');

    const barcodeForm = document.getElementById('generateBarcodeForm');
    const containerId = "generatedBarcodeContainer";
    const input = 'barcodeInput';
    barcodeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var validationErrors = barcodeValidate.validateBarcodeForm(input);
        if (_enableLogging)
            util.consoleLogMessage(`validation errors: ${validationErrors[0]} type: ${validationErrors[1]}`, "index.js onload");
        if (validationErrors[0]) {
            barcodeGenerator.GenerateBarcodes(containerId, input, validationErrors[1]);
        } else {
            if (_enableLogging)
                util.consoleLogMessage("Barcodes Validation failed!", "index.js generateBarcode submit:");
        }
    });
    const enableCamera = document.getElementById('enableCamera');

    enableCamera.addEventListener("click", function(event) {
        if (!_cameraEnabled) {
            _cameraEnabled = true;
            camera.initQuagga();
        }
    });

}