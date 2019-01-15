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
        return true;
    }
    await assertionFailed(bool+' is not a boolean.');
}

/* TODO: move assertIsTrue/assertIsFalse to StageR once bool literals are available */
async function assertIsTrue(bool) {
    await assertIsBool(bool);

    if (bool !== true) {
        await assertionFailed(bool+' is not true.');
    }
}

async function assertIsFalse(bool) {
    await assertIsBool(bool);

    if (bool !== false) {
        await assertionFailed(bool+' is not false.');
    }
}

async function isInt(int) {
    if (await Number.isInteger(v) && v >= -2147483648 && v <= 2147483647) {
        return true;
    }
    return false;
}

async function assertIsInt(int) {
    if (await Number.isInteger(v) && v >= -2147483648 && v <= 2147483647) {
        return true;
    }
    await assertionFailed(int+" is not an int, or is outside the currently allowed range of 32 bit signed (-2,147,483,648 to 2,147,483,647).");
}

async function isStr(str) {
    if (typeof str === 'string') {
        return true;
    }
    return false;
}

async function assertIsStr(str) {
    if (typeof str === 'string' && str !== null) {
        return true;
    }
    await assertionFailed(str+" is not a string.");
}

async function isGeneric(val) {
    // We have to do isGeneric in native code because otherwise the assertion at the start of the function would call it.
    if (! (await isStr(val) || await isInt(val) || await isBool(val))) {
        return false;
    }
    return true;
}

async function assertIsGeneric(val) {
    if (!await isGeneric(val)) {
        await assertionFailed(val+" cannot be used as a generic.");
    }
}

async function isGenericArray(val) {
    if (val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        return false;
    }
    function isGenericSync(v) {
        return (v !== null && (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && typeof v === 'number' && v >= -2147483648 && v <= 2147483647)));
    }
    return val.every(isGenericSync);
}

async function assertIsGenericArray(val) {
    if (!await isGenericArray(val)) {
        await assertionFailed(val+" cannot be used as a generic array.");
    }
}

async function isGenericItem(val) {
    if (! (await isGeneric(val) || await isGenericArray(val))) {
        return false;
    }
    return true;
}

async function assertIsGenericItem(val) {
    if (!await isGenericItem(val)) {
        await assertionFailed(val+" cannot be used as a generic item.");
    }
}

async function assertionFailed(message) {
    await implDie("Assertion failed: "+message);
}
