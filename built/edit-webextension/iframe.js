window.onload=(async function(){
    console.log('butecinuecut');
    if (typeof browser !== 'undefined') {
        // Running as a WebExtension
        await setupIfNeeded();
        console.log('setup');
        browser.tabs.executeScript(
            { file: "/eite-webextension-get.js" }
        ).then(response=>{
            // Handle response from content script
            response[3]=document.getElementById('eiteEditToolFrame').src;
            iframe=Document.getElementById('eiteEditToolFrame');
            console.log(response);
            iframe.contentWindow.postMessage(response);
        }).catch(console.error.bind(console));
    }
});
