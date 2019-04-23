// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

window.onload = async function() {
    //eiteCall('startEite');
    EITE_STORAGE_CFG=['mysqlApi', 'http://futuramerlin.com/specification/engineering-and-technology/information-technology/software/env/web/api.php', 'mysqlApiUser', 'test', 'mysqlApiSecretKey', 'test'];
    await storageSetup(EITE_STORAGE_CFG);
    let attachFn = (elem, func) => {
        document.getElementById(elem).onclick=func;
    }

    let doc = await eiteCall('loadStoredDocument', ['sems', 'eite.sems']);
    let execId = await eiteCall('runDocumentPrepare', [doc]);
    await eiteCall('setExecOption', [execId, 'stopExecAtTick', '30']);
    await eiteCall('runDocumentGo', [execId]);
};

// @license-end