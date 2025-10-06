import * as barcodeValidate from "/src/BarcodeGeneration/barcodeValidation.js"
import * as barcodeGenerator from "/src/BarcodeGeneration/barcodeGenerator.js"
import * as camera from "/src/util/cameraInit.js"
import * as barcodeRepository from "/src/BarcodeProcessing/BarcodeRepository.js"
import * as raceRepository from "/src/BarcodeProcessing/raceRepository.js"

import * as htmlGen from "/src/util/htmlCreator.js"

import * as util from "/src/util/utility.js"
import * as db from "/src/db/db.js"

window.onload = async function() {
    await db.populateInitialTable();

    var _enableLogging = true;
    var _cameraEnabled = false;
    barcodeValidate.enableLogging(_enableLogging);
    barcodeGenerator.enableLogging(_enableLogging);
    barcodeRepository.enableLogging(_enableLogging);
    raceRepository.enableLogging(_enableLogging);

    util.enableLogging(_enableLogging);

    // Your JavaScript code to run after the page loads 
    if (_enableLogging)
        util.consoleLogMessage("Page and all resources fully loaded!", "index.js onload");
    // UIkit Initialization
    UIkit.navbar('#runnerscannerNavbar');
    UIkit.switcher('.uk-switcher');
    UIkit.tab('#component-nav-tabs', { connect: '#component-nav-tabs' });
    UIkit.svg('#barcodez');
    UIkit.grid('#homeGrid');
    UIkit.grid('#barcodeGrid');
    UIkit.formCustom('#generateBarcodeForm');
    UIkit.modal('#modal-close-default');

    const barcodeForm = document.getElementById('generateBarcodeForm');
    const containerId = "generatedBarcodeContainer";
    const input = 'barcodeInput';
    //BARCODE GENERATION
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
    //Start/Stop Race
    //Check if race has a start
    var raceHasStarted = await raceRepository.getRaceInformation('start');
    var raceHasEnded = await raceRepository.getRaceInformation('end');

    var hasRaceStarted = !util.isEmptyOrNullOrUndefined(raceHasStarted);
    var hasRaceEnded = !util.isEmptyOrNullOrUndefined(raceHasEnded);
    const raceStartTime = this.document.getElementById('raceStartTime');
    const raceEndTime = this.document.getElementById('raceEndTime');


    //CAMERA
    const enableCamera = document.getElementById('enableCamera');
    enableCamera.addEventListener("click", InitCamera);
    const disableCamera = document.getElementById('disableCamera');
    disableCamera.addEventListener("click", EndRace)

    if (hasRaceStarted) {
        //enableCamera.disabled = true;
        raceStartTime.innerText = raceHasStarted;
    }
    if (hasRaceEnded) {
        disableCamera.disabled = true;
        enableCamera.disabled = true;
        raceEndTime.innerText = raceHasEnded;
        disableCamera.removeEventListener("click", EndRace);
    }
    //GRIDS
    var allResults = await barcodeRepository.getAllBarcodes();
    var allCounts = await barcodeRepository.getAllBarcodeCounts();
    if (_enableLogging)
        util.consoleLogMessage(`allResults: ${allResults}`, "index.js onload");
    if (_enableLogging)
        util.consoleLogMessage(`allCounts: ${allCounts}`, "index.js onload");

    var allCountsGrid = htmlGen.allCountsTableCreate(allCounts, "allCountsTable");
    var allResultsGrid = htmlGen.allResultsTableCreate(allResults, "allResultsTable");
    const reloadGrids = this.document.getElementById("reloadGrids");
    reloadGrids.addEventListener("click", async function(event) {
        allCountsGrid.destroy();
        allResultsGrid.destroy();
        allResults = await barcodeRepository.getAllBarcodes();
        allCounts = await barcodeRepository.getAllBarcodeCounts();
        allCountsGrid = htmlGen.allCountsTableCreate(allCounts, "allCountsTable");
        allResultsGrid = htmlGen.allResultsTableCreate(allResults, "allResultsTable");
    });
    //Setup demo barcodes
    var demoBarcodes = [1, 2, 3];
    const demoSettings = {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true,
    };
    for (const value of demoBarcodes) {
        JsBarcode(`#barcode-${value}`, `${value}`, demoSettings);

    }
    const demoBarcodeButtons = document.querySelectorAll('.rsDemoBarcodes');

    if (!hasRaceStarted) {
        demoBarcodeButtons.forEach(element => {
            element.setAttribute("disabled", "");
        });

    } else {
        demoBarcodeButtons.forEach(element => {
            element.disabled = false;
        })
    }
    if (hasRaceEnded) {
        demoBarcodeButtons.forEach(element => {
            element.removeAttribute('disabled');
        });

    }


    //MODAL
    const deleteTable = this.document.getElementById('DeleteTable');
    deleteTable.addEventListener("click", async function(event) {
        await db.deleteDatabase();

        window.location.reload(); // Reload the page after the async call completes

    });



    async function InitCamera() {
        var enableCamera = document.getElementById('enableCamera');
        enableCamera.removeEventListener("click", InitCamera);


        // pass current cooldown to camera init (optional)
        camera.initQuagga();
        if (_enableLogging)
            util.consoleLogMessage(`hasRaceStarted: ${hasRaceStarted}`, "index.js InitCamera")
        if (!hasRaceStarted) {
            if (_enableLogging)
                util.consoleLogMessage(`inside if`, "index.js InitCamera")
            hasRaceStarted = true;
            var raceInfo = await raceRepository.setRaceInformation('start');
            raceStartTime.innerText = raceInfo;
        }
        const elementsToAddListeners = document.querySelectorAll('.rsDemoBarcodes');
        elementsToAddListeners.forEach(element => {
            element.addEventListener('click', demoBarcodeScan);
            element.disabled = false;
        });

    }

    async function EndRace() {
        var disableCamera = document.getElementById('disableCamera');
        disableCamera.removeEventListener("click", EndRace);
        var enableCamera = document.getElementById('enableCamera');
        enableCamera.removeEventListener("click", InitCamera);
        await raceRepository.setRaceInformation('end');
        var endInfo = await raceRepository.setRaceInformation('end');
        raceEndTime.innerText = endInfo;
        enableCamera.disabled = true;
        const elementsToRemoveListeners = document.querySelectorAll('.rsDemoBarcodes');

        // 4. Iterate and remove the event listener using the same function reference
        elementsToRemoveListeners.forEach(element => {
            element.removeEventListener('click', demoBarcodeScan);
            element.disabled = true;

        });

    }
    async function demoBarcodeScan(event) { // Select the desired child element within event.target
        var code = event.target.getAttribute('key');

        //console.log(`demo barcode scan: ${code}`);
        var scanSuccessful = barcodeRepository.handleScan(code);
        if (scanSuccessful) {
            const mySound = new Audio('/assets/mixkit-correct-answer-tone-2870.wav');
            mySound.play();
        }
    }
};