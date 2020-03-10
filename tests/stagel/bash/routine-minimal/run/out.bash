fbSwitcher() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = ${intNum[@]}; "; StageL_internalDebugStackEnter 'fbSwitcher:in'; StageL_assertIsInt "$intNum"

    # Test comment; semicolon

    strReturn=''; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}
