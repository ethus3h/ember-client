window.onload = function() {


// This function check if number n is between a and b 
// from https://stackoverflow.com/questions/28087842/check-if-number-is-between-two-numbers
function isBetween(n, a, b) {
   return (n - a) * (n - b) <= 0
}
    // Attach console.log to log element
    (function() {
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

    function doRenderIo(targetFormat, renderBuffer) {
        switch (targetFormat) {
            case 'integerList':
                for (var i = 0; i < renderBuffer.length; i++) {
                    console.log(renderBuffer[i]);
                }
                break;
        }
    }

    function createDocExecutor(dcSeq) {
        var doc = {};
            doc.dcState = dcSeq;
            doc.renderInputBuf = null;
            doc.renderOutputBuf = null;
            doc.render = function (targetFormat) {
                this.renderInputBuf = this.dcState; // copy Dcs for renderer call
                // Build render output buffer for specified format
                switch (targetFormat) {
                    case 'integerList':
                        this.renderOutputBuf = [];
                        for (var i = 0; i < this.renderInputBuf.length; i++) {
                            this.renderOutputBuf[i] = this.renderInputBuf[i]; // TODO unimplemented
                        }
                        break;
                }
                // Do I/O as needed for the rendering
                doRenderIo(targetFormat, this.renderOutputBuf);
            };
            doc.run = function () {
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
