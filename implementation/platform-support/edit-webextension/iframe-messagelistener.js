window.addEventListener('message', function(message) {
    browser.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
        browser.tabs.executeScript(, {
            file: 'src/js/scripts/extractCSS.js'
         }, function() {
            browser.tabs.sendMessage(tabArray[0].id, message).then(response=>{
        // Handle response from content script
        iframe=Document.getElementById('eiteEditToolFrame');
        iframe.contentWindow.postMessage(response);
    }).catch(console.error.bind(console));;

        })
    }
);
    browser.tabs.sendMessage(message).then(response=>{
        // Handle response from content script
        iframe=Document.getElementById('eiteEditToolFrame');
        iframe.contentWindow.postMessage(response);
    }).catch(console.error.bind(console));
});
