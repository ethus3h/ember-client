// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntBytearrayLength
    implIntDcarrLength
    implStrSubstring
*/

esversion: 6;

async function boolIntIsBetween(intN, intA, intB) {
    assertIsInt(intN); assertIsInt(intA); assertIsInt(intB); let boolReturn;

    // Checks whether N is within the range A and B, including endpoints
    boolReturn = ( (intN - intA) * (intN - intB) ) <= 0; await assertIsBool(boolReturn); return boolReturn;
}

async function intBytearrayLength(bytearray) {
    assertIsBytearray(bytearray); let intReturn;

    intReturn = await implIntBytearrayLength(bytearray); await assertIsInt(intReturn); return intReturn;
}

async function intDcarrLength(dcarr) {
    assertIsDcarr(dcarr); let intReturn;

    intReturn = await implIntDcarrLength(dcarr); await assertIsInt(intReturn); return intReturn;
}

async function strSubstring(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    strReturn = await implStrSubstring(str, intStart, intLength); await assertIsStr(strReturn); return strReturn;
}

async function strCharAtPos(str, intIndex) {
    assertIsStr(str); assertIsInt(intIndex); let strReturn;

    strReturn = await strSubstring(str, intIndex, 1); await assertIsStr(strReturn); return strReturn;
}

// @license-end
