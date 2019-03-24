// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function runTestsOnly(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsOnly:unit-testing'); await assertIsBool(boolV); let boolReturn;

    /* Run tests without report. b/v=verbose: true=print test result lines; false=return value only */
    /* This runs each component's test suite */
    /* General tests */
    /*runTestsBits b/v */
    await runTestsMath(boolV);
    await runTestsPack32(boolV);
    await runTestsTypeConversion(boolV);
    /*runTestsWasm b/v */
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
    strFailedWord = 'tests';
    if (await implEq(intFailedTests, 1)) {
        strFailedWord = 'test';
    }
    let strTotalWord = '';
    strTotalWord = 'tests';
    if (await implEq(intTotalTests, 1)) {
        strTotalWord = 'test';
    }
    let strPassedPercentage = '';
    strPassedPercentage = await formatPercentage(intPassedTests, intTotalTests);
    let strFailedPercentage = '';
    strFailedPercentage = await formatPercentage(intFailedTests, intTotalTests);
    intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat(await strFrom(intPassedTests), await implCat(' ', await implCat(strPassedWord, await implCat(' (', await implCat(strPassedPercentage, await implCat('%) passed and ', await implCat(await strFrom(intFailedTests), await implCat(' ', await implCat(strFailedWord, await implCat(' (', await implCat(strFailedPercentage, await implCat('%) failed out of a total of ', await implCat(await strFrom(intTotalTests), await implCat(' ', await implCat(strTotalWord, '.')))))))))))))))));
    let strTemp = '';
    if (await ne(intFailedTests, 0)) {
        strTotalWord = 'Some tests';
        if (await implEq(intTotalTests, 1)) {
            strTotalWord = 'A test';
        }
        strTemp = await implCat(strTotalWord, await implCat(' (', await implCat(strFailedPercentage, await implCat('%: ', await implCat(await strFrom(intFailedTests), await implCat(' out of ', await implCat(await strFrom(intTotalTests), ') failed!')))))));
        intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(strTemp));
        /*error s/temp */
    }
    if (await ne(intPassedTests, await implSub(intTotalTests, intFailedTests))) {
        await implDie('There is a problem in the testing framework.');
    }
    await renderDrawContents(intArrayTestFrameBuffer);
    intArrayTestFrameBuffer = [  ];
    let boolTestReturn = false;
    boolTestReturn = true;
    if (await ne(intFailedTests, 0)) {
        boolTestReturn = false;
        /*die s/temp */
    }

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcaFromIntegerList(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromIntegerList:format-integerList'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRes = [];
    /* Accepts an array of bytes representing an ASCII list of integers representing Dcs. Returns an array of Dcs. This format is the same as sems but without supporting comments. */
    let strCurrentDc = '';
    strCurrentDc = '';
    let intContentLength = 0;
    intContentLength = await count(intArrayContent);
    let intByteOffset = 0;
    let intCurrentByte = 0;
    while (await implLt(intByteOffset, intContentLength)) {
        /* do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs. */
        intCurrentByte = await get(intArrayContent, intByteOffset);
        if (await asciiIsDigit(intCurrentByte)) {
            strCurrentDc = await implCat(strCurrentDc, await charFromByte(intCurrentByte));
        }
        else if (await asciiIsSpace(intCurrentByte)) {
            intArrayRes = await push(intArrayRes, await intFromIntStr(strCurrentDc));
            strCurrentDc = '';
        }
        else {
            await implDie('Unexpected parser state in integerList document.');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    if (await ne(0, await len(strCurrentDc))) {
        /* Ended without a trailing space */
        if (await implEq('true', await getSettingForFormat('integerList', 'in', 'strict'))) {
            await implDie('No trailing space present in integerList format while importing. This is not allowed in strict mode.');
        }
        intArrayRes = await push(intArrayRes, await intFromIntStr(strCurrentDc));
    }
    await assertIsDcArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToIntegerList(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToIntegerList:format-integerList'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    while (await implLt(intInputIndex, intLen)) {
        intArrayOut = await push(intArrayOut, await strToByteArray(await implCat(await strFrom(await get(intArrayDcIn, intInputIndex), ), ' ')));
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

/* This is an attempt at packing arbitrary 32-bit unsigned? ints losslessly in a manner similar to UTF-8. For now, it is simply a wrapper around WTF-8 (UTF-8 but allowing unpaired surrogates). Consequently, it only supports a chunk of the 32 bit numbers. Later it can be extended to support all. Note that these functions take *signed* ints as input at least for the moment. */

async function pack32(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('pack32:pack32'); await assertIsInt(intIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await intArrayPackWtf8(intIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function unpack32(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('unpack32:pack32'); await assertIsIntArray(intArrayIn); let intReturn;

    let intRes = 0;
    intRes = await intUnpackWtf8(intArrayIn);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function isPack32Char(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('isPack32Char:pack32'); await assertIsIntArray(intArrayIn); let boolReturn;

    let boolRes = false;
    boolRes = await boolIsUnpackableWtf8(intArrayIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestsFormatHtmlFragment(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatHtmlFragment:format-htmlFragment-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatHtmlFragment');
    await runTest(boolV, await arrEq(await strToByteArray('<div style="white-space:pre-wrap">5&lt;6</div>'), await dcaToHtmlFragment([ 39, 46, 40 ])));

    await internalDebugStackExit();
}

async function runTestsFormatDc(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatDc:format-dc-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatDc');
    await runTest(boolV, await dcIsPrintable(21));
    await runTest(boolV, await implNot(await dcIsPrintable(231)));
    await runTest(boolV, await dcIsNewline(120));

    await internalDebugStackExit();
}

async function warnOrDie(boolStrict, strMsg) {
    await internalDebugCollect('bool Strict = ' + boolStrict + '; '); await internalDebugCollect('str Msg = ' + strMsg + '; '); await internalDebugStackEnter('warnOrDie:assertions'); await assertIsBool(boolStrict); await assertIsStr(strMsg);

    if (boolStrict) {
        await implDie(strMsg);
    }
    await implWarn(strMsg);

    await internalDebugStackExit();
}

async function assertIsTrue(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('assertIsTrue:assertions'); await assertIsBool(boolIn);

    if (await isFalse(boolIn)) {
        await assertionFailed(await implCat(await bool(' is not true.')));
    }

    await internalDebugStackExit();
}

async function assertIsFalse(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('assertIsFalse:assertions'); await assertIsBool(boolIn);

    if (await isTrue(boolIn)) {
        await assertionFailed(await implCat(await bool(' is true, but should be false.')));
    }

    await internalDebugStackExit();
}

async function assertContains(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('assertContains:assertions'); await assertIsGenericArray(genericArrayIn); await assertIsGeneric(genericValue);

    await assertIsTrue(await contains(genericArrayIn, genericValue));

    await internalDebugStackExit();
}

async function assertIsByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsByte:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isByte(intIn));

    await internalDebugStackExit();
}

async function assertIsChar(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('assertIsChar:assertions'); await assertIsGeneric(genericIn);

    await assertIsTrue(await isChar(genericIn));

    await internalDebugStackExit();
}

async function assertIsCharByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsCharByte:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isCharByte(intIn));

    await internalDebugStackExit();
}

async function assertIsDc(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('assertIsDc:assertions'); await assertIsGeneric(genericIn);

    await assertIsTrue(await isDc(genericIn));

    await internalDebugStackExit();
}

async function assertStrContainsOnlyInt(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertStrContainsOnlyInt:assertions'); await assertIsStr(strIn);

    if (await implNot(await strContainsOnlyInt(strIn))) {
        await assertionFailed(await implCat(strIn, ' does not only contain an integer.'));
    }

    await internalDebugStackExit();
}

async function assertIsNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsNonnegative:assertions'); await assertIsInt(intIn);

    if (await implNot(await isNonnegative(intIn))) {
        let strTemp = '';
        strTemp = await strFrom(intIn);
        await assertionFailed(await implCat(strTemp, ' is negative.'));
    }

    await internalDebugStackExit();
}

async function assertIsSupportedBase(intB) {
    await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsSupportedBase:assertions'); await assertIsInt(intB);

    await assertIsTrue(await isSupportedBase(intB));

    await internalDebugStackExit();
}

async function assertIsBaseDigit(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseDigit:assertions'); await assertIsStr(strIn); await assertIsInt(intB);

    await assertIsTrue(await isBaseDigit(strIn, intB));

    await internalDebugStackExit();
}

async function assertIsBaseStr(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseStr:assertions'); await assertIsStr(strIn); await assertIsInt(intB);

    await assertIsTrue(await isBaseStr(strIn, intB));

    await internalDebugStackExit();
}

async function assertIsArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsIntArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsIntArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isIntArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsBoolArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsBoolArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isBoolArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsStrArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsStrArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isStrArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsCharArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsCharArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isCharArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsIntBitArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsIntBitArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isIntBitArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsByteArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsByteArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isByteArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsDcArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('assertIsDcArray:assertions'); await assertIsGenericItem(genericItemIn);

    await assertIsTrue(await isDcArray(genericItemIn));

    await internalDebugStackExit();
}

async function assertIsDcDataset(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsDcDataset:assertions'); await assertIsStr(strIn);

    await assertIsTrue(await isDcDataset(strIn));

    await internalDebugStackExit();
}

async function assertIsSupportedInputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedInputFormat:assertions'); await assertIsStr(strIn);

    if (await implNot(await isSupportedInputFormat(strIn))) {
        await implDie(await implCat(strIn, ' is not a supported input format.'));
    }
    await assertIsTrue(await isSupportedInputFormat(strIn));

    await internalDebugStackExit();
}

async function assertIsSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedOutputFormat:assertions'); await assertIsStr(strIn);

    if (await implNot(await isSupportedOutputFormat(strIn))) {
        await implDie(await implCat(strIn, ' is not a supported output format.'));
    }
    await assertIsTrue(await isSupportedOutputFormat(strIn));

    await internalDebugStackExit();
}

async function assertIsSupportedEnvironmentCharEncoding(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedEnvironmentCharEncoding:assertions'); await assertIsStr(strIn);

    if (await implNot(await isSupportedEnvironmentCharEncoding(strIn))) {
        await implDie(await implCat(strIn, ' is not a supported environment character encoding.'));
    }
    await assertIsTrue(await isSupportedEnvironmentCharEncoding(strIn));

    await internalDebugStackExit();
}

async function assertIsExecId(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsExecId:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isExecId(intIn));

    await internalDebugStackExit();
}

async function or(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('or:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nor:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nand(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nand:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xor:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xnor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xnor:booleans'); await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await xor(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isTrue(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('isTrue:booleans'); await assertIsBool(boolIn); let boolReturn;


    boolReturn = boolIn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isFalse(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('isFalse:booleans'); await assertIsBool(boolIn); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(boolIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

/* This file contains the public interface for EITE. */
/* If you just want to run EITE, use the following function. */

async function startEite() {
    await internalDebugStackEnter('startEite:public-interface');

    /* Start EITE, using the default startup document. Does not return while EITE is still running. */
    await loadAndRun('sems', 'eite.sems');

    await internalDebugStackExit();
}
/* If you want to run a different document, you can call loadAndRun with the format of the document to open and its location. */

async function loadAndRun(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndRun:public-interface'); await assertIsStr(strFormat); await assertIsStr(strPath);

    /* Load and run the specified document. Does not return while the document is still running. */
    await runDocument(await loadStoredDocument(strFormat, strPath));

    await internalDebugStackExit();
}
/* If you want to convert a document to another format, you can call loadAndConvert with the format of the document, its location, and the format you want the results in. */

async function loadAndConvert(strInputFormat, strOutputFormat, strPath) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndConvert:public-interface'); await assertIsStr(strInputFormat); await assertIsStr(strOutputFormat); await assertIsStr(strPath); let intArrayReturn;

    /* Load the specified document, and return it converted to the specified outputFormat as an array of bytes. */
    let intArrayOut = [];
    intArrayOut = await exportDocument(strOutputFormat, await loadStoredDocument(strInputFormat, strPath), );
}
/* To operate on a document you already have as a Dc array, you can call runDocument or convertDocument directly on it. Or, if you already have it as a byte array, you can call importDocument or importAndExport on it. */

async function runDocument(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('runDocument:public-interface'); await assertIsIntArray(intArrayContents);

    /* Run the specified document. Does not return while the document is still running. Takes care of events and I/O automatically. */
    await setupIfNeeded();
    await assertIsDcArray(intArrayContents);
    let intExecId = 0;
    intExecId = await startDocument(intArrayContents);
    await internalRunDocument(intExecId);

    await internalDebugStackExit();
}

async function exportDocument(strFormat, intArrayContents) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('exportDocument:public-interface'); await assertIsStr(strFormat); await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Convert a document stored as an array of dcs to the specified format, and return it as an array of bytes. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaToFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importDocument(strFormat, intArrayContents) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('importDocument:public-interface'); await assertIsStr(strFormat); await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Convert a document stored as an array of bytes in the specified format, and return it as an array of dc. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaFromFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importAndExport(strInputFormat, strOutputFormat, intArrayContents) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('importAndExport:public-interface'); await assertIsStr(strInputFormat); await assertIsStr(strOutputFormat); await assertIsIntArray(intArrayContents); let intArrayReturn;

    await setupIfNeeded();
    await assertIsSupportedInputFormat(strInputFormat);
    await assertIsSupportedOutputFormat(strOutputFormat);
    /* Convert a document stored as an array of bytes in the specified input format, and return it as an array of bytes in the specified output format. */
    let intArrayOut = [];
    intArrayOut = await convertFormats(strInputFormat, strOutputFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
/* If you want more control over the document loading and execution, you can use these lower-level functions. */

async function loadStoredDocument(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadStoredDocument:public-interface'); await assertIsStr(strFormat); await assertIsStr(strPath); let intArrayReturn;

    await setupIfNeeded();
    await assertIsSupportedInputFormat(strFormat);
    /* Load and return the specified document as a Dc array. */
    let intArrayRes = [];
    intArrayRes = await dcaFromFormat(strFormat, await getFileFromPath(strPath));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function startDocument(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('startDocument:public-interface'); await assertIsIntArray(intArrayContents); let intReturn;

    /* Start execution of the provided document and return an ID for it. */
    await setupIfNeeded();
    let intExecId = 0;
    intExecId = await prepareDocumentExec(intArrayContents);

    intReturn = intExecId; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getDesiredEventNotifications(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getDesiredEventNotifications:public-interface'); await assertIsInt(intExecId); let strArrayReturn;

    /* Return list of event types (e.g. keystrokes, mouse movement, elapsed time) that the document wants to be notified of. */
    let strArrayRes = [];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function sendEvent(intExecId, intArrayEventData) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('intArray EventData = ' + intArrayEventData + '; '); await internalDebugStackEnter('sendEvent:public-interface'); await assertIsInt(intExecId); await assertIsIntArray(intArrayEventData); let intArrayReturn;

    /* Send the provided event or events data to the specified document. */
}

async function getDocumentFrame(intExecId, strFormat) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getDocumentFrame:public-interface'); await assertIsInt(intExecId); await assertIsStr(strFormat); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Return the most recently available output for the given document in the requested format. */
}
/* To run the tests, you can use runTests or runPrintTests. */

async function runTests() {
    await internalDebugStackEnter('runTests:public-interface'); let boolReturn;

    /* Returns true if all tests pass; false otherwise. Displays a report of the tests. */
    await setupIfNeeded();
    await clearTestStats();
    await runTestsOnly(true);
    await reportTests();
    if (await implEq(intFailedTests, 0)) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function quietRunTests() {
    await internalDebugStackEnter('quietRunTests:public-interface'); let boolReturn;

    /* Returns true if all tests pass; false otherwise. */
    await setupIfNeeded();
    let boolRes = false;
    boolRes = await runTestsOnly(false);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcaToUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsDcArray(intArrayContent);
    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    let intArrayTemp = [];
    let intDcAtIndex = 0;
    let intArrayUnmappables = [];
    let intUnmappablesCount = 0;
    let intUnmappablesCounter = 0;
    let intArrayUnmappablesIntermediatePacked = [];
    let boolFoundAnyUnmappables = false;
    boolFoundAnyUnmappables = false;
    let strArrayVariantSettings = [];
    strArrayVariantSettings = await utf8VariantSettings('out');
    let boolDcBasenbEnabled = false;
    boolDcBasenbEnabled = await contains(strArrayVariantSettings, 'dcBasenb');
    let boolDcBasenbFragmentEnabled = false;
    boolDcBasenbFragmentEnabled = await contains(strArrayVariantSettings, 'dcBasenbFragment');
    while (await le(intC, intL)) {
        /* Start by getting the character's UTF8 equivalent and putting it in an/temp. This might be empty, if the character can't be mapped to UTF8. */
        if (await implLt(intC, intL)) {
            intDcAtIndex = await get(intArrayContent, intC);
            intArrayTemp = await dcToFormat('utf8', intDcAtIndex);
        }
        /* Could the character be mapped? If not, stick it in the unmappables array or warn as appropriate. */
        if (await implEq(0, await count(intArrayTemp))) {
            if (await implLt(intC, intL)) {
                if (boolDcBasenbEnabled) {
                    intArrayUnmappables = await push(intArrayUnmappables, intDcAtIndex);
                }
                else {
                    await exportWarningUnmappable(intC, intDcAtIndex);
                }
            }
        }
        /* If we've reached the end of the input string or the last character was mappable, convert the an/unmappables array to PUA characters and append that result to the output string */
        if (boolDcBasenbEnabled) {
            if (await or(await implEq(intC, intL), await ne(0, await count(intArrayTemp)))) {
                intUnmappablesCount = await count(intArrayUnmappables);
                if (await ne(0, intUnmappablesCount)) {
                    if (await implNot(boolFoundAnyUnmappables)) {
                        if (await implNot(boolDcBasenbFragmentEnabled)) {
                            intArrayRes = await append(intArrayRes, await getArmoredUtf8EmbeddedStartUuid());
                        }
                    }
                    boolFoundAnyUnmappables = true;
                    /* We've gotten to the end of a string of unmappable characters, so convert them to PUA characters */
                    intUnmappablesCounter = 0;
                    while (await implLt(intUnmappablesCounter, intUnmappablesCount)) {
                        /* The packing method for this works basically like UTF8, where each character is mapped to a series of bytes. So, first get the bytearray for the character we're on. Each character should be packed separately, to make it easy to spot where one character ends and the next begins. */
                        intArrayUnmappablesIntermediatePacked = await append(intArrayUnmappablesIntermediatePacked, await pack32(await get(intArrayUnmappables, intUnmappablesCounter)));
                        intUnmappablesCounter = await implAdd(intUnmappablesCounter, 1);
                        intArrayRes = await append(intArrayRes, await byteArrayToBase17bUtf8(intArrayUnmappablesIntermediatePacked));
                        intArrayUnmappablesIntermediatePacked = [  ];
                    }
                    intArrayUnmappables = [  ];
                    intArrayUnmappablesIntermediatePacked = [  ];
                }
            }
        }
        /* Stick the current character onto the result array */
        if (await implLt(intC, intL)) {
            intArrayRes = await append(intArrayRes, intArrayTemp);
        }
        /* and finally increment the loop counter */
        intC = await implAdd(intC, 1);
    }
    if (await implAnd(boolDcBasenbEnabled, boolFoundAnyUnmappables)) {
        if (await implNot(boolDcBasenbFragmentEnabled)) {
            intArrayRes = await append(intArrayRes, await getArmoredUtf8EmbeddedEndUuid());
        }
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    let intArrayRes = [];
    let intArrayRemaining = [];
    intArrayRemaining = intArrayContent;
    let intArrayTemp = [];
    let intArrayLatestChar = [];
    let intDcBasenbUuidMonitorState = 0;
    intDcBasenbUuidMonitorState = 0;
    let intDcBasenbUuidMonitorReprocessNeededCount = 0;
    intDcBasenbUuidMonitorReprocessNeededCount = 0;
    let strArrayVariantSettings = [];
    strArrayVariantSettings = await utf8VariantSettings('in');
    let boolDcBasenbEnabled = false;
    boolDcBasenbEnabled = await contains(strArrayVariantSettings, 'dcBasenb');
    let boolInDcBasenbSection = false;
    boolInDcBasenbSection = false;
    if (boolDcBasenbEnabled) {
        boolInDcBasenbSection = await contains(strArrayVariantSettings, 'dcBasenbFragment');
    }
    let intSkipThisChar = 0;
    intSkipThisChar = 0;
    let intArrayCollectedDcBasenbChars = [];
    let intCollectedDcBasenbCharsCount = 0;
    let intCollectedDcBasenbCharsCounter = 0;
    let intArrayCurrentUnmappableChar = [];
    let intTempArrayCount = 0;
    while (await implNot(await implEq(0, await count(intArrayRemaining)))) {
        intArrayTemp = [  ];
        intArrayLatestChar = await pack32(await firstCharOfUtf8String(intArrayRemaining));
        if (boolDcBasenbEnabled) {
            /* Dcbasenb is enabled, so process characters accordingly. */
            if (await implNot(boolInDcBasenbSection)) {
                /* Not in a dcbasenb section, so look out for the UUID in case we run into one */
                /* All this code down to "(End of code section)" is only looking for UUIDs, and can mostly be disregarded for purposes of understanding the decoder logic. */
                /* 8 characters for uuid. Probably a better way to do this but oh well. Got them with new TextEncoder().encode('[char]'); etc. */
                if (await ne(0, intDcBasenbUuidMonitorReprocessNeededCount)) {
                    /* We're reprocessing potential UUID chars that didn't match a UUID after all, so don't check them for being a UUID. FIXME: Non-UUID char being reprocessed followed by 244 141 129 157 etc. (a potential UUID) would NOT be checked to be a UUID here. It should handle correctly the situation where there's potential but not a UUID, followed by potential and is a UUID, overlapping, like that. */
                    intDcBasenbUuidMonitorReprocessNeededCount = await implSub(intDcBasenbUuidMonitorReprocessNeededCount, 1);
                }
                else {
                    /* Check for a UUID. */
                    if (await implEq(intDcBasenbUuidMonitorState, 0)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 141, 129, 157 ])) {
                            intDcBasenbUuidMonitorState = 1;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 1)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 139, 182, 128 ])) {
                            intDcBasenbUuidMonitorState = 2;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 2)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 188, 183, 162 ])) {
                            intDcBasenbUuidMonitorState = 3;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 3)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 186, 128, 138 ])) {
                            intDcBasenbUuidMonitorState = 4;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 4)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 184, 165, 142 ])) {
                            intDcBasenbUuidMonitorState = 5;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 5)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 136, 186, 141 ])) {
                            intDcBasenbUuidMonitorState = 6;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 6)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 178, 139, 160 ])) {
                            intDcBasenbUuidMonitorState = 7;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 7)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 143, 186, 144 ])) {
                            intDcBasenbUuidMonitorState = 0;
                            intArrayLatestChar = [  ];
                            boolInDcBasenbSection = true;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    if (await ne(0, intDcBasenbUuidMonitorReprocessNeededCount)) {
                        /* It's necessary to reprocess the number of bytes that were consumed while checking for a UUID */
                        intTempArrayCount = await implSub(await count(intArrayContent), await count(intArrayRemaining));
                        intArrayRemaining = await anSubset(intArrayContent, intTempArrayCount, await implAdd(intTempArrayCount, await implMul(4, intDcBasenbUuidMonitorReprocessNeededCount)));
                    }
                }
            }
            else {
                /* Dcbasenb support is enabled, and we're inside a dcbasenb region. Process chars accordingly. */
                if (await ne(0, intDcBasenbUuidMonitorReprocessNeededCount)) {
                    /* Reprocessing non-UUID chars that could have been a UUID. Again, FIXME same as for the start UUID reprocessing bug mentioned in the earlier FIXME. */
                    intDcBasenbUuidMonitorReprocessNeededCount = await implSub(intDcBasenbUuidMonitorReprocessNeededCount, 1);
                }
                else {
                    /* Look for a dcbasenb region end UUID. */
                    if (await implEq(intDcBasenbUuidMonitorState, 0)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 188, 133, 185 ])) {
                            intDcBasenbUuidMonitorState = 1;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 1)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 180, 182, 175 ])) {
                            intDcBasenbUuidMonitorState = 2;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 2)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 136, 161, 186 ])) {
                            intDcBasenbUuidMonitorState = 3;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 3)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 191, 148, 138 ])) {
                            intDcBasenbUuidMonitorState = 4;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 4)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 134, 178, 166 ])) {
                            intDcBasenbUuidMonitorState = 5;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 5)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 141, 184, 130 ])) {
                            intDcBasenbUuidMonitorState = 6;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 6)) {
                        if (await arrEq(intArrayLatestChar, [ 243, 178, 128, 176 ])) {
                            intDcBasenbUuidMonitorState = 7;
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    else if (await implEq(intDcBasenbUuidMonitorState, 7)) {
                        if (await arrEq(intArrayLatestChar, [ 244, 143, 188, 157 ])) {
                            intDcBasenbUuidMonitorState = 0;
                            intArrayLatestChar = [  ];
                            boolInDcBasenbSection = false;
                            /* Handle any remaining collected DcBasenb characters */
                            if (await ne(0, await count(intArrayCollectedDcBasenbChars))) {
                                intArrayCollectedDcBasenbChars = await byteArrayFromBase17bUtf8(intArrayCollectedDcBasenbChars);
                                if (await excepArr(intArrayCollectedDcBasenbChars)) {
                                    await importWarning(await implSub(await count(intArrayContent), await count(intArrayRemaining), ), 'An invalid base17b UTF8 input was encountered. Probably it was incorrectly truncated.');
                                    intArrayCollectedDcBasenbChars = [  ];
                                }
                                intCollectedDcBasenbCharsCount = await count(intArrayCollectedDcBasenbChars);
                                intCollectedDcBasenbCharsCounter = 0;
                                while (await implLt(intCollectedDcBasenbCharsCounter, intCollectedDcBasenbCharsCount)) {
                                    intArrayCurrentUnmappableChar = await utf8BytesFromDecimalChar(await firstCharOfUtf8String(intArrayCollectedDcBasenbChars));
                                    intArrayRes = await append(intArrayRes, await unpack32(intArrayCurrentUnmappableChar));
                                    intCollectedDcBasenbCharsCounter = await implAdd(intCollectedDcBasenbCharsCounter, await count(intArrayCurrentUnmappableChar));
                                }
                                intArrayCollectedDcBasenbChars = [  ];
                            }
                        }
                        else {
                            intDcBasenbUuidMonitorReprocessNeededCount = intDcBasenbUuidMonitorState;
                            intDcBasenbUuidMonitorState = 0;
                        }
                    }
                    if (await ne(0, intDcBasenbUuidMonitorReprocessNeededCount)) {
                        /* It's necessary to reprocess the number of bytes that were consumed while checking for a UUID */
                        intTempArrayCount = await count(intArrayRemaining);
                        intArrayRemaining = await anSubset(intArrayContent, intTempArrayCount, await implAdd(intTempArrayCount, await implMul(4, intDcBasenbUuidMonitorReprocessNeededCount)));
                    }
                }
                /* (End of code section) (see explanation above) */
            }
            if (await implEq(0, intDcBasenbUuidMonitorState)) {
                /* Process the current character: if we're in a dcbasenb section, check if it is a dcbasenb character and collect it for decoding. Otherwise, decode the preceding run of dcbasenb chars as a chunk and append that to the result. */
                if (await ne(0, await count(intArrayLatestChar))) {
                    /* There is a latest char (latestChar has more than 0 elems), so work on it */
                    if (await implAnd(boolInDcBasenbSection, await implAnd(await isBasenbChar(intArrayLatestChar), await implNot(await isBasenbDistinctRemainderChar(intArrayLatestChar))))) {
                        /* The character is a dcbasenb char and we're in a dcbasenb section, so collect the character for decoding. */
                        /* Should decode each character as a single batch with the end of the run denoted by isBasenbDistinctRemainderChar, so don't match those here. */
                        intArrayCollectedDcBasenbChars = await append(intArrayCollectedDcBasenbChars, intArrayLatestChar);
                        intSkipThisChar = await count(intArrayLatestChar);
                    }
                    else {
                        /* Not a basenb char (or not in a dcbasenb section), so decode the ones we've collected, if there are any */
                        if (await ne(0, await count(intArrayCollectedDcBasenbChars))) {
                            if (await isBasenbDistinctRemainderChar(intArrayLatestChar)) {
                                intArrayCollectedDcBasenbChars = await push(intArrayCollectedDcBasenbChars, intArrayLatestChar);
                            }
                            intArrayCollectedDcBasenbChars = await byteArrayFromBase17bUtf8(intArrayCollectedDcBasenbChars);
                            if (await excepArr(intArrayCollectedDcBasenbChars)) {
                                await importWarning(await implSub(await count(intArrayContent), await count(intArrayRemaining), ), 'An invalid base17b UTF8 input was encountered. Probably it was incorrectly truncated.');
                                intArrayCollectedDcBasenbChars = [  ];
                            }
                            intCollectedDcBasenbCharsCount = await count(intArrayCollectedDcBasenbChars);
                            intCollectedDcBasenbCharsCounter = 0;
                            while (await implLt(intCollectedDcBasenbCharsCounter, intCollectedDcBasenbCharsCount)) {
                                intArrayCurrentUnmappableChar = await utf8BytesFromDecimalChar(await firstCharOfUtf8String(intArrayCollectedDcBasenbChars));
                                intArrayRes = await append(intArrayRes, await unpack32(intArrayCurrentUnmappableChar));
                                intCollectedDcBasenbCharsCounter = await implAdd(intCollectedDcBasenbCharsCounter, await count(intArrayCurrentUnmappableChar));
                            }
                            intArrayCollectedDcBasenbChars = [  ];
                        }
                    }
                }
                else {
                    /* The latest char was the last char of a confirmed UUID. */
                    intSkipThisChar = 4;
                }
            }
        }
        intTempArrayCount = await count(intArrayLatestChar);
        if (await implEq(0, intDcBasenbUuidMonitorState)) {
            /* (We're not trying to spot a UUID right now: either the current char couldn't be one, or we confirmed it's not part of one and are re-processing this char.) */
            if (await ne(0, intSkipThisChar)) {
                /* The current character was a dcbasenb character, so it was stuck onto the collectedDcBasenbChars array and so we defer working on it until later. (Or, it was the last character of a confirmed UUID; either way, it doesn't get processed now.) */
                intTempArrayCount = intSkipThisChar;
                intSkipThisChar = 0;
            }
            else {
                /* Not skipping the current char, so decode it from Unicode normally. */
                intArrayTemp = intArrayLatestChar;
                let intArrayTempFromUnicode = [];
                intArrayTempFromUnicode = await dcFromFormat('unicode', intArrayTemp);
                if (await ne(-1, await get(intArrayTempFromUnicode, 0))) {
                    intArrayRes = await append(intArrayRes, intArrayTempFromUnicode);
                }
            }
        }
        /* Place in an/remaining the substring of input that has not been processed yet. */
        intArrayRemaining = await anSubset(intArrayRemaining, intTempArrayCount, -1);
    }
    if (boolDcBasenbEnabled) {
        /* Handle any remaining collected DcBasenb characters */
        if (await ne(0, await count(intArrayCollectedDcBasenbChars))) {
            intArrayCollectedDcBasenbChars = await byteArrayFromBase17bUtf8(intArrayCollectedDcBasenbChars);
            if (await excepArr(intArrayCollectedDcBasenbChars)) {
                await importWarning(await implSub(await count(intArrayContent), await count(intArrayRemaining), ), 'An invalid base17b UTF8 input was encountered. Probably it was incorrectly truncated.');
                intArrayCollectedDcBasenbChars = [  ];
            }
            intCollectedDcBasenbCharsCount = await count(intArrayCollectedDcBasenbChars);
            intCollectedDcBasenbCharsCounter = 0;
            while (await implLt(intCollectedDcBasenbCharsCounter, intCollectedDcBasenbCharsCount)) {
                intArrayCurrentUnmappableChar = await utf8BytesFromDecimalChar(await firstCharOfUtf8String(intArrayCollectedDcBasenbChars));
                intArrayRes = await append(intArrayRes, await unpack32(intArrayCurrentUnmappableChar));
                intCollectedDcBasenbCharsCounter = await implAdd(intCollectedDcBasenbCharsCounter, await count(intArrayCurrentUnmappableChar));
            }
        }
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function utf8VariantSettings(strDirection) {
    await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugStackEnter('utf8VariantSettings:format-utf8'); await assertIsStr(strDirection); let strArrayReturn;

    let strArrayRes = [];
    let strEnabledVariants = '';
    strEnabledVariants = await getSettingForFormat('utf8', strDirection, 'variants');
    /* TODO: Support multiple variants enabled (chop up the value of the s/enabledVariants string into its constituent variants) */
    if (await implEq('dcBasenb', strEnabledVariants)) {
        strArrayRes = await push(strArrayRes, strEnabledVariants);
    }
    else if (await implEq('dcBasenb dcBasenbFragment', strEnabledVariants)) {
        strArrayRes = await push(strArrayRes, [ 'dcBasenb', 'dcBasenbFragment' ]);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function dcaFromUnicodeChar(intChar) {
    await internalDebugCollect('int Char = ' + intChar + '; '); await internalDebugStackEnter('dcaFromUnicodeChar:format-utf8'); await assertIsInt(intChar); let intArrayReturn;

    /* Takes a character number, not a byte array. */
    let intArrayRes = [];
    let intArrayTemp = [];
    intArrayTemp = await dcFromFormat('unicode', await anFromN(intChar));
    if (await ne(0, await count(intArrayTemp))) {
        intArrayRes = await push(intArrayRes, await get(intArrayTemp, 0));
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcToUnicodeCharArray(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcToUnicodeCharArray:format-utf8'); await assertIsInt(intDc); let intArrayReturn;

    /* Returns a character number, not a byte array. */
    let intArrayRes = [];
    let intArrayTemp = [];
    intArrayTemp = await dcToFormat('unicode', intDc);
    if (await ne(0, await count(intArrayTemp))) {
        intArrayRes = await push(intArrayRes, await firstCharOfUtf8String(intArrayTemp));
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToDcbnbUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToDcbnbUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* convenience wrapper */
    let intArrayRes = [];
    await pushExportSettings(await getFormatId('utf8'), 'variants:dcBasenb,');
    intArrayRes = await dcaToUtf8(intArrayContent);
    await popExportSettings(await getFormatId('utf8'));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromDcbnbUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromDcbnbUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* convenience wrapper */
    let intArrayRes = [];
    await pushImportSettings(await getFormatId('utf8'), 'variants:dcBasenb,');
    intArrayRes = await dcaFromUtf8(intArrayContent);
    await popImportSettings(await getFormatId('utf8'));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToDcbnbFragmentUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToDcbnbFragmentUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* convenience wrapper */
    let intArrayRes = [];
    await pushExportSettings(await getFormatId('utf8'), 'variants:dcBasenb dcBasenbFragment,');
    intArrayRes = await dcaToUtf8(intArrayContent);
    await popExportSettings(await getFormatId('utf8'));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromDcbnbFragmentUtf8(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromDcbnbFragmentUtf8:format-utf8'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* convenience wrapper */
    let intArrayRes = [];
    await pushImportSettings(await getFormatId('utf8'), 'variants:dcBasenb dcBasenbFragment,');
    intArrayRes = await dcaFromUtf8(intArrayContent);
    await popImportSettings(await getFormatId('utf8'));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function utf8CharArrayFromByteArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('utf8CharArrayFromByteArray:format-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    let intArrayRes = [];
    let intArrayRemaining = [];
    intArrayRemaining = intArrayIn;
    let intTemp = 0;
    while (await implLt(0, await count(intArrayRemaining))) {
        intTemp = await firstCharOfUtf8String(intArrayRemaining);
        intArrayRes = await push(intArrayRes, intTemp);
        intArrayRemaining = await anSubset(intArrayRemaining, await count(await utf8BytesFromDecimalChar(intTemp), ), -1);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromUtf8CharArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromUtf8CharArray:format-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    let intArrayRes = [];
    let intCount = 0;
    let intI = 0;
    intCount = await count(intArrayIn);
    intI = 0;
    while (await implLt(intI, intCount)) {
        intArrayRes = await append(intArrayRes, await utf8BytesFromDecimalChar(await get(intArrayIn, intI)));
        intI = await implAdd(1, intI);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcbnbGetFirstChar(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('dcbnbGetFirstChar:format-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    /* Return the first character of a dcbnb string (doesn't do any conversion; returns dcbnb) */
    let intArrayRes = [];
    if (await implEq(0, await count(intArrayIn))) {

        intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
    }
    let boolContinue = false;
    boolContinue = true;
    let intArrayNextUtf8 = [];
    let intArrayRemaining = [];
    intArrayRemaining = intArrayIn;
    let intTempArrayCount = 0;
    while (boolContinue) {
        intArrayNextUtf8 = await pack32(await firstCharOfUtf8String(intArrayRemaining));
        if (await implNot(await isBasenbChar(intArrayNextUtf8))) {
            if (await implEq(0, await count(intArrayRes))) {
                intArrayRes = intArrayNextUtf8;
            }
            boolContinue = false;
        }
        else {
            intArrayRes = await append(intArrayRes, intArrayNextUtf8);
            if (await isBasenbDistinctRemainderChar(intArrayNextUtf8)) {
                boolContinue = false;
            }
            else {
                intTempArrayCount = await count(intArrayNextUtf8);
                intArrayRemaining = await anSubset(intArrayRemaining, intTempArrayCount, -1);
            }
        }
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcbnbGetLastChar(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('dcbnbGetLastChar:format-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    /* Return the last character of a dcbnb string (doesn't do any conversion; returns dcbnb) */
    let intArrayRes = [];
    if (await implEq(0, await count(intArrayIn))) {

        intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
    }
    let boolContinue = false;
    boolContinue = true;
    let intArrayNextUtf8 = [];
    let intArrayRemaining = [];
    intArrayRemaining = intArrayIn;
    let intTempArrayCount = 0;
    intTempArrayCount = 0;
    let boolPastFirstBasenbRemainderChar = false;
    boolPastFirstBasenbRemainderChar = false;
    while (boolContinue) {
        if (await ne(0, await count(intArrayRemaining))) {
            intArrayNextUtf8 = await pack32(await lastCharOfUtf8String(intArrayRemaining));
        }
        else {
            intArrayNextUtf8 = [  ];
        }
        if (await implNot(await isBasenbChar(intArrayNextUtf8))) {
            if (await implEq(0, await count(intArrayRes))) {
                intArrayRes = intArrayNextUtf8;
            }
            boolContinue = false;
        }
        else {
            if (await isBasenbDistinctRemainderChar(intArrayNextUtf8)) {
                if (boolPastFirstBasenbRemainderChar) {
                    boolContinue = false;
                }
                else {
                    intArrayRes = await append(intArrayNextUtf8, intArrayRes);
                    intTempArrayCount = await count(intArrayNextUtf8);
                    intArrayRemaining = await anSubset(intArrayRemaining, 0, await implAdd(-1, await implMul(-1, intTempArrayCount)));
                    boolPastFirstBasenbRemainderChar = true;
                }
            }
            else {
                intArrayRes = await append(intArrayNextUtf8, intArrayRes);
                intTempArrayCount = await count(intArrayNextUtf8);
                intArrayRemaining = await anSubset(intArrayRemaining, 0, await implAdd(-1, await implMul(-1, intTempArrayCount)));
            }
        }
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(genericA, genericB) {
    await internalDebugCollect('generic A = ' + genericA + '; '); await internalDebugCollect('generic B = ' + genericB + '; '); await internalDebugStackEnter('ne:comparison'); await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ge:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function le(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('le:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ngt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ngt:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nlt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nlt:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nge:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nle(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nle:comparison'); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await le(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function runTestsWasm(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsWasm:wasm-tests'); await assertIsBool(boolV);

    await testing(boolV, 'wasm');
    await runTest(boolV, await implEq(42, await wasmCall('fortytwo', 0)));
    await runTest(boolV, await implEq(4, await wasmCallArrIn('add', [ 2, 2 ])));

    await internalDebugStackExit();
}

async function runTestsFormatUtf8(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatUtf8:format-utf8-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatUtf8');
    /* FIXME: Update tests for new remainder character format. */
    await runTest(boolV, await arrEq([ 35, 18, 36 ], await dcaFromUtf8([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50 ], await dcaToUtf8([ 35, 18, 36 ])));
    /* Test for converting to UTF8+dcbnb with only one unmappable char at the end */
    await runTest(boolV, await arrEq(await append([ 49, 32, 50 ], await append(await getArmoredUtf8EmbeddedStartUuid(), await append([ 244, 131, 173, 156, 239, 159, 185 ], await getArmoredUtf8EmbeddedEndUuid(), ), ), ), await dcaToDcbnbUtf8([ 35, 18, 36, 291 ])));
    /* Test for converting to UTF8+dcbnb with intermixed mappable and nonmappable */
    await runTest(boolV, await arrEq(await append([ 49, 32, 50 ], await append(await getArmoredUtf8EmbeddedStartUuid(), await append([ 244, 131, 173, 156, 239, 159, 185, 50 ], await getArmoredUtf8EmbeddedEndUuid(), ), ), ), await dcaToDcbnbUtf8([ 35, 18, 36, 291, 36 ])));
    /* Tests for converting from UTF8+dcbnb */
    await runTest(boolV, await arrEq([ 35, 18, 36, 291, 36 ], await dcaFromDcbnbUtf8(await append([ 49, 32, 50 ], await append(await getArmoredUtf8EmbeddedStartUuid(), await append([ 244, 131, 173, 156, 244, 143, 191, 173, 50 ], await getArmoredUtf8EmbeddedEndUuid()))))));
    await runTest(boolV, await arrEq([ 35, 18, 36, 291 ], await dcaFromDcbnbUtf8(await append([ 49, 32, 50 ], await append(await getArmoredUtf8EmbeddedStartUuid(), await append([ 244, 131, 173, 156, 244, 143, 191, 173 ], await getArmoredUtf8EmbeddedEndUuid()))))));
    /* Make sure the dcbnb region gets output at the right place relative to the other chars (there's a bug where it outputs 18 18 11 instead of 18 11 18) */
    await runTest(boolV, await arrEq([ 18, 11, 18 ], await dcaFromDcbnbUtf8(await append([ 32 ], await append(await getArmoredUtf8EmbeddedStartUuid(), await append([ 244, 143, 191, 180, 244, 143, 191, 181 ], await append(await getArmoredUtf8EmbeddedEndUuid(), [ 32 ])))))));
    /* Same as the previous test, but with the spaces inside the start and end UUIDs. Works even though the previous one failed. */
    await runTest(boolV, await arrEq([ 18, 11, 18 ], await dcaFromDcbnbUtf8(await append(await getArmoredUtf8EmbeddedStartUuid(), await append([ 32, 244, 143, 191, 180, 244, 143, 191, 181, 32 ], await getArmoredUtf8EmbeddedEndUuid())))));
    /* Like the test after next but with only the first region */
    await runTest(boolV, await arrEq([ 89, 7 ], await dcaFromDcbnbUtf8([ 104, 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 184, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ])));
    /* Second half of the subsequent test */
    await runTest(boolV, await arrEq([ 11 ], await dcaFromDcbnbUtf8([ 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 180, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ])));
    /* Two dcbnb regions: The two halves work separately, but fail when together */
    await runTest(boolV, await arrEq([ 89, 7, 11 ], await dcaFromDcbnbUtf8([ 104, 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 184, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157, 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 180, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ])));
    /* It fails without the leading h as well. The issue is that the ( 7 11 ) mysteriously becomes ( 65533 65533 ) when they are together. */
    await runTest(boolV, await arrEq([ 7, 11 ], await dcaFromDcbnbUtf8([ 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 184, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157, 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 180, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ])));
    /* With the h in the middle separating the two dcbnb regions */
    await runTest(boolV, await arrEq([ 7, 89, 11 ], await dcaFromDcbnbUtf8([ 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 184, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157, 104, 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144, 244, 143, 191, 180, 244, 143, 191, 181, 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ])));
    /* "h\u{10d05d}\u{10bd80}\u{fcde2}\u{fa00a}\u{f894e}\u{108e8d}\u{f22e0}\u{10fe90}\u{10fff8}\u{10fff5}\u{fc179}\u{f4daf}\u{10887a}\u{ff50a}\u{106ca6}\u{10de02}\u{f2030}\u{10ff1d}\u{10d05d}\u{10bd80}\u{fcde2}\u{fa00a}\u{f894e}\u{108e8d}\u{f22e0}\u{10fe90}\u{10fff4}\u{10fff5}\u{fc179}\u{f4daf}\u{10887a}\u{ff50a}\u{106ca6}\u{10de02}\u{f2030}\u{10ff1d}" "244,141,129,157,244,139,182,128,243,188,183,162,243,186,128,138,243,184,165,142,244,136,186,141,243,178,139,160,244,143,186,144,244,143,191,184,244,143,191,181,243,188,133,185,243,180,182,175,244,136,161,186,243,191,148,138,244,134,178,166,244,141,184,130,243,178,128,176,244,143,188,157" "244,141,129,157,244,139,182,128,243,188,183,162,243,186,128,138,243,184,165,142,244,136,186,141,243,178,139,160,244,143,186,144,244,143,191,180,244,143,191,181,243,188,133,185,243,180,182,175,244,136,161,186,243,191,148,138,244,134,178,166,244,141,184,130,243,178,128,176,244,143,188,157" */
    /* Test for a bug that results in the output being 16 uppercase letter Bs */
    await runTest(boolV, await arrEq([ 6 ], await dcaFromDcbnbFragmentUtf8([ 244, 143, 191, 185, 239, 160, 129 ])));
    /* A simple one with new format remainder character */
    await runTest(boolV, await arrEq([ 82, 86, 5 ], await dcaFromDcbnbFragmentUtf8([ 97, 101, 244, 143, 191, 186, 239, 160, 129 ])));
    /* Tests for dcbnbGetLastChar */
    /* 82 86 5 */
    await runTest(boolV, await arrEq([ 244, 143, 191, 186, 239, 160, 129 ], await dcbnbGetLastChar([ 97, 101, 244, 143, 191, 186, 239, 160, 129 ])));
    /* invalid */
    await runTest(boolV, await arrEq([  ], await dcbnbGetLastChar([ 239, 160, 129 ])));
    /* invalid */
    await runTest(boolV, await arrEq([  ], await dcbnbGetLastChar([ 97, 101, 244, 143, 191, 186 ])));
    /* invalid 82 */
    await runTest(boolV, await arrEq([ 82 ], await dcbnbGetLastChar([ 244, 143, 191, 186, 97 ])));
    /* Tests for dcbnbGetFirstChar */
    /* 5 82 86 */
    await runTest(boolV, await arrEq([ 244, 143, 191, 186, 239, 160, 129 ], await dcbnbGetFirstChar([ 244, 143, 191, 186, 239, 160, 129, 97, 101 ])));
    /* invalid */
    await runTest(boolV, await arrEq([  ], await dcbnbGetFirstChar([ 239, 160, 129 ])));
    /* invalid 82 86 */
    await runTest(boolV, await arrEq([  ], await dcbnbGetFirstChar([ 239, 160, 129, 97, 101 ])));
    /* invalid 82 86 */
    await runTest(boolV, await arrEq([  ], await dcbnbGetFirstChar([ 244, 143, 191, 186, 97, 101 ])));
    /* 86 invalid */
    await runTest(boolV, await arrEq([ 86 ], await dcbnbGetFirstChar([ 101, 244, 143, 191, 186 ])));
    /* Tests for utf8CharArrayFromByteArray and vice versa */
    await runTest(boolV, await arrEq([ 50, 53, 54, 32, 50, 53, 56, 32, 50, 54, 48, 32, 50, 54, 50, 32, 50, 54, 52, 32, 50, 54, 51, 32, 53, 55, 32, 56, 54, 32, 57, 51, 32, 57, 51, 32, 57, 54, 32, 51, 48, 32, 49, 56, 32, 50, 56, 54, 32, 55, 50, 32, 57, 54, 32, 57, 57, 32, 57, 51, 32, 56, 53, 32, 50, 56, 55, 32, 49, 57, 32, 49, 56, 32, 50, 56, 52, 32, 50, 54, 49, 32, 50, 53, 57, 32, 35, 32, 115, 97, 121, 32, 34, 72, 101, 108, 108, 111, 44, 32, 47, 87, 111, 114, 108, 100, 47, 33, 32, 9917, 34, 10, 49, 32, 50, 32, 35, 32, 9917, 10 ], await utf8CharArrayFromByteArray([ 50, 53, 54, 32, 50, 53, 56, 32, 50, 54, 48, 32, 50, 54, 50, 32, 50, 54, 52, 32, 50, 54, 51, 32, 53, 55, 32, 56, 54, 32, 57, 51, 32, 57, 51, 32, 57, 54, 32, 51, 48, 32, 49, 56, 32, 50, 56, 54, 32, 55, 50, 32, 57, 54, 32, 57, 57, 32, 57, 51, 32, 56, 53, 32, 50, 56, 55, 32, 49, 57, 32, 49, 56, 32, 50, 56, 52, 32, 50, 54, 49, 32, 50, 53, 57, 32, 35, 32, 115, 97, 121, 32, 34, 72, 101, 108, 108, 111, 44, 32, 47, 87, 111, 114, 108, 100, 47, 33, 32, 226, 154, 189, 34, 10, 49, 32, 50, 32, 35, 32, 226, 154, 189, 10 ])));
    await runTest(boolV, await arrEq([ 50, 53, 54, 32, 50, 53, 56, 32, 50, 54, 48, 32, 50, 54, 50, 32, 50, 54, 52, 32, 50, 54, 51, 32, 53, 55, 32, 56, 54, 32, 57, 51, 32, 57, 51, 32, 57, 54, 32, 51, 48, 32, 49, 56, 32, 50, 56, 54, 32, 55, 50, 32, 57, 54, 32, 57, 57, 32, 57, 51, 32, 56, 53, 32, 50, 56, 55, 32, 49, 57, 32, 49, 56, 32, 50, 56, 52, 32, 50, 54, 49, 32, 50, 53, 57, 32, 35, 32, 115, 97, 121, 32, 34, 72, 101, 108, 108, 111, 44, 32, 47, 87, 111, 114, 108, 100, 47, 33, 32, 226, 154, 189, 34, 10, 49, 32, 50, 32, 35, 32, 226, 154, 189, 10 ], await byteArrayFromUtf8CharArray([ 50, 53, 54, 32, 50, 53, 56, 32, 50, 54, 48, 32, 50, 54, 50, 32, 50, 54, 52, 32, 50, 54, 51, 32, 53, 55, 32, 56, 54, 32, 57, 51, 32, 57, 51, 32, 57, 54, 32, 51, 48, 32, 49, 56, 32, 50, 56, 54, 32, 55, 50, 32, 57, 54, 32, 57, 57, 32, 57, 51, 32, 56, 53, 32, 50, 56, 55, 32, 49, 57, 32, 49, 56, 32, 50, 56, 52, 32, 50, 54, 49, 32, 50, 53, 57, 32, 35, 32, 115, 97, 121, 32, 34, 72, 101, 108, 108, 111, 44, 32, 47, 87, 111, 114, 108, 100, 47, 33, 32, 9917, 34, 10, 49, 32, 50, 32, 35, 32, 9917, 10 ])));

    await internalDebugStackExit();
}

async function listDcDatasets() {
    await internalDebugStackEnter('listDcDatasets:dc-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'DcData', 'formats', 'mappings/from/ascii', 'mappings/from/unicode', 'mappings/to/html', 'mappings/to/unicode' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function dcGetColumn(strDataset, intColumn) {
    await internalDebugCollect('str Dataset = ' + strDataset + '; '); await internalDebugCollect('int Column = ' + intColumn + '; '); await internalDebugStackEnter('dcGetColumn:dc-data'); await assertIsStr(strDataset); await assertIsInt(intColumn); let strArrayReturn;

    let strArrayRes = [];
    let intCount = 0;
    intCount = await dcDatasetLength(strDataset);
    let intI = 0;
    while (await implLt(intI, intCount)) {
        strArrayRes = await push(strArrayRes, await dcDataLookupById(strDataset, intI, intColumn));
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getDcCount() {
    await internalDebugStackEnter('getDcCount:dc-data'); let intReturn;

    let intRes = 0;
    intRes = await dcDatasetLength('DcData');
}

async function isDcDataset(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isDcDataset:dc-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listDcDatasets(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcGetField(intDc, intFieldNumber) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugCollect('int FieldNumber = ' + intFieldNumber + '; '); await internalDebugStackEnter('dcGetField:dc-data'); await assertIsInt(intDc); await assertIsInt(intFieldNumber); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcDataLookupById('DcData', intDc, intFieldNumber);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetName(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetName:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 1);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetCombiningClass(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetCombiningClass:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 2);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetBidiClass(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetBidiClass:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 3);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetCasing(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetCasing:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 4);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetType(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetType:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 5);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetScript(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetScript:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 6);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetComplexTraits(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetComplexTraits:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 7);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcGetDescription(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcGetDescription:dc-data'); await assertIsInt(intDc); let strReturn;

    await assertIsDc(intDc);
    let strRes = '';
    strRes = await dcGetField(intDc, 8);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

/* Note that the Basenb formats provided here are different from the Base16b formats in the specification, due to what appears to be a bug in the specification (requiring the remainder length to be stored to decode the remainder correctly when it starts with a 0 bit and is not 16 bits long). */

async function byteToIntBitArray(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('byteToIntBitArray:basenb-utf8'); await assertIsInt(intIn); let intArrayReturn;

    await assertIsByte(intIn);
    let intArrayRes = [];
    let strTemp = '';
    strTemp = await intToBaseStr(intIn, 2);
    let intLen = 0;
    let intI = 0;
    intLen = await len(strTemp);
    let intArrayZero = [];
    intArrayZero = [ 0 ];
    while (await implLt(intI, intLen)) {
        intArrayRes = await push(intArrayRes, await intFromIntStr(await strChar(strTemp, intI)));
        intI = await implAdd(intI, 1);
    }
    while (await implGt(8, await count(intArrayRes))) {
        intArrayRes = await push(intArrayZero, intArrayRes);
    }
    await assertIsIntBitArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteFromIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteFromIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intReturn;

    await assertIsIntBitArray(intArrayIn);
    let intRes = 0;
    let strTemp = '';
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    while (await implLt(intI, intLen)) {
        strTemp = await implCat(strTemp, await strFrom(await get(intArrayIn, intI)));
        intI = await implAdd(intI, 1);
    }
    intRes = await intFromBaseStr(strTemp, 2);
    await assertIsByte(intRes);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function byteArrayToIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    while (await implLt(intI, intLen)) {
        intArrayRes = await push(intArrayRes, await byteToIntBitArray(await get(intArrayIn, intI)));
        intI = await implAdd(intI, 1);
    }
    await assertIsIntBitArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsIntBitArray(intArrayIn);
    let intArrayRes = [];
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    let intArrayTemp = [];
    while (await le(intI, intLen)) {
        if (await implAnd(await implEq(0, await implMod(intI, 8), ), await implNot(await implEq(0, await count(intArrayTemp))))) {
            intArrayRes = await push(intArrayRes, await byteFromIntBitArray(intArrayTemp));
            intArrayTemp = [  ];
        }
        if (await implLt(intI, intLen)) {
            intArrayTemp = await push(intArrayTemp, await get(intArrayIn, intI));
        }
        intI = await implAdd(intI, 1);
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isBasenbBase(intBase) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugStackEnter('isBasenbBase:basenb-utf8'); await assertIsInt(intBase); let boolReturn;

    let boolRes = false;
    boolRes = await intIsBetween(intBase, 7, 17);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBasenbChar(intArrayUtf8Char) {
    await internalDebugCollect('intArray Utf8Char = ' + intArrayUtf8Char + '; '); await internalDebugStackEnter('isBasenbChar:basenb-utf8'); await assertIsIntArray(intArrayUtf8Char); let boolReturn;

    let boolRes = false;
    boolRes = false;
    if (await implNot(await isPack32Char(intArrayUtf8Char))) {

        boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intCodepoint = 0;
    intCodepoint = await unpack32(intArrayUtf8Char);
    if (await intIsBetween(intCodepoint, 983040, 1048573)) {
        boolRes = true;
    }
    else if (await intIsBetween(intCodepoint, 1048576, 1114109)) {
        boolRes = true;
    }
    else if (await intIsBetween(intCodepoint, 63481, 63501)) {
        boolRes = true;
    }

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBasenbDistinctRemainderChar(intArrayUtf8Char) {
    await internalDebugCollect('intArray Utf8Char = ' + intArrayUtf8Char + '; '); await internalDebugStackEnter('isBasenbDistinctRemainderChar:basenb-utf8'); await assertIsIntArray(intArrayUtf8Char); let boolReturn;

    let boolRes = false;
    boolRes = false;
    if (await implNot(await isPack32Char(intArrayUtf8Char))) {

        boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intCodepoint = 0;
    intCodepoint = await unpack32(intArrayUtf8Char);
    if (await intIsBetween(intCodepoint, 63481, 63497)) {
        boolRes = true;
    }

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function byteArrayToBasenbUtf8(intBase, intArrayIn) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToBasenbUtf8:basenb-utf8'); await assertIsInt(intBase); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsTrue(await isBasenbBase(intBase));
    await assertIsByteArray(intArrayIn);
    let intArrayInputIntBitArray = [];
    intArrayInputIntBitArray = await byteArrayToIntBitArray(intArrayIn);
    let intArrayRes = [];
    intArrayRes = await internalIntBitArrayToBasenbString(intBase, intArrayInputIntBitArray);
    /* The remainder length also needs to be stored, to be able to decode successfully. We'll calculate, encode, and append it. It's always 4 bytes, 1 UTF-8 character, and 2 UTF-16 characters long, after encoding (it has 2 added to it to make it always be the same byte length and UTF-16 length; this must be subtracted before passing it to the Base16b.decode function). */
    /* Previous version, which doesn't provide clear end-of-character markers: */
    /* new an/remainder */
    /* set an/remainder push an/remainder add 2 mod count an/inputIntBitArray } 17 */
    /* set an/res push an/res internalIntBitArrayToBasenbString 17 byteArrayToIntBitArray an/remainder */
    intArrayRes = await push(intArrayRes, await pack32(await implSub(63497, await implMod(await count(intArrayInputIntBitArray), 17))));
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromBasenbUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromBasenbUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    /* Extract remainder length */
    let intRemainder = 0;
    let intArrayRemainderArr = [];
    /* last 3 bytes (1 character), which represent the remainder */
    intArrayRemainderArr = await anSubset(intArrayIn, -3, -1);
    if (await implNot(await isBasenbDistinctRemainderChar(intArrayRemainderArr))) {
        /* last 4 bytes (1 character), which represent the remainder */
        intArrayRemainderArr = await anSubset(intArrayIn, -4, -1);
        let intArrayRemainderDecodedArr = [];
        intArrayRemainderDecodedArr = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayRemainderArr, 8));
        intRemainder = await implAdd(-2, await get(intArrayRemainderDecodedArr, 0));
    }
    else {
        intRemainder = await implSub(63497, await unpack32(intArrayRemainderArr));
    }
    if (await ngt(await count(intArrayIn), await count(intArrayRemainderArr))) {
        /* All we have is a remainder, or a chunk of a character without a remainder, so return an exception UUID to represent the error (3362daa3-1705-40ec-9a97-59d052fd4037) */
        intArrayRes = [ 51, 98, 218, 163, 23, 5, 64, 236, 154, 151, 89, 208, 82, 253, 64, 55 ];

        intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
    }
    intArrayRes = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(await anSubset(intArrayIn, 0, await implAdd(-1, await implMul(-1, await count(intArrayRemainderArr), ), ), ), intRemainder));
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayToBase17bUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToBase17bUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    /* Convenience wrapper */
    let intArrayRes = [];
    intArrayRes = await byteArrayToBasenbUtf8(17, intArrayIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromBase17bUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromBase17bUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    /* Convenience wrapper */
    let intArrayRes = [];
    intArrayRes = await byteArrayFromBasenbUtf8(intArrayIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getArmoredUtf8EmbeddedStartUuid() {
    await internalDebugStackEnter('getArmoredUtf8EmbeddedStartUuid:basenb-utf8'); let intArrayReturn;

    /* start UUID=e82eef60-19bc-4a00-a44a-763a3445c16f */
    /*new an/startUuid */
    /*set an/startUuid ( 232 46 239 96 25 188 74 0 164 74 118 58 52 69 193 111 ) */
    /* byteArrayToIntBitArray([ 232, 46, 239, 96, 25, 188, 74, 0, 164, 74, 118, 58, 52, 69, 193, 111 ]).then(function(v){return new TextEncoder().encode(Base16b.encode(v, 17));}).then(function(v){console.log(v.toString());}) */
    /* UTF8 in binary: 1,1,1,1,0,1,0,0,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,1,1,1,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,1,1,0,1,1,1,1,1,0,0,1,1,1,0,1,1,0,0,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,0,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0 */
    /* Note that the remainder length for the encoded UUID is 9. */
    let intArrayStartUuidUtf8 = [];
    intArrayStartUuidUtf8 = [ 244, 141, 129, 157, 244, 139, 182, 128, 243, 188, 183, 162, 243, 186, 128, 138, 243, 184, 165, 142, 244, 136, 186, 141, 243, 178, 139, 160, 244, 143, 186, 144 ];

    intArrayReturn = intArrayStartUuidUtf8; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
