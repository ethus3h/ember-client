// Eventually the WASM stuff should all be available in pure StageL (+ getFileFromPath to load it), and this file's contents used only as speedups.

async function internalEiteReqWasmCall(strRoutine, giVal, returnsArray=false) {
    let func=getWindowOrSelf().eiteWasmModule.instance.exports[strRoutine];
    if (giVal === null) {
        return func();
    }
    else if ((typeof giVal === 'number') && (!returnsArray)) {
        return func(giVal);
    }
    else {
        // Either it returns an array, it has an array argument, or both.
    }
}

async function internalWasmCall(strRoutine, intVal) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intVal, false]);
}

async function internalWasmCallNoArgs(strRoutine) {
    // Only returns an int
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, null, false]);
}

async function internalWasmCallArrIn(strRoutine, intArrayVals) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intArrayVals, false]);
}

async function internalWasmCallArrOut(strRoutine, intVal) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intVal, true]);
}

async function internalWasmCallArrInOut(strRoutine, intArrayVals) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intArrayVals, true]);
}
