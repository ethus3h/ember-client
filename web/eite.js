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
    await assertFailed('An error was encountered loading the requested document.');
}

// Implementations of routines provided in public-interface.stagel.

async function internalRunDocument(execId) {
    await assertIsExecId(execId);

    let events = [];
    events = await getDesiredEventNotifications(execId);

    // FIXME: Make this not just be converting the document and dumping it out.
    let strTargetFormat;
    strTargetFormat = await getEnvironmentPreferredFormat();
    await implDoRenderIo(await dcarrConvertDocument(await dcarrParseSems(await strToByteArray(strArrayDocumentExecData[execId])), strTargetFormat, await implGetEnvironmentRenderTraits(strTargetFormat)), strTargetFormat);
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

// Global variables

let haveDom = false;
let datasets = []; // as
let datasetsLoaded = false;
let dcData = []; // an
let strArrayDocumentExecData = []; // as
let intArrayDocumentExecPtrs = []; // an
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
            }/*,
            error: async function(results, file) {
                await implError("Error reported while parsing "+dataset+"!");
            }*/
        });
    }
    datasetsLoaded = true;
}

/* arrays, provides:
    append
    get
    count
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsGenericItem(array2); let arrayReturn;

    arrayReturn=array1.concat(array2); await assertIsArray(arrayReturn); return arrayReturn;
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

async function count(array) {
    await assertIsArray(array); let intReturn;

    intReturn=Object.keys(array).length; await assertIsInt(intReturn); return intReturn;
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

var STAGEL_DEBUG;
if (STAGEL_DEBUG === undefined) {
    STAGEL_DEBUG = 0;
}
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

async function dcDatasetLength(dataset) {
    assertIsDcDataset(dataset); let intReturn;

    intReturn = await dcData[dataset].length; await assertIsInt(intReturn); return intReturn;
}

async function dcDataLookupById(dataset, rowNum, fieldNum) {
    await assertIsDcDataset(dataset); await assertIsInt(rowNum); await assertIsInt(fieldNum); let strReturn;

    strReturn = dcData[dataset][rowNum].data[0][fieldNum]; await assertIsStr(strReturn); return strReturn;
}

async function dcDataLookupByValue(dataset, filterField, genericFilterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsGeneric(genericFilterValue); await assertIsInt(desiredField); let strReturn;

    let intLength = await dcDatasetLength(dataset);
    // start at 1 to skip header row
    let filterValue = await strFrom(genericFilterValue);
    for (let row = 1; row < intLength; row++) {
        if(dcData[dataset][row].data[0][filterField] === filterValue) {
            strReturn = dcData[dataset][row].data[0][desiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    //await console.log("SEARCHING", dataset, filterField, genericFilterValue, desiredField, dcData);
    // If nothing was found, return this UUID.
    strReturn="89315802-d53d-4d11-ba5d-bf505e8ed454"; await assertIsStr(strReturn); return strReturn;
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

async function bitAnd(byteA, byteB) {
    await assertIsByte(byteA); await assertIsByte(byteB); let byteReturn;

    byteReturn = await internalBitwiseMask(byteA & byteB);

    await assertIsByte(byteReturn); return byteReturn;
}

async function bitNot(byteA) {
    await assertIsByte(byteA); let byteReturn;

    byteReturn = await internalBitwiseMask(~byteA);
    await assertIsByte(byteReturn); return byteReturn;
}

async function bitLshift(byteA, intPlaces) {
    await assertIsByte(byteA); await assertIsInt(intPlaces); let byteReturn;

    await assertIsBetween(intPlaces, 0, 8);

    byteReturn = await internalBitwiseMask(byteA << intPlaces);

    await assertIsByte(byteReturn); return byteReturn;
}

async function bitRshift(byteA, intPlaces) {
    await assertIsByte(byteA); await assertIsInt(intPlaces); let byteReturn;

    await assertIsBetween(intPlaces, 0, 8);

    byteReturn = await internalBitwiseMask(byteA >>> intPlaces); /* >>> is needed in JavaScript to make it fill zeroes behind it. >> does something else. */

    await assertIsByte(byteReturn); return byteReturn;
}

// Internal function

async function internalBitwiseMask(int32input) {
    let byteReturn;
    let byteMask;
    byteMask = 255;
    byteReturn = int32input & byteMask; /* zero out all but the least significant bits, which are what we want */
    return byteReturn;
}

async function getEnvironmentPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    if (haveDom) {
        return 'HTML';
    }
    return 'immutableCharacterCells';
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


async function strChar(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strChar:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strCharAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strCharAtPos:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAtPos:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

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

async function listDcDatasets() {
    await internalDebugStackEnter('listDcDatasets:dc-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'DcData', 'mappings/from/ascii', 'mappings/from/unicode', 'mappings/to/html' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isDcDataset(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isDcDataset:dc-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listDcDatasets(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcGetField(intDc, intFieldNumber) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugCollect('int FieldNumber = ' + intFieldNumber + '; '); await internalDebugStackEnter('dcGetField:dc-data'); await assertIsInt(intDc);await assertIsInt(intFieldNumber); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcDataLookupById('DcData', await implAdd(intDc, 1), intFieldNumber);

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

async function contains(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('contains:arrays'); await assertIsGenericArray(genericArrayIn);await assertIsGeneric(genericValue); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implEq(genericElem, genericValue)) {

            boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isIntArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isIntArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isInt(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isStrArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isStrArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isStr(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBoolArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isBoolArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isBool(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isCharArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isCharArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isChar(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isByteArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isByteArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isByte(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isDcArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isDcArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let genericElem;
    while (await ge(intCount, 0)) {
        intCount = await implSub(intCount, 1);
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isDc(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intDcarrLength(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('intDcarrLength:arrays'); await assertIsIntArray(intArrayIn); let intReturn;

    let intRes = 0;
    intRes = await count(intArrayIn);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitOr(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitOr:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(intByte1);
    intTemp = await bitNot(await bitAnd(intTemp, await bitNot(intByte2)));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitNor(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitNor:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(await bitOr(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitNand(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitNand:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(await bitAnd(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitXor(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitXor:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNand(intByte1, intByte2);
    intTemp = await bitAnd(intTemp, await bitOr(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitXnor(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitXnor:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(await bitXor(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}


async function or(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('or:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nor:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nand(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nand:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xor:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xnor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xnor:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

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
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('assertContains:assertions'); await assertIsGenericArray(genericArrayIn);await assertIsGeneric(genericValue);

    await assertIsTrue(await contains(genericArrayIn, genericValue));
    await internalDebugStackExit();
}

async function assertIsByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsByte:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isByte(intIn));
    await internalDebugStackExit();
}

async function assertIsArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('assertIsArray:assertions'); await assertIsGenericArray(genericArrayIn);

    /* Just a convenience wrapper */
    await assertIsGenericArray(genericArrayIn);
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
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseDigit:assertions'); await assertIsStr(strIn);await assertIsInt(intB);

    await assertIsTrue(await isBaseDigit(strIn, intB));
    await internalDebugStackExit();
}

async function assertIsBaseStr(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseStr:assertions'); await assertIsStr(strIn);await assertIsInt(intB);

    await assertIsTrue(await isBaseStr(strIn, intB));
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
    await alert('wtf 3'+genericItemIn);
    await console.log('fuck');
    await console.log(genericItemIn);

    await assertIsTrue(await isStrArray(genericItemIn));
    await internalDebugStackExit();
}

async function assertIsCharArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsCharArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isCharArray(genericItemIn));
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

    await assertIsTrue(await isSupportedInputFormat(strIn));
    await internalDebugStackExit();
}

async function assertIsSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedOutputFormat:assertions'); await assertIsStr(strIn);

    await assertIsTrue(await isSupportedOutputFormat(strIn));
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
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndRun:public-interface'); await assertIsStr(strFormat);await assertIsStr(strPath);

    /* Load and run the specified document. Does not return while the document is still running. */
    await runDocument(await loadStoredDocument(strFormat, strPath));
    await internalDebugStackExit();
}
/* If you want to convert a document to another format, you can call loadAndConvert with the format of the document, its location, and the format you want the results in. */

async function loadAndConvert(strInputFormat, strPath, strOutputFormat) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugStackEnter('loadAndConvert:public-interface'); await assertIsStr(strInputFormat);await assertIsStr(strPath);await assertIsStr(strOutputFormat);

    /* Load the specified document, and return it converted to the specified outputFormat. */
    await convertDocument(await loadStoredDocument(strInputFormat, strPath));
    await internalDebugStackExit();
}
/* To operate on a document you already have as a Dc array, you can call runDocument or convertDocument directly on it. */

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

async function convertDocument(intArrayContents, strFormat) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('convertDocument:public-interface'); await assertIsIntArray(intArrayContents);await assertIsStr(strFormat); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Convert a document to the specified format, and return it as an array of bytes. */
    await setupIfNeeded();
}
/* If you want more control over the document loading and execution, you can use these lower-level functions. */

async function loadStoredDocument(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadStoredDocument:public-interface'); await assertIsStr(strFormat);await assertIsStr(strPath); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Load and return the specified document as a Dc array. */
    await setupIfNeeded();
    let intArrayRes = [];
    intArrayRes = await convertToDcArray(strFormat, await getFileFromPath(strPath));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function convertToDcArray(strFormat, intArrayContents) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('convertToDcArray:public-interface'); await assertIsStr(strFormat);await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Parse and return the specified document as a Dc array. */
    await setupIfNeeded();
    let intArrayRes = [];
    intArrayRes = await dcarrParseDocument(strFormat, intArrayContents);

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
    await alert('wtf');

    /* Return list of event types (e.g. keystrokes, mouse movement, elapsed time) that the document wants to be notified of. */
    let strArrayRes = [];

    strArrayReturn = strArrayRes; 
    console.log(strArrayReturn);
    await assertIsStrArray(strArrayReturn);     await alert('wtf 2');
await internalDebugStackExit(); return strArrayReturn;
}

async function sendEvent(intExecId, intArrayEventData) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('intArray EventData = ' + intArrayEventData + '; '); await internalDebugStackEnter('sendEvent:public-interface'); await assertIsInt(intExecId);await assertIsIntArray(intArrayEventData); let intArrayReturn;

    /* Send the provided event or events data to the specified document. */
}

async function getDocumentFrame(intExecId, strFormat) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getDocumentFrame:public-interface'); await assertIsInt(intExecId);await assertIsStr(strFormat); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Return the most recently available output for the given document in the requested format. */
}

/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(genericA, genericB) {
    await internalDebugCollect('generic A = ' + genericA + '; '); await internalDebugCollect('generic B = ' + genericB + '; '); await internalDebugStackEnter('ne:comparison'); await assertIsGeneric(genericA);await assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ge:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function le(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('le:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ngt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ngt:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nlt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nlt:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nge:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nle(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nle:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

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

async function listInputFormats() {
    await internalDebugStackEnter('listInputFormats:formats'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'sems' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedInputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedInputFormat:formats'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listInputFormats(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listOutputFormats() {
    await internalDebugStackEnter('listOutputFormats:formats'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'integerList', 'immutableCharacterCells', 'HTML' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedOutputFormat:formats'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listOutputFormats(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
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

async function dcIsNewline(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsNewline:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    if (await implEq('b', await dcGetBidiClass(intDc))) {

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

async function dcarrParseDocument(strFormat, intArrayContent) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcarrParseDocument:format-dc'); await assertIsStr(strFormat);await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRet = [];
    if (await implEq(strFormat, 'sems')) {
        intArrayRet = await dcarrParseSems(intArrayContent);
    }
    else {
        await implError(await implCat('Unimplemented document parsing format: ', strFormat));
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function printableDcToChar(intDc, strTargetFormat) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugCollect('str TargetFormat = ' + strTargetFormat + '; '); await internalDebugStackEnter('printableDcToChar:format-dc'); await assertIsInt(intDc);await assertIsStr(strTargetFormat); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    let boolTemp = false;
    boolTemp = await implEq(strTargetFormat, 'ASCII-safe-subset');
    if (await or(boolTemp, await implEq(strTargetFormat, 'UTF-8'))) {
        strRes = await charFromHexByte(await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0));

        strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else if (await implEq(strTargetFormat, 'HTML')) {
        strRes = await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0);
        if (await isBaseStr(strRes, 16)) {
            strRes = await charFromHexByte(strRes);
        }
        else {
            strRes = await dcDataLookupByValue('mappings/to/html', 0, intDc, 1);
        }

        strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else {
        await implDie(await implCat('Unimplemented target format: ', strTargetFormat));
    }
    /* Return an empty string if the Dc isn't printable. I don't think it should be an error probably to call this for a nonprintable Dc, although the name might imply otherwise? (possible FIXME) */

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function isNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('isNonnegative:math'); await assertIsInt(intIn); let boolReturn;

    if (await implLt(intIn, 0)) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intIsBetween(intN, intA, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intIsBetween:math'); await assertIsInt(intN);await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

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
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intFromBaseStr:math'); await assertIsStr(strN);await assertIsInt(intB); let intReturn;

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

async function intToBaseStr(intN, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intToBaseStr:math'); await assertIsInt(intN);await assertIsInt(intB); let strReturn;

    /* Returns a string representing n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    let strRes = '';
    while (await implGt(intN, 0)) {
        strRes = await implCat(strRes, await intToBase36Char(await implMod(intN, intB)));
        intN = await implDiv(intN, intB);
    }
    strRes = await reverseStr(strRes);
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
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseDigit:math'); await assertIsStr(strIn);await assertIsInt(intB); let boolReturn;

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
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseStr:math'); await assertIsStr(strIn);await assertIsInt(intB); let boolReturn;

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

async function charFromHexByte(strHexByte) {
    await internalDebugCollect('str HexByte = ' + strHexByte + '; '); await internalDebugStackEnter('charFromHexByte:type-conversion'); await assertIsStr(strHexByte); let strReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    await assertIsBaseStr(strHexByte, 16);
    let strRes = '';
    strRes = await charFromByte(await intFromBaseStr(strHexByte, 16));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToByteArray(strInput) {
    await internalDebugCollect('str Input = ' + strInput + '; '); await internalDebugStackEnter('strToByteArray:type-conversion'); await assertIsStr(strInput); let strReturn;

    let intCount = 0;
    intCount = await len(genericArrayInput);
    let intI = 0;
    intI = 0;
    let intArrayOut = [];
    while (await implLt(intI, intCount)) {
        intArrayOut = await push(intArrayOut, await strChar(strInput, intI));
        intI = await implAdd(intI, 1);
    }

    strReturn = intArrayOut; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcarrParseSems(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcarrParseSems:format-sems'); await assertIsIntArray(intArrayContent); let intArrayReturn;

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
        /* do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs. */
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
                strParserState = 'comment';
            }
            else {
                await implDie('Unexpected parser state in SEMS document.');
            }
        }
        else if (await implEq(strParserState, 'comment')) {
            if (await asciiIsNewline(intCurrentByte)) {
                strParserState = 'dc';
            }
            else {
                /* Do nothing: comments are ignored */
            }
        }
        else {
            await implDie('Internal error: unexpected parser state while parsing SEMS document');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}


// @license-end

async function assertIsFalse(bool) {
    if (bool === false) {
        return;
    }
    await assertionFailed(bool+' is true, but should be false.');
}

async function assertIsTrue(bool) {
    if (bool === true) {
        return;
    }
    await assertionFailed(bool+' is not true.');
}

async function assertIsDc(v) {
    if (await Number.isInteger(v) && v >= 0 && v <= 2147483647) {
        return true;
    }
    await assertIsTrue(false);
}

async function assertIsDcDataset(str) {
    if (datasets.includes(str)) {
        return;
    }
    await assertIsTrue(false);
}

async function or(a,b) {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a || b;
    }
    await assertIsBool(a); await assertIsBool(b);
}

async function isTrue(bool) {
    if (bool === true) {
        // Can't simplify to if(bool) because non-bools might evaluate to true and give wrong result
        return true;
    }
    return false;
}

async function isFalse(bool) {
    if (bool === false) {
        return true;
    }
    return false;
}
