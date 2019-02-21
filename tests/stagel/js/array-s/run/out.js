async function strFromByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('strFromByte:in'); await assertIsInt(intIn); let strReturn;

    let strArrayChars = [];
    strArrayChars = 