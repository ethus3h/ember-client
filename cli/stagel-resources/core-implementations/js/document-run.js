async function internalRunDocument(document) {
    await assertIsDcArray(document);

    let doc = '';
    doc = await startDocument(document);
    let events = [];
    events = await getDesiredEventNotifications(doc);
}
