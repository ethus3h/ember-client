async function strFromByte(intIn) {
    StageL_internalDebugCollect('int In = ' + intIn + '; '); StageL_internalDebugStackEnter('strFromByte:in'); StageL_assertIsInt(intIn); let strReturn;

    let strArrayChars = [];
    strArrayChars = [ '', '', '', '', '', '', '' ];
    /* 0 through 6 */
    let strArrayTemp = [];
    strArrayTemp = [ 'd', 'b', 'l',
    'c', 'b', 'a' ];
    StageL_append(strArrayChars, strArrayTemp);
}
