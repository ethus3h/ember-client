ne() {
    genericA="$1"; shift; genericB="$1"; shift; StageL_internalDebugCollect "generic A = $(join_by ' ' "${genericA[@]}"); "; StageL_internalDebugCollect "generic B = $(join_by ' ' "${genericB[@]}"); "; StageL_internalDebugStackEnter 'ne:in'; StageL_assertIsGeneric "$genericA"; StageL_assertIsGeneric "$genericB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_eq "$genericA" "$genericB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}
