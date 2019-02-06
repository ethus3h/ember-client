window.addEventListener('message', function(message) {
    function onRemove(element, onDetachCallback) {
        // https://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
        if (element !== null) {
            const observer = new MutationObserver(function () {
                function isDetached(el) {
                    if (el.parentNode === document) {
                        return false;
                    } else if (el.parentNode === null) {
                        return true;
                    } else {
                        isDetached(el.parentNode);
                    }
                }
                if (isDetached(element)) {
                    observer.disconnect();
                    onDetachCallback();
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }

    async function eiteReadyCallback(message) {
        if (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage') {
            startSpinner();
            window.setTimeout(async function() {
                canEdit=message.data[1];
                contents=message.data[2];
                window.b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUri=message.data[3];
                if (!canEdit) {
                    openAlertDialog('Note: The requested content is read-only.');
                }
                else {
                    let elem=document.importNode(document.getElementById('doneButtonTemplate').content, true);
                    document.getElementById('editorButtons').appendChild(elem.firstChild);
                }
                let utf8encoder = new TextEncoder();
                document.getElementById('inputarea').value = await strFromByteArray(await importAndExport('ascii', 'integerList', new Uint8Array(utf8encoder.encode(contents))));
                removeSpinner();
                RunDocumentHandler();
            }, 500);
        }
    };

    window.DoneEditingHandler = async function() {
        startSpinner();
        window.setTimeout(async function() {
            console.log(window.b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUri);
            let utf8decoder = new TextDecoder();
            window.parent.postMessage(['b8316ea083754b2e9290591f37d94765EiteWebextensionMessage',utf8decoder.decode(await importAndExport('integerList', 'ascii', await getInputDoc()))], window.b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUri);
        }, 500);
    }

    onRemove(document.getElementById('overlay'), function() {
        eiteReadyCallback(message);
    });
});
