// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implAssertIsBool
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

// Assertions that something is a given type

async function implAssertIsBool(bool) {
    if (typeof bool !== "boolean") {
        await eiteError("Assertion failed: "+bool+" is not a boolean.")
    }
}

async function implAssertIsInt(int) {
    if (! Number.isInteger(int)) {
        await eiteError("Assertion failed: "+int+" is not an int.")
    }
}

async function implAssertIsStr(str) {
    if (typeof str !== "string") {
        await eiteError("Assertion failed: "+str+" is not a string.")
    }
}


// Other assertions

async function implAssertStrContainsOnlyInt(str) {
    await assertIsStr(str);

    //TODO: Fake implementation. Should regex match or something instead.
    eiteFIXMEUnimplemented("implAssertStrContainsOnlyInt");
    return await assertIsInt(await intFromStr(str));
}

// @license-end
