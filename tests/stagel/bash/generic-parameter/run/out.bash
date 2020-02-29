ne() {
    genericA="$1"; shift; genericB="$1"; shift; internalDebugCollect "generic A = ${genericA[@]}; "; internalDebugCollect "generic B = ${genericB[@]}; "; internalDebugStackEnter 'ne:in'; assertIsGeneric "$genericA" assertIsGeneric "$genericB" 

    let "$boolTemp" = false
    boolTemp="$(StageL_Not "$(StageL_Eq "$genericA" "$genericB")")"

    boolReturn="$boolTemp"; assertIsBool "$boolReturn"; StageL_internalDebugStackExit print "$boolReturn"

