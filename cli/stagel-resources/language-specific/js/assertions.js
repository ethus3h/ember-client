/* assertions, provides:
    assertIsBool
    assertIsTrue
    assertIsFalse
    assertIsInt
    assertIsStr
    assertIsDcarr
    assertIsBytearray
    assertStrContainsOnlyInt
*/

// Assertions that something is a given type

async function assertIsBool(bool) {
    if (typeof bool !== "boolean") {
        await implError("Assertion failed: "+bool+" is not a boolean.");
    }
}

async function assertIsTrue(bool) {
    await assertIsBool(bool);

    if (bool !== true) {
        await implError("Assertion failed: "+bool+" is not true.");
    }
}

async function assertIsFalse(bool) {
    await assertIsBool(bool);

    if (bool !== false) {
        await implError("Assertion failed: "+bool+" is not false.");
    }
}

async function assertIsInt(int) {
    if (! Number.isInteger(int)) {
        await implError("Assertion failed: "+int+" is not an int.");
    }
}

async function assertIsStr(str) {
    if (typeof str !== "string") {
        await implError("Assertion failed: "+str+" is not a string.");
    }
}

async function assertIsGeneric(val) {
    if (typeof val !== "string" && typeof val !== "boolean" && ! Number.isInteger(int)) {
        await implError("Assertion failed: "+val+" cannot be used as a generic.");
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


// Other assertions

async function assertStrContainsOnlyInt(str) {
    await assertIsStr(str);

    //TODO: Fake implementation. Should regex match or something instead.
    await FIXMEUnimplemented("implAssertStrContainsOnlyInt");
    return await assertIsInt(await intFromStr(str));
}
