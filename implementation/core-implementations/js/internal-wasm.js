// Eventually the WASM stuff should all be available in pure StageL (+ getFileFromPath to load it), and this file's contents used only as speedups.

async function internalEiteReqWasmCall(strRoutine, giVal, returnsArray=false) {
    if (typeof giVal === 'number') {
        return window.eiteWasmModule.instance.exports[strRoutine](giVal);
    }
    else {
        
    }
}

async function internalWasmCall(strRoutine, intVal) {
    return await eiteHostCall('internalEiteReqWasmCall', [strRoutine, intVal]);
}

async function internalWasmCallNoArgs(strRoutine) {
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
