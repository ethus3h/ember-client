strFromByte() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = ${intIn[@]}; "; StageL_internalDebugStackEnter 'strFromByte:in'; StageL_assertIsInt "$intIn"

    strArrayChars=()
    strArrayChars="$(join_by $'\037' '' '' '' '' '' '' '' )
    # 0 through 6
    strArrayTemp=()
    strArrayTemp="$(join_by $'\037' 'd' 'b' 'l'
    'c' 'b' 'a' )
    StageL_append "$(join_by $'\037' "${strArrayChars[@]}")" "$(join_by $'\037' "${strArrayTemp[@]}")"
}
