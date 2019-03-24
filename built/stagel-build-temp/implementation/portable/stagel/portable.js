// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function prepareDocumentExec(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('prepareDocumentExec:document-exec'); await assertIsIntArray(intArrayContents); let intReturn;

    let intExecId = 0;
    intExecId = -1;
    /* documentExecData is a global, created during initialization. It holds the current document state for any documents being executed. */
    intExecId = await count(strArrayDocumentExecPtrs);
    strArrayDocumentExecData = await push(strArrayDocumentExecData, await strPrintArr(intArrayContents));
    /* documentExecPtrs is also a global created during init; it holds the current execution state of each document as an array of strings of of comma-terminated ints with the last indicating the position in the document where execution is (the earlier ints represent where execution should return to upon exiting the current scope, so it acts as a stack). */
    strArrayDocumentExecSymbolIndex = await push(strArrayDocumentExecSymbolIndex, '');
    strArrayDocumentExecPtrs = await push(strArrayDocumentExecPtrs, '0,');
    strArrayDocumentExecFrames = await push(strArrayDocumentExecFrames, '');
    strArrayDocumentExecEvents = await push(strArrayDocumentExecEvents, '');
    await assertIsExecId(intExecId);

    intReturn = intExecId; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function isExecId(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('isExecId:document-exec'); await assertIsInt(intExecId); let boolReturn;

    if (await implLt(intExecId, await count(strArrayDocumentExecPtrs))) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function getCurrentExecPtrPos(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getCurrentExecPtrPos:document-exec'); await assertIsInt(intExecId); let intReturn;

    let intRes = 0;
    intRes = await intFromIntStr(await get(await strSplit(await get(strArrayDocumentExecPtrs, intExecId), ','), -1));

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getNextExecPtrPos(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getNextExecPtrPos:document-exec'); await assertIsInt(intExecId); let intReturn;

    let intRes = 0;
    intRes = await intFromIntStr(await get(await strSplit(await get(strArrayDocumentExecPtrs, intExecId), ','), -2));

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getCurrentExecData(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getCurrentExecData:document-exec'); await assertIsInt(intExecId); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await intArrFromStrPrintedArr(await get(strArrayDocumentExecData, intExecId));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getCurrentExecFrame(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getCurrentExecFrame:document-exec'); await assertIsInt(intExecId); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await intArrFromStrPrintedArr(await get(strArrayDocumentExecFrames, intExecId));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function startDocumentExec(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('startDocumentExec:document-exec'); await assertIsInt(intExecId);

    await assertIsExecId(intExecId);
    let boolContinue = false;
    boolContinue = true;
    let intCurrentPtrPos = 0;
    let intArrayWipFrame = [];
    let intDc = 0;
    let intArrayDocumentWorkingCopyData = [];
    intArrayDocumentWorkingCopyData = await intArrFromStrPrintedArr(await get(strArrayDocumentExecData, intExecId));
    let strArrayState = [];
    strArrayState = [ 'normal' ];
    let boolLastCharacterWasEscape = false;
    boolLastCharacterWasEscape = false;
    while (boolContinue) {
        /* This loop goes through each Dc in the document, running it. */
        /* Where are we in the document? Store it in n/currentPtrPos. */
        intCurrentPtrPos = await getCurrentExecPtrPos(intExecId);
        /* The execution process basically is a big state machine. */
        if (await implGt(0, intCurrentPtrPos)) {
            /* Pointer's been set to a negative position, so we're done with the document */
            boolContinue = false;
        }
        else {
            intDc = await get(intArrayDocumentWorkingCopyData, intCurrentPtrPos);
            if (boolLastCharacterWasEscape) {
                boolLastCharacterWasEscape = false;
                intCurrentPtrPos = await implAdd(1, intCurrentPtrPos);
            }
            else {
                if (await implEq(intDc, 255)) {
                    boolLastCharacterWasEscape = true;
                    intCurrentPtrPos = await implAdd(1, intCurrentPtrPos);
                }
                else {
                    if (await implEq('normal', await last(strArrayState))) {
                        if (await implIn(intDc, [ 246, 247 ])) {
                            strArrayState = await push(strArrayState, 'single-line source comment');
                        }
                        else if (await implIn(intDc, [ 249, 250 ])) {
                            strArrayState = await push(strArrayState, 'block source comment');
                        }
                        if (await dcIsELCode(intDc)) {
                            /* FIXME unimplemented */
                        }
                        else {
                            /* Normal Dc */
                            intArrayWipFrame = await push(intArrayWipFrame, intDc);
                        }
                    }
                    else if (await implEq('single-line source comment', await last(strArrayState))) {
                        if (await implEq(intDc, 248)) {
                            strArrayState = await pop(strArrayState);
                        }
                    }
                    else if (await implEq('block source comment', await last(strArrayState))) {
                        if (await implEq(intDc, 251)) {
                            strArrayState = await pop(strArrayState);
                        }
                    }
                    intCurrentPtrPos = await implAdd(1, intCurrentPtrPos);
                }
            }
        }
        /* FIXME Just copy the input document over for now */
        intArrayWipFrame = await intArrFromStrPrintedArr(await get(strArrayDocumentExecData, intExecId));
        boolContinue = false;
        /* Frame is done, so convert it to the environment-appropriate format and output it */
        await setElement(strArrayDocumentExecFrames, intExecId, await printArr(intArrayWipFrame));
        intArrayWipFrame = [  ];
        await renderDrawContents(await dcaToFormat(await getEnvPreferredFormat(), await getCurrentExecFrame(intExecId)));
    }

    await internalDebugStackExit();
}

async function runTestsOnly(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsOnly:unit-testing'); await assertIsBool(boolV); let boolReturn;

    /* Run tests without report. b/v=verbose: true=print test result lines; false=return value only */
    /* This runs each component's test suite */
    /* General tests */
    /*runTestsBits b/v */
    await runTestsMath(boolV);
    await runTestsPack32(boolV);
    await runTestsTypeConversion(boolV);
    await runTestsWasm(boolV);
    /* Core tests */
    await runTestsDcData(boolV);
    await runTestsFormatDc(boolV);
    /* Format tests */
    await runTestsFormatAscii(boolV);
    await runTestsFormatAsciiSafeSubset(boolV);
    await runTestsFormatHtml(boolV);
    await runTestsFormatHtmlFragment(boolV);
    await runTestsFormatIntegerList(boolV);
    await runTestsFormatSems(boolV);
    await runTestsFormatUtf8(boolV);
    /* Did anything fail? */
    if (await implEq(intFailedTests, 0)) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function testing(boolV, strTestSuite) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('str TestSuite = ' + strTestSuite + '; '); await internalDebugStackEnter('testing:unit-testing'); await assertIsBool(boolV); await assertIsStr(strTestSuite);

    if (boolV) {
        intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Started running test suite: ', strTestSuite)));
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    await internalDebugStackExit();
}

async function runTest(boolV, boolTestReturn) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('bool TestReturn = ' + boolTestReturn + '; '); await internalDebugStackEnter('runTest:unit-testing'); await assertIsBool(boolV); await assertIsBool(boolTestReturn); let boolReturn;

    intTotalTests = await implAdd(intTotalTests, 1);
    if (boolTestReturn) {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), ' passed.'))));
        }
        intPassedTests = await implAdd(intPassedTests, 1);
    }
    else {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), ' failed.'))));
        }
        intFailedTests = await implAdd(intFailedTests, 1);
    }
    if (boolV) {
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestNamed(boolV, strTestName, boolTestReturn) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugCollect('str TestName = ' + strTestName + '; '); await internalDebugCollect('bool TestReturn = ' + boolTestReturn + '; '); await internalDebugStackEnter('runTestNamed:unit-testing'); await assertIsBool(boolV); await assertIsStr(strTestName); await assertIsBool(boolTestReturn); let boolReturn;

    intTotalTests = await implAdd(intTotalTests, 1);
    if (boolTestReturn) {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), await implCat(strTestName, ' passed.')))));
        }
        intPassedTests = await implAdd(intPassedTests, 1);
    }
    else {
        if (boolV) {
            intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Test #', await implCat(await strFrom(intTotalTests), await implCat(strTestName, ' failed.')))));
        }
        intFailedTests = await implAdd(intFailedTests, 1);
    }
    if (boolV) {
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function clearTestStats() {
    await internalDebugStackEnter('clearTestStats:unit-testing');

    intTotalTests = 0;
    intPassedTests = 0;
    intFailedTests = 0;

    await internalDebugStackExit();
}

async function reportTests() {
    await internalDebugStackEnter('reportTests:unit-testing'); let boolReturn;

    let strPassedWord = '';
    strPassedWord = 'tests';
    if (await implEq(intPassedTests, 1)) {
        strPassedWord = 'test';
    }
    let strFailedWord = '';
