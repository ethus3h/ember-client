async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    /* Test comment; semicolon */

    strReturn = await (str''); await assertIsStr(strReturn); return strReturn;
}
