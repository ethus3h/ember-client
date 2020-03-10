fbSwitcher() {
    intNum="$1"; shift; StageL_internalDebugCollect "int Num = $intNum; "; StageL_internalDebugStackEnter 'fbSwitcher:in'; StageL_assertIsInt "$intNum"

    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intNum" '15')")" ]]; then
        # just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL.

        strReturn='FizzBuzz'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi
    # Comment
    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intNum" '5')")" ]]; then
        # Comment 2

        strReturn='Buzz'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
        # Comment 3
    fi
    # Comment
    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intNum" '3')")" ]]; then
        # Comment 4

        strReturn='Fizz'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi
}
