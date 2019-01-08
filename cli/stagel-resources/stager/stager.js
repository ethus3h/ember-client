// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function asciiIsDigit(intN) {
    await internalDebugStackEnter('asciiIsDigit'); await internalDebugCollect('ident-n N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 48, 57);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsPrintable(intN) {
    await internalDebugStackEnter('asciiIsPrintable'); await internalDebugCollect('ident-n N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); let boolReturn;

