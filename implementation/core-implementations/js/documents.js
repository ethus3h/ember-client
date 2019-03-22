// Implementations of routines provided in public-interface.stagel.

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    // Start actually running the document
    startDocumentExec(execId);

    // This routine only handles external events and puts them into the event 

    let events = [];
    events = await getDesiredEventNotifications(execId);

    let outFormat;
    outFormat = await getEnvPreferredFormat();

    await renderDrawContents(await dcaToFormat(outFormat, strArrayDocumentExecData[execId]));
}
