async function internalRunDocument(document) {
    await assertIsDcArray(document);

    let doc = '';
    doc = await startDocument(document);
    let events = [];
    events = await getDesiredEventNotifications(doc);
}

async function internalLoadDocument(format, path) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = async function(oEvent) {
        callback(new Uint8Array(oReq.response)); // Note: not oReq.responseText
    };
    oReq.send(null);
}

async function implOperateOnDocFromUrl(strFormat, strUrl, callback) {
    await implUrlLoadForCallback(strUrl, async function(bytearrayContent) { await callback(await dcarrParseDocument(strFormat, bytearrayContent)); });
}
