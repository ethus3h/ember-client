// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntFromStr
    implStrFromByte
    implStrFromUnicodeHex
*/

async function implIntFromStr(str) {
    return parseInt(str);
}

async function implStrFromByte(intInput) {
    await assertIsInt(intInput);
    return String.fromCharCode(intInput);
}

async function implStrFromUnicodeHex(strCharacter) {
    await assertIsStr(strCharacter);
    return String.fromCharCode('0x'+strCharacter);
}
