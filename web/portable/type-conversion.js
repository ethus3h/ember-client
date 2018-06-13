// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntFromStr
    implStrFromByte
    implStrFromUnicodeHex
*/

async function intFromStr(str) {
    let intReturn;

    await assertIsStr(str);
    intReturn = await implIntFromStr(str); await assertIsInt(intReturn); return intReturn;
}

async function strFromByte(int) {
    let strReturn;

    await assertIsInt(int);
    strReturn = await implStrFromByte(int); await assertIsStr(strReturn); return strReturn;
}

async function strFromUnicodeHex(strInput) {
    let strReturn;

    await assertIsStr(strInput)
    return await implStrFromUnicodeHex(strInput); await assertIsStr(strReturn); return strReturn;
}

// @license-end
