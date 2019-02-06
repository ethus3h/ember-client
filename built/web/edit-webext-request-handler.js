window.addEventListener('message', async function(message) {
    
https://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
function onRemove(element, onDetachCallback) {
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
    let mutobs=new MutationObserver(function(e){
        if (e[0].removedNodes) {
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
        }
    });
    mutobs.observe(document.getElementById('overlay'))
});
