async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    if (await implEq(0, await implMod(intNum, 15))) {

        testReturn = 'Buzz'; await assertIsTest(testReturn); return testReturn;
    }
}
