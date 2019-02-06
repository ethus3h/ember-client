async function framehostMain() {
    if (typeof browser === 'undefined') {
        // Not running as a WebExtension
        response=['b8316ea083754b2e9290591f37d94765EiteWebextensionMessage', true, " <input class=\"nav-trigger\" id=\"nav-trigmain>  ", document.baseURI]
        iframe=document.getElementById('eiteEditToolFrame');
        iframe.contentWindow.postMessage(response, iframe.src);
    }
    else {
        // Running as a WebExtension
        browser.tabs.executeScript(
            { file: "/eite-webextension-get.js" }
        ).then(function(response){
            // Handle response from content script
            response[3]=document.getElementById('eiteEditToolFrame').src;
            iframe=Document.getElementById('eiteEditToolFrame');
            console.log(response);
            iframe.contentWindow.postMessage(response);
        }).catch(console.error.bind(console));
    }
}

window.onload=framehostMain;
