window.onload = function() {
    // Your JavaScript code to run after the page loads 
    console.log("Page and all resources fully loaded!");
    // // Example: Manipulate DOM elements 
    UIkit.navbar('#test');
    UIkit.switcher('.uk-switcher');
    UIkit.tab('#component-nav-tabs', { connect: '#component-nav-tabs' });
    UIkit.svg('#barcodez');
    UIkit.grid('#homeGrid');
    UIkit.grid('#barcodeGrid');


    JsBarcode("#barcodez", "Hi!");
};