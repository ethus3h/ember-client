async function ne(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    let boolTemp;
    boolTemp = await implNot(await implEq(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
