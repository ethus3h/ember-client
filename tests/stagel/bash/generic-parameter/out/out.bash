ne() {
    genericA="$1"; shift; genericB="$1"; shift; internalDebugCollect "generic A = $genericA; "; internalDebugCollect "generic A = $genericB; "; internalDebugStackEnter 'ne:in'; assertIsGeneric "$genericA"; assertIsGeneric "$genericB"

    boolTemp="false"
    boolTemp="$(Not "$(Eq "$genericA" "$genericB")")"

    boolReturn="$boolTemp"; assertIsBool "$boolReturn"; internalDebugStackExit; print "$boolReturn"
}
