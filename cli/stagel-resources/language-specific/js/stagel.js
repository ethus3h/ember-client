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
/* type-conversion, provides:
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
/* strings, provides:
    implCat
*/

async function implCat(strA, strB) {
    assertIsStr(strA); assertIsStr(strB); let strReturn;

    strReturn = concat(strA, strB); await assertIsStr(strReturn); return strReturn;
}
/* logging, provides:
    implDie
    implLog
    implEiteFIXMEUnimplemented
*/

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    throw strMessage;
}

async function implWarn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(await implStrNormalizeMessage(strMessage));
}

async function implLog(strMessage) {
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
/* type-tools, provides:
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
