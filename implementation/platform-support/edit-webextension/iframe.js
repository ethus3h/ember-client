window.onload=(async function(){
    if (typeof browser !== 'undefined') {
        // Running as a WebExtension
        await setupIfNeeded();
        browser.tabs.executeScript(
            { file: "/eite-webextension-get.js" }
        ).then(response=>{
            // Handle response from content script
            iframe=Document.getElementById('eiteEditToolFrame');
            iframe.contentWindow.postMessage(response);
        }).catch(console.error.bind(console));
    }
});

