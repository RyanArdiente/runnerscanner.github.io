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
    console.log(raceHasStarted);
    console.log(raceHasEnded);
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
        enableCamera.disabled = true;
        raceStartTime.innerText = raceHasStarted;
        enableCamera.removeEventListener("click", InitCamera);
    }
    if (hasRaceEnded) {
        disableCamera.disabled = true;
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
    //MODAL
    const deleteTable = this.document.getElementById('DeleteTable');
    deleteTable.addEventListener("click", async function(event) {
        await db.deleteDatabase();

        window.location.reload(); // Reload the page after the async call completes

    });

    async function InitCamera() {
        var enableCamera = document.getElementById('enableCamera');
        enableCamera.removeEventListener("click", InitCamera);
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

    }

    async function EndRace() {
        var disableCamera = document.getElementById('disableCamera');
        disableCamera.removeEventListener("click", EndRace);
        await raceRepository.setRaceInformation('end');
        var endInfo = await raceRepository.setRaceInformation('end');
        raceEndTime.innerText = endInfo;
    }

};