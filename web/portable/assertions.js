// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// Depends: implAssertIsInt implAssertIsStr implAssertStrContainsOnlyInt

async function assertIsInt(int) {
    return await implAssertIsInt(int);
}

async function assertIsStr(str) {
    return await implAssertIsStr(str);
}

async function assertIsDc(dc) {
    return await assertStrContainsOnlyInt(dc);
}
async function assertStrContainsOnlyInt(str) {
    await assertIsStr(str);
    return await implAssertStrContainsOnlyInt(str);
}
