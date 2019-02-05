(async function(){
    browser.tabs.executeScript(
        { file: "/eite-webextension-get.js" }
    ).then(response=>{
        console.log(response);
        // Handle response from content script
        document.getElementById('test').innerHTML='buteriuro';
    }).catch(console.error.bind(console));
})();
