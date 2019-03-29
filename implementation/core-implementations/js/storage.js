async function storageSetup() {
    ipfsNode = new IPFS();
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
}
