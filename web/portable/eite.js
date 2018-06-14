// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file contains portable code for all JavaScript implementations of EITE.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.
// It also serves as an example implementation that should be written in a way that is easily ported to other platforms.
// To serve these two goals, it should not use I/O, objects, first-class functions, JavaScript-specific libraries, or null/undefined values.
// TODO: It should probably also declare all array sizes? Or else, put array operations into the non-portable categories, and have a set of impl* functions as an API for them instead.
// Things that depend on I/O and JavaScript-specific libraries (e.g. logging using JSON.stringify) should be implemented in eite-[platform].js  (for platform-specific code) or eite-nonportable.js for JavaScript-specific code.
// Those files should use clearly defined APIs that this file's code can call, so that they can be implemented as appropriate in other implementations.
// dcData object must be available before calling these functions.
// Special types: dc = a string, but with an int as its contents
// Assert functions return nothing, and should call eiteError if they fail.
// "eite" functions (logging) return nothing.
// TODO: DcData and renderTraits shouldn't be used here, since they're JS-specific, complex objects. They should be provided by APIs and/or simple data types instead. This will also allow the "dc" ad-hoc data type to actually be an int, instead of a string containing an int (which is kind of stupid ­— it should just be an int).
// TODO: Function parameters and return values should be type-checked to ensure their validity. Similarly, the string types that correspond to a set of possible values (format names, encoding names, etc.) should be checked against the set (this could also be reflected in more specific/meaningful identifier prefixes).


// Tools for ASCII text
    // Checks whether N is within the range A and B, including endpoints
    async function boolIsBetween(intN, intA, intB) {
        return (intN - intA) * (intN - intB) <= 0;
    }
    async function boolIsDigit(intN) {
        return await boolIsBetween(intN, 48, 57);
    }
    async function boolIsPrintable(intN) {
        return await boolIsBetween(intN, 32, 126);
    }
    async function boolIsSpace(intN) {
        return intN == 32;
    }
    async function boolIsNewline(intN) {
        return (intN == 10) || (intN == 13);
    }
    /*
    0  NUL    16 DLE    32 SP   48 0    64 @    80 P    96  `    112 p
    1  SOH    17 DC1    33 !    49 1    65 A    81 Q    97  a    113 q
    2  STX    18 DC2    34 "    50 2    66 B    82 R    98  b    114 r
    3  ETX    19 DC3    35 #    51 3    67 C    83 S    99  c    115 s
    4  EOT    20 DC4    36 $    52 4    68 D    84 T    100 d    116 t
    5  ENQ    21 NAK    37 %    53 5    69 E    85 U    101 e    117 u
    6  ACK    22 SYN    38 &    54 6    70 F    86 V    102 f    118 v
    7  BEL    23 ETB    39 '    55 7    71 G    87 W    103 g    119 w
    8  BS     24 CAN    40 (    56 8    72 H    88 X    104 h    120 x
    9  HT     25 EM     41 )    57 9    73 I    89 Y    105 i    121 y
    10 LF     26 SUB    42 *    58 :    74 J    90 Z    106 j    122 z
    11 VT     27 ESC    43 +    59 ;    75 K    91 [    107 k    123 {
    12 FF     28 FS     44 ,    60 <    76 L    92 \    108 l    124 |
    13 CR     29 GS     45 -    61 =    77 M    93 ]    109 m    125 }
    14 SO     30 RS     46 .    62 >    78 N    94 ^    110 n    126 ~
    15 SI     31 US     47 /    63 ?    79 O    95 _    111 o    127 DEL
    */

async function strPrintableDcToChar(dc, strCharacterEncoding) {
    switch (strCharacterEncoding) {
        case 'ASCII-safe-subset':
        case 'UTF-8':
            return await strFromUnicodeHex(await strDcDataLookupByValue("mappings/from/unicode", 1, dc, 0));
            break;
        default:
            await eiteError('Unimplemented character encoding: ' + strCharacterEncoding);
            break;
    }
}

async function dcarrParseDocument(strFormat, bytearrayContent) {
    switch (strFormat) {
        case 'sems':
            return await dcarrParseSems(bytearrayContent);
            break;
        default:
            await eiteError('Unimplemented document parsing format: ' + strFormat);
            break;
    }
}

async function dcarrParseSems(bytearrayContent) {
    // Accepts an array of bytes of a SEMS format document. Returns an array of Dcs.
    let dcarrParseResults = [];
    let strParserState = 'dc';
    let strCurrentDc = '';
    let intContentLength = await intBytearrayLength(bytearrayContent);
    for (let intByteOffset = 0; intByteOffset < await intBytearrayLength(bytearrayContent); intByteOffset++) {
        // do something with each byte in the array. bytearrayContent[intByteOffset] holds the decimal value of the given byte.
        switch (strParserState) {
            case 'dc':
                if (await boolIsDigit(bytearrayContent[intByteOffset])) {
                    strCurrentDc = strCurrentDc + await strFromByte(bytearrayContent[intByteOffset]);
                }
                if (await boolIsSpace(bytearrayContent[intByteOffset])) {
                    dcarrParseResults.push(strCurrentDc);
                    strCurrentDc = '';
                }
                if (bytearrayContent[intByteOffset] == 35) { // pound sign: start comment
                    strParserState = 'comment';
                }
                break;
            case 'comment':
                if (await boolIsNewline(bytearrayContent[intByteOffset])) {
                    strParserState = 'dc';
                }
                break;
        }
    }
    return dcarrParseResults;
}

async function dcarrConvertDocument(dcarrInput, strTargetFormat, renderTraits) {
    dcarrOutput=[];
    // Build render output buffer for specified format
    let intInputLength = 0;
    switch (strTargetFormat) {
        case 'integerList':
            intInputLength = await intDcarrLength(dcarrInput);
            for (let intInputIndex = 0; intInputIndex < intInputLength; intInputIndex++) {
                dcarrOutput[intInputIndex] = dcarrInput[intInputIndex];
            }
            break;
        case 'immutableCharacterCells':
            let intLine = 0;
            dcarrOutput[0] = '';
            intInputLength = await intDcarrLength(dcarrInput);
            for (let intInputIndex = 0; intInputIndex < intInputLength; intInputIndex++) {
                if (await boolDcIsNewline(dcarrInput[intInputIndex])) {
                    intLine = intLine + 1;
                    dcarrOutput[intLine] = '';
                }
                if (await boolDcIsPrintable(dcarrInput[intInputIndex])) {
                    dcarrOutput[intLine] = dcarrOutput[intLine] + await strPrintableDcToChar(dcarrInput[intInputIndex], renderTraits.characterEncoding);
                }
            }
            break;
        default:
            await eiteError('Unimplemented document render target format: ' + strTargetFormat);
            break;
    }
    return dcarrOutput;
}

async function runDocument(dcarrContent) {
    strTargetFormat = await implGetEnvironmentBestFormat();
    await implDoRenderIo(await dcarrConvertDocument(dcarrContent, strTargetFormat, await implGetEnvironmentRenderTraits(strTargetFormat)), strTargetFormat);
}
// @license-end
