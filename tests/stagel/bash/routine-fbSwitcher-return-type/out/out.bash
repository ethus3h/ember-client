fbSwitcher() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = ${intNum[@]}; "; StageL_internalDebugStackEnter 'fbSwitcher:in'; StageL_assertIsInt "$intNum"

    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intNum" '15')")" ]]; then

        strReturn='Buzz'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi
}
