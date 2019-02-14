// Eventually the WASM stuff should all be available in pure StageL (+ getFileFromPath to load it), and this file's contents used only as speedups.

async function internalWasmCall(strRoutine, intVal) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('int Val = ' + intVal + '; '); await internalDebugStackEnter('wasmCall:wasm'); await assertIsStr(strRoutine);await assertIsInt(intVal); let intReturn;

    let intRes = 0;
    intRes = await internalWasmCall(strRoutine, intVal);

    intReturn = ; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
    await nan/res();
}

async function internalWasmCallArrIn(strRoutine, intArrayVals) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('intArray Vals = ' + intArrayVals + '; '); await internalDebugStackEnter('wasmCallArrIn:wasm'); await assertIsStr(strRoutine);await assertIsIntArray(intArrayVals); let intReturn;

    let intRes = 0;
    intRes = await internalWasmCallArrIn(strRoutine, intVal);

    intReturn = ; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
    await nan/res();
}

async function internalWasmCallArrOut(strRoutine, intVal) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('int Val = ' + intVal + '; '); await internalDebugStackEnter('wasmCallArrOut:wasm'); await assertIsStr(strRoutine);await assertIsInt(intVal); let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrOut(strRoutine, intVal);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function internalWasmCallArrInOut(strRoutine, intArrayVals) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('intArray Vals = ' + intArrayVals + '; '); await internalDebugStackEnter('wasmCallArrInOut:wasm'); await assertIsStr(strRoutine);await assertIsIntArray(intArrayVals); let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrInOut(strRoutine, intVal);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
