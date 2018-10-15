async function intFromStr(str) {
    await assertIsStr(str); let intReturn;

    intReturn = await implIntFromStr(str); await assertIsInt(intReturn); return intReturn;
}
