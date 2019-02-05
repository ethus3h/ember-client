browser.tabs.executeScript(tab, { file: "eite-webextension-provider.js",}).then(function () { browser.tabs.sendMessage(tab, {record: "start"}) }).catch(console.error.bind(console));
