(async function(){await console.log(await browser.tabs.query({
    currentWindow: true,
    active: true
  }));
browser.tabs.executeScript(
    { file: "/eite-webextension-provider.js"}
).then((async function () {
    await browser.tabs.sendMessage(await browser.tabs.query({
    currentWindow: true,
    active: true
  })[0].id, {record: "start"}) 
})()).catch(console.error.bind(console));
})();
