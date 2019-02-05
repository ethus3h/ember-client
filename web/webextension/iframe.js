(async function(){
    alert(',');
    browser.tabs.executeScript(
        { file: "/eite-webextension-get.js" }
    ).then(response=>{
        // Handle response from content script
        document.getElementById('test').innerHTML='buteriuro';
    }).catch(console.error.bind(console));
})();
