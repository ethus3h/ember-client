(async function(){
    tab=await browser.tabs.query({
        currentWindow: true,
        active: true
    });

    browser.tabs.executeScript(
        { file: "/eite-webextension-get.js"}
    ).then(response=>{
        // Handle response from content script
        document.getElementById('test').innerHTML='buteriuro';
    }).catch(console.error.bind(console));
})();
