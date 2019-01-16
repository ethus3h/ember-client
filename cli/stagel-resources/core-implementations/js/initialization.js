// Global variables

let haveDom = false;
let datasets = [];
let datasetsLoaded = 0;
let dcData = [];

async function internalSetup() {
    // Detect if we can create DOM nodes (otherwise we'll output to a terminal)
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    datasets = await listDcDatasets();
    datasetsLoaded = Object.keys(datasets).length;
    await internalLoadDatasets();
}

async function internalLoadDatasets() {
    while (datasetsLoaded < )
    if (!datasetsLoadStarted) {
        
        datasetsWorkingCopy = await datasets.slice();
        datasetsLoadStarted = true;
    }
    if (datasetsWorkingCopy.length > 0) {
        let dataset = datasetsWorkingCopy[0];
        await implDcDataAppendDataset(dataset);
        await implLoadCsv(
            "../data/" + dataset + ".csv",
            async function(results,parser){
                await implDcDataAppendLine(dataset, results);
            },
            async function(){
                datasetsWorkingCopy.shift();
                await implLoadDatasets(callback);
            },
            async function(){
                await eiteError("Error reported while parsing "+dataset+"!");
            }
        );
    }
    else {
        await callback();
    }
}
