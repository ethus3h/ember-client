// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

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
async function strCharAtPos(strStr, intIndex) {
    await internalDebugCollect('str Str = ' + strStr + '; '); await internalDebugCollect('int Index = ' + intIndex + '; '); await internalDebugStackEnter('strCharAtPos:strings'); await assertIsStr(strStr);await assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

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
/*r/v/assertIsTrue b/in */
/*    if ne b/in true */
/*        assertionFailed cat bool ' is not true.' */

async function assertIsByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsByte:assertions'); await assertIsInt(intIn); let voidReturn;

    await assertIsTrue(await intIsBetween(intIn, 0, 255));
    await internalDebugStackExit();
}

async function assertIsArray(genericArrayIn) {
    await internalDebugCollect('genericArray In = ' + genericArrayIn + '; '); await internalDebugStackEnter('assertIsArray:assertions'); await assertIsGenericArray(genericArrayIn); let voidReturn;

    /* Just a convenience wrapper */
    await assertIsGenericArray(genericArrayIn);
    await internalDebugStackExit();
}

async function assertIsChar(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertIsChar:assertions'); await assertIsStr(strIn); let voidReturn;

    await assertIsCharByte(await byteFromChar(strIn));
    await internalDebugStackExit();
}

async function assertIsCharByte(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsCharByte:assertions'); await assertIsInt(intIn); let voidReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    await assertIsTrue(await intIsBetween(intIn, 32, 126));
    await internalDebugStackExit();
}

async function assertStrContainsOnlyInt(strIn) {
    await internalDebugCollect('str In = ' + strIn + '; '); await internalDebugStackEnter('assertStrContainsOnlyInt:assertions'); await assertIsStr(strIn); let voidReturn;

    /* Positive int, specifically. Only digits allowed. */
    let intTemp = 0;
    intTemp = await len(strIn);
    let intI = 0;
    intI = 0;
    while (await implLt(intI, intTemp)) {
        if (await implNot(await asciiIsDigit(await byteFromChar(await strCharAtPos(strIn, intI))))) {
            await assertionFailed(await implCat(strIn, ' does not only contain an integer.'));
        }
        intI = await implAdd(intI, 1);
    }
    await internalDebugStackExit();
}

async function assertIsNonnegative(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsNonnegative:assertions'); await assertIsInt(intIn); let voidReturn;

    if (await implLt(intIn, 0)) {
        let strTemp = '';
        strTemp = await strFromInt(intIn);
        await assertionFailed(await implCat(strTemp, ' is negative.'));
    }
    await internalDebugStackExit();
}

async function assertIsDc(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('assertIsDc:assertions'); await assertIsInt(intIn); let voidReturn;

    await assertIsNonnegative(intIn);
    await internalDebugStackExit();
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

async function intToBaseNChar(intN) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugStackEnter('intToBaseNChar:math'); await assertIsInt(intN); let strReturn;

    /* Returns the nth digit in base 36 or less (using capitalized digits). */
    await assertIsTrue(await intIsBetween(intN, 0, 36));
    let strRes = '';
    if (await le(intN, 9)) {
        strRes = await strFromByte(await implAdd(intN, 48));
    }
    else  {
        strRes = await strFromByte(await implAdd(intN, 55));
    }

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

async function intFromBaseNChar(strN) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugStackEnter('intFromBaseNChar:math'); await assertIsStr(strN); let intReturn;

    /* Returns an int given the nth digit in base 36 or less (using capitalized digits). */
    await assertIsChar(strN);
    let intRes = 0;
    intRes = await byteFromChar(strN);
    if (await ge(intRes, 65)) {
        intRes = await implSub(intRes, 55);
    }
    else  {
        intRes = await implSub(intRes, 48);
    }
    await assertIsTrue(await intIsBetween(intRes, 0, 36));

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function intFromBaseStr(strN, intB) {
    await internalDebugCollect('str N = ' + strN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intFromBaseStr:math'); await assertIsStr(strN);await assertIsInt(intB); let intReturn;

    /* Returns the integer represented by n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    let intRes = 0;
    intRes = 0;
    let intLen = 0;
    intLen = await len(strN);
    let intInt = 0;
    intInt = 0;
    let intPow = 0;
    intPow = 1;
    while (await ge(intLen, 0)) {
        intLen = await implSub(intLen, 1);
        intInt = await intFromBaseNChar(await strCharAtPos(strN, intLen));
        await assertIsTrue(await implLt(intInt, intB));
        alert(intInt);
        alert(intPow);
        intRes = await implAdd(await implMul(intInt, intPow));
        intPow = await implMul(intPow, intB);
    }

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function intToBaseStr(intN, intB) {
    await internalDebugCollect('int N = ' + intN + '; '); await internalDebugCollect('int B = ' + intB + '; '); await internalDebugStackEnter('intToBaseStr:math'); await assertIsInt(intN);await assertIsInt(intB); let strReturn;

    /* Returns a string representing n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/ */
    let strRes = '';
    while (await implGt(intN, 0)) {
        strRes = await implCat(strRes, await intToBaseNChar(await implMod(intN, intB)));
        intN = await implDiv(intN, intB);
    }
    strRes = await reverseStr(strRes);

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}
async function strPrintArr(genericArrayInput) {
    await internalDebugCollect('genericArray Input = ' + genericArrayInput + '; '); await internalDebugStackEnter('strPrintArr:type-conversion'); await assertIsGenericArray(genericArrayInput); let strReturn;

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

async function strFromHex(strCharacter) {
    await internalDebugCollect('str Character = ' + strCharacter + '; '); await internalDebugStackEnter('strFromHex:type-conversion'); await assertIsStr(strCharacter); let strReturn;

    /* Bear in mind that StageL doesn't attempt to support Unicode. */
    let strRes = '';
    strRes = await strFromByte(await intFromBaseStr(strCharacter, 16));

    strReturn = strRes; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}

// @license-end
