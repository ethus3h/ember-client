// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function or(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nand(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function xor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function xnor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await xor(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await implEq(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function ge(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function le(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function ngt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nlt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nge(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nle(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await le(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

// @license-end
