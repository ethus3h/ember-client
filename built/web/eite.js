// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/* math, provides:
    implAdd
    implSub
    implMul
    implDiv
    implMod
*/

async function implAdd(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    intReturn = intA + intB; await assertIsInt(intReturn); return intReturn;
}

async function implSub(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    intReturn = intA - intB; await assertIsInt(intReturn); return intReturn;
}

async function implMul(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    intReturn = intA * intB; await assertIsInt(intReturn); return intReturn;
}

async function implDiv(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    // Should round towards zero. Note a portability gotcha: before C99, rounding was different. See https://stackoverflow.com/questions/17795421/bug-in-glibc-div-code
    // It may be preferable to implement it in StageL directly at some point, but I can't be bothered to figure out how right now, and it would probably be slower than relying on native implementations.

    floatReturn = intA / intB;
    if (floatReturn < 0) {
        intReturn = Math.ceil(floatReturn);
    }
    else {
        intReturn = Math.floor(floatReturn);
    }
    assertIsInt(intReturn); return intReturn;
}

async function implMod(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    intReturn = intA % intB; await assertIsInt(intReturn); return intReturn;
}

async function getFileFromPath(path) {
    // Returns an array of bytes.
    let response = await new Promise(resolve => {
        var oReq = new XMLHttpRequest();
        oReq.open('GET', path, true);
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(oEvent) {
            resolve(new Uint8Array(oReq.response)); // Note: not oReq.responseText
        };
        oReq.onerror = function() {
            resolve(undefined);
        }
        oReq.send(null);
    });
    if (response !== undefined) {
        return response;
    }
    await implDie('An error was encountered loading the requested document '+path+'.');
}

// Implementations of routines provided in public-interface.stagel.

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    let events = [];
    events = await getDesiredEventNotifications(execId);

    // FIXME: Make this not just be converting the document and dumping it out.
    let outFormat;
    outFormat = await getEnvPreferredFormat();
    await renderDrawContents(await dcaToFormat(outFormat, await dcaFromSems(await strToByteArray(strArrayDocumentExecData[execId]))));
}

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
let strArrayImportDeferredSettingsStack = []; // as
let strArrayExportDeferredSettingsStack = []; // as
let strArrayImportWarnings = []; // as
let strArrayExportWarnings = []; // as

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
    decode: function(inputStr, remainderLength) {
        // remainderLength is not in the original version of this code. It should be provided to get the expected result. It is the input length in bits, mod the number of bits per character (the second argument to the encode function). Other fixes to decoding are also made if remainderLength is provided. If it is not provided, the output should be the same as with original API (if not, that's a bug).
        /*
        Decode a string encoded in the Asyntactic script. Return an array of pseudo-booleans (0 or 1)
        The specification of the encoding is documented elsewhere on this site. (Search Asyntactic script and Base16b.)
        */
        try {
            let originalApi = true;
            if (remainderLength !== undefined) {
                originalApi = false;
            }
            let resultArr = [];
            let termCharBytes = this._CharBytesFixed(inputStr.slice(-1));
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
            let segmentBitLength = currCharBytes * 8;
            if (!originalApi) {
                segmentBitLength = base;
            }
            while (bytesUsed < fullBytes) {
                // decode the code point segments in sequence
                currCharBytes = this._CharBytesFixed(inputStr.slice(bytesUsed, bytesUsed + 1)); // taste before taking a byte
                termCharCP = inputStr.slice(bytesUsed, bytesUsed + currCharBytes);
                let segmVal = this._fromCodePoint(termCharCP, currCharBytes);
                // most significant bit at the start (left) / least significant bit at the end (right).
                for (bit = segmentBitLength - 1; bit >= 0; bit--) {
                    decodedBit=Math.floor((segmVal / Math.pow(2, (bit))) % 2);
                    if (!originalApi) {
                        if (Number.isNaN(decodedBit)) {
                            throw ('Found NaN while decoding');
                        }
                    }
                    resultArr.push(decodedBit);
                }
                bytesUsed += currCharBytes;
            }
            // remainder
            let remainVal = this._invertVal(termCharVal, base); // decode the remainder from the termination character
            bit = (termCharBytes * 8) - 1;
            if (!originalApi) {
                bit = remainderLength - 1;
            }
            for (bit; bit >= 0; bit--) {
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

/* type-conversion, provides:
    intFromIntStr
    strFrom
    charFromByte
    byteFromChar
*/

async function intFromIntStr(str) {
    await assertStrContainsOnlyInt(str); let intReturn;

    intReturn = parseInt(str, 10); await assertIsInt(intReturn); return intReturn;
}

async function strFrom(input) {
    await assertIsGeneric(input); let strReturn;

    strReturn = String(input); await assertIsStr(strReturn); return strReturn;
}

async function charFromByte(intInput) {
    await assertIsInt(intInput); let strReturn;

    // Expects a decimal byte as input. Bear in mind that StageL doesn't attempt to support Unicode.

    strReturn = String.fromCharCode(intInput); await assertIsStr(strReturn); return strReturn;
}

async function byteFromChar(strInput) {
    await assertIsStr(strInput);
    // Bear in mind that StageL doesn't attempt to support Unicode.
    // We can't use assertIsChar here, because it depends on byteFromChar.
    let intReturn;
    intReturn = strInput.charCodeAt(0);

    await assertIsTrue(intReturn > 31);
    await assertIsTrue(intReturn < 127);

    await assertIsInt(intReturn); return intReturn;
}

async function utf8BytesFromDecimalChar(intInput) {
    // Returns a Uint8 array of bytes representing the UTF-8 encoding of the character, given decimal representation of the character as input. FIXME: Probably doesn't support unpaired surrogates or byte sequences outside of the range allowed by Unicode characters, but it probably should.
    let utf8encoder = new TextEncoder();
    return utf8encoder.encode(String.fromCodePoint(intInput));
}

async function firstCharOfUtf8String(intArrayInput) {
    // Returns a decimal representing the UTF-8 encoding of the first character, given decimal representation of a string as input.
    let utf8decoder = new TextDecoder();
    return utf8decoder.decode(new Uint8Array(intArrayInput)).codePointAt(0);
}

async function internalIntBitArrayToBasenbString(intBase, intBitArrayInput) {
    let res;
    res=Base16b.encode(intBitArrayInput, intBase);
    if (res !== false) {
        return new TextEncoder().encode(res);
    }
    await implDie('Base16b.encode returned false');
}

async function internalIntBitArrayFromBasenbString(byteArrayInput, intRemainder) {
    let res;
    res=Base16b.decode(new TextDecoder().decode(new UInt8Array(byteArrayInput)), intRemainder);
    if (res !== false) {
        return new TextEncoder().encode(res);
    }
    await implDie('Base16b.decode returned false');
}

/* arrays, provides:
    append
    push
    get
    set-element
    count
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsGenericItem(array2); let arrayReturn;

    if (array1.constructor.name !== 'Uint8Array' && array2.constructor.name !== 'Uint8Array') {
        arrayReturn=array1.concat(array2);
    }
    else {
        if (array1.constructor.name !== 'Uint8Array') {
            arrayReturn=array1.concat(Array.from(array2));
        }
        else {
            if(array2.constructor.name !== 'Uint8Array') {
                arrayReturn=Array.from(array1).concat(array2);
            }
            else {
                arrayReturn=Array.from(array1).concat(Array.from(array2));
            }
        }
    }
    await assertIsArray(arrayReturn); return arrayReturn;
}

async function push(array1, array2) {
    return await append(array1, array2);
}

async function get(array, index) {
    await assertIsArray(array); await assertIsInt(index); let returnVal;

    if (index < 0) {
        /* JavaScript arrays don't allow negative indices without doing it this way */
        returnVal = array.slice(index)[0];
    }
    else {
        returnVal=array[index];
    }
    await assertIsGeneric(returnVal); return returnVal;
}

async function getNext(array, index) {
    await assertIsArray(array); await assertIsInt(index); let returnVal;

    returnVal=array[index + 1];

    await assertIsGeneric(returnVal); return returnVal;
}

async function setElement(array, index, value) {
    await assertIsArray(array); await assertIsInt(index); await assertIsGeneric(value);

    let len = await count(array);
    if (index > count) {
        await implDie("Cannot insert to a position greater than appending to the length of the array.");
    }
    if (index < 0) {
        index = len + index;
    }
    array[index] = value;

    await assertIsArray(array); return array;
}

async function count(array) {
    if (array.constructor.name === 'Uint8Array') {
        return array.byteLength;
    }
    await assertIsArray(array);
    return Object.keys(array).length;
}

/* strings, provides:
    implCat
    substring
    len
*/

async function implCat(strA, strB) {
    assertIsStr(strA); assertIsStr(strB); let strReturn;

    return strA + "" + strB;
}

async function substring(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    return str.substring(intStart, intStart + intLength);
}

async function len(str) {
    assertIsStr(str); let intReturn;

    return str.length;
}


/* logging, provides:
    implDie
    implWarn
    implLog
    implDebug
    setDebugLevel
    FIXMEUnimplemented
*/

let stagelDebugCallstack = [];
let stagelDebugCollection = "";
//alert("Setting up logging");

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
}

async function implWarn(strMessage) {
    if(typeof strMessage !== "string") {
        throw "Nonstring error message";
    }
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");

    await implLog(strMessage);
}

async function implLog(strMessage) {
    if(typeof strMessage !== "string") {
        throw "Nonstring error message";
    }
    await assertIsStr(strMessage);
    // Log the provided message
    await console.log(strMessage);
    if(await Object.keys(stagelDebugCallstack).length > 0) {
        await console.log("Previous message sent at: " + await internalDebugPrintStack());
    }
    else {
        if (2 <= STAGEL_DEBUG) {
            await console.log("(Previous message sent from non-StageL code.)");
        }
    }
}

async function implDebug(strMessage, intLevel) {
    if(typeof strMessage !== "string") {
        throw "Nonstring error message";
    }
    if ((! Number.isInteger(intLevel)) || typeof intLevel === "undefined" || intLevel === null || intLevel < -2147483648 || intLevel > 2147483647) {
        throw "Non-integer debug level";
    }
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message

    if (intLevel <= STAGEL_DEBUG) {
        await implLog(strMessage);
    }
}

async function setDebugLevel(intLevel) {
    await assertIsInt(intLevel);
    // Set the debug level to the level specified. Int from 0 to 2 inclusive. Default 0. 0 = no debug messages printed; 1 = normal debug messages printed; 2 = block entry printed; 3 = verbose printing

    STAGEL_DEBUG=intLevel;
}

async function FIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await implLog("FIXME: Unimplemented in " + strLocation);
}

// Internal functions

async function internalDebugQuiet(strMessage, intLevel) {
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message, but don't print a trace for it

    if (intLevel <= STAGEL_DEBUG) {
        // await implLog(strMessage);
        console.log(strMessage);
    }
}

async function internalDebugCollect(strMessageFragment) {
    stagelDebugCollection = stagelDebugCollection + strMessageFragment;
}

async function internalDebugFlush() {
    /* console.log("Flushing debug message fragment collector, which contains: " + stagelDebugCollection); */
    let temp;
    temp = stagelDebugCollection;
    stagelDebugCollection = "";
    return temp;
}

async function internalDebugStackEnter(strBlockName) {
    if (strBlockName === undefined) {
        await implDie("Block entry specified but no block name given");
    }

    await stagelDebugCallstack.push(strBlockName + " (" + await internalDebugFlush() + ")");

    await internalDebugQuiet("Entered block: " + await stagelDebugCallstack.slice(-1)[0], 2);
}

async function internalDebugStackExit() {
    //alert("Dbgstackext");
    if (await stagelDebugCallstack.slice(-1)[0] === undefined) {
        await implDie("Exited block, but no block on stack");
    }
    await internalDebugQuiet("Exited block: " + await stagelDebugCallstack.pop(), 3);
}

async function internalDebugPrintStack() {
    let i;
    i = await Object.keys(stagelDebugCallstack).length - 1;
    let result="";
    let arrow=" < "
    while (i>=0) {
        /* FIXME: This could probably be optimized if it's problematically slow. */
        if (i==0) {
            arrow=""
        }
        result = result + stagelDebugCallstack.slice(i)[0] + arrow;
        i = i - 1;
    }
    return result;
}

function internalDebugLogJSObject(obj) {
    if (1 <= STAGEL_DEBUG) {
        console.log(obj);
    }
}

// Eventually the WASM stuff should all be available in pure StageL (+ getFileFromPath to load it), and this file's contents used only as speedups.

async function internalEiteReqWasmCall(strRoutine, giVal, returnsArray=false) {
    let func=getWindowOrSelf().eiteWasmModule.instance.exports[strRoutine];
    if (giVal === null) {
        return func();
    }
    else if ((typeof giVal === 'number') && (!returnsArray)) {
        return func(giVal);
    }
    else {
        // Either it returns an array, it has an array argument, or both.
        // If it accepts an array as a parameter, it takes int* arr, int size as its parameters.
        let memory=getWindowOrSelf().eiteWasmModule.instance.exports[memory];
    }
}

async function internalWasmCall(strRoutine, intVal) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intVal, false]);
}

async function internalWasmCallNoArgs(strRoutine) {
    // Only returns an int
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, null, false]);
}

async function internalWasmCallArrIn(strRoutine, intArrayVals) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intArrayVals, false]);
}

async function internalWasmCallArrOut(strRoutine, intVal) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intVal, true]);
}

async function internalWasmCallArrInOut(strRoutine, intArrayVals) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intArrayVals, true]);
}

/* booleans, provides:
    implAnd
    implNot
*/

async function implAnd(a,b) {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a && b;
    }
    await assertIsBool(a); await assertIsBool(b);
}

async function implNot(a) {
    if (typeof a === 'boolean') {
        return !a;
    }
    await assertIsBool(a);
}

/* comparison, provides:
    implEq
    implGt
    implLt
*/

async function implEq(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    return genericA === genericB;
}

async function implGt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    return intA > intB;
}

async function implLt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    return intA < intB;
}

// Note: Both rows and columns are zero-indexed from the perspective of callers of these routines. The header row is not counted for this purpose (the first row after the header is index 0), while the ID column (where present) *is* counted (so it is index 0).

async function dcDatasetLength(dataset) {
    assertIsDcDataset(dataset); let intReturn;

    // - 2: one for the header; one for the last newline, which is (reasonably, looking at the newlines as separators rather than terminators) included as an extra line of data in the parse results
    intReturn = await dcData[dataset].length - 2; await assertIsInt(intReturn); return intReturn;
}

async function dcDataLookupById(dataset, rowNum, fieldNum) {
    await assertIsDcDataset(dataset); await assertIsInt(rowNum); await assertIsInt(fieldNum); let strReturn;

    // This routine returns the value of the specified cell of the nth row in the dataset (zero-indexed, such that the 0th row is the first content row, and the header row is not available (would be -1 but isn't available from this routine)).
    if (dcData[dataset] === undefined) {
        await implDie('dcDataLookupById called, but dataset '+dataset+' does not appear to be available.');
    }

    // Add 1 to account for header row
    rowNum = rowNum + 1;

    // and another 1 to account for last row
    if (rowNum + 1 >= dcData[dataset].length) {
        strReturn = "89315802-d53d-4d11-ba5d-bf505e8ed454"
    }
    else {
        strReturn = dcData[dataset][rowNum][fieldNum];
    }
    await assertIsStr(strReturn); return strReturn;
}

async function dcDataLookupByValue(dataset, filterField, genericFilterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsGeneric(genericFilterValue); await assertIsInt(desiredField); let strReturn;

    let intLength = dcData[dataset].length - 2;
    // start at 1 to skip header row
    let filterValue = await strFrom(genericFilterValue);
    for (let row = 1; row <= intLength; row++) {
        if(dcData[dataset][row][filterField] === filterValue) {
            strReturn = dcData[dataset][row][desiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    //await console.log("SEARCHING", dataset, filterField, genericFilterValue, desiredField, dcData);
    //await implDie('Could not find required dataset entry by value (parameters: '+dataset+'/'+filterField+'/'+genericFilterValue+'/'+desiredField+').');
    // TODO: this should be available as a "lookupbyvalue" and a "lookupbyvalueForgiving" versions that do and don't die on this; the forgiving would return the exception UUID.
    // If nothing was found, return this UUID.
    strReturn="89315802-d53d-4d11-ba5d-bf505e8ed454"; await assertIsStr(strReturn); return strReturn;
}

async function dcDataFilterByValue(dataset, filterField, genericFilterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsGeneric(genericFilterValue); await assertIsInt(desiredField); let asReturn;

    // This routine returns an array of values of the desired column when the filter field matches the filter value. While dcDataLookupByValue gives a single (the first) result, this returns all matching results.

    asReturn = [];

    let intLength = dcData[dataset].length - 2;
    // start at 1 to skip header row
    let filterValue = await strFrom(genericFilterValue);
    for (let row = 1; row <= intLength; row++) {
        if(dcData[dataset][row][filterField] === filterValue) {
            asReturn = asReturn.concat(dcData[dataset][row][desiredField]);
        }
    }
    await assertIsStrArray(asReturn); return asReturn;
}

async function dcDataFilterByValueGreater(dataset, filterField, filterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsInt(filterValue); await assertIsInt(desiredField); let asReturn;

    // This routine returns an array of values of the desired column when the filter field is greater than the filter value. (e.g. filter for 1 will return rows with 2 and 3 but not 1 or 0) While dcDataLookupByValue gives a single (the first) result, this returns all matching results.

    asReturn = [];

    let intLength = dcData[dataset].length - 2;
    // start at 1 to skip header row
    for (let row = 1; row <= intLength; row++) {
        if(parseInt(dcData[dataset][row][filterField], 10) > filterValue) {
            asReturn = asReturn.concat(dcData[dataset][row][desiredField]);
        }
    }
    await assertIsStrArray(asReturn); return asReturn;
}

async function getImportSettingsArr() {
    await assertIsStrArray(getWindowOrSelf().importSettings);

    return getWindowOrSelf().importSettings;
}

async function getExportSettingsArr() {
    await assertIsStrArray(getWindowOrSelf().exportSettings);

    return getWindowOrSelf().exportSettings;
}

async function setImportSettings(formatId, strNewSettings) {
    await assertIsStr(strNewSettings); getWindowOrSelf().importSettings[formatId]=strNewSettings;
}

async function setExportSettings(formatId, strNewSettings) {
    await assertIsStr(strNewSettings); getWindowOrSelf().exportSettings[formatId]=strNewSettings;
}

// Based on https://web.archive.org/web/20190305073920/https://github.com/mathiasbynens/wtf-8/blob/58c6b976c6678144d180b2307bee5615457e2cc7/wtf-8.js
// This code for wtf8 is included under the following license (from https://web.archive.org/web/20190305074047/https://github.com/mathiasbynens/wtf-8/blob/58c6b976c6678144d180b2307bee5615457e2cc7/LICENSE-MIT.txt):
/*
Copyright Mathias Bynens <https://mathiasbynens.be/>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Encoding
function intArrayPackWtf8(intValue) {
    let createByte = function(intValue, shift) {
        return String.fromCharCode(((intValue >> shift) & 0x3F) | 0x80);
    }

    let symbol = '';
    if ((intValue & 0xFFFFFF80) == 0) { // 1-byte sequence
        symbol = String.fromCharCode(intValue);
    }
    else {
        if ((intValue & 0xFFFFF800) == 0) { // 2-byte sequence
            symbol = String.fromCharCode(((intValue >> 6) & 0x1F) | 0xC0);
        }
        else if ((intValue & 0xFFFF0000) == 0) { // 3-byte sequence
            symbol = String.fromCharCode(((intValue >> 12) & 0x0F) | 0xE0);
            symbol += createByte(intValue, 6);
        }
        else if ((intValue & 0xFFE00000) == 0) { // 4-byte sequence
            symbol = String.fromCharCode(((intValue >> 18) & 0x07) | 0xF0);
            symbol += createByte(intValue, 12);
            symbol += createByte(intValue, 6);
        }
        symbol += String.fromCharCode((intValue & 0x3F) | 0x80);
    }
    let res = [];
    let len = symbol.length;
    let i = 0;
    while (i<len) {
        res.push(symbol.charCodeAt(i));
        i = i+1;
    }
    return res;
}

//Decoding
function intUnpackWtf8(byteArrayInput) {
    let byteIndex = 0;
    let byteCount = byteArrayInput.length;
    let readContinuationByte = function() {
        if (byteIndex >= byteCount) {
            throw Error('Invalid byte index');
        }

        let continuationByte = byteArrayInput[byteIndex] & 0xFF;
        byteIndex++;

        if ((continuationByte & 0xC0) == 0x80) {
            return continuationByte & 0x3F;
        }

        // If we end up here, it’s not a continuation byte.
        throw Error('Invalid continuation byte');
    }

    let byte1;
    let byte2;
    let byte3;
    let byte4;
    let intValue;

    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }

    if (byteIndex == byteCount) {
        return false;
    }

    // Read the first byte.
    byte1 = byteArrayInput[byteIndex] & 0xFF;
    byteIndex++;

    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }

    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        let byte2 = readContinuationByte();
        intValue = ((byte1 & 0x1F) << 6) | byte2;
        if (intValue >= 0x80) {
            return intValue;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        intValue = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (intValue >= 0x0800) {
            return intValue;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        intValue = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
        if (intValue >= 0x010000 && intValue <= 0x10FFFF) {
            return intValue;
        }
    }

    throw Error('Invalid WTF-8 detected');
}

/* assertions, provides:
    assertIsBool
    assertIsTrue
    assertIsFalse
    assertIsInt
    assertIsStr
    assertIsGeneric
    assertIsGenericArray
    assertIsGenericItem
    assertionFailed
*/

// Assertions that something is a given type

async function isBool(bool) {
    if (typeof bool === 'boolean') {
        return true;
    }
    return false;
}

async function assertIsBool(bool) {
    if (typeof bool === 'boolean') {
        return;
    }
    await assertionFailed(bool+' is not a boolean.');
}

async function isInt(v) {
    if (await Number.isInteger(v) && v >= -2147483648 && v <= 2147483647) {
        return true;
    }
    return false;
}

async function assertIsInt(v) {
    if (await Number.isInteger(v) && v >= -2147483648 && v <= 2147483647) {
        return;
    }
    await assertionFailed(v+" is not an int, or is outside the currently allowed range of 32 bit signed (-2,147,483,648 to 2,147,483,647).");
}

async function isStr(str) {
    if (typeof str === 'string') {
        return true;
    }
    return false;
}

async function assertIsStr(str) {
    if (typeof str === 'string') {
        return;
    }
    await assertionFailed(str+" is not a string.");
}

async function isGeneric(v) {
    // We have to do isGeneric in native code because otherwise the assertion at the start of the function would call it.
    if (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647)) {
        return true;
    }
    return false;
}

async function assertIsGeneric(v) {
    if (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647)) {
        return true;
    }
    await assertionFailed(v+" cannot be used as a generic.");
}

async function isGenericArray(val) {
    if (val === undefined) {
        await assertionFailed('isGenericArray called with non-StageL-supported argument type.');
    }
    if (val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        return false;
    }
    function isGenericSync(v) {
        return (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647));
    }
    return val.every(isGenericSync);
}

async function assertIsGenericArray(val) {
    if (val === undefined) {
        await assertionFailed('assertIsGenericArray called with non-StageL-supported argument type.');
    }
    if (val.constructor.name === 'Uint8Array') {
        return;
    }
    if (val.constructor.name !== 'Array') {
        await assertionFailed(val+" cannot be used as a generic array.");
    }
    function isGenericSync(v) {
        return (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647));
    }
    if (val.every(isGenericSync)) {
        return;
    }
    else {
        await assertionFailed(val+" cannot be used as a generic array.");
    }
}

async function isGenericItem(val) {
    /* Should this support returning false for non-StageL-supported items? Otherwise it always returns true. I think probably not, since that wouldn't be consistent across languages; giving an assertion failure seems more sensible. */
    if (val === undefined) {
        await assertionFailed('isGenericItem called with non-StageL-supported argument type.');
    }
    if (typeof val === 'boolean' || typeof val === 'string' || (Number.isInteger(val) && val >= -2147483648 && val <= 2147483647) || val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        await assertionFailed('isGenericItem called with non-StageL-supported argument type.');
    }
    function isGenericSync(v) {
        return (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647));
    }
    if (val.every(isGenericSync)) {
        return true;
    }
    else {
        await assertionFailed('isGenericItem called with non-StageL-supported argument type.');
    }
}

async function assertIsGenericItem(val) {
    if (val === undefined) {
        await assertionFailed('assertIsGenericItem called with non-StageL-supported argument type.');
    }
    if (typeof val === 'boolean' || typeof val === 'string' || (Number.isInteger(val) && val >= -2147483648 && val <= 2147483647) || val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        await assertionFailed('assertIsGenericItem called with non-StageL-supported argument type.');
    }
    function isGenericSync(v) {
        return (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647));
    }
    if (val.every(isGenericSync)) {
        return true;
    }
    else {
        await assertionFailed('assertIsGenericItem called with non-StageL-supported argument type.');
    }
}

async function assertionFailed(message) {
    await implDie("Assertion failed: "+message);
}

/* bits, provides:
    bitAnd
    bitNot
*/

// Note that bitwise operations in StageL operate on bytes rather than int32s. Consequently, C-style 8-bit bitwise operations must be emulated for the Javascript implementation. That said, C-style bitwise operators depend on the types being operated upon. So, there should probably be a set of functions like bitLshift8, bitLshift32, etc. maybe. Do these really make much sense in StageL, which is mostly higher-level? How would one implement these in languages that don't provide them natively? Mmh.

async function bitAnd8(byteA, byteB) {
    await assertIsByte(byteA); await assertIsByte(byteB); let byteReturn;

    byteReturn = await internalBitwiseMask(byteA & byteB);

    await assertIsByte(byteReturn); return byteReturn;
}

async function bitNot8(byteA) {
    await assertIsByte(byteA); let byteReturn;

    byteReturn = await internalBitwiseMask(~byteA);
    await assertIsByte(byteReturn); return byteReturn;
}

async function bitLshift8(byteA, intPlaces) {
    await assertIsByte(byteA); await assertIsInt(intPlaces); let byteReturn;

    await assertIsBetween(intPlaces, 0, 8);

    byteReturn = await internalBitwiseMask(byteA << intPlaces);

    await assertIsByte(byteReturn); return byteReturn;
}

async function bitRshift8(byteA, intPlaces) {
    await assertIsByte(byteA); await assertIsInt(intPlaces); let byteReturn;

    await assertIsBetween(intPlaces, 0, 8);

    byteReturn = await internalBitwiseMask(byteA >>> intPlaces); /* >>> is needed in JavaScript to make it fill zeroes behind it. >> does something else. */

    await assertIsByte(byteReturn); return byteReturn;
}

// Internal function

async function leastSignificantByte(int32input) {
    let byteReturn;
    let byteMask;
    byteMask = 255;
    byteReturn = int32input & byteMask; /* zero out all but the least significant bits, which are what we want */
    return byteReturn;
}

async function getEnvPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    return envPreferredFormat;
}

async function getEnvResolutionW() {
    // Result for this is either in pixels or characters. For immutableCharacterCells, it's just the number of columns available, defaulting to 80 if we can't tell, and says 1 line available. If it's -1, it's unlimited (probably this would only occur if explicitly configured as such).
    return envResolutionW;
}

async function getEnvResolutionH() {
    // See getEnvResolutionW description.
    return envResolutionH;
}

async function getEnvCharEncoding() {
    return envCharEncoding;
}

async function renderDrawContents(renderBuffer) {
    // Whether it appends to or replaces the frame would depend on the environment. In this implementation, HTML replaces, and terminal appends.
    // The input is an array of bytes of the rendered document, either of HTML or text.
    await assertIsByteArray(renderBuffer);
    let utf8decoder = new TextDecoder('utf-8');
    let string = utf8decoder.decode(Uint8Array.from(renderBuffer));
    if (haveDom) {
        await eiteHostCall('internalRequestRenderDrawHTMLToDOM', [string]);
    }
    else {
        await console.log(string);
    }
}

async function internalRequestRenderDrawHTMLToDOM(htmlString) {
    let htmlOutputRootElement = await document.getElementById('eiteDocumentRoot');
    htmlOutputRootElement.innerHTML = htmlString;
    htmlOutputRootElement.scrollTop = htmlOutputRootElement.scrollHeight;
}

/* type-tools, provides:
    implIntBytearrayLength
*/

async function intBytearrayLength(bytearray) {
    assertIsBytearray(bytearray); let intReturn;

    intReturn = bytearray.byteLength; await assertIsInt(intReturn); return intReturn;
}


// @license-end

// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/* Note that the Basenb formats provided here are different from the Base16b formats in the specification, due to what appears to be a bug in the specification (requiring the remainder length to be stored to decode the remainder correctly when it starts with a 0 bit and is not 16 bits long). */

async function byteToIntBitArray(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('byteToIntBitArray:basenb-utf8'); await assertIsInt(intIn); let intArrayReturn;

    await assertIsByte(intIn);
    let intArrayRes = [];
    let strTemp = '';
    strTemp = await intToBaseStr(intIn, 2);
    let intLen = 0;
    let intI = 0;
    intLen = await len(strTemp);
    let intArrayZero = [];
    intArrayZero = [ 0 ];
    while (await implLt(intI, intLen)) {
        intArrayRes = await push(intArrayRes, await intFromIntStr(await strChar(strTemp, intI)));
        intI = await implAdd(intI, 1);
    }
    while (await implGt(8, await count(intArrayRes))) {
        intArrayRes = await push(intArrayZero, intArrayRes);
    }
    await assertIsIntBitArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteFromIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteFromIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intReturn;

    await assertIsIntBitArray(intArrayIn);
    let intRes = 0;
    let strTemp = '';
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    while (await implLt(intI, intLen)) {
        strTemp = await implCat(strTemp, await strFrom(await get(intArrayIn, intI)));
        intI = await implAdd(intI, 1);
    }
    intRes = await intFromBaseStr(strTemp, 2);
    await assertIsByte(intRes);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function byteArrayToIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    while (await implLt(intI, intLen)) {
        intArrayRes = await push(intArrayRes, await byteToIntBitArray(await get(intArrayIn, intI)));
        intI = await implAdd(intI, 1);
    }
    await assertIsIntBitArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsIntBitArray(intArrayIn);
    let intArrayRes = [];
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    let intArrayTemp = [];
    while (await le(intI, intLen)) {
        if (await implAnd(await implEq(0, await implMod(intI, 8), ), await implNot(await implEq(0, await count(intArrayTemp))))) {
            intArrayRes = await push(intArrayRes, await byteFromIntBitArray(intArrayTemp));
            intArrayTemp = [  ];
        }
        if (await implLt(intI, intLen)) {
            intArrayTemp = await push(intArrayTemp, await get(intArrayIn, intI));
        }
        intI = await implAdd(intI, 1);
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isBasenbBase(intBase) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugStackEnter('isBasenbBase:basenb-utf8'); await assertIsInt(intBase); let boolReturn;

    let boolRes = false;
    boolRes = await intIsBetween(intBase, 7, 17);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBasenbChar(intArrayUtf8Char) {
    await internalDebugCollect('intArray Utf8Char = ' + intArrayUtf8Char + '; '); await internalDebugStackEnter('isBasenbChar:basenb-utf8'); await assertIsIntArray(intArrayUtf8Char); let boolReturn;

    let boolRes = false;
    boolRes = false;
    let intCodepoint = 0;
    intCodepoint = await unpack32(intArrayUtf8Char);
    if (await intIsBetween(intCodepoint, 983040, 1048573)) {
        boolRes = true;
    }
    else if (await intIsBetween(intCodepoint, 1048576, 1114109)) {
        boolRes = true;
    }
    else if (await intIsBetween(intCodepoint, 63498, 63501)) {
        boolRes = true;
    }

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function byteArrayToBasenbUtf8(intBase, intArrayIn) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToBasenbUtf8:basenb-utf8'); await assertIsInt(intBase); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsTrue(await isBasenbBase(intBase));
    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    intArrayRes = await internalIntBitArrayToBasenbString(intBase, await byteArrayToIntBitArray(intArrayIn));
    /* The remainder length also needs to be stored, to be able to decode successfully. We'll calculate, encode, and append it. It's always 4 bytes, 1 UTF-8 character, and 2 UTF-16 characters long, after encoding (it has 2 added to it to make it always be the same byte length and UTF-16 length; this must be subtracted before passing it to the Base16b.decode function). */
    let intArrayRemainder = [];
    intArrayRemainder = await push(intArrayRemainder, await implAdd(2, await implMod(await count(intArrayIn), 17)));
    intArrayRes = await push(intArrayRes, await internalIntBitArrayToBasenbString(17, intArrayRemainder));
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromBasenbUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromBasenbUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    /* Extract remainder length */
    let intRemainder = 0;
    let intArrayRemainderArr = [];
    /* last 4 characters */
    intArrayRemainderArr = await anSubset(intArrayIn, -5, -1);
    let intArrayRemainderDecodedArr = [];
    intArrayRemainderDecodedArr = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayRemainderArr, 0));
    intRemainder = await get(intArrayRemainderDecodedArr, 0);
    intArrayRes = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayIn, intRemainder));
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayToBase17bUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToBase17bUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    /* Convenience wrapper */
    let intArrayRes = [];
    intArrayRes = await byteArrayToBasenbUtf8(17, intArrayIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromBase17bUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromBase17bUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    /* Convenience wrapper */
    let intArrayRes = [];
    intArrayRes = await byteArrayFromBasenbUtf8(intArrayIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getArmoredUtf8EmbeddedStartUuid() {
    await internalDebugStackEnter('getArmoredUtf8EmbeddedStartUuid:basenb-utf8'); let intArrayReturn;

    /* start UUID=e82eef60-19bc-4a00-a44a-763a3445c16f */
    /*new an/startUuid */
    /*set an/startUuid ( 232 46 239 96 25 188 74 0 164 74 118 58 52 69 193 111 ) */
    /* byteArrayToIntBitArray([ 232, 46, 239, 96, 25, 188, 74, 0, 164, 74, 118, 58, 52, 69, 193, 111 ]).then(function(v){return new TextEncoder().encode(Base16b.encode(v, 17));}).then(function(v){console.log(v.toString());}) */
    /* UTF8 in binary: 1,1,1,1,0,1,0,0,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,1,1,1,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,1,1,0,1,1,1,1,1,0,0,1,1,1,0,1,1,0,0,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,0,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0 */
    /* Note that the remainder length for the encoded UUID is 9. */
    let intArrayStartUuidUtf8 = [];
    intArrayStartUuidUtf8 = [ 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144 ];

    intArrayReturn = intArrayStartUuidUtf8; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getArmoredUtf8EmbeddedEndUuid() {
    await internalDebugStackEnter('getArmoredUtf8EmbeddedEndUuid:basenb-utf8'); let intArrayReturn;

    /* end UUID=60bc936b-f10f-4f50-ab65-3778084060e2 */
    /*new an/endUuid */
    /*set an/endUuid ( 96 188 147 107 241 15 79 80 171 101 55 120 8 64 96 226 ) */
    /* byteArrayToIntBitArray([ 96, 188, 147, 107, 241, 15, 79, 80, 171, 101, 55, 120, 8, 64, 96, 226 ]).then(function(v){return new TextEncoder().encode(Base16b.encode(v, 17));}).then(function(v){console.log(v.toString());}) */
    let intArrayEndUuidUtf8 = [];
    intArrayEndUuidUtf8 = [ 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ];

    intArrayReturn = intArrayEndUuidUtf8; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
/*r/an/byteArrayToArmoredBase17bUtf8 an/in */
/*    assertIsByteArray an/in */
/*    new an/res */
/*    set an/res getArmoredBase17bUtf8StartUuid */
/*    set an/res append an/res eiteHostCall 'internalIntBitArrayToBase17bString' byteArrayToIntBitArray an/in */
/*    assertIsByteArray an/res */
/*    set an/res append an/res getArmoredBase17bUtf8EndUuid */
/*    return an/res */
/*r/an/byteArrayFromArmoredBase17bUtf8 an/in */
/*    assertIsByteArray an/in */
/*    new an/temp */
/*    set an/temp getArmoredBase17bUtf8StartUuid */
/*    assertIsTrue eq an/temp anSubset an/in 0 count an/temp */
/*    set an/temp getArmoredBase17bUtf8EndUuid */
/*    assertIsTrue eq an/temp anSubset an/in -1 sub -1 count an/temp */
/*    new an/res */
/*    set an/res eiteHostCall 'internalIntBitArrayFromBase17bString' an/in */
/*    assertIsByteArray an/res */
/*    return an/res */

async function isByte(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isByte:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intVal = 0;
    intVal = genericIn;
    let boolRes = false;
    boolRes = await intIsBetween(intVal, 0, 255);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isIntBit(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isIntBit:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intVal = 0;
    intVal = genericIn;
    let boolRes = false;
    boolRes = await intIsBetween(intVal, 0, 1);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isChar(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isChar:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isStr(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let strVal = '';
    strVal = genericIn;
    let boolRes = false;
    boolRes = await isCharByte(await byteFromChar(strVal));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isCharByte(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isCharByte:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intVal = 0;
    intVal = genericIn;
    let boolRes = false;
    boolRes = await intIsBetween(intVal, 32, 126);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestsFormatHtmlFragment(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatHtmlFragment:format-htmlFragment-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatHtmlFragment');
    await runTest(boolV, await arrEq(await strToByteArray('<div style="white-space:pre-wrap">5&lt;6</div>'), await dcaToHtmlFragment([ 39, 46, 40 ])));

    await internalDebugStackExit();
}

async function dcaFromAscii(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromAscii:format-ascii'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    while (await implLt(intC, intL)) {
        intArrayRes = await append(intArrayRes, await dcFromFormat('ascii', await anFromN(await get(intArrayContent, intC))));
        intC = await implAdd(intC, 1);
    }
    await assertIsDcArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToAscii(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToAscii:format-ascii'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsDcArray(intArrayContent);
    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    let intArrayTemp = [];
    let intDcAtIndex = 0;
    while (await implLt(intC, intL)) {
        intDcAtIndex = await get(intArrayContent, intC);
        intArrayTemp = await dcToFormat('utf8', intDcAtIndex);
        if (await arrNonempty(intArrayTemp)) {
            if (await isAsciiByte(await get(intArrayTemp, 0))) {
                intArrayRes = await append(intArrayRes, intArrayTemp);
            }
            else {
                await exportWarningUnmappable(intC, intDcAtIndex);
            }
        }
        else {
            await exportWarningUnmappable(intC, intDcAtIndex);
        }
        intC = await implAdd(intC, 1);
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isAsciiByte(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('isAsciiByte:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 0, 127);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsDigit(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsDigit:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 48, 57);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsPrintable(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsPrintable:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 32, 126);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsSpace(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsSpace:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intN, 32);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsNewline(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsNewline:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolT1 = false;
    boolT1 = await implEq(intN, 10);
    let boolT2 = false;
    boolT2 = await or(boolT1, await implEq(intN, 13));

    boolReturn = boolT2; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsLetterUpper(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsLetterUpper:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 65, 90);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsLetterLower(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsLetterLower:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 97, 122);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsLetter(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsLetter:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await asciiIsLetterLower(intN);
    boolTemp = await or(boolTemp, await asciiIsLetterUpper(intN));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsAlphanum(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsAlphanum:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await asciiIsLetter(intN);
    boolTemp = await or(boolTemp, await asciiIsDigit(intN));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function crlf() {
    await internalDebugStackEnter('crlf:format-ascii'); let intArrayReturn;

    let intArrayTemp = [];
    intArrayTemp = [ 13, 10 ];

    intArrayReturn = intArrayTemp; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
/* 0  NUL    16 DLE    32 SP   48 0    64 @    80 P    96  `    112 p */
/* 1  SOH    17 DC1    33 !    49 1    65 A    81 Q    97  a    113 q */
/* 2  STX    18 DC2    34 "    50 2    66 B    82 R    98  b    114 r */
/* 3  ETX    19 DC3    35 #    51 3    67 C    83 S    99  c    115 s */
/* 4  EOT    20 DC4    36 $    52 4    68 D    84 T    100 d    116 t */
/* 5  ENQ    21 NAK    37 %    53 5    69 E    85 U    101 e    117 u */
/* 6  ACK    22 SYN    38 &    54 6    70 F    86 V    102 f    118 v */
/* 7  BEL    23 ETB    39 '    55 7    71 G    87 W    103 g    119 w */
/* 8  BS     24 CAN    40 (    56 8    72 H    88 X    104 h    120 x */
/* 9  HT     25 EM     41 )    57 9    73 I    89 Y    105 i    121 y */
/* 10 LF     26 SUB    42 *    58 :    74 J    90 Z    106 j    122 z */
/* 11 VT     27 ESC    43 +    59 ;    75 K    91 [    107 k    123 { */
/* 12 FF     28 FS     44 ,    60 <    76 L    92 \    108 l    124 | */
/* 13 CR     29 GS     45 -    61 =    77 M    93 ]    109 m    125 } */
/* 14 SO     30 RS     46 .    62 >    78 N    94 ^    110 n    126 ~ */
/* 15 SI     31 US     47 /    63 ?    79 O    95 _    111 o    127 DEL */

async function runTestsMath(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsMath:math-tests'); await assertIsBool(boolV);

    await testing(boolV, 'math');
    await runTest(boolV, await implEq(4, await implAdd(2, 2)));
    await runTest(boolV, await ne(4, await implAdd(2, 3)));

    await internalDebugStackExit();
}

async function runTestsFormatAsciiSafeSubset(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatAsciiSafeSubset:format-asciiSafeSubset-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatAsciiSafeSubset');
    await runTest(boolV, await arrEq([ 121, 120, 21, 26 ], await dcaFromAsciiSafeSubset([ 13, 10, 35, 40 ])));
    await runTest(boolV, await arrEq([ 13, 10, 35, 13, 10, 40 ], await dcaToAsciiSafeSubset([ 0, 212, 120, 216, 291, 221, 226, 231, 21, 121, 120, 26 ])));

    await internalDebugStackExit();
}

async function dcaToUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsDcArray(intArrayContent);
    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    let intArrayTemp = [];
    let intDcAtIndex = 0;
    let intArrayUnmappables = [];
    let intUnmappablesCount = 0;
    let intUnmappablesCounter = 0;
    let intArrayUnmappablesIntermediatePacked = [];
    let boolFoundAnyUnmappables = false;
    boolFoundAnyUnmappables = false;
    let strArrayVariantSettings = [];
    strArrayVariantSettings = await utf8VariantSettings('out');
    let boolDcBasenbEnabled = false;
    boolDcBasenbEnabled = await contains(strArrayVariantSettings, 'dcBasenb');
    while (await le(intC, intL)) {
        if (await implLt(intC, intL)) {
            intDcAtIndex = await get(intArrayContent, intC);
            intArrayTemp = await dcToFormat('utf8', intDcAtIndex);
        }
        if (await implEq(0, await count(intArrayTemp))) {
            if (await implLt(intC, intL)) {
                if (boolDcBasenbEnabled) {
                    intArrayUnmappables = await push(intArrayUnmappables, intDcAtIndex);
                }
                else {
                    await exportWarningUnmappable(intC, intDcAtIndex);
                }
            }
        }
        else {
            if (boolDcBasenbEnabled) {
                intUnmappablesCount = await count(intArrayUnmappables);
                if (await implGt(0, intUnmappablesCount)) {
                    if (await implNot(boolFoundAnyUnmappables)) {
                        intArrayRes = await append(intArrayRes, await getArmoredUtf8EmbeddedStartUuid());
                    }
                    boolFoundAnyUnmappables = true;
                    /* We've gotten to the end of a string of unmappable characters, so convert them to PUA characters */
                    intUnmappablesCounter = 0;
                    while (await implLt(intUnmappablesCounter, intUnmappablesCount)) {
                        /* The packing method for this works basically like UTF8, where each character is mapped to a series of bytes. So, first  get the bytearray for the character we're on. */
                        intArrayUnmappablesIntermediatePacked = await append(intArrayUnmappablesIntermediatePacked, await pack32(await get(intArrayUnmappables, intUnmappablesCounter)));
                        intUnmappablesCounter = await implAdd(intUnmappablesCounter, 1);
                    }
                    intArrayRes = await append(intArrayRes, await bytearrayToBase17bUtf8(intArrayUnmappablesIntermediatePacked));
                    intArrayUnmappables = [  ];
                    intArrayUnmappablesIntermediatePacked = [  ];
                }
            }
        }
        if (await implLt(intC, intL)) {
            intArrayRes = await append(intArrayRes, intArrayTemp);
        }
        intC = await implAdd(intC, 1);
    }
    if (await implAnd(boolDcBasenbEnabled, boolFoundAnyUnmappables)) {
        intArrayRes = await append(intArrayRes, await getArmoredUtf8EmbeddedEndUuid());
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    let intArrayRes = [];
    let intArrayRemaining = [];
    intArrayRemaining = intArrayContent;
    let intArrayTemp = [];
    let intArrayLatestChar = [];
    let intDcBasenbUuidMonitorState = 0;
    intDcBasenbUuidMonitorState = 0;
    let strArrayVariantSettings = [];
    strArrayVariantSettings = await utf8VariantSettings('in');
    let boolDcBasenbEnabled = false;
    boolDcBasenbEnabled = await contains(strArrayVariantSettings, 'dcBasenb');
    let boolInDcBasenbSection = false;
    boolInDcBasenbSection = false;
    let boolSkipNextChar = false;
    boolSkipNextChar = false;
    let intArrayCollectedDcBasenbChars = [];
    let intCollectedDcBasenbCharsCount = 0;
    let intCollectedDcBasenbCharsCounter = 0;
    let intArrayCurrentUnmappableChar = [];
    while (await implNot(await implEq(0, await count(intArrayRemaining)))) {
        intArrayTemp = [  ];
        intArrayLatestChar = await pack32(await firstCharOfUtf8String(intArrayRemaining));
        if (boolDcBasenbEnabled) {
            if (await implNot(boolInDcBasenbSection)) {
                /* 8 characters for uuid. Probably a better way to do this but oh well. Got them with new TextEncoder().encode('[char]'); etc. */
                if (await implEq(intDcBasenbUuidMonitorState, 0)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 141, 129, 157 ])) {
                        intDcBasenbUuidMonitorState = 1;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 1)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 139, 182, 128 ])) {
                        intDcBasenbUuidMonitorState = 2;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 2)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 188, 183, 162 ])) {
                        intDcBasenbUuidMonitorState = 3;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 3)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 186, 128, 138 ])) {
                        intDcBasenbUuidMonitorState = 4;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 4)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 184, 165, 142 ])) {
                        intDcBasenbUuidMonitorState = 5;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 5)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 136, 186, 141 ])) {
                        intDcBasenbUuidMonitorState = 6;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 6)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 178, 139, 160 ])) {
                        intDcBasenbUuidMonitorState = 7;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 7)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 143, 186, 144 ])) {
                        intDcBasenbUuidMonitorState = 0;
                        boolInDcBasenbSection = true;
                    }
                }
            }
            else {
                if (await implEq(intDcBasenbUuidMonitorState, 0)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 188, 133, 185 ])) {
                        intDcBasenbUuidMonitorState = 1;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 1)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 180, 182, 175 ])) {
                        intDcBasenbUuidMonitorState = 2;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 2)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 136, 161, 186 ])) {
                        intDcBasenbUuidMonitorState = 3;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 3)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 191, 148, 138 ])) {
                        intDcBasenbUuidMonitorState = 4;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 4)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 134, 178, 166 ])) {
                        intDcBasenbUuidMonitorState = 5;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 5)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 141, 184, 130 ])) {
                        intDcBasenbUuidMonitorState = 6;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 6)) {
                    if (await arrEq(intArrayLatestChar, [ 243, 178, 128, 176 ])) {
                        intDcBasenbUuidMonitorState = 7;
                    }
                    else {
                        intDcBasenbUuidMonitorState = 0;
                    }
                }
                else if (await implEq(intDcBasenbUuidMonitorState, 7)) {
                    if (await arrEq(intArrayLatestChar, [ 244, 143, 188, 157 ])) {
                        intDcBasenbUuidMonitorState = 0;
                        boolInDcBasenbSection = false;
                    }
                }
                /* Check for basenb characters and collect them for decoding */
                if (await isBasenbChar(intArrayLatestChar)) {
                    intArrayCollectedDcBasenbChars = await append(intArrayCollectedDcBasenbChars, intArrayLatestChar);
                    boolSkipNextChar = true;
                }
                else {
                    /* Not a basenb char, so decode the ones we've collected */
                    intArrayCollectedDcBasenbChars = await bytearrayFromBase17bUtf8(intArrayCollectedDcBasenbChars);
                    intCollectedDcBasenbCharsCount = await count(intArrayCollectedDcBasenbChars);
                    intCollectedDcBasenbCharsCounter = 0;
                    while (await implLt(intCollectedDcBasenbCharsCount, intCollectedDcBasenbCharsCounter)) {
                        intArrayCurrentUnmappableChar = await pack32(await firstCharOfUtf8String());
                        intArrayRes = await append(intArrayRes, await unpack32(intArrayCurrentUnmappableChar));
                        intCollectedDcBasenbCharsCounter = await implAdd(intCollectedDcBasenbCharsCounter, await count(intArrayCurrentUnmappableChar));
                    }
                    intArrayCollectedDcBasenbChars = [  ];
                }
            }
        }
        if (boolSkipNextChar) {
            boolSkipNextChar = false;
        }
        else {
            intArrayTemp = await append(intArrayTemp, intArrayLatestChar);
            intArrayRes = await append(intArrayRes, await dcFromFormat('unicode', intArrayTemp));
        }
        intArrayRemaining = await anSubset(intArrayRemaining, await count(intArrayTemp), -1);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function utf8VariantSettings(strDirection) {
    await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugStackEnter('utf8VariantSettings:format-utf8'); await assertIsStr(strDirection); let strArrayReturn;

    let strArrayRes = [];
    let strEnabledVariants = '';
    strEnabledVariants = await getSettingForFormat('utf8', strDirection, 'variants');
    /* TODO: Support multiple variants enabled (chop up the value of the s/enabledVariants string into its constituent variants) */
    strArrayRes = await push(strArrayRes, strEnabledVariants);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function dcaToDcbnbUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToDcbnbUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* convenience wrapper */
    let intArrayRes = [];
    await pushExportSettings(await getFormatId('utf8'), 'variants:dcBasenb,');
    intArrayRes = await dcaToUtf8(intArrayContent);
    await popExportSettings(await getFormatId('utf8'));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromDcbnbUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromDcbnbUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* convenience wrapper */
    let intArrayRes = [];
    await pushImportSettings(await getFormatId('utf8'), 'variants:dcBasenb,');
    intArrayRes = await dcaFromUtf8(intArrayContent);
    await popImportSettings(await getFormatId('utf8'));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestsFormatAscii(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatAscii:format-ascii-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatAscii');
    await runTest(boolV, await arrEq([ 0, 212, 120, 216, 221, 226, 231, 21, 26 ], await dcaFromAscii([ 0, 5, 10, 15, 20, 25, 30, 35, 40 ])));
    await runTest(boolV, await arrEq([ 0, 5, 10, 15, 20, 25, 30, 35, 40 ], await dcaToAscii([ 0, 212, 120, 216, 291, 221, 226, 231, 21, 26 ])));

    await internalDebugStackExit();
}

/* This is an attempt at packing arbitrary 32-bit unsigned? ints losslessly in a manner similar to UTF-8. For now, it is simply a wrapper around WTF-8 (UTF-8 but allowing unpaired surrogates). Consequently, it only supports a chunk of the 32 bit numbers. Later it can be extended to support all. Note that these functions take *signed* ints as input at least for the moment. */

async function pack32(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('pack32:pack32'); await assertIsInt(intIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await intArrayPackWtf8(intIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function unpack32(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('unpack32:pack32'); await assertIsIntArray(intArrayIn); let intReturn;

    let intRes = 0;
    intRes = await intUnpackWtf8(intArrayIn);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getSettingForFormat(strFormat, strDirection, strSettingKey) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugCollect('str SettingKey = ' + strSettingKey + '; '); await internalDebugStackEnter('getSettingForFormat:formats-settings'); await assertIsStr(strFormat); await assertIsStr(strDirection); await assertIsStr(strSettingKey); let strReturn;

    /* s/direction can be "in" for import settings or "out" for export settings. */
    let strArrayTemp = [];
    strArrayTemp = await getSettingsForFormat(strFormat, strDirection);
    let strRes = '';
    if (await contains(strArrayTemp, strSettingKey)) {
        strRes = await getNext(strArrayTemp, await indexOf(strArrayTemp, strSettingKey));
    }
    else {
        strRes = '';
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getSettingsForFormat(strFormat, strDirection) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugStackEnter('getSettingsForFormat:formats-settings'); await assertIsStr(strFormat); await assertIsStr(strDirection); let strArrayReturn;

    /* Returns an array of setting key/value pairs. A format setting string looks like, which should be fairly parseable (keys and vals follow StageL ident naming rules): key1:val1,key2:val2, */
    let intFormatId = 0;
    intFormatId = await getFormatId(strFormat);
    let strArrayRes = [];
    if (await implEq(strDirection, 'in')) {
        strArrayRes = await settingStringToArray(await getImportSettings(intFormatId));
    }
    else {
        strArrayRes = await settingStringToArray(await getExportSettings(intFormatId));
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getImportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('getImportSettings:formats-settings'); await assertIsInt(intFormatId); let strReturn;

    let strRes = '';
    if (await implLt(intFormatId, await count(await getImportSettingsArr()))) {
        strRes = await get(await getImportSettingsArr(), intFormatId);
    }
    else {
        strRes = '';
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getExportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('getExportSettings:formats-settings'); await assertIsInt(intFormatId); let strReturn;

    let strRes = '';
    if (await implLt(intFormatId, await count(await getExportSettingsArr()))) {
        strRes = await get(await getExportSettingsArr(), intFormatId);
    }
    else {
        strRes = '';
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function pushImportSettings(intFormatId, strNewSettingString) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugCollect('str NewSettingString = ' + strNewSettingString + '; '); await internalDebugStackEnter('pushImportSettings:formats-settings'); await assertIsInt(intFormatId); await assertIsStr(strNewSettingString);

    /* Note that all import settings must be popped in the reverse of the order they were pushed (all formats' import settings share the same stack). */
    strArrayImportDeferredSettingsStack = await push(strArrayImportDeferredSettingsStack, await getImportSettings(intFormatId));
    await setImportSettings(intFormatId, strNewSettingString);

    await internalDebugStackExit();
}

async function pushExportSettings(intFormatId, strNewSettingString) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugCollect('str NewSettingString = ' + strNewSettingString + '; '); await internalDebugStackEnter('pushExportSettings:formats-settings'); await assertIsInt(intFormatId); await assertIsStr(strNewSettingString);

    /* Note that all export settings must be popped in the reverse of the order they were pushed (all formats' export settings share the same stack). */
    strArrayExportDeferredSettingsStack = await push(strArrayExportDeferredSettingsStack, await getExportSettings(intFormatId));
    await setExportSettings(intFormatId, strNewSettingString);

    await internalDebugStackExit();
}

async function popImportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('popImportSettings:formats-settings'); await assertIsInt(intFormatId);

    await setImportSettings(intFormatId, await get(strArrayImportDeferredSettingsStack, -1));
    strArrayImportDeferredSettingsStack = await asSubset(strArrayImportDeferredSettingsStack, 0, -2);

    await internalDebugStackExit();
}

async function popExportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('popExportSettings:formats-settings'); await assertIsInt(intFormatId);

    await setExportSettings(intFormatId, await get(strArrayExportDeferredSettingsStack, -1));
    strArrayExportDeferredSettingsStack = await asSubset(strArrayExportDeferredSettingsStack, 0, -2);

    await internalDebugStackExit();
}

async function settingStringToArray(strSettings) {
    await internalDebugCollect('str Settings = ' + strSettings + '; '); await internalDebugStackEnter('settingStringToArray:formats-settings'); await assertIsStr(strSettings); let strArrayReturn;

    let strArrayRes = [];
    intCount = await len(strSettings);
    let intCounter = 0;
    intCounter = 0;
    let strElem = '';
    let strState = '';
    strState = 'key';
    let strChar = '';
    while (await implLt(intCounter, intCount)) {
        strChar = await charAt(strSettings, intCounter);
        if (await implEq(strState, 'key')) {
            if (await implEq(strChar, ':')) {
                strArrayRes = await push(strArrayRes, strElem);
                strElem = '';
                strState = 'val';
            }
            else {
                strElem = await implCat(strElem, strChar);
            }
        }
        else {
            if (await implEq(strChar, ',')) {
                strArrayRes = await push(strArrayRes, strElem);
                strElem = '';
                strState = 'key';
            }
            else {
                strElem = await implCat(strElem, strChar);
            }
        }
        intCounter = await implAdd(intCounter, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function settingArrayToString(strArraySettings) {
    await internalDebugCollect('strArray Settings = ' + strArraySettings + '; '); await internalDebugStackEnter('settingArrayToString:formats-settings'); await assertIsStrArray(strArraySettings); let strReturn;

    let strRes = '';
    intCount = await count(strArraySettings);
    let intCounter = 0;
    intCounter = 0;
    let strElem = '';
    while (await implLt(intCounter, intCount)) {
        strElem = await get(strArraySettings, intCounter);
        await assertIsTrue(await isValidIdent(strElem));
        if (await implEq(0, await implMod(intCounter, 2))) {
            strRes = await implCat(strRes, await implCat(strElem, ','));
        }
        else {
            strRes = await implCat(strRes, await implCat(strElem, ':'));
        }
        intCounter = await implAdd(intCounter, 1);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

/* For now, I'm inclined to skip implementing wasm right now, and just have a stub interface here. It seems well specced and portable, so I think it *can* be at some point. It would be nice if it were already implemented in StageL, but I might have to do that later. */
/* Copies of the current versions as of this writing (latest git commits) of wac, WebAssembly spec, and dependencies are included in work-docs/wasm for easy access, and are covered under their respective licenses. The following repositories are there: */
/* https://github.com/kanaka/wac */
/* https://github.com/kanaka/fooboot */
/* https://github.com/WebAssembly/wabt */
/* https://github.com/WebAssembly/spec */
/* https://github.com/WebAssembly/testsuite */
/* https://github.com/google/googletest */
/* https://github.com/dabeaz/ply */

async function wasmCheckForError(strCaller, genericItemArg) {
    await internalDebugCollect('str Caller = ' + strCaller + '; '); await internalDebugCollect('genericItem Arg = ' + genericItemArg + '; '); await internalDebugStackEnter('wasmCheckForError:wasm'); await assertIsStr(strCaller); await assertIsGenericItem(genericItemArg);

    let strArgStr = '';
    if (await isArray(genericItemArg)) {
        strArgStr = await printArray(genericItemArg);
    }
    else {
        strArgStr = await strFrom(genericItemArg);
    }
    let intErr = 0;
    intErr = await internalWasmCall('checkForError');
    /* await console.log('intErr='+intErr+typeof intErr); */
    /* await console.log('strArgStr='+strArgStr+typeof strArgStr); */
    /* Next line seems to crash with intErr being a null object. Why???? */
    /* await console.log(await ne(intErr, 0)); */
    /* return; */
    if (await ne(0, intErr)) {
        await implDie(await implCat('WebAssembly call to ', await implCat(strCaller, await implCat(' with the argument ', await implCat(strArgStr, ' reported an error.')))));
    }

    await internalDebugStackExit();
}

async function wasmCall(strRoutine, intVal) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('int Val = ' + intVal + '; '); await internalDebugStackEnter('wasmCall:wasm'); await assertIsStr(strRoutine); await assertIsInt(intVal); let intReturn;

    let intRes = 0;
    intRes = await internalWasmCall(strRoutine, intVal);
    await wasmCheckForError(strRoutine, intVal);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function wasmCallNoArgs(strRoutine) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugStackEnter('wasmCallNoArgs:wasm'); await assertIsStr(strRoutine); let intReturn;

    /* Only returns an int */
    let intRes = 0;
    intRes = await internalWasmCallNoArgs(strRoutine);
    await wasmCheckForError(strRoutine);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function wasmCallArrIn(strRoutine, intArrayVals) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('intArray Vals = ' + intArrayVals + '; '); await internalDebugStackEnter('wasmCallArrIn:wasm'); await assertIsStr(strRoutine); await assertIsIntArray(intArrayVals); let intReturn;

    let intRes = 0;
    intRes = await internalWasmCallArrIn(strRoutine, intArrayVals);
    await wasmCheckForError(strRoutine, intArrayVals);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function wasmCallArrOut(strRoutine, intVal) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('int Val = ' + intVal + '; '); await internalDebugStackEnter('wasmCallArrOut:wasm'); await assertIsStr(strRoutine); await assertIsInt(intVal); let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrOut(strRoutine, intVal);
    await wasmCheckForError(strRoutine, intVal);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function wasmCallArrInOut(strRoutine, intArrayVals) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('intArray Vals = ' + intArrayVals + '; '); await internalDebugStackEnter('wasmCallArrInOut:wasm'); await assertIsStr(strRoutine); await assertIsIntArray(intArrayVals); let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrInOut(strRoutine, intArrayVals);
    await wasmCheckForError(strRoutine, intArrayVals);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromAsciiSafeSubset(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromAsciiSafeSubset:format-asciiSafeSubset'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    let intLen = 0;
    intLen = await count(intArrayContent);
    let intCounter = 0;
    intCounter = 0;
    let strState = '';
    strState = 'normal';
    let intArrayPrefilter = [];
    let intCurrentChar = 0;
    let boolStrict = false;
    boolStrict = false;
    if (await implEq('true', await getSettingForFormat('asciiSafeSubset', 'in', 'strict'))) {
        boolStrict = true;
    }
    while (await implLt(intCounter, intLen)) {
        intCurrentChar = await get(intArrayContent, intCounter);
        await assertIsTrue(await isAsciiSafeSubsetChar(intCurrentChar));
        if (await implAnd(boolStrict, await implAnd(await implEq(strState, 'normal'), await implEq(intCurrentChar, 10)))) {
            await implDie('LF without preceding CR not allowed in asciiSafeSubset strict mode.');
        }
        if (await implAnd(await implEq(strState, 'normal'), await implEq(intCurrentChar, 13))) {
            /* Wait to see if there's a lf after this cr. If so, treat them as a unit. */
            strState = 'crlf';
        }
        else if (await implEq(strState, 'crlf')) {
            strState = 'normal';
            intArrayPrefilter = await append(intArrayPrefilter, await crlf());
            if (await ne(intCurrentChar, 10)) {
                if (boolStrict) {
                    await implDie('CR followed by non-LF byte not allowed in asciiSafeSubset strict mode.');
                }
                /* Reparse the current character */
                intCounter = await implSub(intCounter, 1);
            }
        }
        else {
            intArrayPrefilter = await push(intArrayPrefilter, intCurrentChar);
        }
        intCounter = await implAdd(intCounter, 1);
    }
    intArrayPrefilter = await dcaFromAscii(intArrayPrefilter);

    intArrayReturn = intArrayPrefilter; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToAsciiSafeSubset(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToAsciiSafeSubset:format-asciiSafeSubset'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    let intArrayTemp = [];
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    let intDcAtIndex = 0;
    let strState = '';
    strState = 'normal';
    let intArrayMapTemp = [];
    while (await implLt(intInputIndex, intLen)) {
        intArrayMapTemp = await dcToFormat('utf8', await get(intArrayDcIn, intInputIndex));
        if (await implEq(0, await count(intArrayMapTemp))) {
            intArrayTemp = await setElement(intArrayTemp, intInputIndex, -1);
        }
        else {
            intArrayTemp = await setElement(intArrayTemp, intInputIndex, await get(intArrayMapTemp, 0));
        }
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    intInputIndex = 0;
    let intArrayTempChar = [];
    while (await implLt(intInputIndex, intLen)) {
        intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        if (await implEq(intDcAtIndex, 121)) {
            strState = 'crlf';
            intInputIndex = await implAdd(intInputIndex, 1);
            intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        }
        if (await implEq(strState, 'normal')) {
            intArrayTempChar = await dcToFormat('utf8', intDcAtIndex);
            if (await implEq(0, await count(intArrayTempChar))) {
                await exportWarningUnmappable(intInputIndex, intDcAtIndex);
            }
            else {
                if (await dcIsNewline(intDcAtIndex)) {
                    intArrayOut = await append(intArrayOut, await crlf());
                }
                else if (await isAsciiSafeSubsetChar(await get(intArrayTempChar, 0))) {
                    intArrayOut = await push(intArrayOut, intArrayTempChar);
                }
                else {
                    await exportWarningUnmappable(intInputIndex, intDcAtIndex);
                }
            }
        }
        else if (await implEq(strState, 'crlf')) {
            strState = 'normal';
            if (await implEq(intDcAtIndex, 120)) {
                /* Found ambiguous cr, lf in a row, so only output one crlf */
                intArrayOut = await append(intArrayOut, await crlf());
            }
            else {
                /* Reprocess the current character with 'normal' state */
                intInputIndex = await implSub(intInputIndex, 1);
            }
        }
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isAsciiSafeSubsetChar(intChar) {
    await internalDebugCollect('int Char = ' + intChar + '; '); await internalDebugStackEnter('isAsciiSafeSubsetChar:format-asciiSafeSubset'); await assertIsInt(intChar); let boolReturn;

    let boolRes = false;
    boolRes = await or(await asciiIsPrintable(intChar), await asciiIsNewline(intChar));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listFormats() {
    await internalDebugStackEnter('listFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcGetColumn('formats', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function listInputFormats() {
    await internalDebugStackEnter('listInputFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValueGreater('formats', 3, 0, 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedInputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedInputFormat:formats-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listInputFormats(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listInternalFormats() {
    await internalDebugStackEnter('listInternalFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'internal', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedInternalFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedInternalFormat:formats-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await or(await contains(await listInputFormats(), strIn), await contains(await listInternalFormats(), strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listOutputFormats() {
    await internalDebugStackEnter('listOutputFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValueGreater('formats', 4, 0, 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedOutputFormat:formats-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listOutputFormats(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listCharEncodings() {
    await internalDebugStackEnter('listCharEncodings:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'encoding', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedCharEncoding(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedCharEncoding:formats-data'); await assertIsStr(strIn); let boolReturn;

    /* Specifically, is it a supported character encoding for the output environment. */
    let boolRes = false;
    boolRes = await implAnd(await contains(await listCharEncodings(), strIn), await isSupportedOutputFormat(strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listTerminalTypes() {
    await internalDebugStackEnter('listTerminalTypes:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'terminal', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedTerminalType(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedTerminalType:formats-data'); await assertIsStr(strIn); let boolReturn;

    /* Specifically, is it a supported terminal type for the output environment. */
    let boolRes = false;
    boolRes = await implAnd(await contains(await listTerminalTypes(), strIn), await isSupportedOutputFormat(strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listDataTypes() {
    await internalDebugStackEnter('listDataTypes:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'data', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function listVariantsForFormat(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('listVariantsForFormat:formats-data'); await assertIsStr(strFormat); let strArrayReturn;

    let strNormalizedFmt = '';
    strNormalizedFmt = await normalizeFormat(strFormat);
    let strArrayFormats = [];
    strArrayFormats = await listFormats();
    let intCount = 0;
    let intI = 0;
    intCount = await count(strArrayFormats);
    intI = 0;
    let strCandidateFmt = '';
    let strNormalizedVar = '';
    let strArrayRes = [];
    while (await implLt(intI, intCount)) {
        strCandidateFmtType = await dcDataLookupById('formats', intI, 6);
        if (await implEq('v:', await substr(strCandidateFmtType, 0, 2))) {
            strCandidateFmtType = await substr(strCandidateFmtType, 3, -1);
            if (await implIn(strCandidateFmtType, [ 'unicodePua' ])) {
                strCandidateFmtType = 'unicode';
            }
            if (await implEq(strNormalizedFmt, strCandidateFmtType)) {
                strArrayRes = await push(strArrayRes, await dcDataLookupById('formats', intI, 1));
            }
        }
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getFormatId(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getFormatId:formats-data'); await assertIsStr(strFormat); let intReturn;

    let intRes = 0;
    intRes = await intFromIntStr(await dcDataLookupByValue('formats', 1, strFormat, 0));

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function normalizeFormat(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('normalizeFormat:formats-data'); await assertIsStr(strFormat); let strReturn;

    if (await implEq(strFormat, 'utf8')) {

        strReturn = 'unicode'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }

    strReturn = strFormat; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getFormatExtension(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getFormatExtension:formats-data'); await assertIsStr(strFormat); let strReturn;

    let strRes = '';
    strRes = await dcDataLookupById('formats', await getFormatId(strFormat), 2);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strChar(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strChar:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strCharAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strCharAtPos:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAtPos:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAt(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAt:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function reverseStr(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('reverseStr:strings'); await assertIsStr(strStr); let strReturn;

    let intL = 0;
    intL = await len(strStr);
    let intC = 0;
    intC = 0;
    let strRes = '';
    while (await le(intC, intL)) {
        strRes = await implCat(strRes, await strCharAtPos(strStr, await implSub(intL, intC)));
        intC = await implAdd(1, intC);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charToUpper(strChar) {
    await internalDebugCollect('str Char = ' + strChar + '; '); await internalDebugStackEnter('charToUpper:strings'); await assertIsStr(strChar); let strReturn;

    await assertIsChar(strChar);
    let intTemp = 0;
    intTemp = await byteFromChar(strChar);
    if (await intIsBetween(intTemp, 97, 122)) {
        intTemp = await implSub(intTemp, 32);
    }
    let strRes = '';
    strRes = await charFromByte(intTemp);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToUpper(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strToUpper:strings'); await assertIsStr(strStr); let strReturn;

    let strRes = '';
    let intI = 0;
    intI = 0;
    let intCount = 0;
    intCount = await len(strStr);
    while (await implLt(intI, intCount)) {
        strRes = await implCat(strRes, await charToUpper(await strCharAtPos(strStr, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charToLower(strChar) {
    await internalDebugCollect('str Char = ' + strChar + '; '); await internalDebugStackEnter('charToLower:strings'); await assertIsStr(strChar); let strReturn;

    await assertIsChar(strChar);
    let intTemp = 0;
    intTemp = await byteFromChar(strChar);
    if (await intIsBetween(intTemp, 65, 90)) {
        intTemp = await implAdd(intTemp, 32);
    }
    let strRes = '';
    strRes = await charFromByte(intTemp);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToLower(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strToLower:strings'); await assertIsStr(strStr); let strReturn;

    let strRes = '';
    let intI = 0;
    intI = 0;
    let intCount = 0;
    intCount = await len(strStr);
    while (await implLt(intI, intCount)) {
        strRes = await implCat(strRes, await charToLower(await strCharAtPos(strStr, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strEmpty(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strEmpty:strings'); await assertIsStr(strStr); let boolReturn;

    let boolRes = false;
    boolRes = await implEq(0, await len(strStr));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function strNonempty(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strNonempty:strings'); await assertIsStr(strStr); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await strEmpty(strStr));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function substr(strStr, intStart, intLen) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int Len = ' + intLen + '; '); await internalDebugStackEnter('substr:strings'); await assertIsStr(strStr); await assertIsInt(intStart); await assertIsInt(intLen); let strReturn;

    /* Convenience wrapper */
    let strRes = '';
    strRes = await substring(strStr, intStart, intLen);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strContainsOnlyInt(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('strContainsOnlyInt:strings'); await assertIsStr(strIn); let boolReturn;

    /* Positive int, specifically. Only digits allowed. */
    let intTemp = 0;
    intTemp = await len(strIn);
    let intI = 0;
    intI = 0;
    let boolRes = false;
    boolRes = true;
    while (await implLt(intI, intTemp)) {
        if (await implNot(await asciiIsDigit(await byteFromChar(await strCharAtPos(strIn, intI))))) {
            boolRes = false;
        }
        intI = await implAdd(intI, 1);
    }

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isValidIdent(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isValidIdent:strings'); await assertIsStr(strIn); let strReturn;

    /* Doesn't check for duplicate idents or whatever. Just makes sure the basic form is correct. */
    let intTemp = 0;
    intTemp = await len(strIn);
    let intI = 0;
    intI = 0;
    let boolRes = false;
    boolRes = true;
    let intCurrentCharByte = 0;
    while (await implLt(intI, intTemp)) {
        intCurrentCharByte = await byteFromChar(await strCharAtPos(strIn, intI));
        if (await implEq(intI, 0)) {
            /* First character can only be lowercase letter */
            if (await implNot(await asciiIsLetterLower(intCurrentCharByte))) {
                boolRes = false;
            }
        }
        else if (await implNot(await or(await asciiIsDigit(intCurrentCharByte), await asciiIsLetter(intCurrentCharByte)))) {
            boolRes = false;
        }
        intI = await implAdd(intI, 1);
    }

    strReturn = boolRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function prepareStrForEcho(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('prepareStrForEcho:strings'); await assertIsStr(strIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await convertFormats('ascii', await getEnvPreferredFormat(), await append(await strToByteArray(strIn), await crlf()));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function listDcDatasets() {
    await internalDebugStackEnter('listDcDatasets:dc-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'DcData', 'formats', 'mappings/from/ascii', 'mappings/from/unicode', 'mappings/to/html', 'mappings/to/unicode' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function dcGetColumn(strDataset, intColumn) {
    await internalDebugCollect('str Dataset = ' + strDataset + '; '); await internalDebugCollect('int Column = ' + intColumn + '; '); await internalDebugStackEnter('dcGetColumn:dc-data'); await assertIsStr(strDataset); await assertIsInt(intColumn); let strArrayReturn;

    let strArrayRes = [];
    let intCount = 0;
    intCount = await dcDatasetLength(strDataset);
    let intI = 0;
    while (await implLt(intI, intCount)) {
        strArrayRes = await push(strArrayRes, await dcDataLookupById(strDataset, intI, intColumn));
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getDcCount() {
    await internalDebugStackEnter('getDcCount:dc-data'); let intReturn;

    let intRes = 0;
    intRes = await dcDatasetLength('DcData');
}

async function isDcDataset(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isDcDataset:dc-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listDcDatasets(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcGetField(intDc, intFieldNumber) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugCollect('int FieldNumber = ' + intFieldNumber + '; '); await internalDebugStackEnter('dcGetField:dc-data'); await assertIsInt(intDc); await assertIsInt(intFieldNumber); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcDataLookupById('DcData', intDc, intFieldNumber);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetName(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetName:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 1);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetCombiningClass(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetCombiningClass:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 2);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetBidiClass(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetBidiClass:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 3);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetCasing(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetCasing:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 4);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetType(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetType:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 5);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetScript(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetScript:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 6);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetComplexTraits(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetComplexTraits:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 7);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetDescription(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetDescription:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 8);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function abSubset(boolArrayIn, intStart, intEnd) {
    await internalDebugCollect('boolArray In = ' + boolArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('abSubset:arrays'); await assertIsBoolArray(boolArrayIn); await assertIsInt(intStart); await assertIsInt(intEnd); let boolArrayReturn;

    let intCount = 0;
    intCount = await count(boolArrayIn);
    let intI = 0;
    intI = intStart;
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    intCount = intEnd;
    let boolArrayRes = [];
    while (await le(intI, intCount)) {
        boolArrayRes = await push(boolArrayRes, await get(boolArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    boolArrayReturn = boolArrayRes; await assertIsBoolArray(boolArrayReturn); await internalDebugStackExit(); return boolArrayReturn;
}

async function anSubset(intArrayIn, intStart, intEnd) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('anSubset:arrays'); await assertIsIntArray(intArrayIn); await assertIsInt(intStart); await assertIsInt(intEnd); let intArrayReturn;

    let intCount = 0;
    intCount = await count(intArrayIn);
    let intI = 0;
    intI = intStart;
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    intCount = intEnd;
    let intArrayRes = [];
    while (await le(intI, intCount)) {
        intArrayRes = await push(intArrayRes, await get(intArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function asSubset(strArrayIn, intStart, intEnd) {
    await internalDebugCollect('strArray In = ' + strArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('asSubset:arrays'); await assertIsStrArray(strArrayIn); await assertIsInt(intStart); await assertIsInt(intEnd); let strArrayReturn;

    let intCount = 0;
    intCount = await count(strArrayIn);
    let intI = 0;
    intI = intStart;
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    intCount = intEnd;
    let strArrayRes = [];
    while (await le(intI, intCount)) {
        strArrayRes = await push(strArrayRes, await get(strArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function abFromB(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('abFromB:arrays'); await assertIsBool(boolIn); let boolArrayReturn;

    let boolArrayRes = [];
    boolArrayRes = await push(boolArrayRes, boolIn);

    boolArrayReturn = boolArrayRes; await assertIsBoolArray(boolArrayReturn); await internalDebugStackExit(); return boolArrayReturn;
}

async function anFromN(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('anFromN:arrays'); await assertIsInt(intIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await push(intArrayRes, intIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function asFromS(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('asFromS:arrays'); await assertIsStr(strIn); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await push(strArrayRes, strIn);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function contains(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('contains:arrays'); await assertIsGenericArray(genericArrayIn); await assertIsGeneric(genericValue); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implEq(genericElem, genericValue)) {

            boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function implIn(genericValue, genericArrayIn) {
    await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('implIn:arrays'); await assertIsGeneric(genericValue); await assertIsGenericArray(genericArrayIn); let boolReturn;

    /* Convenience wrapper */
    let boolRes = false;
    boolRes = await contains(genericArrayIn, genericValue);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function indexOf(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('indexOf:arrays'); await assertIsGenericArray(genericArrayIn); await assertIsGeneric(genericValue); let intReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let intCounter = 0;
    intCounter = 0;
    let genericElem;
    while (await implLt(intCounter, intCount)) {
        genericElem = await get(genericArrayIn, intCounter);
        if (await implEq(genericElem, genericValue)) {

            intReturn = intCounter; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
        }
        intCounter = await implAdd(intCounter, 1);
    }

    intReturn = -1; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function arrEmpty(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('arrEmpty:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let boolRes = false;
    boolRes = await implEq(0, await count(genericArrayIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function arrNonempty(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('arrNonempty:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await arrEmpty(genericArrayIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('isArray:arrays'); await assertIsGenericItem(genericItemIn); let boolReturn;

    /* Just a convenience wrapper */
    let boolRes = false;
    boolRes = await isGenericArray(genericItemIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function arrEq(genericArrayA, genericArrayB) {
    await internalDebugCollect('genericArray A = ' + genericArrayA + '; '); await internalDebugCollect('genericArray B = ' + genericArrayB + '; '); await internalDebugStackEnter('arrEq:arrays'); await assertIsGenericArray(genericArrayA); await assertIsGenericArray(genericArrayB); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayA);
    if (await ne(intCount, await count(genericArrayB))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let genericElem;
    let intI = 0;
    while (await implLt(intI, intCount)) {
        genericElem = await get(genericArrayA, intI);
        if (await ne(genericElem, await get(genericArrayB, intI))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intI = await implAdd(intI, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isIntArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isIntArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isInt(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isStrArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isStrArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isStr(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBoolArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isBoolArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isBool(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isCharArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isCharArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isChar(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isByteArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isByteArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isByte(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isIntBitArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isIntBitArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isIntBit(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isDcArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isDcArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isDc(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function sumArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('sumArray:arrays'); await assertIsIntArray(intArrayIn); let intReturn;

    let intCount = 0;
    intCount = await implSub(await count(intArrayIn), 1);
    let intRes = 0;
    while (await ge(intCount, 0)) {
        intRes = await implAdd(intRes, await get(intArrayIn, intCount));
        intCount = await implSub(intCount, 1);
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function runTestsOnly(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsOnly:unit-testing'); await assertIsBool(boolV); let boolReturn;

    /* Run tests without report. b/v=verbose: true=print test result lines; false=return value only */
    /* This runs each component's test suite */
    /* General tests */
    /*runTestsBits b/v */
    await runTestsFormatSems(boolV);
    await runTestsFormatUtf8(boolV);
    await runTestsMath(boolV);
    await runTestsPack32(boolV);
    /*runTestsWasm b/v */
    /* Core tests */
    await runTestsDcData(boolV);
    await runTestsFormatDc(boolV);
    /* Format tests */
    await runTestsFormatAscii(boolV);
    await runTestsFormatAsciiSafeSubset(boolV);
    await runTestsFormatHtml(boolV);
    await runTestsFormatHtmlFragment(boolV);
    await runTestsFormatIntegerList(boolV);
    /* Did anything fail? */
    if (await implEq(intFailedTests, 0)) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function testing(boolV, strTestSuite) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('str TestSuite = ' + strTestSuite + '; '); await internalDebugStackEnter('testing:unit-testing'); await assertIsBool(boolV); await assertIsStr(strTestSuite);

    if (boolV) {
        intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Started running test suite: ', strTestSuite)));
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    await internalDebugStackExit();
}

async function runTest(boolV, boolTestReturn) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('bool TestReturn = ' + boolTestReturn + '; '); await internalDebugStackEnter('runTest:unit-testing'); await assertIsBool(boolV); await assertIsBool(boolTestReturn); let boolReturn;

    intTotalTests = await implAdd(intTotalTests, 1);
    if (boolTestReturn) {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), ' passed.'))));
        }
        intPassedTests = await implAdd(intPassedTests, 1);
    }
    else {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), ' failed.'))));
        }
        intFailedTests = await implAdd(intFailedTests, 1);
    }
    if (boolV) {
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestNamed(boolV, strTestName, boolTestReturn) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('str TestName = ' + strTestName + '; '); await internalDebugCollect('bool TestReturn = ' + boolTestReturn + '; '); await internalDebugStackEnter('runTestNamed:unit-testing'); await assertIsBool(boolV); await assertIsStr(strTestName); await assertIsBool(boolTestReturn); let boolReturn;

    intTotalTests = await implAdd(intTotalTests, 1);
    if (boolTestReturn) {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), await implCat(strTestName, ' passed.')))));
        }
        intPassedTests = await implAdd(intPassedTests, 1);
    }
    else {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), await implCat(strTestName, ' failed.')))));
        }
        intFailedTests = await implAdd(intFailedTests, 1);
    }
    if (boolV) {
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function clearTestStats() {
    await internalDebugStackEnter('clearTestStats:unit-testing');

    intTotalTests = 0;
    intPassedTests = 0;
    intFailedTests = 0;

    await internalDebugStackExit();
}

async function reportTests() {
    await internalDebugStackEnter('reportTests:unit-testing'); let boolReturn;

    let strPassedWord = '';
    strPassedWord = 'tests';
    if (await implEq(intPassedTests, 1)) {
        strPassedWord = 'test';
    }
    let strFailedWord = '';
    strFailedWord = 'tests';
    if (await implEq(intFailedTests, 1)) {
        strFailedWord = 'test';
    }
    let strTotalWord = '';
    strTotalWord = 'tests';
    if (await implEq(intTotalTests, 1)) {
        strTotalWord = 'test';
    }
    let strPassedPercentage = '';
    strPassedPercentage = await formatPercentage(intPassedTests, intTotalTests);
    let strFailedPercentage = '';
    strFailedPercentage = await formatPercentage(intFailedTests, intTotalTests);
    intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat(await strFrom(intPassedTests), await implCat(' ', await implCat(strPassedWord, await implCat(' (', await implCat(strPassedPercentage, await implCat('%) passed and ', await implCat(await strFrom(intFailedTests), await implCat(' ', await implCat(strFailedWord, await implCat(' (', await implCat(strFailedPercentage, await implCat('%) failed out of a total of ', await implCat(await strFrom(intTotalTests), await implCat(' ', await implCat(strTotalWord, '.')))))))))))))))));
    let strTemp = '';
    if (await ne(intFailedTests, 0)) {
        strTotalWord = 'Some tests';
        if (await implEq(intTotalTests, 1)) {
            strTotalWord = 'A test';
        }
        strTemp = await implCat(strTotalWord, await implCat(' (', await implCat(strFailedPercentage, await implCat('%: ', await implCat(await strFrom(intFailedTests), await implCat(' out of ', await implCat(await strFrom(intTotalTests), ') failed!')))))));
        intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(strTemp));
        /*error s/temp */
    }
    if (await ne(intPassedTests, await implSub(intTotalTests, intFailedTests))) {
        await implDie('There is a problem in the testing framework.');
    }
    await renderDrawContents(intArrayTestFrameBuffer);
    intArrayTestFrameBuffer = [  ];
    let boolTestReturn = false;
    boolTestReturn = true;
    if (await ne(intFailedTests, 0)) {
        boolTestReturn = false;
        /*die s/temp */
    }

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestsFormatSems(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatSems:format-sems-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatSems');
    await runTest(boolV, await arrEq([ 1, 2 ], await dcaFromSems([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50 ], await dcaToSems([ 1, 2 ])));
    /* TODO: Support comment preservation */
    /*runTest b/v arrEq ( 1 2 ) dcaFromSems ( 49 32 50 35 65 ) */
    /*runTest b/v arrEq ( 49 32 50 32 ) dcaToSems ( 1 2 ) */

    await internalDebugStackExit();
}

async function dcaFromIntegerList(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromIntegerList:format-integerList'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRet = [];
    /* Accepts an array of bytes representing an ASCII list of integers representing Dcs. Returns an array of Dcs. This format is the same as sems but without supporting comments. */
    let strCurrentDc = '';
    strCurrentDc = '';
    let intContentLength = 0;
    intContentLength = await count(intArrayContent);
    let intByteOffset = 0;
    let intCurrentByte = 0;
    while (await implLt(intByteOffset, intContentLength)) {
        /* do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs. */
        intCurrentByte = await get(intArrayContent, intByteOffset);
        if (await asciiIsDigit(intCurrentByte)) {
            strCurrentDc = await implCat(strCurrentDc, await charFromByte(intCurrentByte));
        }
        else if (await asciiIsSpace(intCurrentByte)) {
            intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
            strCurrentDc = '';
        }
        else {
            await implDie('Unexpected parser state in integerList document.');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    if (await ne(0, await len(strCurrentDc))) {
        /* Ended without a trailing space */
        if (await implEq('true', await getSettingForFormat('integerList', 'in', 'strict'))) {
            await implDie('No trailing space present in integerList format while importing. This is not allowed in strict mode.');
        }
        intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToIntegerList(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToIntegerList:format-integerList'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    while (await implLt(intInputIndex, intLen)) {
        intArrayOut = await push(intArrayOut, await strToByteArray(await implCat(await strFrom(await get(intArrayDcIn, intInputIndex), ), ' ')));
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestsWasm(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsWasm:wasm-tests'); await assertIsBool(boolV);

    await testing(boolV, 'wasm');
    await runTest(boolV, await implEq(42, await wasmCall('fortytwo', 0)));
    await runTest(boolV, await implEq(4, await wasmCallArrIn('add', [ 2, 2 ])));

    await internalDebugStackExit();
}

async function or(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('or:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nor:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nand(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nand:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xor:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xnor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xnor:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await xor(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isTrue(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('isTrue:booleans'); await assertIsBool(boolIn); let boolReturn;


    boolReturn = boolIn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isFalse(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('isFalse:booleans'); await assertIsBool(boolIn); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(boolIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestsFormatDc(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatDc:format-dc-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatDc');
    await runTest(boolV, await dcIsPrintable(21));
    await runTest(boolV, await implNot(await dcIsPrintable(231)));
    await runTest(boolV, await dcIsNewline(120));

    await internalDebugStackExit();
}

async function assertIsTrue(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('assertIsTrue:assertions'); await assertIsBool(boolIn);

    if (await isFalse(boolIn)) {
        await assertionFailed(await implCat(await bool(' is not true.')));
    }

    await internalDebugStackExit();
}

async function assertIsFalse(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('assertIsFalse:assertions'); await assertIsBool(boolIn);

    if (await isTrue(boolIn)) {
        await assertionFailed(await implCat(await bool(' is true, but should be false.')));
    }

    await internalDebugStackExit();
}

async function assertContains(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('assertContains:assertions'); await assertIsGenericArray(genericArrayIn); await assertIsGeneric(genericValue);

    await assertIsTrue(await contains(genericArrayIn, genericValue));

    await internalDebugStackExit();
}

async function assertIsByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsByte:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isByte(intIn));

    await internalDebugStackExit();
}

async function assertIsChar(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('assertIsChar:assertions'); await assertIsGeneric(genericIn);

    await assertIsTrue(await isChar(genericIn));

    await internalDebugStackExit();
}

async function assertIsCharByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsCharByte:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isCharByte(intIn));

    await internalDebugStackExit();
}

async function assertIsDc(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('assertIsDc:assertions'); await assertIsGeneric(genericIn);

    await assertIsTrue(await isDc(genericIn));

    await internalDebugStackExit();
}

async function assertStrContainsOnlyInt(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertStrContainsOnlyInt:assertions'); await assertIsStr(strIn);

    if (await implNot(await strContainsOnlyInt(strIn))) {
        await assertionFailed(await implCat(strIn, ' does not only contain an integer.'));
    }

    await internalDebugStackExit();
}

async function assertIsNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsNonnegative:assertions'); await assertIsInt(intIn);

    if (await implNot(await isNonnegative(intIn))) {
        let strTemp = '';
        strTemp = await strFrom(intIn);
        await assertionFailed(await implCat(strTemp, ' is negative.'));
    }

    await internalDebugStackExit();
}

async function assertIsSupportedBase(intB) {
    await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsSupportedBase:assertions'); await assertIsInt(intB);

    await assertIsTrue(await isSupportedBase(intB));

    await internalDebugStackExit();
}

async function assertIsBaseDigit(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseDigit:assertions'); await assertIsStr(strIn); await assertIsInt(intB);

    await assertIsTrue(await isBaseDigit(strIn, intB));

    await internalDebugStackExit();
}

async function assertIsBaseStr(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseStr:assertions'); await assertIsStr(strIn); await assertIsInt(intB);

    await assertIsTrue(await isBaseStr(strIn, intB));

    await internalDebugStackExit();
}

async function assertIsArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsIntArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsIntArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isIntArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsBoolArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsBoolArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isBoolArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsStrArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsStrArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isStrArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsCharArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsCharArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isCharArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsIntBitArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsIntBitArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isIntBitArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsByteArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsByteArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isByteArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsDcArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsDcArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isDcArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsDcDataset(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsDcDataset:assertions'); await assertIsStr(strIn);

    await assertIsTrue(await isDcDataset(strIn));

    await internalDebugStackExit();
}

async function assertIsSupportedInputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedInputFormat:assertions'); await assertIsStr(strIn);

    if (await implNot(await isSupportedInputFormat(strIn))) {
        await implDie(await implCat(strIn, ' is not a supported input format.'));
    }
    await assertIsTrue(await isSupportedInputFormat(strIn));

    await internalDebugStackExit();
}

async function assertIsSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedOutputFormat:assertions'); await assertIsStr(strIn);

    if (await implNot(await isSupportedOutputFormat(strIn))) {
        await implDie(await implCat(strIn, ' is not a supported output format.'));
    }
    await assertIsTrue(await isSupportedOutputFormat(strIn));

    await internalDebugStackExit();
}

async function assertIsSupportedEnvironmentCharEncoding(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedEnvironmentCharEncoding:assertions'); await assertIsStr(strIn);

    if (await implNot(await isSupportedEnvironmentCharEncoding(strIn))) {
        await implDie(await implCat(strIn, ' is not a supported environment character encoding.'));
    }
    await assertIsTrue(await isSupportedEnvironmentCharEncoding(strIn));

    await internalDebugStackExit();
}

async function assertIsExecId(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsExecId:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isExecId(intIn));

    await internalDebugStackExit();
}

/* This file contains the public interface for EITE. */
/* If you just want to run EITE, use the following function. */

async function startEite() {
    await internalDebugStackEnter('startEite:public-interface');

    /* Start EITE, using the default startup document. Does not return while EITE is still running. */
    /* loadAndRun ... */

    await internalDebugStackExit();
}
/* If you want to run a different document, you can call loadAndRun with the format of the document to open and its location. */

async function loadAndRun(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndRun:public-interface'); await assertIsStr(strFormat); await assertIsStr(strPath);

    /* Load and run the specified document. Does not return while the document is still running. */
    await runDocument(await loadStoredDocument(strFormat, strPath));

    await internalDebugStackExit();
}
/* If you want to convert a document to another format, you can call loadAndConvert with the format of the document, its location, and the format you want the results in. */

async function loadAndConvert(strInputFormat, strOutputFormat, strPath) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndConvert:public-interface'); await assertIsStr(strInputFormat); await assertIsStr(strOutputFormat); await assertIsStr(strPath); let intArrayReturn;

    /* Load the specified document, and return it converted to the specified outputFormat as an array of bytes. */
    let intArrayOut = [];
    intArrayOut = await exportDocument(strOutputFormat, await loadStoredDocument(strInputFormat, strPath), );
}
/* To operate on a document you already have as a Dc array, you can call runDocument or convertDocument directly on it. Or, if you already have it as a byte array, you can call importDocument or importAndExport on it. */

async function runDocument(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('runDocument:public-interface'); await assertIsIntArray(intArrayContents);

    /* Run the specified document. Does not return while the document is still running. Takes care of events and I/O automatically. */
    await setupIfNeeded();
    await assertIsDcArray(intArrayContents);
    let intExecId = 0;
    intExecId = await startDocument(intArrayContents);
    await internalRunDocument(intExecId);

    await internalDebugStackExit();
}

async function exportDocument(strFormat, intArrayContents) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('exportDocument:public-interface'); await assertIsStr(strFormat); await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Convert a document stored as an array of dcs to the specified format, and return it as an array of bytes. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaToFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importDocument(strFormat, intArrayContents) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('importDocument:public-interface'); await assertIsStr(strFormat); await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Convert a document stored as an array of bytes in the specified format, and return it as an array of dc. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaFromFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importAndExport(strInputFormat, strOutputFormat, intArrayContents) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('importAndExport:public-interface'); await assertIsStr(strInputFormat); await assertIsStr(strOutputFormat); await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedInputFormat(strInputFormat);
    await assertIsSupportedOutputFormat(strOutputFormat);
    /* Convert a document stored as an array of bytes in the specified input format, and return it as an array of bytes in the specified output format. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await convertFormats(strInputFormat, strOutputFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
/* If you want more control over the document loading and execution, you can use these lower-level functions. */

async function loadStoredDocument(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadStoredDocument:public-interface'); await assertIsStr(strFormat); await assertIsStr(strPath); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Load and return the specified document as a Dc array. */
    await setupIfNeeded();
    let intArrayRes = [];
    intArrayRes = await dcaFromFormat(strFormat, await getFileFromPath(strPath));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function startDocument(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('startDocument:public-interface'); await assertIsIntArray(intArrayContents); let intReturn;

    /* Start execution of the provided document and return an ID for it. */
    await setupIfNeeded();
    let intExecId = 0;
    intExecId = await startDocumentExec(intArrayContents);

    intReturn = intExecId; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getDesiredEventNotifications(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getDesiredEventNotifications:public-interface'); await assertIsInt(intExecId); let strArrayReturn;

    /* Return list of event types (e.g. keystrokes, mouse movement, elapsed time) that the document wants to be notified of. */
    let strArrayRes = [];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function sendEvent(intExecId, intArrayEventData) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('intArray EventData = ' + intArrayEventData + '; '); await internalDebugStackEnter('sendEvent:public-interface'); await assertIsInt(intExecId); await assertIsIntArray(intArrayEventData); let intArrayReturn;

    /* Send the provided event or events data to the specified document. */
}

async function getDocumentFrame(intExecId, strFormat) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getDocumentFrame:public-interface'); await assertIsInt(intExecId); await assertIsStr(strFormat); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Return the most recently available output for the given document in the requested format. */
}
/* To run the tests, you can use runTests or runPrintTests. */

async function runTests() {
    await internalDebugStackEnter('runTests:public-interface'); let boolReturn;

    /* Returns true if all tests pass; false otherwise. Displays a report of the tests. */
    await setupIfNeeded();
    await clearTestStats();
    await runTestsOnly(true);
    await reportTests();
    if (await implEq(intFailedTests, 0)) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function quietRunTests() {
    await internalDebugStackEnter('quietRunTests:public-interface'); let boolReturn;

    /* Returns true if all tests pass; false otherwise. */
    await setupIfNeeded();
    let boolRes = false;
    boolRes = await runTestsOnly(false);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(genericA, genericB) {
    await internalDebugCollect('generic A = ' + genericA + '; '); await internalDebugCollect('generic B = ' + genericB + '; '); await internalDebugStackEnter('ne:comparison'); await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ge:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function le(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('le:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ngt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ngt:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nlt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nlt:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nge:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nle(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nle:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await le(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function startDocumentExec(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('startDocumentExec:document-exec'); await assertIsIntArray(intArrayContents); let intReturn;

    let intExecId = 0;
    intExecId = -1;
    /* documentExecData is a global, created during initialization. It holds the current document state for any documents being executed. */
    intExecId = await count(intArrayDocumentExecPtrs);
    strArrayDocumentExecData = await push(strArrayDocumentExecData, await strPrintArr(intArrayContents));
    /* documentExecPtrs is also a global created during init; it holds the current execution state of each document as an int indicating the position in the document where execution is. */
    intArrayDocumentExecPtrs = await push(intArrayDocumentExecPtrs, 0);
    await assertIsExecId(intExecId);

    intReturn = intExecId; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function isExecId(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('isExecId:document-exec'); await assertIsInt(intExecId); let boolReturn;

    if (await implLt(intExecId, await count(intArrayDocumentExecPtrs))) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcaToHtml(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToHtml:format-html'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    intArrayOut = await strToByteArray('<!DOCTYPE html><html><head><title></title></head><body>');
    intArrayOut = await append(intArrayOut, await dcaToHtmlFragment(intArrayDcIn));
    intArrayOut = await append(intArrayOut, await strToByteArray('</body></html>'));
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestsPack32(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsPack32:pack32-tests'); await assertIsBool(boolV);

    await testing(boolV, 'pack32');
    await runTest(boolV, await implEq(0, await unpack32(await pack32(0))));
    await runTest(boolV, await implEq(10, await unpack32(await pack32(10))));
    await runTest(boolV, await implEq(100, await unpack32(await pack32(100))));
    await runTest(boolV, await implEq(1000, await unpack32(await pack32(1000))));
    await runTest(boolV, await implEq(10000, await unpack32(await pack32(10000))));

    await internalDebugStackExit();
}

async function runTestsFormatIntegerList(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatIntegerList:format-integerlist-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatIntegerList');
    await runTest(boolV, await arrEq([ 1, 2 ], await dcaFromIntegerList([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50, 32 ], await dcaToIntegerList([ 1, 2 ])));

    await internalDebugStackExit();
}

async function runTestsFormatUtf8(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatUtf8:format-utf8-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatUtf8');
    await runTest(boolV, await arrEq([ 35, 18, 36 ], await dcaFromUtf8([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50 ], await dcaToUtf8([ 35, 18, 36 ])));
    await runTest(boolV, await arrEq([ 35, 18, 36, 291, 36 ], await dcaFromDcbnbUtf8(await append([ 49, 32, 50 ], await append(await getArmoredUtf8EmbeddedStartUuid(await append([ 244, 131, 173, 156, 244, 143, 191, 187, 50 ], await getArmoredUtf8EmbeddedEndUuid())))))));
    await runTest(boolV, await arrEq(await append([ 49, 32, 50 ], await append(await getArmoredUtf8EmbeddedStartUuid(await append([ 244, 131, 173, 156, 244, 143, 191, 187, 50 ], await getArmoredUtf8EmbeddedEndUuid(), ), ), await dcaToDcbnbUtf8([ 35, 18, 36, 291, 36 ])))));

    await internalDebugStackExit();
}

async function dcaFromFormat(strInFormat, intArrayContentBytes) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('intArray ContentBytes = ' + intArrayContentBytes + '; '); await internalDebugStackEnter('dcaFromFormat:formats'); await assertIsStr(strInFormat); await assertIsIntArray(intArrayContentBytes); let intArrayReturn;

    await assertIsSupportedInputFormat(strInFormat);
    await assertIsByteArray(intArrayContentBytes);
    let intArrayRes = [];
    if (await implEq(strInFormat, 'sems')) {
        intArrayRes = await dcaFromSems(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'integerList')) {
        intArrayRes = await dcaFromIntegerList(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'ascii')) {
        intArrayRes = await dcaFromAscii(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'asciiSafeSubset')) {
        intArrayRes = await dcaFromAsciiSafeSubset(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'utf8')) {
        intArrayRes = await dcaFromUtf8(intArrayContentBytes);
    }
    else {
        await implError(await implCat('Unimplemented document parsing format: ', strInFormat));
    }
    await assertIsDcArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToFormat(strOutFormat, intArrayDcArrayIn) {
    await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('intArray DcArrayIn = ' + intArrayDcArrayIn + '; '); await internalDebugStackEnter('dcaToFormat:formats'); await assertIsStr(strOutFormat); await assertIsIntArray(intArrayDcArrayIn); let intArrayReturn;

    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsDcArray(intArrayDcArrayIn);
    let intArrayRes = [];
    if (await implEq(strOutFormat, 'integerList')) {
        intArrayRes = await dcaToIntegerList(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'ascii')) {
        intArrayRes = await dcaToAscii(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'asciiSafeSubset')) {
        intArrayRes = await dcaToAsciiSafeSubset(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'utf8')) {
        intArrayRes = await dcaToUtf8(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'html')) {
        intArrayRes = await dcaToHtml(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'htmlFragment')) {
        intArrayRes = await dcaToHtmlFragment(intArrayDcArrayIn);
    }
    else {
        await implDie(await implCat('Unimplemented document render output format: ', strOutFormat));
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function convertFormats(strInFormat, strOutFormat, intArrayIn) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('convertFormats:formats'); await assertIsStr(strInFormat); await assertIsStr(strOutFormat); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsSupportedInputFormat(strInFormat);
    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsByteArray(intArrayIn);
    let intArrayOut = [];
    intArrayOut = await dcaToFormat(strOutFormat, await dcaFromFormat(strInFormat, intArrayIn));
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getExportExtension(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getExportExtension:formats'); await assertIsStr(strFormat); let strReturn;

    /* Produces the actual file extension to be used for a file exported in the given format, with the current configured format options. */
    let strRes = '';
    if (await isSupportedCharEncoding(strFormat)) {
        strRes = await implCat(await getFormatExtension(strFormat), '.txt');

        strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    strRes = await getFormatExtension(strFormat);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcToFormat(strOutFormat, intDc) {
    await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcToFormat:formats'); await assertIsStr(strOutFormat); await assertIsInt(intDc); let intArrayReturn;

    /* Output byte array for a single dc, or an empty array if no output is available. Only operates on one Dc at a time. Some formats may not need this; calling with them is an error and should cause an assertion failure. */
    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsDc(intDc);
    let intArrayRes = [];
    if (await implEq(strOutFormat, 'utf8')) {
        let strLookup = '';
        strLookup = await dcDataLookupById('mappings/to/unicode', intDc, 1);
        if (await excOrEmpty(strLookup)) {
            strLookup = await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0);
        }
        if (await notExcep(strLookup)) {
            intArrayRes = await utf8BytesFromDecimalChar(await hexToDec(strLookup));
        }
    }
    else if (await implEq(strOutFormat, 'html')) {
        strRes = await dcDataLookupById('mappings/to/html', intDc, 1);
        if (await strNonempty(strRes)) {
            intArrayRes = await strToByteArray(strRes);
        }
        else {
            strRes = await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0);
            if (await isBaseStr(strRes, 16)) {
                intArrayRes = await append(intArrayRes, await utf8BytesFromDecimalChar(await hexToDec(strRes)));
            }
        }
    }
    else {
        await implError(await implCat('Unimplemented character output format: ', strOutFormat));
    }
    /* Returns an empty array if the Dc isn't printable. I don't think it should be an error to call this for a nonprintable Dc. */
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcFromFormat(strInFormat, intArrayContent) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcFromFormat:formats'); await assertIsStr(strInFormat); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* Retrieve dc (as a one-element array) corresponding to the input data (input data for some formats may be expected as byte arrays, but not for others), or an empty array if no match. Only operates on one Dc at a time. Some formats (e.g. sems) don't need this; calling with them is an error and should cause an assertion failure. */
    await assertIsTrue(await isSupportedInternalFormat(strInFormat));
    let intArrayRes = [];
    let intDc = 0;
    if (await or(await implEq(strInFormat, 'ascii'), await implEq(strInFormat, 'unicode'))) {
        let intC = 0;
        intC = await get(intArrayContent, 0);
        if (await implEq(strInFormat, 'ascii')) {
            if (await implNot(await isAsciiByte(intC))) {
                await implDie(await implCat('The character number ', await implCat(await strFrom(intC), ' is not a 7-bit ASCII character.')));
            }
        }
        await assertIsNonnegative(intC);
        if (await ge(intC, await dcDatasetLength('mappings/from/unicode'))) {
            await implDie('FIXME: save unmapped unicode chars');

            intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
        }
        intDc = await intFromIntStr(await dcDataLookupById('mappings/from/unicode', intC, 1));
    }
    else {
        await implDie(await implCat('Unimplemented character source format: ', strInFormat));
    }
    intArrayRes = await setElement(intArrayRes, 0, intDc);
    await assertIsDcArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importWarning(intIndex, strProblem) {
    await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugCollect('str Problem = ' + strProblem + '; '); await internalDebugStackEnter('importWarning:formats'); await assertIsInt(intIndex); await assertIsStr(strProblem);

    let strWarning = '';
    strWarning = await implCat('A problem was encountered while importing at character ', await implCat(await strFrom(intIndex), await implCat(': ', strProblem)));
    strArrayImportWarnings = await push(strArrayImportWarnings, strWarning);
    await implWarn(strWarning);

    await internalDebugStackExit();
}

async function exportWarning(intIndex, strProblem) {
    await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugCollect('str Problem = ' + strProblem + '; '); await internalDebugStackEnter('exportWarning:formats'); await assertIsInt(intIndex); await assertIsStr(strProblem);

    let strWarning = '';
    strWarning = await implCat('A problem was encountered while exporting at character ', await implCat(await strFrom(intIndex), await implCat(': ', strProblem)));
    strArrayExportWarnings = await push(strArrayExportWarnings, strWarning);
    await implWarn(strWarning);

    await internalDebugStackExit();
}

async function getImportWarnings() {
    await internalDebugStackEnter('getImportWarnings:formats'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = strArrayImportWarnings;
    strArrayImportWarnings = [  ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getExportWarnings() {
    await internalDebugStackEnter('getExportWarnings:formats'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = strArrayExportWarnings;
    strArrayExportWarnings = [  ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function exportWarningUnmappable(intIndex, intProblemDc) {
    await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugCollect('int ProblemDc = ' + intProblemDc + '; '); await internalDebugStackEnter('exportWarningUnmappable:formats'); await assertIsInt(intIndex); await assertIsInt(intProblemDc);

    await exportWarning(intIndex, await implCat('The character ', await implCat(await strFrom(intProblemDc), ' could not be represented in the chosen export format.')));

    await internalDebugStackExit();
}

async function isDc(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isDc:format-dc'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intNum = 0;
    intNum = genericIn;
    let boolRes = false;
    boolRes = await isNonnegative(intNum);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isKnownDc(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isKnownDc:format-dc'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isDc(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    if (await implGt(genericIn, await maximumKnownDc())) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function maximumKnownDc() {
    await internalDebugStackEnter('maximumKnownDc:format-dc'); let intReturn;

    let strRes = '';
    strRes = await dcDatasetLength('DcData');

    intReturn = strRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function dcIsNewline(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsNewline:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    /* This function returns whether a character should be treated as a newline, in general. Individual characters may have more complex or ambiguous meanings (see details in DcData.csv), but this is useful as a general guide. */
    /* We can't just use: */
    /*if eq 'B' dcGetBidiClass n/dc */
    /*    return true */
    /* because that means "Paragraph_Separator" bidi class, and includes some things that really shouldn't be considered newlines from what I can tell (information separator two through four), and does not include some things that are (U+2028 Line Separator). */
    if (await contains([ 119, 120, 121, 240, 294, 295 ], intDc)) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcIsSpace(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsSpace:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    if (await implEq('Zs', await dcGetType(intDc))) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcIsPrintable(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsPrintable:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    let strType = '';
    strType = await dcGetType(intDc);
    let strGeneralType = '';
    strGeneralType = await strChar(strType, 0);
    if (await or(await implEq('Zl', strType), await implEq('Zp', strType))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    if (await or(await implEq('!', strGeneralType), await implEq('C', strGeneralType))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestsFormatHtml(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatHtml:format-html-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatHtml');
    await runTest(boolV, await arrEq(await strToByteArray('<!DOCTYPE html><html><head><title></title></head><body><div style="white-space:pre-wrap">5&lt;6</div></body></html>'), await dcaToHtml([ 39, 46, 40 ])));

    await internalDebugStackExit();
}

async function isNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('isNonnegative:math'); await assertIsInt(intIn); let boolReturn;

    if (await implLt(intIn, 0)) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intIsBetween(intN, intA, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intIsBetween:math'); await assertIsInt(intN); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    /* Checks whether N is within the range A and B, including endpoints */
    let intT1 = 0;
    intT1 = await implSub(intN, intA);
    let intT2 = 0;
    intT2 = await implSub(intN, intB);
    let intT3 = 0;
    intT3 = await implMul(intT1, intT2);
    let boolTemp = false;
    boolTemp = await le(intT3, 0);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intToBase36Char(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('intToBase36Char:math'); await assertIsInt(intN); let strReturn;

    /* Returns the nth digit in base 36 or less (using capitalized digits). */
    if (await implNot(await intIsBetween(intN, 0, 36))) {
        let strTemp = '';
        strTemp = await strFrom(intN);
        await implDie(await implCat(await strFrom(strTemp, ' is not within the supported range of numbers between 0 and 36 (Z).')));
    }
    let strRes = '';
    if (await le(intN, 9)) {
        strRes = await charFromByte(await implAdd(intN, 48));
    }
    else {
        strRes = await charFromByte(await implAdd(intN, 55));
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function intFromBase36Char(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('intFromBase36Char:math'); await assertIsStr(strN); let intReturn;

    /* Returns an int given the nth digit in base 36 or less (using capitalized digits). */
    await assertIsChar(strN);
    let strUc = '';
    strUc = await strToUpper(strN);
    let intRes = 0;
    intRes = await byteFromChar(strUc);
    if (await ge(intRes, 65)) {
        if (await implGt(intRes, 90)) {
            await implDie(await implCat(strUc, ' is not within the supported range of digits between 0 and Z (36).'));
        }
        intRes = await implSub(intRes, 55);
    }
    else {
        if (await implNot(await intIsBetween(intRes, 48, 57))) {
            await implDie(await implCat(strN, ' is not within the supported range of digits between 0 and Z (36).'));
        }
        intRes = await implSub(intRes, 48);
    }
    if (await implNot(await intIsBetween(intRes, 0, 36))) {
        await implDie(await implCat('Internal error in intFromBase36Char called with n=', await implCat(strN, '.')));
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function intFromBaseStr(strN, intB) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intFromBaseStr:math'); await assertIsStr(strN); await assertIsInt(intB); let intReturn;

    /* Returns the integer represented by n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    await assertIsBaseStr(strN, intB);
    let strUc = '';
    strUc = await strToUpper(strN);
    let intRes = 0;
    intRes = 0;
    let intLen = 0;
    intLen = await len(strUc);
    let intInt = 0;
    intInt = 0;
    let intPow = 0;
    intPow = 1;
    while (await implGt(intLen, 0)) {
        intLen = await implSub(intLen, 1);
        intInt = await intFromBase36Char(await strCharAtPos(strUc, intLen));
        await assertIsTrue(await implLt(intInt, intB));
        intRes = await implAdd(intRes, await implMul(intInt, intPow));
        intPow = await implMul(intPow, intB);
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function hexToDec(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('hexToDec:math'); await assertIsStr(strN); let intReturn;

    let intRes = 0;
    intRes = await intFromBaseStr(strN, 16);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function decToHex(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('decToHex:math'); await assertIsStr(strN); let strReturn;

    let strRes = '';
    strRes = await intToBaseStr(intN, 10);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function intToBaseStr(intN, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intToBaseStr:math'); await assertIsInt(intN); await assertIsInt(intB); let strReturn;

    /* Returns a string representing n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    let strRes = '';
    if (await implEq(0, intN)) {
        strRes = '0';
    }
    else {
        while (await implGt(intN, 0)) {
            strRes = await implCat(strRes, await intToBase36Char(await implMod(intN, intB)));
            intN = await implDiv(intN, intB);
        }
        strRes = await reverseStr(strRes);
    }
    await assertIsBaseStr(strRes, intB);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function isSupportedBase(intB) {
    await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isSupportedBase:math'); await assertIsInt(intB); let boolReturn;

    /* StageL base conversion routines support base 1 to base 36. */
    let boolRes = false;
    boolRes = await intIsBetween(intB, 1, 36);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBaseDigit(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseDigit:math'); await assertIsStr(strIn); await assertIsInt(intB); let boolReturn;

    await assertIsChar(strIn);
    await assertIsSupportedBase(intB);
    if (await implNot(await asciiIsAlphanum(await byteFromChar(strIn)))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intDigitVal = 0;
    intDigitVal = await intFromBase36Char(strIn);
    let boolRes = false;
    boolRes = await implLt(intDigitVal, intB);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBaseStr(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseStr:math'); await assertIsStr(strIn); await assertIsInt(intB); let boolReturn;

    let intLen = 0;
    intLen = await len(strIn);
    intLen = await implSub(intLen, 1);
    await assertIsNonnegative(intLen);
    let strChr = '';
    let boolRes = false;
    boolRes = true;
    while (await ge(intLen, 0)) {
        strChr = await strCharAtPos(strIn, intLen);
        boolRes = await implAnd(boolRes, await isBaseDigit(strChr, intB));
        intLen = await implSub(intLen, 1);
    }

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function formatPercentage(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('formatPercentage:math'); await assertIsInt(intA); await assertIsInt(intB); let strReturn;

    if (await implEq(0, intA)) {

        strReturn = '0.000'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    let intPercentageN = 0;
    intPercentageN = await implMul(100, await implDiv(await implMul(intA, 100000), intB));
    let strPercentageTemp = '';
    strPercentageTemp = await strFrom(intPercentageN);
    let intCount = 0;
    intCount = await implSub(await len(strPercentageTemp), 2);
    let intCounter = 0;
    intCounter = intCount;
    let strPercentage = '';
    let intDecimLoc = 0;
    intDecimLoc = await implSub(intCount, 3);
    while (await implGt(intCounter, 0)) {
        if (await implEq(intCounter, await implSub(intCount, intDecimLoc))) {
            strPercentage = await implCat(strPercentage, '.');
        }
        strPercentage = await implCat(strPercentage, await strChar(strPercentageTemp, await implSub(intCount, intCounter)));
        intCounter = await implSub(intCounter, 1);
    }

    strReturn = strPercentage; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcaToHtmlFragment(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToHtmlFragment:format-htmlFragment'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    intArrayOut = await append(intArrayOut, await strToByteArray('<div style="white-space:pre-wrap">'));
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    let intDcAtIndex = 0;
    while (await implLt(intInputIndex, intLen)) {
        intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        intArrayOut = await push(intArrayOut, await dcToFormat('html', intDcAtIndex));
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    intArrayOut = await append(intArrayOut, await strToByteArray('</div>'));
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

/* Can check for exception as result like: if eq s/res dcDataNoResultException */

async function dcDataNoResultException() {
    await internalDebugStackEnter('dcDataNoResultException:exceptions'); let strReturn;


    strReturn = '89315802-d53d-4d11-ba5d-bf505e8ed454'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function excep(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('excep:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = false;
    /* Test for each exception type in turn (there's only one so far) */
    boolRes = await or(boolRes, await implEq(strTest, await dcDataNoResultException()));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function notExcep(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('notExcep:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excep(strTest));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function excOrEmpty(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('excOrEmpty:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = await or(await excep(strTest), await strEmpty(strTest));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function notExcOrEmpty(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('notExcOrEmpty:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excOrEmpty(strTest));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function strPrintArr(genericArrayInput) {
    await internalDebugCollect('genericArray Input = ' + genericArrayInput + '; '); await internalDebugStackEnter('strPrintArr:type-conversion'); await assertIsGenericArray(genericArrayInput); let strReturn;

    /* Hint: running this on a DcArray produces a sems document that can be turned back into a DcArray with dcarrParseSems strToByteArray s/str :) */
    let intCount = 0;
    intCount = await count(genericArrayInput);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (await implLt(intI, intCount)) {
        strOut = await implCat(strOut, await strFrom(await get(genericArrayInput, intI)));
        strOut = await implCat(strOut, ' ');
        intI = await implAdd(intI, 1);
    }

    strReturn = strOut; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function printArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('printArray:type-conversion'); await assertIsGenericArray(genericArrayIn); let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function printArr(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('printArr:type-conversion'); await assertIsGenericArray(genericArrayIn); let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charFromHexByte(strHexByte) {
    await internalDebugCollect('str HexByte = ' + strHexByte + '; '); await internalDebugStackEnter('charFromHexByte:type-conversion'); await assertIsStr(strHexByte); let strReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    await assertIsBaseStr(strHexByte, 16);
    let strRes = '';
    strRes = await charFromByte(await intFromBaseStr(strHexByte, 16));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToByteArray(strInput) {
    await internalDebugCollect('str Input = ' + strInput + '; '); await internalDebugStackEnter('strToByteArray:type-conversion'); await assertIsStr(strInput); let intArrayReturn;

    let intCount = 0;
    intCount = await len(strInput);
    let intI = 0;
    intI = 0;
    let intArrayOut = [];
    while (await implLt(intI, intCount)) {
        intArrayOut = await push(intArrayOut, await byteFromChar(await strChar(strInput, intI)));
        intI = await implAdd(intI, 1);
    }

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function strFromByteArray(intArrayInput) {
    await internalDebugCollect('intArray Input = ' + intArrayInput + '; '); await internalDebugStackEnter('strFromByteArray:type-conversion'); await assertIsIntArray(intArrayInput); let strReturn;

    /* Remember this will break if there are non-string bytes in it. */
    let intCount = 0;
    intCount = await count(intArrayInput);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (await implLt(intI, intCount)) {
        strOut = await implCat(strOut, await charFromByte(await get(intArrayInput, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strOut; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcaFromSems(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromSems:format-sems'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRet = [];
    /* Accepts an array of bytes of a SEMS format document. Returns an array of Dcs. */
    let strParserState = '';
    strParserState = 'dc';
    let strCurrentDc = '';
    strCurrentDc = '';
    let intContentLength = 0;
    intContentLength = await count(intArrayContent);
    let intByteOffset = 0;
    let intCurrentByte = 0;
    while (await implLt(intByteOffset, intContentLength)) {
        /* do something with each byte in the array. an/content[n/byteOffset], which is copied to n/currentByte, holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs. */
        intCurrentByte = await get(intArrayContent, intByteOffset);
        if (await implEq(strParserState, 'dc')) {
            if (await asciiIsDigit(intCurrentByte)) {
                strCurrentDc = await implCat(strCurrentDc, await charFromByte(intCurrentByte));
            }
            else if (await asciiIsSpace(intCurrentByte)) {
                intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
                strCurrentDc = '';
            }
            else if (await implEq(35, intCurrentByte)) {
                /* pound sign: start comment */
                if (await ne(0, await len(strCurrentDc))) {
                    /* Comment was not preceded by a space */
                    if (await implEq('true', await getSettingForFormat('sems', 'in', 'strict'))) {
                        await implDie('No trailing space present in sems format while importing. This is not allowed in strict mode.');
                    }
                    intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
                }
                intArrayRet = await push(intArrayRet, 246);
                strParserState = 'comment';
            }
            else {
                await implDie('Unexpected parser state in SEMS document.');
            }
        }
        else if (await implEq(strParserState, 'comment')) {
            if (await asciiIsNewline(intCurrentByte)) {
                intArrayRet = await push(intArrayRet, 248);
                strParserState = 'dc';
            }
            else {
                intArrayRet = await push(intArrayRet, await dcFromFormat('unicode', await anFromN(await firstCharOfUtf8String(await anSubset(intArrayContent, intByteOffset, -1)))));
            }
        }
        else {
            await implDie('Internal error: unexpected parser state while parsing SEMS document');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    if (await implEq(strParserState, 'comment')) {
        /* Document ended with a comment and no newline at the end */
        if (await ne(0, await len(strCurrentDc))) {
            await implDie('Internal error while parsing sems document: Unconsumed characters were left over when the end of the document was found.');
        }
        intArrayRet = await push(intArrayRet, 248);
    }
    elseif (await ne(0, await len(strCurrentDc))) {
        if (await implEq('true', await getSettingForFormat('sems', 'in', 'strict'))) {
            await implDie('No trailing space present in sems format while importing. This is not allowed in strict mode.');
        }
        /* Ended without a trailing space */
        intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToSems(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToSems:format-sems'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    /* TODO: Support SEMS comment roundtripping */
    let intArrayOut = [];
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    while (await implLt(intInputIndex, intLen)) {
        intArrayOut = await push(intArrayOut, await strToByteArray(await implCat(await strFrom(await get(intArrayDcIn, intInputIndex), ), ' ')));
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestsDcData(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsDcData:dc-data-tests'); await assertIsBool(boolV);

    await testing(boolV, 'dcData');
    await runTest(boolV, await implEq('B', await dcGetBidiClass(120)));

    await internalDebugStackExit();
}


// @license-end

// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

registerSpeedup('assertIsFalse', async function (bool) {
    if (bool === false) {
        return;
    }
    await assertionFailed(bool+' is true, but should be false.');
});

registerSpeedup('assertIsTrue', async function (bool) {
    if (bool === true) {
        return;
    }
    await assertionFailed(bool+' is not true.');
});

registerSpeedup('assertIsDc', async function (v) {
    if (await Number.isInteger(v) && v >= 0 && v <= 2147483647) {
        return true;
    }
    await assertIsTrue(false);
});

registerSpeedup('assertIsDcDataset', async function (str) {
    if (datasets.includes(str)) {
        return;
    }
    await assertIsTrue(false);
});

registerSpeedup('or', async function (a,b) {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a || b;
    }
    await assertIsBool(a); await assertIsBool(b);
});

registerSpeedup('isTrue', async function (bool) {
    if (bool === true) {
        // Can't simplify to if(bool) because non-bools might evaluate to true and give wrong result
        return true;
    }
    return false;
});

registerSpeedup('isFalse', async function (bool) {
    if (bool === false) {
        return true;
    }
    return false;
});

registerSpeedup('isIntArray', async function (val) {
    if (val === undefined) {
        await assertionFailed('isGenericArray called with non-StageL-supported argument type.'); /* Claim to fail the isGenericArray assertion here, because that's what would get called in the portable implementation. */
    }
    if (val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        return false;
    }
    function isIntSync(v) {
        return (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647);
    }
    return val.every(isIntSync);
});

registerSpeedup('assertIsIntArray', async function (val) {
    if (val === undefined) {
        await assertionFailed('isGenericArray called with non-StageL-supported argument type.'); /* Claim to fail the isGenericArray assertion here, because that's what would get called in the portable implementation. */
    }
    if (val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        await assertIsTrue(false);
    }
    function isIntSync(v) {
        return (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647);
    }
    if (val.every(isIntSync)) {
        return;
    }
    else {
        await assertIsTrue(false);
    }
});

registerSpeedup('ne', async function (genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    return genericA !== genericB;
});

registerSpeedup('le', async function (intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    return intA <= intB;
});

registerSpeedup('ge', async function (intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    return intA >= intB;
});

registerSpeedup('arrEq', async function (genericArrayA, genericArrayB) {
    if (((genericArrayA.constructor.name !== 'Uint8Array') && (genericArrayA.constructor.name !== 'Array')) || ((genericArrayB.constructor.name !== 'Uint8Array') && (genericArrayB.constructor.name !== 'Array'))) {
        await assertIsGenericArray(genericArrayA);
        await assertIsGenericArray(genericArrayB);
    }
    function countSync(array) {
        if (array.constructor.name === 'Uint8Array') {
            return array.byteLength;
        }
        return Object.keys(array).length;
    }
    let intCount = 0;
    intCount = countSync(genericArrayA);
    if (intCount !== countSync(genericArrayB)) {
        return false;
    }
    let genericElem;
    let intI = 0;
    while (intI < intCount) {
        genericElem = genericArrayA[intI];
        if (genericElem !== genericArrayB[intI]) {
            return false;
        }
        intI = intI + 1;
    }
    return true;
});

// @license-end
