/* strings, provides:
    implCat
    implSubstr
*/

async function implCat(strA, strB) {
    assertIsStr(strA); assertIsStr(strB); let strReturn;

    strReturn = concat(strA, strB); await assertIsStr(strReturn); return strReturn;
}

async function implSubstr(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    strReturn = await implStrSubstring(str, intStart, intLength); await assertIsStr(strReturn); return strReturn;
}
