// Implementations of routines provided in public-interface.stagel.

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    let events = [];
    events = await getDesiredEventNotifications(execId);

    // FIXME: Make this not just be converting the document and dumping it out.
    let outFormat;
    outFormat = await getEnvPreferredFormat();
    await renderDrawContents(await dcaToFormat(outFormat, await dcaFromSems(await strToByteArray(strArrayDocumentExecData[execId]))));
}
