/* strings, provides:
    implCat
*/

async function implCat(strA, strB) {
    assertIsStr(strA); assertIsStr(strB); let strReturn;

    strReturn = concat(strA, strB); await assertIsStr(strReturn); return strReturn;
}
