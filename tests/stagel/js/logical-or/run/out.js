async function or(boolA, boolB) {
    StageL_internalDebugCollect('bool A = ' + boolA + '; '); StageL_internalDebugCollect('bool B = ' + boolB + '; '); StageL_internalDebugStackEnter('or:in'); StageL_assertIsBool(boolA); StageL_assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = StageL_Not(boolA);
    boolTemp = StageL_Not(StageL_And(boolTemp, StageL_Not(boolB)));

    boolReturn = boolTemp; StageL_assertIsBool(boolReturn); StageL_internalDebugStackExit(); return boolReturn;
}
