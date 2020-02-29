async function fbSwitcher(intNum) {
    await internalDebugCollect('int Num = ' + intNum + '; '); await internalDebugStackEnter('fbSwitcher:in'); await assertIsInt(intNum); let strReturn;

    if (await Eq(0, await Mod(intNum, 15))) {

        strReturn = 'Buzz'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
}
