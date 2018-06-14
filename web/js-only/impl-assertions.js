// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
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

// @license-end
