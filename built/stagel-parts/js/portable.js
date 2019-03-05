// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

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
}

async function byteArrayToBasenbUtf8(intBase, intArrayIn) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToBasenbUtf8:basenb-utf8'); await assertIsInt(intBase); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsTrue(await isBasenbBase(intBase));
    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    intArrayRes = await internalIntBitArrayToBasenbString(intBase, await byteArrayToIntBitArray(intArrayIn));
    /* The remainder length also needs to be stored, to be able to decode successfully. We'll calculate, encode, and append it. It's always 4 bytes, 1 UTF-8 character, and 2 UTF-16 characters long, after encoding (it has 2 added to it to make it always be the same byte length and UTF-16 length; this must be subtracted before passing it to the Base16b.decode function). */
    let intArrayRemainder = [];
    intArrayRemainder = await push(intArrayRemainder, await implAdd(2, await implMod(await count(intArrayIn), 17)));
    intArrayRes = await push(intArrayRes, await internalIntBitArrayToBasenbString(17, intArrayRemainder));
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
    /* last 4 characters */
    intArrayRemainderArr = await anSubset(intArrayIn, -5, -1);
    let intArrayRemainderDecodedArr = [];
    intArrayRemainderDecodedArr = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayRemainderArr, 0));
    intRemainder = await get(intArrayRemainderDecodedArr, 0);
    intArrayRes = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayIn, intRemainder));
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

async function getArmoredUtf8EmbeddedEndUuid() {
    await internalDebugStackEnter('getArmoredUtf8EmbeddedEndUuid:basenb-utf8'); let intArrayReturn;

    /* end UUID=60bc936b-f10f-4f50-ab65-3778084060e2 */
    /*new an/endUuid */
    /*set an/endUuid ( 96 188 147 107 241 15 79 80 171 101 55 120 8 64 96 226 ) */
    /* byteArrayToIntBitArray([ 96, 188, 147, 107, 241, 15, 79, 80, 171, 101, 55, 120, 8, 64, 96, 226 ]).then(function(v){return new TextEncoder().encode(Base16b.encode(v, 17));}).then(function(v){console.log(v.toString());}) */
    let intArrayEndUuidUtf8 = [];
    intArrayEndUuidUtf8 = [ 243, 188, 133, 185, 243, 180, 182, 175, 244, 136, 161, 186, 243, 191, 148, 138, 244, 134, 178, 166, 244, 141, 184, 130, 243, 178, 128, 176, 244, 143, 188, 157 ];

    intArrayReturn = intArrayEndUuidUtf8; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
/*r/an/byteArrayToArmoredBase17bUtf8 an/in */
/*    assertIsByteArray an/in */
/*    new an/res */
/*    set an/res getArmoredBase17bUtf8StartUuid */
/*    set an/res append an/res eiteHostCall 'internalIntBitArrayToBase17bString' byteArrayToIntBitArray an/in */
/*    assertIsByteArray an/res */
/*    set an/res append an/res getArmoredBase17bUtf8EndUuid */
/*    return an/res */
/*r/an/byteArrayFromArmoredBase17bUtf8 an/in */
/*    assertIsByteArray an/in */
/*    new an/temp */
/*    set an/temp getArmoredBase17bUtf8StartUuid */
/*    assertIsTrue eq an/temp anSubset an/in 0 count an/temp */
/*    set an/temp getArmoredBase17bUtf8EndUuid */
/*    assertIsTrue eq an/temp anSubset an/in -1 sub -1 count an/temp */
/*    new an/res */
/*    set an/res eiteHostCall 'internalIntBitArrayFromBase17bString' an/in */
/*    assertIsByteArray an/res */
/*    return an/res */

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

async function isIntBit(genericIn) {
    await internalDebugCollect('generic In = ' + genericIn + '; '); await internalDebugStackEnter('isIntBit:type-tools'); await assertIsGeneric(genericIn); let boolReturn;

    if (await implNot(await isInt(genericIn))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let intVal = 0;
    intVal = genericIn;
    let boolRes = false;
    boolRes = await intIsBetween(intVal, 0, 1);

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

async function runTestsFormatHtmlFragment(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatHtmlFragment:format-htmlFragment-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatHtmlFragment');
    await runTest(boolV, await arrEq([ 53, 38, 108, 116, 59, 54 ], await dcaToHtmlFragment([ 39, 46, 40 ])));

    await internalDebugStackExit();
}

async function dcaFromAscii(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaFromAscii:format-ascii'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsByteArray(intArrayContent);
    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    while (await implLt(intC, intL)) {
        intArrayRes = await append(intArrayRes, await dcFromFormat('ascii', await anFromN(await get(intArrayContent, intC))));
        intC = await implAdd(intC, 1);
    }
    await assertIsDcArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToAscii(intArrayContent) {
    await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcaToAscii:format-ascii'); await assertIsIntArray(intArrayContent); let intArrayReturn;

    await assertIsDcArray(intArrayContent);
    let intArrayRes = [];
    let intL = 0;
    intL = await count(intArrayContent);
    let intC = 0;
    intC = 0;
    let intArrayTemp = [];
    let intDcAtIndex = 0;
    while (await implLt(intC, intL)) {
        intDcAtIndex = await get(intArrayContent, intC);
        intArrayTemp = await dcToFormat('utf8', intDcAtIndex);
        if (await arrNonempty(intArrayTemp)) {
            if (await isAsciiByte(await get(intArrayTemp, 0))) {
                intArrayRes = await append(intArrayRes, intArrayTemp);
            }
            else {
                await exportWarningUnmappable(intC, intDcAtIndex);
            }
        }
        else {
            await exportWarningUnmappable(intC, intDcAtIndex);
        }
        intC = await implAdd(intC, 1);
    }
    await assertIsByteArray(intArrayRes);

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

async function crlf() {
    await internalDebugStackEnter('crlf:format-ascii'); let intArrayReturn;

    let intArrayTemp = [];
    intArrayTemp = [ 13, 10 ];

    intArrayReturn = intArrayTemp; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
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

async function runTestsMath(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsMath:math-tests'); await assertIsBool(boolV);

    await testing(boolV, 'math');
    await runTest(boolV, await implEq(4, await implAdd(2, 2)));
    await runTest(boolV, await ne(4, await implAdd(2, 3)));

    await internalDebugStackExit();
}

async function runTestsFormatAsciiSafeSubset(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatAsciiSafeSubset:format-asciiSafeSubset-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatAsciiSafeSubset');
    await runTest(boolV, await arrEq([ 121, 120, 21, 26 ], await dcaFromAsciiSafeSubset([ 13, 10, 35, 40 ])));
    await runTest(boolV, await arrEq([ 13, 10, 35, 13, 10, 40 ], await dcaToAsciiSafeSubset([ 0, 212, 120, 216, 291, 221, 226, 231, 21, 121, 120, 26 ])));

    await internalDebugStackExit();
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
    while (await implLt(intC, intL)) {
        intDcAtIndex = await get(intArrayContent, intC);
        intArrayTemp = await dcToFormat('utf8', intDcAtIndex);
        if (await implEq(0, await count(intArrayTemp))) {
            await exportWarningUnmappable(intC, intDcAtIndex);
        }
        intArrayRes = await append(intArrayRes, intArrayTemp);
        intC = await implAdd(intC, 1);
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
    while (await implNot(await implEq(0, await count(intArrayRemaining)))) {
        intArrayTemp = [  ];
        intArrayTemp = await push(intArrayTemp, await firstCharOfUtf8String(intArrayRemaining));
        intArrayRes = await push(intArrayRes, await dcFromFormat('unicode', intArrayTemp));
        intArrayRemaining = await anSubset(intArrayRemaining, await count(intArrayTemp), -1);
    }

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestsFormatAscii(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatAscii:format-ascii-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatAscii');
    await runTest(boolV, await arrEq([ 0, 212, 120, 216, 221, 226, 231, 21, 26 ], await dcaFromAscii([ 0, 5, 10, 15, 20, 25, 30, 35, 40 ])));
    await runTest(boolV, await arrEq([ 0, 5, 10, 15, 20, 25, 30, 35, 40 ], await dcaToAscii([ 0, 212, 120, 216, 291, 221, 226, 231, 21, 26 ])));

    await internalDebugStackExit();
}

async function getSettingForFormat(strFormat, strDirection, strSettingKey) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugCollect('str SettingKey = ' + strSettingKey + '; '); await internalDebugStackEnter('getSettingForFormat:formats-settings'); await assertIsStr(strFormat); await assertIsStr(strDirection); await assertIsStr(strSettingKey); let strReturn;

    /* s/direction can be "in" for import settings or "out" for export settings. */
    let strArrayTemp = [];
    strArrayTemp = await getSettingsForFormat(strFormat, strDirection);
    let strRes = '';
    if (await contains(strArrayTemp, strSettingKey)) {
        strRes = await getNext(strArrayTemp, await indexOf(strArrayTemp, strSettingKey));
    }
    else {
        strRes = '';
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getSettingsForFormat(strFormat, strDirection) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugStackEnter('getSettingsForFormat:formats-settings'); await assertIsStr(strFormat); await assertIsStr(strDirection); let strArrayReturn;

    /* Returns an array of setting key/value pairs. A format setting string looks like, which should be fairly parseable (keys and vals follow StageL ident naming rules): key1:val1,key2:val2, */
    let intFormatId = 0;
    intFormatId = await getFormatId(strFormat);
    let strArrayRes = [];
    if (await implEq(strDirection, 'in')) {
        strArrayRes = await settingStringToArray(await getImportSettings(intFormatId));
    }
    else {
        strArrayRes = await settingStringToArray(await getExportSettings(intFormatId));
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getImportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('getImportSettings:formats-settings'); await assertIsInt(intFormatId); let strReturn;

    let strRes = '';
    strRes = await get(await getImportSettingsArr(intFormatId));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getExportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('getExportSettings:formats-settings'); await assertIsInt(intFormatId); let strReturn;

    let strRes = '';
    strRes = await get(await getExportSettingsArr(intFormatId));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function pushImportSettings(intFormatId, strNewSettingString) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugCollect('str NewSettingString = ' + strNewSettingString + '; '); await internalDebugStackEnter('pushImportSettings:formats-settings'); await assertIsInt(intFormatId); await assertIsStr(strNewSettingString);

    /* Note that all import settings must be popped in the reverse of the order they were pushed (all formats' import settings share the same stack). */
    strArrayImportDeferredSettingsStack = await push(strArrayImportDeferredSettingsStack, await getImportSettings(intFormatId));
    await setImportSettings(intFormatId, strNewSettingString);

    await internalDebugStackExit();
}

async function pushExportSettings(intFormatId, strNewSettingString) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugCollect('str NewSettingString = ' + strNewSettingString + '; '); await internalDebugStackEnter('pushExportSettings:formats-settings'); await assertIsInt(intFormatId); await assertIsStr(strNewSettingString);

    /* Note that all export settings must be popped in the reverse of the order they were pushed (all formats' export settings share the same stack). */
    strArrayExportDeferredSettingsStack = await push(strArrayExportDeferredSettingsStack, await getExportSettings(intFormatId));
    await setExportSettings(intFormatId, strNewSettingString);

    await internalDebugStackExit();
}

async function popImportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('popImportSettings:formats-settings'); await assertIsInt(intFormatId);

    await setImportSettings(intFormatId, await get(strArrayImportDeferredSettingsStack, -1));
    strArrayImportDeferredSettingsStack = await asSubset(strArrayImportDeferredSettingsStack, 0, -2);

    await internalDebugStackExit();
}

async function popExportSettings(intFormatId) {
    await internalDebugCollect('int FormatId = ' + intFormatId + '; '); await internalDebugStackEnter('popExportSettings:formats-settings'); await assertIsInt(intFormatId);

    await setExportSettings(intFormatId, await get(strArrayExportDeferredSettingsStack, -1));
    strArrayExportDeferredSettingsStack = await asSubset(strArrayExportDeferredSettingsStack, 0, -2);

    await internalDebugStackExit();
}

async function settingStringToArray(strSettings) {
    await internalDebugCollect('str Settings = ' + strSettings + '; '); await internalDebugStackEnter('settingStringToArray:formats-settings'); await assertIsStr(strSettings); let strArrayReturn;

    let strArrayRes = [];
    intCount = await len(strSettings);
    let intCounter = 0;
    intCounter = 0;
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
    await internalDebugCollect('str Caller = ' + strCaller + '; '); await internalDebugCollect('genericItem Arg = ' + genericItemArg + '; '); await internalDebugStackEnter('wasmCheckForError:wasm'); await assertIsStr(strCaller); await assertIsGenericItem(genericItemArg);

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
    if (await ne(0, intErr)) {
        await implDie(await implCat('WebAssembly call to ', await implCat(strCaller, await implCat(' with the argument ', await implCat(strArgStr, ' reported an error.')))));
    }

    await internalDebugStackExit();
}

async function wasmCall(strRoutine, intVal) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('int Val = ' + intVal + '; '); await internalDebugStackEnter('wasmCall:wasm'); await assertIsStr(strRoutine); await assertIsInt(intVal); let intReturn;

    let intRes = 0;
    intRes = await internalWasmCall(strRoutine, intVal);
    await wasmCheckForError(strRoutine, intVal);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function wasmCallNoArgs(strRoutine) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugStackEnter('wasmCallNoArgs:wasm'); await assertIsStr(strRoutine); let intReturn;

    /* Only returns an int */
    let intRes = 0;
    intRes = await internalWasmCallNoArgs(strRoutine);
    await wasmCheckForError(strRoutine);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function wasmCallArrIn(strRoutine, intArrayVals) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('intArray Vals = ' + intArrayVals + '; '); await internalDebugStackEnter('wasmCallArrIn:wasm'); await assertIsStr(strRoutine); await assertIsIntArray(intArrayVals); let intReturn;

    let intRes = 0;
    intRes = await internalWasmCallArrIn(strRoutine, intArrayVals);
    await wasmCheckForError(strRoutine, intArrayVals);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function wasmCallArrOut(strRoutine, intVal) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('int Val = ' + intVal + '; '); await internalDebugStackEnter('wasmCallArrOut:wasm'); await assertIsStr(strRoutine); await assertIsInt(intVal); let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrOut(strRoutine, intVal);
    await wasmCheckForError(strRoutine, intVal);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function wasmCallArrInOut(strRoutine, intArrayVals) {
    await internalDebugCollect('str Routine = ' + strRoutine + '; '); await internalDebugCollect('intArray Vals = ' + intArrayVals + '; '); await internalDebugStackEnter('wasmCallArrInOut:wasm'); await assertIsStr(strRoutine); await assertIsIntArray(intArrayVals); let intArrayReturn;

    let intArrayRes = [];
    intRes = await internalWasmCallArrInOut(strRoutine, intArrayVals);
    await wasmCheckForError(strRoutine, intArrayVals);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
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
    let boolStrict = false;
    boolStrict = false;
    if (await implEq('true', await getSettingForFormat('asciiSafeSubset', 'in', 'strict'))) {
        boolStrict = true;
    }
    while (await implLt(intCounter, intLen)) {
        intCurrentChar = await get(intArrayContent, intCounter);
        await assertIsTrue(await isAsciiSafeSubsetChar(intCurrentChar));
        if (await implAnd(boolStrict, await implAnd(await implEq(strState, 'normal'), await implEq(intCurrentChar, 10)))) {
            await implDie('LF without preceding CR not allowed in asciiSafeSubset strict mode.');
        }
        if (await implAnd(await implEq(strState, 'normal'), await implEq(intCurrentChar, 13))) {
            /* Wait to see if there's a lf after this cr. If so, treat them as a unit. */
            strState = 'crlf';
        }
        else if (await implEq(strState, 'crlf')) {
            strState = 'normal';
            intArrayPrefilter = await append(intArrayPrefilter, await crlf());
            if (await ne(intCurrentChar, 10)) {
                if (boolStrict) {
                    await implDie('CR followed by non-LF byte not allowed in asciiSafeSubset strict mode.');
                }
                /* Reparse the current character */
                intCounter = await implSub(intCounter, 1);
            }
        }
        else {
            intArrayPrefilter = await push(intArrayPrefilter, intCurrentChar);
        }
        intCounter = await implAdd(intCounter, 1);
    }
    intArrayPrefilter = await dcaFromAscii(intArrayPrefilter);

    intArrayReturn = intArrayPrefilter; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToAsciiSafeSubset(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToAsciiSafeSubset:format-asciiSafeSubset'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    let intArrayTemp = [];
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    let intDcAtIndex = 0;
    let strState = '';
    strState = 'normal';
    let intArrayMapTemp = [];
    while (await implLt(intInputIndex, intLen)) {
        intArrayMapTemp = await dcToFormat('utf8', await get(intArrayDcIn, intInputIndex));
        if (await implEq(0, await count(intArrayMapTemp))) {
            intArrayTemp = await setElement(intArrayTemp, intInputIndex, -1);
        }
        else {
            intArrayTemp = await setElement(intArrayTemp, intInputIndex, await get(intArrayMapTemp, 0));
        }
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    intInputIndex = 0;
    let intArrayTempChar = [];
    while (await implLt(intInputIndex, intLen)) {
        intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        if (await implEq(intDcAtIndex, 121)) {
            strState = 'crlf';
            intInputIndex = await implAdd(intInputIndex, 1);
            intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        }
        if (await implEq(strState, 'normal')) {
            intArrayTempChar = await dcToFormat('utf8', intDcAtIndex);
            if (await implEq(0, await count(intArrayTempChar))) {
                await exportWarningUnmappable(intInputIndex, intDcAtIndex);
            }
            else {
                if (await dcIsNewline(intDcAtIndex)) {
                    intArrayOut = await append(intArrayOut, await crlf());
                }
                else if (await isAsciiSafeSubsetChar(await get(intArrayTempChar, 0))) {
                    intArrayOut = await push(intArrayOut, intArrayTempChar);
                }
                else {
                    await exportWarningUnmappable(intInputIndex, intDcAtIndex);
                }
            }
        }
        else if (await implEq(strState, 'crlf')) {
            strState = 'normal';
            if (await implEq(intDcAtIndex, 120)) {
                /* Found ambiguous cr, lf in a row, so only output one crlf */
                intArrayOut = await append(intArrayOut, await crlf());
            }
            else {
                /* Reprocess the current character with 'normal' state */
                intInputIndex = await implSub(intInputIndex, 1);
            }
        }
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isAsciiSafeSubsetChar(intChar) {
    await internalDebugCollect('int Char = ' + intChar + '; '); await internalDebugStackEnter('isAsciiSafeSubsetChar:format-asciiSafeSubset'); await assertIsInt(intChar); let boolReturn;

    let boolRes = false;
    boolRes = await or(await asciiIsPrintable(intChar), await asciiIsNewline(intChar));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function listFormats() {
    await internalDebugStackEnter('listFormats:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcGetColumn('formats', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
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
    boolRes = await implAnd(await contains(await listCharEncodings(), strIn), await isSupportedOutputFormat(strIn));

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

async function listDataTypes() {
    await internalDebugStackEnter('listDataTypes:formats-data'); let strArrayReturn;

    let strArrayRes = [];
    strArrayRes = await dcDataFilterByValue('formats', 6, 'data', 1);

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function listVariantsForFormat(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('listVariantsForFormat:formats-data'); await assertIsStr(strFormat); let strArrayReturn;

    let strNormalizedFmt = '';
    strNormalizedFmt = await normalizeFormat(strFormat);
    let strArrayFormats = [];
    strArrayFormats = await listFormats();
    let intCount = 0;
    let intI = 0;
    intCount = await count(strArrayFormats);
    intI = 0;
    let strCandidateFmt = '';
    let strNormalizedVar = '';
    let strArrayRes = [];
    while (await implLt(intI, intCount)) {
        strCandidateFmtType = await dcDataLookupById('formats', intI, 6);
        if (await implEq('v:', await substr(strCandidateFmtType, 0, 2))) {
            strCandidateFmtType = await substr(strCandidateFmtType, 3, -1);
            if (await implIn(strCandidateFmtType, [ 'unicodePua' ])) {
                strCandidateFmtType = 'unicode';
            }
            if (await implEq(strNormalizedFmt, strCandidateFmtType)) {
                strArrayRes = await push(strArrayRes, await dcDataLookupById('formats', intI, 1));
            }
        }
        intI = await implAdd(intI, 1);
    }

    strArrayReturn = strArrayRes; await assertIsStrArray(strArrayReturn); await internalDebugStackExit(); return strArrayReturn;
}

async function getFormatId(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getFormatId:formats-data'); await assertIsStr(strFormat); let intReturn;

    let intRes = 0;
    intRes = await intFromIntStr(await dcDataLookupByValue('formats', 1, strFormat, 0));

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function normalizeFormat(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('normalizeFormat:formats-data'); await assertIsStr(strFormat); let strReturn;

    if (await implEq(strFormat, 'utf8')) {

        strReturn = 'unicode'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }

    strReturn = strFormat; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getFormatExtension(strFormat) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugStackEnter('getFormatExtension:formats-data'); await assertIsStr(strFormat); let strReturn;

    let strRes = '';
    strRes = await dcDataLookupById('formats', await getFormatId(strFormat), 2);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strChar(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strChar:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function strCharAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strCharAtPos:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAtPos:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    /* helper alias */
    let strTemp = '';
    strTemp = await strChar(strStr, intIndex);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function charAt(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('charAt:strings'); await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

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
        intC = await implAdd(1, intC);
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

async function strEmpty(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strEmpty:strings'); await assertIsStr(strStr); let boolReturn;

    let boolRes = false;
    boolRes = await implEq(0, await len(strStr));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function strNonempty(strStr) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugStackEnter('strNonempty:strings'); await assertIsStr(strStr); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await strEmpty(strStr));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function substr(strStr, intStart, intLen) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int Len = ' + intLen + '; '); await internalDebugStackEnter('substr:strings'); await assertIsStr(strStr); await assertIsInt(intStart); await assertIsInt(intLen); let strReturn;

    /* Convenience wrapper */
    let strRes = '';
    strRes = await substring(strStr, intStart, intLen);

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

async function prepareStrForEcho(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('prepareStrForEcho:strings'); await assertIsStr(strIn); let intArrayReturn;

    let intArrayRes = [];
    intArrayRes = await convertFormats('ascii', await getEnvPreferredFormat(), await append(await strToByteArray(strIn), await crlf()));

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
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

async function abSubset(boolArrayIn, intStart, intEnd) {
    await internalDebugCollect('boolArray In = ' + boolArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('abSubset:arrays'); await assertIsBoolArray(boolArrayIn); await assertIsInt(intStart); await assertIsInt(intEnd); let boolArrayReturn;

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
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('anSubset:arrays'); await assertIsIntArray(intArrayIn); await assertIsInt(intStart); await assertIsInt(intEnd); let intArrayReturn;

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
    await internalDebugCollect('strArray In = ' + strArrayIn + '; '); await internalDebugCollect('int Start = ' + intStart + '; '); await internalDebugCollect('int End = ' + intEnd + '; '); await internalDebugStackEnter('asSubset:arrays'); await assertIsStrArray(strArrayIn); await assertIsInt(intStart); await assertIsInt(intEnd); let strArrayReturn;

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
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('contains:arrays'); await assertIsGenericArray(genericArrayIn); await assertIsGeneric(genericValue); let boolReturn;

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

async function implIn(genericValue, genericArrayIn) {
    await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('implIn:arrays'); await assertIsGeneric(genericValue); await assertIsGenericArray(genericArrayIn); let boolReturn;

    /* Convenience wrapper */
    let boolRes = false;
    boolRes = await contains(genericArrayIn, genericValue);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function indexOf(genericArrayIn, genericValue) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugCollect('generic Value = ' + genericValue + '; '); await internalDebugStackEnter('indexOf:arrays'); await assertIsGenericArray(genericArrayIn); await assertIsGeneric(genericValue); let intReturn;

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

async function arrEmpty(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('arrEmpty:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let boolRes = false;
    boolRes = await implEq(0, await count(genericArrayIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function arrNonempty(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('arrNonempty:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await arrEmpty(genericArrayIn));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function isArray(genericItemIn) {
    await internalDebugCollect('genericItem In = ' + genericItemIn + '; '); await internalDebugStackEnter('isArray:arrays'); await assertIsGenericItem(genericItemIn); let boolReturn;

    /* Just a convenience wrapper */
    let boolRes = false;
    boolRes = await isGenericArray(genericItemIn);

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function arrEq(genericArrayA, genericArrayB) {
    await internalDebugCollect('genericArray A = ' + genericArrayA + '; '); await internalDebugCollect('genericArray B = ' + genericArrayB + '; '); await internalDebugStackEnter('arrEq:arrays'); await assertIsGenericArray(genericArrayA); await assertIsGenericArray(genericArrayB); let boolReturn;

    let intCount = 0;
    intCount = await count(genericArrayA);
    if (await ne(intCount, await count(genericArrayB))) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }
    let genericElem;
    let intI = 0;
    while (await implLt(intI, intCount)) {
        genericElem = await get(genericArrayA, intI);
        if (await ne(genericElem, await get(genericArrayB, intI))) {

            boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
        }
        intI = await implAdd(intI, 1);
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
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

async function isIntBitArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('isIntBitArray:arrays'); await assertIsGenericArray(genericArrayIn); let boolReturn;

    let intCount = 0;
    intCount = await implSub(await count(genericArrayIn), 1);
    let genericElem;
    while (await ge(intCount, 0)) {
        genericElem = await get(genericArrayIn, intCount);
        if (await implNot(await isIntBit(genericElem))) {

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

async function runTestsOnly(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsOnly:unit-testing'); await assertIsBool(boolV); let boolReturn;

    /* Run tests without report. b/v=verbose: true=print test result lines; false=return value only */
    /* This runs each component's test suite */
    /* General tests */
    /*runTestsBits b/v */
    await runTestsMath(boolV);
    /*runTestsWasm b/v */
    /* Core tests */
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

async function runTestsFormatSems(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatSems:format-sems-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatSems');
    await runTest(boolV, await arrEq([ 1, 2 ], await dcaFromSems([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50 ], await dcaToSems([ 1, 2 ])));
    /* TODO: Support comment preservation */
    /*runTest b/v arrEq ( 1 2 ) dcaFromSems ( 49 32 50 35 65 ) */
    /*runTest b/v arrEq ( 49 32 50 ) dcaToSems ( 1 2 ) */

    await internalDebugStackExit();
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

async function runTestsWasm(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsWasm:wasm-tests'); await assertIsBool(boolV);

    await testing(boolV, 'wasm');
    await runTest(boolV, await implEq(42, await wasmCall('fortytwo', 0)));
    await runTest(boolV, await implEq(4, await wasmCallArrIn('add', [ 2, 2 ])));

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

async function runTestsFormatDc(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatDc:format-dc-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatDc');
    await runTest(boolV, await dcIsPrintable(21));
    await runTest(boolV, await implNot(await dcIsPrintable(231)));

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
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Path = ' + strPath + '; '); await internalDebugStackEnter('loadStoredDocument:public-interface'); await assertIsStr(strFormat); await assertIsStr(strPath); let intArrayReturn;

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
    intArrayOut = await strToByteArray('<!DOCTYPE html><html><head><title></title></head><body>');
    intArrayOut = await append(intArrayOut, await dcaToHtmlFragment(intArrayDcIn));
    intArrayOut = await append(intArrayOut, await strToByteArray('</body></html>'));
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function runTestsFormatIntegerList(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatIntegerList:format-integerlist-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatIntegerList');
    await runTest(boolV, await arrEq([ 1, 2 ], await dcaFromIntegerList([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50 ], await dcaToIntegerList([ 1, 2 ])));

    await internalDebugStackExit();
}

async function runTestsFormatUtf8(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatUtf8:format-utf8-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatUtf8');
    await runTest(boolV, await arrEq([ 35, 18, 36 ], await dcaFromUtf8([ 49, 32, 50 ])));
    await runTest(boolV, await arrEq([ 49, 32, 50 ], await dcaToUtf8([ 35, 18, 36 ])));

    await internalDebugStackExit();
}

async function dcaFromFormat(strInFormat, intArrayContentBytes) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('intArray ContentBytes = ' + intArrayContentBytes + '; '); await internalDebugStackEnter('dcaFromFormat:formats'); await assertIsStr(strInFormat); await assertIsIntArray(intArrayContentBytes); let intArrayReturn;

    await assertIsSupportedInputFormat(strInFormat);
    await assertIsByteArray(intArrayContentBytes);
    let intArrayRet = [];
    if (await implEq(strInFormat, 'sems')) {
        intArrayRet = await dcaFromSems(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'integerList')) {
        intArrayRet = await dcaFromIntegerList(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'ascii')) {
        intArrayRet = await dcaFromAscii(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'asciiSafeSubset')) {
        intArrayRet = await dcaFromAsciiSafeSubset(intArrayContentBytes);
    }
    else if (await implEq(strInFormat, 'utf8')) {
        intArrayRet = await dcaFromUtf8(intArrayContentBytes);
    }
    else {
        await implError(await implCat('Unimplemented document parsing format: ', strInFormat));
    }
    await assertIsDcArray(intArrayRet);

    intArrayReturn = intArrayRet; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function dcaToFormat(strOutFormat, intArrayDcArrayIn) {
    await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('intArray DcArrayIn = ' + intArrayDcArrayIn + '; '); await internalDebugStackEnter('dcaToFormat:formats'); await assertIsStr(strOutFormat); await assertIsIntArray(intArrayDcArrayIn); let intArrayReturn;

    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsDcArray(intArrayDcArrayIn);
    let intArrayRes = [];
    if (await implEq(strOutFormat, 'integerList')) {
        intArrayRes = await dcaToIntegerList(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'ascii')) {
        intArrayRes = await dcaToAscii(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'asciiSafeSubset')) {
        intArrayRes = await dcaToAsciiSafeSubset(intArrayDcArrayIn);
    }
    /*elif eq s/outFormat 'utf8' */
    /*    set an/ret dcaFromUtf8 an/contentBytes */
    else if (await implEq(strOutFormat, 'html')) {
        intArrayRes = await dcaToHtml(intArrayDcArrayIn);
    }
    else if (await implEq(strOutFormat, 'htmlFragment')) {
        intArrayRes = await dcaToHtmlFragment(intArrayDcArrayIn);
    }
    else {
        await implDie(await implCat('Unimplemented document render output format: ', strOutFormat));
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function convertFormats(strInFormat, strOutFormat, intArrayIn) {
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('convertFormats:formats'); await assertIsStr(strInFormat); await assertIsStr(strOutFormat); await assertIsIntArray(intArrayIn); let intArrayReturn;

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
    let strRes = '';
    if (await isSupportedCharEncoding(strFormat)) {
        strRes = await implCat(await getFormatExtension(strFormat), '.txt');

        strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    strRes = await getFormatExtension(strFormat);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcToFormat(strOutFormat, intDc) {
    await internalDebugCollect('str OutFormat = ' + strOutFormat + '; '); await internalDebugCollect('int Dc = ' + intDc + '; '); await internalDebugStackEnter('dcToFormat:formats'); await assertIsStr(strOutFormat); await assertIsInt(intDc); let intArrayReturn;

    /* Output byte array for a single dc, or an empty array if no output is available. Only operates on one Dc at a time. Some formats may not need this; calling with them is an error and should cause an assertion failure. */
    await assertIsSupportedOutputFormat(strOutFormat);
    await assertIsDc(intDc);
    let intArrayRes = [];
    if (await implEq(strOutFormat, 'utf8')) {
        let strLookup = '';
        strLookup = await dcDataLookupById('mappings/to/unicode', intDc, 1);
        if (await excOrEmpty(strLookup)) {
            strLookup = await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0);
        }
        if (await notExcep(strLookup)) {
            intArrayRes = await utf8BytesFromDecimalChar(await hexToDec(strLookup));
        }
    }
    else if (await implEq(strOutFormat, 'html')) {
        strRes = await dcDataLookupById('mappings/to/html', intDc, 1);
        if (await strNonempty(strRes)) {
            intArrayRes = await strToByteArray(strRes);
        }
        else {
            strRes = await dcDataLookupByValue('mappings/from/unicode', 1, intDc, 0);
            if (await isBaseStr(strRes, 16)) {
                intArrayRes = await append(intArrayRes, await utf8BytesFromDecimalChar(await hexToDec(strRes)));
            }
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
    await internalDebugCollect('str InFormat = ' + strInFormat + '; '); await internalDebugCollect('intArray Content = ' + intArrayContent + '; '); await internalDebugStackEnter('dcFromFormat:formats'); await assertIsStr(strInFormat); await assertIsIntArray(intArrayContent); let intArrayReturn;

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

async function exportWarning(intIndex, strProblem) {
    await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugCollect('str Problem = ' + strProblem + '; '); await internalDebugStackEnter('exportWarning:formats'); await assertIsInt(intIndex); await assertIsStr(strProblem);

    await implWarn(await implCat('A problem was encountered while exporting at character ', await implCat(await strFrom(intIndex), await implCat(': ', strProblem))));

    await internalDebugStackExit();
}

async function importWarning(intIndex, strProblem) {
    await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugCollect('str Problem = ' + strProblem + '; '); await internalDebugStackEnter('importWarning:formats'); await assertIsInt(intIndex); await assertIsStr(strProblem);

    await implWarn(await implCat('A problem was encountered while importing at character ', await implCat(await strFrom(intIndex), await implCat(': ', strProblem))));

    await internalDebugStackExit();
}

async function exportWarningUnmappable(intIndex, intProblemDc) {
    await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugCollect('int ProblemDc = ' + intProblemDc + '; '); await internalDebugStackEnter('exportWarningUnmappable:formats'); await assertIsInt(intIndex); await assertIsInt(intProblemDc);

    await exportWarning(intIndex, await implCat('The character ', await implCat(await strFrom(intProblemDc), ' could not be represented in the chosen export format.')));

    await internalDebugStackExit();
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

async function runTestsFormatHtml(boolV) {
    await internalDebugCollect('bool V = ' + boolV + '; '); await internalDebugStackEnter('runTestsFormatHtml:format-html-tests'); await assertIsBool(boolV);

    await testing(boolV, 'formatHtml');
    await runTest(boolV, await arrEq(await strToByteArray('<!DOCTYPE html><html><head><title></title></head><body>5&lt;6</body></html>'), await dcaToHtml([ 39, 46, 40 ])));

    await internalDebugStackExit();
}

async function isNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('isNonnegative:math'); await assertIsInt(intIn); let boolReturn;

    if (await implLt(intIn, 0)) {

        boolReturn = false; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
    }

    boolReturn = true; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function intIsBetween(intN, intA, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intIsBetween:math'); await assertIsInt(intN); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

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
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intFromBaseStr:math'); await assertIsStr(strN); await assertIsInt(intB); let intReturn;

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
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intToBaseStr:math'); await assertIsInt(intN); await assertIsInt(intB); let strReturn;

    /* Returns a string representing n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    let strRes = '';
    if (await implEq(0, intN)) {
        strRes = '0';
    }
    else {
        while (await implGt(intN, 0)) {
            strRes = await implCat(strRes, await intToBase36Char(await implMod(intN, intB)));
            intN = await implDiv(intN, intB);
        }
        strRes = await reverseStr(strRes);
    }
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
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseDigit:math'); await assertIsStr(strIn); await assertIsInt(intB); let boolReturn;

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
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('isBaseStr:math'); await assertIsStr(strIn); await assertIsInt(intB); let boolReturn;

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

async function formatPercentage(intA, intB) {
    await internalDebugCollect('int A = ' + intA + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('formatPercentage:math'); await assertIsInt(intA); await assertIsInt(intB); let strReturn;

    if (await implEq(0, intA)) {

        strReturn = '0.000'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
    }
    let intPercentageN = 0;
    intPercentageN = await implMul(100, await implDiv(await implMul(intA, 100000), intB));
    let strPercentageTemp = '';
    strPercentageTemp = await strFrom(intPercentageN);
    let intCount = 0;
    intCount = await implSub(await len(strPercentageTemp), 2);
    let intCounter = 0;
    intCounter = intCount;
    let strPercentage = '';
    let intDecimLoc = 0;
    intDecimLoc = await implSub(intCount, 3);
    while (await implGt(intCounter, 0)) {
        if (await implEq(intCounter, await implSub(intCount, intDecimLoc))) {
            strPercentage = await implCat(strPercentage, '.');
        }
        strPercentage = await implCat(strPercentage, await strChar(strPercentageTemp, await implSub(intCount, intCounter)));
        intCounter = await implSub(intCounter, 1);
    }

    strReturn = strPercentage; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function dcaToHtmlFragment(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToHtmlFragment:format-htmlFragment'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    intArrayOut = await append(intArrayOut, await strToByteArray('<div style="white-space:pre-wrap">'));
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    let intDcAtIndex = 0;
    while (await implLt(intInputIndex, intLen)) {
        intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        intArrayOut = await push(intArrayOut, await dcToFormat('html', intDcAtIndex));
        intInputIndex = await implAdd(intInputIndex, 1);
    }
    intArrayOut = await append(intArrayOut, await strToByteArray('</div>'));
    await assertIsByteArray(intArrayOut);

    intArrayReturn = intArrayOut; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

/* Can check for exception as result like: if eq s/res dcDataNoResultException */

async function dcDataNoResultException() {
    await internalDebugStackEnter('dcDataNoResultException:exceptions'); let strReturn;


    strReturn = '89315802-d53d-4d11-ba5d-bf505e8ed454'; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function excep(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('excep:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = false;
    /* Test for each exception type in turn (there's only one so far) */
    boolRes = await or(boolRes, await implEq(strTest, await dcDataNoResultException()));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function notExcep(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('notExcep:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excep(strTest));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function excOrEmpty(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('excOrEmpty:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = await or(await excep(strTest), await strEmpty(strTest));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function notExcOrEmpty(strTest) {
    await internalDebugCollect('str Test = ' + strTest + '; '); await internalDebugStackEnter('notExcOrEmpty:exceptions'); await assertIsStr(strTest); let boolReturn;

    let boolRes = false;
    boolRes = await implNot(await excOrEmpty(strTest));

    boolReturn = boolRes; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
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

async function printArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('printArray:type-conversion'); await assertIsGenericArray(genericArrayIn); let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function printArr(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('printArr:type-conversion'); await assertIsGenericArray(genericArrayIn); let strReturn;

    /* Just a convenience wrapper */
    let strRes = '';
    strRes = await strPrintArr(genericArrayIn);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
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
