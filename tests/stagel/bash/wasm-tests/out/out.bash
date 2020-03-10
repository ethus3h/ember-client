runTestsWasm() {
    boolV="$1"; shift; boolA="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugCollect "bool A = $boolA; "; StageL_internalDebugStackEnter 'runTestsWasm:in'; StageL_assertIsBool "$boolV"; StageL_assertIsBool "$boolA"

    StageL_runTest "$boolV" "$(StageL_eq '42' "$(StageL_wasmCall 'fortytwo' "$(join_by $'\037' 'true' 'false')")")"
    StageL_runTest "$boolV" "$(StageL_eq '4' "$(StageL_wasmCallArrIn 'add' "$(join_by $'\037' '2' '2')")")"

    StageL_internalDebugStackExit;
}
