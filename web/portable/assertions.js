// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implAssertIsBool
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

// Assertions that something is a given type

async function assertIsBool(bool) {
    await implAssertIsBool(bool);
}

async function assertIsTrue(bool) {
    await assertIsBool(bool);

    await implAssertIsTrue(bool);
}

async function assertIsInt(int) {
    await implAssertIsInt(int);
}

async function assertIsStr(str) {
    await implAssertIsStr(str);
}

async function assertIsDc(dc) {
    await assertStrContainsOnlyInt(dc);
}

async function assertIsDcarr(dcarr) {
    await implAssertIsDcarr(dcarr);
}

async function assertIsBytearray(bytearray) {
    await implAssertIsBytearray(bytearray);
}


// Other assertions

async function assertStrContainsOnlyInt(str) {
    await assertIsStr(str);

    await implAssertStrContainsOnlyInt(str);
}

// @license-end
