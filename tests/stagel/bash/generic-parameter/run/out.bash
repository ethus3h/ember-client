ne() {
    genericA="$1"; shift; genericB="$1"; shift; StageL_internalDebugCollect "generic A = ${genericA[@]}; ";StageL_internalDebugCollect "generic B = ${genericB[@]}; ";StageL_internalDebugStackEnter 'ne:in'; StageL_assertIsGeneric "$genericA"; aoeu StageL_assertIsGeneric "$genericB"; aoeu 

    boolTemp='false'
    boolTemp="$(StageL_Not "$(StageL_Eq "$genericA" "$genericB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit print "$boolReturn"

