(function() {
    browser.runtime.onMessage.addListener(b8316ea083754b2e9290591f37d94765EiteWebextensionProviderMessage => {alert('c'); b8316ea083754b2e9290591f37d94765EiteWebextensionProvider(b8316ea083754b2e9290591f37d94765EiteWebextensionProviderMessage) });

    function b8316ea083754b2e9290591f37d94765EiteWebextensionProvider(message){
        alert(message);
    }
})();
