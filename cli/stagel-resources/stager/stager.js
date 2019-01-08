// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

function asciiIsDigit(intN) {
    assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = intIsBetween(intN, 48, 57);

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function asciiIsPrintable(intN) {
    assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = intIsBetween(intN, 32, 126);

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function asciiIsSpace(intN) {
    assertIsInt(intN); let boolReturn;

    let boolTemp = false;
    boolTemp = implEq(intN, 32);

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function asciiIsNewline(intN) {
    assertIsInt(intN); let boolReturn;

    let boolT1 = false;
    boolT1 = implEq(intN, 10);
    let boolT2 = false;
    boolT2 = or(boolT1, implEq(intN, 13));

    boolReturn = boolT2; assertIsBool(boolReturn); return boolReturn;
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
function strCharAtPos(strStr, intIndex) {
    assertIsStr(strStr); assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = substring(strStr, intIndex, 1);

    strReturn = strTemp; assertIsStr(strReturn); return strReturn;
}
function or(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(boolA);
    boolTemp = implNot(implAnd(boolTemp, implNot(boolB)));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function nor(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(or(boolA, boolB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function nand(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(implAnd(boolA, boolB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function xor(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = nand(boolA, boolB);
    boolTemp = implAnd(boolTemp, or(boolA, boolB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function xnor(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(xor(boolA, boolB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}
function assertIsByte(intIn) {
    assertIsInt(intIn); let voidReturn;

    let boolTemp = false;
    boolTemp = le(intIn, 255);
    let strIn = '';
    strIn = strFromInt(intIn);
    if (implNot(implAnd(boolTemp, ge(intIn, 0)))) {
        implDie(implCat('Assertion failed: ', implCat(strIn, ' is not a byte.')));
    }
}

function assertIsArray(genericArrayIn) {
    assertIsGenericArray(genericArrayIn); let voidReturn;

    /* Just a convenience wrapper */
    assertIsGenericArray(genericArrayIn);
}

function assertIsChar(strIn) {
    assertIsStr(strIn); let voidReturn;

    if (ne(1, len(strIn))) {
        implDie(implCat('Assertion failed: ', implCat(strIn, ' is not a character.')));
    }
}

function assertStrContainsOnlyInt(strIn) {
    assertIsStr(strIn); let voidReturn;

    /* Positive int, specifically. Only digits allowed. */
    let intTemp = 0;
    intTemp = len(strIn);
    let intI = 0;
    intI = 0;
    while (implLt(intI, intTemp)) {
        if (implNot(asciiIsDigit(byteFromChar(strCharAtPos(strIn, intI))))) {
            implDie(implCat('Assertion failed: ', implCat(strIn, ' does not only contain an integer.')));
        }
        intI = implAdd(intI, 1);
    }
}

function assertIsNonnegative(intIn) {
    assertIsInt(intIn); let voidReturn;

    if (implLt(intIn, 0)) {
        let strTemp = '';
        strTemp = strFromInt(intIn);
        implDie(implCat('Assertion failed: ', implCat(strTemp, ' is negative.')));
    }
}

function assertIsDc(intIn) {
    assertIsInt(intIn); let voidReturn;

    assertIsNonnegative(intIn);
}
/* Calling a comparison with different types is an error. All types must be same type. */

function ne(genericA, genericB) {
    assertIsGeneric(genericA); assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(implEq(genericA, genericB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function ge(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = implEq(intA, intB);
    boolTemp = or(boolTemp, implGt(intA, intB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function le(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = implEq(intA, intB);
    boolTemp = or(boolTemp, implLt(intA, intB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function ngt(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(implGt(intA, intB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function nlt(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(implLt(intA, intB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function nge(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(ge(intA, intB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}

function nle(intA, intB) {
    assertIsInt(intA); assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = implNot(le(intA, intB));

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}
function intIsBetween(intN, intA, intB) {
    assertIsInt(intN); assertIsInt(intA); assertIsInt(intB); let boolReturn;

    /* Checks whether N is within the range A and B, including endpoints */
    let intT1 = 0;
    intT1 = implSub(intN, intA);
    let intT2 = 0;
    intT2 = implSub(intN, intB);
    let intT3 = 0;
    intT3 = implMul(intT1, intT2);
    let boolTemp = false;
    boolTemp = le(intT3, 0);

    boolReturn = boolTemp; assertIsBool(boolReturn); return boolReturn;
}
function strPrintArr(genericArrayInput) {
    assertIsGenericArray(genericArrayInput); let strReturn;

    let intCount = 0;
    intCount = count(genericArrayInput);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (implLt(intI, intCount)) {
        strOut = implCat(strOut, strFrom(get(genericArrayInput, intI)));
        strOut = implCat(strOut, ' ');
        intI = implAdd(intI, 1);
    }

    strReturn = strOut; assertIsStr(strReturn); return strReturn;
}

// @license-end
