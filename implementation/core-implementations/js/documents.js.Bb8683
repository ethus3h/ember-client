// Implementations of routines provided in public-interface.stagel.

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    let events = [];
    events = await getDesiredEventNotifications(execId);

    let outFormat;
    outFormat = await getEnvPreferredFormat();

    await renderDrawContents(await dcaToFormat(outFormat, strArrayDocumentExecData[execId]));
}
