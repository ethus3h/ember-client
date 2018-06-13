// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implStrFromByte
    implStrFromUnicodeHex
    implIntFromStr
*/

async function intFromStr(str) {
    await assertIsStr(str);
    return await implIntFromStr(str);
}

async function strFromByte(int) {
    await assertIsInt(int);
    return await implStrFromByte(int)
}

async function strFromUnicodeHex(strInput) {
    await assertIsStr(strInput)
    return await implStrFromUnicodeHex(strInput);
}
