async function f() {
    StageL_internalDebugStackEnter('f:in');

    let intCounter = 1;
    intCounter = StageL_Add(intCounter, 1);
    let strTemp = '';

    StageL_internalDebugStackExit();
}
