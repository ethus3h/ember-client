browser.tabs.executeScript(
    { file: "/eite-webextension-provider.js"}
).then(function () {
    browser.tabs.sendMessage(browser.tabs.query({
    currentWindow: true,
    active: true
  })[0], {record: "start"}) 
}).catch(console.error.bind(console));
