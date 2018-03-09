window.onload = function() {

    // Attach eiteLog to log element
    var logger = document.getElementById('log');
    function normalizeMessage(message) {
        
    }
    function eiteLog(message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
        logger.scrollTop = logger.scrollHeight;
    };
    function eiteError(message) {
        eiteLog('EITE reported error!: '+message);
        alert('EITE reported error!: '+message);
    }

    function getBestFormat() {
        return 'immutableCharacterCells';
    }

    function getEnvironmentRenderTraits(targetFormat) {
        var traits = {};
        switch (targetFormat) {
            case 'integerList':
            case 'immutableCharacterCells':
                traits.cellTableWidth = -1; // unlimited
                traits.cellTableHeight = -1; // unlimited
                break;
        }
        return traits;
    }

    function doRenderIo(targetFormat, renderBuffer) {
        switch (targetFormat) {
            case 'integerList':
                for (var i = 0; i < renderBuffer.length; i++) {
                    eiteLog(renderBuffer[i]);
                }
                break;
            case 'immutableCharacterCells':
                for (var i = 0; i < renderBuffer.length; i++) {
                    eiteLog(renderBuffer[i]);
                }
                break;
            default:
                eiteError('Unimplemented render I/O format: '+targetFormat);
                break;
        }
    }

    // START PORTABLE CODE

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

    function docParse(format, content) {
        switch (format) {
            case 'sems':
                return parseSems(content);
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

    function createDocObj(format, content) {
        // content is an ArrayBuffer. Perhaps it could be other data types later if useful (they would be implemented as other formats in docParse).
        var doc = {};
            doc.dcState = docParse(format, content);
            doc.renderInputBuf = null;
            doc.renderOutputBuf = null;
            doc.render = function(targetFormat, renderTraits) {
                if ( targetFormat === undefined ) {
                    targetFormat = getBestFormat();
                }
                if ( renderTraits === undefined ) {
                    renderTraits = getEnvironmentRenderTraits();
                }
                this.renderInputBuf = this.dcState; // copy Dcs for renderer call
                // Build render output buffer for specified format
                switch (targetFormat) {
                    case 'integerList':
                        this.renderOutputBuf = [];
                        for (var i = 0; i < this.renderInputBuf.length; i++) {
                            this.renderOutputBuf[i] = this.renderInputBuf[i];
                        }
                        break;
                    case 'immutableCharacterCells':
                        this.renderOutputBuf = [];
                        let line=0;
                        for (var i = 0; i < this.renderInputBuf.length; i++) {
                            if (isNewline(this.renderInputBuf[i])) {
                                line = 1;
                            }
                            if (isPrintable(this.renderInputBuf[i])) {
                                this.renderOutputBuf[line][i] = printableDcToChar(this.renderInputBuf[i], renderTraits.characterEncoding);
                            }
                        }
                        break;
                    default:
                        eiteError('Unimplemented document render target format: '+targetFormat);
                        break;
                }
                // Do I/O as needed for the rendering
                doRenderIo(targetFormat, this.renderOutputBuf);
            };
            doc.run = function (targetFormat) {
                this.render(targetFormat);
            };
        return doc;
    }

    // END PORTABLE CODE

    function urlLoadAndRun(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function(oEvent) {
            callback(oReq.response); // Note: not oReq.responseText
        };
        oReq.send(null);
    }

    function docFromUrl(format, url, callback) {
        urlLoadAndRun(url, function(responseArrayBuffer) { callback(createDocObj(format, responseArrayBuffer)); })
    }

    function runEiteTest(format, name) {
        urlPrefix='../tests/'+name+'.'+format+'/';
        inFormatUrl='../tests/'+name+'.'+format+'/in-format';
        switch (format) {
            case 'ept': // Parser test
                urlLoadAndRun(inFormatUrl, function(responseArrayBuffer) {})
                break;
            case 'comment':
                if (isNewline(byteArray[i])) {
                    parserState = 'dc';
                }
                break;
            default:
                eiteError('Unimplemented test format: '+format);
                break;
        }
    }

    runEiteTest('ept', 'idiomatic-hello-world-sems');
    docFromUrl('sems', 'idiomatic-hello-world.sems', function (doc) { doc.run(); } );

};
