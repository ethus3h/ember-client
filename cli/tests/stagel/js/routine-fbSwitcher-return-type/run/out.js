async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    if (await implEq(0await implMod(intNum, 15))) {
