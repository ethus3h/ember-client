window.addEventListener('message', function(message) {
    function onRemove(element, onDetachCallback) {
        // https://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
        console.log(element);console.log(onDetachCallback);
        const observer = new MutationObserver(function () {
            function isDetached(el) {
                if (el.parentNode === document) {
                    false;
                } else if (el.parentNode === null) {
                    true;
                } else {
                    isDetached(el.parentNode);
                }
            }

            if (isDetached(element)) {
                observer.disconnect();
                onDetachCallback();
            }
        })

        observer.observe(document, {
            childList: true,
            subtree: true
        })
    }

    async function eiteReadyCallback(message) {
        console.log(message);
        if (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage') {
            canEdit=message.data[1];
            contents=message.data[2];
            console.log(message.data);
            if (!canEdit) {
                openAlertDialog('The requested content is read-only.');
            }
            let utf8encoder = new TextEncoder();
            document.getElementById('inputarea').value = await strFromByteArray(await importAndExport('ascii', 'integerList', new Uint8Array(utf8encoder.encode(contents))));
        }
    };

    console.log(message);

    onRemove(document.getElementById('overlay'), function(){eiteReadyCallback(message);});
});
