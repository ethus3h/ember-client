
async function fbSwitcher(intNum) {
    await internalDebugCollect('int Num = ' + intNum + '; '); await internalDebugStackEnter('fbSwitcher:i'); await assertIsInt(intNum); let strReturn;

    if (await implEq(, await implMod(intNum, ))) {
        await retur('Buzz');
    }
}
