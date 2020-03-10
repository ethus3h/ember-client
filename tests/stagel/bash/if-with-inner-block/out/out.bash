test() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = $intNum; "; StageL_internalDebugStackEnter 'test:in'; StageL_assertIsInt "$intNum"

    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intNum" '3')")" ]]; then
        boolOut='false'
        boolOut="$(StageL_eq '0' '0')"

        boolReturn="$boolOut"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
}
