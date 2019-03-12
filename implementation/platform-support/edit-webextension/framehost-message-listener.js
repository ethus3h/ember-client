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
     * • Content script = render-inline-dc-docs.js;
     * • Editor in frame = edit-webext-request-handler.js;
     * • Framehost message listener = framehost-message-listener.js (this file)
     * 
     *  Content script
     *      │
     *      │ ⑴ On spotting a document, sends the document contents to the
     *      │   message listener with a frame ID, then makes a frame with
     *      │   a URL with the frame ID in the anchor (# part of the URL).
     *      │
     *      ├─────────────────────────────────┐
     *      ↓                                 ↓
     *    Editor in frame            Framehost message listener
     *      ↑   │                            ↑        │
     *      │   │ ⑵ Asks message listener    │        │ ⑶ Sends document contents
     *      │   │   for document matching    │        │   back to editor in frame
     *      │   │   ID in anchor             │        │
     *      │   └────────────────────────────┘        │
     *      └─────────────────────────────────────────┘
     * */
);
