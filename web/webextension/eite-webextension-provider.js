window.b8316ea083754b2e9290591f37d94765EiteWebextensionProviderSelected="boruhcen";
window.b8316ea083754b2e9290591f37d94765EiteWebextensionProviderReturn="nehcubor";


(function() {
    if (window.b8316ea083754b2e9290591f37d94765EiteWebextensionProviderHasRun) {
        return;
    }
    window.b8316ea083754b2e9290591f37d94765EiteWebextensionProviderHasRun = true;

    browser.runtime.onMessage.addListener(b8316ea083754b2e9290591f37d94765EiteWebextensionProvider);

    function b8316ea083754b2e9290591f37d94765EiteWebextensionProvider(message){
        alert(message);
    }
})();
