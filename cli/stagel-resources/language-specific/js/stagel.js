// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/* math, provides:
    implAdd
    implSub
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

async function implMod(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    intReturn = intA % intB; await assertIsInt(intReturn); return intReturn;
}
/* type-conversion, provides:
    intFromStr
    strFromByte
    strFromUnicodeHex
*/

async function intFromStr(str) {
    await assertStrContainsOnlyInt(str); let intReturn;

    intReturn = parseInt(str); await assertIsInt(intReturn); return intReturn;
}

async function strFromByte(intInput) {
    await assertIsInt(intInput); let strReturn;

    strReturn = String.fromCharCode(intInput); await assertIsStr(strReturn); return strReturn;
}

async function strFromUnicodeHex(strCharacter) {
    await assertIsStr(strCharacter); let strReturn;

    strReturn = String.fromCharCode("0x" + strCharacter); await assertIsStr(strReturn); return strReturn;
}

async function strFrom(input) {
    await assertIsGeneric(input); let strReturn;

    strReturn = String(input); await assertIsStr(strReturn); return strReturn;
}

async function byteFromChar(strInput) {
    await assertIsChar(strInput); let intReturn;

    intReturn = strInput.charCodeAt(0); await assertIsInt(intReturn); return intReturn;
}
/* arrays, provides:
    append
    get
    count
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsArray(array2); let arrayReturn;

    arrayReturn=array1.concat(array2); await assertIsArray(arrayReturn); return arrayReturn;
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
    STAGEL_DEBUG = 2;
}
let stagelDebugCallstack = [];
let stagelDebugCollection = "";

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

    await FIXMEUnimplemented("implError");
    await implWarn(strMessage);
}

async function implWarn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");

    await implLog(strMessage);
}

async function implLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(strMessage);
    if(await Object.keys(stagelDebugCallstack).length > 0) {
        await console.log("Previous message sent at: " + await internalDebugPrintStack());
    }
    else {
        await console.log("(Previous message sent from non-StageL code: no backtrace available.)");
    }
}

async function implDebug(strMessage, intLevel) {
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
        await implLog(strMessage);
        /* console.log(strMessage); */
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

    await console.log("Stack entry "+strBlockName);
    await console.log(stagelDebugCollection);
    await console.log(stagelDebugCallstack);
    await stagelDebugCallstack.push(strBlockName + " (" + await internalDebugFlush() + ")");

    await internalDebugQuiet("Entered block: " + await stagelDebugCallstack.slice(-1)[0], 2);
}

async function internalDebugStackExit() {
    if (await stagelDebugCallstack.slice(-1)[0] === undefined) {
        await implDie("Exited block, but no block on stack");
    }
    await internalDebugQuiet("Exited block: " + await stagelDebugCallstack.pop(), 3);
}

async function internalDebugPrintStack() {
    let i=0;
    let count;
    count = await Object.keys(stagelDebugCallstack).length;
    let result="";
    while (i<count) {
        /* FIXME: This could probably be optimized if it's problematically slow. */
        result = result + stagelDebugCallstack[i] + " ";
        i = i + 1;
    }
    return result;
}
/* booleans, provides:
    implAnd
    implNot
*/

async function implAnd(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    boolReturn = boolA && boolB; await assertIsBool(boolReturn); return boolReturn;
}

async function implNot(boolA) {
    assertIsBool(boolA); let boolReturn;

    boolReturn = !boolA; await assertIsBool(boolReturn); return boolReturn;
}
/* comparison, provides:
    implEq
    implGt
    implLt
*/

async function implEq(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    boolReturn = genericA == genericB; await assertIsBool(boolReturn); return boolReturn;
}

async function implGt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    boolReturn = intA > intB; await assertIsBool(boolReturn); return boolReturn;
}

async function implLt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    boolReturn = intA < intB; await assertIsBool(boolReturn); return boolReturn;
}
/* assertions, provides:
    assertIsBool
    assertIsTrue
    assertIsFalse
    assertIsInt
    assertIsStr
    assertIsDc
    assertIsDcarr
    assertIsBytearray
*/

// Assertions that something is a given type

async function assertIsBool(bool) {
    if (typeof bool !== "boolean" || typeof bool === "undefined" || bool === null) {
        await implDie("Assertion failed: "+bool+" is not a boolean.");
    }
}

async function assertIsTrue(bool) {
    await assertIsBool(bool);

    if (bool !== true) {
        await implDie("Assertion failed: "+bool+" is not true.");
    }
}

async function assertIsFalse(bool) {
    await assertIsBool(bool);

    if (bool !== false) {
        await implDie("Assertion failed: "+bool+" is not false.");
    }
}

async function assertIsInt(int) {
    return;
    if ((! Number.isInteger(int)) || typeof int === "undefined" || int === null || int < -2147483648 || int > 2147483647) {
        await implDie("Assertion failed: "+int+" is not an int, or is outside the currently allowed range of 32 bit signed (-2,147,483,648 to 2,147,483,647).");
    }
}

async function assertIsStr(str) {
    if (typeof str !== "string" || typeof str === "undefined" || str === null) {
        await implDie("Assertion failed: "+str+" is not a string.");
    }
}

async function assertIsGeneric(val) {
    if ((typeof val !== "string" && typeof val !== "boolean" && ! Number.isInteger(val)) || typeof val === "undefined" || val === null) {
        await implDie("Assertion failed: "+val+" cannot be used as a generic.");
    }
}

async function assertIsGenericArray(arr) {
    if ((! Array.isArray(arr)) || typeof arr === "undefined" || arr === null) {
        await implDie("Assertion failed: "+arr+" is not an array.");
    }
}

async function assertIsGenericItem(arr) {
    if ((! Array.isArray(arr)) || typeof arr === "undefined" || arr === null || (typeof val !== "string" && typeof val !== "boolean" && ! Number.isInteger(val)) || typeof val === "undefined" || val === null) {
        await implDie("Assertion failed: "+arr+" is not a generic item.");
    }
}

async function assertIsDcarr(dcarr) {
    await assertIsInt(dcarr);
    await assertIsTrue(dcarr >= 0);
    await assertIsTrue(dcarr < Dcarrs.length);
}

async function assertIsBytearray(bytearray) {
    await FIXMEUnimplemented("implAssertIsBytearray");
}
/* type-tools, provides:
    implIntBytearrayLength
    implIntDcarrLength
*/

async function intBytearrayLength(bytearray) {
    assertIsBytearray(bytearray); let intReturn;

    intReturn = bytearray.byteLength; await assertIsInt(intReturn); return intReturn;
}

async function intDcarrLength(dcarr) {
    assertIsDcarr(dcarr); let intReturn;

    intReturn = Dcarrs[await dcarr].length; await assertIsInt(intReturn); return intReturn;
}

// @license-end
