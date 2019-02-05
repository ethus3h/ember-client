browser.tabs.executeScript(
    { file: "/eite-webextension-provider.js"}
).then(function () {
    browser.tabs.sendMessage({record: "start"}) 
}).catch(console.error.bind(console));
