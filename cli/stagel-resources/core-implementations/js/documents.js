async function getFileFromPath(path) {
    // Returns an array of bytes.
    let response = await new Promise(resolve => {
        var oReq = new XMLHttpRequest();
        oReq.open('GET', path, true);
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(oEvent) {
            resolve(new Uint8Array(oReq.response)); // Note: not oReq.responseText
        };
        oReq.onerror = function() {
            resolve(undefined);
        }
        oReq.send(null);
    });
    if (response !== undefined) {
        return response;
    }
    await assertFailed('An error was encountered loading the requested document.');
}

// Implementations of routines provided in public-interface.stagel.

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    let events = [];
    events = await getDesiredEventNotifications(execId);
    async function runDocument(dcarrContent) {
    strTargetFormat = await getEnvironmentPreferredFormat();
    await implDoRenderIo(await dcarrConvertDocument(dcarrContent, strTargetFormat, await implGetEnvironmentRenderTraits(strTargetFormat)), strTargetFormat);
}
startDocument(async function() { return await loadDocument('sems', 'idiomatic-hello-world.sems'); });
    implLoadDatasets(function() {
        // This is where the actual commands to run (entry points) should go
        implOperateOnDocFromUrl("sems", "idiomatic-hello-world.sems", async function (doc) { await runDocument(doc); } );
    });
}
