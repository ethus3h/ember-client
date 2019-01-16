// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

//        implRunEiteTest("ept", "idiomatic-hello-world-sems");

async function internalRunDocument(document) {
    await assertIsDcArray(document);
    let doc = '';
    doc = await startDocument(document);
    let events = [];
    events = await getDesiredEventNotifications(doc);
};

// @license-end
