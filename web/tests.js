window.onload = function() {

    // START PORTABLE CODE

    function normalizeMessage(message) {
        if (typeof message == 'object') {
            return (JSON && JSON.stringify ? JSON.stringify(message) : message);
        } else {
            return message;
        }
    }
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
        function dcIsNewline(dc) {
            return false; // TODO: Unimplemented
        }
        function dcIsPrintable(dc) {
            return true; // TODO: Unimplemented
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
                console.log(dc+' became '+String.fromCharCode(dc));
                return String.fromCharCode(dc); // TODO: Unimplemented
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

    function createDocObj(format, content) {
        // content is an ArrayBuffer. Perhaps it could be other data types later if useful (they would be implemented as other formats in docParse).
        var doc = {};
            doc.dcState = docParse(format, content);
            doc.renderInputBuf = null;
            doc.renderOutputBuf = null;
            doc.render = function(targetFormat, renderTraits) {
                if ( targetFormat === undefined ) {
                    targetFormat = getEnvironmentBestFormat();
                }
                if ( renderTraits === undefined ) {
                    renderTraits = getEnvironmentRenderTraits(targetFormat);
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
                        this.renderOutputBuf[0] = '';
                        for (var i = 0; i < this.renderInputBuf.length; i++) {
                            if (dcIsNewline(this.renderInputBuf[i])) {
                                line = line + 1;
                                this.renderOutputBuf[line] = '';
                            }
                            if (dcIsPrintable(this.renderInputBuf[i])) {
                                this.renderOutputBuf[line] = this.renderOutputBuf[line] + printableDcToChar(this.renderInputBuf[i], renderTraits.characterEncoding);
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

    // END PORTABLE CODE #######################################################

    // Implementation-specific overrides of routines available portably

    // Override error reporting method to show alert
    function eiteError(message) {
        console.trace();
        eiteLog('EITE reported error!: '+normalizeMessage(message));
        alert('EITE reported error!: '+normalizeMessage(message));
        throw 'EITE reported error!: '+normalizeMessage(message);
    }
    function eiteWarn(message) {
        console.trace();
        eiteLog('EITE reported warning: '+normalizeMessage(message));
        alert('EITE reported warning: '+normalizeMessage(message));
    }

    // Fully implementation-specific code

    function loadDependency() {
        
    }

    function globalEval(data) {
        if ( data && data.trim() ) {
            // We use execScript on Internet Explorer
            // We use an anonymous function so that context is window
            // rather than jQuery in Firefox
            ( window.execScript || function( data ) {
                window[ "eval" ].call( window, data );
            } )( data );
        }
    }
    function addScript(script)
    {
        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                eval(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET",script,true);
        xmlhttp.send();
    }
addScript("path/to/jquery.js");
addScript("yourscript.js");
# from https://stackoverflow.com/questions/16932595/how-to-import-javascript-dependencies-in-one-file
    function eiteImplLog(message) {
        // This function implements logging (which may differ between platforms).
        console.log(normalizeMessage(message));
    };

    function getEnvironmentBestFormat() {
        return 'immutableCharacterCells';
    }

    function getEnvironmentRenderTraits(targetFormat) {
        if ( targetFormat === undefined ) {
            eiteError('getEnvironmentRenderTraits was called without any targetFormat!');
        }
        var traits = {};
        switch (targetFormat) {
            case 'integerList':
            case 'immutableCharacterCells':
                traits.cellTableWidth = -1; // unlimited
                traits.cellTableHeight = -1; // unlimited
                let cs = document.characterSet.toLowerCase();
                switch(cs) {
                    case 'utf-8':
                        traits.characterEncoding = 'UTF-8';
                        break;
                    default:
                        eiteWarn('Unimplemented character set: '+cs+'. Falling back to ASCII-safe-subset.');
                        traits.characterEncoding = 'ASCII-safe-subset';
                        break;
                }
                break;
        }
        return traits;
    }

    function doRenderIo(targetFormat, renderBuffer) {
        switch (targetFormat) {
            case 'integerList':
            case 'immutableCharacterCells':
                let immutableCharCellOutput = document.getElementById('log');
                for (var i = 0; i < renderBuffer.length; i++) {
                    immutableCharCellOutput.innerHTML += normalizeMessage(renderBuffer[i]) + '<br />';
                    immutableCharCellOutput.scrollTop = immutableCharCellOutput.scrollHeight;
                }
                break;
            default:
                eiteError('Unimplemented render I/O format: '+targetFormat);
                break;
        }
    }

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
