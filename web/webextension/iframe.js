(async function(){
    tab=await browser.tabs.query({
        currentWindow: true,
        active: true
    });

    browser.tabs.executeScript(
        { file: "/eite-webextension-provider.js"}
    ).then((async function () {tab[0].id, {record: "start"}) 
    })()).catch(console.error.bind(console));
})();
