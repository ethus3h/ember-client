// Implementations of routines provided in public-interface.stagel.

async function setBufferDirty(execId) {
    await assertIsExecId(execId);
    
}

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    let events = [];
    events = await getDesiredEventNotifications(execId);

    let outFormat;
    outFormat = await getEnvPreferredFormat();

    while (true) {
        await renderDrawContents(await dcaToFormat(outFormat, strArrayDocumentExecData[execId]));
    }
}
