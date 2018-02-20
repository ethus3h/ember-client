import eite.js

var oReq = new XMLHttpRequest();
oReq.open("GET", "idiomatic-hello-world.sems", true);
oReq.responseType = "blob";

oReq.onload = function(oEvent) {
  var blob = oReq.response;
  
};

oReq.send();

em_execute("idiomatic-hello-world.sems")
