// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

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
        if ((message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage') || (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUtf8')) {
            startSpinner();
            window.setTimeout(async function() {
                canEdit=message.data[1];
                contents=message.data[2];
                window.b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUri=message.data[3];
                let utf8encoder = new TextEncoder();
                let tempInterpreted;
                if (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage'){
                    tempInterpreted=await eiteCall('importAndExport', ['ascii', 'integerList', new Uint8Array(utf8encoder.encode(contents))]);
                }
                else {
                    await pushImportSettings(await getFormatId('utf8'), 'variants:dcBasenb,');
                    tempInterpreted=await eiteCall('importAndExport', ['utf8', 'integerList', new Uint8Array(utf8encoder.encode(contents))]);
                    await popImportSettings(await getFormatId('utf8'));
                }
                document.getElementById('inputarea').value = await eiteCall('strFromByteArray', [tempInterpreted]);
                removeSpinner();
                RunDocumentHandler(async function() {
                    if (!canEdit) {
                        openAlertDialog('Note: The requested content is read-only.');
                    }
                    else {
                        let elem=document.importNode(document.getElementById('doneButtonTemplate').content, true);
                        elem.firstChild.onclick=function(){updateNearestDcLabel(document.getElementById('inputarea'));DoneEditingHandler();};
                        elem.disabled=false;
                        document.getElementById('editorButtons').appendChild(elem.firstChild);
                    }
                });
            }, 500);
        }
    };

    window.DoneEditingHandler = async function() {
        startSpinner();
        window.setTimeout(async function() {
            let utf8decoder = new TextDecoder();
            window.parent.postMessage(['b8316ea083754b2e9290591f37d94765EiteWebextensionMessage',utf8decoder.decode(new Uint8Array(await eiteCall('importAndExport', ['integerList', 'ascii', await getInputDoc()])))], window.b8316ea083754b2e9290591f37d94765EiteWebextensionMessageUri);
        }, 500);
    }

    onRemove(document.getElementById('overlay'), function() {
        eiteReadyCallback(message);
    });
});

// @license-end
