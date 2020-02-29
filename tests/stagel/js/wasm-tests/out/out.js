async function runTestsWasm(boolV, boolA) {
    StageL_internalDebugCollect('bool V = ' + boolV + '; '); StageL_internalDebugCollect('bool A = ' + boolA + '; '); StageL_internalDebugStackEnter('runTestsWasm:in'); StageL_assertIsBool(boolV); StageL_assertIsBool(boolA);

    StageL_runTest(boolV, StageL_implEq(42, StageL_wasmCall('fortytwo', [ true, false ])));
    StageL_runTest(boolV, StageL_implEq(4, StageL_wasmCallArrIn('add', [ 2, 2 ])));

    StageL_internalDebugStackExit();
}
