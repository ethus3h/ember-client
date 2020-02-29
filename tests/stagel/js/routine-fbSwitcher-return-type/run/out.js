async function fbSwitcher(intNum) {
    StageL_internalDebugCollect('int Num = ' + intNum + '; '); StageL_internalDebugStackEnter('fbSwitcher:in'); StageL_assertIsInt(intNum); let strReturn;

    if (StageL_implEq(0, StageL_implMod(intNum, 15))) {

        strReturn = 'Buzz'; StageL_assertIsStr(strReturn); StageL_internalDebugStackExit(); return strReturn;
    }
}
