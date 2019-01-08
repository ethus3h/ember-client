// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function asciiIsDigit(intN) {
    await internalDebugStackEnter('asciiIsDigit'); await internalDebugCollect('int N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 48, 57);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsPrintable(intN) {
    await internalDebugStackEnter('asciiIsPrintable'); await internalDebugCollect('int N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await intIsBetween(intN, 32, 126);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsSpace(intN) {
    await internalDebugStackEnter('asciiIsSpace'); await internalDebugCollect('int N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intN, 32);

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function asciiIsNewline(intN) {
    await internalDebugStackEnter('asciiIsNewline'); await internalDebugCollect('int N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); let boolReturn;

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
    await internalDebugStackEnter('strCharAtPos'); await internalDebugCollect('str Str; '); await assertIsStr(strStr); await internalDebugStackEnterEnd(); await internalDebugCollect('int Index; '); await assertIsInt(intIndex); await internalDebugStackEnterEnd(); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp; await assertIsStr(strReturn); await internalDebugStackExit(); return strReturn;
}
async function or(boolA, boolB) {
    await internalDebugStackEnter('or'); await internalDebugCollect('bool A; '); await assertIsBool(boolA); await internalDebugStackEnterEnd(); await internalDebugCollect('bool B; '); await assertIsBool(boolB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nor(boolA, boolB) {
    await internalDebugStackEnter('nor'); await internalDebugCollect('bool A; '); await assertIsBool(boolA); await internalDebugStackEnterEnd(); await internalDebugCollect('bool B; '); await assertIsBool(boolB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nand(boolA, boolB) {
    await internalDebugStackEnter('nand'); await internalDebugCollect('bool A; '); await assertIsBool(boolA); await internalDebugStackEnterEnd(); await internalDebugCollect('bool B; '); await assertIsBool(boolB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xor(boolA, boolB) {
    await internalDebugStackEnter('xor'); await internalDebugCollect('bool A; '); await assertIsBool(boolA); await internalDebugStackEnterEnd(); await internalDebugCollect('bool B; '); await assertIsBool(boolB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function xnor(boolA, boolB) {
    await internalDebugStackEnter('xnor'); await internalDebugCollect('bool A; '); await assertIsBool(boolA); await internalDebugStackEnterEnd(); await internalDebugCollect('bool B; '); await assertIsBool(boolB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await xor(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}
async function assertIsByte(intIn) {
    await internalDebugStackEnter('assertIsByte'); await internalDebugCollect('int In; '); await assertIsInt(intIn); await internalDebugStackEnterEnd(); let voidReturn;

    let boolTemp = false;
    boolTemp = await le(intIn, 255);
    let strIn = '';
    strIn = await strFromInt(intIn);
    if (await implNot(await implAnd(boolTemp, await ge(intIn, 0)))) {
        await implDie(await implCat('Assertion failed: ', await implCat(strIn, ' is not a byte.')));
    }
    await internalDebugStackExit();
}

async function assertIsArray(genericArrayIn) {
    await internalDebugStackEnter('assertIsArray'); await internalDebugCollect('genericArray In; '); await assertIsGenericArray(genericArrayIn); await internalDebugStackEnterEnd(); let voidReturn;

    /* Just a convenience wrapper */
    await assertIsGenericArray(genericArrayIn);
    await internalDebugStackExit();
}

async function assertIsChar(strIn) {
    await internalDebugStackEnter('assertIsChar'); await internalDebugCollect('str In; '); await assertIsStr(strIn); await internalDebugStackEnterEnd(); let voidReturn;

    if (await ne(1, await len(strIn))) {
        await implDie(await implCat('Assertion failed: ', await implCat(strIn, ' is not a character.')));
    }
    await internalDebugStackExit();
}

async function assertStrContainsOnlyInt(strIn) {
    await internalDebugStackEnter('assertStrContainsOnlyInt'); await internalDebugCollect('str In; '); await assertIsStr(strIn); await internalDebugStackEnterEnd(); let voidReturn;

    /* Positive int, specifically. Only digits allowed. */
    let intTemp = 0;
    intTemp = await len(strIn);
    let intI = 0;
    intI = 0;
    while (await implLt(intI, intTemp)) {
        if (await implNot(await asciiIsDigit(await byteFromChar(await strCharAtPos(strIn, intI))))) {
            await implDie(await implCat('Assertion failed: ', await implCat(strIn, ' does not only contain an integer.')));
        }
        intI = await implAdd(intI, 1);
    }
    await internalDebugStackExit();
}

async function assertIsNonnegative(intIn) {
    await internalDebugStackEnter('assertIsNonnegative'); await internalDebugCollect('int In; '); await assertIsInt(intIn); await internalDebugStackEnterEnd(); let voidReturn;

    if (await implLt(intIn, 0)) {
        let strTemp = '';
        strTemp = await strFromInt(intIn);
        await implDie(await implCat('Assertion failed: ', await implCat(strTemp, ' is negative.')));
    }
    await internalDebugStackExit();
}

async function assertIsDc(intIn) {
    await internalDebugStackEnter('assertIsDc'); await internalDebugCollect('int In; '); await assertIsInt(intIn); await internalDebugStackEnterEnd(); let voidReturn;

    await assertIsNonnegative(intIn);
    await internalDebugStackExit();
}
/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(genericA, genericB) {
    await internalDebugStackEnter('ne'); await internalDebugCollect('generic A; '); await assertIsGeneric(genericA); await internalDebugStackEnterEnd(); await internalDebugCollect('generic B; '); await assertIsGeneric(genericB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ge(intA, intB) {
    await internalDebugStackEnter('ge'); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function le(intA, intB) {
    await internalDebugStackEnter('le'); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function ngt(intA, intB) {
    await internalDebugStackEnter('ngt'); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nlt(intA, intB) {
    await internalDebugStackEnter('nlt'); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nge(intA, intB) {
    await internalDebugStackEnter('nge'); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}

async function nle(intA, intB) {
    await internalDebugStackEnter('nle'); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await le(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); await internalDebugStackExit(); return boolReturn;
}
async function intIsBetween(intN, intA, intB) {
    await internalDebugStackEnter('intIsBetween'); await internalDebugCollect('int N; '); await assertIsInt(intN); await internalDebugStackEnterEnd(); await internalDebugCollect('int A; '); await assertIsInt(intA); await internalDebugStackEnterEnd(); await internalDebugCollect('int B; '); await assertIsInt(intB); await internalDebugStackEnterEnd(); let boolReturn;

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
async function strPrintArr(genericArrayInput) {
    await internalDebugStackEnter('strPrintArr'); await internalDebugCollect('genericArray Input; '); await assertIsGenericArray(genericArrayInput); await internalDebugStackEnterEnd(); let strReturn;

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

// @license-end
