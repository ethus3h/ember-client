window.addEventListener('message', function(message) {
    browser.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
            browser.tabs.sendMessage(tabArray[0].id, message).then(response=>{
                // Handle response from content script
                window.close();
            }).catch(console.error.bind(console));
        }
    )}
);
