async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    /* Comment 2 */

    strReturn = 'Buzz'; await assertIsStr(strReturn); return strReturn;
 {
        /* Comment 3 */
    }
    if (    /* Could also write it like this, with the condition on another line */

        await implEq(0, await implMod(intNum, 3))) {
        /* Comment 4 */

        testReturn = 'Fizz'; await assertIsTest(testReturn); return testReturn;
    }
