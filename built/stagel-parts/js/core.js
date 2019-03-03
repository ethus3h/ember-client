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
    await eiteHostCall('setupIfNeeded');
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

    if(index < 0) {
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

    if (rowNum >= dcData[dataset].length) {
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

async function getImportSettings() {
    assertIsStrArray(importSettings);
    return importSettings;
}

async function getExportSettings() {
    assertIsStrArray(exportSettings);
    return exportSettings;
}

async function setImportSettings(strArrayNewSettings) {
    assertIsStrArray(strArrayNewSettings); window.importSettings=strArrayNewSettings;
}

async function setExportSettings() {
    assertIsStrArray(strArrayNewSettings); window.exportSettings=strArrayNewSettings;
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
