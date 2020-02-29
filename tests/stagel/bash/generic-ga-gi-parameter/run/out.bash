ne() {
    IFS=$'\037' read -r -a genericArrayA <<< "$1"; shift; IFS=$'\037' read -r -a genericItemB <<< "$1"; shift; StageL_internalDebugCollect "genericArray A = ${genericArrayA[@]}; "; StageL_internalDebugCollect "genericItem B = ${genericItemB[@]}; "; StageL_internalDebugStackEnter 'ne:in'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayA[@]}")"; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemB[@]}")"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_eq "$(join_by $'\037' "${genericArrayA[@]}")" "$(join_by $'\037' "${genericItemB[@]}")")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}
