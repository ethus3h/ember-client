async function fbSwitcher(intNum) {
    StageL_internalDebugCollect('int Num = ' + intNum + '; '); StageL_internalDebugStackEnter('fbSwitcher:in'); StageL_assertIsInt(intNum); let strReturn;

    if (StageL_Eq(0, StageL_Mod(intNum, 15))) {
