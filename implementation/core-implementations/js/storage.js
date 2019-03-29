async function storageSetup() {
    // Later, use OrbitDB. Currently they don't support granting write access after a database has been created, which makes it unusable for this.
    /* ipfsNode = new IPFS();
    await new Promise(resolve => {
        ipfsNode.once('ready', () => {
            resolve()
        });
    }); */
}

async function storageSave(data) {
    await assertIsIntArray(data);
    if (data.constructor.name !== 'Uint8Array') {
        data = new Uint8Array(data);
    }
    /* ipfsNode.files.add(ipfsNode.types.Buffer.from(data), (err, files) => {
        if (err) {
            await implDie(err.toString());
        }
        // "'hash', known as CID, is a string uniquely addressing the data and can be used to get it again. 'files' is an array because 'add' supports multiple additions, but we only added one entry" —https://js.ipfs.io/
        return files[0].hash;
    }); */
}

async function storageRetrieve(id) {
    /* ipfsNode.files.cat(id, (err, data) => {
        if (err) {
            await implDie(err.toString());
        }
        return new Uint8Array(data);
    }); */
}
