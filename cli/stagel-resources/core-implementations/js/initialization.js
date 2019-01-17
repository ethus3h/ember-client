// Global variables

let haveDom = false;
let datasets = []; // as
let datasetsLoaded = false;
let dcData = []; // an
let documentExecData = []; // as
let documentExecMemory = []; // as
let setupFinished = false;

async function isSetupFinished() {
    return setupFinished;
}

async function setupIfNeeded() {
    if (setupFinished) {
        return;
    }
    await internalSetup();
}

async function internalSetup() {
    // Detect if we can create DOM nodes (otherwise we'll output to a terminal). This is used to provide getEnvironmentPreferredFormat.
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    datasets = await listDcDatasets();
    await internalLoadDatasets();

    if (haveDom) {
        // Override error reporting method to show alert
        // TODO: Does this always work? Overrides aren't really possible when it's load-order-independent, I wouldn't think...
        async function implDie(strMessage) {
            // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

            await implError(strMessage);

            throw strMessage;
        }

        async function implError(strMessage) {
            if(typeof strMessage !== "string") {
                throw "Nonstring error message";
            }
            // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop — maybe??

            //await FIXMEUnimplemented("implError");
            await implWarn(strMessage);

            await console.trace();
            alert("EITE reported error!: " + strMessage);
        }

        async function implWarn(strMessage) {
            await assertIsStr(strMessage);
            // Log the provided message

            await FIXMEUnimplemented("implWarn");
            await implLog(strMessage);

            await console.trace();
        }

        async function implLog(strMessage) {
            await assertIsStr(strMessage);
            // Log the provided message

            await console.log(strMessage);
            //await console.trace();
            if(await Object.keys(stagelDebugCallstack).length > 0) {
                await console.log("Previous message sent at: " + await internalDebugPrintStack());
            }
            else {
                if (2 <= STAGEL_DEBUG && 3 > STAGEL_DEBUG) {
                    await console.log("(Previous message sent from non-StageL code.)");
                    await console.trace();
                }
            }
            if (3 <= STAGEL_DEBUG) {
                await console.trace();
            }
        }
    }

    setupFinished = true;
}

async function internalLoadDatasets() {
    // This is a separate function since it may later be desirable to dynamically load datasets while a document is running (so only the needed datasets are loaded).
    let count = 0;
    let dataset = '';
    while (count < Object.keys(datasets).length) {
        count = count + 1;
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
                dcData[dataset].push(results);
            },
            complete: async function(results, file) {
                return;
            },
            error: async function(results, file) {
                await implError("Error reported while parsing "+dataset+"!");
            }
        });
    }
    datasetsLoaded = true;
}
