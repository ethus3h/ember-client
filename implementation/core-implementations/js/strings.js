/* strings, provides:
    implCat
    substring
    len
*/

async function implCat(strA, strB) {
    assertIsStr(strA); assertIsStr(strB); let strReturn;

    return strA + "" + strB;
}

async function substring(str, intStart, intLength) {
    assertIsStr(str); assertIsInt(intStart); assertIsInt(intLength); let strReturn;

    return str.substring(intStart, intStart + intLength);
}

async function len(str) {
    assertIsStr(str); let intReturn;

    return str.length;
}

