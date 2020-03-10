fbSwitcher() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = $intNum; "; StageL_internalDebugStackEnter 'fbSwitcher:in'; StageL_assertIsInt "$intNum"


    strReturn='Fizz'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

fbSwitchar() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = $intNum; "; StageL_internalDebugStackEnter 'fbSwitchar:in'; StageL_assertIsInt "$intNum"


    strReturn='Fazz'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}
