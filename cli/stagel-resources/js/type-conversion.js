/* type-conversion, provides:
    implIntFromStr
    implStrFromByte
    implStrFromUnicodeHex
*/

async function implIntFromStr(str) {
    await assertIsStr(str); let intReturn;

    intReturn = parseInt(str); await assertIsInt(intReturn); return intReturn;
}

async function implStrFromByte(intInput) {
    await assertIsInt(intInput); let strReturn;

    strReturn = String.fromCharCode(intInput); await assertIsStr(strReturn); return strReturn;
}

async function implStrFromUnicodeHex(strCharacter) {
    await assertIsStr(strCharacter); let strReturn;

    strReturn = String.fromCharCode("0x" + strCharacter); await assertIsStr(strReturn); return strReturn;
}
