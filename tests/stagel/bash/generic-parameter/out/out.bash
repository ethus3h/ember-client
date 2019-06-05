ne() {
    IFS=$'\037' read -r -a genericA <<< "$1"; IFS=$'\037' read -r -a genericB <<< "$1"; internalDebugCollect "generic A = ${genericA[@]}; "; internalDebugCollect "generic A = ${genericB[@]}; "; internalDebugStackEnter('ne:in'); assertIsGeneric(genericA); assertIsGeneric(genericB)

    boolTemp="false"
    boolTemp = implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; assertIsBool(boolReturn); internalDebugStackExit(); return boolReturn;
}
