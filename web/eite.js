// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file contains portable code for all JavaScript implementations of EITE.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.
// It also serves as an example implementation that should be written in a way that is easily ported to other platforms.
// To serve these two goals, it should not use I/O, objects, first-class functions, or JavaScript-specific libraries.
// Things that depend on I/O and JavaScript-specific libraries (e.g. logging using JSON.stringify) should be implemented in eite-[platform].js  (for platform-specific code) or eite-nonportable.js for JavaScript-specific code.
// Those files should use clearly defined APIs that this file's code can call, so that they can be implemented as appropriate in other implementations.
// dcData object must be available before calling these functions.

function eiteLog(message) {
    eiteImplLog(message);
}
function eiteWarn(message) {
    eiteLog('EITE reported warning: '+normalizeMessage(message));
}
function eiteError(message) {
    eiteLog('EITE reported error!: '+normalizeMessage(message));
    throw 'EITE reported error!: '+normalizeMessage(message);
}

// Tools for Dc text
{
    function dcIdToIdx(dc) {
        return parseInt(dc) + 1;
    }
    function dcDataLookupById(dataset, dc, fieldNumber) {
        return dcData[dataset][dcIdToIdx(dc)].data[0][fieldNumber];
    }
    function dcDataLookupByValue(dataset, filterField, filterValue, desiredField) {
        let length = dcData[dataset].length;
        // start at 1 to skip header row
        for(let index = 1; index < length; index++) {
            if(dcData[dataset][index].data[0][filterField] === filterValue) {
                return dcData[dataset][index].data[0][desiredField];
            }
        }
    }
    function dcGetField(dc, fieldNumber) {
        return dcDataLookupById("DcData", dc, fieldNumber);
    }
    function dcGetName(dc) {
        return dcGetField(dc, 1);
    }
    function dcGetCombiningClass(dc) {
        return dcGetField(dc, 2);
    }
    function dcGetBidiClass(dc) {
        return dcGetField(dc, 3);
    }
    function dcGetCasing(dc) {
        return dcGetField(dc, 4);
    }
    function dcGetType(dc) {
        return dcGetField(dc, 5);
    }
    function dcGetScript(dc) {
        return dcGetField(dc, 6);
    }
    function dcGetComplexTraits(dc) {
        return dcGetField(dc, 7);
    }
    function dcGetDescription(dc) {
        return dcGetField(dc, 8);
    }

    function dcIsNewline(dc) {
        if(dcGetBidiClass(dc) === 'B') {
            return true;
        }
        return false;
    }

    function dcIsPrintable(dc) {
        type=dcGetType(dc);
        generalType=type[0];
        switch(type) {
            case 'Zl':
            case 'Zp':
                return false;
                break;
            default:
                break;
        }
        switch(generalType) {
            case '!':
            case 'C':
                return false;
                break;
            default:
                break;
        }
        return true;
    }
}

// Tools for ASCII text
{
    // Checks whether n is within the range a and b, including endpoints
    function isBetween(n, a, b) {
        return (n - a) * (n - b) <= 0;
    }
    function isDigit(n) {
        return isBetween(n, 48, 57);
    }
    function isPrintable(n) {
        return isBetween(n, 32, 126);
    }
    function isSpace(n) {
        return n == 32;
    }
    function isNewline(n) {
        return (n == 10) || (n == 13);
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
}

function printableDcToChar(dc, characterEncoding) {
    switch (characterEncoding) {
        case 'ASCII-safe-subset':
        case 'UTF-8':
            return String.fromCharCode('0x'+dcDataLookupByValue("mappings/from/unicode", 1, dc, 0));
            break;
        default:
            eiteError('Unimplemented character encoding: '+characterEncoding);
            break;
    }
}

function docParse(format, content) {
    switch (format) {
        case 'sems':
            return parseSems(content);
            break;
        default:
            eiteError('Unimplemented document parsing format: '+format);
            break;
    }
}

function parseSems(arrayBuffer) {
    // Accepts an ArrayBuffer of bytes of a SEMS format document. Returns an array of Dcs.
    var dcSeq = [];
    var parserState = 'dc';
    var currentDc = '';
    if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteArray.byteLength; i++) {
            // do something with each byte in the array. byteArray[i] holds the decimal value of the given byte.
            switch (parserState) {
                case 'dc':
                    if (isDigit(byteArray[i])) {
                        currentDc = currentDc + String.fromCharCode(byteArray[i]);
                    }
                    if (isSpace(byteArray[i])) {
                        dcSeq.push(currentDc);
                        currentDc = '';
                    }
                    if (byteArray[i] == 35) { // pound sign: start comment
                        parserState = 'comment';
                    }
                    break;
                case 'comment':
                    if (isNewline(byteArray[i])) {
                        parserState = 'dc';
                    }
                    break;
            }
        }
    }
    return dcSeq;
}

function renderDocument(content, targetFormat, renderTraits) {
    output=[]
    // Build render output buffer for specified format
    switch (targetFormat) {
        case 'integerList':
            for (var i = 0; i < content.length; i++) {
                output[i] = content[i];
            }
            break;
        case 'immutableCharacterCells':
            let line=0;
            output[0] = '';
            for (var i = 0; i < content.length; i++) {
                if (dcIsNewline(content[i])) {
                    line = line + 1;
                    output[line] = '';
                }
                if (dcIsPrintable(content[i])) {
                    output[line] = output[line] + printableDcToChar(content[i], renderTraits.characterEncoding);
                }
            }
            break;
        default:
            eiteError('Unimplemented document render target format: '+targetFormat);
            break;
    }
    return output;
}

function createDocObj(format, content) {
    // content is an ArrayBuffer. Perhaps it could be other data types later if useful (they would be implemented as other formats in docParse).
    var doc = {};
        doc.dcState = docParse(format, content);
        doc.render = function(targetFormat, renderTraits) {
            doRenderIo(renderDocument(this.dcState, targetFormat, renderTraits), targetFormat);
        };
        doc.run = function () {
            targetFormat = getEnvironmentBestFormat();
            doRenderIo(renderDocument(this.dcState, targetFormat, getEnvironmentRenderTraits(targetFormat)), targetFormat);
        };
    return doc;
}
// @license-end
