async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    if (await implEq(0, await implMod(intNum, 15))) {

        strReturn = 'FizzBuzz'; await assertIsStr(strReturn); return strReturn;
);
        /* just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL. */
    }
    /* Comment */
    if (await implEq(0, await implMod(intNum, 5))) {

        strReturn = 'Buzz'; await assertIsStr(strReturn); return strReturn;
);
        /* Comment 2 */
        /* Comment 3 */
    }
    if (/* Could also write it like this, with the condition on another line */

        await implEq(0, await implMod(intNum, 3))) {

        strReturn = 'Fizz'; await assertIsStr(strReturn); return strReturn;
);
        /* Comment 4 */
    }
}
