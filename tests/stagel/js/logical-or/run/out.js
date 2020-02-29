async function or(boolA, boolB) {
    StageL_internalDebugCollect('bool A = ' + boolA + '; '); StageL_internalDebugCollect('bool B = ' + boolB + '; '); StageL_internalDebugStackEnter('or:in'); StageL_assertIsBool(boolA); StageL_assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = StageL_implNot(boolA);
    boolTemp = StageL_implNot(StageL_implAnd(boolTemp, StageL_implNot(boolB)));

    boolReturn = boolTemp; StageL_assertIsBool(boolReturn); StageL_internalDebugStackExit(); return boolReturn;
}
