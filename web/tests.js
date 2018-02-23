window.onload = function() {

    // Set-up & utility functions
    {
        // Return a hexdump of an ArrayBuffer
        // function buf2hex(buffer) { // buffer is an ArrayBuffer
        //     return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
        // }

        // Attach console.log to log element
        (function() {
            //var old = console.log;
            var logger = document.getElementById('log');
            console.log = function(message) {
                if (typeof message == 'object') {
                    logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
                } else {
                    logger.innerHTML += message + '<br />';
                }
                logger.scrollTop = logger.scrollHeight;
            };
        })();
    }

    function doRenderIo(targetFormat, renderBuffer) {
        switch (targetFormat) {
            case 'integerList':
                for (var i = 0; i < renderBuffer.length; i++) {
                    console.log(renderBuffer[i]);
                }
                break;
        }
    }

    // Main logic

    function createDocExecutor(dcSeq) {
        var doc = {};
            doc.dcState = dcSeq;
            doc.renderInputBuf = null;
            doc.renderOutputBuf = null;
            doc.render = function (targetFormat) {
                console.log(this.dcState);
                this.renderInputBuf = this.dcState; // copy Dcs for renderer call
                console.log(this.renderInputBuf);
                for (var i = 0; i < this.renderInputBuf.length; i++) {
                    // Build render output buffer for specified format
                    switch (targetFormat) {
                        case 'integerList':
                            this.renderOutputBuf = [];
                            this.renderOutputBuf[i] = this.renderInputBuf[i]; // TODO unimplemented
                            break;
                    }
                }
                // Do I/O as needed for the rendering
                doRenderIo(targetFormat, this.renderOutputBuf);
            };
            doc.run = function () {
                for (var i = 0; i < dcSeq.length; i++) {
                    console.log(dcSeq[i]);
                }
                this.render('integerList');
            };
        return doc;
    }

    function parseSems(arrayBuffer) {
        var dcSeq = [];

        if (arrayBuffer) {
            var byteArray = new Uint8Array(arrayBuffer);
            for (var i = 0; i < byteArray.byteLength; i++) {
                // do something with each byte in the array. byteArray[i] holds the decimal value of the given byte.
                dcSeq[i] = byteArray[i]; // TODO unimplmeneted
            }
        }

        return createDocExecutor(dcSeq);
    }

    function runSems(arrayBuffer) {
        parseSems(arrayBuffer).run();
    }

    function eiteFromUrl(url) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function(oEvent) {
            runSems(oReq.response); // Note: not oReq.responseText
        };
        oReq.send(null);
    }

eiteFromUrl('idiomatic-hello-world.sems');
};
