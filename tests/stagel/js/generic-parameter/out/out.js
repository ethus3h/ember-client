async function ne(genericA, genericB) {
    StageL_internalDebugCollect('generic A = ' + genericA + '; '); StageL_internalDebugCollect('generic B = ' + genericB + '; '); StageL_internalDebugStackEnter('ne:in'); StageL_assertIsGeneric(genericA); StageL_assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = StageL_implNot(StageL_implEq(genericA, genericB));

    boolReturn = boolTemp; StageL_assertIsBool(boolReturn); StageL_internalDebugStackExit(); return boolReturn;
}
