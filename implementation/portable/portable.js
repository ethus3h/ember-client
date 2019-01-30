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

async function listDcDatasets() {
    await internalDebugStackEnter('listDcDatasets:dc-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = [ 'DcData', 'mappings/from/ascii', 'mappings/from/unicode', 'mappings/to/html' ];

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function dcGetColumn(strDataset, intColumn) {
    await internalDebugCollect('str Dataset = ' + strDataset + '; '); await internalDebugCollect('int Column = ' + intColumn + '; '); await internalDebugStackEnter('dcGetColumn:dc-data'); await assertIsStr(strDataset);await assertIsInt(intColumn); let strArrayReturn;

    let strArrayRes = [];
    let intCount = 0;
    intCount = await implSub(await dcDatasetLength(strDataset), 1);
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
    strRes = await dcDataLookupById('DcData', await implAdd(intDc, 1), intFieldNumber);

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

async function dcaToHTML(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToHTML:format-HTML'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

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
            intArrayOut = await push(intArrayOut, await dcToFormat('HTML', intDcAtIndex));
        }
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
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
