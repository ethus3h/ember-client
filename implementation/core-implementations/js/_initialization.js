// Preferences (most preferences should be implemented in EITE itself rather than this implementation of its data format)

var STAGEL_DEBUG;
var importSettings;
var exportSettings;
var envPreferredFormat;
var envCharEncoding;
var envTerminalType;
var envResolutionW;
var envResolutionH;

// Global variables

let datasets = []; // as
let datasetsLoaded = false;
let dcData = []; // an
let strArrayDocumentExecData = []; // as
let intArrayDocumentExecPtrs = []; // an
let setupFinished = false;
let intPassedTests = 0;
let intFailedTests = 0;
let intTotalTests = 0;
let intArrayFrameBuffer = []; // an
let intArrayTestFrameBuffer = []; // an

// Global environment
let haveDom = false;

// Set defaults for preferences if not set already
if (STAGEL_DEBUG === undefined) {
    STAGEL_DEBUG = 0;
}
if (importSettings === undefined) {
    importSettings = [];
}
if (exportSettings === undefined) {
    exportSettings = [];
}
if (envPreferredFormat === undefined) {
    envPreferredFormat = '';
}
if (envCharEncoding === undefined) {
    envCharEncoding = 'asciiSafeSubset'
}
if (envTerminalType === undefined) {
    envTerminalType = 'vt100'
}
if (envResolutionW === undefined) {
    envResolutionW = '0'
}
if (envResolutionH === undefined) {
    envResolutionH = '0'
}

async function isSetupFinished() {
    return setupFinished;
}

async function setupIfNeeded() {
    if (setupFinished) {
        return;
    }
    await internalSetup();
}

// Main setup logic
async function internalSetup() {
    // Set up environment variables.

    // Detect if we can create DOM nodes (otherwise we'll output to a terminal). This is used to provide getEnvironmentPreferredFormat.
    if (await eiteHostCall('internalEiteReqTypeofWindow') !== 'undefined') {
        haveDom = true;
    }
    let charset = await eiteHostCall('internalEiteReqCharset');
    if (charset === 'utf-8') {
        envCharEncoding = 'utf8';
    }
    else {
        await implWarn("Unimplemented character set: " + charset + ". Falling back to asciiSafeSubset.");
    }
    if (haveDom) {
        // Web browsers, etc.
        envPreferredFormat = 'html';
        envResolutionW = await eiteHostCall('internalEiteReqOutputWidth');
        envResolutionH = await eiteHostCall('internalEiteReqOutputHeight');
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

    // Fill out format settings arrays in case they aren't yet
    let settingsCount=Object.keys(await listInputFormats()).length;
    for (let settingsCounter=0; settingsCounter < settingsCount; settingsCounter++) {
        if (importSettings[settingsCounter] === undefined) {
            importSettings[settingsCounter] = '';
        }
    }
    settingsCount=Object.keys(await listOutputFormats()).length;
    for (let settingsCounter=0; settingsCounter < settingsCount; settingsCounter++) {
        if (exportSettings[settingsCounter] === undefined) {
            exportSettings[settingsCounter] = '';
        }
    }

    // Other startup stuff.

    if (haveDom) {
        // Override error reporting method to show alert

        window.implError = async function (strMessage) {
            if(typeof strMessage !== "string") {
                await eiteHostCall('internalEiteReqAlert', ["EITE reported an error! You may want to reload the page. The error was: Nonstring error message!"]);
                throw "Nonstring error message";
            }
            // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop — maybe??

            //await FIXMEUnimplemented("implError");
            await implWarn(strMessage);

            await console.trace();
            await eiteHostCall('internalEiteReqAlert', ["EITE reported an error! You may want to reload the page. The error was: " + strMessage]);
        }

        window.implWarn = async function (strMessage) {
            await assertIsStr(strMessage);
            // Log the provided message

            await FIXMEUnimplemented("implWarn");
            await implLog(strMessage);

            await console.trace();
        }

        window.implLog = async function (strMessage) {
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

// Routines needed for Web worker requests
async function internalEiteReqCharset() {
    return document.characterSet.toLowerCase();
}

async function internalEiteReqOutputWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

async function internalEiteReqOutputHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

async function internalEiteReqTypeofWindow() {
    return typeof window;
}

async function internalEiteReqAlert(msg) {
    await alert(msg);
    return null;
}

async function internalEiteReqLoadDataset(dataset) {
    // Papa.parse call has to be run from the main thread because Papa isn't defined in the worker since it was only imported in the main thread.
    return await new Promise(resolve => {
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
}

async function internalLoadDatasets() {
    // This is a separate function since it may later be desirable to dynamically load datasets while a document is running (so only the needed datasets are loaded).
    let count = 0;
    let dataset = '';
    while (count < Object.keys(datasets).length) {
        dataset = datasets[count];
        dcData[dataset] = [];
        // I guess the anonymous functions defined as parameters to the Papa.parse call inherit the value of dataset from the environment where they were defined (i.e., here)??
        dcData[dataset] = await eiteHostCall('internalEiteReqLoadDataset', [dataset]);
        count = count + 1;
    }
    datasetsLoaded = true;
}

// Remaining code is support for the eiteCall routine which allows calling other eite routines using a Web worker if available.

// To call a routine from eite, running it as a worker if available, run: await eiteCall('routineName', [param1, param2, param3...]); (with the brackets around the params). There's also eiteHostCall('routineName', [params...]) for calling functions from the worker that can't be called from a worker.

// Promise-wrapped worker strategy is inspired by Gilad Dayagi's implementation described at https://codeburst.io/promises-for-the-web-worker-9311b7831733

if (typeof window !== 'undefined') {
    // Not running as a Web worker
    if (window.Worker) {
        window.eiteWorker = new Worker('eite.js');
        window.eiteWorkerResolveCallbacks = {};
        window.eiteWorkerCallID = 0;
        window.eiteCall = async function(funcName, args) {
            if (args === undefined) {
                args=[];
            }
            window.eiteWorkerCallID = window.eiteWorkerCallID + 1;
            let thisCallId=window.eiteWorkerCallID;
            let thisCall={uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerRequest', msgid: thisCallId, args: [funcName, args]};
            return new Promise(function(resolve) {
                window.eiteWorkerResolveCallbacks[thisCallId]=resolve;
                window.eiteWorker.postMessage(thisCall);
            });
        };
        window.eiteHostRequestInternalOnMessage = async function(message) {
                const {uuid, msgid, args} = message.data;
                let res = await window[args[0]]( ...args[1] );
                if (!res) {
                    res = null;
                }
                window.eiteWorker.postMessage({uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostResponse', msgid: msgid, res: res});
        }
        window.eiteWorker.onmessage = function(message) {
            const {uuid, msgid, res} = message.data;
            if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerResponse') {
                if (res || res === null) {
                    let resolveCallback;
                    resolveCallback = window.eiteWorkerResolveCallbacks[msgid];
                    if (resolveCallback) {
                        resolveCallback(res);
                        delete window.eiteWorkerResolveCallbacks[msgid];
                    }
                    else {
                        implDie('Web worker returned invalid message ID.');
                        throw 'Web worker returned invalid message ID.';
                    }
                }
                else {
                    implDie('Web worker encountered an error.');
                    throw 'Web worker encountered an error.';
                }
            }
            else if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostRequest') {
                window.eiteHostRequestInternalOnMessage(message);
            }
        };
    }
    else {
        window.eiteCall = async function(funcName, args) {
            if (args === undefined) {
                args=[];
            }
            return await window[funcName]( ...args );
        }
        window.eiteHostCall = window.eiteCall;
    }
}
else {
    self.eiteCall = async function(funcName, args) {
        if (args === undefined) {
            args=[];
        }
        return await self[funcName]( ...args );
    }
    self.eiteHostCall = self.eiteCall;
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    // Running as a Web worker, so set up accordingly
    self.internalOnMessage = async function(message) {
        const {uuid, msgid, args} = message.data;
        let res = await self[args[0]]( ...args[1] );
        if (!res) {
            res = null;
        }
        self.postMessage({uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerResponse', msgid: msgid, res: res});
    }

    self.onmessage = function(message) {
        // Handle messages sent to this code when it is running as a Web worker
        const {uuid, msgid, args} = message.data;
        if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerRequest') {
            self.internalOnMessage(message);
        }
        else if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostResponse') {
            const {uuid, msgid, res} = message.data;
            if (res || res === null) {
                let resolveCallback;
                resolveCallback = self.eiteWorkerHostResolveCallbacks[msgid];
                if (resolveCallback) {
                    resolveCallback(res);
                    delete self.eiteWorkerHostResolveCallbacks[msgid];
                }
                else {
                    implDie('Host returned invalid message ID.');
                    throw 'Host returned invalid message ID.';
                }
            }
            else {
                implDie('Host encountered an error.');
                throw 'Host encountered an error.';
            }
        }
    }

    self.eiteWorkerHostResolveCallbacks = {};
    self.eiteWorkerHostCallID = 0;
    self.eiteHostCall = async function(funcName, args) {
        if (args === undefined) {
            args=[];
        }
        self.eiteWorkerHostCallID = self.eiteWorkerHostCallID + 1;
        let thisCallId=self.eiteWorkerHostCallID;
        let thisCall={uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostRequest', msgid: thisCallId, args: [funcName, args]};
        return new Promise(function(resolve) {
            self.eiteWorkerHostResolveCallbacks[thisCallId]=resolve;
            self.postMessage(thisCall);
        });
    };
}
