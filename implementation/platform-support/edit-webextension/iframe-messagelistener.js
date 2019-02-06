window.addEventListener('message', function(message) {
    chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
        chrome.tabs.executeScript(tabArray[0].id, {
            file: 'src/js/scripts/extractCSS.js'
         }, function() {
            chrome.tabs.sendMessage(this.props.source);

        })
    }
);
    browser.tabs.sendMessage(message).then(response=>{
        // Handle response from content script
        iframe=Document.getElementById('eiteEditToolFrame');
        iframe.contentWindow.postMessage(response);
    }).catch(console.error.bind(console));
});
