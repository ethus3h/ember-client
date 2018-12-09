// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
async function or(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await not(boolA);
    boolTemp = await not(await and(boolTemp, await not(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await not(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nand(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await not(await and(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function xor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await and(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function xnor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await not(await xor(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
// @license-end
