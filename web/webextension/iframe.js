(async function(){
    tab=await browser.tabs.query({
        currentWindow: true,
        active: true
    });

    browser.tabs.executeScript(
        { file: "/eite-webextension-provider.js"}
    ).then(response=>{
        // Handle response from content script
        console.log(response);
        console.log('bubububub');
    }).catch(console.error.bind(console));
})();
