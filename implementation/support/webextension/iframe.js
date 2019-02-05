(async function(){
    tab=await browser.tabs.query({
        currentWindow: true,
        active: true
    });

    browser.tabs.executeScript(
        { file: "/eite-webextension-provider.js"}
    ).then(response=>{
        // Handle response from content script
    }).catch(console.error.bind(console));
})();
