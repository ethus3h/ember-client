async function or(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn = false;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
