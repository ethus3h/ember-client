// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function dctCodeToText(intArrayIn, strTargetLanguage) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugCollect('str TargetLanguage = ' + strTargetLanguage + '; '); await internalDebugStackEnter('dctCodeToText:code-to-text'); await assertIsIntArray(intArrayIn); await assertIsStr(strTargetLanguage); let intArrayReturn;

    let intArrayRes = [];
    let intC = 0;
    intC = 0;
    let intL = 0;
    intL = await count(intArrayIn);
    let intCurrentDc = 0;
    let strTemp = '';
    while (await implLt(intC, intL)) {
        intCurrentDc = await get(intArrayIn, intC);
        if (await dcIsELCode(intCurrentDc)) {
            strTemp = await dcGetMappingToFormat(intCurrentDc, strTargetLanguage);
            if (await ne(0, await len(strTemp))) {
                intArrayRes = await append(intArrayRes, await dcaFromElad(strTemp));
            }
            else {
                intArrayRes = await push(intArrayRes, intCurrentDc);
            }
        }
        intC = await inc(intC);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dctSemanticToText(intArrayIn, strTargetLanguage) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugCollect('str TargetLanguage = ' + strTargetLanguage + '; '); await internalDebugStackEnter('dctSemanticToText:semantic-to-text'); await assertIsIntArray(intArrayIn); await assertIsStr(strTargetLanguage); let intArrayReturn;

    let intArrayRes = [];
    let intC = 0;
    intC = 0;
    let intL = 0;
    intL = await count(intArrayIn);
    let intCurrentDc = 0;
    let strTemp = '';
    while (await implLt(intC, intL)) {
        intCurrentDc = await get(intArrayIn, intC);
        if (await implEq('Semantic', await dcGetScript(intCurrentDc))) {
            strTemp = await dcGetMappingToFormat(intCurrentDc, strTargetLanguage);
            if (await ne(0, await len(strTemp))) {
                intArrayRes = await append(intArrayRes, await dcaFromElad(strTemp));
            }
            else {
                intArrayRes = await push(intArrayRes, intCurrentDc);
            }
        }
        intC = await inc(intC);
    }

    