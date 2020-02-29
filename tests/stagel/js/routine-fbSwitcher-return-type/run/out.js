async function fbSwitcher(intNum) {
    StageL_internalDebugCollect('int Num = ' + intNum + '; '); StageL_internalDebugStackEnter('fbSwitcher:in'); StageL_assertIsInt(intNum); let strReturn;

    if (StageL_eq(0, StageL_mod(intNum, 15))) {

        strReturn = 'Buzz'; StageL_assertIsStr(strReturn); StageL_internalDebugStackExit(); return strReturn;
    }
}
