// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implStrFromByte
    implStrFromUnicodeHex
    implIntDcarrLength
    implIntBytearrayLength
    implIntFromStr
*/

async function strFromByte(intInput) {
    await assertIsInt(intInput);
    return await implStrFromByte(intInput)
}

async function strFromUnicodeHex(strInput) {
    await assertIsStr(strInput)
    return await implStrFromUnicodeHex(strInput);
}

async function intDcarrLength(dcarrInput) {
    return await implIntDcarrLength(dcarrInput);
}
async function intBytearrayLength(bytearrayInput) {
    return await implIntBytearrayLength(bytearrayInput);
}
async function intFromStr(str) {
    await assertIsStr(str);
    return await implIntFromStr(str);
}
