// Schema: node[id, version, data]; idxPerson[nodeId, publicId, hashedPrivatekey]; idxSession[nodeId, sessionKey, created, expires, events]
// Node table is append only. Index tables are read-write.

async function storageSetup(kvStorageCfgParam) {
    kvStorageCfg=kvStorageCfgParam;
    // Later, use OrbitDB. Currently they don't support granting write access after a database has been created, which makes it unusable for this.
    /* ipfsNode = new IPFS();
    await new Promise(resolve => {
        ipfsNode.once('ready', () => {
            resolve()
        });
    }); */
    // Provider: MySQL
    let mysqlApi=await kvGetValue(kvStorageCfg, )
    mysqlApi='http://futuramerlin.com/'
    strArrayStorageCfg=
}

async function storageSave(session, data) {
    await assertIsIntArray(data); let intRes;
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
    await assertIsInt(intRes); return intRes;
}

async function storageRetrieve(session, id) {
    await assertIsInt(id); let intArrayRes;
    /* ipfsNode.files.cat(id, (err, data) => {
        if (err) {
            await implDie(err.toString());
        }
        return new Uint8Array(data);
    }); */
    await assertIsIntArray(intArrayRes); return intArrayRes;
}
