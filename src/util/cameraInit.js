// quaggaInit.js
import * as barcodeRepository from "/src/BarcodeProcessing/BarcodeRepository.js"


export function initQuagga() {
    var QuaggaCameraEnabled = false;
    barcodeRepository.enableLogging(true);
    if (typeof Quagga === "undefined") {
        console.error("QuaggaJS not loaded. Did you include the CDN script?");
        return;
    }
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector("#interactive"),
            constraints: {
                facingMode: "environment"
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        decoder: {
            readers: ["code_128_reader"]
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error("Quagga init failed:", err);
            return;
        }
        console.log("Quagga initialized, starting...");
        Quagga.start();
        QuaggaCameraEnabled = true;
    });

    // Optional: debug overlays
    Quagga.onProcessed(function(result) {
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

            if (result.boxes) {
                result.boxes
                    .filter(box => box !== result.box)
                    .forEach(box => {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                            color: "green",
                            lineWidth: 2
                        });
                    });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                    color: "#00F",
                    lineWidth: 2
                });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, {
                    color: "red",
                    lineWidth: 3
                });
            }
        }
    });

    // Detection handler
    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        //console.log("Detected code:", result.codeResult.code);
        var scanSuccessful = barcodeRepository.handleScan(code, SCAN_COOLDOWN);
        //console.log(scanSuccessful);
        if (scanSuccessful && QuaggaCameraEnabled) {
            // Create a new Audio object, providing the path to your sound file
            const mySound = new Audio('/assets/mixkit-correct-answer-tone-2870.wav');

            // Play the sound
            mySound.play();
        }
    });

    // start/stop button
    document.querySelector(".controls").addEventListener("click", e => {
        if (e.target.matches("button.stop")) {
            e.preventDefault();
            Quagga.stop();
            QuaggaCameraEnabled = false;
            var enableCamera = document.getElementById('enableCamera');
            var disableCamera = document.getElementById('disableCamera');
            disableCamera.disabled = true;
            enableCamera.disabled = true;
            /*const cameraContainer = document.getElementById("cameraContainerDiv");
            if (cameraContainer) {
                cameraContainer.innerHTML = ""; // Clears the inner content
            }*/
        }
        /* if (e.target.matches("button.start") && cameraEnabled == false) {
             e.preventDefault();
             cameraEnabled = true;
             /* const cameraContainer = document.getElementById("interactive");
              console.log(cameraContainer);
              if (!cameraContainer) {
                  const outputContainer = document.getElementById("cameraContainerDiv");
                  outputContainer.innerHTML = `<div id="interactive" class="viewport"></div>`; // Clears the inner content
                  }*/
        /*    Quagga.start();
        }*/
    });

}
export default { initQuagga };