// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file contains portable code for all JavaScript implementations of EITE.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.
// It also serves as an example implementation that should be written in a way that is easily ported to other platforms.
// To serve these two goals, it should not use I/O, objects, first-class functions, JavaScript-specific libraries, or null/undefined values.
// Things that depend on I/O and JavaScript-specific libraries (e.g. logging using JSON.stringify) should be implemented in eite-[platform].js  (for platform-specific code) or eite-nonportable.js for JavaScript-specific code.
// Those files should use clearly defined APIs that this file's code can call, so that they can be implemented as appropriate in other implementations.
// dcData object must be available before calling these functions.
// Special types: dc = a string
// TODO: Function parameters and return values should be type-checked to ensure their validity. Similarly, the string types that correspond to a set of possible values (format names, encoding names, etc.) should be checked against the set (this could also be reflected in more specific/meaningful identifier prefixes).

function eiteLog(strMessage) {
    assertIsStr(strMessage);
    return implEiteLog(strMessage);
}
function eiteWarn(strMessage) {
    assertIsStr(strMessage);
    eiteLog('EITE reported warning: '+strMessages);
}
function eiteError(strMessage) {
    assertIsStr(strMessage); // FIXME: recursive loop?
    eiteLog('EITE reported error!: '+strMessage);
    die('EITE reported error!: '+strMessage);
}

// Utility functions for working with various data types: wrappers for implementation
function assertIsInt(int) {
    return implAssertIsInt(int);
}
function assertIsStr(str) {
    return implAssertIsStr(str);
}

function strFromByte(intInput) {
    assertIsInt(intInput);
    return implStrFromByte(intInput)
}
async function strFromUnicodeHex(strInput) {
    assertIsStr(strInput)
    return await implStrFromUnicodeHex(strInput);
}
async function intDcarrLength(dcarrInput) {
    return await implIntDcarrLength(dcarrInput);
}
function intBytearrayLength(bytearrayInput) {
    return implIntBytearrayLength(bytearrayInput);
}
function strToInt(str) {
    assertIsStr(str);
    return implStrToInt(str);
}

// Utility functions for working with various data types
function assertIsDc(dc) {
    return assertIsStr(dc);
}

// Tools for Dc text
    function intDcIdToCsvRow(dc) {
        assertIsDc(dc);
        return strToInt(dc) + 1;
    }
    function strDcDataLookupById(strDataset, dc, intFieldNumber) {
        assertIsStr(strDataset); assertIsDc(dc); assertIsInt(intFieldNumber);
        return dcData[strDataset][intDcIdToCsvRow(dc)].data[0][intFieldNumber];
    }
    async function strDcDataLookupByValue(strDataset, filterField, filterValue, desiredField) {
        let intLength = dcData[strDataset].length;
        // start at 1 to skip header row
        for (let intRow = 1; intRow < intLength; intRow++) {
            if(dcData[strDataset][intRow].data[0][filterField] === filterValue) {
                return dcData[strDataset][intRow].data[0][desiredField];
            }
        }
    }
    function strDcGetField(dc, intFieldNumber) {
        return strDcDataLookupById("DcData", dc, intFieldNumber);
    }
    function strDcGetName(dc) {
        return strDcGetField(dc, 1);
    }
    function strDcGetCombiningClass(dc) {
        return strDcGetField(dc, 2);
    }
    function strDcGetBidiClass(dc) {
        return strDcGetField(dc, 3);
    }
    function strDcGetCasing(dc) {
        return strDcGetField(dc, 4);
    }
    function strDcGetType(dc) {
        return strDcGetField(dc, 5);
    }
    function strDcGetScript(dc) {
        return strDcGetField(dc, 6);
    }
    function strDcGetComplexTraits(dc) {
        return strDcGetField(dc, 7);
    }
    function strDcGetDescription(dc) {
        return strDcGetField(dc, 8);
    }

    function boolDcIsNewline(dc) {
        if(strDcGetBidiClass(dc) === 'B') {
            return true;
        }
        return false;
    }

    function boolDcIsPrintable(dc) {
        strType=strDcGetType(dc);
        strGeneralType=strType[0];
        switch(strType) {
            case 'Zl':
            case 'Zp':
                return false;
                break;
            default:
                break;
        }
        switch(strGeneralType) {
            case '!':
            case 'C':
                return false;
                break;
            default:
                break;
        }
        return true;
    }

// Tools for ASCII text
    // Checks whether N is within the range A and B, including endpoints
    function boolIsBetween(intN, intA, intB) {
        return (intN - intA) * (intN - intB) <= 0;
    }
    function boolIsDigit(intN) {
        return boolIsBetween(intN, 48, 57);
    }
    function boolIsPrintable(intN) {
        return boolIsBetween(intN, 32, 126);
    }
    function boolIsSpace(intN) {
        return intN == 32;
    }
    function boolIsNewline(intN) {
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
            await eiteError('Unimplemented character encoding: '+strCharacterEncoding);
            break;
    }
}

async function dcarrParseDocument(strFormat, bytearrayContent) {
    switch (strFormat) {
        case 'sems':
            return await dcarrParseSems(bytearrayContent);
            break;
        default:
            await eiteError('Unimplemented document parsing format: '+strFormat);
            break;
    }
}

async function dcarrParseSems(bytearrayContent) {
    // Accepts an array of bytes of a SEMS format document. Returns an array of Dcs.
    var dcarrParseResults = [];
    var strParserState = 'dc';
    var strCurrentDc = '';
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
            await eiteError('Unimplemented document render target format: '+strTargetFormat);
            break;
    }
    return dcarrOutput;
}

async function runDocument(dcarrContent) {
    strTargetFormat = await implGetEnvironmentBestFormat();
    await implDoRenderIo(await dcarrConvertDocument(dcarrContent, strTargetFormat, await implGetEnvironmentRenderTraits(strTargetFormat)), strTargetFormat);
}
// @license-end
