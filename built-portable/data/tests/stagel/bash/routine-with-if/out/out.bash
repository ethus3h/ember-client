fbSwitcher() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = $intNum; "; StageL_internalDebugStackEnter 'fbSwitcher:in'; StageL_assertIsInt "$intNum"

    if [[ "true" == "$(StageL_eq '0' '0')" ]]; then

        strReturn='a'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi
}
#
