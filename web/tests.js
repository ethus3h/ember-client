window.onload = function () {

// Set-up & utility functions
{
    // Return a hexdump of an ArrayBuffer
    function buf2hex(buffer) { // buffer is an ArrayBuffer
      return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    // Attach console.log to log element
    (function () {
        var old = console.log;
        var logger = document.getElementById('log');
        console.log = function (message) {
            if (typeof message == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
            } else {
                logger.innerHTML += message + '<br />';
            }
        }
    })();
}

var oReq = new XMLHttpRequest();
oReq.open("GET", "idiomatic-hello-world.sems", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteArray.byteLength; i++) {
      // do something with each byte in the array. byteArray[i] holds the decimal value of the given byte.
      console.log(byteArray[i]);
    }
  }
};

oReq.send(null);

//em_execute("idiomatic-hello-world.sems")
}
