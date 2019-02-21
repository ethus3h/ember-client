async function runTestsWasm(boolV, boolA) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugStackEnter('runTestsWasm:in'); await assertIsBool(boolV); await assertIsBool(boolA);

    await runTest(boolV, await implEq(42, await wasmCall('fortytwo', codegenArrayLiteral requested; returning [ true, false ]
[ true, false ]codegenArrayLiteral has been reset to: )));
    await runTest(boolV, await implEq(4, await wasmCallArrIn('add', codegenArrayLiteral requested; returning [ true, false ][ 2, 2 ]
[ true, false ][ 2, 2 ]codegenArrayLiteral has been reset to: )));

    await internalDebugStackExit();
}
