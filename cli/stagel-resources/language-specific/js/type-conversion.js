/* type-conversion, provides:
    intFromStr
    strFromByte
    strFromUnicodeHex
*/

async function intFromStr(str) {
    await assertStrContainsOnlyInt(str); let intReturn;

    intReturn = parseInt(str); await assertIsInt(intReturn); return intReturn;
}

async function strFromByte(intInput) {
    await assertIsInt(intInput); let strReturn;

    strReturn = String.fromCharCode(intInput); await assertIsStr(strReturn); return strReturn;
}

async function strFromUnicodeHex(strCharacter) {
    await assertIsStr(strCharacter); let strReturn;

    // Bear in mind that StageL doesn't attempt to support Unicode.

    strReturn = String.fromCharCode("0x" + strCharacter); await assertIsStr(strReturn); return strReturn;
}

async function strFrom(input) {
    await assertIsGeneric(input); let strReturn;

    strReturn = String(input); await assertIsStr(strReturn); return strReturn;
}

async function byteFromChar(strInput) {
    await assertIsChar(strInput); let intReturn;

    intReturn = strInput.charCodeAt(0); await assertIsInt(intReturn); return intReturn;
}
