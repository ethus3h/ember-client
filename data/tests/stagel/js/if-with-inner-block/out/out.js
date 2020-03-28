async function test(intNum) {
    StageL_internalDebugCollect('int Num = ' + intNum + '; '); StageL_internalDebugStackEnter('test:in'); StageL_assertIsInt(intNum); let boolReturn;

    if (StageL_eq(0, StageL_mod(intNum, 3))) {
        let boolOut = false;
        boolOut = StageL_eq(0, 0);

        boolReturn = boolOut; StageL_assertIsBool(boolReturn); StageL_internalDebugStackExit(); return boolReturn;
    }
}
