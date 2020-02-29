async function f() {
    await internalDebugStackEnter('f:in');

    let intCounter = 1;
    intCounter = await Add(intCounter, 1);
    let strTemp = '';

    await internalDebugStackExit();
}
