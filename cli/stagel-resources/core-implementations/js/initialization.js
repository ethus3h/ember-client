// Global variables

let haveDom = false;
let datasets = [];
let datasetsLoaded = [];
let dcData = [];

async function internalSetup() {
    // Detect if we can create DOM nodes (otherwise we'll output to a terminal)
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    datasets = await listDcDatasets();
    await internalLoadDatasets();
}

async function internalLoadDatasets() {
    let count = 0;
    let dataset = '';
    while (count < Object.keys(datasets).length) {
        dataset = datasets[count];
        dcData[dataset] = [];
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
