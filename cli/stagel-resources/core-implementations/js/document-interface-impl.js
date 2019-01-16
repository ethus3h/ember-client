async function internalRunDocument(document) {
    await assertIsDcArray(document);

    let doc = '';
    doc = await startDocument(document);
    let events = [];
    events = await getDesiredEventNotifications(doc);
}

async function internalLoadDocument(format, path) {
    let response = await new Promise(resolve => {
        var oReq = new XMLHttpRequest();
        oReq.open('GET', url, true);
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(oEvent) {
            resolve(new Uint8Array(oReq.response)); // Note: not oReq.responseText
        };
        oReq.onerror = function() {
            resolve(undefined);
        }
        oReq.send(null);
    }
    if (response !== undefined) {
        return response;
    }
    await assertFailed('An error was encountered loading the requested document.');
}

async function implOperateOnDocFromUrl(strFormat, strUrl, callback) {
    await implUrlLoadForCallback(strUrl, async function(bytearrayContent) { await callback(await dcarrParseDocument(strFormat, bytearrayContent)); });
}
