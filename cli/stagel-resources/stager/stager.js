// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function isByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('isByte:type-tools'); await assertIsInt(intIn); let boolReturn;

    let boolRes = false;
    boolRes = await intIsBetween(intIn, 0, 255);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isChar(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isChar:type-tools'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await isCharByte(await byteFromChar(strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isCharByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('isCharByte:type-tools'); await assertIsInt(intIn); let boolReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    let boolRes = false;
    boolRes = await intIsBetween(intIn, 32, 126);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}
