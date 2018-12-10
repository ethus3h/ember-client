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

async function implMod(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let intReturn;

    intReturn = intA % intB; await assertIsInt(intReturn); return intReturn;
}
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implNewDcarr
    implDcCustomTypeDcarrDcAtPos
    implVoidCustomTypeDcarrPut
    implVoidCustomTypeDcarrPush
*/

Dcarrs = [];

async function implNewDcarr() {
    let dcarrReturn;

    Dcarrs[Dcarrs.length] = [];
    dcarrReturn = Dcarrs.length - 1; await assertIsDcarr(dcarrReturn); return dcarrReturn;
}

async function implDcCustomTypeDcarrDcAtPos(dcarr, intIndex) {
    await assertIsDcarr(dcarr); await assertIsInt(intIndex); let dcReturn;

    dcReturn = Dcarrs[dcarr][intIndex]; assertIsDc(dcReturn); return dcReturn;
}

async function implVoidCustomTypeDcarrPut(dcarr, intIndex, dcToAdd) {
    await assertIsDcarr(dcarr); await assertIsInt(intIndex); await assertIsDc(dcToAdd);

    Dcarrs[await dcarr][intIndex] = dcToAdd;
}

async function implVoidCustomTypeDcarrPush(dcarr, dcToAdd) {
    await assertIsDcarr(dcarr); await assertIsDc(dcToAdd);

    Dcarrs[await dcarr].push(dcToAdd);
}

// @license-end
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file defines functions with implementations that are specific to the JavaScript implementation of EITE.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.

async function implStrNormalizeMessage(message) {
    if (typeof message == "object") {
        return (JSON && JSON.stringify ? JSON.stringify(message) : message);
    } else {
        return message;
    }
}

// @license-end
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntBytearrayLength
    implIntDcarrLength
    implStrSubstring
*/

async function implIntBytearrayLength(bytearray) {
    assertIsBytearray(bytearray); let intReturn;

    intReturn = bytearray.byteLength; await assertIsInt(intReturn); return intReturn;
}

async function implIntDcarrLength(dcarr) {
    assertIsDcarr(dcarr); let intReturn;

    intReturn = Dcarrs[await dcarr].length; await assertIsInt(intReturn); return intReturn;
}

async function implStrSubstring(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    strReturn = str.substring(intStart, intStart + intLength); await assertIsStr(strReturn); return strReturn;
}

// @license-end
/* logging, provides:
    implDie
    implEiteLog
    implEiteFIXMEUnimplemented
*/

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    throw strMessage;
}

async function implEiteLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(await implStrNormalizeMessage(strMessage));
}

async function implEiteFIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await eiteLog("FIXME: Unimplemented in " + strLocation);
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
    implAssertIsBool
    implAssertIsTrue
    implAssertIsFalse
    implAssertIsInt
    implAssertIsStr
    implAssertIsDcarr
    implAssertIsBytearray
    implAssertStrContainsOnlyInt
*/

// Assertions that something is a given type

async function implAssertIsBool(bool) {
    if (typeof bool !== "boolean") {
        await eiteError("Assertion failed: "+bool+" is not a boolean.");
    }
}

async function implAssertIsTrue(bool) {
    await assertIsBool(bool);

    if (bool !== true) {
        await eiteError("Assertion failed: "+bool+" is not true.");
    }
}

async function implAssertIsFalse(bool) {
    await assertIsBool(bool);

    if (bool !== false) {
        await eiteError("Assertion failed: "+bool+" is not false.");
    }
}

async function implAssertIsInt(int) {
    if (! Number.isInteger(int)) {
        await eiteError("Assertion failed: "+int+" is not an int.");
    }
}

async function implAssertIsStr(str) {
    if (typeof str !== "string") {
        await eiteError("Assertion failed: "+str+" is not a string.");
    }
}

async function implAssertIsDcarr(dcarr) {
    await assertIsInt(dcarr);
    await assertIsTrue(dcarr >= 0);
    await assertIsTrue(dcarr < Dcarrs.length);
}

async function implAssertIsBytearray(bytearray) {
    await eiteFIXMEUnimplemented("implAssertIsBytearray");
}


// Other assertions

async function implAssertStrContainsOnlyInt(str) {
    await assertIsStr(str);

    //TODO: Fake implementation. Should regex match or something instead.
    await eiteFIXMEUnimplemented("implAssertStrContainsOnlyInt");
    return await assertIsInt(await intFromStr(str));
}
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntFromStr
    implStrFromByte
    implStrFromUnicodeHex
*/

async function implIntFromStr(str) {
    await assertIsStr(str); let intReturn;

    intReturn = parseInt(str); await assertIsInt(intReturn); return intReturn;
}

async function implStrFromByte(intInput) {
    await assertIsInt(intInput); let strReturn;

    strReturn = String.fromCharCode(intInput); await assertIsStr(strReturn); return strReturn;
}

async function implStrFromUnicodeHex(strCharacter) {
    await assertIsStr(strCharacter); let strReturn;

    strReturn = String.fromCharCode("0x" + strCharacter); await assertIsStr(strReturn); return strReturn;
}

// @license-end
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntDcDataDatasetLength
    implStrDcDataLookupById
    implStrDcDataLookupByValue
*/

async function implIntDcDataDatasetLength(strDataset) {
    assertIsStr(strDataset); let intReturn;

    intReturn = await dcData[strDataset].length; await assertIsInt(intReturn); return intReturn;
}

async function implStrDcDataLookupById(strDataset, intRowNumber, intFieldNumber) {
    await assertIsStr(strDataset); await assertIsInt(intRowNumber); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = dcData[strDataset][intRowNumber].data[0][intFieldNumber]; await assertIsStr(strReturn); return strReturn;
}

async function implStrDcDataLookupByValue(strDataset, intFilterField, strFilterValue, intDesiredField) {
    await assertIsStr(strDataset); await assertIsInt(intFilterField); await assertIsStr(strFilterValue); await assertIsInt(intDesiredField); let strReturn;

    console.log(strDataset, intFilterField, strFilterValue, intDesiredField, dcData);
    let intLength = await intDcDataDatasetLength(strDataset);
    // start at 1 to skip header row
    for (let intRow = 1; intRow < intLength; intRow++) {
        if(dcData[strDataset][intRow].data[0][intFilterField] === strFilterValue) {
            strReturn = dcData[strDataset][intRow].data[0][intDesiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    await assertIsStr(strReturn); return strReturn;
}

// @license-end

// @license-end
