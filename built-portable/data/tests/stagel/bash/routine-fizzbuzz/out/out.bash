async function fbSwitcher(intNum) {
    await internalDebugCollect('int Num = ' + intNum + '; '); await internalDebugStackEnter('fbSwitcher:in'); await assertIsInt(intNum); let strReturn;

    if (await Eq(0, await Mod(intNum, 15))) {
        /* just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL. */

        strReturn = 'FizzBuzz'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    /* Comment */
    if (await Eq(0, await Mod(intNum, 5))) {
        /* Comment 2 */

        strReturn = 'Buzz'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
        /* Comment 3 */
    }
    if (/* Could also write it like this, with the condition on another line */

        await Eq(0, await Mod(intNum, 3))) {
        /* Comment 4 */

        strReturn = 'Fizz'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
}

/* A string is an array of 8-bit bytes. */
async function fizzBuzz() {
    await internalDebugStackEnter('fizzBuzz:in'); let strReturn;

    /* return-assert -n # the output should be non-empty. */
    let intCounter = 1;
    while (!(
        await Eq(intCounter, 100))) {
        intCounter = await Add(intCounter, 1);
        let strTemp = '';
        strTemp = await fbSwitcher(intCounter);

        strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
}
