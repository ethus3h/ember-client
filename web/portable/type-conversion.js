// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntFromStr
    implStrFromByte
    implStrFromUnicodeHex
*/

async function intFromStr(str) {
    await assertIsStr(str); let intReturn;

    intReturn = await implIntFromStr(str); await assertIsInt(intReturn); return intReturn;
}

async function strFromByte(int) {
    await assertIsInt(int); let strReturn;

    strReturn = await implStrFromByte(int); await assertIsStr(strReturn); return strReturn;
}

async function strFromUnicodeHex(strInput) {
    await assertIsStr(strInput); let strReturn;

    if(/^[A-F0-9]+$/.test(strInput)) {
        strReturn = await implStrFromUnicodeHex(strInput);
    else {
        strReturn = strInput;
    }
    await assertIsStr(strReturn); return strReturn;
}

// @license-end
