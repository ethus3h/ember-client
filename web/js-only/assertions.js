// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implAssertIsBool
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

async function implAssertIsBool(bool) {
    if (typeof bool !== "bool") {
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

async function implAssertStrContainsOnlyInt(str) {
    //TODO: Fake implementation. Should regex match or something instead.
    await assertIsStr(str);
    return await assertIsInt(await intFromStr(str));
}

// @license-end
