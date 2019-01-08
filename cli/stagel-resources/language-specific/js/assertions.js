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
