// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function asciiIsDigit(intN) {
    await implDebugStackEnter('asciiIsDigit'); await implDebugCollect('ident-n N; '); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 48, 57);

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function asciiIsPrintable(intN) {
    await implDebugStackEnter('asciiIsPrintable'); await implDebugCollect('ident-n N; '); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 32, 126);

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function asciiIsSpace(intN) {
    await implDebugStackEnter('asciiIsSpace'); await implDebugCollect('ident-n N; '); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intN, 32);

    