async function assertIsInt(int) {
    return await implAssertIsInt(int);
}
async function assertIsStr(str) {
    return await implAssertIsStr(str);
}
async function assertIsDc(dc) {
    return await assertStrContainsOnlyInt(dc);
}
