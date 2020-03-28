let strArrayTemp = [];
strArrayTemp = [ 'd', 'b', 'l', 'c', 'b', 'a' ];
let intC = 0;
let intI = 0;
let strElem = '';
while (StageL_lt(intI, StageL_count(strArrayTemp))) {
    strElem = StageL_get(strArrayTemp, intI);
    intI = StageL_inc(intI);
    intC = StageL_inc(intC);
}
