async function storageSetup() {
    ipfsNode = new IPFS();
    await new Promise(resolve => {
        ipfsNode.once('ready', () => {
            resolve()
        });
    });
}

async function storageSave(data) {
    node.files.add(node.types.Buffer.from(data), (err, files) => {
    if (err) return console.error(err)

    // 'hash', known as CID, is a string uniquely addressing the data
    // and can be used to get it again. 'files' is an array because
    // 'add' supports multiple additions, but we only added one entry
    console.log(files[0].hash)
}

async function storageRetrieve(id) {
    
}
