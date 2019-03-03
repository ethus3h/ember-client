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
                await exportWarning(intC, await implCat('The character ', await implCat(await strFrom(intDcAtIndex), ' could not be represented in the chosen export format.')));
            }
        }
        else {
            await exportWarning(intC, await implCat('The character ', await implCat(await strFrom(intDcAtIndex), ' could not be represented in the chosen export format.')));
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

    await runTest(boolV, await implEq(4, await implAdd(2, 2)));
    await runTest(boolV, await ne(4, await implAdd(2, 3)));

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
            await exportWarning(intC, await implCat('The character ', await implCat(await strFrom(intDcAtIndex), ' could not be represented in the chosen export format.')));
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

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function getSettingForFormat(strFormat, strDirection, strSettingKey) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugCollect('str SettingKey = ' + strSettingKey + '; '); await internalDebugStackEnter('getSettingForFormat:formats-settings'); await assertIsStr(strFormat); await assertIsStr(strDirection); await assertIsStr(strSettingKey); let strReturn;

    /* s/direction can be "in" for import settings or "out" for export settings. */
    let strRes = '';
    strRes = await getNext(await indexOf(await getSettingsForFormat(strFormat, strDirection), strSettingKey));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function getSettingsForFormat(strFormat, strDirection) {
    await internalDebugCollect('str Format = ' + strFormat + '; '); await internalDebugCollect('str Direction = ' + strDirection + '; '); await internalDebugStackEnter('getSettingsForFormat:formats-settings'); await assertIsStr(strFormat); await assertIsStr(strDirection); let strArrayReturn;

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
}

async function dcaToAsciiSafeSubset(intArrayDcIn) {
    await internalDebugCollect('intArray DcIn = ' + intArrayDcIn + '; '); await internalDebugStackEnter('dcaToAsciiSafeSubset:format-asciiSafeSubset'); await assertIsIntArray(intArrayDcIn); let intArrayReturn;

    await assertIsDcArray(intArrayDcIn);
    let intArrayOut = [];
    let intArrayTemp = [];
    intArrayTemp = await dcaToAscii(intArrayDcIn);
    let intLen = 0;
    intLen = await count(intArrayDcIn);
    let intInputIndex = 0;
    intInputIndex = 0;
    let intDcAtIndex = 0;
    let strState = '';
    strState = 'normal';
    let intArrayTempChar = [];
    while (await implLt(intInputIndex, intLen)) {
        intDcAtIndex = await get(intArrayDcIn, intInputIndex);
        if (await implEq(intDcAtIndex, 121)) {
            strState = 'crlf';
        }
        if (await implEq(strState, 'normal')) {
            intArrayTempChar = await dcToFormat('html', intDcAtIndex);
            if (await dcIsNewline(intDcAtIndex)) {
                intArrayOut = await append(intArrayOut, await crlf());
            }
            else if (await isAsciiSafeSubsetChar(await get(intArrayTempChar, 0))) {
                intArrayOut = await push(intArrayOut, intArrayTempChar);
            }
            else {
                await exportWarning(intInputIndex, await implCat('The character ', await implCat(await strFrom(intDcAtIndex), ' could not be represented in the chosen export format.')));
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
    boolRes = await or(await asciiIsPrintable(intChar), await or(await asciiIsNewline(intChar)));

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
    while (await le(intI, intCount)) {
        strCandidateFmtType = await dcDataLookupById('formats', intI, 6);
        if (await implEq('v:', await substr(strCandidateFmtType, 0, 2))) {
            strCandidateFmtType = await substr(strCandidateFmtType, 3, -1);
            if (await implIn(