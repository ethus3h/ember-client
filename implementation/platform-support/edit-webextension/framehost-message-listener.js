window.addEventListener('message', function(message) {
    if (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage') {
        // Pass edited data back to content script
        browser.tabs.query(
            { currentWindow: true, active: true },
            function (tabArray) {
                browser.tabs.sendMessage(tabArray[0].id, message.data).then(response=>{
                    // Handle response from content script
                    window.close();
                }).catch(console.error.bind(console));
            }
        )}
    }
    // Inline document renderer messages.
    // Architecture:
    /* 
     *  Content script
     *      │
     *      │ ⑴ On spotting a document, makes a frame with a URL with a
     *      │   frame ID in the anchor (# part of the URL), and
     *      │   sends the document contents to the message listener.
     *      │
     *      ├─────────────────────────────────┐
     *      ↓                                 ↓
     *    Editor in frame            Framehost message listener
     *      │
     *      │ ⑵ Asks message listener   │
     *      │   for document matching    │
     *      │   ID in anchor             │
     *      └────────────────────────────┘
     *  
     * 
     * 
     * 
     * */
);
