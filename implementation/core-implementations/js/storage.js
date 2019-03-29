async function storageSetup() {
    ipfsNode = new IPFS();
    await new Promise(resolve => {
        ipfsNode.once('ready', () => {
            resolve()
        });
    });
}

async function storageSave(data) {
    
}

async function storageRetrieve(id) {
    
}
