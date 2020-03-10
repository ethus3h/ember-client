strFromByte() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $(join_by ' ' "${intIn[@]}"); "; StageL_internalDebugStackEnter 'strFromByte:in'; StageL_assertIsInt "$intIn"

    strArrayChars=()
    strArrayChars=( '' '' '' '' '' '' '' )
    # 0 through 6
    strArrayTemp=()
    strArrayTemp=( 'd' 'b' 'l'
    'c' 'b' 'a' )
    StageL_append "$(join_by $'\037' "${strArrayChars[@]}")" "$(join_by $'\037' "${strArrayTemp[@]}")"
}
