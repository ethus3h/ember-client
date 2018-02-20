alert("blah");
var oReq = new XMLHttpRequest();
oReq.open("GET", "idiomatic-hello-world.sems", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteArray.byteLength; i++) {
      // do something with each byte in the array
      console.log(byteArray[i]);
    }
  }
};

oReq.send(null);

em_execute("idiomatic-hello-world.sems")
