// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implAssertIsBool
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

async function assertIsBool(bool) {
    await implAssertIsBool(bool);
}

async function assertIsInt(int) {
    await implAssertIsInt(int);
}

async function assertIsStr(str) {
    await implAssertIsStr(str);
}

async function assertStrContainsOnlyInt(str) {
    await assertIsStr(str);
    await implAssertStrContainsOnlyInt(str);
}

async function assertIsDc(dc) {
    await assertStrContainsOnlyInt(dc);
}

// @license-end
