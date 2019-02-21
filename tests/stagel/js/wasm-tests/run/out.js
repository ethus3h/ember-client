
async function runTestsWasm(boolV, boolA) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugStackEnter('runTestsWasm:i'); await assertIsBool(boolV);await assertIsBool(boolA);

    await runTest(boolV, await implEq(, await wasmCall([ true, false ]'fortytwo')));
    await runTest(boolV, await implEq(, await wasmCallArrI([ 