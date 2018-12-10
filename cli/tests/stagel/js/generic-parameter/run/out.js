async function ne(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await implEq(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
