(async function(){
    tab=await browser.tabs.query({
        currentWindow: true,
        active: true
    });

    browser.tabs.executeScript(
        { file: "/eite-webextension-provider.js"}
    ).then(response=>{
        // Handle response from content script
        alert('Got Response fromcontent scritp');
    }).catch(console.error.bind(console));
})();
