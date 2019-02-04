// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function isByte(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isByte:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intVal = 0;
    intVal = genericIn;
    let boolRes = false;
    boolRes = await intIsBetween(intVal, 0, 255);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isChar(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isChar:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isStr(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let strVal = '';
    strVal = genericIn;
    let boolRes = false;
    boolRes = await isCharByte(await byteFromChar(strVal));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isCharByte(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isCharByte:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intVal = 0;
    intVal = genericIn;
    let boolRes = false;
    boolRes = await intIsBetween(intVal, 32, 126);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcaFromAscii(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromAscii:format-ascii'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    while (await le(intC, intL)) {
        intArrayRes = await push(intArrayRes, await dcFromFormat('ascii', await get(intArrayContent, intC)));
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isAsciiByte(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('isAsciiByte:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 0, 127);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsDigit(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsDigit:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 48, 57);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsPrintable(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsPrintable:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 32, 126);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsSpace(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsSpace:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intN, 32);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsNewline(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsNewline:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolT1 = false;
    boolT1 = await implEq(intN, 10);
    let boolT2 = false;
    boolT2 = await or(boolT1, await implEq(intN, 13));

    boolReturn = boolT2; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsLetterUpper(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsLetterUpper:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 65, 90);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsLetterLower(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsLetterLower:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 97, 122);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsLetter(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsLetter:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await asciiIsLetterLower(intN);
    boolTemp = await or(boolTemp, await asciiIsLetterUpper(intN));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsAlphanum(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('asciiIsAlphanum:format-ascii'); await assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = await asciiIsLetter(intN);
    boolTemp = await or(boolTemp, await asciiIsDigit(intN));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}
/* 0  NUL    16 DLE    32 SP   48 0    64 @    80 P    96  `    112 p */
/* 1  SOH    17 DC1    33 !    49 1    65 A    81 Q    97  a    113 q */
/* 2  STX    18 DC2    34 "    50 2    66 B    82 R    98  b    114 r */
/* 3  ETX    19 DC3    35 #    51 3    67 C    83 S    99  c    115 s */
/* 4  EOT    20 DC4    36 $    52 4    68 D    84 T    100 d    116 t */
/* 5  ENQ    21 NAK    37 %    53 5    69 E    85 U    101 e    117 u */
/* 6  ACK    22 SYN    38 &    54 6    70 F    86 V    102 f    118 v */
/* 7  BEL    23 ETB    39 '    55 7    71 G    87 W    103 g    119 w */
/* 8  BS     24 CAN    40 (    56 8    72 H    88 X    104 h    120 x */
/* 9  HT     25 EM     41 )    57 9    73 I    89 Y    105 i    121 y */
/* 10 LF     26 SUB    42 *    58 :    74 J    90 Z    106 j    122 z */
/* 11 VT     27 ESC    43 +    59 ;    75 K    91 [    107 k    123 { */
/* 12 FF     28 FS     44 ,    60 <    76 L    92 \    108 l    124 | */
/* 13 CR     29 GS     45 -    61 =    77 M    93 ]    109 m    125 } */
/* 14 SO     30 RS     46 .    62 >    78 N    94 ^    110 n    126 ~ */
/* 15 SI     31 US     47 /    63 ?    79 O    95 _    111 o    127 DEL */


async function getSettingForFormat(strFormat, strDirection, strSettingKey) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugCollect('str SettingKey = ' + strSettingKey + '; '); await internalDebugStackEnter('getSettingForFormat:formats-settings'); await assertIsStr(strFormat);await assertIsStr(strDirection);await assertIsStr(strSettingKey); let strReturn;

    /* s/direction can be "in" for import settings or "out" for export settings. */
    let strRes = '';
    strRes = await getNext(await indexOf(await getSettingsForFormat(strFormat, strDirection), strSettingKey));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getSettingsForFormat(strFormat, strDirection) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugStackEnter('getSettingsForFormat:formats-settings'); await assertIsStr(strFormat);await assertIsStr(strDirection); let strArrayReturn;

    /* Returns an array of setting key/value pairs. A format setting string looks like, which should be fairly parseable (keys and vals follow StageL ident naming rules): key1:val1,key2:val2, */
    let intFormatId = 0;
    intFormatId = await getFormatId(strFormat);
    let strRes = '';
    if (await implEq(strDirection, 'in')) {
        strRes = await get(await settingStringToArray(await getImportSettings(intFormatId)));
    }
    else {
        strRes = await get(await settingStringToArray(await getExportSettings(intFormatId)));
    }

    strArrayReturn = strRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function settingStringToArray(strSettings) {
    await internalDebugCollect('str Settings = ' + strSettings + '; '); await internalDebugStackEnter('settingStringToArray:formats-settings'); await assertIsStr(strSettings); let strArrayReturn;

    let strArrayRes = [];
    intCount = await len(strSettings);
    let intCounter = 0;
    intCounter = ;
    let strElem = '';
    let strState = '';
    strState = 'key';
    let strChar = '';
    while (await implLt(intCounter, intCount)) {
        strChar = await charAt(strSettings, intCounter);
        if (await implEq(strState, 'key')) {
            if (await implEq(strChar, ':')) {
                strArrayRes = await push(strArrayRes, strElem);
                strElem = '';
                strState = 'val';
            }
            else {
                strElem = await implCat(strElem, strChar);
            }
        }
        else {
            if (await implEq(strChar, ',')) {
                strArrayRes = await push(strArrayRes, strElem);
                strElem = '';
                strState = 'key';
            }
            else {
                strElem = await implCat(strElem, strChar);
            }
        }
        intCounter = await implAdd(intCounter, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function settingArrayToString(strArraySettings) {
    await internalDebugCollect('strArray Settings = ' + strArraySettings + '; '); await internalDebugStackEnter('settingArrayToString:formats-settings'); await assertIsStrArray(strArraySettings); let strReturn;

    let strRes = '';
    intCount = await count(strArraySettings);
    let intCounter = 0;
    intCounter = 0;
    let strElem = '';
    while (await implLt(intCounter, intCount)) {
        strElem = await get(strArraySettings, intCounter);
        await assertIsTrue(await isValidIdent(strElem));
        if (await implEq(0, await implMod(intCounter, 2))) {
            strRes = await implCat(strRes, await implCat(strElem, ','));
        }
        else {
            strRes = await implCat(strRes, await implCat(strElem, ':'));
        }
        intCounter = await implAdd(intCounter, 1);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcaFromAsciiSafeSubset(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromAsciiSafeSubset:format-asciiSafeSubset'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    let intLen = 0;
    intLen = await count(intArrayContent);
    let intCounter = 0;
    intCounter = 0;
    let strState = '';
    strState = 'normal';
    let intArrayPrefilter = [];
    let intCurrentChar = 0;
    while (await implLt(intCounter, intLen)) {
        intCurrentChar = await get(intArrayContent, intCounter);
        await assertIsTrue(await isAsciiSafeSubsetChar(intCurrentChar));
        if (await implAnd(await implEq(strState, 'normal'), await implEq(intCurrentChar, 13))) {
            /* Wait to see if there's a lf after this cr. If so, treat them as a unit. */
            strState = 'crlf';
        }
        else if (await implEq(strState, 'crlf')) {
            strState = 'normal';
            intArrayPrefilter = await append([ 13, 10 ]intArrayPrefilter);
            if (await ne(intCurrentChar, 10)) {
                /* Reparse the current character */
                intCounter = await implSub(intCounter, 1);
            }
        }
        else {
            intArrayPrefilter = await push(intArrayPrefilter, intCurrentChar);
        }
        intCounter = await implAdd(intCounter, 1);
    }
}

async function isAsciiSafeSubsetChar(intChar) {
    await internalDebugCollect('int Char = ' + intChar + '; '); await internalDebugStackEnter('isAsciiSafeSubsetChar:format-asciiSafeSubset'); await assertIsInt(intChar); let boolReturn;

    let boolRes = false;
    boolRes = await or(await asciiIsPrintable(intChar), await or(await asciiIsNewline(intChar)));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listInputFormats() {
    await internalDebugStackEnter('listInputFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValueGreater('formats', 3, 0, 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedInputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedInputFormat:formats-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listInputFormats(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listInternalFormats() {
    await internalDebugStackEnter('listInternalFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'internal', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedInternalFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedInternalFormat:formats-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await or(await contains(await listInputFormats(), strIn), await contains(await listInternalFormats(), strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listOutputFormats() {
    await internalDebugStackEnter('listOutputFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValueGreater('formats', 4, 0, 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedOutputFormat:formats-data'); await assertIsStr(strIn); let boolReturn;

    let boolRes = false;
    boolRes = await contains(await listOutputFormats(), strIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listCharEncodings() {
    await internalDebugStackEnter('listCharEncodings:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'encoding', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedCharEncoding(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedCharEncoding:formats-data'); await assertIsStr(strIn); let boolReturn;

    /* Specifically, is it a supported character encoding for the output environment. */
    let boolRes = false;
    boolRes = await implAnd(await contains(await listEnvironmentCharEncodings(), strIn), await isSupportedOutputFormat(strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listTerminalTypes() {
    await internalDebugStackEnter('listTerminalTypes:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'terminal', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function isSupportedTerminalType(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isSupportedTerminalType:formats-data'); await assertIsStr(strIn); let boolReturn;

    /* Specifically, is it a supported terminal type for the output environment. */
    let boolRes = false;
    boolRes = await implAnd(await contains(await listTerminalTypes(), strIn), await isSupportedOutputFormat(strIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function getImportFormatId(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getImportFormatId:formats-data'); await assertIsStr(strFormat); let intReturn;

    let intRes = 0;
    intRes = await indexOf(await listInputFormats(), strFormat);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getExportFormatId(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getExportFormatId:formats-data'); await assertIsStr(strFormat); let intReturn;

    let intRes = 0;
    intRes = await indexOf(await listInputFormats(), strFormat);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function strChar(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strChar:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strCharAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strCharAtPos:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAtPos:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAt(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAt:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function reverseStr(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('reverseStr:strings'); await assertIsStr(strStr); let strReturn;

    let intL = 0;
    intL = await len(strStr);
    let intC = 0;
    intC = 0;
    let strRes = '';
    while (await le(intC, intL)) {
        strRes = await implCat(strRes, await strCharAtPos(strStr, await implSub(intL, intC)));
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charToUpper(strChar) {
    await internalDebugCollect('str Char = ' + strChar + '; '); await internalDebugStackEnter('charToUpper:strings'); await assertIsStr(strChar); let strReturn;

    await assertIsChar(strChar);
    let intTemp = 0;
    intTemp = await byteFromChar(strChar);
    if (await intIsBetween(intTemp, 97, 122)) {
        intTemp = await implSub(intTemp, 32);
    }
    let strRes = '';
    strRes = await charFromByte(intTemp);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToUpper(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strToUpper:strings'); await assertIsStr(strStr); let strReturn;

    let strRes = '';
    let intI = 0;
    intI = 0;
    let intCount = 0;
    intCount = await len(strStr);
    while (await implLt(intI, intCount)) {
        strRes = await implCat(strRes, await charToUpper(await strCharAtPos(strStr, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charToLower(strChar) {
    await internalDebugCollect('str Char = ' + strChar + '; '); await internalDebugStackEnter('charToLower:strings'); await assertIsStr(strChar); let strReturn;

    await assertIsChar(strChar);
    let intTemp = 0;
    intTemp = await byteFromChar(strChar);
    if (await intIsBetween(intTemp, 65, 90)) {
        intTemp = await implAdd(intTemp, 32);
    }
    let strRes = '';
    strRes = await charFromByte(intTemp);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToLower(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strToLower:strings'); await assertIsStr(strStr); let strReturn;

    let strRes = '';
    let intI = 0;
    intI = 0;
    let intCount = 0;
    intCount = await len(strStr);
    while (await implLt(intI, intCount)) {
        strRes = await implCat(strRes, await charToLower(await strCharAtPos(strStr, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strContainsOnlyInt(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('strContainsOnlyInt:strings'); await assertIsStr(strIn); let boolReturn;

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

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isValidIdent(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('isValidIdent:strings'); await assertIsStr(strIn); let strReturn;

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

    strReturn = boolRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function listDcDatasets() {
    await internalDebugStackEnter('listDcDatasets:dc-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'DcData', 'formats', 'mappings/from/ascii', 'mappings/from/unicode', 'mappings/to/html' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function dcGetColumn(strDataset, intColumn) {
    await internalDebugCollect('str Dataset = ' + strDataset + '; '); await internalDebugCollect('int Column = ' + intColumn + '; '); await internalDebugStackEnter('dcGetColumn:dc-data'); await assertIsStr(strDataset);await assertIsInt(intColumn); let strArrayReturn;

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
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugCollect('int FieldNumber = ' + intFieldNumber + '; '); await internalDebugStackEnter('dcGetField:dc-data'); await assertIsInt(intDc);await assertIsInt(intFieldNumber); let strReturn;

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

async function abSubset(boolArrayIn, intStart, intEnd) {
    await internalDebugCollect('boolArray In = ' + boolArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('abSubset:arrays'); await assertIsBoolArray(boolArrayIn);await assertIsInt(intStart);await assertIsInt(intEnd); let boolArrayReturn;

    let intCount = 0;
    intCount = await count(boolArrayIn);
    let intI = 0;
    intI = intStart;
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    intCount = intEnd;
    let boolArrayRes = [];
    while (await le(intI, intCount)) {
        boolArrayRes = await push(boolArrayRes, await get(boolArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    boolArrayReturn = boolArrayRes; await assertIsBoolArray(boolArrayReturn); await internalDebugStackExit(); return boolArrayReturn;
}

async function anSubset(intArrayIn, intStart, intEnd) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('anSubset:arrays'); await assertIsIntArray(intArrayIn);await assertIsInt(intStart);await assertIsInt(intEnd); let intArrayReturn;

    let intCount = 0;
    intCount = await count(intArrayIn);
    let intI = 0;
    intI = intStart;
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    intCount = intEnd;
    let intArrayRes = [];
    while (await le(intI, intCount)) {
        intArrayRes = await push(intArrayRes, await get(intArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function asSubset(strArrayIn, intStart, intEnd) {
    await internalDebugCollect('strArray In = ' + strArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('asSubset:arrays'); await assertIsStrArray(strArrayIn);await assertIsInt(intStart);await assertIsInt(intEnd); let strArrayReturn;

    let intCount = 0;
    intCount = await count(strArrayIn);
    let intI = 0;
    intI = intStart;
    if (await implLt(intEnd, 0)) {
        intEnd = await implAdd(intCount, intEnd);
    }
    intCount = intEnd;
    let strArrayRes = [];
    while (await le(intI, intCount)) {
        strArrayRes = await push(strArrayRes, await get(strArrayIn, intI));
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function abFromB(boolIn) {
    await internalDebugCollect('bool In = ' + boolIn + '; '); await internalDebugStackEnter('abFromB:arrays'); await assertIsBool(boolIn); let boolArrayReturn;

    let boolArrayRes = [];
    boolArrayRes = await push(boolArrayRes, boolIn);

    boolArrayReturn = boolArrayRes; await assertIsBoolArray(boolArrayReturn); await internalDebugStackExit(); return boolArrayReturn;
}

async function anFromN(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('anFromN:arrays'); await assertIsInt(intIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await push(intArrayRes, intIn);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function asFromS(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('asFromS:arrays'); await assertIsStr(strIn); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await push(strArrayRes, strIn);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function contains(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('contains:arrays'); await assertIsGenericArray(genericArrayIn);await assertIsGeneric(genericValue); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implEq(genericElem, genericValue)) {

            boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function indexOf(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('indexOf:arrays'); await assertIsGenericArray(genericArrayIn);await assertIsGeneric(genericValue); let intReturn;

    let intCount = 0;
    intCount = await count(genericArrayIn);
    let intCounter = 0;
    intCounter = 0;
    let genericElem;
    while (await implLt(intCounter, intCount)) {
        genericElem = await get(genericArrayIn, intCounter);
        if (await implEq(genericElem, genericValue)) {

            intReturn = intCounter; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
        }
        intCounter = await implAdd(intCounter, 1);
    }

    intReturn = -1; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function isArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('isArray:arrays'); await assertIsGenericItem(genericItemIn); let boolReturn;

    /* Just a convenience wrapper */
    let boolRes = false;
    boolRes = await isGenericArray(genericItemIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isIntArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isIntArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isInt(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isStrArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isStrArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isStr(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBoolArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isBoolArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isBool(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isCharArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isCharArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isChar(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isByteArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isByteArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isByte(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isDcArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isDcArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isDc(genericElem))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intCount = await implSub(intCount, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function sumArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('sumArray:arrays'); await assertIsIntArray(intArrayIn); let intReturn;

    let intCount = 0;
    intCount = await implSub(await count(intArrayIn), 1);
    let intRes = 0;
    while (await ge(intCount, 0)) {
        intRes = await implAdd(intRes, await get(intArrayIn, intCount));
        intCount = await implSub(intCount, 1);
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitOr(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitOr:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(intByte1);
    intTemp = await bitNot(await bitAnd(intTemp, await bitNot(intByte2)));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitNor(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitNor:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(await bitOr(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitNand(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitNand:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(await bitAnd(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitXor(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitXor:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNand(intByte1, intByte2);
    intTemp = await bitAnd(intTemp, await bitOr(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function bitXnor(intByte1, intByte2) {
    await internalDebugCollect('int Byte1 = ' + intByte1 + '; '); await internalDebugCollect('int Byte2 = ' + intByte2 + '; '); await internalDebugStackEnter('bitXnor:bits'); await assertIsInt(intByte1);await assertIsInt(intByte2); let intReturn;

    await assertIsByte(intByte1);
    await assertIsByte(intByte2);
    let intTemp = 0;
    intTemp = await bitNot(await bitXor(intByte1, intByte2));
    await assertIsByte(intTemp);

    intReturn = intTemp; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function prepareStrForEcho(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('prepareStrForEcho:unit-testing'); await assertIsStr(strIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await convertFormats('ascii', await getEnvPreferredFormat(), await append(await strToByteArray(strIn), [ 13, 10 ]));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestTrue(strTestName, boolTestReturn) {
    await internalDebugCollect('str TestName = ' + strTestName + '; '); await internalDebugCollect('bool TestReturn = ' + boolTestReturn + '; '); await internalDebugStackEnter('runTestTrue:unit-testing'); await assertIsStr(strTestName);await assertIsBool(boolTestReturn); let boolReturn;

    intTotalTests = await implAdd(intTotalTests, 1);
    if (boolTestReturn) {
        intArrayFrameBuffer = await append(intArrayFrameBuffer, await prepareStrForEcho(await implCat('Test ', await implCat(strTestName, ' passed.'))));
        intPassedTests = await implAdd(intPassedTests, 1);
    }
    else {
        intArrayFrameBuffer = await append(intArrayFrameBuffer, await prepareStrForEcho(await implCat('Test ', await implCat(strTestName, ' failed.'))));
        intFailedTests = await implAdd(intFailedTests, 1);
    }
    await renderDrawContents(intArrayFrameBuffer);

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
    let intPassedPercentageN = 0;
    intPassedPercentageN = await implMul(await implDiv(await implMul(intPassedTests, 100000), intFailedTests), 100);
    let strPassedPercentageTemp = '';
    strPassedPercentageTemp = await strFrom(intPassedPercentageN);
    let intCount = 0;
    intCount = await len(strPassedPercentageTemp);
    let intCounter = 0;
    intCounter = intCount;
    let strPassedPercentage = '';
    while (await implGt(intCounter, 0)) {
        if (await implEq(intCounter, await implSub(intCount, 3))) {
            strPassedPercentage = await implCat(strPassedPercentage, '.');
        }
        strPassedPercentage = await implCat(strPassedPercentage, await strChar(strPassedPercentageTemp, await implSub(intCount, intCounter)));
        intCounter = await implSub(intCounter, 1);
    }
    let intFailedPercentageN = 0;
    intFailedPercentageN = await implMul(await implDiv(await implMul(intFailedTests, 100000), intPassedTests), 100);
    let strFailedPercentageTemp = '';
    strFailedPercentageTemp = await strFrom(intFailedPercentageN);
    intCount = await len(strFailedPercentageTemp);
    intCounter = intCount;
    let strFailedPercentage = '';
    while (await implGt(intCounter, 0)) {
        if (await implEq(intCounter, await implSub(intCount, 3))) {
            strFailedPercentage = await implCat(strFailedPercentage, '.');
        }
        strFailedPercentage = await implCat(strFailedPercentage, await strChar(strFailedPercentageTemp, await implSub(intCount, intCounter)));
        intCounter = await implSub(intCounter, 1);
    }
    intArrayFrameBuffer = await append(intArrayFrameBuffer, await prepareStrForEcho(await implCat(await strFrom(intPassedTests), await implCat(' ', await implCat(strPassedWord, await implCat(' (', await implCat(strPassedPercentage, await implCat('%) passed and ', await implCat(await strFrom(intFailedTests), await implCat(' ', await implCat(strFailedWord, await implCat(' (', await implCat(strFailedPercentage, await implCat('%) failed out of a total of ', await implCat(await strFrom(intTotalTests), await implCat(strTotalWord, '.'))))))))))))))));
    let strTemp = '';
    if (await ne(intFailedTests, 0)) {
        strTotalWord = 'Some tests';
        if (await implEq(intTotalTests, 1)) {
            strTotalWord = 'A test';
        }
        strTemp = await implCat(strTotalWord, await implCat(' (', await implCat(strFailedPercentage, await implCat('%: ', await implCat(await strFrom(intFailedTests), await implCat(' out of ', await implCat(await strFrom(intTotalTests), ' failed!')))))));
        intArrayFrameBuffer = await append(intArrayFrameBuffer, await prepareStrForEcho(strTemp));
        /*error s/temp */
    }
    if (await implEq(intPassedTests, await implSub(intTotalTests, intFailedTests))) {
        await implDie('There is a problem in the testing framework.');
    }
    await renderDrawContents(intArrayFrameBuffer);
    let boolTestReturn = false;
    boolTestReturn = true;
    if (await ne(intFailedTests, 0)) {
        boolTestReturn = false;
        /*set an/frameBuffer ( ) */
        /*die s/temp */
    }
    intArrayFrameBuffer = [  ];

    boolReturn = boolTestReturn; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcaFromIntegerList(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromIntegerList:format-integerList'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRet = [];
    /* Accepts an array of bytes representing an ASCII list of integers representing Dcs. Returns an array of Dcs. This format is the same as sems but without supporting comments. */
    let strParserState = '';
    strParserState = 'dc';
    let strCurrentDc = '';
    strCurrentDc = '';
    let intContentLength = 0;
    intContentLength = await count(intArrayContent);
    let intByteOffset = 0;
    let intCurrentByte = 0;
    while (await implLt(intByteOffset, intContentLength)) {
        /* do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs. */
        intCurrentByte = await get(intArrayContent, intByteOffset);
        if (await implEq(strParserState, 'dc')) {
            if (await asciiIsDigit(intCurrentByte)) {
                strCurrentDc = await implCat(strCurrentDc, await charFromByte(intCurrentByte));
            }
            else if (await asciiIsSpace(intCurrentByte)) {
                intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
                strCurrentDc = '';
            }
            else {
                await implDie('Unexpected parser state in integerList document.');
            }
        }
        else if (await implEq(strParserState, 'comment')) {
            if (await asciiIsNewline(intCurrentByte)) {
                strParserState = 'dc';
            }
            else {
                /* Do nothing: comments are ignored */
            }
        }
        else {
            await implDie('Internal error: unexpected parser state while parsing integerList document');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
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

async function or(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('or:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nor:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nand(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('nand:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xor:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xnor(boolA, boolB) {
    await internalDebugCollect('bool A = ' + boolA + '; '); await internalDebugCollect('bool B = ' + boolB + '; '); await internalDebugStackEnter('xnor:booleans'); await assertIsBool(boolA);await assertIsBool(boolB); let boolReturn;

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
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('assertContains:assertions'); await assertIsGenericArray(genericArrayIn);await assertIsGeneric(genericValue);

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
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseDigit:assertions'); await assertIsStr(strIn);await assertIsInt(intB);

    await assertIsTrue(await isBaseDigit(strIn, intB));
    await internalDebugStackExit();
}

async function assertIsBaseStr(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('assertIsBaseStr:assertions'); await assertIsStr(strIn);await assertIsInt(intB);

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

    await assertIsTrue(await isSupportedInputFormat(strIn));
    await internalDebugStackExit();
}

async function assertIsSupportedOutputFormat(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedOutputFormat:assertions'); await assertIsStr(strIn);

    await assertIsTrue(await isSupportedOutputFormat(strIn));
    await internalDebugStackExit();
}

async function assertIsSupportedEnvironmentCharEncoding(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsSupportedEnvironmentCharEncoding:assertions'); await assertIsStr(strIn);

    await assertIsTrue(await isSupportedEnvironmentCharEncoding(strIn));
    await internalDebugStackExit();
}

async function assertIsExecId(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsExecId:assertions'); await assertIsInt(intIn);

    await assertIsTrue(await isExecId(intIn));
    await internalDebugStackExit();
}

/* This file contains the public interface for EITE. */
/* If you just want to run EITE, use the following function. */

async function startEite() {
    await internalDebugStackEnter('startEite:public-interface');

    /* Start EITE, using the default startup document. Does not return while EITE is still running. */
    /* loadAndRun ... */
    await internalDebugStackExit();
}
/* If you want to run a different document, you can call loadAndRun with the format of the document to open and its location. */

async function loadAndRun(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndRun:public-interface'); await assertIsStr(strFormat);await assertIsStr(strPath);

    /* Load and run the specified document. Does not return while the document is still running. */
    await runDocument(await loadStoredDocument(strFormat, strPath));
    await internalDebugStackExit();
}
/* If you want to convert a document to another format, you can call loadAndConvert with the format of the document, its location, and the format you want the results in. */

async function loadAndConvert(strInputFormat, strOutputFormat, strPath) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadAndConvert:public-interface'); await assertIsStr(strInputFormat);await assertIsStr(strOutputFormat);await assertIsStr(strPath); let intArrayReturn;

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
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('exportDocument:public-interface'); await assertIsStr(strFormat);await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Convert a document stored as an array of dcs to the specified format, and return it as an array of bytes. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaToFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importDocument(strFormat, intArrayContents) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('importDocument:public-interface'); await assertIsStr(strFormat);await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Convert a document stored as an array of bytes in the specified format, and return it as an array of dc. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await dcaFromFormat(strFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function importAndExport(strInputFormat, strOutputFormat, intArrayContents) {
    await internalDebugCollect('str InputFormat = ' + strInputFormat + '; '); await internalDebugCollect('str OutputFormat = ' + strOutputFormat + '; '); await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('importAndExport:public-interface'); await assertIsStr(strInputFormat);await assertIsStr(strOutputFormat);await assertIsIntArray(intArrayContents); let intArrayReturn;

    await assertIsSupportedInputFormat(strInputFormat);
    await assertIsSupportedOutputFormat(strOutputFormat);
    /* Convert a document stored as an array of bytes in the specified input format, and return it as an array of bytes in the specified output format. */
    await setupIfNeeded();
    let intArrayOut = [];
    intArrayOut = await convertFormats(strInputFormat, strOutputFormat, intArrayContents);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
/* If you want more control over the document loading and execution, you can use these lower-level functions. */

async function loadStoredDocument(strFormat, strPath) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadStoredDocument:public-interface'); await assertIsStr(strFormat);await assertIsStr(strPath); let intArrayReturn;

    await assertIsSupportedInputFormat(strFormat);
    /* Load and return the specified document as a Dc array. */
    await setupIfNeeded();
    let intArrayRes = [];
    intArrayRes = await dcaFromFormat(strFormat, await getFileFromPath(strPath));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function startDocument(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('startDocument:public-interface'); await assertIsIntArray(intArrayContents); let intReturn;

    /* Start execution of the provided document and return an ID for it. */
    await setupIfNeeded();
    let intExecId = 0;
    intExecId = await startDocumentExec(intArrayContents);

    intReturn = intExecId; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function getDesiredEventNotifications(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('getDesiredEventNotifications:public-interface'); await assertIsInt(intExecId); let strArrayReturn;

    /* Return list of event types (e.g. keystrokes, mouse movement, elapsed time) that the document wants to be notified of. */
    let strArrayRes = [];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function sendEvent(intExecId, intArrayEventData) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('intArray EventData = ' + intArrayEventData + '; '); await internalDebugStackEnter('sendEvent:public-interface'); await assertIsInt(intExecId);await assertIsIntArray(intArrayEventData); let intArrayReturn;

    /* Send the provided event or events data to the specified document. */
}

async function getDocumentFrame(intExecId, strFormat) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getDocumentFrame:public-interface'); await assertIsInt(intExecId);await assertIsStr(strFormat); let intArrayReturn;

    await assertIsSupportedOutputFormat(strFormat);
    /* Return the most recently available output for the given document in the requested format. */
}
/* To run the tests, you can use runTests or runPrintTests. */

async function runTests() {
    await internalDebugStackEnter('runTests:public-interface'); let boolReturn;

    /* Returns true if all tests pass; false otherwise, displaying report of the tests. */
}

async function quietRunTests() {
    await internalDebugStackEnter('quietRunTests:public-interface'); let boolReturn;

    /* Returns true if all tests pass; false otherwise. */
}

/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(genericA, genericB) {
    await internalDebugCollect('generic A = ' + genericA + '; '); await internalDebugCollect('generic B = ' + genericB + '; '); await internalDebugStackEnter('ne:comparison'); await assertIsGeneric(genericA);await assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ge:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function le(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('le:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ngt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('ngt:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nlt(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nlt:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nge(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nge:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nle(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('nle:comparison'); await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await le(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function startDocumentExec(intArrayContents) {
    await internalDebugCollect('intArray Contents = ' + intArrayContents + '; '); await internalDebugStackEnter('startDocumentExec:document-exec'); await assertIsIntArray(intArrayContents); let intReturn;

    let intExecId = 0;
    intExecId = -1;
    /* documentExecData is a global, created during initialization. It holds the current document state for any documents being executed. */
    intExecId = await count(intArrayDocumentExecPtrs);
    strArrayDocumentExecData = await push(strArrayDocumentExecData, await strPrintArr(intArrayContents));
    /* documentExecPtrs is also a global created during init; it holds the current execution state of each document as an int indicating the position in the document where execution is. */
    intArrayDocumentExecPtrs = await push(intArrayDocumentExecPtrs, 0);
    await assertIsExecId(intExecId);

    intReturn = intExecId; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function isExecId(intExecId) {
    await internalDebugCollect('int ExecId = ' + intExecId + '; '); await internalDebugStackEnter('isExecId:document-exec'); await assertIsInt(intExecId); let boolReturn;

    if (await implLt(intExecId, await count(intArrayDocumentExecPtrs))) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcaToHtml(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToHtml:format-html'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    let intDcAtIndex = 0;
    while (await implLt(intInputIndex, intLen)) {
        intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        /* FIXME: doesn't accept HTML-renderable Dcs (then how are they getting rendered?!) */
        if (await or(await or(await dcIsNewline(intDcAtIndex), await dcIsPrintable(intDcAtIndex), ), await dcIsSpace(intDcAtIndex))) {
            intArrayOut = await push(intArrayOut, await dcToFormat('html', intDcAtIndex));
        }
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaFromFormat(strInFormat, intArrayContentBytes) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('intArray ContentBytes = ' + intArrayContentBytes + '; '); await internalDebugStackEnter('dcaFromFormat:formats'); await assertIsStr(strInFormat);await assertIsIntArray(intArrayContentBytes); let intArrayReturn;

    await assertIsSupportedInputFormat(strInFormat);
    await assertIsByteArray(intArrayContentBytes);
    let intArrayRet = [];
    if (await or(await implEq(strInFormat, 'sems'), await implEq(strInFormat, 'integerList'))) {
        /* TODO: The sems parser can handle integerList format too, but perhaps a dedicated parser should be provided so it isn't too permissive. */
        intArrayRet = await dcaFromSems(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'ascii')) {
        intArrayRet = await dcaFromAscii(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'asciiSafeSubset')) {
        intArrayRet = await dcaFromAsciiSafeSubset(intArrayContentBytes);
    }
    else {
        await implError(await implCat('Unimplemented document parsing format: ', strInFormat));
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToFormat(strOutFormat, intArrayDcArrayIn) {
    await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('intArray DcArrayIn = ' + intArrayDcArrayIn + '; '); await internalDebugStackEnter('dcaToFormat:formats'); await assertIsStr(strOutFormat);await assertIsIntArray(intArrayDcArrayIn); let intArrayReturn;

    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsDcArray(intArrayDcArrayIn);
    let intArrayRes = [];
    if (await implEq(strOutFormat, 'integerList')) {
        intArrayRes = await dcaToIntegerList(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'immutableCharacterCells')) {
        intArrayRes = await dcaToImmutableCharacterCells(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'html')) {
        intArrayRes = await dcaToHtml(intArrayDcArrayIn);
    }
    else {
        await implDie(await implCat('Unimplemented document render output format: ', strOutFormat));
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function convertFormats(strInFormat, strOutFormat, intArrayIn) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('convertFormats:formats'); await assertIsStr(strInFormat);await assertIsStr(strOutFormat);await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsSupportedInputFormat(strInFormat);
    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsByteArray(intArrayIn);
    let intArrayOut = [];
    intArrayOut = await dcaToFormat(strOutFormat, await dcaFromFormat(strInFormat, intArrayIn));
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getExportExtension(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getExportExtension:formats'); await assertIsStr(strFormat); let strReturn;

    /* Produces the actual file extension to be used for a file exported in the given format, with the current configured format options. */
    if (await implEq(strFormat, 'sems')) {

        strReturn = 'sems'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else if (await implEq(strFormat, 'integerList')) {

        strReturn = 'dcil'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else if (await implEq(strFormat, 'asciiSafeSubset')) {

        strReturn = 'ascii'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else if (await implEq(strFormat, 'utf8')) {

        strReturn = 'utf8'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else if (await implEq(strFormat, 'html')) {
        let strRes = '';
        strRes = await implCat(await buildExportExtension(await getEnvCharEncoding(), ), '.htm');

        strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    else {
        await implDie(await implCat('Format not supported: ', strFormat));
    }
}

async function dcToFormat(strOutFormat, intDc) {
    await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcToFormat:formats'); await assertIsStr(strOutFormat);await assertIsInt(intDc); let intArrayReturn;

    /* Output byte array for a single dc, or an empty array if no output is available. Only operates on one Dc at a time. Some formats may not need this; calling with them is an error and should cause an assertion failure. */
    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsDc(intDc);
    let intArrayRes = [];
    if (await or(await implEq(strOutFormat, 'utf8'), await implEq(strOutFormat, 'asciiSafeSubset'))) {
        intArrayRes = await push(intArrayRes, await utf8BytesFromDecimalChar(await hexToDec(await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0))));
    }
    else if (await implEq(strOutFormat, 'html')) {
        strRes = await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0);
        if (await isBaseStr(strRes, 16)) {
            intArrayRes = await push(intArrayRes, await utf8BytesFromDecimalChar(await hexToDec(strRes)));
        }
        else {
            intArrayRes = await push(intArrayRes, await strToByteArray(await dcDataLookupByValue('mappings/to/html', 0, intDc, 1)));
        }
    }
    else {
        await implError(await implCat('Unimplemented character output format: ', strOutFormat));
    }
    /* Returns an empty array if the Dc isn't printable. I don't think it should be an error to call this for a nonprintable Dc. */
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcFromFormat(strInFormat, intArrayContent) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcFromFormat:formats'); await assertIsStr(strInFormat);await assertIsIntArray(intArrayContent); let intArrayReturn;

    /* Retrieve dc (as a one-element array) corresponding to the input data (input data for some formats may be expected as byte arrays, but not for others), or an empty array if no match. Only operates on one Dc at a time. Some formats (e.g. sems) don't need this; calling with them is an error and should cause an assertion failure. */
    await assertIsTrue(await isSupportedInternalFormat(strInFormat));
    let intArrayRet = [];
    let intDc = 0;
    if (await or(await implEq(strInFormat, 'ascii'), await implEq(strInFormat, 'unicode'))) {
        let intC = 0;
        intC = await get(intArrayContent, 0);
        if (await implEq(strInFormat, 'ascii')) {
            if (await implNot(await isAsciiByte(intC))) {
                await implDie(await implCat('The character number ', await implCat(await strFrom(intC), ' is not a 7-bit ASCII character.')));
            }
        }
        await assertIsNonnegative(intC);
        if (await ge(intC, await dcDatasetLength('mappings/from/unicode'))) {
            await implDie('FIXME: save unmapped unicode chars');

            intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
        }
        intDc = await intFromIntStr(await dcDataLookupById('mappings/from/unicode', intC, 1));
    }
    else {
        await implDie(await implCat('Unimplemented character source format: ', strInFormat));
    }
    intArrayRet = await setElement(intArrayRet, 0, intDc);
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isDc(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isDc:format-dc'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intNum = 0;
    intNum = genericIn;
    let boolRes = false;
    boolRes = await isNonnegative(intNum);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isKnownDc(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isKnownDc:format-dc'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isDc(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    if (await implGt(genericIn, await maximumKnownDc())) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function maximumKnownDc() {
    await internalDebugStackEnter('maximumKnownDc:format-dc'); let intReturn;

    let strRes = '';
    strRes = await dcDatasetLength('DcData');

    intReturn = strRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function dcIsNewline(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsNewline:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    if (await implEq('b', await dcGetBidiClass(intDc))) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcIsSpace(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsSpace:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    if (await implEq('Zs', await dcGetType(intDc))) {

        boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function dcIsPrintable(intDc) {
    await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcIsPrintable:format-dc'); await assertIsInt(intDc); let boolReturn;

    await assertIsDc(intDc);
    let strType = '';
    strType = await dcGetType(intDc);
    let strGeneralType = '';
    strGeneralType = await strChar(strType, 0);
    if (await or(await implEq('Zl', strType), await implEq('Zp', strType))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    if (await or(await implEq('!', strGeneralType), await implEq('C', strGeneralType))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('isNonnegative:math'); await assertIsInt(intIn); let boolReturn;

    if (await implLt(intIn, 0)) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intIsBetween(intN, intA, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intIsBetween:math'); await assertIsInt(intN);await assertIsInt(intA);await assertIsInt(intB); let boolReturn;

    /* Checks whether N is within the range A and B, including endpoints */
    let intT1 = 0;
    intT1 = await implSub(intN, intA);
    let intT2 = 0;
    intT2 = await implSub(intN, intB);
    let intT3 = 0;
    intT3 = await implMul(intT1, intT2);
    let boolTemp = false;
    boolTemp = await le(intT3, 0);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intToBase36Char(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('intToBase36Char:math'); await assertIsInt(intN); let strReturn;

    /* Returns the nth digit in base 36 or less (using capitalized digits). */
    if (await implNot(await intIsBetween(intN, 0, 36))) {
        let strTemp = '';
        strTemp = await strFrom(intN);
        await implDie(await implCat(await strFrom(strTemp, ' is not within the supported range of numbers between 0 and 36 (Z).')));
    }
    let strRes = '';
    if (await le(intN, 9)) {
        strRes = await charFromByte(await implAdd(intN, 48));
    }
    else {
        strRes = await charFromByte(await implAdd(intN, 55));
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function intFromBase36Char(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('intFromBase36Char:math'); await assertIsStr(strN); let intReturn;

    /* Returns an int given the nth digit in base 36 or less (using capitalized digits). */
    await assertIsChar(strN);
    let strUc = '';
    strUc = await strToUpper(strN);
    let intRes = 0;
    intRes = await byteFromChar(strUc);
    if (await ge(intRes, 65)) {
        if (await implGt(intRes, 90)) {
            await implDie(await implCat(strUc, ' is not within the supported range of digits between 0 and Z (36).'));
        }
        intRes = await implSub(intRes, 55);
    }
    else {
        if (await implNot(await intIsBetween(intRes, 48, 57))) {
            await implDie(await implCat(strN, ' is not within the supported range of digits between 0 and Z (36).'));
        }
        intRes = await implSub(intRes, 48);
    }
    if (await implNot(await intIsBetween(intRes, 0, 36))) {
        await implDie(await implCat('Internal error in intFromBase36Char called with n=', await implCat(strN, '.')));
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function intFromBaseStr(strN, intB) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intFromBaseStr:math'); await assertIsStr(strN);await assertIsInt(intB); let intReturn;

    /* Returns the integer represented by n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    await assertIsBaseStr(strN, intB);
    let strUc = '';
    strUc = await strToUpper(strN);
    let intRes = 0;
    intRes = 0;
    let intLen = 0;
    intLen = await len(strUc);
    let intInt = 0;
    intInt = 0;
    let intPow = 0;
    intPow = 1;
    while (await implGt(intLen, 0)) {
        intLen = await implSub(intLen, 1);
        intInt = await intFromBase36Char(await strCharAtPos(strUc, intLen));
        await assertIsTrue(await implLt(intInt, intB));
        intRes = await implAdd(intRes, await implMul(intInt, intPow));
        intPow = await implMul(intPow, intB);
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function hexToDec(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('hexToDec:math'); await assertIsStr(strN); let intReturn;

    let intRes = 0;
    intRes = await intFromBaseStr(strN, 16);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function decToHex(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('decToHex:math'); await assertIsStr(strN); let strReturn;

    let strRes = '';
    strRes = await intToBaseStr(intN, 10);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function intToBaseStr(intN, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intToBaseStr:math'); await assertIsInt(intN);await assertIsInt(intB); let strReturn;

    /* Returns a string representing n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    let strRes = '';
    while (await implGt(intN, 0)) {
        strRes = await implCat(strRes, await intToBase36Char(await implMod(intN, intB)));
        intN = await implDiv(intN, intB);
    }
    strRes = await reverseStr(strRes);
    await assertIsBaseStr(strRes, intB);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function isSupportedBase(intB) {
    await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isSupportedBase:math'); await assertIsInt(intB); let boolReturn;

    /* StageL base conversion routines support base 1 to base 36. */
    let boolRes = false;
    boolRes = await intIsBetween(intB, 1, 36);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBaseDigit(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseDigit:math'); await assertIsStr(strIn);await assertIsInt(intB); let boolReturn;

    await assertIsChar(strIn);
    await assertIsSupportedBase(intB);
    if (await implNot(await asciiIsAlphanum(await byteFromChar(strIn)))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intDigitVal = 0;
    intDigitVal = await intFromBase36Char(strIn);
    let boolRes = false;
    boolRes = await implLt(intDigitVal, intB);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isBaseStr(strIn, intB) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseStr:math'); await assertIsStr(strIn);await assertIsInt(intB); let boolReturn;

    let intLen = 0;
    intLen = await len(strIn);
    intLen = await implSub(intLen, 1);
    await assertIsNonnegative(intLen);
    let strChr = '';
    let boolRes = false;
    boolRes = true;
    while (await ge(intLen, 0)) {
        strChr = await strCharAtPos(strIn, intLen);
        boolRes = await implAnd(boolRes, await isBaseDigit(strChr, intB));
        intLen = await implSub(intLen, 1);
    }

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

/* Can check for exception as result like: if eq s/res dcDataNoResultException */

async function dcDataNoResultException() {
    await internalDebugStackEnter('dcDataNoResultException:exceptions'); let strReturn;


    strReturn = '89315802-d53d-4d11-ba5d-bf505e8ed454'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strPrintArr(genericArrayInput) {
    await internalDebugCollect('genericArray Input = ' + genericArrayInput + '; '); await internalDebugStackEnter('strPrintArr:type-conversion'); await assertIsGenericArray(genericArrayInput); let strReturn;

    /* Hint: running this on a DcArray produces a sems document that can be turned back into a DcArray with dcarrParseSems strToByteArray s/str :) */
    let intCount = 0;
    intCount = await count(genericArrayInput);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (await implLt(intI, intCount)) {
        strOut = await implCat(strOut, await strFrom(await get(genericArrayInput, intI)));
        strOut = await implCat(strOut, ' ');
        intI = await implAdd(intI, 1);
    }

    strReturn = strOut; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charFromHexByte(strHexByte) {
    await internalDebugCollect('str HexByte = ' + strHexByte + '; '); await internalDebugStackEnter('charFromHexByte:type-conversion'); await assertIsStr(strHexByte); let strReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    await assertIsBaseStr(strHexByte, 16);
    let strRes = '';
    strRes = await charFromByte(await intFromBaseStr(strHexByte, 16));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strToByteArray(strInput) {
    await internalDebugCollect('str Input = ' + strInput + '; '); await internalDebugStackEnter('strToByteArray:type-conversion'); await assertIsStr(strInput); let intArrayReturn;

    let intCount = 0;
    intCount = await len(strInput);
    let intI = 0;
    intI = 0;
    let intArrayOut = [];
    while (await implLt(intI, intCount)) {
        intArrayOut = await push(intArrayOut, await byteFromChar(await strChar(strInput, intI)));
        intI = await implAdd(intI, 1);
    }

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function strFromByteArray(intArrayInput) {
    await internalDebugCollect('intArray Input = ' + intArrayInput + '; '); await internalDebugStackEnter('strFromByteArray:type-conversion'); await assertIsIntArray(intArrayInput); let strReturn;

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

    strReturn = strOut; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcaFromSems(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromSems:format-sems'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRet = [];
    /* Accepts an array of bytes of a SEMS format document. Returns an array of Dcs. */
    let strParserState = '';
    strParserState = 'dc';
    let strCurrentDc = '';
    strCurrentDc = '';
    let intContentLength = 0;
    intContentLength = await count(intArrayContent);
    let intByteOffset = 0;
    let intCurrentByte = 0;
    while (await implLt(intByteOffset, intContentLength)) {
        /* do something with each byte in the array. an/content[n/byteOffset], which is copied to n/currentByte, holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs. */
        intCurrentByte = await get(intArrayContent, intByteOffset);
        if (await implEq(strParserState, 'dc')) {
            if (await asciiIsDigit(intCurrentByte)) {
                strCurrentDc = await implCat(strCurrentDc, await charFromByte(intCurrentByte));
            }
            else if (await asciiIsSpace(intCurrentByte)) {
                intArrayRet = await push(intArrayRet, await intFromIntStr(strCurrentDc));
                strCurrentDc = '';
            }
            else if (await implEq(35, intCurrentByte)) {
                /* pound sign: start comment */
                intArrayRet = await push(intArrayRet, 246);
                strParserState = 'comment';
            }
            else {
                await implDie('Unexpected parser state in SEMS document.');
            }
        }
        else if (await implEq(strParserState, 'comment')) {
            if (await asciiIsNewline(intCurrentByte)) {
                intArrayRet = await push(intArrayRet, 248);
                strParserState = 'dc';
            }
            else {
                intArrayRet = await push(intArrayRet, await dcFromFormat('unicode', await anFromN(await firstCharOfUtf8String(await anSubset(intArrayContent, intByteOffset, -1)))));
            }
        }
        else {
            await implDie('Internal error: unexpected parser state while parsing SEMS document');
        }
        intByteOffset = await implAdd(intByteOffset, 1);
    }
    if (await implEq(strParserState, 'comment')) {
        /* Document ended with a comment and no newline at the end */
        intArrayRet = await push(intArrayRet, 248);
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}


// @license-end
