function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// from https://stackoverflow.com/questions/20256760/javascript-console-log-to-html
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

var oReq = new XMLHttpRequest();
oReq.open("GET", "idiomatic-hello-world.sems", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    console.log(buf2hex(arrayBuffer));
    for (var i = 0; i < byteArray.byteLength; i++) {
      // do something with each byte in the array
      console.log(byteArray[i]);
    }
  }
};

oReq.send(null);

//em_execute("idiomatic-hello-world.sems")
