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
let eiteWasmModule;

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
    // Load WebAssembly components. Functions provided by them are available with await wasmCall('functionName', argument), where argument is an int or an array of ints.
    // https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running
    //await eiteHostCall('internalEiteReqWasmLoad', ['wasm-common/simple.c.wat']);

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

        registerSpeedup('implError', async function (strMessage) {
            if(typeof strMessage !== "string") {
                await eiteHostCall('internalEiteReqAlert', ["EITE reported an error! You may want to reload the page. The error was: Nonstring error message!"]);
                throw "Nonstring error message";
            }
            // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop — maybe??

            //await FIXMEUnimplemented("implError");
            await implWarn(strMessage);

            await console.trace();
            await eiteHostCall('internalEiteReqAlert', ["EITE reported an error! You may want to reload the page. The error was: " + strMessage]);
        });

        registerSpeedup('implWarn', async function (strMessage) {
            await assertIsStr(strMessage);
            // Log the provided message

            await FIXMEUnimplemented("implWarn");
            await implLog(strMessage);

            await console.trace();
        });

        registerSpeedup('implLog', async function (strMessage) {
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
        });
    }

    setupFinished = true;
}

function getWindowOrSelf() {
    if (typeof window !== 'undefined') {
        return window;
    }
    else {
        return self;
    }
}

function registerSpeedup(name, func) {
    getWindowOrSelf()[name] = func;
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

async function internalEiteReqWat2Wabt(watData) {
    let watStr=await strFromByteArray(watData);
    let wasmArray;
    let wabtWasmObject;
    let wabtFeaturesArray = [ 'exceptions', 'mutable_globals', 'sat_float_to_int', 'sign_extension', 'simd', 'threads', 'multi_value', 'tail_call' ];
    let wabtFeaturesObject={};
    for (let feature of wabtFeaturesArray) {
        wabtFeaturesObject[feature] = false;
    }
    return await new Promise(resolve => {
        WabtModule().then(async function(wabt) {
            try {
                wabtWasmObject=wabt.parseWat('test.wast', watStr, wabtFeaturesObject);
                wabtWasmObject.resolveNames();
                wabtWasmObject.validate(wabtFeaturesObject);
                wasmArray=new Uint8Array(await new Response(new Blob([wabtWasmObject.toBinary({log: true, write_debug_names:true}).buffer])).arrayBuffer());
                resolve(wasmArray);
            } catch (e) {
                await implDie('Failed loading WebAssembly module.');
            } finally {
                if (wabtWasmObject) {
                    wabtWasmObject.destroy();
                }
            }
        });
    });
}

async function internalEiteReqWasmLoad(path) {
    let importObject = {
        imports: {
            // If there were JavaScript functions that the C code could call, they would go here. For calling C functions from JavaScript, use instance.exports.exported_func();. I could have an import object passed to internalEiteReqWasmLoad, but don't see the need for it at the moment, so this is just here for documentation.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate
            /*
            imported_func: function(arg) {
                console.log(arg);
            }
            */
        }
    };
    let wasmData=await eiteHostCall('internalEiteReqWat2Wabt', [await getFileFromPath(path)]);
    getWindowOrSelf().eiteWasmModule = await WebAssembly.instantiate(wasmData, importObject);
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

let Base16b = {
    /* Based on https://web.archive.org/web/20090902074623/http://www.base16b.org/doc/specification/version/0.1/base16b.pdf */
    // This code for the Base16b object is included under the following license:
    /**
    * Base16b family encode / decode
    * http://base16b.org/lib/version/0.1/js/base16b.js
    * or http://base16b.org/lib/js/base16b.js
    **/
    /*
    Copyright (c) 2009 Base16b.org
    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:
    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
    */
    // private variables
    // +UF0000 is the first code point in the Asyntactic script
    _asStart: {
        value: 0x0000,
        cp: 0xF0000
    },
    _noncont: function() {
        let nc = []; // array of cp : value mappings for the non-contiguous code points
        nc[0] = {
            value: 0xFFFE,
            cp: 0xF80A
        };
        nc[1] = {
            value: 0xFFFF,
            cp: 0xF80B
        };
        nc[2] = {
            value: 0x1FFFE,
            cp: 0xF80C
        };
        nc[3] = {
            value: 0x1FFFF,
            cp: 0xF80D
        };
        return nc;
    },
    // private methods
    _CharBytes: function(segmCP) { // return the number of bytes needed for the character. Usually 2.
        if (this._fixedCharCodeAt(segmCP, 0) && this._fixedCharCodeAt(segmCP, 1)) {
            return 2;
        }
        else {
            return 1;
        }
    },
    _CharBytesFixed: function(segmCP) { // return the number of bytes needed for the character. Usually 2.
        let code = segmCP.charCodeAt(0);
        if (0xD800 <= code && code <= 0xDBFF) { // High surrogate
            return 2;
        }
        if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
            return 2;
        }
        return 1;
    },
    _invertVal: function(segmVal, base) {
        // Two's complement of the value for this base
        return Math.pow(2, base) - (segmVal + 1);
    },
    _fromCodePoint: function(segmCP, bytes) {
        // Map Code Point to a segment value as specified by the mapping table for this base in the Asyntactic script
        if (bytes === 2) {
            return this._fixedCharCodeAt(segmCP, 0) - this._asStart.cp;
        }
        let i;
        for (i = 0; i < this._noncont().length; i++) {
            // handle non-contiguous code points for last two CPs in bases 16 and 17
            if (this._fixedFromCharCode(this._noncont()[i].cp) === segmCP) {
                return this._noncont()[i].value;
            }
        }
    },
    _toCodePoint: function(segmVal, base) {
        // Map a segment value to the Code Point specified by the mapping table for this base in the Asyntactic script
        if (base < 16) {
            return this._asStart.cp + segmVal;
        }
        let i;
        for (i = 0; i < this._noncont().length; i++) {
            // handle non-contiguous code points for bases 16 and 17
            if (this._noncont()[i].value === segmVal) {
                return this._noncont()[i].cp;
            }
        }
        return this._asStart.cp + segmVal;
    },
    _fixedFromCharCode: function(codePt) {
        // Fix the standard String.FromCharCode method to handle non-BMP unicode planes
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/fromCharCode
        if (codePt > 0xFFFF) {
            codePt -= 0x10000;
            return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
        }
        else {
            return String.fromCharCode(codePt);
        }
    },
    _fixedCharCodeAt: function(str, idx) {
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/charCodeAt
        let code = str.charCodeAt(idx);
        let hi;
        let low;
        if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
            hi = code;
            low = str.charCodeAt(idx + 1);
            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
        }
        if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
            hi = str.charCodeAt(idx - 1);
            low = code;
            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
        }
        return code;
    },
    // public method for encoding
    encode: function(inputArr, base) {
        /*
        Encode an array of pseudo-booleans (0 or 1)
        The specification of the encoding is documented elsewhere on this site. (Search Asyntactic script and Base16b.)
        */
        try {
            if (!(base >= 7 && base <= 17)) {
                throw ('invalid encoding base: ' + base);
            }
            let resultArr = [];
            let fullSegments = Math.floor(inputArr.length / base);
            let remainBits = inputArr.length - (fullSegments * base);
            let segment;
            let bit;
            let segmstart;
            let segmVal; // construct the value of the bits in the current segment
            let currsegm;
            // convert the next segment of base number of bits to decimal
            for (segment = 0; segment < fullSegments; segment++) {
                // input and output both read from left to right
                segmstart = base * segment;
                currsegm = inputArr.slice(segmstart, segmstart + base);
                // most significant bit at the start (left) / least significant bit at the end (right).
                segmVal = 0;
                for (bit = base - 1; bit >= 0; bit--) {
                    segmVal += (currsegm[bit] * Math.pow(2, (base - 1) - bit));
                }
                resultArr[segment] = this._fixedFromCharCode(this._toCodePoint(segmVal, base));
            }
            // encode the termination character
            segmVal = 0;
            segmstart = base * segment;
            currsegm = inputArr.slice(segmstart);
            for (bit = remainBits - 1; bit >= 0; bit--) {
                segmVal += (currsegm[bit] * Math.pow(2, (remainBits - 1) - bit));
            }
            resultArr[segment] = this._fixedFromCharCode(this._toCodePoint(this._invertVal(segmVal, base), base));
            return resultArr.join('');
        }
        catch (e) {
            //alert(e);
            return false;
        }
    },
    // public method for decoding
    decode: function(inputStr) {
        /*
        Decode a string encoded in the Asyntactic script. Return an array of pseudo-booleans (0 or 1)
        The specification of the encoding is documented elsewhere on this site. (Search Asyntactic script and Base16b.)
        */
        try {
            let resultArr = [];
            let termCharBytes = this._CharBytes(inputStr.slice(-2));
            let termCharCP = inputStr.slice(-termCharBytes); // get the termination character
            let termCharVal = this._fromCodePoint(termCharCP, termCharBytes);
            let bit = 17;
            let base;
            // decode the base from the termination character
            while (Math.floor(termCharVal / Math.pow(2, bit - 1)) === 0 && bit >= 7) {
                bit--;
            }
            if (!(bit >= 7 && bit <= 17)) {
                throw ('invalid encoding base');
            }
            else {
                base = bit;
            }
            let segmVal;
            let currCharBytes;
            let bytesUsed = 0;
            let fullBytes = inputStr.length - termCharBytes;
            let decodedBit = 0;
            while (bytesUsed < fullBytes) {
                // decode the code point segments in sequence
                currCharBytes = this._CharBytesFixed(inputStr.slice(bytesUsed, bytesUsed + 1)); // taste before taking a byte
                termCharCP = inputStr.slice(bytesUsed, bytesUsed + currCharBytes);
                let segmVal = this._fromCodePoint(termCharCP, currCharBytes);
                // most significant bit at the start (left) / least significant bit at the end (right).
                for (bit = base - 1; bit >= 0; bit--) {
                    decodedBit=Math.floor((segmVal / Math.pow(2, (bit))) % 2);
                    if (Number.isNaN(decodedBit)) {
                        throw ('Found NaN while decoding');
                    }
                    resultArr.push(decodedBit);
                }
                bytesUsed += currCharBytes;
            }
            // remainder
            let remainVal = this._invertVal(termCharVal, base); // decode the remainder from the termination character
            for (bit = (termCharBytes * 8) - 1; bit >= 0; bit--) {
                resultArr.push(Math.floor((remainVal / Math.pow(2, (bit))) % 2));
            }
            return resultArr;
        }
        catch (e) {
            //alert(e);
            return false;
        }
    },
    // public method for counting Unicode characters
    trueLength: function(inputStr) {
        /*
        Count the number of characters in a string.
        This function can handle stings of mixed BMP plane and higher Unicode planes.
        Fixes a problem with Javascript which incorrectly that assumes each character is only one byte.
        */
        let strBytes = inputStr.length;
        let strLength = 0;
        let tallyBytes = 0;
        try {
            while (tallyBytes < strBytes) {
                tallyBytes += this._CharBytes(inputStr.slice(tallyBytes, tallyBytes + 2));
                strLength += 1;
            }
            return strLength;
        }
        catch (e) {
            //alert(e);
            return false;
        }
    }
};

// Remaining code is support for the eiteCall routine which allows calling other eite routines using a Web worker if available.

// To call a routine from eite, running it as a worker if available, run: await eiteCall('routineName', [param1, param2, param3...]); (with the brackets around the params). There's also eiteHostCall('routineName', [params...]) for calling functions from the worker that can't be called from a worker.

// Promise-wrapped worker strategy is inspired by Gilad Dayagi's implementation described at https://codeburst.io/promises-for-the-web-worker-9311b7831733

if (typeof window !== 'undefined') {
    // Not running as a Web worker
    window.eiteCall = async function(funcName, args) {
        if (args === undefined) {
            args=[];
        }
        return await window[funcName]( ...args );
    };
    window.eiteHostCall = window.eiteCall;
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
            // The host accepted a message; this function processes it
            const uuid = message.data.uuid;
            const msgid = message.data.msgid;
            const args = message.data.args;
            implDebug('Host understood message '+msgid+' from worker: '+args, 1);
            internalDebugLogJSObject(message);
            let res = await window[args[0]]( ...args[1] );
            await implDebug('Request made of host by worker in message '+msgid+' returned the result: '+res, 1);
            window.eiteWorker.postMessage({uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostResponse', msgid: msgid, args: res});
        }
        window.eiteWorker.onmessage = function(message) {
            // Handle messages sent to this code when it is not running as a Web worker
            const uuid = message.data.uuid;
            const msgid = message.data.msgid;
            const msgdata = message.data.args;
            implDebug('Host got message '+msgid+' from worker: '+msgdata, 1);
            internalDebugLogJSObject(message);
            if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerResponse') {
                if (msgdata === undefined) {
                    implDebug('Web worker returned undefined result in message '+msgid+'.', 1);
                }
                let resolveCallback;
                resolveCallback = window.eiteWorkerResolveCallbacks[msgid];
                if (resolveCallback !== undefined) {
                    resolveCallback(msgdata);
                    delete window.eiteWorkerResolveCallbacks[msgid];
                }
                else {
                    implDie('Web worker returned invalid message ID '+msgid+'.');
                    throw 'Web worker returned invalid message ID '+msgid+'.';
                }
            }
            else if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostRequest') {
                window.eiteHostRequestInternalOnMessage(message);
            }
            else if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerError') {
                implDie('Web worker with message '+msgid+' encountered an error: '+msgdata+'.');
                throw 'Web worker with message '+msgid+' encountered an error: '+msgdata+'.';
            }
        };
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
        // The worker accepted a message; this function processes it
        const uuid = message.data.uuid;
        const msgid = message.data.msgid;
        const args = message.data.args;
        implDebug('Worker understood message '+msgid+' from host: '+args, 1);
        internalDebugLogJSObject(message);
        let res;
        try {
            res = await self[args[0]]( ...args[1] );
        }
        catch(error) {
            self.postMessage({uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerError', msgid: msgid, args: error.message + ' (call: ' + args[0] + ', ' + args[1].toString() + ')'});
            throw error;
        }
        await implDebug('Request made of worker by host in message '+msgid+' returned the result: '+res, 1);
        self.postMessage({uuid: 'b8316ea083754b2e9290591f37d94765EiteWebworkerResponse', msgid: msgid, args: res});
    }

    self.onmessage = function(message) {
        // Handle messages sent to this code when it is running as a Web worker
        const uuid = message.data.uuid;
        const msgid = message.data.msgid;
        const args = message.data.args;
        implDebug('Worker got message '+msgid+' from host: '+args, 1);
        internalDebugLogJSObject(message);
        if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerRequest') {
            self.internalOnMessage(message);
        }
        else if (uuid === 'b8316ea083754b2e9290591f37d94765EiteWebworkerHostResponse') {
            if (args === undefined) {
                implDebug('Host sent undefined contents in message '+msgid+'.', 1);
            }
            let resolveCallback;
            resolveCallback = self.eiteWorkerHostResolveCallbacks[msgid];
            if (resolveCallback !== undefined) {
                resolveCallback(args);
                delete self.eiteWorkerHostResolveCallbacks[msgid];
            }
            else {
                implDie('Host returned invalid message ID.');
                throw 'Host returned invalid message ID.';
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
