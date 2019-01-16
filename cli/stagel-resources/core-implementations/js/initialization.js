// Global variables

let haveDom = false;
let datasets = [];
let datasetsLoaded = false;
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
        // I guess the anonymous functions defined as parameters to the Papa.parse call inherit the value of dataset from the environment where they were defined (i.e., here)??
        await Papa.parse('../data/' + dataset + '.csv', {
            download: true,
            encoding: "UTF-8",
            newline: "\n",
            delimiter: ",",
            quoteChar: "\"",
            step: async function(results, parser) {
                await implDcDataAppendLine(dataset, results);
            },
            complete: async function(results, file) {
                return;
            },
            error: async function(results, file) {
                await implError("Error reported while parsing "+dataset+"!");
            }
        });
        await implLoadCsv(
            ,
            async function(results, parser) {
                await implDcDataAppendLine(dataset, results);
            },
            async function() {
                return;
            },
            async function() {
                
            }
        );
    }
    datasetsLoaded = true;
}
