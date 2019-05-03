// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/* This file contains the public interface for EITE. */
/* If you just want to run EITE, use the following function. */

async function startEite() {
    

    /* Start EITE, using the default startup document. Does not return while EITE is still running. */
    await loadAndRun('sems', 'eite.sems');

    
}
/* If you want to run a different document, you can call loadAndRun with the format of the document to open and its location. */

async function loadAndRun(strFormat, strPath) {
     

    /* Load and run the specified document. Does not return while the document is still running. */
    await runDocument(await loadStoredDocument(strFormat, strPath));

    
}
/* If you want to convert a document to another format, you can call loadAndConvert with the format of the document, its location, and the format you want the results in. */

async function loadAndConvert(strInputFormat, strOutputFormat, strPath) {
      let intArrayReturn;

    /* Load the specified document, and return it converted to the specified outputFormat as an array of bytes. */
    let intArrayOut = [];
    intArrayOut = await exportDocument(strOutputFormat, await loadStoredDocument(strInputFormat, strPath), );
}
/* To operate on a document you already have as a Dc array, you can call runDocument or convertDocument directly on it. Or, if you already have it as a byte array, you can call importDocument or importAndExport on it. */

async function runDocument(intArrayContents) {
     

    /* Run the provided document. Does not return while the document is still running. Takes care of events and I/O automatically. */
    await runDocumentGo(await runDocumentPrepare(intArrayContents));

    
}

async function runDocumentPrepare(intArrayContents) {
      let intReturn;

    /* Prepare to run the provided document. Use this followed by runDocumentGo if you want to configure execution settings before starting the document. */
    await setupIfNeeded();
    await assertIsDcArray(intArrayContents);
    let intExecId = 0;
    intExecId = await prepareDocumentExec(intArrayContents);
    await assertIsExecId(intExecId);

    intReturn = intExecId;  return intReturn;
}

async function runDocumentGo(intExecId) {
     

    /* Run a document, once it's been prepared to run by calling runDocumentPrepare. */
    await internalRunDocument(intExecId);

    
}

async function getExecOption(intExecId, strKey) {
      let strReturn;

    /* Get the value of an execution option for a document. */
    await setupIfNeeded();
    await assertIsExecId(intExecId);
    let strRes = '';
    strRes = await kvGetValue(await getExecSettings(intExecId), strKey);

    strReturn = strRes;  return strReturn;
}

async function getExecOptions(intExecId) {
      let strArrayReturn;

    /* Get the execution options set for a document. */
    await setupIfNeeded();
    await assertIsExecId(intExecId);
    let strArrayRes = [];
    strArrayRes = await getExecSettings(intExecId);

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function setExecOption(intExecId, strKey, strValue) {
     

    /* Set an execution option for a document. */
    await setupIfNeeded();
    await assertIsExecId(intExecId);
    await setExecSettings(intExecId, await kvSetValue(await getExecSettings(intExecId), strKey, strValue));

    
}

async function exportDocument(strFormat, intArrayContents) {
      let intArrayReturn;

    await setupIfNeeded();
    await assertIsSupportedOutputFormat(strFormat);
    /* Convert a document stored as an array of dcs to the specified format, and return it as an array of bytes. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaToFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut;  return intArrayReturn;
}

async function importDocument(strFormat, intArrayContents) {
      let intArrayReturn;

    await setupIfNeeded();
    await assertIsSupportedInputFormat(strFormat);
    /* Convert a document stored as an array of bytes in the specified format, and return it as an array of dc. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaFromFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut;  return intArrayReturn;
}

async function importAndExport(strInputFormat, strOutputFormat, intArrayContents) {
      let intArrayReturn;

    await setupIfNeeded();
    await assertIsSupportedInputFormat(strInputFormat);
    await assertIsSupportedOutputFormat(strOutputFormat);
    /* Convert a document stored as an array of bytes in the specified input format, and return it as an array of bytes in the specified output format. */
    let intArrayOut = [];
    intArrayOut = await convertFormats(strInputFormat, strOutputFormat, intArrayContents);

    intArrayReturn = intArrayOut;  return intArrayReturn;
}

async function getFormatImportSetting(strFormat, strKey) {
      let strReturn;

    /* Return the value of the specified import setting for the specified format. */
    let strRes = '';
    strRes = await kvGetValue(await getFormatImportSettings(strFormat), strKey);

    strReturn = strRes;  return strReturn;
}

async function getFormatExportSetting(strFormat, strKey) {
      let strReturn;

    /* Return the value of the specified export setting for the specified format. */
    let strRes = '';
    strRes = await kvGetValue(await getFormatExportSettings(strFormat), strKey);

    strReturn = strRes;  return strReturn;
}

async function setFormatImportSetting(strFormat, strKey, strValue) {
     

    /* Set the value of the specified import setting for the specified format. */
    await setFormatImportSettings(strFormat, await kvSetValue(await getFormatImportSettings(strFormat), strKey, strValue));

    
}

async function setFormatExportSetting(strFormat, strKey, strValue) {
     

    /* Set the value of the specified export setting for the specified format. */
    await setFormatExportSettings(strFormat, await kvSetValue(await getFormatExportSettings(strFormat), strKey, strValue));

    
}

async function pushFormatImportSetting(strFormat, strKey, strValue) {
      let strReturn;

    /* Temporarily set the value of the specified import setting for the specified format. Call setFormatImportSetting with the value this returns when you want to put the setting back. */
    let strResult = '';
    strResult = await getFormatImportSetting(strFormat, strKey);
    await setFormatImportSetting(strFormat, strKey, strValue);

    strReturn = strResult;  return strReturn;
}

async function pushFormatExportSetting(strFormat, strKey, strValue) {
      let strReturn;

    /* Temporarily set the value of the specified export setting for the specified format. Call setFormatExportSetting with the value this returns when you want to put the setting back. */
    let strResult = '';
    strResult = await getFormatExportSetting(strFormat, strKey);
    await setFormatExportSetting(strFormat, strKey, strValue);

    strReturn = strResult;  return strReturn;
}

async function getFormatImportSettings(strFormat) {
      let strArrayReturn;

    /* Return the import settings array for the specified format. */
    await setupIfNeeded();
    await assertIsSupportedInputFormat(strFormat);
    let strArrayRes = [];
    strArrayRes = await getSettingsForFormat(strFormat, 'in');

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function getFormatExportSettings(strFormat) {
      let strArrayReturn;

    /* Return the export settings array for the specified format. */
    await setupIfNeeded();
    await assertIsSupportedOutputFormat(strFormat);
    let strArrayRes = [];
    strArrayRes = await getSettingsForFormat(strFormat, 'out');

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function setFormatImportSettings(strFormat, strArraySettings) {
     

    /* Replace the import settings array for the specified format. */
    await setupIfNeeded();
    await assertIsSupportedInputFormat(strFormat);
    await setImportSettings(await getFormatId(strFormat), await kvJoin(strArraySettings));

    
}

async function setFormatExportSettings(strFormat, strArraySettings) {
     

    /* Replace the export settings array for the specified format. */
    await setupIfNeeded();
    await assertIsSupportedOutputFormat(strFormat);
    await setExportSettings(await getFormatId(strFormat), await kvJoin(strArraySettings));

    
}

async function transformDocument(intArrayInputDocument, strTransformation) {
      let intArrayReturn;

    /* Apply one of the supported document transformations to the provided document, and return the result. */
    await setupIfNeeded();
    await assertIsSupportedDocumentTransformation(strTransformation);
    let intArrayResult = [];
    intArrayResult = await applyDocumentTransformation(strTransformation, intArrayInputDocument);

    intArrayReturn = intArrayResult;  return intArrayReturn;
}
/* If you want more control over the document loading and execution, you can use these lower-level functions. */

async function loadStoredDocument(strFormat, strPath) {
      let intArrayReturn;

    /* Load and return the specified document as a Dc array. */
    await setupIfNeeded();
    await assertIsSupportedInputFormat(strFormat);
    let intArrayRes = [];
    intArrayRes = await dcaFromFormat(strFormat, await getFileFromPath(strPath));

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function getDesiredEventNotifications(intExecId) {
      let strArrayReturn;

    /* Return list of event types (e.g. keystrokes, mouse movement, elapsed time) that the document wants to be notified of. */
    let strArrayRes = [];

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function sendEvent(intExecId, intArrayEventData) {
      let intArrayReturn;

    /* Send the provided event or events data to the specified document. */
}

async function getDocumentFrame(intExecId, strFormat) {
      let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Return the most recently available output for the given document in the requested format. */
}
/* To run the tests, you can use runTests or runPrintTests. */

async function runTests() {
     let boolReturn;

    /* Returns true if all tests pass; false otherwise. Displays a report of the tests. */
    await setupIfNeeded();
    await clearTestStats();
    await runTestsOnly(true);
    await reportTests();
    if (await implEq(intFailedTests, 0)) {

        boolReturn = true;  return boolReturn;
    }

    boolReturn = false;  return boolReturn;
}

async function quietRunTests() {
     let boolReturn;

    /* Returns true if all tests pass; false otherwise. */
    await setupIfNeeded();
    let boolRes = false;
    boolRes = await runTestsOnly(false);

    boolReturn = boolRes;  return boolReturn;
}

async function strChar(strStr, intIndex) {
      let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp;  return strReturn;
}

async function strCharAtPos(strStr, intIndex) {
      let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp;  return strReturn;
}

async function charAtPos(strStr, intIndex) {
      let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp;  return strReturn;
}

async function charAt(strStr, intIndex) {
      let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp;  return strReturn;
}

async function setCharAt(strStr, intIndex, strChar) {
      let strReturn;

    let strRes = '';
    let intFirstEnd = 0;
    let intLastStart = 0;
    intFirstEnd = await implSub(await len(strStr), await dec(intIndex));
    intLastStart = await implSub(await len(strStr), await inc(intIndex));
    strRes = await implCat(await substr(strStr, 0, intFirstEnd), await implCat(strChar, await substr(strStr, intLastStart, -1)));

    strReturn = strRes;  return strReturn;
}

async function reverseStr(strStr) {
      let strReturn;

    let intL = 0;
    intL = await len(strStr);
    let intC = 0;
    intC = 0;
    let strRes = '';
    while (await le(intC, intL)) {
        strRes = await implCat(strRes, await strCharAtPos(strStr, await implSub(intL, intC)));
        intC = await implAdd(1, intC);
    }

    strReturn = strRes;  return strReturn;
}

async function charToUpper(strChar) {
      let strReturn;

    await assertIsChar(strChar);
    let intTemp = 0;
    intTemp = await byteFromChar(strChar);
    if (await intIsBetween(intTemp, 97, 122)) {
        intTemp = await implSub(intTemp, 32);
    }
    let strRes = '';
    strRes = await charFromByte(intTemp);

    strReturn = strRes;  return strReturn;
}

async function strToUpper(strStr) {
      let strReturn;

    let strRes = '';
    let intI = 0;
    intI = 0;
    let intCount = 0;
    intCount = await len(strStr);
    while (await implLt(intI, intCount)) {
        strRes = await implCat(strRes, await charToUpper(await strCharAtPos(strStr, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strRes;  return strReturn;
}

async function charToLower(strChar) {
      let strReturn;

    await assertIsChar(strChar);
    let intTemp = 0;
    intTemp = await byteFromChar(strChar);
    if (await intIsBetween(intTemp, 65, 90)) {
        intTemp = await implAdd(intTemp, 32);
    }
    let strRes = '';
    strRes = await charFromByte(intTemp);

    strReturn = strRes;  return strReturn;
}

async function strToLower(strStr) {
      let strReturn;

    let strRes = '';
    let intI = 0;
    intI = 0;
    let intCount = 0;
    intCount = await len(strStr);
    while (await implLt(intI, intCount)) {
        strRes = await implCat(strRes, await charToLower(await strCharAtPos(strStr, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strRes;  return strReturn;
}

async function strEmpty(strStr) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implEq(0, await len(strStr));

    boolReturn = boolRes;  return boolReturn;
}

async function strNonempty(strStr) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await strEmpty(strStr));

    boolReturn = boolRes;  return boolReturn;
}

async function substr(strStr, intStart, intLen) {
      let strReturn;

    /* Convenience wrapper */
    let strRes = '';
    strRes = await substring(strStr, intStart, intLen);

    strReturn = strRes;  return strReturn;
}

async function strContainsOnlyInt(strIn) {
      let boolReturn;

    /* Positive int, specifically. Only digits allowed. */
    let intTemp = 0;
    intTemp = await len(strIn);
    let intI = 0;
    intI = 0;
    let boolRes = false;
    boolRes = true;
    while (await implLt(intI, intTemp)) {
        if (await implNot(await asciiIsDigit(await byteFromChar(await strCharAtPos(strIn, intI))))) {
            boolRes = false;
        }
        intI = await implAdd(intI, 1);
    }

    boolReturn = boolRes;  return boolReturn;
}

async function isValidIdent(strIn) {
      let strReturn;

    /* Doesn't check for duplicate idents or whatever. Just makes sure the basic form is correct. */
    let intTemp = 0;
    intTemp = await len(strIn);
    let intI = 0;
    intI = 0;
    let boolRes = false;
    boolRes = true;
    let intCurrentCharByte = 0;
    while (await implLt(intI, intTemp)) {
        intCurrentCharByte = await byteFromChar(await strCharAtPos(strIn, intI));
        if (await implEq(intI, 0)) {
            /* First character can only be lowercase letter */
            if (await implNot(await asciiIsLetterLower(intCurrentCharByte))) {
                boolRes = false;
            }
        }
        else if (await implNot(await or(await asciiIsDigit(intCurrentCharByte), await asciiIsLetter(intCurrentCharByte)))) {
            boolRes = false;
        }
        intI = await implAdd(intI, 1);
    }

    strReturn = boolRes;  return strReturn;
}

async function prepareStrForEcho(strIn) {
      let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await convertFormats('ascii', await getEnvPreferredFormat(), await append(await strToByteArray(strIn), await crlf()));

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function runTestsTypeConversion(boolV) {
     

    await testing(boolV, 'typeConversion');
    await runTest(boolV, await arrEq([ 'a', 'b', 'c' ], await strSplit('a,b,c', ',')));
    await runTest(boolV, await arrEq([ 'a', 'b', 'c' ], await strSplit('aabbabc', 'ab')));
    await runTest(boolV, await arrEq([ 'a', 'b', 'c', '' ], await strSplit('aabbabcab', 'ab')));
    await runTest(boolV, await arrEq([ '', 'c' ], await strSplit('abc', 'ab')));
    await runTest(boolV, await arrEq([ '', '', 'baa' ], await strSplit('ababbaa', 'ab')));
    await runTest(boolV, await arrEq([ 'a', '' ], await strSplit('aab', 'ab')));
    await runTest(boolV, await arrEq([ '', 'a', '' ], await strSplit('abaab', 'ab')));
    await runTest(boolV, await arrEq([ '', 'a', '', '' ], await strSplit('abaabab', 'ab')));
    await runTest(boolV, await arrEq([ '', '', '' ], await strSplit('abab', 'ab')));
    await runTest(boolV, await arrEq([ '', '' ], await strSplit('ab', 'ab')));
    await runTest(boolV, await arrEq([ '', '', '' ], await strSplit(await strJoin(await strSplit('abab', 'ab'), 'ab'), 'ab')));

    
}

async function abSubset(boolArrayIn, intStart, intEnd) {
      let boolArrayReturn;

    let intCount = 0;
    intCount = await count(boolArrayIn);
    if (await implLt(intStart, 0)) {
        intStart = await implAdd(intCount, intStart);
    }
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    let intI = 0;
    intI = intStart;
    intCount = intEnd;
    let boolArrayRes = [];
    while (await le(intI, intCount)) {
        boolArrayRes = await push(boolArrayRes, await get(boolArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    boolArrayReturn = boolArrayRes;  return boolArrayReturn;
}

async function anSubset(intArrayIn, intStart, intEnd) {
      let intArrayReturn;

    let intCount = 0;
    intCount = await count(intArrayIn);
    if (await implLt(intStart, 0)) {
        intStart = await implAdd(intCount, intStart);
    }
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    let intI = 0;
    intI = intStart;
    intCount = intEnd;
    let intArrayRes = [];
    while (await le(intI, intCount)) {
        intArrayRes = await push(intArrayRes, await get(intArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function asSubset(strArrayIn, intStart, intEnd) {
      let strArrayReturn;

    let intCount = 0;
    intCount = await count(strArrayIn);
    if (await implLt(intStart, 0)) {
        intStart = await implAdd(intCount, intStart);
    }
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    let intI = 0;
    intI = intStart;
    intCount = intEnd;
    let strArrayRes = [];
    while (await le(intI, intCount)) {
        strArrayRes = await push(strArrayRes, await get(strArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function abFromB(boolIn) {
      let boolArrayReturn;

    let boolArrayRes = [];
    boolArrayRes = await push(boolArrayRes, boolIn);

    boolArrayReturn = boolArrayRes;  return boolArrayReturn;
}

async function anFromN(intIn) {
      let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await push(intArrayRes, intIn);

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function asFromS(strIn) {
      let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await push(strArrayRes, strIn);

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function contains(genericArrayIn, genericValue) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implEq(genericElem, genericValue)) {

            boolReturn = true;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = false;  return boolReturn;
}

async function implIn(genericValue, genericArrayIn) {
      let boolReturn;

    /* Convenience wrapper */
    let boolRes = false;
    boolRes = await contains(genericArrayIn, genericValue);

    boolReturn = boolRes;  return boolReturn;
}

async function indexOf(genericArrayIn, genericValue) {
      let intReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let intCounter = 0;
    intCounter = 0;
    let genericElem;
    while (await implLt(intCounter, intCount)) {
        genericElem = await get(genericArrayIn, intCounter);
        if (await implEq(genericElem, genericValue)) {

            intReturn = intCounter;  return intReturn;
        }
        intCounter = await implAdd(intCounter, 1);
    }

    intReturn = -1;  return intReturn;
}

async function arrEmpty(genericArrayIn) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implEq(0, await count(genericArrayIn));

    boolReturn = boolRes;  return boolReturn;
}

async function arrNonempty(genericArrayIn) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await arrEmpty(genericArrayIn));

    boolReturn = boolRes;  return boolReturn;
}

async function isArray(genericItemIn) {
      let boolReturn;

    /* Just a convenience wrapper */
    let boolRes = false;
    boolRes = await isGenericArray(genericItemIn);

    boolReturn = boolRes;  return boolReturn;
}

async function arrEq(genericArrayA, genericArrayB) {
      let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayA);
    if (await ne(intCount, await count(genericArrayB))) {

        boolReturn = false;  return boolReturn;
    }
    let genericElem;
    let intI = 0;
    while (await implLt(intI, intCount)) {
        genericElem = await get(genericArrayA, intI);
        if (await ne(genericElem, await get(genericArrayB, intI))) {

            boolReturn = false;  return boolReturn;
        }
        intI = await implAdd(intI, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isIntArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isInt(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isStrArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isStr(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isBoolArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isBool(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isCharArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isChar(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isByteArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isByte(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isIntBitArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isIntBit(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function isDcArray(genericArrayIn) {
      let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isDc(genericElem))) {

            boolReturn = false;  return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true;  return boolReturn;
}

async function sumArray(intArrayIn) {
      let intReturn;

    let intCount = 0;
    intCount = await implSub(await count(intArrayIn), 1);
    let intRes = 0;
    while (await ge(intCount, 0)) {
        intRes = await implAdd(intRes, await get(intArrayIn, intCount));
        intCount = await implSub(intCount, 1);
    }

    intReturn = intRes;  return intReturn;
}

/* Can check for exception as result like: if eq s/res dcDataNoResultException */

async function dcDataNoResultException() {
     let strReturn;


    strReturn = '89315802-d53d-4d11-ba5d-bf505e8ed454';  return strReturn;
}

async function byteArrayFromBasenbUtf8InvalidInputException() {
     let strReturn;

    /* It doesn't look like a normal UUID since it's an an/ function, so call strPrintArray on it to get the value as a string that can be compared using excep. (just use excepArr instead, which does this for you) */

    strReturn = '51 98 218 163 23 5 64 236 154 151 89 208 82 253 64 55 ';  return strReturn;
}

async function excep(strTest) {
      let boolReturn;

    let boolRes = false;
    boolRes = false;
    /* Test for each exception type in turn */
    boolRes = await or(boolRes, await implEq(strTest, await dcDataNoResultException()));
    boolRes = await or(boolRes, await implEq(strTest, await byteArrayFromBasenbUtf8InvalidInputException()));

    boolReturn = boolRes;  return boolReturn;
}

async function notExcep(strTest) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excep(strTest));

    boolReturn = boolRes;  return boolReturn;
}

async function excepArr(genericArrayTest) {
      let boolReturn;

    let boolRes = false;
    boolRes = await excep(await strPrintArray(genericArrayTest));

    boolReturn = boolRes;  return boolReturn;
}

async function notExcepArr(genericArrayTest) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excepArr(genericArrayTest));

    boolReturn = boolRes;  return boolReturn;
}

async function excOrEmpty(strTest) {
      let boolReturn;

    let boolRes = false;
    boolRes = await or(await excep(strTest), await strEmpty(strTest));

    boolReturn = boolRes;  return boolReturn;
}

async function notExcOrEmpty(strTest) {
      let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excOrEmpty(strTest));

    boolReturn = boolRes;  return boolReturn;
}

async function strPrintArr(genericArrayIn) {
      let strReturn;

    /* The reverse of this for an/ input is intArrFromStrPrintedArr. */
    /* Hint: running this on a DcArray produces a sems document that can be turned back into a DcArray with dcarrParseSems strToByteArray s/str :) */
    let strOut = '';
    strOut = await strJoin(genericArrayIn, ' ');

    strReturn = strOut;  return strReturn;
}

async function printArray(genericArrayIn) {
      let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes;  return strReturn;
}

async function strPrintArray(genericArrayIn) {
      let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes;  return strReturn;
}

async function printArr(genericArrayIn) {
      let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes;  return strReturn;
}

async function strSplit(strIn, strSeparator) {
      let strArrayReturn;

    let strArrayRes = [];
    let intSeparLen = 0;
    intSeparLen = await len(strSeparator);
    let strRemaining = '';
    strRemaining = strIn;
    let intRemainingLen = 0;
    intRemainingLen = await len(strRemaining);
    let strCurrentElem = '';
    let strCurrentChar = '';
    while (await implLt(0, intRemainingLen)) {
        if (await implEq(strSeparator, await substr(strRemaining, 0, intSeparLen))) {
            strArrayRes = await push(strArrayRes, strCurrentElem);
            strCurrentElem = '';
            strRemaining = await substr(strRemaining, intSeparLen, -1);
        }
        else {
            strCurrentChar = await strChar(strRemaining, 0);
            strCurrentElem = await implCat(strCurrentElem, strCurrentChar);
            if (await implLt(1, intRemainingLen)) {
                strRemaining = await substr(strRemaining, 1, -1);
            }
            else {
                strRemaining = '';
            }
        }
        intRemainingLen = await len(strRemaining);
    }
    strArrayRes = await push(strArrayRes, strCurrentElem);

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function strJoin(genericArrayIn, strSeparator) {
      let strReturn;

    /* Opposite of strSplit for a given separator */
    let intCount = 0;
    intCount = await count(genericArrayIn);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (await implLt(intI, intCount)) {
        strOut = await implCat(strOut, await strFrom(await get(genericArrayIn, intI)));
        if (await ne(intI, await implAdd(-1, intCount))) {
            strOut = await implCat(strOut, strSeparator);
        }
        intI = await implAdd(intI, 1);
    }

    strReturn = strOut;  return strReturn;
}

async function strSplitEscaped(strIn, strSeparator) {
      let strArrayReturn;

    let strArrayRes = [];
    let strArrayExploded = [];
    strArrayExploded = await strSplit(strIn, strSeparator);
    strArrayRes = [  ];
    let intK = 0;
    let intL = 0;
    intK = 0;
    intL = await count(strArrayExploded);
    let boolContinue = false;
    boolContinue = true;
    let strTemp = '';
    let strArrayTempSubset = [];
    while (await implAnd(boolContinue, await implLt(intK, intL))) {
        if (await implEq('\\\\', await charAt(await get(strArrayExploded, intK), await implAdd(-1, await len(await get(strArrayExploded, intK)))))) {
            if (await ge(await implAdd(1, intK), intL)) {
                strArrayRes = await push(strArrayRes, await get(strArrayExploded, intK));
                boolContinue = false;
            }
            strTemp = await setCharAt(await get(strArrayExploded, intK), await dec(await len(await get(strArrayExploded, intK), ), ), strSeparator);
            await setElem(strArrayExploded, intK, strTemp);
            /*array_splice($exploded, $k + 1, 1); // https://www.php.net/manual/en/function.array-splice.php */
            strArrayTempSubset = await subset(strArrayExploded, await implAdd(1, intK), await implAdd(2, intK));
            strArrayExploded = await append(strArrayTempSubset, await subset(strArrayExploded, await implAdd(2, intK), -1));
            intL = await dec(intL);
            intK = await dec(intK);
        }
        else {
            strArrayRes = await push(strArrayRes, await get(strArrayExploded, intK));
        }
        intK = await implAdd(1, intK);
    }

    strArrayReturn = strArrayRes;  return strArrayReturn;
    /* Based on the explode_esc PHP function: */
    /*//explode_escaped (not written by me) */
    /*function explode_esc($delimiter, $string) */
    /*{ */
    /*    $exploded = explode($delimiter, $string); */
    /*    $fixed    = array(); */
    /*    for ($k = 0, $l = count($exploded); $k < $l; ++$k) { */
    /*        if ($exploded[$k][strlen($exploded[$k]) - 1] == '\\') { */
    /*            if ($k + 1 >= $l) { */
    /*                $fixed[] = trim($exploded[$k]); */
    /*                break; */
    /*            } */
    /*            $exploded[$k][strlen($exploded[$k]) - 1] = $delimiter; */
    /*            $exploded[$k] .= $exploded[$k + 1]; */
    /*            array_splice($exploded, $k + 1, 1); */
    /*            --$l; */
    /*            --$k; */
    /*        } else */
    /*            $fixed[] = trim($exploded[$k]); */
    /*    } */
    /*    return $fixed; */
    /*} */
}

async function strSplitEsc(strIn, strSeparator) {
      let strArrayReturn;

    /* Convenience wrapper */
    let strArrayRes = [];
    strArrayRes = await strSplitEscaped(strIn, strSeparator);

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function explodeEsc(strIn, strSeparator) {
      let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await strSplitEscaped(strIn, strSeparator);

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function explodeEscaped(strIn, strSeparator) {
      let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await strSplitEscaped(strIn, strSeparator);

    strArrayReturn = strArrayRes;  return strArrayReturn;
}

async function strJoinEscaped(strArrayIn, strSeparator) {
      let strReturn;

    let strRes = '';
    let intC = 0;
    let intL = 0;
    intC = 0;
    intL = await count(strArrayIn);
    while (await implLt(intC, intL)) {
        strRes = await implCat(strRes, await implCat(await strReplace(await get(strArrayIn, intC), strSeparator, await implCat('\\', strSeparator), ), strSeparator));
        intC = await inc(intC);
    }

    strReturn = strRes;  return strReturn;
}

async function strJoinEsc(strArrayIn, strSeparator) {
      let strReturn;

    /* Convenience wrapper */
    let strRes = '';
    strRes = await strJoinEscaped(strArrayIn, strSeparator);

    strReturn = strRes;  return strReturn;
}

async function strJoinEscNoTrailing(strArrayIn, strSeparator) {
      let strReturn;

    /* a,b instead of a,b, */
    let strRes = '';
    let intSeparLen = 0;
    intSeparLen = await len(strSeparator);
    intSeparLen = await implSub(-1, intSeparLen);
    strRes = await substr(await strJoinEscaped(strArrayIn, strSeparator), 0, intSeparLen);

    strReturn = strRes;  return strReturn;
}

async function intArrFromStrPrintedArr(strInput) {
      let intArrayReturn;

    /* Reverse of strPrintArr with an an/ parameter. */
    let intArrayRes = [];
    let intArrayContent = [];
    intArrayContent = await strToByteArray(strInput);
    let strCurrentInt = '';
    strCurrentInt = '';
    let intContentLength = 0;
    intContentLength = await count(intArrayContent);
    let intByteOffset = 0;
    let intCurrentByte = 0;
    while (await implLt(intByteOffset, intContentLength)) {
        /* do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are ints represented as ASCII text bytes, rather than an array of ints. */
        intCurrentByte = await get(intArrayContent, intByteOffset);
        if (await asciiIsDigit(intCurrentByte)) {
            strCurrentInt = await implCat(strCurrentInt, await charFromByte(intCurrentByte));
        }
        else if (await asciiIsSpace(intCurrentByte)) {
            intArrayRes = await push(intArrayRes, await intFromIntStr(strCurrentInt));
            strCurrentInt = '';
        }
        else {
            await implDie('Unexpected parser state in intArrFromStrPrintedArr.');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    if (await ne(0, await len(strCurrentInt))) {
        /* Ended without a trailing space */
        intArrayRes = await push(intArrayRes, await intFromIntStr(strCurrentInt));
    }

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function positiveIntFromIntStr(strIn) {
      let intReturn;

    /* Returns a negative value for an empty input string */
    let intRes = 0;
    if (await implEq(0, await len(strIn))) {
        intRes = -1;
    }
    else {
        intRes = await intFromIntStr(strIn);
    }

    intReturn = intRes;  return intReturn;
}

async function posIntFromIntStr(strIn) {
      let intReturn;

    /* Convenience wrapper */
    let intRes = 0;
    intRes = await positiveFromIntStr(strIn);

    intReturn = intRes;  return intReturn;
}

async function charFromHexByte(strHexByte) {
      let strReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    await assertIsBaseStr(strHexByte, 16);
    let strRes = '';
    strRes = await charFromByte(await intFromBaseStr(strHexByte, 16));

    strReturn = strRes;  return strReturn;
}

async function strToByteArray(strInput) {
      let intArrayReturn;

    let intCount = 0;
    intCount = await len(strInput);
    let intI = 0;
    intI = 0;
    let intArrayOut = [];
    while (await implLt(intI, intCount)) {
        intArrayOut = await push(intArrayOut, await byteFromChar(await strChar(strInput, intI)));
        intI = await implAdd(intI, 1);
    }

    intArrayReturn = intArrayOut;  return intArrayReturn;
}

async function strFromByteArray(intArrayInput) {
      let strReturn;

    /* Remember this will break if there are non-string bytes in it. */
    let intCount = 0;
    intCount = await count(intArrayInput);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (await implLt(intI, intCount)) {
        strOut = await implCat(strOut, await charFromByte(await get(intArrayInput, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strOut;  return strReturn;
}

/* For now, I'm inclined to skip implementing wasm right now, and just have a stub interface here. It seems well specced and portable, so I think it *can* be at some point. It would be nice if it were already implemented in StageL, but I might have to do that later. */
/* Copies of the current versions as of this writing (latest git commits) of wac, WebAssembly spec, and dependencies are included in work-docs/wasm for easy access, and are covered under their respective licenses. The following repositories are there: */
/* https://github.com/kanaka/wac */
/* https://github.com/kanaka/fooboot */
/* https://github.com/WebAssembly/wabt */
/* https://github.com/WebAssembly/spec */
/* https://github.com/WebAssembly/testsuite */
/* https://github.com/google/googletest */
/* https://github.com/dabeaz/ply */

async function wasmCheckForError(strCaller, genericItemArg) {
     

    let strArgStr = '';
    if (await isArray(genericItemArg)) {
        strArgStr = await printArray(genericItemArg);
    }
    else {
        strArgStr = await strFrom(genericItemArg);
    }
    let intErr = 0;
    intErr = await internalWasmCall('checkForError');
    /* await console.log('intErr='+intErr+typeof intErr); */
    /* await console.log('strArgStr='+strArgStr+typeof strArgStr); */
    /* Next line seems to crash with intErr being a null object. Why???? */
    /* await console.log(await ne(intErr, 0)); */
    /* return; */
    await implWarn('WASM error checking does not yet work.');
    /*if ne 0 n/err */
    {
        /*die cat 'WebAssembly call to ' cat s/caller cat ' with the argument ' cat s/argStr ' reported an error.' */
    }

    
}

async function wasmCall(strRoutine, intVal) {
      let intReturn;

    let intRes = 0;
    intRes = await internalWasmCall(strRoutine, intVal);
    await wasmCheckForError(strRoutine, intVal);

    intReturn = intRes;  return intReturn;
}

async function wasmCallNoArgs(strRoutine) {
      let intReturn;

    /* Only returns an int */
    let intRes = 0;
    intRes = await internalWasmCallNoArgs(strRoutine);
    await wasmCheckForError(strRoutine);

    intReturn = intRes;  return intReturn;
}

async function wasmCallArrIn(strRoutine, intArrayVals) {
      let intReturn;

    let intRes = 0;
    intRes = await internalWasmCallArrIn(strRoutine, intArrayVals);
    await wasmCheckForError(strRoutine, intArrayVals);

    intReturn = intRes;  return intReturn;
}

async function wasmCallArrOut(strRoutine, intVal) {
      let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrOut(strRoutine, intVal);
    await wasmCheckForError(strRoutine, intVal);

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function wasmCallArrInOut(strRoutine, intArrayVals) {
      let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrInOut(strRoutine, intArrayVals);
    await wasmCheckForError(strRoutine, intArrayVals);

    intArrayReturn = intArrayRes;  return intArrayReturn;
}

async function runTestsOnly(boolV) {
      let boolReturn;

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
    /* Document exec tests */
    await runTestsDocumentExec(boolV);
    /* Did anything fail? */
    if (await implEq(intFailedTests, 0)) {

        boolReturn = true;  return boolReturn;
    }

    boolReturn = false;  return boolReturn;
}

async function testing(boolV, strTestSuite) {
     

    if (boolV) {
        intArrayTestFrameBuffer = await append(intArrayTestFrameBuffer, await prepareStrForEcho(await implCat('Started running test suite: ', strTestSuite)));
        await renderDrawContents(intArrayTestFrameBuffer);
    }

    
}

async function runTest(boolV, boolTestReturn) {
      let boolReturn;

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

    boolReturn = boolTestReturn;  return boolReturn;
}

async function runTestNamed(boolV, strTestName, boolTestReturn) {
      let boolReturn;

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

    boolReturn = boolTestReturn;  return boolReturn;
}

async function clearTestStats() {
    

    intTotalTests = 0;
    intPassedTests = 0;
    intFailedTests = 0;

    
}

async function reportTests() {
     let boolReturn;

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
    let strTemp