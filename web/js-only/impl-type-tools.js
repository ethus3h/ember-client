// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntBytearrayLength
    implIntDcarrLength
    implStrSubstring
*/

async function implIntBytearrayLength(bytearray) {
    assertIsBytearray(bytearray); let intReturn;

    intReturn = bytearray.byteLength; await assertIsInt(intReturn); return intReturn;
}

async function implIntDcarrLength(dcarr) {
    assertIsDcarr(dcarr); let intReturn;

    intReturn = dcarr.length; await assertIsInt(intReturn); return intReturn;
}

async function implStrSubstring(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    strReturn = str.substring(intStart, intStart + intLength); await assertIsStr(strReturn); return strReturn;
}

// @license-end
