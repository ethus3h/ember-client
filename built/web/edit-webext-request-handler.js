window.addEventListener('message', function(message) {
    function onRemove(element, onDetachCallback) {
        // https://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
        const observer = new MutationObserver(function () {
            function isDetached(el) {
                console.log(el);
                if (el.parentNode === document) {
                    return false;
                } else if (el.parentNode === null) {
                    return true;
                } else {
                    isDetached(el.parentNode);
                }
            }
            if (isDetached(element)) {
                console.log('bubeiccecuc');
                observer.disconnect();
                onDetachCallback();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    async function eiteReadyCallback(message) {
        console.log(message);
        if (message.data[0] === 'b8316ea083754b2e9290591f37d94765EiteWebextensionMessage') {
            startSpinner();
            window.setTimeout(async function(){
                canEdit=message.data[1];
                contents=message.data[2];
                console.log(message.data);
                if (!canEdit) {
                    openAlertDialog('The requested content is read-only.');
                }
                let utf8encoder = new TextEncoder();
                document.getElementById('inputarea').value = await strFromByteArray(await importAndExport('ascii', 'integerList', new Uint8Array(utf8encoder.encode(contents))));
                removeSpinner();
            }, 500);
        }
    };

    console.log(message);

    onRemove(document.getElementById('overlay'), function() {
        eiteReadyCallback(message);
    });
});
