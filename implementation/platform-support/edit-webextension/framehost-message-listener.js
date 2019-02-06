window.addEventListener('message', function(message) {
    console.log(message.data);
    browser.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
            browser.tabs.sendMessage(tabArray[0].id, message.data).then(response=>{
                // Handle response from content script
                window.close();
            }).catch(console.error.bind(console));
        }
    )}
);
