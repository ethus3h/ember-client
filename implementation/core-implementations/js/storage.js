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
        if (err) {
            await implDie(err.toString());
        }
        // "'hash', known as CID, is a string uniquely addressing the data and can be used to get it again. 'files' is an array because 'add' supports multiple additions, but we only added one entry" —https://js.ipfs.io/
        return files[0].hash;
    });
}

async function storageRetrieve(id) {
    node.files.cat('QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A', (err, data) => {
    if (err) return console.error(err)

    // convert Buffer back to string
    console.log(data.toString())
  })
}
