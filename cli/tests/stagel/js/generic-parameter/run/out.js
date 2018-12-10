async function or(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp;
    boolTemp = await not(boolA);
    boolTemp = await not(await and(boolTemp, await not(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
