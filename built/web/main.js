// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

window.onload = async function() {
    //eiteCall('startEite');
    let doc = await eiteCall('loadStoredDocument', ['sems', 'eite.sems']);
    let execId = await eiteCall('runDocumentPrepare', [doc]);
    await eiteCall('setExecOption', ['stopExecAtTick', 30]);
    await eiteCall('runDocumentGo', [execId]);
};

// @license-end
