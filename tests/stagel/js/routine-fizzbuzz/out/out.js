async function fbSwitcher(intNum) {
    StageL_internalDebugCollect('int Num = ' + intNum + '; '); StageL_internalDebugStackEnter('fbSwitcher:in'); StageL_assertIsInt(intNum); let strReturn;

    if (StageL_eq(0, StageL_Mod(intNum, 15))) {
        /* just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL. */

        strReturn = 'FizzBuzz'; StageL_assertIsStr(strReturn); StageL_internalDebugStackExit(); return strReturn;
    }
    /* Comment */
    if (StageL_eq(0, StageL_Mod(intNum, 5))) {
        /* Comment 2 */

        strReturn = 'Buzz'; StageL_assertIsStr(strReturn); StageL_internalDebugStackExit(); return strReturn;
        /* Comment 3 */
    }
    if (/* Could also write it like this, with the condition on another line */

        StageL_eq(0, StageL_Mod(intNum, 3))) {
        /* Comment 4 */

        strReturn = 'Fizz'; StageL_assertIsStr(strReturn); StageL_internalDebugStackExit(); return strReturn;
    }
}

/* A string is an array of 8-bit bytes. */
async function fizzBuzz() {
    StageL_internalDebugStackEnter('fizzBuzz:in'); let strReturn;

    /* return-assert -n # the output should be non-empty. */
    let intCounter = 1;
    while (!(
        StageL_eq(intCounter, 100))) {
        intCounter = StageL_Add(intCounter, 1);
        let strTemp = '';
        strTemp = StageL_fbSwitcher(intCounter);

        strReturn = strTemp; StageL_assertIsStr(strReturn); StageL_internalDebugStackExit(); return strReturn;
    }
}
