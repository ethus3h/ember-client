// Global variables

let datasets = []; // as
let datasetsLoaded = false;
let dcData = []; // an
let strArrayDocumentExecData = []; // as
let intArrayDocumentExecPtrs = []; // an
let setupFinished = false;

// Global environment
let haveDom = false;
let envPreferredFormat = '';
let envResolutionW = 0;
let envResolutionH = 0;
let envCharEncoding = 'ASCII-safe-subset';

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
    // Set up environment variables.

    // Detect if we can create DOM nodes (otherwise we'll output to a terminal). This is used to provide getEnvironmentPreferredFormat.
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    let charset = document.characterSet.toLowerCase();
    if (charset === 'utf-8') {
        envCharEncoding = 'UTF-8';
    }
    else {
        await implWarn("Unimplemented character set: " + charset + ". Falling back to ASCII-safe-subset.");
    }
    if (haveDom) {
        // Web browsers, etc.
        envPreferredFormat = 'HTML';
        envResolutionW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        envResolutionH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    else {
        // Command-line, e.g. Node.js
        envPreferredFormat = 'characterCells';
        envResolutionW = process.stdout.columns;
        envResolutionH = process.stdout.rows;
        if (envResolutionW === 0 || envResolutionH === 0 || envResolutionW === undefined || envResolutionH === undefined) {
            envPreferredFormat = 'immutableCharacterCells';
            // Maybe it's headless, or going to a text file or something? Not tested, but let's just assume we've got 80 columns to work with, and set the height to 1 so apps don't try to draw text-mode GUIs and stuff maybe.
            envResolutionW = 80;
            envResolutionH = 1;
        }
    }
    if (envResolutionW === 0 || envResolutionH === 0 || envResolutionW === undefined || envResolutionH === undefined) {
        await implWarn('The resolution detected was zero in at least one dimension. Width = '+envResolutionW+'; height = '+envResolutionH+'. Things may draw incorrectly. TODO: Add a way to configure this for environments that misreport it.');
    }

    // Set up data sets.

    datasets = await listDcDatasets();
    if (!datasetsLoaded) {
        await internalLoadDatasets();
    }

    // Other startup stuff.

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
                alert("Nonstring error message!");
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
        dataset = datasets[count];
        dcData[dataset] = [];
        // I guess the anonymous functions defined as parameters to the Papa.parse call inherit the value of dataset from the environment where they were defined (i.e., here)??
        dcData[dataset] = await new Promise(resolve => {
            Papa.parse('data/' + dataset + '.csv', {
                download: true,
                encoding: "UTF-8",
                newline: "\n",
                delimiter: ",",
                quoteChar: "\"",
                complete: async function(results, file) {
                    resolve(results.data);
                },
                error: async function(results, file) {
                    await implError("Error reported while parsing "+dataset+"!");
                    resolve(undefined);
                }
            });
        });
        count = count + 1;
    }
    datasetsLoaded = true;
}
