async function ne(genericArrayA, genericItemB) {
    StageL_internalDebugCollect('genericArray A = ' + genericArrayA + '; '); StageL_internalDebugCollect('genericItem B = ' + genericItemB + '; '); StageL_internalDebugStackEnter('ne:in'); StageL_assertIsGenericArray(genericArrayA); StageL_assertIsGenericItem(genericItemB); let boolReturn;

    let boolTemp = false;
    boolTemp = StageL_implNot(StageL_implEq(genericArrayA, genericItemB));

    boolReturn = boolTemp; StageL_assertIsBool(boolReturn); StageL_internalDebugStackExit(); return boolReturn;
}
