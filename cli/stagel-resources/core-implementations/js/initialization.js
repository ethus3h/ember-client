async function internalSetup() {
    assertIsDcDataset(dataset); let intReturn;

    intReturn = await dcData[dataset].length; await assertIsInt(intReturn); return intReturn;
}
