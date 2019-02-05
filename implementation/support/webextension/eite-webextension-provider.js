window.b8316ea083754b2e9290591f37d94765EiteWebextensionProviderSelected="boruhcen";
window.b8316ea083754b2e9290591f37d94765EiteWebextensionProviderReturn="nehcubor";


(function() {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    browser.runtime.onMessage.addListener(notify);
    function notify(message){
        alert(message.record);
    }
})();
