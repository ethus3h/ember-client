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

async function internalSetup() {
    // Set up environment variables.

    // Detect if we can create DOM nodes (otherwise we'll output to a terminal). This is used to provide getEnvironmentPreferredFormat.
    if (typeof window !== 'undefined') {
        haveDom = true;
    }
    let charset = document.characterSet.toLowerCase();
    if (charset === 'utf-8') {
        envCharEncoding = 'utf8';
    }
    else {
        await implWarn("Unimplemented character set: " + charset + ". Falling back to asciiSafeSubset.");
    }
    if (haveDom) {
        // Web browsers, etc.
        envPreferredFormat = 'html';
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
                alert("EITE reported an error! You may want to reload the page. The error was: Nonstring error message!");
                throw "Nonstring error message";
            }
            // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop — maybe??

            //await FIXMEUnimplemented("implError");
            await implWarn(strMessage);

            await console.trace();
            alert("EITE reported an error! You may want to reload the page. The error was: " + strMessage);
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
*/

async function implCat(strA, strB) {
    assertIsStr(strA); assertIsStr(strB); let strReturn;

    strReturn = strA + "" + strB; await assertIsStr(strReturn); return strReturn;
}

async function substring(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    strReturn = str.substring(intStart, intStart + intLength); await assertIsStr(strReturn); return strReturn;
}

async function len(str) {
    assertIsStr(str); let intReturn;

    intReturn = str.length; await assertIsInt(intReturn); return intReturn;
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
    if ((! Number.isInteger(int)) || typeof int === "undefined" || int === null || int < -2147483648 || int > 2147483647) {
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
    //alert("DbugStackEtner");
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

    boolReturn = genericA === genericB; await assertIsBool(boolReturn); return boolReturn;
}

async function implGt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    boolReturn = intA > intB; await assertIsBool(boolReturn); return boolReturn;
}

async function implLt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    boolReturn = intA < intB; await assertIsBool(boolReturn); return boolReturn;
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
        await implDie('The requested row '+rowNum+' is greater than the number of entries in the ' + dataset + ' dataset ('+dcData[dataset].length+').');
    }

    strReturn = dcData[dataset][rowNum][fieldNum]; await assertIsStr(strReturn); return strReturn;
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
    if(haveDom) {
        let htmlOutputRootElement = await document.getElementById('eiteDocumentRoot');
        htmlOutputRootElement.innerHTML = string;
        htmlOutputRootElement.scrollTop = htmlOutputRootElement.scrollHeight;
    }
    else {
        console.log(string);
    }
}

/* type-tools, provides:
    implIntBytearrayLength
*/

async function intBytearrayLength(bytearray) {
    assertIsBytearray(bytearray); let intReturn;

    intReturn = bytearray.byteLength; await assertIsInt(intReturn); return intReturn;
}


// @license-end
