 
#!/usr/bin/env bash

set() {
    true
}


# @license-end

 
runTestsTypeConversion() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsTypeConversion:type-conversion-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'typeConversion'
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' 'a' 'b' 'c')" "$(StageL_strSplit 'a,b,c' ',')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' 'a' 'b' 'c')" "$(StageL_strSplit 'aabbabc' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' 'a' 'b' 'c' '')" "$(StageL_strSplit 'aabbabcab' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' 'c')" "$(StageL_strSplit 'abc' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' '' 'baa')" "$(StageL_strSplit 'ababbaa' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' 'a' '')" "$(StageL_strSplit 'aab' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' 'a' '')" "$(StageL_strSplit 'abaab' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' 'a' '' '')" "$(StageL_strSplit 'abaabab' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' '' '')" "$(StageL_strSplit 'abab' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' '')" "$(StageL_strSplit 'ab' 'ab')")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '' '' '')" "$(StageL_strSplit "$(StageL_strJoin "$(StageL_strSplit 'abab' 'ab')" 'ab')" 'ab')")"

    StageL_internalDebugStackExit;
}

kvHasValue() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'kvHasValue:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"; StageL_assertIsStr "$strKey"

    StageL_assertIsKvArray "$(join_by $'\037' "${strArrayData[@]}")"
    boolRes='false'
    boolRes='false'
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayData[@]}")")"
    if [[ "true" == "$(StageL_ne '0' "$intL")" ]]; then
        intC='0'
        intC='0'
        boolContinue='false'
        boolContinue='true'
        while [[ "true" == "$boolContinue" ]]; do
            if [[ "true" == "$(StageL_not "$(StageL_lt "$intC" "$intL")")" ]]; then
                boolContinue='false'
            fi
            if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intC" '2')")" ]]; then
                if [[ "true" == "$(StageL_eq "$strKey" "$(StageL_get "$(join_by $'\037' "${strArrayData[@]}")" "$intC")")" ]]; then
                    boolRes='true'
                    boolContinue='false'
                fi
            fi
            intC="$(StageL_add "$intC" '1')"
        done
    fi

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

kvGetValue() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'kvGetValue:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"; StageL_assertIsStr "$strKey"

    # data format: [ 'a' 'b' 'c' 'd' ... ]
    # Returns empty if value not set
    StageL_assertIsKvArray "$(join_by $'\037' "${strArrayData[@]}")"
    strRes=''
    strRes=''
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayData[@]}")")"
    if [[ "true" == "$(StageL_ne '0' "$intL")" ]]; then
        intC='0'
        intC='0'
        boolContinue='false'
        boolContinue='true'
        boolFound='false'
        boolFound='false'
        while [[ "true" == "$boolContinue" ]]; do
            if [[ "true" == "$boolFound" ]]; then
                strRes="$(StageL_get "$(join_by $'\037' "${strArrayData[@]}")" "$intC")"
                boolContinue='false'
                        else
                if [[ "true" == "$(StageL_not "$(StageL_lt "$intC" "$(StageL_add '-1' "$intL")")")" ]]; then
                    boolContinue='false'
                fi
                if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intC" '2')")" ]]; then
                    if [[ "true" == "$(StageL_eq "$strKey" "$(StageL_get "$(join_by $'\037' "${strArrayData[@]}")" "$intC")")" ]]; then
                        boolFound='true'
                    fi
                fi
            fi
            intC="$(StageL_add "$intC" '1')"
        done
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

kvGetDefinedValue() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'kvGetDefinedValue:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"; StageL_assertIsStr "$strKey"

    StageL_assertKvHasValue "$(join_by $'\037' "${strArrayData[@]}")"
    strRes=''
    strRes="$(StageL_kvGetValue "$(join_by $'\037' "${strArrayData[@]}")" "$strKey")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

kvSetValue() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; strKey="$1"; shift; strVal="$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Val = $strVal; "; StageL_internalDebugStackEnter 'kvSetValue:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strVal"

    StageL_assertIsKvArray "$(join_by $'\037' "${strArrayData[@]}")"
    strArrayRes=()
    strArrayRes="$(join_by $'\037' "${strArrayData[@]}")"
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayRes[@]}")")"
    boolFound='false'
    boolFound='false'
    if [[ "true" == "$(StageL_ne '0' "$intL")" ]]; then
        intC='0'
        intC='0'
        boolContinue='false'
        boolContinue='true'
        while [[ "true" == "$boolContinue" ]]; do
            if [[ "true" == "$boolFound" ]]; then
                strArrayRes="$(StageL_setElem "$(join_by $'\037' "${strArrayRes[@]}")" "$intC" "$strVal")"
                boolContinue='false'
                        else
                if [[ "true" == "$(StageL_not "$(StageL_lt "$intC" "$(StageL_dec "$intL")")")" ]]; then
                    boolContinue='false'
                fi
                if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intC" '2')")" ]]; then
                    if [[ "true" == "$(StageL_eq "$strKey" "$(StageL_get "$(join_by $'\037' "${strArrayData[@]}")" "$intC")")" ]]; then
                        boolFound='true'
                    fi
                fi
            fi
            intC="$(StageL_add "$intC" '1')"
        done
    fi
    if [[ "true" == "$(StageL_not "$boolFound")" ]]; then
        strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strKey")"
        strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strVal")"
    fi

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

kvsHasValue() {
    strData="$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "str Data = $strData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'kvsHasValue:key-value'; StageL_assertIsStr "$strData"; StageL_assertIsStr "$strKey"

    boolRes='false'
    boolRes="$(StageL_kvHasValue "$(StageL_kvSplit "$strData")" "$strKey")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

kvsGetValue() {
    strData="$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "str Data = $strData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'kvsGetValue:key-value'; StageL_assertIsStr "$strData"; StageL_assertIsStr "$strKey"

    # data format: [ 'a:b,c:d,' ... ]
    # Returns empty if value not set
    strRes=''
    strRes="$(StageL_kvGetValue "$(StageL_kvSplit "$strData")" "$strKey")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

kvsGetDefinedValue() {
    strData="$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "str Data = $strData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'kvsGetDefinedValue:key-value'; StageL_assertIsStr "$strData"; StageL_assertIsStr "$strKey"

    StageL_assertKvsHasValue "$strData"
    strRes=''
    strRes="$(StageL_kvsGetValue "$strData" "$strKey")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

kvsSetValue() {
    strData="$1"; shift; strKey="$1"; shift; strVal="$1"; shift; StageL_internalDebugCollect "str Data = $strData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Val = $strVal; "; StageL_internalDebugStackEnter 'kvsSetValue:key-value'; StageL_assertIsStr "$strData"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strVal"

    strRes=''
    strRes="$(StageL_kvJoin "$(StageL_kvSetValue "$(StageL_kvSplit "$strData")" "$strKey" "$strVal")")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

assertKvHasValue() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'assertKvHasValue:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"; StageL_assertIsStr "$strKey"

    StageL_assertIsTrue "$(StageL_kvHasValue "$(join_by $'\037' "${strArrayData[@]}")" "$strKey")"

    StageL_internalDebugStackExit;
}

assertKvsHasValue() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'assertKvsHasValue:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"; StageL_assertIsStr "$strKey"

    StageL_assertIsTrue "$(StageL_kvsHasValue "$(join_by $'\037' "${strArrayData[@]}")" "$strKey")"

    StageL_internalDebugStackExit;
}

kvSplit() {
    strData="$1"; shift; StageL_internalDebugCollect "str Data = $strData; "; StageL_internalDebugStackEnter 'kvSplit:key-value'; StageL_assertIsStr "$strData"

    strArrayRes=()
    strArrayRes=(  )
    strArrayTemp=()
    strArrayTemp="$(StageL_strSplitEscaped "$strData" ',')"
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayTemp[@]}")")"
    if [[ "true" == "$(StageL_ne '0' "$intL")" ]]; then
        intC='0'
        intC='0'
        while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
            strArrayRes="$(StageL_append "$(join_by $'\037' "${strArrayRes[@]}")" "$(StageL_strSplitEscaped "$(StageL_get "$(join_by $'\037' "${strArrayTemp[@]}")" "$intC")" ':')")"
            intC="$(StageL_inc "$intC")"
        done
    fi

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

kvJoin() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugStackEnter 'kvJoin:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"

    strRes=''
    strRes=''
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayData[@]}")")"
    if [[ "true" == "$(StageL_ne '0' "$intL")" ]]; then
        intC='0'
        intC='0'
        strArrayTempA=()
        strArrayTempB=()
        strArrayTempB=(  )
        while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
            if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intC" '2')")" ]]; then
                strArrayTempA=(  )
                strArrayTempA="$(StageL_push "$(join_by $'\037' "${strArrayTempA[@]}")" "$(StageL_get "$(join_by $'\037' "${strArrayData[@]}")" "$intC")")"
                strArrayTempA="$(StageL_push "$(join_by $'\037' "${strArrayTempA[@]}")" "$(StageL_get "$(join_by $'\037' "${strArrayData[@]}")" "$(StageL_add '1' "$intC")")")"
                strArrayTempB="$(StageL_push "$(join_by $'\037' "${strArrayTempB[@]}")" "$(StageL_strJoinEscNoTrailing "$(join_by $'\037' "${strArrayTempA[@]}")" ':')")"
            fi
            intC="$(StageL_inc "$intC")"
        done
        strRes="$(StageL_strJoinEsc "$(join_by $'\037' "${strArrayTempB[@]}")" ',')"
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

isKvArray() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugStackEnter 'isKvArray:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"

    boolRes='false'
    boolRes="$(StageL_isEven "$(StageL_count "$(join_by $'\037' "${strArrayData[@]}")")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

assertIsKvArray() {
    IFS=$'\037' read -r -a strArrayData <<< "$1"; shift; StageL_internalDebugCollect "strArray Data = $strArrayData; "; StageL_internalDebugStackEnter 'assertIsKvArray:key-value'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayData[@]}")"

    StageL_assertIsTrue "$(StageL_isKvArray "$(join_by $'\037' "${strArrayData[@]}")")"

    StageL_internalDebugStackExit;
}

abSubset() {
    IFS=$'\037' read -r -a boolArrayIn <<< "$1"; shift; intStart="$1"; shift; intEnd="$1"; shift; StageL_internalDebugCollect "boolArray In = $boolArrayIn; "; StageL_internalDebugCollect "int Start = $intStart; "; StageL_internalDebugCollect "int End = $intEnd; "; StageL_internalDebugStackEnter 'abSubset:arrays'; StageL_assertIsBoolArray "$(join_by $'\037' "${boolArrayIn[@]}")"; StageL_assertIsInt "$intStart"; StageL_assertIsInt "$intEnd"

    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${boolArrayIn[@]}")")"
    if [[ "true" == "$(StageL_lt "$intStart" '0')" ]]; then
        intStart="$(StageL_add "$intCount" "$intStart")"
    fi
    if [[ "true" == "$(StageL_lt "$intEnd" '0')" ]]; then
        intEnd="$(StageL_add "$intCount" "$intEnd")"
    fi
    intI='0'
    intI="$intStart"
    intCount="$intEnd"
    boolArrayRes=()
    while [[ "true" == "$(StageL_le "$intI" "$intCount")" ]]; do
        boolArrayRes="$(StageL_push "$(join_by $'\037' "${boolArrayRes[@]}")" "$(StageL_get "$(join_by $'\037' "${boolArrayIn[@]}")" "$intI")")"
        intI="$(StageL_add "$intI" '1')"
    done

    boolArrayReturn="$(join_by $'\037' "${boolArrayRes[@]}")"; StageL_assertIsBoolArray "$(join_by $'\037' "${boolArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${boolArrayReturn[@]}")"
}

anSubset() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; intStart="$1"; shift; intEnd="$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugCollect "int Start = $intStart; "; StageL_internalDebugCollect "int End = $intEnd; "; StageL_internalDebugStackEnter 'anSubset:arrays'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"; StageL_assertIsInt "$intStart"; StageL_assertIsInt "$intEnd"

    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    if [[ "true" == "$(StageL_lt "$intStart" '0')" ]]; then
        intStart="$(StageL_add "$intCount" "$intStart")"
    fi
    if [[ "true" == "$(StageL_lt "$intEnd" '0')" ]]; then
        intEnd="$(StageL_add "$intCount" "$intEnd")"
    fi
    intI='0'
    intI="$intStart"
    intCount="$intEnd"
    intArrayRes=()
    while [[ "true" == "$(StageL_le "$intI" "$intCount")" ]]; do
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intI")")"
        intI="$(StageL_add "$intI" '1')"
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

asSubset() {
    IFS=$'\037' read -r -a strArrayIn <<< "$1"; shift; intStart="$1"; shift; intEnd="$1"; shift; StageL_internalDebugCollect "strArray In = $strArrayIn; "; StageL_internalDebugCollect "int Start = $intStart; "; StageL_internalDebugCollect "int End = $intEnd; "; StageL_internalDebugStackEnter 'asSubset:arrays'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayIn[@]}")"; StageL_assertIsInt "$intStart"; StageL_assertIsInt "$intEnd"

    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${strArrayIn[@]}")")"
    if [[ "true" == "$(StageL_lt "$intStart" '0')" ]]; then
        intStart="$(StageL_add "$intCount" "$intStart")"
    fi
    if [[ "true" == "$(StageL_lt "$intEnd" '0')" ]]; then
        intEnd="$(StageL_add "$intCount" "$intEnd")"
    fi
    intI='0'
    intI="$intStart"
    intCount="$intEnd"
    strArrayRes=()
    while [[ "true" == "$(StageL_le "$intI" "$intCount")" ]]; do
        strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$(StageL_get "$(join_by $'\037' "${strArrayIn[@]}")" "$intI")")"
        intI="$(StageL_add "$intI" '1')"
    done

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

abFromB() {
    boolIn="$1"; shift; StageL_internalDebugCollect "bool In = $boolIn; "; StageL_internalDebugStackEnter 'abFromB:arrays'; StageL_assertIsBool "$boolIn"

    boolArrayRes=()
    boolArrayRes="$(StageL_push "$(join_by $'\037' "${boolArrayRes[@]}")" "$boolIn")"

    boolArrayReturn="$(join_by $'\037' "${boolArrayRes[@]}")"; StageL_assertIsBoolArray "$(join_by $'\037' "${boolArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${boolArrayReturn[@]}")"
}

anFromN() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'anFromN:arrays'; StageL_assertIsInt "$intIn"

    intArrayRes=()
    intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$intIn")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

asFromS() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'asFromS:arrays'; StageL_assertIsStr "$strIn"

    strArrayRes=()
    strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strIn")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

contains() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; genericValue="$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugCollect "generic Value = $genericValue; "; StageL_internalDebugStackEnter 'contains:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"; StageL_assertIsGeneric "$genericValue"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_eq "$genericElem" "$genericValue")" ]]; then

            boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

implIn() {
    genericValue="$1"; shift; IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "generic Value = $genericValue; "; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'implIn:arrays'; StageL_assertIsGeneric "$genericValue"; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    # Convenience wrapper
    boolRes='false'
    boolRes="$(StageL_contains "$(join_by $'\037' "${genericArrayIn[@]}")" "$genericValue")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

indexOf() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; genericValue="$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugCollect "generic Value = $genericValue; "; StageL_internalDebugStackEnter 'indexOf:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"; StageL_assertIsGeneric "$genericValue"

    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")"
    intCounter='0'
    intCounter='0'
    genericElem
    while [[ "true" == "$(StageL_lt "$intCounter" "$intCount")" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCounter")"
        if [[ "true" == "$(StageL_eq "$genericElem" "$genericValue")" ]]; then

            intReturn="$intCounter"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
        fi
        intCounter="$(StageL_add "$intCounter" '1')"
    done

    intReturn='-1'; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

arrEmpty() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'arrEmpty:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    boolRes='false'
    boolRes="$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

arrNonempty() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'arrNonempty:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    boolRes='false'
    boolRes="$(StageL_not "$(StageL_arrEmpty "$(join_by $'\037' "${genericArrayIn[@]}")")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'isArray:arrays'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    # Just a convenience wrapper
    boolRes='false'
    boolRes="$(StageL_isGenericArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

arrEq() {
    IFS=$'\037' read -r -a genericArrayA <<< "$1"; shift; IFS=$'\037' read -r -a genericArrayB <<< "$1"; shift; StageL_internalDebugCollect "genericArray A = $genericArrayA; "; StageL_internalDebugCollect "genericArray B = $genericArrayB; "; StageL_internalDebugStackEnter 'arrEq:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayA[@]}")"; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayB[@]}")"

    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${genericArrayA[@]}")")"
    if [[ "true" == "$(StageL_ne "$intCount" "$(StageL_count "$(join_by $'\037' "${genericArrayB[@]}")")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    genericElem
    intI='0'
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayA[@]}")" "$intI")"
        if [[ "true" == "$(StageL_ne "$genericElem" "$(StageL_get "$(join_by $'\037' "${genericArrayB[@]}")" "$intI")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intI="$(StageL_add "$intI" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isIntArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isIntArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isInt "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isStrArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isStrArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isStr "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isBoolArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isBoolArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isBool "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isCharArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isCharArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isChar "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isByteArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isByteArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isByte "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isIntBitArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isIntBitArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isIntBit "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isDcArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'isDcArray:arrays'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")" '1')"
    genericElem
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        genericElem="$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intCount")"
        if [[ "true" == "$(StageL_not "$(StageL_isDc "$genericElem")")" ]]; then

            boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
        fi
        intCount="$(StageL_sub "$intCount" '1')"
    done

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

sumArray() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'sumArray:arrays'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intCount='0'
    intCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")" '1')"
    intRes='0'
    while [[ "true" == "$(StageL_ge "$intCount" '0')" ]]; do
        intRes="$(StageL_add "$intRes" "$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intCount")")"
        intCount="$(StageL_sub "$intCount" '1')"
    done

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

runTestsWasm() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsWasm:wasm-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'wasm'
    StageL_runTest "$boolV" "$(StageL_eq '42' "$(StageL_wasmCall 'fortytwo' '0')")"
    #runTest b/v eq 4 wasmCallArrIn 'add' ( 2 2 )

    StageL_internalDebugStackExit;
}

warnOrDie() {
    boolStrict="$1"; shift; strMsg="$1"; shift; StageL_internalDebugCollect "bool Strict = $boolStrict; "; StageL_internalDebugCollect "str Msg = $strMsg; "; StageL_internalDebugStackEnter 'warnOrDie:assertions'; StageL_assertIsBool "$boolStrict"; StageL_assertIsStr "$strMsg"

    if [[ "true" == "$boolStrict" ]]; then
        StageL_die "$strMsg"
    fi
    StageL_warn "$strMsg"

    StageL_internalDebugStackExit;
}

assertIsTrue() {
    boolIn="$1"; shift; StageL_internalDebugCollect "bool In = $boolIn; "; StageL_internalDebugStackEnter 'assertIsTrue:assertions'; StageL_assertIsBool "$boolIn"

    if [[ "true" == "$(StageL_isFalse "$boolIn")" ]]; then
        StageL_assertionFailed "$(StageL_cat "$(StageL_bool ' is not true.')")"
    fi

    StageL_internalDebugStackExit;
}

assertIsFalse() {
    boolIn="$1"; shift; StageL_internalDebugCollect "bool In = $boolIn; "; StageL_internalDebugStackEnter 'assertIsFalse:assertions'; StageL_assertIsBool "$boolIn"

    if [[ "true" == "$(StageL_isTrue "$boolIn")" ]]; then
        StageL_assertionFailed "$(StageL_cat "$(StageL_bool ' is true, but should be false.')")"
    fi

    StageL_internalDebugStackExit;
}

assertContains() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; genericValue="$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugCollect "generic Value = $genericValue; "; StageL_internalDebugStackEnter 'assertContains:assertions'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"; StageL_assertIsGeneric "$genericValue"

    StageL_assertIsTrue "$(StageL_contains "$(join_by $'\037' "${genericArrayIn[@]}")" "$genericValue")"

    StageL_internalDebugStackExit;
}

assertIsByte() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'assertIsByte:assertions'; StageL_assertIsInt "$intIn"

    StageL_assertIsTrue "$(StageL_isByte "$intIn")"

    StageL_internalDebugStackExit;
}

assertIsChar() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'assertIsChar:assertions'; StageL_assertIsGeneric "$genericIn"

    StageL_assertIsTrue "$(StageL_isChar "$genericIn")"

    StageL_internalDebugStackExit;
}

assertIsCharByte() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'assertIsCharByte:assertions'; StageL_assertIsInt "$intIn"

    StageL_assertIsTrue "$(StageL_isCharByte "$intIn")"

    StageL_internalDebugStackExit;
}

assertIsDc() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'assertIsDc:assertions'; StageL_assertIsGeneric "$genericIn"

    StageL_assertIsTrue "$(StageL_isDc "$genericIn")"

    StageL_internalDebugStackExit;
}

assertStrContainsOnlyInt() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'assertStrContainsOnlyInt:assertions'; StageL_assertIsStr "$strIn"

    if [[ "true" == "$(StageL_not "$(StageL_strContainsOnlyInt "$strIn")")" ]]; then
        StageL_assertionFailed "$(StageL_cat "$strIn" ' does not only contain an integer.')"
    fi

    StageL_internalDebugStackExit;
}

assertIsNonnegative() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'assertIsNonnegative:assertions'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_not "$(StageL_isNonnegative "$intIn")")" ]]; then
        strTemp=''
        strTemp="$(StageL_strFrom "$intIn")"
        StageL_assertionFailed "$(StageL_cat "$strTemp" ' is negative.')"
    fi

    StageL_internalDebugStackExit;
}

assertIsSupportedBase() {
    intB="$1"; shift; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'assertIsSupportedBase:assertions'; StageL_assertIsInt "$intB"

    StageL_assertIsTrue "$(StageL_isSupportedBase "$intB")"

    StageL_internalDebugStackExit;
}

assertIsBaseDigit() {
    strIn="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'assertIsBaseDigit:assertions'; StageL_assertIsStr "$strIn"; StageL_assertIsInt "$intB"

    StageL_assertIsTrue "$(StageL_isBaseDigit "$strIn" "$intB")"

    StageL_internalDebugStackExit;
}

assertIsBaseStr() {
    strIn="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'assertIsBaseStr:assertions'; StageL_assertIsStr "$strIn"; StageL_assertIsInt "$intB"

    StageL_assertIsTrue "$(StageL_isBaseStr "$strIn" "$intB")"

    StageL_internalDebugStackExit;
}

assertIsArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsIntArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsIntArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isIntArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsBoolArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsBoolArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isBoolArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsStrArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsStrArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isStrArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsCharArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsCharArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isCharArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsIntBitArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsIntBitArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isIntBitArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsByteArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsByteArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isByteArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsDcArray() {
    IFS=$'\037' read -r -a genericItemIn <<< "$1"; shift; StageL_internalDebugCollect "genericItem In = $genericItemIn; "; StageL_internalDebugStackEnter 'assertIsDcArray:assertions'; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemIn[@]}")"

    StageL_assertIsTrue "$(StageL_isDcArray "$(join_by $'\037' "${genericItemIn[@]}")")"

    StageL_internalDebugStackExit;
}

assertIsDcDataset() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'assertIsDcDataset:assertions'; StageL_assertIsStr "$strIn"

    StageL_assertIsTrue "$(StageL_isDcDataset "$strIn")"

    StageL_internalDebugStackExit;
}

assertIsFormat() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'assertIsFormat:assertions'; StageL_assertIsStr "$strIn"

    StageL_assertIsTrue "$(StageL_isFormat "$strIn")"

    StageL_internalDebugStackExit;
}

assertIsSupportedInputFormat() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'assertIsSupportedInputFormat:assertions'; StageL_assertIsStr "$strIn"

    if [[ "true" == "$(StageL_not "$(StageL_isSupportedInputFormat "$strIn")")" ]]; then
        StageL_die "$(StageL_cat "$strIn" ' is not a supported input format.')"
    fi
    StageL_assertIsTrue "$(StageL_isSupportedInputFormat "$strIn")"

    StageL_internalDebugStackExit;
}

assertIsSupportedOutputFormat() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'assertIsSupportedOutputFormat:assertions'; StageL_assertIsStr "$strIn"

    if [[ "true" == "$(StageL_not "$(StageL_isSupportedOutputFormat "$strIn")")" ]]; then
        StageL_die "$(StageL_cat "$strIn" ' is not a supported output format.')"
    fi
    StageL_assertIsTrue "$(StageL_isSupportedOutputFormat "$strIn")"

    StageL_internalDebugStackExit;
}

assertIsSupportedEnvironmentCharEncoding() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'assertIsSupportedEnvironmentCharEncoding:assertions'; StageL_assertIsStr "$strIn"

    if [[ "true" == "$(StageL_not "$(StageL_isSupportedEnvironmentCharEncoding "$strIn")")" ]]; then
        StageL_die "$(StageL_cat "$strIn" ' is not a supported environment character encoding.')"
    fi
    StageL_assertIsTrue "$(StageL_isSupportedEnvironmentCharEncoding "$strIn")"

    StageL_internalDebugStackExit;
}

assertIsExecId() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'assertIsExecId:assertions'; StageL_assertIsInt "$intIn"

    StageL_assertIsTrue "$(StageL_isExecId "$intIn")"

    StageL_internalDebugStackExit;
}

or() {
    boolA="$1"; shift; boolB="$1"; shift; StageL_internalDebugCollect "bool A = $boolA; "; StageL_internalDebugCollect "bool B = $boolB; "; StageL_internalDebugStackEnter 'or:booleans'; StageL_assertIsBool "$boolA"; StageL_assertIsBool "$boolB"

    boolTemp='false'
    boolTemp="$(StageL_not "$boolA")"
    boolTemp="$(StageL_not "$(StageL_and "$boolTemp" "$(StageL_not "$boolB")")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

nor() {
    boolA="$1"; shift; boolB="$1"; shift; StageL_internalDebugCollect "bool A = $boolA; "; StageL_internalDebugCollect "bool B = $boolB; "; StageL_internalDebugStackEnter 'nor:booleans'; StageL_assertIsBool "$boolA"; StageL_assertIsBool "$boolB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_or "$boolA" "$boolB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

nand() {
    boolA="$1"; shift; boolB="$1"; shift; StageL_internalDebugCollect "bool A = $boolA; "; StageL_internalDebugCollect "bool B = $boolB; "; StageL_internalDebugStackEnter 'nand:booleans'; StageL_assertIsBool "$boolA"; StageL_assertIsBool "$boolB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_and "$boolA" "$boolB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

xor() {
    boolA="$1"; shift; boolB="$1"; shift; StageL_internalDebugCollect "bool A = $boolA; "; StageL_internalDebugCollect "bool B = $boolB; "; StageL_internalDebugStackEnter 'xor:booleans'; StageL_assertIsBool "$boolA"; StageL_assertIsBool "$boolB"

    boolTemp='false'
    boolTemp="$(StageL_nand "$boolA" "$boolB")"
    boolTemp="$(StageL_and "$boolTemp" "$(StageL_or "$boolA" "$boolB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

xnor() {
    boolA="$1"; shift; boolB="$1"; shift; StageL_internalDebugCollect "bool A = $boolA; "; StageL_internalDebugCollect "bool B = $boolB; "; StageL_internalDebugStackEnter 'xnor:booleans'; StageL_assertIsBool "$boolA"; StageL_assertIsBool "$boolB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_xor "$boolA" "$boolB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isTrue() {
    boolIn="$1"; shift; StageL_internalDebugCollect "bool In = $boolIn; "; StageL_internalDebugStackEnter 'isTrue:booleans'; StageL_assertIsBool "$boolIn"


    boolReturn="$boolIn"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isFalse() {
    boolIn="$1"; shift; StageL_internalDebugCollect "bool In = $boolIn; "; StageL_internalDebugStackEnter 'isFalse:booleans'; StageL_assertIsBool "$boolIn"

    boolRes='false'
    boolRes="$(StageL_not "$boolIn")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

# Calling a comparison with different types is an error. All types must be same type.

ne() {
    genericA="$1"; shift; genericB="$1"; shift; StageL_internalDebugCollect "generic A = $genericA; "; StageL_internalDebugCollect "generic B = $genericB; "; StageL_internalDebugStackEnter 'ne:comparison'; StageL_assertIsGeneric "$genericA"; StageL_assertIsGeneric "$genericB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_eq "$genericA" "$genericB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

ge() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'ge:comparison'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    boolTemp='false'
    boolTemp="$(StageL_eq "$intA" "$intB")"
    boolTemp="$(StageL_or "$boolTemp" "$(StageL_gt "$intA" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

le() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'le:comparison'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    boolTemp='false'
    boolTemp="$(StageL_eq "$intA" "$intB")"
    boolTemp="$(StageL_or "$boolTemp" "$(StageL_lt "$intA" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

ngt() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'ngt:comparison'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_gt "$intA" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

nlt() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'nlt:comparison'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_lt "$intA" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

nge() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'nge:comparison'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_ge "$intA" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

nle() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'nle:comparison'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    boolTemp='false'
    boolTemp="$(StageL_not "$(StageL_le "$intA" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

# Can check for exception as result like: if eq s/res dcDataNoResultException

dcDataNoResultException() {
    StageL_internalDebugStackEnter 'dcDataNoResultException:exceptions'; 


    strReturn='89315802-d53d-4d11-ba5d-bf505e8ed454'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

byteArrayFromBasenbUtf8InvalidInputException() {
    StageL_internalDebugStackEnter 'byteArrayFromBasenbUtf8InvalidInputException:exceptions'; 

    # It doesn't look like a normal UUID since it's an an/ function, so call strPrintArray on it to get the value as a string that can be compared using excep. (just use excepArr instead, which does this for you)

    strReturn='51 98 218 163 23 5 64 236 154 151 89 208 82 253 64 55 '; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

excep() {
    strTest="$1"; shift; StageL_internalDebugCollect "str Test = $strTest; "; StageL_internalDebugStackEnter 'excep:exceptions'; StageL_assertIsStr "$strTest"

    boolRes='false'
    boolRes='false'
    # Test for each exception type in turn
    boolRes="$(StageL_or "$boolRes" "$(StageL_eq "$strTest" "$(StageL_dcDataNoResultException )")")"
    boolRes="$(StageL_or "$boolRes" "$(StageL_eq "$strTest" "$(StageL_byteArrayFromBasenbUtf8InvalidInputException )")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

notExcep() {
    strTest="$1"; shift; StageL_internalDebugCollect "str Test = $strTest; "; StageL_internalDebugStackEnter 'notExcep:exceptions'; StageL_assertIsStr "$strTest"

    boolRes='false'
    boolRes="$(StageL_not "$(StageL_excep "$strTest")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

excepArr() {
    IFS=$'\037' read -r -a genericArrayTest <<< "$1"; shift; StageL_internalDebugCollect "genericArray Test = $genericArrayTest; "; StageL_internalDebugStackEnter 'excepArr:exceptions'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayTest[@]}")"

    boolRes='false'
    boolRes="$(StageL_excep "$(StageL_strPrintArray "$(join_by $'\037' "${genericArrayTest[@]}")")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

notExcepArr() {
    IFS=$'\037' read -r -a genericArrayTest <<< "$1"; shift; StageL_internalDebugCollect "genericArray Test = $genericArrayTest; "; StageL_internalDebugStackEnter 'notExcepArr:exceptions'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayTest[@]}")"

    boolRes='false'
    boolRes="$(StageL_not "$(StageL_excepArr "$(join_by $'\037' "${genericArrayTest[@]}")")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

excOrEmpty() {
    strTest="$1"; shift; StageL_internalDebugCollect "str Test = $strTest; "; StageL_internalDebugStackEnter 'excOrEmpty:exceptions'; StageL_assertIsStr "$strTest"

    boolRes='false'
    boolRes="$(StageL_or "$(StageL_excep "$strTest")" "$(StageL_strEmpty "$strTest")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

notExcOrEmpty() {
    strTest="$1"; shift; StageL_internalDebugCollect "str Test = $strTest; "; StageL_internalDebugStackEnter 'notExcOrEmpty:exceptions'; StageL_assertIsStr "$strTest"

    boolRes='false'
    boolRes="$(StageL_not "$(StageL_excOrEmpty "$strTest")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

# For now, I'm inclined to skip implementing wasm right now, and just have a stub interface here. It seems well specced and portable, so I think it *can* be at some point. It would be nice if it were already implemented in StageL, but I might have to do that later.
# Copies of the current versions as of this writing (latest git commits) of wac, WebAssembly spec, and dependencies are included in work-docs/wasm for easy access, and are covered under their respective licenses. The following repositories are there:
# https://github.com/kanaka/wac
# https://github.com/kanaka/fooboot
# https://github.com/WebAssembly/wabt
# https://github.com/WebAssembly/spec
# https://github.com/WebAssembly/testsuite
# https://github.com/google/googletest
# https://github.com/dabeaz/ply

wasmCheckForError() {
    strCaller="$1"; shift; IFS=$'\037' read -r -a genericItemArg <<< "$1"; shift; StageL_internalDebugCollect "str Caller = $strCaller; "; StageL_internalDebugCollect "genericItem Arg = $genericItemArg; "; StageL_internalDebugStackEnter 'wasmCheckForError:wasm'; StageL_assertIsStr "$strCaller"; StageL_assertIsGenericItem "$(join_by $'\037' "${genericItemArg[@]}")"

    strArgStr=''
    if [[ "true" == "$(StageL_isArray "$(join_by $'\037' "${genericItemArg[@]}")")" ]]; then
        strArgStr="$(StageL_printArray "$(join_by $'\037' "${genericItemArg[@]}")")"
        else
        strArgStr="$(StageL_strFrom "$(join_by $'\037' "${genericItemArg[@]}")")"
    fi
    intErr='0'
    intErr="$(StageL_internalWasmCall 'checkForError')"
    # await console.log('intErr='+intErr+typeof intErr);
    # await console.log('strArgStr='+strArgStr+typeof strArgStr);
    # Next line seems to crash with intErr being a null object. Why????
    # await console.log(await ne(intErr, 0));
    # return;
    StageL_warn 'WASM error checking does not yet work.'
    #if ne 0 n/err
    
        #die cat 'WebAssembly call to ' cat s/caller cat ' with the argument ' cat s/argStr ' reported an error.'
    }

    StageL_internalDebugStackExit;
}

wasmCall() {
    strRoutine="$1"; shift; intVal="$1"; shift; StageL_internalDebugCollect "str Routine = $strRoutine; "; StageL_internalDebugCollect "int Val = $intVal; "; StageL_internalDebugStackEnter 'wasmCall:wasm'; StageL_assertIsStr "$strRoutine"; StageL_assertIsInt "$intVal"

    intRes='0'
    intRes="$(StageL_internalWasmCall "$strRoutine" "$intVal")"
    StageL_wasmCheckForError "$strRoutine" "$intVal"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

wasmCallNoArgs() {
    strRoutine="$1"; shift; StageL_internalDebugCollect "str Routine = $strRoutine; "; StageL_internalDebugStackEnter 'wasmCallNoArgs:wasm'; StageL_assertIsStr "$strRoutine"

    # Only returns an int
    intRes='0'
    intRes="$(StageL_internalWasmCallNoArgs "$strRoutine")"
    StageL_wasmCheckForError "$strRoutine"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

wasmCallArrIn() {
    strRoutine="$1"; shift; IFS=$'\037' read -r -a intArrayVals <<< "$1"; shift; StageL_internalDebugCollect "str Routine = $strRoutine; "; StageL_internalDebugCollect "intArray Vals = $intArrayVals; "; StageL_internalDebugStackEnter 'wasmCallArrIn:wasm'; StageL_assertIsStr "$strRoutine"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayVals[@]}")"

    intRes='0'
    intRes="$(StageL_internalWasmCallArrIn "$strRoutine" "$(join_by $'\037' "${intArrayVals[@]}")")"
    StageL_wasmCheckForError "$strRoutine" "$(join_by $'\037' "${intArrayVals[@]}")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

wasmCallArrOut() {
    strRoutine="$1"; shift; intVal="$1"; shift; StageL_internalDebugCollect "str Routine = $strRoutine; "; StageL_internalDebugCollect "int Val = $intVal; "; StageL_internalDebugStackEnter 'wasmCallArrOut:wasm'; StageL_assertIsStr "$strRoutine"; StageL_assertIsInt "$intVal"

    intArrayRes=()
    intRes="$(StageL_internalWasmCallArrOut "$strRoutine" "$intVal")"
    StageL_wasmCheckForError "$strRoutine" "$intVal"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

wasmCallArrInOut() {
    strRoutine="$1"; shift; IFS=$'\037' read -r -a intArrayVals <<< "$1"; shift; StageL_internalDebugCollect "str Routine = $strRoutine; "; StageL_internalDebugCollect "intArray Vals = $intArrayVals; "; StageL_internalDebugStackEnter 'wasmCallArrInOut:wasm'; StageL_assertIsStr "$strRoutine"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayVals[@]}")"

    intArrayRes=()
    intRes="$(StageL_internalWasmCallArrInOut "$strRoutine" "$(join_by $'\037' "${intArrayVals[@]}")")"
    StageL_wasmCheckForError "$strRoutine" "$(join_by $'\037' "${intArrayVals[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

isNonnegative() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'isNonnegative:math'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_lt "$intIn" '0')" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isNegative() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'isNegative:math'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_lt "$intIn" '0')" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isPositive() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'isPositive:math'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_le "$intIn" '0')" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isNonpositive() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'isNonpositive:math'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_le "$intIn" '0')" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isEven() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'isEven:math'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intIn" '2')")" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isOdd() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'isOdd:math'; StageL_assertIsInt "$intIn"

    if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intIn" '2')")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

assertIsEven() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'assertIsEven:math'; StageL_assertIsInt "$intIn"

    StageL_assertIsTrue "$(StageL_isEven "$intIn")"

    StageL_internalDebugStackExit;
}

assertIsOdd() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'assertIsOdd:math'; StageL_assertIsInt "$intIn"

    StageL_assertIsTrue "$(StageL_isOdd "$intIn")"

    StageL_internalDebugStackExit;
}

intIsBetween() {
    intN="$1"; shift; intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'intIsBetween:math'; StageL_assertIsInt "$intN"; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    # Checks whether N is within the range A and B, including endpoints
    # Can't do it this way since it can use ints intermediately that are outside of 32 bit
    #new n/t1
    #set n/t1 sub n/n n/a
    #new n/t2
    #set n/t2 sub n/n n/b
    #new n/t3
    #set n/t3 mul n/t1 n/t2
    #new b/temp
    #set b/temp le n/t3 0
    # So instead implement using gt/lt
    boolTemp="$(StageL_and "$(StageL_ge "$intN" "$intA")" "$(StageL_le "$intN" "$intB")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

intToBase36Char() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'intToBase36Char:math'; StageL_assertIsInt "$intN"

    # Returns the nth digit in base 36 or less (using capitalized digits).
    if [[ "true" == "$(StageL_not "$(StageL_intIsBetween "$intN" '0' '36')")" ]]; then
        strTemp=''
        strTemp="$(StageL_strFrom "$intN")"
        StageL_die "$(StageL_cat "$(StageL_strFrom "$strTemp" ' is not within the supported range of numbers between 0 and 36 (Z).')")"
    fi
    strRes=''
    if [[ "true" == "$(StageL_le "$intN" '9')" ]]; then
        strRes="$(StageL_charFromByte "$(StageL_add "$intN" '48')")"
        else
        strRes="$(StageL_charFromByte "$(StageL_add "$intN" '55')")"
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

intFromBase36Char() {
    strN="$1"; shift; StageL_internalDebugCollect "str N = $strN; "; StageL_internalDebugStackEnter 'intFromBase36Char:math'; StageL_assertIsStr "$strN"

    # Returns an int given the nth digit in base 36 or less (using capitalized digits).
    StageL_assertIsChar "$strN"
    strUc=''
    strUc="$(StageL_strToUpper "$strN")"
    intRes='0'
    intRes="$(StageL_byteFromChar "$strUc")"
    if [[ "true" == "$(StageL_ge "$intRes" '65')" ]]; then
        if [[ "true" == "$(StageL_gt "$intRes" '90')" ]]; then
            StageL_die "$(StageL_cat "$strUc" ' is not within the supported range of digits between 0 and Z (36).')"
        fi
        intRes="$(StageL_sub "$intRes" '55')"
        else
        if [[ "true" == "$(StageL_not "$(StageL_intIsBetween "$intRes" '48' '57')")" ]]; then
            StageL_die "$(StageL_cat "$strN" ' is not within the supported range of digits between 0 and Z (36).')"
        fi
        intRes="$(StageL_sub "$intRes" '48')"
    fi
    if [[ "true" == "$(StageL_not "$(StageL_intIsBetween "$intRes" '0' '36')")" ]]; then
        StageL_die "$(StageL_cat 'Internal error in intFromBase36Char called with n=' "$(StageL_cat "$strN" '.')")"
    fi

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

intFromBaseStr() {
    strN="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "str N = $strN; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'intFromBaseStr:math'; StageL_assertIsStr "$strN"; StageL_assertIsInt "$intB"

    # Returns the integer represented by n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/
    StageL_assertIsBaseStr "$strN" "$intB"
    strUc=''
    strUc="$(StageL_strToUpper "$strN")"
    intRes='0'
    intRes='0'
    intLen='0'
    intLen="$(StageL_len "$strUc")"
    intInt='0'
    intInt='0'
    intPow='0'
    intPow='1'
    while [[ "true" == "$(StageL_gt "$intLen" '0')" ]]; do
        intLen="$(StageL_sub "$intLen" '1')"
        intInt="$(StageL_intFromBase36Char "$(StageL_strCharAtPos "$strUc" "$intLen")")"
        StageL_assertIsTrue "$(StageL_lt "$intInt" "$intB")"
        intRes="$(StageL_add "$intRes" "$(StageL_mul "$intInt" "$intPow")")"
        intPow="$(StageL_mul "$intPow" "$intB")"
    done

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

hexToDec() {
    strN="$1"; shift; StageL_internalDebugCollect "str N = $strN; "; StageL_internalDebugStackEnter 'hexToDec:math'; StageL_assertIsStr "$strN"

    intRes='0'
    intRes="$(StageL_intFromBaseStr "$strN" '16')"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

decToHex() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'decToHex:math'; StageL_assertIsInt "$intN"

    strRes=''
    strRes="$(StageL_intToBaseStr "$intN" '16')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

intToBaseStr() {
    intN="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'intToBaseStr:math'; StageL_assertIsInt "$intN"; StageL_assertIsInt "$intB"

    # Returns a string representing n in the requested base. Strategy based on https://www.geeksforgeeks.org/convert-base-decimal-vice-versa/
    strRes=''
    if [[ "true" == "$(StageL_eq '0' "$intN")" ]]; then
        strRes='0'
        else
        while [[ "true" == "$(StageL_gt "$intN" '0')" ]]; do
            strRes="$(StageL_cat "$strRes" "$(StageL_intToBase36Char "$(StageL_mod "$intN" "$intB")")")"
            intN="$(StageL_div "$intN" "$intB")"
        done
        strRes="$(StageL_reverseStr "$strRes")"
    fi
    StageL_assertIsBaseStr "$strRes" "$intB"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

isSupportedBase() {
    intB="$1"; shift; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'isSupportedBase:math'; StageL_assertIsInt "$intB"

    # StageL base conversion routines support base 1 to base 36.
    boolRes='false'
    boolRes="$(StageL_intIsBetween "$intB" '1' '36')"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isBaseDigit() {
    strIn="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'isBaseDigit:math'; StageL_assertIsStr "$strIn"; StageL_assertIsInt "$intB"

    StageL_assertIsChar "$strIn"
    StageL_assertIsSupportedBase "$intB"
    if [[ "true" == "$(StageL_not "$(StageL_asciiIsAlphanum "$(StageL_byteFromChar "$strIn")")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intDigitVal='0'
    intDigitVal="$(StageL_intFromBase36Char "$strIn")"
    boolRes='false'
    boolRes="$(StageL_lt "$intDigitVal" "$intB")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isBaseStr() {
    strIn="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'isBaseStr:math'; StageL_assertIsStr "$strIn"; StageL_assertIsInt "$intB"

    intLen='0'
    intLen="$(StageL_len "$strIn")"
    intLen="$(StageL_sub "$intLen" '1')"
    StageL_assertIsNonnegative "$intLen"
    strChr=''
    boolRes='false'
    boolRes='true'
    while [[ "true" == "$(StageL_ge "$intLen" '0')" ]]; do
        strChr="$(StageL_strCharAtPos "$strIn" "$intLen")"
        boolRes="$(StageL_and "$boolRes" "$(StageL_isBaseDigit "$strChr" "$intB")")"
        intLen="$(StageL_sub "$intLen" '1')"
    done

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

formatPercentage() {
    intA="$1"; shift; intB="$1"; shift; StageL_internalDebugCollect "int A = $intA; "; StageL_internalDebugCollect "int B = $intB; "; StageL_internalDebugStackEnter 'formatPercentage:math'; StageL_assertIsInt "$intA"; StageL_assertIsInt "$intB"

    if [[ "true" == "$(StageL_eq '0' "$intA")" ]]; then

        strReturn='0.000'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi
    intPercentageN='0'
    intPercentageN="$(StageL_mul '100' "$(StageL_div "$(StageL_mul "$intA" '100000')" "$intB")")"
    strPercentageTemp=''
    strPercentageTemp="$(StageL_strFrom "$intPercentageN")"
    intCount='0'
    intCount="$(StageL_sub "$(StageL_len "$strPercentageTemp")" '2')"
    intCounter='0'
    intCounter="$intCount"
    strPercentage=''
    intDecimLoc='0'
    intDecimLoc="$(StageL_sub "$intCount" '3')"
    while [[ "true" == "$(StageL_gt "$intCounter" '0')" ]]; do
        if [[ "true" == "$(StageL_eq "$intCounter" "$(StageL_sub "$intCount" "$intDecimLoc")")" ]]; then
            strPercentage="$(StageL_cat "$strPercentage" '.')"
        fi
        strPercentage="$(StageL_cat "$strPercentage" "$(StageL_strChar "$strPercentageTemp" "$(StageL_sub "$intCount" "$intCounter")")")"
        intCounter="$(StageL_sub "$intCounter" '1')"
    done

    strReturn="$strPercentage"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

inc() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'inc:math'; StageL_assertIsInt "$intN"

    intRes='0'
    intRes="$(StageL_add '1' "$intN")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

dec() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'dec:math'; StageL_assertIsInt "$intN"

    intRes='0'
    intRes="$(StageL_add '-1' "$intN")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

runTestsMath() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsMath:math-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'math'
    StageL_runTest "$boolV" "$(StageL_eq '4' "$(StageL_add '2' '2')")"
    StageL_runTest "$boolV" "$(StageL_ne '4' "$(StageL_add '2' '3')")"
    StageL_runTest "$boolV" "$(StageL_eq '26BD' "$(StageL_decToHex '9917')")"
    StageL_runTest "$boolV" "$(StageL_eq '9917' "$(StageL_hexToDec '26BD')")"

    StageL_internalDebugStackExit;
}

isByte() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'isByte:type-tools'; StageL_assertIsGeneric "$genericIn"

    if [[ "true" == "$(StageL_not "$(StageL_isInt "$genericIn")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intVal='0'
    intVal="$genericIn"
    boolRes='false'
    boolRes="$(StageL_intIsBetween "$intVal" '0' '255')"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isIntBit() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'isIntBit:type-tools'; StageL_assertIsGeneric "$genericIn"

    if [[ "true" == "$(StageL_not "$(StageL_isInt "$genericIn")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intVal='0'
    intVal="$genericIn"
    boolRes='false'
    boolRes="$(StageL_intIsBetween "$intVal" '0' '1')"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isChar() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'isChar:type-tools'; StageL_assertIsGeneric "$genericIn"

    if [[ "true" == "$(StageL_not "$(StageL_isStr "$genericIn")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    strVal=''
    strVal="$genericIn"
    boolRes='false'
    boolRes="$(StageL_isCharByte "$(StageL_byteFromChar "$strVal")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isCharByte() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'isCharByte:type-tools'; StageL_assertIsGeneric "$genericIn"

    # Bear in mind that StageL doesn't attempt to support Unicode.
    if [[ "true" == "$(StageL_not "$(StageL_isInt "$genericIn")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intVal='0'
    intVal="$genericIn"
    boolRes='false'
    boolRes="$(StageL_intIsBetween "$intVal" '32' '126')"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

strChar() {
    strStr="$1"; shift; intIndex="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugStackEnter 'strChar:strings'; StageL_assertIsStr "$strStr"; StageL_assertIsInt "$intIndex"

    strTemp=''
    strTemp="$(StageL_substring "$strStr" "$intIndex" '1')"

    strReturn="$strTemp"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strCharAtPos() {
    strStr="$1"; shift; intIndex="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugStackEnter 'strCharAtPos:strings'; StageL_assertIsStr "$strStr"; StageL_assertIsInt "$intIndex"

    # helper alias
    strTemp=''
    strTemp="$(StageL_strChar "$strStr" "$intIndex")"

    strReturn="$strTemp"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

charAtPos() {
    strStr="$1"; shift; intIndex="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugStackEnter 'charAtPos:strings'; StageL_assertIsStr "$strStr"; StageL_assertIsInt "$intIndex"

    # helper alias
    strTemp=''
    strTemp="$(StageL_strChar "$strStr" "$intIndex")"

    strReturn="$strTemp"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

charAt() {
    strStr="$1"; shift; intIndex="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugStackEnter 'charAt:strings'; StageL_assertIsStr "$strStr"; StageL_assertIsInt "$intIndex"

    # helper alias
    strTemp=''
    strTemp="$(StageL_strChar "$strStr" "$intIndex")"

    strReturn="$strTemp"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

setCharAt() {
    strStr="$1"; shift; intIndex="$1"; shift; strChar="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugCollect "str Char = $strChar; "; StageL_internalDebugStackEnter 'setCharAt:strings'; StageL_assertIsStr "$strStr"; StageL_assertIsInt "$intIndex"; StageL_assertIsStr "$strChar"

    strRes=''
    intFirstEnd='0'
    intLastStart='0'
    intFirstEnd="$(StageL_sub "$(StageL_len "$strStr")" "$(StageL_dec "$intIndex")")"
    intLastStart="$(StageL_sub "$(StageL_len "$strStr")" "$(StageL_inc "$intIndex")")"
    strRes="$(StageL_cat "$(StageL_substr "$strStr" '0' "$intFirstEnd")" "$(StageL_cat "$strChar" "$(StageL_substr "$strStr" "$intLastStart" '-1')")")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

reverseStr() {
    strStr="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugStackEnter 'reverseStr:strings'; StageL_assertIsStr "$strStr"

    intL='0'
    intL="$(StageL_len "$strStr")"
    intC='0'
    intC='0'
    strRes=''
    while [[ "true" == "$(StageL_le "$intC" "$intL")" ]]; do
        strRes="$(StageL_cat "$strRes" "$(StageL_strCharAtPos "$strStr" "$(StageL_sub "$intL" "$intC")")")"
        intC="$(StageL_add '1' "$intC")"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

charToUpper() {
    strChar="$1"; shift; StageL_internalDebugCollect "str Char = $strChar; "; StageL_internalDebugStackEnter 'charToUpper:strings'; StageL_assertIsStr "$strChar"

    StageL_assertIsChar "$strChar"
    intTemp='0'
    intTemp="$(StageL_byteFromChar "$strChar")"
    if [[ "true" == "$(StageL_intIsBetween "$intTemp" '97' '122')" ]]; then
        intTemp="$(StageL_sub "$intTemp" '32')"
    fi
    strRes=''
    strRes="$(StageL_charFromByte "$intTemp")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strToUpper() {
    strStr="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugStackEnter 'strToUpper:strings'; StageL_assertIsStr "$strStr"

    strRes=''
    intI='0'
    intI='0'
    intCount='0'
    intCount="$(StageL_len "$strStr")"
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        strRes="$(StageL_cat "$strRes" "$(StageL_charToUpper "$(StageL_strCharAtPos "$strStr" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

charToLower() {
    strChar="$1"; shift; StageL_internalDebugCollect "str Char = $strChar; "; StageL_internalDebugStackEnter 'charToLower:strings'; StageL_assertIsStr "$strChar"

    StageL_assertIsChar "$strChar"
    intTemp='0'
    intTemp="$(StageL_byteFromChar "$strChar")"
    if [[ "true" == "$(StageL_intIsBetween "$intTemp" '65' '90')" ]]; then
        intTemp="$(StageL_add "$intTemp" '32')"
    fi
    strRes=''
    strRes="$(StageL_charFromByte "$intTemp")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strToLower() {
    strStr="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugStackEnter 'strToLower:strings'; StageL_assertIsStr "$strStr"

    strRes=''
    intI='0'
    intI='0'
    intCount='0'
    intCount="$(StageL_len "$strStr")"
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        strRes="$(StageL_cat "$strRes" "$(StageL_charToLower "$(StageL_strCharAtPos "$strStr" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strEmpty() {
    strStr="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugStackEnter 'strEmpty:strings'; StageL_assertIsStr "$strStr"

    boolRes='false'
    boolRes="$(StageL_eq '0' "$(StageL_len "$strStr")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

strNonempty() {
    strStr="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugStackEnter 'strNonempty:strings'; StageL_assertIsStr "$strStr"

    boolRes='false'
    boolRes="$(StageL_not "$(StageL_strEmpty "$strStr")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

substr() {
    strStr="$1"; shift; intStart="$1"; shift; intLen="$1"; shift; StageL_internalDebugCollect "str Str = $strStr; "; StageL_internalDebugCollect "int Start = $intStart; "; StageL_internalDebugCollect "int Len = $intLen; "; StageL_internalDebugStackEnter 'substr:strings'; StageL_assertIsStr "$strStr"; StageL_assertIsInt "$intStart"; StageL_assertIsInt "$intLen"

    # Convenience wrapper
    strRes=''
    strRes="$(StageL_substring "$strStr" "$intStart" "$intLen")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strContainsOnlyInt() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'strContainsOnlyInt:strings'; StageL_assertIsStr "$strIn"

    # Positive int, specifically. Only digits allowed.
    intTemp='0'
    intTemp="$(StageL_len "$strIn")"
    intI='0'
    intI='0'
    boolRes='false'
    boolRes='true'
    while [[ "true" == "$(StageL_lt "$intI" "$intTemp")" ]]; do
        if [[ "true" == "$(StageL_not "$(StageL_asciiIsDigit "$(StageL_byteFromChar "$(StageL_strCharAtPos "$strIn" "$intI")")")")" ]]; then
            boolRes='false'
        fi
        intI="$(StageL_add "$intI" '1')"
    done

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isValidIdent() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isValidIdent:strings'; StageL_assertIsStr "$strIn"

    # Doesn't check for duplicate idents or whatever. Just makes sure the basic form is correct.
    intTemp='0'
    intTemp="$(StageL_len "$strIn")"
    intI='0'
    intI='0'
    boolRes='false'
    boolRes='true'
    intCurrentCharByte='0'
    while [[ "true" == "$(StageL_lt "$intI" "$intTemp")" ]]; do
        intCurrentCharByte="$(StageL_byteFromChar "$(StageL_strCharAtPos "$strIn" "$intI")")"
        if [[ "true" == "$(StageL_eq "$intI" '0')" ]]; then
            # First character can only be lowercase letter
            if [[ "true" == "$(StageL_not "$(StageL_asciiIsLetterLower "$intCurrentCharByte")")" ]]; then
                boolRes='false'
            fi
                elif [[ "true" == "$(StageL_not "$(StageL_or "$(StageL_asciiIsDigit "$intCurrentCharByte")" "$(StageL_asciiIsLetter "$intCurrentCharByte")")")" ]]; then
            boolRes='false'
        fi
        intI="$(StageL_add "$intI" '1')"
    done

    strReturn="$boolRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

prepareStrForEcho() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'prepareStrForEcho:strings'; StageL_assertIsStr "$strIn"

    intArrayRes=()
    intArrayRes="$(StageL_convertFormats 'ascii' "$(StageL_getEnvPreferredFormat )" "$(StageL_append "$(StageL_strToByteArray "$strIn")" "$(StageL_crlf )")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

strPrintArr() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'strPrintArr:type-conversion'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    # The reverse of this for an/ input is intArrFromStrPrintedArr.
    # Hint: running this on a DcArray produces a sems document that can be turned back into a DcArray with dcarrParseSems strToByteArray s/str :)
    strOut=''
    strOut="$(StageL_strJoin "$(join_by $'\037' "${genericArrayIn[@]}")" ' ')"

    strReturn="$strOut"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

printArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'printArray:type-conversion'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    # Just a convenience wrapper
    strRes=''
    strRes="$(StageL_strPrintArr "$(join_by $'\037' "${genericArrayIn[@]}")")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strPrintArray() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'strPrintArray:type-conversion'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    # Just a convenience wrapper
    strRes=''
    strRes="$(StageL_strPrintArr "$(join_by $'\037' "${genericArrayIn[@]}")")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

printArr() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugStackEnter 'printArr:type-conversion'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"

    # Just a convenience wrapper
    strRes=''
    strRes="$(StageL_strPrintArr "$(join_by $'\037' "${genericArrayIn[@]}")")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strSplit() {
    strIn="$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strSplit:type-conversion'; StageL_assertIsStr "$strIn"; StageL_assertIsStr "$strSeparator"

    strArrayRes=()
    intSeparLen='0'
    intSeparLen="$(StageL_len "$strSeparator")"
    strRemaining=''
    strRemaining="$strIn"
    intRemainingLen='0'
    intRemainingLen="$(StageL_len "$strRemaining")"
    strCurrentElem=''
    strCurrentChar=''
    while [[ "true" == "$(StageL_lt '0' "$intRemainingLen")" ]]; do
        if [[ "true" == "$(StageL_eq "$strSeparator" "$(StageL_substr "$strRemaining" '0' "$intSeparLen")")" ]]; then
            strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strCurrentElem")"
            strCurrentElem=''
            strRemaining="$(StageL_substr "$strRemaining" "$intSeparLen" '-1')"
                else
            strCurrentChar="$(StageL_strChar "$strRemaining" '0')"
            strCurrentElem="$(StageL_cat "$strCurrentElem" "$strCurrentChar")"
            if [[ "true" == "$(StageL_lt '1' "$intRemainingLen")" ]]; then
                strRemaining="$(StageL_substr "$strRemaining" '1' '-1')"
                        else
                strRemaining=''
            fi
        fi
        intRemainingLen="$(StageL_len "$strRemaining")"
    done
    strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strCurrentElem")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

strJoin() {
    IFS=$'\037' read -r -a genericArrayIn <<< "$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "genericArray In = $genericArrayIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strJoin:type-conversion'; StageL_assertIsGenericArray "$(join_by $'\037' "${genericArrayIn[@]}")"; StageL_assertIsStr "$strSeparator"

    # Opposite of strSplit for a given separator
    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${genericArrayIn[@]}")")"
    intI='0'
    intI='0'
    strOut=''
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        strOut="$(StageL_cat "$strOut" "$(StageL_strFrom "$(StageL_get "$(join_by $'\037' "${genericArrayIn[@]}")" "$intI")")")"
        if [[ "true" == "$(StageL_ne "$intI" "$(StageL_add '-1' "$intCount")")" ]]; then
            strOut="$(StageL_cat "$strOut" "$strSeparator")"
        fi
        intI="$(StageL_add "$intI" '1')"
    done

    strReturn="$strOut"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strSplitEscaped() {
    strIn="$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strSplitEscaped:type-conversion'; StageL_assertIsStr "$strIn"; StageL_assertIsStr "$strSeparator"

    strArrayRes=()
    strArrayExploded=()
    strArrayExploded="$(StageL_strSplit "$strIn" "$strSeparator")"
    strArrayRes=(  )
    intK='0'
    intL='0'
    intK='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayExploded[@]}")")"
    boolContinue='false'
    boolContinue='true'
    strTemp=''
    strArrayTempSubset=()
    while [[ "true" == "$(StageL_and "$boolContinue" "$(StageL_lt "$intK" "$intL")")" ]]; do
        if [[ "true" == "$(StageL_eq '\\' "$(StageL_charAt "$(StageL_get "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK")" "$(StageL_add '-1' "$(StageL_len "$(StageL_get "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK")")")")")" ]]; then
            if [[ "true" == "$(StageL_ge "$(StageL_add '1' "$intK")" "$intL")" ]]; then
                strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$(StageL_get "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK")")"
                boolContinue='false'
            fi
            strTemp="$(StageL_setCharAt "$(StageL_get "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK")" "$(StageL_dec "$(StageL_len "$(StageL_get "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK")" )" )" "$strSeparator")"
            StageL_setElem "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK" "$strTemp"
            #array_splice($exploded, $k + 1, 1); // https://www.php.net/manual/en/function.array-splice.php
            strArrayTempSubset="$(StageL_subset "$(join_by $'\037' "${strArrayExploded[@]}")" "$(StageL_add '1' "$intK")" "$(StageL_add '2' "$intK")")"
            strArrayExploded="$(StageL_append "$(join_by $'\037' "${strArrayTempSubset[@]}")" "$(StageL_subset "$(join_by $'\037' "${strArrayExploded[@]}")" "$(StageL_add '2' "$intK")" '-1')")"
            intL="$(StageL_dec "$intL")"
            intK="$(StageL_dec "$intK")"
                else
            strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$(StageL_get "$(join_by $'\037' "${strArrayExploded[@]}")" "$intK")")"
        fi
        intK="$(StageL_add '1' "$intK")"
    done

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
    # Based on the explode_esc PHP function:
    #//explode_escaped (not written by me)
    #function explode_esc($delimiter, $string)
    #{
    #    $exploded = explode($delimiter, $string);
    #    $fixed    = array();
    #    for ($k = 0, $l = count($exploded); $k < $l; ++$k) {
    #        if ($exploded[$k][strlen($exploded[$k]) - 1] == '\\') {
    #            if ($k + 1 >= $l) {
    #                $fixed[] = trim($exploded[$k]);
    #                break;
    #            }
    #            $exploded[$k][strlen($exploded[$k]) - 1] = $delimiter;
    #            $exploded[$k] .= $exploded[$k + 1];
    #            array_splice($exploded, $k + 1, 1);
    #            --$l;
    #            --$k;
    #        } else
    #            $fixed[] = trim($exploded[$k]);
    #    }
    #    return $fixed;
    #}
}

strSplitEsc() {
    strIn="$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strSplitEsc:type-conversion'; StageL_assertIsStr "$strIn"; StageL_assertIsStr "$strSeparator"

    # Convenience wrapper
    strArrayRes=()
    strArrayRes="$(StageL_strSplitEscaped "$strIn" "$strSeparator")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

explodeEsc() {
    strIn="$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'explodeEsc:type-conversion'; StageL_assertIsStr "$strIn"; StageL_assertIsStr "$strSeparator"

    strArrayRes=()
    strArrayRes="$(StageL_strSplitEscaped "$strIn" "$strSeparator")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

explodeEscaped() {
    strIn="$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'explodeEscaped:type-conversion'; StageL_assertIsStr "$strIn"; StageL_assertIsStr "$strSeparator"

    strArrayRes=()
    strArrayRes="$(StageL_strSplitEscaped "$strIn" "$strSeparator")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

strJoinEscaped() {
    IFS=$'\037' read -r -a strArrayIn <<< "$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "strArray In = $strArrayIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strJoinEscaped:type-conversion'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayIn[@]}")"; StageL_assertIsStr "$strSeparator"

    strRes=''
    intC='0'
    intL='0'
    intC='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayIn[@]}")")"
    while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
        strRes="$(StageL_cat "$strRes" "$(StageL_cat "$(StageL_strReplace "$(StageL_get "$(join_by $'\037' "${strArrayIn[@]}")" "$intC")" "$strSeparator" "$(StageL_cat '\' "$strSeparator")" )" "$strSeparator")")"
        intC="$(StageL_inc "$intC")"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strJoinEsc() {
    IFS=$'\037' read -r -a strArrayIn <<< "$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "strArray In = $strArrayIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strJoinEsc:type-conversion'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayIn[@]}")"; StageL_assertIsStr "$strSeparator"

    # Convenience wrapper
    strRes=''
    strRes="$(StageL_strJoinEscaped "$(join_by $'\037' "${strArrayIn[@]}")" "$strSeparator")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strJoinEscNoTrailing() {
    IFS=$'\037' read -r -a strArrayIn <<< "$1"; shift; strSeparator="$1"; shift; StageL_internalDebugCollect "strArray In = $strArrayIn; "; StageL_internalDebugCollect "str Separator = $strSeparator; "; StageL_internalDebugStackEnter 'strJoinEscNoTrailing:type-conversion'; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayIn[@]}")"; StageL_assertIsStr "$strSeparator"

    # a,b instead of a,b,
    strRes=''
    intSeparLen='0'
    intSeparLen="$(StageL_len "$strSeparator")"
    intSeparLen="$(StageL_sub '-1' "$intSeparLen")"
    strRes="$(StageL_substr "$(StageL_strJoinEscaped "$(join_by $'\037' "${strArrayIn[@]}")" "$strSeparator")" '0' "$intSeparLen")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

intArrFromStrPrintedArr() {
    strInput="$1"; shift; StageL_internalDebugCollect "str Input = $strInput; "; StageL_internalDebugStackEnter 'intArrFromStrPrintedArr:type-conversion'; StageL_assertIsStr "$strInput"

    # Reverse of strPrintArr with an an/ parameter.
    intArrayRes=()
    intArrayContent=()
    intArrayContent="$(StageL_strToByteArray "$strInput")"
    strCurrentInt=''
    strCurrentInt=''
    intContentLength='0'
    intContentLength="$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")"
    intByteOffset='0'
    intCurrentByte='0'
    while [[ "true" == "$(StageL_lt "$intByteOffset" "$intContentLength")" ]]; do
        # do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are ints represented as ASCII text bytes, rather than an array of ints.
        intCurrentByte="$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" "$intByteOffset")"
        if [[ "true" == "$(StageL_asciiIsDigit "$intCurrentByte")" ]]; then
            strCurrentInt="$(StageL_cat "$strCurrentInt" "$(StageL_charFromByte "$intCurrentByte")")"
                elif [[ "true" == "$(StageL_asciiIsSpace "$intCurrentByte")" ]]; then
            intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentInt")")"
            strCurrentInt=''
                else
            StageL_die 'Unexpected parser state in intArrFromStrPrintedArr.'
        fi
        intByteOffset="$(StageL_add "$intByteOffset" '1')"
    done
    if [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strCurrentInt")")" ]]; then
        # Ended without a trailing space
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentInt")")"
    fi

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

positiveIntFromIntStr() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'positiveIntFromIntStr:type-conversion'; StageL_assertIsStr "$strIn"

    # Returns a negative value for an empty input string
    intRes='0'
    if [[ "true" == "$(StageL_eq '0' "$(StageL_len "$strIn")")" ]]; then
        intRes='-1'
        else
        intRes="$(StageL_intFromIntStr "$strIn")"
    fi

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

posIntFromIntStr() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'posIntFromIntStr:type-conversion'; StageL_assertIsStr "$strIn"

    # Convenience wrapper
    intRes='0'
    intRes="$(StageL_positiveFromIntStr "$strIn")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

charFromHexByte() {
    strHexByte="$1"; shift; StageL_internalDebugCollect "str HexByte = $strHexByte; "; StageL_internalDebugStackEnter 'charFromHexByte:type-conversion'; StageL_assertIsStr "$strHexByte"

    # Bear in mind that StageL doesn't attempt to support Unicode.
    StageL_assertIsBaseStr "$strHexByte" '16'
    strRes=''
    strRes="$(StageL_charFromByte "$(StageL_intFromBaseStr "$strHexByte" '16')")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

strToByteArray() {
    strInput="$1"; shift; StageL_internalDebugCollect "str Input = $strInput; "; StageL_internalDebugStackEnter 'strToByteArray:type-conversion'; StageL_assertIsStr "$strInput"

    intCount='0'
    intCount="$(StageL_len "$strInput")"
    intI='0'
    intI='0'
    intArrayOut=()
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        intArrayOut="$(StageL_push "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_byteFromChar "$(StageL_strChar "$strInput" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

strFromByteArray() {
    IFS=$'\037' read -r -a intArrayInput <<< "$1"; shift; StageL_internalDebugCollect "intArray Input = $intArrayInput; "; StageL_internalDebugStackEnter 'strFromByteArray:type-conversion'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayInput[@]}")"

    # Remember this will break if there are non-string bytes in it.
    intCount='0'
    intCount="$(StageL_count "$(join_by $'\037' "${intArrayInput[@]}")")"
    intI='0'
    intI='0'
    strOut=''
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        strOut="$(StageL_cat "$strOut" "$(StageL_charFromByte "$(StageL_get "$(join_by $'\037' "${intArrayInput[@]}")" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done

    strReturn="$strOut"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

runTestsOnly() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsOnly:unit-testing'; StageL_assertIsBool "$boolV"

    # Run tests without report. b/v=verbose: true=print test result lines; false=return value only
    # This runs each component's test suite
    # General tests
    #runTestsBits b/v
    StageL_runTestsMath "$boolV"
    StageL_runTestsPack32 "$boolV"
    StageL_runTestsTypeConversion "$boolV"
    StageL_runTestsWasm "$boolV"
    # Core tests
    StageL_runTestsDcData "$boolV"
    StageL_runTestsFormatDc "$boolV"
    # Format tests
    StageL_runTestsFormatAscii "$boolV"
    StageL_runTestsFormatAsciiSafeSubset "$boolV"
    StageL_runTestsFormatHtml "$boolV"
    StageL_runTestsFormatHtmlFragment "$boolV"
    StageL_runTestsFormatIntegerList "$boolV"
    StageL_runTestsFormatSems "$boolV"
    StageL_runTestsFormatUtf8 "$boolV"
    # Document exec tests
    StageL_runTestsDocumentExec "$boolV"
    # Did anything fail?
    if [[ "true" == "$(StageL_eq "$intFailedTests" '0')" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

testing() {
    boolV="$1"; shift; strTestSuite="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugCollect "str TestSuite = $strTestSuite; "; StageL_internalDebugStackEnter 'testing:unit-testing'; StageL_assertIsBool "$boolV"; StageL_assertIsStr "$strTestSuite"

    if [[ "true" == "$boolV" ]]; then
        intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$(StageL_cat 'Started running test suite: ' "$strTestSuite")")")"
        StageL_renderDrawContents "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")"
    fi

    StageL_internalDebugStackExit;
}

runTest() {
    boolV="$1"; shift; boolTestReturn="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugCollect "bool TestReturn = $boolTestReturn; "; StageL_internalDebugStackEnter 'runTest:unit-testing'; StageL_assertIsBool "$boolV"; StageL_assertIsBool "$boolTestReturn"

    intTotalTests="$(StageL_add "$intTotalTests" '1')"
    if [[ "true" == "$boolTestReturn" ]]; then
        if [[ "true" == "$boolV" ]]; then
            intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$(StageL_cat 'Test #' "$(StageL_cat "$(StageL_strFrom "$intTotalTests")" ' passed.')")")")"
        fi
        intPassedTests="$(StageL_add "$intPassedTests" '1')"
        else
        if [[ "true" == "$boolV" ]]; then
            intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$(StageL_cat 'Test #' "$(StageL_cat "$(StageL_strFrom "$intTotalTests")" ' failed.')")")")"
        fi
        intFailedTests="$(StageL_add "$intFailedTests" '1')"
    fi
    if [[ "true" == "$boolV" ]]; then
        StageL_renderDrawContents "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")"
    fi

    boolReturn="$boolTestReturn"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

runTestNamed() {
    boolV="$1"; shift; strTestName="$1"; shift; boolTestReturn="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugCollect "str TestName = $strTestName; "; StageL_internalDebugCollect "bool TestReturn = $boolTestReturn; "; StageL_internalDebugStackEnter 'runTestNamed:unit-testing'; StageL_assertIsBool "$boolV"; StageL_assertIsStr "$strTestName"; StageL_assertIsBool "$boolTestReturn"

    intTotalTests="$(StageL_add "$intTotalTests" '1')"
    if [[ "true" == "$boolTestReturn" ]]; then
        if [[ "true" == "$boolV" ]]; then
            intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$(StageL_cat 'Test #' "$(StageL_cat "$(StageL_strFrom "$intTotalTests")" "$(StageL_cat "$strTestName" ' passed.')")")")")"
        fi
        intPassedTests="$(StageL_add "$intPassedTests" '1')"
        else
        if [[ "true" == "$boolV" ]]; then
            intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$(StageL_cat 'Test #' "$(StageL_cat "$(StageL_strFrom "$intTotalTests")" "$(StageL_cat "$strTestName" ' failed.')")")")")"
        fi
        intFailedTests="$(StageL_add "$intFailedTests" '1')"
    fi
    if [[ "true" == "$boolV" ]]; then
        StageL_renderDrawContents "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")"
    fi

    boolReturn="$boolTestReturn"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

clearTestStats() {
    StageL_internalDebugStackEnter 'clearTestStats:unit-testing';

    intTotalTests='0'
    intPassedTests='0'
    intFailedTests='0'

    StageL_internalDebugStackExit;
}

reportTests() {
    StageL_internalDebugStackEnter 'reportTests:unit-testing'; 

    strPassedWord=''
    strPassedWord='tests'
    if [[ "true" == "$(StageL_eq "$intPassedTests" '1')" ]]; then
        strPassedWord='test'
    fi
    strFailedWord=''
    strFailedWord='tests'
    if [[ "true" == "$(StageL_eq "$intFailedTests" '1')" ]]; then
        strFailedWord='test'
    fi
    strTotalWord=''
    strTotalWord='tests'
    if [[ "true" == "$(StageL_eq "$intTotalTests" '1')" ]]; then
        strTotalWord='test'
    fi
    strPassedPercentage=''
    strPassedPercentage="$(StageL_formatPercentage "$intPassedTests" "$intTotalTests")"
    strFailedPercentage=''
    strFailedPercentage="$(StageL_formatPercentage "$intFailedTests" "$intTotalTests")"
    intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$(StageL_cat "$(StageL_strFrom "$intPassedTests")" "$(StageL_cat ' ' "$(StageL_cat "$strPassedWord" "$(StageL_cat ' (' "$(StageL_cat "$strPassedPercentage" "$(StageL_cat '%) passed and ' "$(StageL_cat "$(StageL_strFrom "$intFailedTests")" "$(StageL_cat ' ' "$(StageL_cat "$strFailedWord" "$(StageL_cat ' (' "$(StageL_cat "$strFailedPercentage" "$(StageL_cat '%) failed out of a total of ' "$(StageL_cat "$(StageL_strFrom "$intTotalTests")" "$(StageL_cat ' ' "$(StageL_cat "$strTotalWord" '.')")")")")")")")")")")")")")")")")"
    strTemp=''
    if [[ "true" == "$(StageL_ne "$intFailedTests" '0')" ]]; then
        strTotalWord='Some tests'
        if [[ "true" == "$(StageL_eq "$intTotalTests" '1')" ]]; then
            strTotalWord='A test'
        fi
        strTemp="$(StageL_cat "$strTotalWord" "$(StageL_cat ' (' "$(StageL_cat "$strFailedPercentage" "$(StageL_cat '%: ' "$(StageL_cat "$(StageL_strFrom "$intFailedTests")" "$(StageL_cat ' out of ' "$(StageL_cat "$(StageL_strFrom "$intTotalTests")" ') failed!')")")")")")")"
        intArrayTestFrameBuffer="$(StageL_append "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")" "$(StageL_prepareStrForEcho "$strTemp")")"
        #error s/temp
    fi
    if [[ "true" == "$(StageL_ne "$intPassedTests" "$(StageL_sub "$intTotalTests" "$intFailedTests")")" ]]; then
        StageL_die 'There is a problem in the testing framework.'
    fi
    StageL_renderDrawContents "$(join_by $'\037' "${intArrayTestFrameBuffer[@]}")"
    intArrayTestFrameBuffer=(  )
    boolTestReturn='false'
    boolTestReturn='true'
    if [[ "true" == "$(StageL_ne "$intFailedTests" '0')" ]]; then
        boolTestReturn='false'
        #die s/temp
    fi

    boolReturn="$boolTestReturn"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

debugRev() {
    intLevel="$1"; shift; strMessage="$1"; shift; StageL_internalDebugCollect "int Level = $intLevel; "; StageL_internalDebugCollect "str Message = $strMessage; "; StageL_internalDebugStackEnter 'debugRev:logging'; StageL_assertIsInt "$intLevel"; StageL_assertIsStr "$strMessage"

    # Just the debug routine with the arguments reversed to avoid needing to close a bunch of arglists for a dynamically constructed string.
    StageL_debug "$strMessage" "$intLevel"

    StageL_internalDebugStackExit;
}

prepareDocumentExec() {
    IFS=$'\037' read -r -a intArrayContents <<< "$1"; shift; StageL_internalDebugCollect "intArray Contents = $intArrayContents; "; StageL_internalDebugStackEnter 'prepareDocumentExec:document-exec'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContents[@]}")"

    intExecId='0'
    intExecId='-1'
    # documentExecData is a global, created during initialization. It holds the current document state for any documents being executed.
    intExecId="$(StageL_count "$(join_by $'\037' "${strArrayDocumentExecPtrs[@]}")")"
    strArrayDocumentExecData="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecData[@]}")" "$(StageL_strPrintArr "$(join_by $'\037' "${intArrayContents[@]}")")")"
    # documentExecPtrs is also a global created during init; it holds the current execution state of each document as an array of strings of of comma-terminated ints with the last indicating the position in the document where execution is (the earlier ints represent where execution should return to upon exiting the current scope, so it acts as a stack).
    strArrayDocumentExecSymbolIndex="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecSymbolIndex[@]}")" '')"
    strArrayDocumentExecPtrs="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecPtrs[@]}")" '0,')"
    strArrayDocumentExecFrames="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecFrames[@]}")" '')"
    strArrayDocumentExecEvents="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecEvents[@]}")" '')"
    strArrayDocumentExecLogs="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecLogs[@]}")" '')"
    strArrayDocumentExecSettings="$(StageL_push "$(join_by $'\037' "${strArrayDocumentExecSettings[@]}")" ',')"
    StageL_assertIsExecId "$intExecId"

    intReturn="$intExecId"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

isExecId() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'isExecId:document-exec'; StageL_assertIsInt "$intExecId"

    if [[ "true" == "$(StageL_lt "$intExecId" "$(StageL_count "$(join_by $'\037' "${strArrayDocumentExecPtrs[@]}")")")" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

getExecSettings() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getExecSettings:document-exec'; StageL_assertIsInt "$intExecId"

    strArrayRes=()
    strArrayRes="$(StageL_kvSplit "$(StageL_get "$(join_by $'\037' "${strArrayDocumentExecSettings[@]}")" "$intExecId")")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

setExecSettings() {
    intExecId="$1"; shift; IFS=$'\037' read -r -a strArrayVal <<< "$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "strArray Val = $strArrayVal; "; StageL_internalDebugStackEnter 'setExecSettings:document-exec'; StageL_assertIsInt "$intExecId"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayVal[@]}")"

    # Replace the entire exec settings array for this exec.
    strArrayDocumentExecSettings="$(StageL_setElem "$(join_by $'\037' "${strArrayDocumentExecSettings[@]}")" "$intExecId" "$(StageL_kvJoin "$(join_by $'\037' "${strArrayVal[@]}")")")"

    StageL_internalDebugStackExit;
}

getExecPtrs() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getExecPtrs:document-exec'; StageL_assertIsInt "$intExecId"

    strArrayRes=()
    strArrayRes="$(StageL_strSplitEsc "$(StageL_get "$(join_by $'\037' "${strArrayDocumentExecPtrs[@]}")" "$intExecId")" ',')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

setExecPtrs() {
    intExecId="$1"; shift; IFS=$'\037' read -r -a strArrayVal <<< "$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "strArray Val = $strArrayVal; "; StageL_internalDebugStackEnter 'setExecPtrs:document-exec'; StageL_assertIsInt "$intExecId"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayVal[@]}")"

    # Replace the entire exec pointer array for this exec.
    strArrayDocumentExecPtrs="$(StageL_setElem "$(join_by $'\037' "${strArrayDocumentExecPtrs[@]}")" "$intExecId" "$(StageL_strJoinEsc "$(join_by $'\037' "${strArrayVal[@]}")" ',')")"

    StageL_internalDebugStackExit;
}

getCurrentExecPtrPos() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getCurrentExecPtrPos:document-exec'; StageL_assertIsInt "$intExecId"

    intRes='0'
    intRes="$(StageL_intFromIntStr "$(StageL_get "$(StageL_getExecPtrs "$intExecId")" '-1')")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

setExecPtrPos() {
    intExecId="$1"; shift; intNewPos="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "int NewPos = $intNewPos; "; StageL_internalDebugStackEnter 'setExecPtrPos:document-exec'; StageL_assertIsInt "$intExecId"; StageL_assertIsInt "$intNewPos"

    StageL_setExecPtrs "$intExecId" "$(StageL_setElem "$(StageL_getExecPtrs "$intExecId")" '-1' "$(StageL_strFrom "$intNewPos")")"

    StageL_internalDebugStackExit;
}

incrExecPtrPos() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'incrExecPtrPos:document-exec'; StageL_assertIsInt "$intExecId"

    StageL_setExecPtrPos "$intExecId" "$(StageL_add '1' "$(StageL_getCurrentExecPtrPos "$intExecId")")"

    StageL_internalDebugStackExit;
}

getNextLevelExecPtrPos() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getNextLevelExecPtrPos:document-exec'; StageL_assertIsInt "$intExecId"

    intRes='0'
    intRes="$(StageL_intFromIntStr "$(StageL_get "$(StageL_getExecPtrs "$intExecId")" '-2')")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

getCurrentExecData() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getCurrentExecData:document-exec'; StageL_assertIsInt "$intExecId"

    intArrayRes=()
    intArrayRes="$(StageL_intArrFromStrPrintedArr "$(StageL_get "$(join_by $'\037' "${strArrayDocumentExecData[@]}")" "$intExecId")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

getCurrentExecFrame() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getCurrentExecFrame:document-exec'; StageL_assertIsInt "$intExecId"

    intArrayRes=()
    intArrayRes="$(StageL_intArrFromStrPrintedArr "$(StageL_get "$(join_by $'\037' "${strArrayDocumentExecFrames[@]}")" "$intExecId")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

startDocumentExec() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'startDocumentExec:document-exec'; StageL_assertIsInt "$intExecId"

    StageL_assertIsExecId "$intExecId"
    boolContinue='false'
    boolContinue='true'
    intCurrentPtrPos='0'
    intArrayWipFrame=()
    intDc='0'
    intArrayDocumentWorkingCopyData=()
    intArrayDocumentWorkingCopyData="$(StageL_intArrFromStrPrintedArr "$(StageL_get "$(join_by $'\037' "${strArrayDocumentExecData[@]}")" "$intExecId")")"
    strArrayState=()
    strArrayState=( 'normal' )
    boolLastCharacterWasEscape='false'
    boolLastCharacterWasEscape='false'
    intStopExecAtTick='0'
    intStopExecAtTick="$(StageL_positiveIntFromIntStr "$(StageL_getExecOption "$intExecId" 'stopExecAtTick')")"
    boolRunHeadless='false'
    boolRunHeadless="$(StageL_eq 'true' "$(StageL_getExecOption "$intExecId" 'runHeadless')")"
    intCurrentTick='0'
    intCurrentTick='0'
    if [[ "true" == "$(StageL_isNonnegative "$intStopExecAtTick")" ]]; then
        if [[ "true" == "$(StageL_ge "$intCurrentTick" "$(StageL_add '-1' "$intStopExecAtTick")")" ]]; then
            boolContinue='false'
        fi
    fi
    while [[ "true" == "$boolContinue" ]]; do
        if [[ "true" == "$(StageL_isNonnegative "$intStopExecAtTick")" ]]; then
            if [[ "true" == "$(StageL_ge "$intCurrentTick" "$(StageL_add '-1' "$intStopExecAtTick")")" ]]; then
                boolContinue='false'
            fi
        fi
        intCurrentTick="$(StageL_inc "$intCurrentTick")"
        # This loop goes through each Dc in the document, running it.
        # Where are we in the document? Store it in n/currentPtrPos.
        # n/currentPtrPos is a read-only copy! For changing it, call setExecPtrPos or incrExecPtrPos
        intCurrentPtrPos="$(StageL_getCurrentExecPtrPos "$intExecId")"
        # The execution process basically is a big state machine.
        if [[ "true" == "$(StageL_ge "$intCurrentPtrPos" "$(StageL_count "$(join_by $'\037' "${intArrayDocumentWorkingCopyData[@]}")")")" ]]; then
            # We're done with the document
            boolContinue='false'
                else
            intDc="$(StageL_get "$(join_by $'\037' "${intArrayDocumentWorkingCopyData[@]}")" "$intCurrentPtrPos")"
            StageL_debugRev '1' "$(StageL_cat 'Starting exec loop with data ' "$(StageL_cat "$(StageL_strPrintArr "$(join_by $'\037' "${intArrayDocumentWorkingCopyData[@]}")")" "$(StageL_cat ' and at position ' "$(StageL_cat "$(StageL_strFrom "$intCurrentPtrPos")" "$(StageL_cat ' with current Dc ' "$(StageL_cat "$(StageL_strFrom "$intDc")" "$(StageL_cat '; in state ' "$(StageL_cat "$(StageL_strPrintArr "$(join_by $'\037' "${strArrayState[@]}")")" "$(StageL_cat ' at tick ' "$(StageL_cat "$(StageL_strFrom "$intCurrentTick")" '.')")")")")")")")")")"
            if [[ "true" == "$boolLastCharacterWasEscape" ]]; then
                boolLastCharacterWasEscape='false'
                StageL_incrExecPtrPos "$intExecId"
                        else
                # Char isn't escaped, so process it normally
                if [[ "true" == "$(StageL_eq "$intDc" '255')" ]]; then
                    boolLastCharacterWasEscape='true'
                                else
                    if [[ "true" == "$(StageL_eq 'normal' "$(StageL_last "$(join_by $'\037' "${strArrayState[@]}")")")" ]]; then
                        if [[ "true" == "$(StageL_in "$intDc" "$(join_by $'\037' '246' '247')")" ]]; then
                            strArrayState="$(StageL_push "$(join_by $'\037' "${strArrayState[@]}")" 'single-line source comment')"
                                                elif [[ "true" == "$(StageL_in "$intDc" "$(join_by $'\037' '249' '250')")" ]]; then
                            strArrayState="$(StageL_push "$(join_by $'\037' "${strArrayState[@]}")" 'block source comment')"
                        fi
                        if [[ "true" == "$(StageL_dcIsELCode "$intDc")" ]]; then
                            # FIXME unimplemented
                                                else
                            # Normal Dc, or at least we don't know what it is
                            intArrayWipFrame="$(StageL_push "$(join_by $'\037' "${intArrayWipFrame[@]}")" "$intDc")"
                        fi
                                        elif [[ "true" == "$(StageL_eq 'single-line source comment' "$(StageL_last "$(join_by $'\037' "${strArrayState[@]}")")")" ]]; then
                        if [[ "true" == "$(StageL_eq "$intDc" '248')" ]]; then
                            strArrayState="$(StageL_pop "$(join_by $'\037' "${strArrayState[@]}")")"
                        fi
                                        elif [[ "true" == "$(StageL_eq 'block source comment' "$(StageL_last "$(join_by $'\037' "${strArrayState[@]}")")")" ]]; then
                        if [[ "true" == "$(StageL_eq "$intDc" '251')" ]]; then
                            strArrayState="$(StageL_pop "$(join_by $'\037' "${strArrayState[@]}")")"
                        fi
                    fi
                fi
                StageL_incrExecPtrPos "$intExecId"
            fi
        fi
        if [[ "true" == "$(StageL_and "$(StageL_not "$boolRunHeadless")" "$(StageL_eq '0' "$(StageL_mod "$intCurrentTick" '100')")")" ]]; then
            # Convert the frame data to the environment-appropriate format and output it. Ideally this would happen at more sensible intervals, but this is easy to implement...
            StageL_setElement "$(join_by $'\037' "${strArrayDocumentExecFrames[@]}")" "$intExecId" "$(StageL_printArr "$(join_by $'\037' "${intArrayWipFrame[@]}")")"
            StageL_renderDrawContents "$(StageL_dcaToFormat "$(StageL_getEnvPreferredFormat )" "$(StageL_getCurrentExecFrame "$intExecId")")"
        fi
    done
    StageL_setElement "$(join_by $'\037' "${strArrayDocumentExecFrames[@]}")" "$intExecId" "$(StageL_printArr "$(join_by $'\037' "${intArrayWipFrame[@]}")")"
    StageL_renderDrawContents "$(StageL_dcaToFormat "$(StageL_getEnvPreferredFormat )" "$(StageL_getCurrentExecFrame "$intExecId")")"

    StageL_internalDebugStackExit;
}

runTestsDocumentExec() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsDocumentExec:document-exec-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'documentExec'
    StageL_runExecTest "$boolV" 'at-comment-no-space' '10'
    StageL_runExecTest "$boolV" 'at-comment' '10'
    StageL_runExecTest "$boolV" 'at-nl' '10'
    StageL_runExecTest "$boolV" 'at-space-nl' '10'
    StageL_runExecTest "$boolV" 'hello-world' '100'

    StageL_internalDebugStackExit;
}

runExecTest() {
    boolV="$1"; shift; strTestName="$1"; shift; intTicksNeeded="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugCollect "str TestName = $strTestName; "; StageL_internalDebugCollect "int TicksNeeded = $intTicksNeeded; "; StageL_internalDebugStackEnter 'runExecTest:document-exec-tests'; StageL_assertIsBool "$boolV"; StageL_assertIsStr "$strTestName"; StageL_assertIsInt "$intTicksNeeded"

    intExecId='0'
    intExecId="$(StageL_runDocumentPrepare "$(StageL_loadStoredDocument 'sems' "$(StageL_cat 'exec-tests/' "$(StageL_cat "$strTestName" '.sems')")")")"
    StageL_setExecOption "$intExecId" 'stopExecAtTick' "$(StageL_strFrom "$intTicksNeeded")"
    StageL_setExecOption "$intExecId" 'runHeadless' 'true'
    StageL_runDocumentGo "$intExecId"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(StageL_getCurrentExecFrame "$intExecId")" "$(StageL_loadStoredDocument 'sems' "$(StageL_cat 'exec-tests/' "$(StageL_cat "$strTestName" '.out.sems')")")")"

    StageL_internalDebugStackExit;
}

runTestsDcData() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsDcData:dc-data-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'dcData'
    StageL_runTest "$boolV" "$(StageL_eq 'B' "$(StageL_dcGetBidiClass '120')")"

    StageL_internalDebugStackExit;
}

isDc() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'isDc:format-dc'; StageL_assertIsGeneric "$genericIn"

    if [[ "true" == "$(StageL_not "$(StageL_isInt "$genericIn")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intNum='0'
    intNum="$genericIn"
    boolRes='false'
    boolRes="$(StageL_isNonnegative "$intNum")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isKnownDc() {
    genericIn="$1"; shift; StageL_internalDebugCollect "generic In = $genericIn; "; StageL_internalDebugStackEnter 'isKnownDc:format-dc'; StageL_assertIsGeneric "$genericIn"

    if [[ "true" == "$(StageL_not "$(StageL_isDc "$genericIn")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    if [[ "true" == "$(StageL_gt "$genericIn" "$(StageL_maximumKnownDc )")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

maximumKnownDc() {
    StageL_internalDebugStackEnter 'maximumKnownDc:format-dc'; 

    strRes=''
    strRes="$(StageL_dcDatasetLength 'DcData')"

    intReturn="$strRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

dcIsNewline() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcIsNewline:format-dc'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    # This function returns whether a character should be treated as a newline, in general. Individual characters may have more complex or ambiguous meanings (see details in DcData.csv), but this is useful as a general guide.
    # We can't just use:
    #if eq 'B' dcGetBidiClass n/dc
    #    return true
    # because that means "Paragraph_Separator" bidi class, and includes some things that really shouldn't be considered newlines from what I can tell (information separator two through four), and does not include some things that are (U+2028 Line Separator).
    if [[ "true" == "$(StageL_contains "$(join_by $'\037' '119' '120' '121' '240' '294' '295')" "$intDc")" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

dcIsSpace() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcIsSpace:format-dc'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    if [[ "true" == "$(StageL_eq 'Zs' "$(StageL_dcGetType "$intDc")")" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

dcIsPrintable() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcIsPrintable:format-dc'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strType=''
    strType="$(StageL_dcGetType "$intDc")"
    strGeneralType=''
    strGeneralType="$(StageL_strChar "$strType" '0')"
    if [[ "true" == "$(StageL_or "$(StageL_eq 'Zl' "$strType")" "$(StageL_eq 'Zp' "$strType")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    if [[ "true" == "$(StageL_or "$(StageL_eq '!' "$strGeneralType")" "$(StageL_eq 'C' "$strGeneralType")")" ]]; then

        boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

dcIsELCode() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcIsELCode:format-dc'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    boolRes='false'
    boolRes="$(StageL_eq 'EL ' "$(StageL_substr "$(StageL_dcGetScript "$intDc")" '0' '3')")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

dcGetELClass() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetELClass:format-dc'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_substr "$(StageL_dcGetScript "$intDc")" '3' '-1')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcaFromFormat() {
    strInFormat="$1"; shift; IFS=$'\037' read -r -a intArrayContentBytes <<< "$1"; shift; StageL_internalDebugCollect "str InFormat = $strInFormat; "; StageL_internalDebugCollect "intArray ContentBytes = $intArrayContentBytes; "; StageL_internalDebugStackEnter 'dcaFromFormat:formats'; StageL_assertIsStr "$strInFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContentBytes[@]}")"

    StageL_assertIsSupportedInputFormat "$strInFormat"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayContentBytes[@]}")"
    intArrayRes=()
    if [[ "true" == "$(StageL_eq "$strInFormat" 'sems')" ]]; then
        intArrayRes="$(StageL_dcaFromSems "$(join_by $'\037' "${intArrayContentBytes[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strInFormat" 'integerList')" ]]; then
        intArrayRes="$(StageL_dcaFromIntegerList "$(join_by $'\037' "${intArrayContentBytes[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strInFormat" 'ascii')" ]]; then
        intArrayRes="$(StageL_dcaFromAscii "$(join_by $'\037' "${intArrayContentBytes[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strInFormat" 'asciiSafeSubset')" ]]; then
        intArrayRes="$(StageL_dcaFromAsciiSafeSubset "$(join_by $'\037' "${intArrayContentBytes[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strInFormat" 'utf8')" ]]; then
        intArrayRes="$(StageL_dcaFromUtf8 "$(join_by $'\037' "${intArrayContentBytes[@]}")")"
        else
        StageL_error "$(StageL_cat 'Unimplemented document parsing format: ' "$strInFormat")"
    fi
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToFormat() {
    strOutFormat="$1"; shift; IFS=$'\037' read -r -a intArrayDcArrayIn <<< "$1"; shift; StageL_internalDebugCollect "str OutFormat = $strOutFormat; "; StageL_internalDebugCollect "intArray DcArrayIn = $intArrayDcArrayIn; "; StageL_internalDebugStackEnter 'dcaToFormat:formats'; StageL_assertIsStr "$strOutFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcArrayIn[@]}")"

    StageL_assertIsSupportedOutputFormat "$strOutFormat"
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcArrayIn[@]}")"
    intArrayRes=()
    if [[ "true" == "$(StageL_eq "$strOutFormat" 'integerList')" ]]; then
        intArrayRes="$(StageL_dcaToIntegerList "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'ascii')" ]]; then
        intArrayRes="$(StageL_dcaToAscii "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'asciiSafeSubset')" ]]; then
        intArrayRes="$(StageL_dcaToAsciiSafeSubset "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'colorcoded')" ]]; then
        intArrayRes="$(StageL_dcaToColorcoded "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'utf8')" ]]; then
        intArrayRes="$(StageL_dcaToUtf8 "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'html')" ]]; then
        intArrayRes="$(StageL_dcaToHtml "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'htmlFragment')" ]]; then
        intArrayRes="$(StageL_dcaToHtmlFragment "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        else
        StageL_die "$(StageL_cat 'Unimplemented document render output format: ' "$strOutFormat")"
    fi
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

convertFormats() {
    strInFormat="$1"; shift; strOutFormat="$1"; shift; IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "str InFormat = $strInFormat; "; StageL_internalDebugCollect "str OutFormat = $strOutFormat; "; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'convertFormats:formats'; StageL_assertIsStr "$strInFormat"; StageL_assertIsStr "$strOutFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsSupportedInputFormat "$strInFormat"
    StageL_assertIsSupportedOutputFormat "$strOutFormat"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayOut=()
    intArrayOut="$(StageL_dcaToFormat "$strOutFormat" "$(StageL_dcaFromFormat "$strInFormat" "$(join_by $'\037' "${intArrayIn[@]}")")")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

getExportExtension() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getExportExtension:formats'; StageL_assertIsStr "$strFormat"

    # Produces the actual file extension to be used for a file exported in the given format, with the current configured format options.
    strRes=''
    if [[ "true" == "$(StageL_isSupportedCharEncoding "$strFormat")" ]]; then
        strRes="$(StageL_cat "$(StageL_getFormatExtension "$strFormat")" '.txt')"

        strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi
    strRes="$(StageL_getFormatExtension "$strFormat")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcToFormat() {
    strOutFormat="$1"; shift; intDc="$1"; shift; StageL_internalDebugCollect "str OutFormat = $strOutFormat; "; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcToFormat:formats'; StageL_assertIsStr "$strOutFormat"; StageL_assertIsInt "$intDc"

    # Output byte array for a single dc, or an empty array if no output is available. Only operates on one Dc at a time. Some formats may not need this; calling with them is an error and should cause an assertion failure.
    StageL_assertIsSupportedOutputFormat "$strOutFormat"
    StageL_assertIsDc "$intDc"
    intArrayRes=()
    strTemp=''
    if [[ "true" == "$(StageL_eq "$strOutFormat" 'utf8')" ]]; then
        strLookup=''
        strLookup="$(StageL_dcDataLookupById 'mappings/to/unicode' "$intDc" '1')"
        if [[ "true" == "$(StageL_excOrEmpty "$strLookup")" ]]; then
            strLookup="$(StageL_dcDataLookupByValue 'mappings/from/unicode' '1' "$intDc" '0')"
        fi
        if [[ "true" == "$(StageL_notExcep "$strLookup")" ]]; then
            intArrayRes="$(StageL_utf8BytesFromDecimalChar "$(StageL_hexToDec "$strLookup")")"
        fi
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'colorcoded')" ]]; then
        intArrayRes="$(StageL_dcToColorcoded "$intDc")"
        elif [[ "true" == "$(StageL_eq "$strOutFormat" 'html')" ]]; then
        strTemp="$(StageL_dcDataLookupById 'mappings/to/html' "$intDc" '1')"
        if [[ "true" == "$(StageL_strNonempty "$strTemp")" ]]; then
            intArrayRes="$(StageL_strToByteArray "$strTemp")"
                else
            strTemp="$(StageL_dcDataLookupByValue 'mappings/from/unicode' '1' "$intDc" '0')"
            if [[ "true" == "$(StageL_isBaseStr "$strTemp" '16')" ]]; then
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_utf8BytesFromDecimalChar "$(StageL_hexToDec "$strTemp")")")"
            fi
        fi
        else
        StageL_die "$(StageL_cat 'Unimplemented character output format: ' "$strOutFormat")"
    fi
    # Returns an empty array if the Dc isn't printable. I don't think it should be an error to call this for a nonprintable Dc.
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcFromFormat() {
    strInFormat="$1"; shift; IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "str InFormat = $strInFormat; "; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcFromFormat:formats'; StageL_assertIsStr "$strInFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    # Retrieve dc (as a one-element array) corresponding to the input data (input data for some formats may be expected as byte arrays, but not for others), or an empty array if no match. Only operates on one Dc at a time. Some formats (e.g. sems) don't need this; calling with them is an error and should cause an assertion failure.
    StageL_assertIsTrue "$(StageL_isSupportedInternalFormat "$strInFormat")"
    intArrayRes=()
    intDc='0'
    strTemp=''
    if [[ "true" == "$(StageL_or "$(StageL_eq "$strInFormat" 'ascii')" "$(StageL_eq "$strInFormat" 'unicode')")" ]]; then
        intC='0'
        intC="$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" '0')"
        if [[ "true" == "$(StageL_eq "$strInFormat" 'ascii')" ]]; then
            if [[ "true" == "$(StageL_not "$(StageL_isAsciiByte "$intC")")" ]]; then
                StageL_die "$(StageL_cat 'The character number ' "$(StageL_cat "$(StageL_strFrom "$intC")" ' is not a 7-bit ASCII character.')")"
            fi
        fi
        StageL_assertIsNonnegative "$intC"
        strTemp="$(StageL_dcDataLookupByValue 'mappings/from/unicode' '0' "$(StageL_decToHex "$intC")" '1')"
        if [[ "true" == "$(StageL_excep "$strTemp")" ]]; then
            StageL_warn "$(StageL_cat 'FIXME: save unmapped unicode char ' "$(StageL_strFrom "$intC")")"

            intArrayReturn=(  ); StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
        fi
        intDc="$(StageL_intFromIntStr "$strTemp")"
        else
        StageL_die "$(StageL_cat 'Unimplemented character source format: ' "$strInFormat")"
    fi
    intArrayRes="$(StageL_setElement "$(join_by $'\037' "${intArrayRes[@]}")" '0' "$intDc")"
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

importWarning() {
    intIndex="$1"; shift; strProblem="$1"; shift; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugCollect "str Problem = $strProblem; "; StageL_internalDebugStackEnter 'importWarning:formats'; StageL_assertIsInt "$intIndex"; StageL_assertIsStr "$strProblem"

    strWarning=''
    strWarning="$(StageL_cat 'A problem was encountered while importing at character ' "$(StageL_cat "$(StageL_strFrom "$intIndex")" "$(StageL_cat ': ' "$strProblem")")")"
    strArrayImportWarnings="$(StageL_push "$(join_by $'\037' "${strArrayImportWarnings[@]}")" "$strWarning")"
    StageL_warn "$strWarning"

    StageL_internalDebugStackExit;
}

exportWarning() {
    intIndex="$1"; shift; strProblem="$1"; shift; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugCollect "str Problem = $strProblem; "; StageL_internalDebugStackEnter 'exportWarning:formats'; StageL_assertIsInt "$intIndex"; StageL_assertIsStr "$strProblem"

    strWarning=''
    strWarning="$(StageL_cat 'A problem was encountered while exporting at character ' "$(StageL_cat "$(StageL_strFrom "$intIndex")" "$(StageL_cat ': ' "$strProblem")")")"
    strArrayExportWarnings="$(StageL_push "$(join_by $'\037' "${strArrayExportWarnings[@]}")" "$strWarning")"
    StageL_warn "$strWarning"

    StageL_internalDebugStackExit;
}

getImportWarnings() {
    StageL_internalDebugStackEnter 'getImportWarnings:formats'; 

    strArrayRes=()
    strArrayRes="$(join_by $'\037' "${strArrayImportWarnings[@]}")"
    strArrayImportWarnings=(  )

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getExportWarnings() {
    StageL_internalDebugStackEnter 'getExportWarnings:formats'; 

    strArrayRes=()
    strArrayRes="$(join_by $'\037' "${strArrayExportWarnings[@]}")"
    strArrayExportWarnings=(  )

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

exportWarningUnmappable() {
    intIndex="$1"; shift; intProblemDc="$1"; shift; StageL_internalDebugCollect "int Index = $intIndex; "; StageL_internalDebugCollect "int ProblemDc = $intProblemDc; "; StageL_internalDebugStackEnter 'exportWarningUnmappable:formats'; StageL_assertIsInt "$intIndex"; StageL_assertIsInt "$intProblemDc"

    StageL_exportWarning "$intIndex" "$(StageL_cat 'The character ' "$(StageL_cat "$(StageL_strFrom "$intProblemDc")" ' could not be represented in the chosen export format.')")"

    StageL_internalDebugStackExit;
}

listFormats() {
    StageL_internalDebugStackEnter 'listFormats:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcGetColumn 'formats' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

isFormat() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'isFormat:formats-data'; StageL_assertIsStr "$strFormat"

    boolRes='false'
    boolRes="$(StageL_in "$strFormat" "$(StageL_listFormats )")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

listInputFormats() {
    StageL_internalDebugStackEnter 'listInputFormats:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValueGreater 'formats' '3' '0' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

isSupportedInputFormat() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isSupportedInputFormat:formats-data'; StageL_assertIsStr "$strIn"

    boolRes='false'
    boolRes="$(StageL_contains "$(StageL_listInputFormats )" "$strIn")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

listInternalFormats() {
    StageL_internalDebugStackEnter 'listInternalFormats:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValue 'formats' '6' 'internal' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

isSupportedInternalFormat() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isSupportedInternalFormat:formats-data'; StageL_assertIsStr "$strIn"

    boolRes='false'
    boolRes="$(StageL_or "$(StageL_contains "$(StageL_listInputFormats )" "$strIn")" "$(StageL_contains "$(StageL_listInternalFormats )" "$strIn")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

listOutputFormats() {
    StageL_internalDebugStackEnter 'listOutputFormats:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValueGreater 'formats' '4' '0' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

isSupportedOutputFormat() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isSupportedOutputFormat:formats-data'; StageL_assertIsStr "$strIn"

    boolRes='false'
    boolRes="$(StageL_contains "$(StageL_listOutputFormats )" "$strIn")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

listCharEncodings() {
    StageL_internalDebugStackEnter 'listCharEncodings:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValue 'formats' '6' 'encoding' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

isSupportedCharEncoding() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isSupportedCharEncoding:formats-data'; StageL_assertIsStr "$strIn"

    # Specifically, is it a supported character encoding for the output environment.
    boolRes='false'
    boolRes="$(StageL_and "$(StageL_contains "$(StageL_listCharEncodings )" "$strIn")" "$(StageL_isSupportedOutputFormat "$strIn")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

listTerminalTypes() {
    StageL_internalDebugStackEnter 'listTerminalTypes:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValue 'formats' '6' 'terminal' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

isSupportedTerminalType() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isSupportedTerminalType:formats-data'; StageL_assertIsStr "$strIn"

    # Specifically, is it a supported terminal type for the output environment.
    boolRes='false'
    boolRes="$(StageL_and "$(StageL_contains "$(StageL_listTerminalTypes )" "$strIn")" "$(StageL_isSupportedOutputFormat "$strIn")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

listDocumentTransformations() {
    StageL_internalDebugStackEnter 'listDocumentTransformations:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValue 'formats' '6' 'transformation' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

listDataTypes() {
    StageL_internalDebugStackEnter 'listDataTypes:formats-data'; 

    strArrayRes=()
    strArrayRes="$(StageL_dcDataFilterByValue 'formats' '6' 'data' '1')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

listVariantsForFormat() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'listVariantsForFormat:formats-data'; StageL_assertIsStr "$strFormat"

    StageL_assertIsFormat "$strFormat"
    strNormalizedFmt=''
    strNormalizedFmt="$(StageL_normalizeFormat "$strFormat")"
    strArrayFormats=()
    strArrayFormats="$(StageL_listFormats )"
    intCount='0'
    intI='0'
    intCount="$(StageL_count "$(join_by $'\037' "${strArrayFormats[@]}")")"
    intI='0'
    strCandidateFmt=''
    strNormalizedVar=''
    strArrayRes=()
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        strCandidateFmtType="$(StageL_dcDataLookupById 'formats' "$intI" '6')"
        if [[ "true" == "$(StageL_eq 'v:' "$(StageL_substr "$strCandidateFmtType" '0' '2')")" ]]; then
            strCandidateFmtType="$(StageL_substr "$strCandidateFmtType" '3' '-1')"
            if [[ "true" == "$(StageL_in "$strCandidateFmtType" "$(join_by $'\037' 'unicodePua')")" ]]; then
                strCandidateFmtType='unicode'
            fi
            if [[ "true" == "$(StageL_eq "$strNormalizedFmt" "$strCandidateFmtType")" ]]; then
                strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$(StageL_dcDataLookupById 'formats' "$intI" '1')")"
            fi
        fi
        intI="$(StageL_add "$intI" '1')"
    done

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getFormatId() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatId:formats-data'; StageL_assertIsStr "$strFormat"

    StageL_assertIsFormat "$strFormat"
    intRes='0'
    intRes="$(StageL_intFromIntStr "$(StageL_dcDataLookupByValue 'formats' '1' "$strFormat" '0')")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

normalizeFormat() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'normalizeFormat:formats-data'; StageL_assertIsStr "$strFormat"

    StageL_assertIsFormat "$strFormat"
    if [[ "true" == "$(StageL_eq "$strFormat" 'utf8')" ]]; then

        strReturn='unicode'; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
    fi

    strReturn="$strFormat"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatName() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatName:formats-data'; StageL_assertIsStr "$strFormat"

    strRes=''
    strRes="$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '1')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatExtension() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatExtension:formats-data'; StageL_assertIsStr "$strFormat"

    strRes=''
    strRes="$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '2')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatImportSupport() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatImportSupport:formats-data'; StageL_assertIsStr "$strFormat"

    intRes='0'
    intRes="$(StageL_intFromIntStr "$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '3')")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

getFormatExportSupport() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatExportSupport:formats-data'; StageL_assertIsStr "$strFormat"

    intRes='0'
    intRes="$(StageL_intFromIntStr "$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '4')")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

getFormatTestsStatus() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatTestsStatus:formats-data'; StageL_assertIsStr "$strFormat"

    intRes='0'
    intRes="$(StageL_intFromIntStr "$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '5')")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

getFormatType() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatType:formats-data'; StageL_assertIsStr "$strFormat"

    strRes=''
    strRes="$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '6')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatLabel() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatLabel:formats-data'; StageL_assertIsStr "$strFormat"

    strRes=''
    strRes="$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '7')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatVariantTypes() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatVariantTypes:formats-data'; StageL_assertIsStr "$strFormat"

    strArrayRes=()
    strArrayRes="$(StageL_strSplit "$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '8')" ',')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getFormatComments() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatComments:formats-data'; StageL_assertIsStr "$strFormat"

    strRes=''
    strRes="$(StageL_dcDataLookupById 'formats' "$(StageL_getFormatId "$strFormat")" '9')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

formatIsVariant() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'formatIsVariant:formats-data'; StageL_assertIsStr "$strFormat"

    # Return true if the format is a variant of another format, rather than its own format.
    StageL_assertIsFormat "$strFormat"
    boolRes='false'
    boolRes="$(StageL_eq 'v:' "$(StageL_substr "$(StageL_getFormatType "$strFormat")" '0' '2')")"

    boolReturn="$strRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isVariantType() {
    strVariantType="$1"; shift; StageL_internalDebugCollect "str VariantType = $strVariantType; "; StageL_internalDebugStackEnter 'isVariantType:formats-data'; StageL_assertIsStr "$strVariantType"

    boolRes='false'
    boolRes="$(StageL_in "$strVariantType" "$(join_by $'\037' 'encoding' 'unicodePua')")"

    strReturn="$boolRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

formatGetVariantType() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'formatGetVariantType:formats-data'; StageL_assertIsStr "$strFormat"

    # Return the string indicating the type of format variant this is.
    StageL_assertIsTrue "$(StageL_formatIsVariant "$strFormat")"
    strRes=''
    strRes="$(StageL_substr "$(StageL_getFormatType "$strFormat")" '2' '-1')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

formatSupportsVariantType() {
    strFormat="$1"; shift; strVariantType="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str VariantType = $strVariantType; "; StageL_internalDebugStackEnter 'formatSupportsVariantType:formats-data'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strVariantType"

    StageL_assertIsFormat "$strFormat"
    boolRes='false'
    boolRes="$(StageL_in "$strVariantType" "$(StageL_getFormatVariantTypes "$strFormat")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

formatSupportsVariant() {
    strFormat="$1"; shift; strVariant="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Variant = $strVariant; "; StageL_internalDebugStackEnter 'formatSupportsVariant:formats-data'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strVariant"

    StageL_assertIsFormat "$strFormat"
    boolRes='false'
    boolRes="$(StageL_formatSupportsVariantType "$strFormat" "$(StageL_formatGetVariantType "$strVariant")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

getFormatMetricsType() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatMetricsType:formats-data'; StageL_assertIsStr "$strFormat"

    StageL_assertIsFormat "$strFormat"
    strRes=''
    strType=''
    strType="$(StageL_getFormatType "$strFormat")"
    strRes="$(StageL_cat 'complex-' "$strFormat")"
    if [[ "true" == "$(StageL_or "$(StageL_eq 'text' "$strType")" "$(StageL_in "$strType" "$(join_by $'\037' 'encoding' 'terminal')")")" ]]; then
        strRes='character'
        elif [[ "true" == "$(StageL_in "$strType" "$(join_by $'\037' )")" ]]; then
        strRes='pixel'
        elif [[ "true" == "$(StageL_in "$strType" "$(join_by $'\037' 'internal')")" ]]; then
        strRes="$(StageL_cat 'internal-' "$strFormat")"
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetMappingToFormat() {
    intDc="$1"; shift; strFormat="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'dcGetMappingToFormat:formats-data'; StageL_assertIsInt "$intDc"; StageL_assertIsStr "$strFormat"

    StageL_assertIsDc "$intDc"
    StageL_assertIsSupportedOutputFormat "$strFormat"
    strRes=''
    strRes="$(StageL_dcDataLookupById "$(StageL_cat 'mappings/to/' "$strFormat")" "$intDc" '1')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

# This is an attempt at packing arbitrary 32-bit unsigned? ints losslessly in a manner similar to UTF-8. For now, it is simply a wrapper around WTF-8 (UTF-8 but allowing unpaired surrogates). Consequently, it only supports a chunk of the 32 bit numbers. Later it can be extended to support all. Note that these functions take *signed* ints as input at least for the moment.

pack32() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'pack32:pack32'; StageL_assertIsInt "$intIn"

    intArrayRes=()
    intArrayRes="$(StageL_intArrayPackWtf8 "$intIn")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

unpack32() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'unpack32:pack32'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intRes='0'
    intRes="$(StageL_intUnpackWtf8 "$(join_by $'\037' "${intArrayIn[@]}")")"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

isPack32Char() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'isPack32Char:pack32'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    boolRes='false'
    boolRes="$(StageL_boolIsUnpackableWtf8 "$(join_by $'\037' "${intArrayIn[@]}")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

getSettingForFormat() {
    strFormat="$1"; shift; strDirection="$1"; shift; strSettingKey="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugCollect "str SettingKey = $strSettingKey; "; StageL_internalDebugStackEnter 'getSettingForFormat:formats-settings'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strDirection"; StageL_assertIsStr "$strSettingKey"

    # s/direction can be "in" for import settings or "out" for export settings.
    strArrayTemp=()
    strArrayTemp="$(StageL_getSettingsForFormat "$strFormat" "$strDirection")"
    strRes=''
    if [[ "true" == "$(StageL_contains "$(join_by $'\037' "${strArrayTemp[@]}")" "$strSettingKey")" ]]; then
        strRes="$(StageL_getNext "$(join_by $'\037' "${strArrayTemp[@]}")" "$(StageL_indexOf "$(join_by $'\037' "${strArrayTemp[@]}")" "$strSettingKey")")"
        else
        strRes=''
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getSettingsForFormat() {
    strFormat="$1"; shift; strDirection="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugStackEnter 'getSettingsForFormat:formats-settings'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strDirection"

    # Returns an array of setting key/value pairs. A format setting string looks like, which should be fairly parseable (keys and vals follow StageL ident naming rules): key1:val1,key2:val2,
    intFormatId='0'
    intFormatId="$(StageL_getFormatId "$strFormat")"
    strArrayRes=()
    if [[ "true" == "$(StageL_eq "$strDirection" 'in')" ]]; then
        strArrayRes="$(StageL_settingStringToArray "$(StageL_getImportSettings "$intFormatId")")"
        else
        strArrayRes="$(StageL_settingStringToArray "$(StageL_getExportSettings "$intFormatId")")"
    fi

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getEnabledVariantsForFormat() {
    strFormat="$1"; shift; strDirection="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugStackEnter 'getEnabledVariantsForFormat:formats-settings'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strDirection"

    strArrayRes=()
    strArrayRes="$(StageL_strSplit "$(StageL_getSettingForFormat "$strFormat" "$strDirection" 'variants')" ' ')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getPreferredLanguageForFormat() {
    strFormat="$1"; shift; strDirection="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugStackEnter 'getPreferredLanguageForFormat:formats-settings'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strDirection"

    strRes=''
    strRes="$(StageL_getEnvLanguage )"
    strArrayTemp=()
    strArrayTemp="$(StageL_getEnabledVariantsForFormat "$strFormat" "$strDirection")"
    intC='0'
    intC='0'
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayTemp[@]}")")"
    boolContinue='false'
    boolContinue='true'
    intItem='0'
    while [[ "true" == "$boolContinue" ]]; do
        if [[ "true" == "$(StageL_not "$(StageL_lt "$intC" "$(StageL_add '-1' "$intL")")")" ]]; then
            boolContinue='false'
        fi
        strItem="$(StageL_get "$(join_by $'\037' "${strArrayTemp[@]}")" "$intC")"
        if [[ "true" == "$(StageL_eq 'lang_' "$(StageL_substr "$strItem" '0' '5')")" ]]; then
            strRes="$strItem"
            boolContinue='false'
        fi
        intC="$(StageL_inc "$intC")"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getPreferredCodeLanguageForFormat() {
    strFormat="$1"; shift; strDirection="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugStackEnter 'getPreferredCodeLanguageForFormat:formats-settings'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strDirection"

    strRes=''
    strRes="$(StageL_getEnvCodeLanguage )"
    strArrayTemp=()
    strArrayTemp="$(StageL_getEnabledVariantsForFormat "$strFormat" "$strDirection")"
    intC='0'
    intC='0'
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${strArrayTemp[@]}")")"
    boolContinue='false'
    boolContinue='true'
    intItem='0'
    while [[ "true" == "$boolContinue" ]]; do
        if [[ "true" == "$(StageL_not "$(StageL_lt "$intC" "$(StageL_add '-1' "$intL")")")" ]]; then
            boolContinue='false'
        fi
        strItem="$(StageL_get "$(join_by $'\037' "${strArrayTemp[@]}")" "$intC")"
        if [[ "true" == "$(StageL_eq 'pl_' "$(StageL_substr "$strItem" '0' '3')")" ]]; then
            strRes="$(StageL_substr "$strItem" '3' '-1')"
            boolContinue='false'
        fi
        intC="$(StageL_inc "$intC")"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}
# setImportSettings/setExportSettings are platform implementation in environment

getImportSettings() {
    intFormatId="$1"; shift; StageL_internalDebugCollect "int FormatId = $intFormatId; "; StageL_internalDebugStackEnter 'getImportSettings:formats-settings'; StageL_assertIsInt "$intFormatId"

    strRes=''
    if [[ "true" == "$(StageL_lt "$intFormatId" "$(StageL_count "$(StageL_getImportSettingsArr )")")" ]]; then
        strRes="$(StageL_get "$(StageL_getImportSettingsArr )" "$intFormatId")"
        else
        strRes=''
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getExportSettings() {
    intFormatId="$1"; shift; StageL_internalDebugCollect "int FormatId = $intFormatId; "; StageL_internalDebugStackEnter 'getExportSettings:formats-settings'; StageL_assertIsInt "$intFormatId"

    strRes=''
    if [[ "true" == "$(StageL_lt "$intFormatId" "$(StageL_count "$(StageL_getExportSettingsArr )")")" ]]; then
        strRes="$(StageL_get "$(StageL_getExportSettingsArr )" "$intFormatId")"
        else
        strRes=''
    fi

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

pushImportSettings() {
    intFormatId="$1"; shift; strNewSettingString="$1"; shift; StageL_internalDebugCollect "int FormatId = $intFormatId; "; StageL_internalDebugCollect "str NewSettingString = $strNewSettingString; "; StageL_internalDebugStackEnter 'pushImportSettings:formats-settings'; StageL_assertIsInt "$intFormatId"; StageL_assertIsStr "$strNewSettingString"

    # Note that all import settings must be popped in the reverse of the order they were pushed (all formats' import settings share the same stack).
    StageL_setSharedState 'strArrayImportDeferredSettingsStack' "$(StageL_push "$(StageL_getSharedState 'strArrayImportDeferredSettingsStack')" "$(StageL_getImportSettings "$intFormatId")")"
    StageL_setImportSettings "$intFormatId" "$strNewSettingString"

    StageL_internalDebugStackExit;
}

pushExportSettings() {
    intFormatId="$1"; shift; strNewSettingString="$1"; shift; StageL_internalDebugCollect "int FormatId = $intFormatId; "; StageL_internalDebugCollect "str NewSettingString = $strNewSettingString; "; StageL_internalDebugStackEnter 'pushExportSettings:formats-settings'; StageL_assertIsInt "$intFormatId"; StageL_assertIsStr "$strNewSettingString"

    # Note that all export settings must be popped in the reverse of the order they were pushed (all formats' export settings share the same stack).
    StageL_setSharedState 'strArrayExportDeferredSettingsStack' "$(StageL_push "$(StageL_getSharedState 'strArrayExportDeferredSettingsStack')" "$(StageL_getExportSettings "$intFormatId")")"
    StageL_setExportSettings "$intFormatId" "$strNewSettingString"

    StageL_internalDebugStackExit;
}

popImportSettings() {
    intFormatId="$1"; shift; StageL_internalDebugCollect "int FormatId = $intFormatId; "; StageL_internalDebugStackEnter 'popImportSettings:formats-settings'; StageL_assertIsInt "$intFormatId"

    StageL_setImportSettings "$intFormatId" "$(StageL_get "$(StageL_getSharedState 'strArrayImportDeferredSettingsStack')" '-1')"
    StageL_setSharedState 'strArrayImportDeferredSettingsStack' "$(StageL_asSubset "$(StageL_getSharedState 'strArrayImportDeferredSettingsStack')" '0' '-2')"

    StageL_internalDebugStackExit;
}

popExportSettings() {
    intFormatId="$1"; shift; StageL_internalDebugCollect "int FormatId = $intFormatId; "; StageL_internalDebugStackEnter 'popExportSettings:formats-settings'; StageL_assertIsInt "$intFormatId"

    StageL_setExportSettings "$intFormatId" "$(StageL_get "$(StageL_getSharedState 'strArrayExportDeferredSettingsStack')" '-1')"
    StageL_setSharedState 'strArrayExportDeferredSettingsStack' "$(StageL_asSubset "$(StageL_getSharedState 'strArrayExportDeferredSettingsStack')" '0' '-2')"

    StageL_internalDebugStackExit;
}

settingStringToArray() {
    strSettings="$1"; shift; StageL_internalDebugCollect "str Settings = $strSettings; "; StageL_internalDebugStackEnter 'settingStringToArray:formats-settings'; StageL_assertIsStr "$strSettings"

    strArrayRes=()
    intCount="$(StageL_len "$strSettings")"
    intCounter='0'
    intCounter='0'
    strElem=''
    strState=''
    strState='key'
    strChar=''
    while [[ "true" == "$(StageL_lt "$intCounter" "$intCount")" ]]; do
        strChar="$(StageL_charAt "$strSettings" "$intCounter")"
        if [[ "true" == "$(StageL_eq "$strState" 'key')" ]]; then
            if [[ "true" == "$(StageL_eq "$strChar" ':')" ]]; then
                strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strElem")"
                strElem=''
                strState='val'
                        else
                strElem="$(StageL_cat "$strElem" "$strChar")"
            fi
                else
            if [[ "true" == "$(StageL_eq "$strChar" ',')" ]]; then
                strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$strElem")"
                strElem=''
                strState='key'
                        else
                strElem="$(StageL_cat "$strElem" "$strChar")"
            fi
        fi
        intCounter="$(StageL_add "$intCounter" '1')"
    done

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

settingArrayToString() {
    IFS=$'\037' read -r -a strArraySettings <<< "$1"; shift; StageL_internalDebugCollect "strArray Settings = $strArraySettings; "; StageL_internalDebugStackEnter 'settingArrayToString:formats-settings'; StageL_assertIsStrArray "$(join_by $'\037' "${strArraySettings[@]}")"

    strRes=''
    intCount="$(StageL_count "$(join_by $'\037' "${strArraySettings[@]}")")"
    intCounter='0'
    intCounter='0'
    strElem=''
    while [[ "true" == "$(StageL_lt "$intCounter" "$intCount")" ]]; do
        strElem="$(StageL_get "$(join_by $'\037' "${strArraySettings[@]}")" "$intCounter")"
        StageL_assertIsTrue "$(StageL_isValidIdent "$strElem")"
        if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intCounter" '2')")" ]]; then
            strRes="$(StageL_cat "$strRes" "$(StageL_cat "$strElem" ',')")"
                else
            strRes="$(StageL_cat "$strRes" "$(StageL_cat "$strElem" ':')")"
        fi
        intCounter="$(StageL_add "$intCounter" '1')"
    done

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

# Note that the Basenb formats provided here are different from the Base16b formats in the specification, due to what appears to be a bug in the specification (requiring the remainder length to be stored to decode the remainder correctly when it starts with a 0 bit and is not 16 bits long).

byteToIntBitArray() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'byteToIntBitArray:basenb-utf8'; StageL_assertIsInt "$intIn"

    StageL_assertIsByte "$intIn"
    intArrayRes=()
    strTemp=''
    strTemp="$(StageL_intToBaseStr "$intIn" '2')"
    intLen='0'
    intI='0'
    intLen="$(StageL_len "$strTemp")"
    intArrayZero=()
    intArrayZero=( '0' )
    while [[ "true" == "$(StageL_lt "$intI" "$intLen")" ]]; do
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$(StageL_strChar "$strTemp" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done
    while [[ "true" == "$(StageL_gt '8' "$(StageL_count "$(join_by $'\037' "${intArrayRes[@]}")")")" ]]; do
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayZero[@]}")" "$(join_by $'\037' "${intArrayRes[@]}")")"
    done
    StageL_assertIsIntBitArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

byteFromIntBitArray() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteFromIntBitArray:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsIntBitArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intRes='0'
    strTemp=''
    intLen='0'
    intI='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    while [[ "true" == "$(StageL_lt "$intI" "$intLen")" ]]; do
        strTemp="$(StageL_cat "$strTemp" "$(StageL_strFrom "$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done
    intRes="$(StageL_intFromBaseStr "$strTemp" '2')"
    StageL_assertIsByte "$intRes"

    intReturn="$intRes"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

byteArrayToIntBitArray() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayToIntBitArray:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayRes=()
    intLen='0'
    intI='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    while [[ "true" == "$(StageL_lt "$intI" "$intLen")" ]]; do
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_byteToIntBitArray "$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intI")")")"
        intI="$(StageL_add "$intI" '1')"
    done
    StageL_assertIsIntBitArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

byteArrayFromIntBitArray() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayFromIntBitArray:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsIntBitArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayRes=()
    intLen='0'
    intI='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    intArrayTemp=()
    while [[ "true" == "$(StageL_le "$intI" "$intLen")" ]]; do
        if [[ "true" == "$(StageL_and "$(StageL_eq '0' "$(StageL_mod "$intI" '8')" )" "$(StageL_not "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayTemp[@]}")")")")")" ]]; then
            intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_byteFromIntBitArray "$(join_by $'\037' "${intArrayTemp[@]}")")")"
            intArrayTemp=(  )
        fi
        if [[ "true" == "$(StageL_lt "$intI" "$intLen")" ]]; then
            intArrayTemp="$(StageL_push "$(join_by $'\037' "${intArrayTemp[@]}")" "$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intI")")"
        fi
        intI="$(StageL_add "$intI" '1')"
    done
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

isBasenbBase() {
    intBase="$1"; shift; StageL_internalDebugCollect "int Base = $intBase; "; StageL_internalDebugStackEnter 'isBasenbBase:basenb-utf8'; StageL_assertIsInt "$intBase"

    boolRes='false'
    boolRes="$(StageL_intIsBetween "$intBase" '7' '17')"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isBasenbChar() {
    IFS=$'\037' read -r -a intArrayUtf8Char <<< "$1"; shift; StageL_internalDebugCollect "intArray Utf8Char = $intArrayUtf8Char; "; StageL_internalDebugStackEnter 'isBasenbChar:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayUtf8Char[@]}")"

    boolRes='false'
    boolRes='false'
    if [[ "true" == "$(StageL_not "$(StageL_isPack32Char "$(join_by $'\037' "${intArrayUtf8Char[@]}")")")" ]]; then

        boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intCodepoint='0'
    intCodepoint="$(StageL_unpack32 "$(join_by $'\037' "${intArrayUtf8Char[@]}")")"
    if [[ "true" == "$(StageL_intIsBetween "$intCodepoint" '983040' '1048573')" ]]; then
        boolRes='true'
        elif [[ "true" == "$(StageL_intIsBetween "$intCodepoint" '1048576' '1114109')" ]]; then
        boolRes='true'
        elif [[ "true" == "$(StageL_intIsBetween "$intCodepoint" '63481' '63501')" ]]; then
        boolRes='true'
    fi

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

isBasenbDistinctRemainderChar() {
    IFS=$'\037' read -r -a intArrayUtf8Char <<< "$1"; shift; StageL_internalDebugCollect "intArray Utf8Char = $intArrayUtf8Char; "; StageL_internalDebugStackEnter 'isBasenbDistinctRemainderChar:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayUtf8Char[@]}")"

    boolRes='false'
    boolRes='false'
    if [[ "true" == "$(StageL_not "$(StageL_isPack32Char "$(join_by $'\037' "${intArrayUtf8Char[@]}")")")" ]]; then

        boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi
    intCodepoint='0'
    intCodepoint="$(StageL_unpack32 "$(join_by $'\037' "${intArrayUtf8Char[@]}")")"
    if [[ "true" == "$(StageL_intIsBetween "$intCodepoint" '63481' '63497')" ]]; then
        boolRes='true'
    fi

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

byteArrayToBasenbUtf8() {
    intBase="$1"; shift; IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "int Base = $intBase; "; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayToBasenbUtf8:basenb-utf8'; StageL_assertIsInt "$intBase"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsTrue "$(StageL_isBasenbBase "$intBase")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayInputIntBitArray=()
    intArrayInputIntBitArray="$(StageL_byteArrayToIntBitArray "$(join_by $'\037' "${intArrayIn[@]}")")"
    intArrayRes=()
    intArrayRes="$(StageL_internalIntBitArrayToBasenbString "$intBase" "$(join_by $'\037' "${intArrayInputIntBitArray[@]}")")"
    # The remainder length also needs to be stored, to be able to decode successfully. We'll calculate, encode, and append it. It's always 4 bytes, 1 UTF-8 character, and 2 UTF-16 characters long, after encoding (it has 2 added to it to make it always be the same byte length and UTF-16 length; this must be subtracted before passing it to the Base16b.decode function).
    # Previous version, which doesn't provide clear end-of-character markers:
    # new an/remainder
    # set an/remainder push an/remainder add 2 mod count an/inputIntBitArray } 17
    # set an/res push an/res internalIntBitArrayToBasenbString 17 byteArrayToIntBitArray an/remainder
    intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_pack32 "$(StageL_sub '63497' "$(StageL_mod "$(StageL_count "$(join_by $'\037' "${intArrayInputIntBitArray[@]}")")" '17')")")")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

byteArrayFromBasenbUtf8() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayFromBasenbUtf8:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayRes=()
    # Extract remainder length
    intRemainder='0'
    intArrayRemainderArr=()
    # last 3 bytes (1 character), which represent the remainder
    intArrayRemainderArr="$(StageL_anSubset "$(join_by $'\037' "${intArrayIn[@]}")" '-3' '-1')"
    if [[ "true" == "$(StageL_not "$(StageL_isBasenbDistinctRemainderChar "$(join_by $'\037' "${intArrayRemainderArr[@]}")")")" ]]; then
        # last 4 bytes (1 character), which represent the remainder
        intArrayRemainderArr="$(StageL_anSubset "$(join_by $'\037' "${intArrayIn[@]}")" '-4' '-1')"
        intArrayRemainderDecodedArr=()
        intArrayRemainderDecodedArr="$(StageL_byteArrayFromIntBitArray "$(StageL_internalIntBitArrayFromBasenbString "$(join_by $'\037' "${intArrayRemainderArr[@]}")" '8')")"
        intRemainder="$(StageL_add '-2' "$(StageL_get "$(join_by $'\037' "${intArrayRemainderDecodedArr[@]}")" '0')")"
        else
        intRemainder="$(StageL_sub '63497' "$(StageL_unpack32 "$(join_by $'\037' "${intArrayRemainderArr[@]}")")")"
    fi
    if [[ "true" == "$(StageL_ngt "$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")" "$(StageL_count "$(join_by $'\037' "${intArrayRemainderArr[@]}")")")" ]]; then
        # All we have is a remainder, or a chunk of a character without a remainder, so return an exception UUID to represent the error (3362daa3-1705-40ec-9a97-59d052fd4037)
        intArrayRes=( '51' '98' '218' '163' '23' '5' '64' '236' '154' '151' '89' '208' '82' '253' '64' '55' )

        intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
    fi
    intArrayRes="$(StageL_byteArrayFromIntBitArray "$(StageL_internalIntBitArrayFromBasenbString "$(StageL_anSubset "$(join_by $'\037' "${intArrayIn[@]}")" '0' "$(StageL_add '-1' "$(StageL_mul '-1' "$(StageL_count "$(join_by $'\037' "${intArrayRemainderArr[@]}")")" )" )" )" "$intRemainder")")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

byteArrayToBase17bUtf8() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayToBase17bUtf8:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    # Convenience wrapper
    intArrayRes=()
    intArrayRes="$(StageL_byteArrayToBasenbUtf8 '17' "$(join_by $'\037' "${intArrayIn[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

byteArrayFromBase17bUtf8() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayFromBase17bUtf8:basenb-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    # Convenience wrapper
    intArrayRes=()
    intArrayRes="$(StageL_byteArrayFromBasenbUtf8 "$(join_by $'\037' "${intArrayIn[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

getArmoredUtf8EmbeddedStartUuid() {
    StageL_internalDebugStackEnter 'getArmoredUtf8EmbeddedStartUuid:basenb-utf8'; 

    # start UUID=e82eef60-19bc-4a00-a44a-763a3445c16f
    #new an/startUuid
    #set an/startUuid ( 232 46 239 96 25 188 74 0 164 74 118 58 52 69 193 111 )
    # byteArrayToIntBitArray([ 232, 46, 239, 96, 25, 188, 74, 0, 164, 74, 118, 58, 52, 69, 193, 111 ]).then(function(v){return new TextEncoder().encode(Base16b.encode(v, 17));}).then(function(v){console.log(v.toString());})
    # UTF8 in binary: 1,1,1,1,0,1,0,0,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,1,1,1,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,1,1,0,1,1,1,1,1,0,0,1,1,1,0,1,1,0,0,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,0,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0
    # Note that the remainder length for the encoded UUID is 9.
    intArrayStartUuidUtf8=()
    intArrayStartUuidUtf8=( '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' )

    intArrayReturn="$(join_by $'\037' "${intArrayStartUuidUtf8[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

getArmoredUtf8EmbeddedEndUuid() {
    StageL_internalDebugStackEnter 'getArmoredUtf8EmbeddedEndUuid:basenb-utf8'; 

    # end UUID=60bc936b-f10f-4f50-ab65-3778084060e2
    #new an/endUuid
    #set an/endUuid ( 96 188 147 107 241 15 79 80 171 101 55 120 8 64 96 226 )
    # byteArrayToIntBitArray([ 96, 188, 147, 107, 241, 15, 79, 80, 171, 101, 55, 120, 8, 64, 96, 226 ]).then(function(v){return new TextEncoder().encode(Base16b.encode(v, 17));}).then(function(v){console.log(v.toString());})
    intArrayEndUuidUtf8=()
    intArrayEndUuidUtf8=( '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157' )

    intArrayReturn="$(join_by $'\037' "${intArrayEndUuidUtf8[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}
#r/an/byteArrayToArmoredBase17bUtf8 an/in
#    assertIsByteArray an/in
#    new an/res
#    set an/res getArmoredBase17bUtf8StartUuid
#    set an/res append an/res eiteHostCall 'internalIntBitArrayToBase17bString' byteArrayToIntBitArray an/in
#    assertIsByteArray an/res
#    set an/res append an/res getArmoredBase17bUtf8EndUuid
#    return an/res
#r/an/byteArrayFromArmoredBase17bUtf8 an/in
#    assertIsByteArray an/in
#    new an/temp
#    set an/temp getArmoredBase17bUtf8StartUuid
#    assertIsTrue eq an/temp anSubset an/in 0 count an/temp
#    set an/temp getArmoredBase17bUtf8EndUuid
#    assertIsTrue eq an/temp anSubset an/in -1 sub -1 count an/temp
#    new an/res
#    set an/res eiteHostCall 'internalIntBitArrayFromBase17bString' an/in
#    assertIsByteArray an/res
#    return an/res

listDcDatasets() {
    StageL_internalDebugStackEnter 'listDcDatasets:dc-data'; 

    strArrayRes=()
    strArrayRes=( 'DcData' 'formats' 'mappings/from/ascii' 'mappings/from/unicode' 'mappings/to/html' 'mappings/to/lang_en' 'mappings/to/unicode' )

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

dcGetColumn() {
    strDataset="$1"; shift; intColumn="$1"; shift; StageL_internalDebugCollect "str Dataset = $strDataset; "; StageL_internalDebugCollect "int Column = $intColumn; "; StageL_internalDebugStackEnter 'dcGetColumn:dc-data'; StageL_assertIsStr "$strDataset"; StageL_assertIsInt "$intColumn"

    strArrayRes=()
    intCount='0'
    intCount="$(StageL_dcDatasetLength "$strDataset")"
    intI='0'
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        strArrayRes="$(StageL_push "$(join_by $'\037' "${strArrayRes[@]}")" "$(StageL_dcDataLookupById "$strDataset" "$intI" "$intColumn")")"
        intI="$(StageL_add "$intI" '1')"
    done

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getDcCount() {
    StageL_internalDebugStackEnter 'getDcCount:dc-data'; 

    intRes='0'
    intRes="$(StageL_dcDatasetLength 'DcData')"
}

isDcDataset() {
    strIn="$1"; shift; StageL_internalDebugCollect "str In = $strIn; "; StageL_internalDebugStackEnter 'isDcDataset:dc-data'; StageL_assertIsStr "$strIn"

    boolRes='false'
    boolRes="$(StageL_contains "$(StageL_listDcDatasets )" "$strIn")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

dcGetField() {
    intDc="$1"; shift; intFieldNumber="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugCollect "int FieldNumber = $intFieldNumber; "; StageL_internalDebugStackEnter 'dcGetField:dc-data'; StageL_assertIsInt "$intDc"; StageL_assertIsInt "$intFieldNumber"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcDataLookupById 'DcData' "$intDc" "$intFieldNumber")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetName() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetName:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '1')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetCombiningClass() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetCombiningClass:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '2')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetBidiClass() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetBidiClass:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '3')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetCasing() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetCasing:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '4')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetType() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetType:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '5')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetScript() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetScript:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '6')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetComplexTraits() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetComplexTraits:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '7')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

dcGetDescription() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcGetDescription:dc-data'; StageL_assertIsInt "$intDc"

    StageL_assertIsDc "$intDc"
    strRes=''
    strRes="$(StageL_dcGetField "$intDc" '8')"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

runTestsPack32() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsPack32:pack32-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'pack32'
    StageL_runTest "$boolV" "$(StageL_eq '0' "$(StageL_unpack32 "$(StageL_pack32 '0')")")"
    StageL_runTest "$boolV" "$(StageL_eq '10' "$(StageL_unpack32 "$(StageL_pack32 '10')")")"
    StageL_runTest "$boolV" "$(StageL_eq '100' "$(StageL_unpack32 "$(StageL_pack32 '100')")")"
    StageL_runTest "$boolV" "$(StageL_eq '1000' "$(StageL_unpack32 "$(StageL_pack32 '1000')")")"
    StageL_runTest "$boolV" "$(StageL_eq '10000' "$(StageL_unpack32 "$(StageL_pack32 '10000')")")"

    StageL_internalDebugStackExit;
}

runTestsFormatDc() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatDc:format-dc-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatDc'
    StageL_runTest "$boolV" "$(StageL_dcIsPrintable '21')"
    StageL_runTest "$boolV" "$(StageL_not "$(StageL_dcIsPrintable '231')")"
    StageL_runTest "$boolV" "$(StageL_dcIsNewline '120')"

    StageL_internalDebugStackExit;
}

runTestsFormatIntegerList() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatIntegerList:format-integerlist-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatIntegerList'
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '1' '2')" "$(StageL_dcaFromIntegerList "$(join_by $'\037' '49' '32' '50')")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '49' '32' '50' '32')" "$(StageL_dcaToIntegerList "$(join_by $'\037' '1' '2')")")"

    StageL_internalDebugStackExit;
}

dcaFromElad() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dcaFromElad:format-elad'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayRes=()
    # FIXME: actually implement; make sure it doesn't recurse since elad parsing is needed to load language translation tables; presumably refactor logic into a separate routine and provide a separate routine for FromElad and FromEladWithoutLangSupport (if language support ever even ends up in the "From" parsers, where it makes little sense as it would only be guessing)...
    intArrayRes="$(StageL_dcaFromAscii "$(join_by $'\037' "${intArrayIn[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToElad() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dcaToElad:format-elad'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intArrayRes=()
    # FIXME: Implement
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToUtf8() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaToUtf8:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayContent[@]}")"
    intArrayRes=()
    intArrayToOutput=()
    intArrayToOutput="$(join_by $'\037' "${intArrayContent[@]}")"
    intArrayTemp=()
    intDcAtIndex='0'
    intArrayUnmappables=()
    intUnmappablesCount='0'
    intUnmappablesCounter='0'
    intArrayUnmappablesIntermediatePacked=()
    boolFoundAnyUnmappables='false'
    boolFoundAnyUnmappables='false'
    strArrayVariantSettings=()
    strArrayVariantSettings="$(StageL_utf8VariantSettings 'out')"
    boolDcBasenbEnabled='false'
    boolDcBasenbEnabled="$(StageL_contains "$(join_by $'\037' "${strArrayVariantSettings[@]}")" 'dcBasenb')"
    boolDcBasenbFragmentEnabled='false'
    boolDcBasenbFragmentEnabled="$(StageL_contains "$(join_by $'\037' "${strArrayVariantSettings[@]}")" 'dcBasenbFragment')"
    intArrayToOutput="$(StageL_dcPreprocessForFormat "$(join_by $'\037' "${intArrayToOutput[@]}")" 'utf8' 'out')"
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${intArrayToOutput[@]}")")"
    intC='0'
    intC='0'
    while [[ "true" == "$(StageL_le "$intC" "$intL")" ]]; do
        # Start by getting the character's UTF8 equivalent and putting it in an/temp. This might be empty, if the character can't be mapped to UTF8.
        if [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; then
            intDcAtIndex="$(StageL_get "$(join_by $'\037' "${intArrayToOutput[@]}")" "$intC")"
            intArrayTemp="$(StageL_dcToFormat 'utf8' "$intDcAtIndex")"
        fi
        # Could the character be mapped? If not, stick it in the unmappables array or warn as appropriate.
        if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayTemp[@]}")")")" ]]; then
            if [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; then
                if [[ "true" == "$boolDcBasenbEnabled" ]]; then
                    intArrayUnmappables="$(StageL_push "$(join_by $'\037' "${intArrayUnmappables[@]}")" "$intDcAtIndex")"
                                else
                    StageL_exportWarningUnmappable "$intC" "$intDcAtIndex"
                fi
            fi
        fi
        # If we've reached the end of the input string or the last character was mappable, convert the an/unmappables array to PUA characters and append that result to the output string
        if [[ "true" == "$boolDcBasenbEnabled" ]]; then
            if [[ "true" == "$(StageL_or "$(StageL_eq "$intC" "$intL")" "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayTemp[@]}")")")")" ]]; then
                intUnmappablesCount="$(StageL_count "$(join_by $'\037' "${intArrayUnmappables[@]}")")"
                if [[ "true" == "$(StageL_ne '0' "$intUnmappablesCount")" ]]; then
                    if [[ "true" == "$(StageL_not "$boolFoundAnyUnmappables")" ]]; then
                        if [[ "true" == "$(StageL_not "$boolDcBasenbFragmentEnabled")" ]]; then
                            intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_getArmoredUtf8EmbeddedStartUuid )")"
                        fi
                    fi
                    boolFoundAnyUnmappables='true'
                    # We've gotten to the end of a string of unmappable characters, so convert them to PUA characters
                    intUnmappablesCounter='0'
                    while [[ "true" == "$(StageL_lt "$intUnmappablesCounter" "$intUnmappablesCount")" ]]; do
                        # The packing method for this works basically like UTF8, where each character is mapped to a series of bytes. So, first get the bytearray for the character we're on. Each character should be packed separately, to make it easy to spot where one character ends and the next begins.
                        intArrayUnmappablesIntermediatePacked="$(StageL_append "$(join_by $'\037' "${intArrayUnmappablesIntermediatePacked[@]}")" "$(StageL_pack32 "$(StageL_get "$(join_by $'\037' "${intArrayUnmappables[@]}")" "$intUnmappablesCounter")")")"
                        intUnmappablesCounter="$(StageL_add "$intUnmappablesCounter" '1')"
                        intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_byteArrayToBase17bUtf8 "$(join_by $'\037' "${intArrayUnmappablesIntermediatePacked[@]}")")")"
                        intArrayUnmappablesIntermediatePacked=(  )
                    done
                    intArrayUnmappables=(  )
                    intArrayUnmappablesIntermediatePacked=(  )
                fi
            fi
        fi
        # Stick the current character onto the result array
        if [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; then
            intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(join_by $'\037' "${intArrayTemp[@]}")")"
        fi
        # and finally increment the loop counter
        intC="$(StageL_add "$intC" '1')"
    done
    if [[ "true" == "$(StageL_and "$boolDcBasenbEnabled" "$boolFoundAnyUnmappables")" ]]; then
        if [[ "true" == "$(StageL_not "$boolDcBasenbFragmentEnabled")" ]]; then
            intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_getArmoredUtf8EmbeddedEndUuid )")"
        fi
    fi
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaFromUtf8() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaFromUtf8:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    intArrayRes=()
    intArrayRemaining=()
    intArrayRemaining="$(join_by $'\037' "${intArrayContent[@]}")"
    intArrayTemp=()
    intArrayLatestChar=()
    intDcBasenbUuidMonitorState='0'
    intDcBasenbUuidMonitorState='0'
    intDcBasenbUuidMonitorReprocessNeededCount='0'
    intDcBasenbUuidMonitorReprocessNeededCount='0'
    strArrayVariantSettings=()
    strArrayVariantSettings="$(StageL_utf8VariantSettings 'in')"
    boolDcBasenbEnabled='false'
    boolDcBasenbEnabled="$(StageL_contains "$(join_by $'\037' "${strArrayVariantSettings[@]}")" 'dcBasenb')"
    boolInDcBasenbSection='false'
    boolInDcBasenbSection='false'
    if [[ "true" == "$boolDcBasenbEnabled" ]]; then
        boolInDcBasenbSection="$(StageL_contains "$(join_by $'\037' "${strArrayVariantSettings[@]}")" 'dcBasenbFragment')"
    fi
    intSkipThisChar='0'
    intSkipThisChar='0'
    intArrayCollectedDcBasenbChars=()
    intCollectedDcBasenbCharsCount='0'
    intCollectedDcBasenbCharsCounter='0'
    intArrayCurrentUnmappableChar=()
    intTempArrayCount='0'
    while [[ "true" == "$(StageL_not "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")")")" ]]; do
        intArrayTemp=(  )
        intArrayLatestChar="$(StageL_pack32 "$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayRemaining[@]}")")")"
        if [[ "true" == "$boolDcBasenbEnabled" ]]; then
            # Dcbasenb is enabled, so process characters accordingly.
            if [[ "true" == "$(StageL_not "$boolInDcBasenbSection")" ]]; then
                # Not in a dcbasenb section, so look out for the UUID in case we run into one
                # All this code down to "(End of code section)" is only looking for UUIDs, and can mostly be disregarded for purposes of understanding the decoder logic.
                # 8 characters for uuid. Probably a better way to do this but oh well. Got them with new TextEncoder().encode('[char]'); etc.
                if [[ "true" == "$(StageL_ne '0' "$intDcBasenbUuidMonitorReprocessNeededCount")" ]]; then
                    # We're reprocessing potential UUID chars that didn't match a UUID after all, so don't check them for being a UUID. FIXME: Non-UUID char being reprocessed followed by 244 141 129 157 etc. (a potential UUID) would NOT be checked to be a UUID here. It should handle correctly the situation where there's potential but not a UUID, followed by potential and is a UUID, overlapping, like that.
                    intDcBasenbUuidMonitorReprocessNeededCount="$(StageL_sub "$intDcBasenbUuidMonitorReprocessNeededCount" '1')"
                                else
                    # Check for a UUID.
                    if [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '0')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '141' '129' '157')")" ]]; then
                            intDcBasenbUuidMonitorState='1'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '1')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '139' '182' '128')")" ]]; then
                            intDcBasenbUuidMonitorState='2'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '2')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '188' '183' '162')")" ]]; then
                            intDcBasenbUuidMonitorState='3'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '3')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '186' '128' '138')")" ]]; then
                            intDcBasenbUuidMonitorState='4'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '4')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '184' '165' '142')")" ]]; then
                            intDcBasenbUuidMonitorState='5'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '5')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '136' '186' '141')")" ]]; then
                            intDcBasenbUuidMonitorState='6'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '6')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '178' '139' '160')")" ]]; then
                            intDcBasenbUuidMonitorState='7'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '7')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '143' '186' '144')")" ]]; then
                            intDcBasenbUuidMonitorState='0'
                            intArrayLatestChar=(  )
                            boolInDcBasenbSection='true'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                    fi
                    if [[ "true" == "$(StageL_ne '0' "$intDcBasenbUuidMonitorReprocessNeededCount")" ]]; then
                        # It's necessary to reprocess the number of bytes that were consumed while checking for a UUID
                        intTempArrayCount="$(StageL_sub "$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")" "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")")"
                        intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayContent[@]}")" "$intTempArrayCount" "$(StageL_add "$intTempArrayCount" "$(StageL_mul '4' "$intDcBasenbUuidMonitorReprocessNeededCount")")")"
                    fi
                fi
                        else
                # Dcbasenb support is enabled, and we're inside a dcbasenb region. Process chars accordingly.
                if [[ "true" == "$(StageL_ne '0' "$intDcBasenbUuidMonitorReprocessNeededCount")" ]]; then
                    # Reprocessing non-UUID chars that could have been a UUID. Again, FIXME same as for the start UUID reprocessing bug mentioned in the earlier FIXME.
                    intDcBasenbUuidMonitorReprocessNeededCount="$(StageL_sub "$intDcBasenbUuidMonitorReprocessNeededCount" '1')"
                                else
                    # Look for a dcbasenb region end UUID.
                    if [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '0')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '188' '133' '185')")" ]]; then
                            intDcBasenbUuidMonitorState='1'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '1')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '180' '182' '175')")" ]]; then
                            intDcBasenbUuidMonitorState='2'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '2')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '136' '161' '186')")" ]]; then
                            intDcBasenbUuidMonitorState='3'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '3')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '191' '148' '138')")" ]]; then
                            intDcBasenbUuidMonitorState='4'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '4')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '134' '178' '166')")" ]]; then
                            intDcBasenbUuidMonitorState='5'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '5')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '141' '184' '130')")" ]]; then
                            intDcBasenbUuidMonitorState='6'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '6')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '243' '178' '128' '176')")" ]]; then
                            intDcBasenbUuidMonitorState='7'
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                                        elif [[ "true" == "$(StageL_eq "$intDcBasenbUuidMonitorState" '7')" ]]; then
                        if [[ "true" == "$(StageL_arrEq "$(join_by $'\037' "${intArrayLatestChar[@]}")" "$(join_by $'\037' '244' '143' '188' '157')")" ]]; then
                            intDcBasenbUuidMonitorState='0'
                            intArrayLatestChar=(  )
                            boolInDcBasenbSection='false'
                            # Handle any remaining collected DcBasenb characters
                            if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")")" ]]; then
                                intArrayCollectedDcBasenbChars="$(StageL_byteArrayFromBase17bUtf8 "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")"
                                if [[ "true" == "$(StageL_excepArr "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")" ]]; then
                                    StageL_importWarning "$(StageL_sub "$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")" "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")" )" 'An invalid base17b UTF8 input was encountered. Probably it was incorrectly truncated.'
                                    intArrayCollectedDcBasenbChars=(  )
                                fi
                                intCollectedDcBasenbCharsCount="$(StageL_count "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")"
                                intCollectedDcBasenbCharsCounter='0'
                                while [[ "true" == "$(StageL_lt "$intCollectedDcBasenbCharsCounter" "$intCollectedDcBasenbCharsCount")" ]]; do
                                    intArrayCurrentUnmappableChar="$(StageL_utf8BytesFromDecimalChar "$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")")"
                                    intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_unpack32 "$(join_by $'\037' "${intArrayCurrentUnmappableChar[@]}")")")"
                                    intCollectedDcBasenbCharsCounter="$(StageL_add "$intCollectedDcBasenbCharsCounter" "$(StageL_count "$(join_by $'\037' "${intArrayCurrentUnmappableChar[@]}")")")"
                                done
                                intArrayCollectedDcBasenbChars=(  )
                            fi
                                                else
                            intDcBasenbUuidMonitorReprocessNeededCount="$intDcBasenbUuidMonitorState"
                            intDcBasenbUuidMonitorState='0'
                        fi
                    fi
                    if [[ "true" == "$(StageL_ne '0' "$intDcBasenbUuidMonitorReprocessNeededCount")" ]]; then
                        # It's necessary to reprocess the number of bytes that were consumed while checking for a UUID
                        intTempArrayCount="$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")"
                        intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayContent[@]}")" "$intTempArrayCount" "$(StageL_add "$intTempArrayCount" "$(StageL_mul '4' "$intDcBasenbUuidMonitorReprocessNeededCount")")")"
                    fi
                fi
                # (End of code section) (see explanation above)
            fi
            if [[ "true" == "$(StageL_eq '0' "$intDcBasenbUuidMonitorState")" ]]; then
                # Process the current character: if we're in a dcbasenb section, check if it is a dcbasenb character and collect it for decoding. Otherwise, decode the preceding run of dcbasenb chars as a chunk and append that to the result.
                if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayLatestChar[@]}")")")" ]]; then
                    # There is a latest char (latestChar has more than 0 elems), so work on it
                    if [[ "true" == "$(StageL_and "$boolInDcBasenbSection" "$(StageL_and "$(StageL_isBasenbChar "$(join_by $'\037' "${intArrayLatestChar[@]}")")" "$(StageL_not "$(StageL_isBasenbDistinctRemainderChar "$(join_by $'\037' "${intArrayLatestChar[@]}")")")")")" ]]; then
                        # The character is a dcbasenb char and we're in a dcbasenb section, so collect the character for decoding.
                        # Should decode each character as a single batch with the end of the run denoted by isBasenbDistinctRemainderChar, so don't match those here.
                        intArrayCollectedDcBasenbChars="$(StageL_append "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")" "$(join_by $'\037' "${intArrayLatestChar[@]}")")"
                        intSkipThisChar="$(StageL_count "$(join_by $'\037' "${intArrayLatestChar[@]}")")"
                                        else
                        # Not a basenb char (or not in a dcbasenb section), so decode the ones we've collected, if there are any
                        if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")")" ]]; then
                            if [[ "true" == "$(StageL_isBasenbDistinctRemainderChar "$(join_by $'\037' "${intArrayLatestChar[@]}")")" ]]; then
                                intArrayCollectedDcBasenbChars="$(StageL_push "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")" "$(join_by $'\037' "${intArrayLatestChar[@]}")")"
                            fi
                            intArrayCollectedDcBasenbChars="$(StageL_byteArrayFromBase17bUtf8 "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")"
                            if [[ "true" == "$(StageL_excepArr "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")" ]]; then
                                StageL_importWarning "$(StageL_sub "$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")" "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")" )" 'An invalid base17b UTF8 input was encountered. Probably it was incorrectly truncated.'
                                intArrayCollectedDcBasenbChars=(  )
                            fi
                            intCollectedDcBasenbCharsCount="$(StageL_count "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")"
                            intCollectedDcBasenbCharsCounter='0'
                            while [[ "true" == "$(StageL_lt "$intCollectedDcBasenbCharsCounter" "$intCollectedDcBasenbCharsCount")" ]]; do
                                intArrayCurrentUnmappableChar="$(StageL_utf8BytesFromDecimalChar "$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")")"
                                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_unpack32 "$(join_by $'\037' "${intArrayCurrentUnmappableChar[@]}")")")"
                                intCollectedDcBasenbCharsCounter="$(StageL_add "$intCollectedDcBasenbCharsCounter" "$(StageL_count "$(join_by $'\037' "${intArrayCurrentUnmappableChar[@]}")")")"
                            done
                            intArrayCollectedDcBasenbChars=(  )
                        fi
                    fi
                                else
                    # The latest char was the last char of a confirmed UUID.
                    intSkipThisChar='4'
                fi
            fi
        fi
        intTempArrayCount="$(StageL_count "$(join_by $'\037' "${intArrayLatestChar[@]}")")"
        if [[ "true" == "$(StageL_eq '0' "$intDcBasenbUuidMonitorState")" ]]; then
            # (We're not trying to spot a UUID right now: either the current char couldn't be one, or we confirmed it's not part of one and are re-processing this char.)
            if [[ "true" == "$(StageL_ne '0' "$intSkipThisChar")" ]]; then
                # The current character was a dcbasenb character, so it was stuck onto the collectedDcBasenbChars array and so we defer working on it until later. (Or, it was the last character of a confirmed UUID; either way, it doesn't get processed now.)
                intTempArrayCount="$intSkipThisChar"
                intSkipThisChar='0'
                        else
                # Not skipping the current char, so decode it from Unicode normally.
                intArrayTemp="$(join_by $'\037' "${intArrayLatestChar[@]}")"
                intArrayTempFromUnicode=()
                intArrayTempFromUnicode="$(StageL_dcFromFormat 'unicode' "$(join_by $'\037' "${intArrayTemp[@]}")")"
                if [[ "true" == "$(StageL_le '1' "$(StageL_count "$(join_by $'\037' "${intArrayTempFromUnicode[@]}")")")" ]]; then
                    if [[ "true" == "$(StageL_ne '-1' "$(StageL_get "$(join_by $'\037' "${intArrayTempFromUnicode[@]}")" '0')")" ]]; then
                        intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(join_by $'\037' "${intArrayTempFromUnicode[@]}")")"
                    fi
                fi
            fi
        fi
        # Place in an/remaining the substring of input that has not been processed yet.
        intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayRemaining[@]}")" "$intTempArrayCount" '-1')"
    done
    if [[ "true" == "$boolDcBasenbEnabled" ]]; then
        # Handle any remaining collected DcBasenb characters
        if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")")" ]]; then
            intArrayCollectedDcBasenbChars="$(StageL_byteArrayFromBase17bUtf8 "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")"
            if [[ "true" == "$(StageL_excepArr "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")" ]]; then
                StageL_importWarning "$(StageL_sub "$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")" "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")" )" 'An invalid base17b UTF8 input was encountered. Probably it was incorrectly truncated.'
                intArrayCollectedDcBasenbChars=(  )
            fi
            intCollectedDcBasenbCharsCount="$(StageL_count "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")"
            intCollectedDcBasenbCharsCounter='0'
            while [[ "true" == "$(StageL_lt "$intCollectedDcBasenbCharsCounter" "$intCollectedDcBasenbCharsCount")" ]]; do
                intArrayCurrentUnmappableChar="$(StageL_utf8BytesFromDecimalChar "$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayCollectedDcBasenbChars[@]}")")")"
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_unpack32 "$(join_by $'\037' "${intArrayCurrentUnmappableChar[@]}")")")"
                intCollectedDcBasenbCharsCounter="$(StageL_add "$intCollectedDcBasenbCharsCounter" "$(StageL_count "$(join_by $'\037' "${intArrayCurrentUnmappableChar[@]}")")")"
            done
        fi
    fi

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

utf8VariantSettings() {
    strDirection="$1"; shift; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugStackEnter 'utf8VariantSettings:format-utf8'; StageL_assertIsStr "$strDirection"

    strArrayRes=()
    strArrayRes="$(StageL_getEnabledVariantsForFormat 'utf8' "$strDirection")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

dcaFromUnicodeChar() {
    intChar="$1"; shift; StageL_internalDebugCollect "int Char = $intChar; "; StageL_internalDebugStackEnter 'dcaFromUnicodeChar:format-utf8'; StageL_assertIsInt "$intChar"

    # Takes a character number, not a byte array.
    intArrayRes=()
    intArrayTemp=()
    intArrayTemp="$(StageL_dcFromFormat 'unicode' "$(StageL_anFromN "$intChar")")"
    if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayTemp[@]}")")")" ]]; then
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_get "$(join_by $'\037' "${intArrayTemp[@]}")" '0')")"
    fi

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcToUnicodeCharArray() {
    intDc="$1"; shift; StageL_internalDebugCollect "int Dc = $intDc; "; StageL_internalDebugStackEnter 'dcToUnicodeCharArray:format-utf8'; StageL_assertIsInt "$intDc"

    # Returns a character number, not a byte array.
    intArrayRes=()
    intArrayTemp=()
    intArrayTemp="$(StageL_dcToFormat 'unicode' "$intDc")"
    if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayTemp[@]}")")")" ]]; then
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayTemp[@]}")")")"
    fi

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToDcbnbUtf8() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaToDcbnbUtf8:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    # convenience wrapper
    intArrayRes=()
    StageL_pushExportSettings "$(StageL_getFormatId 'utf8')" 'variants:dcBasenb,'
    intArrayRes="$(StageL_dcaToUtf8 "$(join_by $'\037' "${intArrayContent[@]}")")"
    StageL_popExportSettings "$(StageL_getFormatId 'utf8')"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaFromDcbnbUtf8() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaFromDcbnbUtf8:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    # convenience wrapper
    intArrayRes=()
    StageL_pushImportSettings "$(StageL_getFormatId 'utf8')" 'variants:dcBasenb,'
    intArrayRes="$(StageL_dcaFromUtf8 "$(join_by $'\037' "${intArrayContent[@]}")")"
    StageL_popImportSettings "$(StageL_getFormatId 'utf8')"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToDcbnbFragmentUtf8() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaToDcbnbFragmentUtf8:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    # convenience wrapper
    intArrayRes=()
    StageL_pushExportSettings "$(StageL_getFormatId 'utf8')" 'variants:dcBasenb dcBasenbFragment,skip_prefilter_semantic:,skip_prefilter_code:,'
    intArrayRes="$(StageL_dcaToUtf8 "$(join_by $'\037' "${intArrayContent[@]}")")"
    StageL_popExportSettings "$(StageL_getFormatId 'utf8')"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaFromDcbnbFragmentUtf8() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaFromDcbnbFragmentUtf8:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    # convenience wrapper
    intArrayRes=()
    StageL_pushImportSettings "$(StageL_getFormatId 'utf8')" 'variants:dcBasenb dcBasenbFragment,'
    intArrayRes="$(StageL_dcaFromUtf8 "$(join_by $'\037' "${intArrayContent[@]}")")"
    StageL_popImportSettings "$(StageL_getFormatId 'utf8')"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

utf8CharArrayFromByteArray() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'utf8CharArrayFromByteArray:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intArrayRes=()
    intArrayRemaining=()
    intArrayRemaining="$(join_by $'\037' "${intArrayIn[@]}")"
    intTemp='0'
    while [[ "true" == "$(StageL_lt '0' "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")")" ]]; do
        intTemp="$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayRemaining[@]}")")"
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$intTemp")"
        intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayRemaining[@]}")" "$(StageL_count "$(StageL_utf8BytesFromDecimalChar "$intTemp")" )" '-1')"
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

byteArrayFromUtf8CharArray() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'byteArrayFromUtf8CharArray:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intArrayRes=()
    intCount='0'
    intI='0'
    intCount="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    intI='0'
    while [[ "true" == "$(StageL_lt "$intI" "$intCount")" ]]; do
        intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_utf8BytesFromDecimalChar "$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intI")")")"
        intI="$(StageL_add '1' "$intI")"
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcbnbGetFirstChar() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dcbnbGetFirstChar:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    # Return the first character of a dcbnb string (doesn't do any conversion; returns dcbnb)
    intArrayRes=()
    if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")")" ]]; then

        intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
    fi
    boolContinue='false'
    boolContinue='true'
    intArrayNextUtf8=()
    intArrayRemaining=()
    intArrayRemaining="$(join_by $'\037' "${intArrayIn[@]}")"
    intTempArrayCount='0'
    while [[ "true" == "$boolContinue" ]]; do
        intArrayNextUtf8="$(StageL_pack32 "$(StageL_firstCharOfUtf8String "$(join_by $'\037' "${intArrayRemaining[@]}")")")"
        if [[ "true" == "$(StageL_not "$(StageL_isBasenbChar "$(join_by $'\037' "${intArrayNextUtf8[@]}")")")" ]]; then
            if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayRes[@]}")")")" ]]; then
                intArrayRes="$(join_by $'\037' "${intArrayNextUtf8[@]}")"
            fi
            boolContinue='false'
                else
            intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(join_by $'\037' "${intArrayNextUtf8[@]}")")"
            if [[ "true" == "$(StageL_isBasenbDistinctRemainderChar "$(join_by $'\037' "${intArrayNextUtf8[@]}")")" ]]; then
                boolContinue='false'
                        else
                intTempArrayCount="$(StageL_count "$(join_by $'\037' "${intArrayNextUtf8[@]}")")"
                intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayRemaining[@]}")" "$intTempArrayCount" '-1')"
            fi
        fi
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcbnbGetLastChar() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dcbnbGetLastChar:format-utf8'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    # Return the last character of a dcbnb string (doesn't do any conversion; returns dcbnb)
    intArrayRes=()
    if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")")" ]]; then

        intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
    fi
    boolContinue='false'
    boolContinue='true'
    intArrayNextUtf8=()
    intArrayRemaining=()
    intArrayRemaining="$(join_by $'\037' "${intArrayIn[@]}")"
    intTempArrayCount='0'
    intTempArrayCount='0'
    boolPastFirstBasenbRemainderChar='false'
    boolPastFirstBasenbRemainderChar='false'
    while [[ "true" == "$boolContinue" ]]; do
        if [[ "true" == "$(StageL_ne '0' "$(StageL_count "$(join_by $'\037' "${intArrayRemaining[@]}")")")" ]]; then
            intArrayNextUtf8="$(StageL_pack32 "$(StageL_lastCharOfUtf8String "$(join_by $'\037' "${intArrayRemaining[@]}")")")"
                else
            intArrayNextUtf8=(  )
        fi
        if [[ "true" == "$(StageL_not "$(StageL_isBasenbChar "$(join_by $'\037' "${intArrayNextUtf8[@]}")")")" ]]; then
            if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayRes[@]}")")")" ]]; then
                intArrayRes="$(join_by $'\037' "${intArrayNextUtf8[@]}")"
            fi
            boolContinue='false'
                else
            if [[ "true" == "$(StageL_isBasenbDistinctRemainderChar "$(join_by $'\037' "${intArrayNextUtf8[@]}")")" ]]; then
                if [[ "true" == "$boolPastFirstBasenbRemainderChar" ]]; then
                    boolContinue='false'
                                else
                    intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayNextUtf8[@]}")" "$(join_by $'\037' "${intArrayRes[@]}")")"
                    intTempArrayCount="$(StageL_count "$(join_by $'\037' "${intArrayNextUtf8[@]}")")"
                    intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayRemaining[@]}")" '0' "$(StageL_add '-1' "$(StageL_mul '-1' "$intTempArrayCount")")")"
                    boolPastFirstBasenbRemainderChar='true'
                fi
                        else
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayNextUtf8[@]}")" "$(join_by $'\037' "${intArrayRes[@]}")")"
                intTempArrayCount="$(StageL_count "$(join_by $'\037' "${intArrayNextUtf8[@]}")")"
                intArrayRemaining="$(StageL_anSubset "$(join_by $'\037' "${intArrayRemaining[@]}")" '0' "$(StageL_add '-1' "$(StageL_mul '-1' "$intTempArrayCount")")")"
            fi
        fi
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToHtmlFragment() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToHtmlFragment:format-htmlFragment'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    intArrayOut=()
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '<div style="white-space:pre-wrap">')")"
    intLen='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayDcIn[@]}")")"
    intInputIndex='0'
    intInputIndex='0'
    intDcAtIndex='0'
    while [[ "true" == "$(StageL_lt "$intInputIndex" "$intLen")" ]]; do
        intDcAtIndex="$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")"
        intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_dcToFormat 'html' "$intDcAtIndex")")"
        intInputIndex="$(StageL_add "$intInputIndex" '1')"
    done
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '</div>')")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

runTestsFormatHtmlFragment() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatHtmlFragment:format-htmlFragment-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatHtmlFragment'
    StageL_runTest "$boolV" "$(StageL_arrEq "$(StageL_strToByteArray '<div style="white-space:pre-wrap">5&lt;6</div>')" "$(StageL_dcaToHtmlFragment "$(join_by $'\037' '39' '46' '40')")")"

    StageL_internalDebugStackExit;
}

dcaFromAscii() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaFromAscii:format-ascii'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayContent[@]}")"
    intArrayRes=()
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")"
    intC='0'
    intC='0'
    while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
        intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_dcFromFormat 'ascii' "$(StageL_anFromN "$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" "$intC")")")")"
        intC="$(StageL_add "$intC" '1')"
    done
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToAscii() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaToAscii:format-ascii'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayContent[@]}")"
    intArrayRes=()
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")"
    intC='0'
    intC='0'
    intArrayTemp=()
    intDcAtIndex='0'
    while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
        intDcAtIndex="$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" "$intC")"
        intArrayTemp="$(StageL_dcToFormat 'utf8' "$intDcAtIndex")"
        if [[ "true" == "$(StageL_arrNonempty "$(join_by $'\037' "${intArrayTemp[@]}")")" ]]; then
            if [[ "true" == "$(StageL_isAsciiByte "$(StageL_get "$(join_by $'\037' "${intArrayTemp[@]}")" '0')")" ]]; then
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(join_by $'\037' "${intArrayTemp[@]}")")"
                        else
                StageL_exportWarningUnmappable "$intC" "$intDcAtIndex"
            fi
                else
            StageL_exportWarningUnmappable "$intC" "$intDcAtIndex"
        fi
        intC="$(StageL_add "$intC" '1')"
    done
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

isAsciiByte() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'isAsciiByte:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_intIsBetween "$intN" '0' '127')"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsDigit() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsDigit:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_intIsBetween "$intN" '48' '57')"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsPrintable() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsPrintable:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_intIsBetween "$intN" '32' '126')"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsSpace() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsSpace:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_eq "$intN" '32')"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsNewline() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsNewline:format-ascii'; StageL_assertIsInt "$intN"

    boolT1='false'
    boolT1="$(StageL_eq "$intN" '10')"
    boolT2='false'
    boolT2="$(StageL_or "$boolT1" "$(StageL_eq "$intN" '13')")"

    boolReturn="$boolT2"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsLetterUpper() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsLetterUpper:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_intIsBetween "$intN" '65' '90')"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsLetterLower() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsLetterLower:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_intIsBetween "$intN" '97' '122')"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsLetter() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsLetter:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_asciiIsLetterLower "$intN")"
    boolTemp="$(StageL_or "$boolTemp" "$(StageL_asciiIsLetterUpper "$intN")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

asciiIsAlphanum() {
    intN="$1"; shift; StageL_internalDebugCollect "int N = $intN; "; StageL_internalDebugStackEnter 'asciiIsAlphanum:format-ascii'; StageL_assertIsInt "$intN"

    boolTemp='false'
    boolTemp="$(StageL_asciiIsLetter "$intN")"
    boolTemp="$(StageL_or "$boolTemp" "$(StageL_asciiIsDigit "$intN")")"

    boolReturn="$boolTemp"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

crlf() {
    StageL_internalDebugStackEnter 'crlf:format-ascii'; 

    intArrayTemp=()
    intArrayTemp=( '13' '10' )

    intArrayReturn="$(join_by $'\037' "${intArrayTemp[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}
# 0  NUL    16 DLE    32 SP   48 0    64 @    80 P    96  `    112 p
# 1  SOH    17 DC1    33 !    49 1    65 A    81 Q    97  a    113 q
# 2  STX    18 DC2    34 "    50 2    66 B    82 R    98  b    114 r
# 3  ETX    19 DC3    35 #    51 3    67 C    83 S    99  c    115 s
# 4  EOT    20 DC4    36 $    52 4    68 D    84 T    100 d    116 t
# 5  ENQ    21 NAK    37 %    53 5    69 E    85 U    101 e    117 u
# 6  ACK    22 SYN    38 &    54 6    70 F    86 V    102 f    118 v
# 7  BEL    23 ETB    39 '    55 7    71 G    87 W    103 g    119 w
# 8  BS     24 CAN    40 (    56 8    72 H    88 X    104 h    120 x
# 9  HT     25 EM     41 )    57 9    73 I    89 Y    105 i    121 y
# 10 LF     26 SUB    42 *    58 :    74 J    90 Z    106 j    122 z
# 11 VT     27 ESC    43 +    59 ;    75 K    91 [    107 k    123 {
# 12 FF     28 FS     44 ,    60 <    76 L    92 \    108 l    124 |
# 13 CR     29 GS     45 -    61 =    77 M    93 ]    109 m    125 }
# 14 SO     30 RS     46 .    62 >    78 N    94 ^    110 n    126 ~
# 15 SI     31 US     47 /    63 ?    79 O    95 _    111 o    127 DEL

runTestsFormatSems() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatSems:format-sems-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatSems'
    # No trailing space, will fail in strict mode.
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '1' '2')" "$(StageL_dcaFromSems "$(join_by $'\037' '49' '32' '50')")")"
    # Should fail but I don't have a way to test to ensure failure yet: runTest b/v arrEq ( 1 2 ) dcaFromSems ( 49 32 32 50 )
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '49' '32' '50' '32' '13' '10')" "$(StageL_dcaToSems "$(join_by $'\037' '1' '2')")")"
    # Comment preservation
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '1' '2' '246' '50' '248')" "$(StageL_dcaFromSems "$(join_by $'\037' '49' '32' '50' '35' '65')")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '49' '32' '50' '32' '35' '65' '13' '10')" "$(StageL_dcaToSems "$(join_by $'\037' '1' '2' '246' '50' '248')")")"
    # Currently doesn't output the 65 in the desired result (FIXME not implemented)
    # UTF-8 comments
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '256' '258' '260' '262' '264' '263' '57' '86' '93' '93' '96' '30' '18' '286' '72' '96' '99' '93' '85' '287' '19' '18' '284' '261' '259' '246' '18' '100' '82' '106' '18' '20' '57' '86' '93' '93' '96' '30' '18' '33' '72' '96' '99' '93' '85' '33' '19' '18' '281' '20' '248' '1' '2' '246' '18' '281' '248')" "$(StageL_dcaFromSems "$(join_by $'\037' '50' '53' '54' '32' '50' '53' '56' '32' '50' '54' '48' '32' '50' '54' '50' '32' '50' '54' '52' '32' '50' '54' '51' '32' '53' '55' '32' '56' '54' '32' '57' '51' '32' '57' '51' '32' '57' '54' '32' '51' '48' '32' '49' '56' '32' '50' '56' '54' '32' '55' '50' '32' '57' '54' '32' '57' '57' '32' '57' '51' '32' '56' '53' '32' '50' '56' '55' '32' '49' '57' '32' '49' '56' '32' '50' '56' '52' '32' '50' '54' '49' '32' '50' '53' '57' '32' '35' '32' '115' '97' '121' '32' '34' '72' '101' '108' '108' '111' '44' '32' '47' '87' '111' '114' '108' '100' '47' '33' '32' '226' '154' '189' '34' '10' '49' '32' '50' '32' '35' '32' '226' '154' '189' '10')")")"

    StageL_internalDebugStackExit;
}

runTestsFormatAscii() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatAscii:format-ascii-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatAscii'
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '0' '212' '120' '216' '221' '226' '231' '21' '26')" "$(StageL_dcaFromAscii "$(join_by $'\037' '0' '5' '10' '15' '20' '25' '30' '35' '40')")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '0' '5' '10' '15' '20' '25' '30' '35' '40')" "$(StageL_dcaToAscii "$(join_by $'\037' '0' '212' '120' '216' '291' '221' '226' '231' '21' '26')")")"

    StageL_internalDebugStackExit;
}

dcaToHtml() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToHtml:format-html'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    intArrayOut=()
    intArrayOut="$(StageL_strToByteArray '<!DOCTYPE html><html><head><title></title></head><body>')"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_dcaToHtmlFragment "$(join_by $'\037' "${intArrayDcIn[@]}")")")"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '</body></html>')")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

runTestsFormatUtf8() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatUtf8:format-utf8-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatUtf8'
    # FIXME: Update tests for new remainder character format.
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '35' '18' '36')" "$(StageL_dcaFromUtf8 "$(join_by $'\037' '49' '32' '50')")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '49' '32' '50')" "$(StageL_dcaToUtf8 "$(join_by $'\037' '35' '18' '36')")")"
    # Test for converting to UTF8+dcbnb with only one unmappable char at the end
    StageL_runTest "$boolV" "$(StageL_arrEq "$(StageL_append "$(join_by $'\037' '49' '32' '50')" "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedStartUuid )" "$(StageL_append "$(join_by $'\037' '244' '131' '173' '156' '239' '159' '185')" "$(StageL_getArmoredUtf8EmbeddedEndUuid )" )" )" )" "$(StageL_dcaToDcbnbUtf8 "$(join_by $'\037' '35' '18' '36' '291')")")"
    # Test for converting to UTF8+dcbnb with intermixed mappable and nonmappable
    StageL_runTest "$boolV" "$(StageL_arrEq "$(StageL_append "$(join_by $'\037' '49' '32' '50')" "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedStartUuid )" "$(StageL_append "$(join_by $'\037' '244' '131' '173' '156' '239' '159' '185' '50')" "$(StageL_getArmoredUtf8EmbeddedEndUuid )" )" )" )" "$(StageL_dcaToDcbnbUtf8 "$(join_by $'\037' '35' '18' '36' '291' '36')")")"
    # Tests for converting from UTF8+dcbnb
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '35' '18' '36' '291' '36')" "$(StageL_dcaFromDcbnbUtf8 "$(StageL_append "$(join_by $'\037' '49' '32' '50')" "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedStartUuid )" "$(StageL_append "$(join_by $'\037' '244' '131' '173' '156' '244' '143' '191' '173' '50')" "$(StageL_getArmoredUtf8EmbeddedEndUuid )")")")")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '35' '18' '36' '291')" "$(StageL_dcaFromDcbnbUtf8 "$(StageL_append "$(join_by $'\037' '49' '32' '50')" "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedStartUuid )" "$(StageL_append "$(join_by $'\037' '244' '131' '173' '156' '244' '143' '191' '173')" "$(StageL_getArmoredUtf8EmbeddedEndUuid )")")")")")"
    # Make sure the dcbnb region gets output at the right place relative to the other chars (there's a bug where it outputs 18 18 11 instead of 18 11 18)
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '18' '11' '18')" "$(StageL_dcaFromDcbnbUtf8 "$(StageL_append "$(join_by $'\037' '32')" "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedStartUuid )" "$(StageL_append "$(join_by $'\037' '244' '143' '191' '180' '244' '143' '191' '181')" "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedEndUuid )" "$(join_by $'\037' '32')")")")")")")"
    # Same as the previous test, but with the spaces inside the start and end UUIDs. Works even though the previous one failed.
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '18' '11' '18')" "$(StageL_dcaFromDcbnbUtf8 "$(StageL_append "$(StageL_getArmoredUtf8EmbeddedStartUuid )" "$(StageL_append "$(join_by $'\037' '32' '244' '143' '191' '180' '244' '143' '191' '181' '32')" "$(StageL_getArmoredUtf8EmbeddedEndUuid )")")")")"
    # Like the test after next but with only the first region
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '89' '7')" "$(StageL_dcaFromDcbnbUtf8 "$(join_by $'\037' '104' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '184' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157')")")"
    # Second half of the subsequent test
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '11')" "$(StageL_dcaFromDcbnbUtf8 "$(join_by $'\037' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '180' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157')")")"
    # Two dcbnb regions: The two halves work separately, but fail when together
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '89' '7' '11')" "$(StageL_dcaFromDcbnbUtf8 "$(join_by $'\037' '104' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '184' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '180' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157')")")"
    # It fails without the leading h as well. The issue is that the ( 7 11 ) mysteriously becomes ( 65533 65533 ) when they are together.
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '7' '11')" "$(StageL_dcaFromDcbnbUtf8 "$(join_by $'\037' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '184' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '180' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157')")")"
    # With the h in the middle separating the two dcbnb regions
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '7' '89' '11')" "$(StageL_dcaFromDcbnbUtf8 "$(join_by $'\037' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '184' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157' '104' '244' '141' '129' '157' '244' '139' '182' '128' '243' '188' '183' '162' '243' '186' '128' '138' '243' '184' '165' '142' '244' '136' '186' '141' '243' '178' '139' '160' '244' '143' '186' '144' '244' '143' '191' '180' '244' '143' '191' '181' '243' '188' '133' '185' '243' '180' '182' '175' '244' '136' '161' '186' '243' '191' '148' '138' '244' '134' '178' '166' '244' '141' '184' '130' '243' '178' '128' '176' '244' '143' '188' '157')")")"
    # "h\u{10d05d}\u{10bd80}\u{fcde2}\u{fa00a}\u{f894e}\u{108e8d}\u{f22e0}\u{10fe90}\u{10fff8}\u{10fff5}\u{fc179}\u{f4daf}\u{10887a}\u{ff50a}\u{106ca6}\u{10de02}\u{f2030}\u{10ff1d}\u{10d05d}\u{10bd80}\u{fcde2}\u{fa00a}\u{f894e}\u{108e8d}\u{f22e0}\u{10fe90}\u{10fff4}\u{10fff5}\u{fc179}\u{f4daf}\u{10887a}\u{ff50a}\u{106ca6}\u{10de02}\u{f2030}\u{10ff1d}" "244,141,129,157,244,139,182,128,243,188,183,162,243,186,128,138,243,184,165,142,244,136,186,141,243,178,139,160,244,143,186,144,244,143,191,184,244,143,191,181,243,188,133,185,243,180,182,175,244,136,161,186,243,191,148,138,244,134,178,166,244,141,184,130,243,178,128,176,244,143,188,157" "244,141,129,157,244,139,182,128,243,188,183,162,243,186,128,138,243,184,165,142,244,136,186,141,243,178,139,160,244,143,186,144,244,143,191,180,244,143,191,181,243,188,133,185,243,180,182,175,244,136,161,186,243,191,148,138,244,134,178,166,244,141,184,130,243,178,128,176,244,143,188,157"
    # Test for a bug that results in the output being 16 uppercase letter Bs
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '6')" "$(StageL_dcaFromDcbnbFragmentUtf8 "$(join_by $'\037' '244' '143' '191' '185' '239' '160' '129')")")"
    # A simple one with new format remainder character
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '82' '86' '5')" "$(StageL_dcaFromDcbnbFragmentUtf8 "$(join_by $'\037' '97' '101' '244' '143' '191' '186' '239' '160' '129')")")"
    # Tests for dcbnbGetLastChar
    # 82 86 5
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '244' '143' '191' '186' '239' '160' '129')" "$(StageL_dcbnbGetLastChar "$(join_by $'\037' '97' '101' '244' '143' '191' '186' '239' '160' '129')")")"
    # invalid
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' )" "$(StageL_dcbnbGetLastChar "$(join_by $'\037' '239' '160' '129')")")"
    # invalid
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' )" "$(StageL_dcbnbGetLastChar "$(join_by $'\037' '97' '101' '244' '143' '191' '186')")")"
    # invalid 82
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '82')" "$(StageL_dcbnbGetLastChar "$(join_by $'\037' '244' '143' '191' '186' '97')")")"
    # Tests for dcbnbGetFirstChar
    # 5 82 86
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '244' '143' '191' '186' '239' '160' '129')" "$(StageL_dcbnbGetFirstChar "$(join_by $'\037' '244' '143' '191' '186' '239' '160' '129' '97' '101')")")"
    # invalid
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' )" "$(StageL_dcbnbGetFirstChar "$(join_by $'\037' '239' '160' '129')")")"
    # invalid 82 86
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' )" "$(StageL_dcbnbGetFirstChar "$(join_by $'\037' '239' '160' '129' '97' '101')")")"
    # invalid 82 86
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' )" "$(StageL_dcbnbGetFirstChar "$(join_by $'\037' '244' '143' '191' '186' '97' '101')")")"
    # 86 invalid
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '86')" "$(StageL_dcbnbGetFirstChar "$(join_by $'\037' '101' '244' '143' '191' '186')")")"
    # Tests for utf8CharArrayFromByteArray and vice versa
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '50' '53' '54' '32' '50' '53' '56' '32' '50' '54' '48' '32' '50' '54' '50' '32' '50' '54' '52' '32' '50' '54' '51' '32' '53' '55' '32' '56' '54' '32' '57' '51' '32' '57' '51' '32' '57' '54' '32' '51' '48' '32' '49' '56' '32' '50' '56' '54' '32' '55' '50' '32' '57' '54' '32' '57' '57' '32' '57' '51' '32' '56' '53' '32' '50' '56' '55' '32' '49' '57' '32' '49' '56' '32' '50' '56' '52' '32' '50' '54' '49' '32' '50' '53' '57' '32' '35' '32' '115' '97' '121' '32' '34' '72' '101' '108' '108' '111' '44' '32' '47' '87' '111' '114' '108' '100' '47' '33' '32' '9917' '34' '10' '49' '32' '50' '32' '35' '32' '9917' '10')" "$(StageL_utf8CharArrayFromByteArray "$(join_by $'\037' '50' '53' '54' '32' '50' '53' '56' '32' '50' '54' '48' '32' '50' '54' '50' '32' '50' '54' '52' '32' '50' '54' '51' '32' '53' '55' '32' '56' '54' '32' '57' '51' '32' '57' '51' '32' '57' '54' '32' '51' '48' '32' '49' '56' '32' '50' '56' '54' '32' '55' '50' '32' '57' '54' '32' '57' '57' '32' '57' '51' '32' '56' '53' '32' '50' '56' '55' '32' '49' '57' '32' '49' '56' '32' '50' '56' '52' '32' '50' '54' '49' '32' '50' '53' '57' '32' '35' '32' '115' '97' '121' '32' '34' '72' '101' '108' '108' '111' '44' '32' '47' '87' '111' '114' '108' '100' '47' '33' '32' '226' '154' '189' '34' '10' '49' '32' '50' '32' '35' '32' '226' '154' '189' '10')")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '50' '53' '54' '32' '50' '53' '56' '32' '50' '54' '48' '32' '50' '54' '50' '32' '50' '54' '52' '32' '50' '54' '51' '32' '53' '55' '32' '56' '54' '32' '57' '51' '32' '57' '51' '32' '57' '54' '32' '51' '48' '32' '49' '56' '32' '50' '56' '54' '32' '55' '50' '32' '57' '54' '32' '57' '57' '32' '57' '51' '32' '56' '53' '32' '50' '56' '55' '32' '49' '57' '32' '49' '56' '32' '50' '56' '52' '32' '50' '54' '49' '32' '50' '53' '57' '32' '35' '32' '115' '97' '121' '32' '34' '72' '101' '108' '108' '111' '44' '32' '47' '87' '111' '114' '108' '100' '47' '33' '32' '226' '154' '189' '34' '10' '49' '32' '50' '32' '35' '32' '226' '154' '189' '10')" "$(StageL_byteArrayFromUtf8CharArray "$(join_by $'\037' '50' '53' '54' '32' '50' '53' '56' '32' '50' '54' '48' '32' '50' '54' '50' '32' '50' '54' '52' '32' '50' '54' '51' '32' '53' '55' '32' '56' '54' '32' '57' '51' '32' '57' '51' '32' '57' '54' '32' '51' '48' '32' '49' '56' '32' '50' '56' '54' '32' '55' '50' '32' '57' '54' '32' '57' '57' '32' '57' '51' '32' '56' '53' '32' '50' '56' '55' '32' '49' '57' '32' '49' '56' '32' '50' '56' '52' '32' '50' '54' '49' '32' '50' '53' '57' '32' '35' '32' '115' '97' '121' '32' '34' '72' '101' '108' '108' '111' '44' '32' '47' '87' '111' '114' '108' '100' '47' '33' '32' '9917' '34' '10' '49' '32' '50' '32' '35' '32' '9917' '10')")")"

    StageL_internalDebugStackExit;
}

runTestsFormatHtml() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatHtml:format-html-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatHtml'
    StageL_runTest "$boolV" "$(StageL_arrEq "$(StageL_strToByteArray '<!DOCTYPE html><html><head><title></title></head><body><div style="white-space:pre-wrap">5&lt;6</div></body></html>')" "$(StageL_dcaToHtml "$(join_by $'\037' '39' '46' '40')")")"

    StageL_internalDebugStackExit;
}

runTestsFormatAsciiSafeSubset() {
    boolV="$1"; shift; StageL_internalDebugCollect "bool V = $boolV; "; StageL_internalDebugStackEnter 'runTestsFormatAsciiSafeSubset:format-asciiSafeSubset-tests'; StageL_assertIsBool "$boolV"

    StageL_testing "$boolV" 'formatAsciiSafeSubset'
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '121' '120' '21' '26')" "$(StageL_dcaFromAsciiSafeSubset "$(join_by $'\037' '13' '10' '35' '40')")")"
    StageL_runTest "$boolV" "$(StageL_arrEq "$(join_by $'\037' '13' '10' '35' '13' '10' '40')" "$(StageL_dcaToAsciiSafeSubset "$(join_by $'\037' '0' '212' '120' '216' '291' '221' '226' '231' '21' '121' '120' '26')")")"

    StageL_internalDebugStackExit;
}

dcaFromSems() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dcaFromSems:format-sems'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayIn[@]}")"
    intArrayRes=()
    # Accepts an array of bytes of a SEMS format document. Returns an array of Dcs.
    intArrayContent=()
    intArrayContent="$(StageL_utf8CharArrayFromByteArray "$(join_by $'\037' "${intArrayIn[@]}")")"
    strParserState=''
    strParserState='dc'
    strCurrentDc=''
    strCurrentDc=''
    intContentLength='0'
    intContentLength="$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")"
    intCharOffset='0'
    intCurrentChar='0'
    boolStrict='false'
    boolStrict="$(StageL_eq 'true' "$(StageL_getSettingForFormat 'sems' 'in' 'strict')")"
    while [[ "true" == "$(StageL_lt "$intCharOffset" "$intContentLength")" ]]; do
        # do something with each char in the array. an/content[n/byteOffset], which is copied to n/currentChar, holds the decimal value of the given char. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs.
        intCurrentChar="$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" "$intCharOffset")"
        if [[ "true" == "$(StageL_eq "$strParserState" 'dc')" ]]; then
            if [[ "true" == "$(StageL_asciiIsDigit "$intCurrentChar")" ]]; then
                strCurrentDc="$(StageL_cat "$strCurrentDc" "$(StageL_charFromByte "$intCurrentChar")")"
                        elif [[ "true" == "$(StageL_in "$intCurrentChar" "$(join_by $'\037' '10' '13' '32')")" ]]; then
                intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentDc")")"
                strCurrentDc=''
                        elif [[ "true" == "$(StageL_eq '35' "$intCurrentChar")" ]]; then
                # pound sign: start comment
                if [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strCurrentDc")")" ]]; then
                    # Comment was not preceded by a space
                    StageL_warnOrDie "$boolStrict" 'No trailing space before comment present in sems format while importing. This is not allowed in strict mode.'
                    intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentDc")")"
                    strCurrentDc=''
                fi
                intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" '246')"
                strParserState='comment'
                        else
                StageL_die 'Unexpected parser state in SEMS document.'
            fi
                elif [[ "true" == "$(StageL_eq "$strParserState" 'comment')" ]]; then
            if [[ "true" == "$(StageL_asciiIsNewline "$intCurrentChar")" ]]; then
                intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" '248')"
                strParserState='dc'
                        else
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_dcaFromUnicodeChar "$intCurrentChar")")"
            fi
                else
            StageL_die 'Internal error: unexpected parser state while parsing SEMS document'
        fi
        intCharOffset="$(StageL_add "$intCharOffset" '1')"
    done
    if [[ "true" == "$(StageL_eq "$strParserState" 'comment')" ]]; then
        # Document ended with a comment and no newline at the end
        if [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strCurrentDc")")" ]]; then
            StageL_die "$(StageL_cat 'Internal error while parsing sems document: Unconsumed characters were left over when the end of the document was found: ' "$(StageL_cat "$strCurrentDc" '.')")"
        fi
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" '248')"
        elif [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strCurrentDc")")" ]]; then
        StageL_warnOrDie "$boolStrict" 'No trailing space present in sems format while importing. This is not allowed in strict mode.'
        # Ended without a trailing space
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentDc")")"
    fi
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToSems() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToSems:format-sems'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    # TODO: Support SEMS comment roundtripping
    intArrayOut=()
    intLen='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayDcIn[@]}")")"
    intInputIndex='0'
    intInputIndex='0'
    intCurrentDc='0'
    boolInComment='false'
    boolInComment='false'
    intArrayCurrentComment=()
    intArrayCurrentComment=(  )
    boolAtCommentEnd='false'
    boolAtCommentEnd='false'
    while [[ "true" == "$(StageL_lt "$intInputIndex" "$intLen")" ]]; do
        intCurrentDc="$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")"
        if [[ "true" == "$boolAtCommentEnd" ]]; then
            boolAtCommentEnd='false'
        fi
        if [[ "true" == "$(StageL_eq '246' "$intCurrentDc")" ]]; then
            boolInComment='true'
            intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '#')")"
                elif [[ "true" == "$(StageL_eq '248' "$intCurrentDc")" ]]; then
            boolInComment='false'
            boolAtCommentEnd='true'
            intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_dcaToDcbnbUtf8 "$(join_by $'\037' "${intArrayCurrentComment[@]}")")")"
            intArrayCurrentComment=(  )
            intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_crlf )")"
                else
            if [[ "true" == "$boolInComment" ]]; then
                intArrayCurrentComment="$(StageL_push "$(join_by $'\037' "${intArrayCurrentComment[@]}")" "$intCurrentDc")"
                        else
                intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray "$(StageL_cat "$(StageL_strFrom "$intCurrentDc")" ' ')")")"
            fi
        fi
        intInputIndex="$(StageL_add "$intInputIndex" '1')"
    done
    if [[ "true" == "$(StageL_not "$boolAtCommentEnd")" ]]; then
        intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_crlf )")"
    fi
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToColorcoded() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToColorcoded:format-colorcoded'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    intArrayOut=()
    intArrayOut="$(StageL_strToByteArray '<!DOCTYPE html><html><head><title></title></head><body><p>Key: <span style="color:black">Letter</span> <span style="color:gray">Control</span> <span style="color:blue">Semantic</span> <span style="color:salmon">Mathematics</span> <span style="color:rebeccapurple">Symbols</span> <span style="color:red">Programming</span> <span style="color:green">Financial</span> <span style="color:orange">Punctuation</span> <span style="color:purple">Emoji</span> <span style="color:maroon">Styling</span> <span style="color:brown">Other</span></p>')"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_dcaToColorcodedFragment "$(join_by $'\037' "${intArrayDcIn[@]}")")")"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '</body></html>')")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToColorcodedFragment() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToColorcodedFragment:format-colorcoded'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    intArrayOut=()
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '<div style="white-space:pre-wrap">')")"
    intLen='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayDcIn[@]}")")"
    intInputIndex='0'
    intInputIndex='0'
    intDcAtIndex='0'
    while [[ "true" == "$(StageL_lt "$intInputIndex" "$intLen")" ]]; do
        intDcAtIndex="$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")"
        intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_dcToFormat 'colorcoded' "$intDcAtIndex")")"
        intInputIndex="$(StageL_add "$intInputIndex" '1')"
    done
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '</div>')")"
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcToColorcoded() {
    intIn="$1"; shift; StageL_internalDebugCollect "int In = $intIn; "; StageL_internalDebugStackEnter 'dcToColorcoded:format-colorcoded'; StageL_assertIsInt "$intIn"

    StageL_assertIsDc "$intIn"
    intArrayOut=()
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '<span style="color:')")"
    strType=''
    strType="$(StageL_dcGetType "$intIn")"
    strScript=''
    strScript="$(StageL_dcGetScript "$intIn")"
    strColor=''
    if [[ "true" == "$(StageL_eq 'L' "$(StageL_strChar "$strType" '0')")" ]]; then
        # Letter
        strColor='black'
        elif [[ "true" == "$(StageL_eq 'Controls' "$strScript")" ]]; then
        # Control
        strColor='gray'
        elif [[ "true" == "$(StageL_eq 'Semantic' "$strScript")" ]]; then
        # Semantic
        strColor='blue'
        elif [[ "true" == "$(StageL_eq 'Mathematics' "$strScript")" ]]; then
        # Mathematics
        strColor='salmon'
        elif [[ "true" == "$(StageL_eq 'Symbols' "$strScript")" ]]; then
        # Symbols
        strColor='rebeccapurple'
        elif [[ "true" == "$(StageL_eq 'EL ' "$(StageL_substr "$strScript" '0' '3')")" ]]; then
        # Programming
        strColor='red'
        elif [[ "true" == "$(StageL_eq 'Financial' "$strScript")" ]]; then
        # Financial
        strColor='green'
        elif [[ "true" == "$(StageL_eq 'Punctuation' "$strScript")" ]]; then
        # Punctuation
        strColor='orange'
        elif [[ "true" == "$(StageL_eq 'Emoji' "$strScript")" ]]; then
        # Emoji
        strColor='purple'
        elif [[ "true" == "$(StageL_eq 'Colors' "$strScript")" ]]; then
        # Styling
        strColor='maroon'
        else
        # Other
        strColor='brown'
    fi
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray "$strColor")")"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '">')")"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray "$(StageL_strFrom "$intIn")")")"
    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray '</span> ')")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaFromAsciiSafeSubset() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaFromAsciiSafeSubset:format-asciiSafeSubset'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    intLen='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")"
    intCounter='0'
    intCounter='0'
    strState=''
    strState='normal'
    intArrayPrefilter=()
    intCurrentChar='0'
    boolStrict='false'
    boolStrict='false'
    if [[ "true" == "$(StageL_eq 'true' "$(StageL_getSettingForFormat 'asciiSafeSubset' 'in' 'strict')")" ]]; then
        boolStrict='true'
    fi
    while [[ "true" == "$(StageL_lt "$intCounter" "$intLen")" ]]; do
        intCurrentChar="$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" "$intCounter")"
        StageL_assertIsTrue "$(StageL_isAsciiSafeSubsetChar "$intCurrentChar")"
        if [[ "true" == "$(StageL_and "$boolStrict" "$(StageL_and "$(StageL_eq "$strState" 'normal')" "$(StageL_eq "$intCurrentChar" '10')")")" ]]; then
            StageL_die 'LF without preceding CR not allowed in asciiSafeSubset strict mode.'
        fi
        if [[ "true" == "$(StageL_and "$(StageL_eq "$strState" 'normal')" "$(StageL_eq "$intCurrentChar" '13')")" ]]; then
            # Wait to see if there's a lf after this cr. If so, treat them as a unit.
            strState='crlf'
                elif [[ "true" == "$(StageL_eq "$strState" 'crlf')" ]]; then
            strState='normal'
            intArrayPrefilter="$(StageL_append "$(join_by $'\037' "${intArrayPrefilter[@]}")" "$(StageL_crlf )")"
            if [[ "true" == "$(StageL_ne "$intCurrentChar" '10')" ]]; then
                if [[ "true" == "$boolStrict" ]]; then
                    StageL_die 'CR followed by non-LF byte not allowed in asciiSafeSubset strict mode.'
                fi
                # Reparse the current character
                intCounter="$(StageL_sub "$intCounter" '1')"
            fi
                else
            intArrayPrefilter="$(StageL_push "$(join_by $'\037' "${intArrayPrefilter[@]}")" "$intCurrentChar")"
        fi
        intCounter="$(StageL_add "$intCounter" '1')"
    done
    intArrayPrefilter="$(StageL_dcaFromAscii "$(join_by $'\037' "${intArrayPrefilter[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayPrefilter[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToAsciiSafeSubset() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToAsciiSafeSubset:format-asciiSafeSubset'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    intArrayOut=()
    intArrayTemp=()
    intLen='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayDcIn[@]}")")"
    intInputIndex='0'
    intInputIndex='0'
    intDcAtIndex='0'
    strState=''
    strState='normal'
    intArrayMapTemp=()
    while [[ "true" == "$(StageL_lt "$intInputIndex" "$intLen")" ]]; do
        intArrayMapTemp="$(StageL_dcToFormat 'utf8' "$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")")"
        if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayMapTemp[@]}")")")" ]]; then
            intArrayTemp="$(StageL_setElement "$(join_by $'\037' "${intArrayTemp[@]}")" "$intInputIndex" '-1')"
                else
            intArrayTemp="$(StageL_setElement "$(join_by $'\037' "${intArrayTemp[@]}")" "$intInputIndex" "$(StageL_get "$(join_by $'\037' "${intArrayMapTemp[@]}")" '0')")"
        fi
        intInputIndex="$(StageL_add "$intInputIndex" '1')"
    done
    intInputIndex='0'
    intArrayTempChar=()
    while [[ "true" == "$(StageL_lt "$intInputIndex" "$intLen")" ]]; do
        intDcAtIndex="$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")"
        if [[ "true" == "$(StageL_eq "$intDcAtIndex" '121')" ]]; then
            strState='crlf'
            intInputIndex="$(StageL_add "$intInputIndex" '1')"
            intDcAtIndex="$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")"
        fi
        if [[ "true" == "$(StageL_eq "$strState" 'normal')" ]]; then
            intArrayTempChar="$(StageL_dcToFormat 'utf8' "$intDcAtIndex")"
            if [[ "true" == "$(StageL_eq '0' "$(StageL_count "$(join_by $'\037' "${intArrayTempChar[@]}")")")" ]]; then
                StageL_exportWarningUnmappable "$intInputIndex" "$intDcAtIndex"
                        else
                if [[ "true" == "$(StageL_dcIsNewline "$intDcAtIndex")" ]]; then
                    intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_crlf )")"
                                elif [[ "true" == "$(StageL_isAsciiSafeSubsetChar "$(StageL_get "$(join_by $'\037' "${intArrayTempChar[@]}")" '0')")" ]]; then
                    intArrayOut="$(StageL_push "$(join_by $'\037' "${intArrayOut[@]}")" "$(join_by $'\037' "${intArrayTempChar[@]}")")"
                                else
                    StageL_exportWarningUnmappable "$intInputIndex" "$intDcAtIndex"
                fi
            fi
                elif [[ "true" == "$(StageL_eq "$strState" 'crlf')" ]]; then
            strState='normal'
            if [[ "true" == "$(StageL_eq "$intDcAtIndex" '120')" ]]; then
                # Found ambiguous cr, lf in a row, so only output one crlf
                intArrayOut="$(StageL_append "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_crlf )")"
                        else
                # Reprocess the current character with 'normal' state
                intInputIndex="$(StageL_sub "$intInputIndex" '1')"
            fi
        fi
        intInputIndex="$(StageL_add "$intInputIndex" '1')"
    done
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

isAsciiSafeSubsetChar() {
    intChar="$1"; shift; StageL_internalDebugCollect "int Char = $intChar; "; StageL_internalDebugStackEnter 'isAsciiSafeSubsetChar:format-asciiSafeSubset'; StageL_assertIsInt "$intChar"

    boolRes='false'
    boolRes="$(StageL_or "$(StageL_asciiIsPrintable "$intChar")" "$(StageL_asciiIsNewline "$intChar")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

dcaFromIntegerList() {
    IFS=$'\037' read -r -a intArrayContent <<< "$1"; shift; StageL_internalDebugCollect "intArray Content = $intArrayContent; "; StageL_internalDebugStackEnter 'dcaFromIntegerList:format-integerList'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContent[@]}")"

    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayContent[@]}")"
    intArrayRes=()
    # Accepts an array of bytes representing an ASCII list of integers representing Dcs. Returns an array of Dcs. This format is the same as sems but without supporting comments.
    strCurrentDc=''
    strCurrentDc=''
    intContentLength='0'
    intContentLength="$(StageL_count "$(join_by $'\037' "${intArrayContent[@]}")")"
    intByteOffset='0'
    intCurrentByte='0'
    while [[ "true" == "$(StageL_lt "$intByteOffset" "$intContentLength")" ]]; do
        # do something with each byte in the array. an/content[n/byteOffset] holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs.
        intCurrentByte="$(StageL_get "$(join_by $'\037' "${intArrayContent[@]}")" "$intByteOffset")"
        if [[ "true" == "$(StageL_asciiIsDigit "$intCurrentByte")" ]]; then
            strCurrentDc="$(StageL_cat "$strCurrentDc" "$(StageL_charFromByte "$intCurrentByte")")"
                elif [[ "true" == "$(StageL_asciiIsSpace "$intCurrentByte")" ]]; then
            intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentDc")")"
            strCurrentDc=''
                else
            StageL_die 'Unexpected parser state in integerList document.'
        fi
        intByteOffset="$(StageL_add "$intByteOffset" '1')"
    done
    if [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strCurrentDc")")" ]]; then
        # Ended without a trailing space
        if [[ "true" == "$(StageL_eq 'true' "$(StageL_getSettingForFormat 'integerList' 'in' 'strict')")" ]]; then
            StageL_die 'No trailing space present in integerList format while importing. This is not allowed in strict mode.'
        fi
        intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_intFromIntStr "$strCurrentDc")")"
    fi
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcaToIntegerList() {
    IFS=$'\037' read -r -a intArrayDcIn <<< "$1"; shift; StageL_internalDebugCollect "intArray DcIn = $intArrayDcIn; "; StageL_internalDebugStackEnter 'dcaToIntegerList:format-integerList'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcIn[@]}")"

    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcIn[@]}")"
    intArrayOut=()
    intLen='0'
    intLen="$(StageL_count "$(join_by $'\037' "${intArrayDcIn[@]}")")"
    intInputIndex='0'
    intInputIndex='0'
    while [[ "true" == "$(StageL_lt "$intInputIndex" "$intLen")" ]]; do
        intArrayOut="$(StageL_push "$(join_by $'\037' "${intArrayOut[@]}")" "$(StageL_strToByteArray "$(StageL_cat "$(StageL_strFrom "$(StageL_get "$(join_by $'\037' "${intArrayDcIn[@]}")" "$intInputIndex")" )" ' ')")")"
        intInputIndex="$(StageL_add "$intInputIndex" '1')"
    done
    StageL_assertIsByteArray "$(join_by $'\037' "${intArrayOut[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

isSupportedDocumentTransformation() {
    strTransform="$1"; shift; StageL_internalDebugCollect "str Transform = $strTransform; "; StageL_internalDebugStackEnter 'isSupportedDocumentTransformation:document-transformations'; StageL_assertIsStr "$strTransform"

    boolRes='false'
    boolRes="$(StageL_in "$strTransform" "$(join_by $'\037' "${strArrayListDocumentTransformations[@]}")")"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

assertIsSupportedDocumentTransformation() {
    strTransform="$1"; shift; StageL_internalDebugCollect "str Transform = $strTransform; "; StageL_internalDebugStackEnter 'assertIsSupportedDocumentTransformation:document-transformations'; StageL_assertIsStr "$strTransform"

    StageL_assertIsTrue "$(StageL_isSupportedDocumentTransformation "$strTransform")"

    StageL_internalDebugStackExit;
}

applyDocumentTransformation() {
    strTransform="$1"; shift; IFS=$'\037' read -r -a intArrayDcArrayIn <<< "$1"; shift; StageL_internalDebugCollect "str Transform = $strTransform; "; StageL_internalDebugCollect "intArray DcArrayIn = $intArrayDcArrayIn; "; StageL_internalDebugStackEnter 'applyDocumentTransformation:document-transformations'; StageL_assertIsStr "$strTransform"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayDcArrayIn[@]}")"

    StageL_assertIsSupportedDocumentTransformation "$strTransform"
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayDcArrayIn[@]}")"
    intArrayRes=()
    if [[ "true" == "$(StageL_eq "$strTransform" 'semanticToText')" ]]; then
        intArrayRes="$(StageL_dctSemanticToText "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        elif [[ "true" == "$(StageL_eq "$strTransform" 'codeToText')" ]]; then
        intArrayRes="$(StageL_dctCodeToText "$(join_by $'\037' "${intArrayDcArrayIn[@]}")")"
        else
        StageL_die "$(StageL_cat 'Unimplemented document transformation: ' "$strTransform")"
    fi
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayRes[@]}")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dcPreprocessForFormat() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; strFormat="$1"; shift; strDirection="$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Direction = $strDirection; "; StageL_internalDebugStackEnter 'dcPreprocessForFormat:dc-preprocess-for-format'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strDirection"

    intArrayRes=()
    intArrayRes="$(join_by $'\037' "${intArrayIn[@]}")"
    strPreferredLang=''
    strPreferredLang="$(StageL_getPreferredLanguageForFormat "$strFormat" "$strDirection")"
    strPreferredCodeLang=''
    strPreferredCodeLang="$(StageL_getPreferredCodeLanguageForFormat "$strFormat" "$strDirection")"
    strTemp=''
    if [[ "true" == "$(StageL_in 'prefilter_semantic' "$(StageL_getSettingsForFormat "$strFormat" "$strDirection")")" ]]; then
        strTemp="$(StageL_pushFormatImportSetting 'semanticToText' 'language' "$strPreferredLang")"
        intArrayRes="$(StageL_dctSemanticToText "$(join_by $'\037' "${intArrayRes[@]}")")"
        StageL_setFormatImportSetting 'semanticToText' 'language' "$strTemp"
    fi
    if [[ "true" == "$(StageL_in 'prefilter_code' "$(StageL_getSettingsForFormat "$strFormat" "$strDirection")")" ]]; then
        strTemp="$(StageL_pushFormatImportSetting 'codeToText' 'language' "$strPreferredCodeLang")"
        intArrayRes="$(StageL_dctCodeToText "$(join_by $'\037' "${intArrayRes[@]}")")"
        StageL_setFormatImportSetting 'codeToText' 'language' "$strTemp"
    fi

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dctSemanticToText() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dctSemanticToText:semantic-to-text'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intArrayRes=()
    intC='0'
    intC='0'
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    intCurrentDc='0'
    strTargetLanguage=''
    strTargetLanguage="$(StageL_cat 'lang_' "$(StageL_getFormatImportSetting 'semanticToText' 'language')")"
    if [[ "true" == "$(StageL_eq 'lang_' "$strTargetLanguage")" ]]; then
        strTargetLanguage="$(StageL_cat 'lang_' "$(StageL_getEnvLanguage )")"
    fi
    strTemp=''
    while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
        intCurrentDc="$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intC")"
        if [[ "true" == "$(StageL_eq 'Semantic' "$(StageL_dcGetScript "$intCurrentDc")")" ]]; then
            strTemp="$(StageL_dcGetMappingToFormat "$intCurrentDc" "$strTargetLanguage")"
            if [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strTemp")")" ]]; then
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_dcaFromElad "$strTemp")")"
                        else
                intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$intCurrentDc")"
            fi
        fi
        intC="$(StageL_inc "$intC")"
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

dctCodeToText() {
    IFS=$'\037' read -r -a intArrayIn <<< "$1"; shift; StageL_internalDebugCollect "intArray In = $intArrayIn; "; StageL_internalDebugStackEnter 'dctCodeToText:code-to-text'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayIn[@]}")"

    intArrayRes=()
    intC='0'
    intC='0'
    intL='0'
    intL="$(StageL_count "$(join_by $'\037' "${intArrayIn[@]}")")"
    intCurrentDc='0'
    strTargetLanguage=''
    strTargetLanguage="$(StageL_getFormatImportSetting 'codeToText' 'language')"
    if [[ "true" == "$(StageL_eq '0' "$(StageL_len "$strTargetLanguage")")" ]]; then
        strTargetLanguage="$(StageL_getEnvCodeLanguage )"
    fi
    strTemp=''
    while [[ "true" == "$(StageL_lt "$intC" "$intL")" ]]; do
        intCurrentDc="$(StageL_get "$(join_by $'\037' "${intArrayIn[@]}")" "$intC")"
        if [[ "true" == "$(StageL_dcIsELCode "$intCurrentDc")" ]]; then
            strTemp="$(StageL_dcGetMappingToFormat "$intCurrentDc" "$strTargetLanguage")"
            if [[ "true" == "$(StageL_ne '0' "$(StageL_len "$strTemp")")" ]]; then
                intArrayRes="$(StageL_append "$(join_by $'\037' "${intArrayRes[@]}")" "$(StageL_dcaFromElad "$strTemp")")"
                        else
                intArrayRes="$(StageL_push "$(join_by $'\037' "${intArrayRes[@]}")" "$intCurrentDc")"
            fi
        fi
        intC="$(StageL_inc "$intC")"
    done

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

# This file contains the public interface for EITE StageR.
# If you just want to run EITE, use the following routine.

startEite() {
    StageL_internalDebugStackEnter 'startEite:public-interface';

    # Start EITE, using the default startup document. Does not return while EITE is still running.
    StageL_loadAndRun 'sems' 'eite.sems'

    StageL_internalDebugStackExit;
}
# If you want to run a different document, you can call loadAndRun with the format of the document to open and its location.

loadAndRun() {
    strFormat="$1"; shift; strPath="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Path = $strPath; "; StageL_internalDebugStackEnter 'loadAndRun:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strPath"

    # Load and run the specified document. Does not return while the document is still running.
    StageL_runDocument "$(StageL_loadStoredDocument "$strFormat" "$strPath")"

    StageL_internalDebugStackExit;
}
# If you want to convert a document to another format, you can call loadAndConvert with the format of the document, its location, and the format you want the results in.

loadAndConvert() {
    strInputFormat="$1"; shift; strOutputFormat="$1"; shift; strPath="$1"; shift; StageL_internalDebugCollect "str InputFormat = $strInputFormat; "; StageL_internalDebugCollect "str OutputFormat = $strOutputFormat; "; StageL_internalDebugCollect "str Path = $strPath; "; StageL_internalDebugStackEnter 'loadAndConvert:public-interface'; StageL_assertIsStr "$strInputFormat"; StageL_assertIsStr "$strOutputFormat"; StageL_assertIsStr "$strPath"

    # Load the specified document, and return it converted to the specified outputFormat as an array of bytes.
    intArrayOut=()
    intArrayOut="$(StageL_exportDocument "$strOutputFormat" "$(StageL_loadStoredDocument "$strInputFormat" "$strPath")" )"
}
# To operate on a document you already have as a Dc array, you can call runDocument or convertDocument directly on it. Or, if you already have it as a byte array, you can call importDocument or importAndExport on it.

runDocument() {
    IFS=$'\037' read -r -a intArrayContents <<< "$1"; shift; StageL_internalDebugCollect "intArray Contents = $intArrayContents; "; StageL_internalDebugStackEnter 'runDocument:public-interface'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContents[@]}")"

    # Run the provided document. Does not return while the document is still running. Takes care of events and I/O automatically.
    StageL_runDocumentGo "$(StageL_runDocumentPrepare "$(join_by $'\037' "${intArrayContents[@]}")")"

    StageL_internalDebugStackExit;
}

runDocumentPrepare() {
    IFS=$'\037' read -r -a intArrayContents <<< "$1"; shift; StageL_internalDebugCollect "intArray Contents = $intArrayContents; "; StageL_internalDebugStackEnter 'runDocumentPrepare:public-interface'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContents[@]}")"

    # Prepare to run the provided document. Use this followed by runDocumentGo if you want to configure execution settings before starting the document.
    StageL_setupIfNeeded 
    StageL_assertIsDcArray "$(join_by $'\037' "${intArrayContents[@]}")"
    intExecId='0'
    intExecId="$(StageL_prepareDocumentExec "$(join_by $'\037' "${intArrayContents[@]}")")"
    StageL_assertIsExecId "$intExecId"

    intReturn="$intExecId"; StageL_assertIsInt "$intReturn"; StageL_internalDebugStackExit; print "$intReturn"
}

runDocumentGo() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'runDocumentGo:public-interface'; StageL_assertIsInt "$intExecId"

    # Run a document, once it's been prepared to run by calling runDocumentPrepare.
    StageL_internalRunDocument "$intExecId"

    StageL_internalDebugStackExit;
}

getExecOption() {
    intExecId="$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'getExecOption:public-interface'; StageL_assertIsInt "$intExecId"; StageL_assertIsStr "$strKey"

    # Get the value of an execution option for a document.
    StageL_setupIfNeeded 
    StageL_assertIsExecId "$intExecId"
    strRes=''
    strRes="$(StageL_kvGetValue "$(StageL_getExecSettings "$intExecId")" "$strKey")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getExecOptions() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getExecOptions:public-interface'; StageL_assertIsInt "$intExecId"

    # Get the execution options set for a document.
    StageL_setupIfNeeded 
    StageL_assertIsExecId "$intExecId"
    strArrayRes=()
    strArrayRes="$(StageL_getExecSettings "$intExecId")"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

setExecOption() {
    intExecId="$1"; shift; strKey="$1"; shift; strValue="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Value = $strValue; "; StageL_internalDebugStackEnter 'setExecOption:public-interface'; StageL_assertIsInt "$intExecId"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strValue"

    # Set an execution option for a document.
    StageL_setupIfNeeded 
    StageL_assertIsExecId "$intExecId"
    StageL_setExecSettings "$intExecId" "$(StageL_kvSetValue "$(StageL_getExecSettings "$intExecId")" "$strKey" "$strValue")"

    StageL_internalDebugStackExit;
}

exportDocument() {
    strFormat="$1"; shift; IFS=$'\037' read -r -a intArrayContents <<< "$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "intArray Contents = $intArrayContents; "; StageL_internalDebugStackEnter 'exportDocument:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContents[@]}")"

    StageL_setupIfNeeded 
    StageL_assertIsSupportedOutputFormat "$strFormat"
    # Convert a document stored as an array of dcs to the specified format, and return it as an array of bytes.
    StageL_setupIfNeeded 
    intArrayOut=()
    intArrayOut="$(StageL_dcaToFormat "$strFormat" "$(join_by $'\037' "${intArrayContents[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

importDocument() {
    strFormat="$1"; shift; IFS=$'\037' read -r -a intArrayContents <<< "$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "intArray Contents = $intArrayContents; "; StageL_internalDebugStackEnter 'importDocument:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContents[@]}")"

    StageL_setupIfNeeded 
    StageL_assertIsSupportedInputFormat "$strFormat"
    # Convert a document stored as an array of bytes in the specified format, and return it as an array of dc.
    StageL_setupIfNeeded 
    intArrayOut=()
    intArrayOut="$(StageL_dcaFromFormat "$strFormat" "$(join_by $'\037' "${intArrayContents[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

importAndExport() {
    strInputFormat="$1"; shift; strOutputFormat="$1"; shift; IFS=$'\037' read -r -a intArrayContents <<< "$1"; shift; StageL_internalDebugCollect "str InputFormat = $strInputFormat; "; StageL_internalDebugCollect "str OutputFormat = $strOutputFormat; "; StageL_internalDebugCollect "intArray Contents = $intArrayContents; "; StageL_internalDebugStackEnter 'importAndExport:public-interface'; StageL_assertIsStr "$strInputFormat"; StageL_assertIsStr "$strOutputFormat"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayContents[@]}")"

    StageL_setupIfNeeded 
    StageL_assertIsSupportedInputFormat "$strInputFormat"
    StageL_assertIsSupportedOutputFormat "$strOutputFormat"
    # Convert a document stored as an array of bytes in the specified input format, and return it as an array of bytes in the specified output format.
    intArrayOut=()
    intArrayOut="$(StageL_convertFormats "$strInputFormat" "$strOutputFormat" "$(join_by $'\037' "${intArrayContents[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayOut[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

getFormatImportSetting() {
    strFormat="$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'getFormatImportSetting:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strKey"

    # Return the value of the specified import setting for the specified format.
    strRes=''
    strRes="$(StageL_kvGetValue "$(StageL_getFormatImportSettings "$strFormat")" "$strKey")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatExportSetting() {
    strFormat="$1"; shift; strKey="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugStackEnter 'getFormatExportSetting:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strKey"

    # Return the value of the specified export setting for the specified format.
    strRes=''
    strRes="$(StageL_kvGetValue "$(StageL_getFormatExportSettings "$strFormat")" "$strKey")"

    strReturn="$strRes"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

setFormatImportSetting() {
    strFormat="$1"; shift; strKey="$1"; shift; strValue="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Value = $strValue; "; StageL_internalDebugStackEnter 'setFormatImportSetting:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strValue"

    # Set the value of the specified import setting for the specified format.
    StageL_setFormatImportSettings "$strFormat" "$(StageL_kvSetValue "$(StageL_getFormatImportSettings "$strFormat")" "$strKey" "$strValue")"

    StageL_internalDebugStackExit;
}

setFormatExportSetting() {
    strFormat="$1"; shift; strKey="$1"; shift; strValue="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Value = $strValue; "; StageL_internalDebugStackEnter 'setFormatExportSetting:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strValue"

    # Set the value of the specified export setting for the specified format.
    StageL_setFormatExportSettings "$strFormat" "$(StageL_kvSetValue "$(StageL_getFormatExportSettings "$strFormat")" "$strKey" "$strValue")"

    StageL_internalDebugStackExit;
}

pushFormatImportSetting() {
    strFormat="$1"; shift; strKey="$1"; shift; strValue="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Value = $strValue; "; StageL_internalDebugStackEnter 'pushFormatImportSetting:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strValue"

    # Temporarily set the value of the specified import setting for the specified format. Call setFormatImportSetting with the value this returns when you want to put the setting back.
    strResult=''
    strResult="$(StageL_getFormatImportSetting "$strFormat" "$strKey")"
    StageL_setFormatImportSetting "$strFormat" "$strKey" "$strValue"

    strReturn="$strResult"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

pushFormatExportSetting() {
    strFormat="$1"; shift; strKey="$1"; shift; strValue="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Key = $strKey; "; StageL_internalDebugCollect "str Value = $strValue; "; StageL_internalDebugStackEnter 'pushFormatExportSetting:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strKey"; StageL_assertIsStr "$strValue"

    # Temporarily set the value of the specified export setting for the specified format. Call setFormatExportSetting with the value this returns when you want to put the setting back.
    strResult=''
    strResult="$(StageL_getFormatExportSetting "$strFormat" "$strKey")"
    StageL_setFormatExportSetting "$strFormat" "$strKey" "$strValue"

    strReturn="$strResult"; StageL_assertIsStr "$strReturn"; StageL_internalDebugStackExit; print "$strReturn"
}

getFormatImportSettings() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatImportSettings:public-interface'; StageL_assertIsStr "$strFormat"

    # Return the import settings array for the specified format.
    StageL_setupIfNeeded 
    StageL_assertIsSupportedInputFormat "$strFormat"
    strArrayRes=()
    strArrayRes="$(StageL_getSettingsForFormat "$strFormat" 'in')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

getFormatExportSettings() {
    strFormat="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getFormatExportSettings:public-interface'; StageL_assertIsStr "$strFormat"

    # Return the export settings array for the specified format.
    StageL_setupIfNeeded 
    StageL_assertIsSupportedOutputFormat "$strFormat"
    strArrayRes=()
    strArrayRes="$(StageL_getSettingsForFormat "$strFormat" 'out')"

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

setFormatImportSettings() {
    strFormat="$1"; shift; IFS=$'\037' read -r -a strArraySettings <<< "$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "strArray Settings = $strArraySettings; "; StageL_internalDebugStackEnter 'setFormatImportSettings:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStrArray "$(join_by $'\037' "${strArraySettings[@]}")"

    # Replace the import settings array for the specified format.
    StageL_setupIfNeeded 
    StageL_assertIsSupportedInputFormat "$strFormat"
    StageL_setImportSettings "$(StageL_getFormatId "$strFormat")" "$(StageL_kvJoin "$(join_by $'\037' "${strArraySettings[@]}")")"

    StageL_internalDebugStackExit;
}

setFormatExportSettings() {
    strFormat="$1"; shift; IFS=$'\037' read -r -a strArraySettings <<< "$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "strArray Settings = $strArraySettings; "; StageL_internalDebugStackEnter 'setFormatExportSettings:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStrArray "$(join_by $'\037' "${strArraySettings[@]}")"

    # Replace the export settings array for the specified format.
    StageL_setupIfNeeded 
    StageL_assertIsSupportedOutputFormat "$strFormat"
    StageL_setExportSettings "$(StageL_getFormatId "$strFormat")" "$(StageL_kvJoin "$(join_by $'\037' "${strArraySettings[@]}")")"

    StageL_internalDebugStackExit;
}

transformDocument() {
    IFS=$'\037' read -r -a intArrayInputDocument <<< "$1"; shift; strTransformation="$1"; shift; StageL_internalDebugCollect "intArray InputDocument = $intArrayInputDocument; "; StageL_internalDebugCollect "str Transformation = $strTransformation; "; StageL_internalDebugStackEnter 'transformDocument:public-interface'; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayInputDocument[@]}")"; StageL_assertIsStr "$strTransformation"

    # Apply one of the supported document transformations to the provided document, and return the result.
    StageL_setupIfNeeded 
    StageL_assertIsSupportedDocumentTransformation "$strTransformation"
    intArrayResult=()
    intArrayResult="$(StageL_applyDocumentTransformation "$strTransformation" "$(join_by $'\037' "${intArrayInputDocument[@]}")")"

    intArrayReturn="$(join_by $'\037' "${intArrayResult[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}
# If you want more control over the document loading and execution, you can use these lower-level functions.

loadStoredDocument() {
    strFormat="$1"; shift; strPath="$1"; shift; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugCollect "str Path = $strPath; "; StageL_internalDebugStackEnter 'loadStoredDocument:public-interface'; StageL_assertIsStr "$strFormat"; StageL_assertIsStr "$strPath"

    # Load and return the specified document as a Dc array.
    StageL_setupIfNeeded 
    StageL_assertIsSupportedInputFormat "$strFormat"
    intArrayRes=()
    intArrayRes="$(StageL_dcaFromFormat "$strFormat" "$(StageL_getFileFromPath "$strPath")")"

    intArrayReturn="$(join_by $'\037' "${intArrayRes[@]}")"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${intArrayReturn[@]}")"
}

getDesiredEventNotifications() {
    intExecId="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugStackEnter 'getDesiredEventNotifications:public-interface'; StageL_assertIsInt "$intExecId"

    # Return list of event types (e.g. keystrokes, mouse movement, elapsed time) that the document wants to be notified of.
    strArrayRes=()

    strArrayReturn="$(join_by $'\037' "${strArrayRes[@]}")"; StageL_assertIsStrArray "$(join_by $'\037' "${strArrayReturn[@]}")"; StageL_internalDebugStackExit; print "$(join_by $'\037' "${strArrayReturn[@]}")"
}

sendEvent() {
    intExecId="$1"; shift; IFS=$'\037' read -r -a intArrayEventData <<< "$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "intArray EventData = $intArrayEventData; "; StageL_internalDebugStackEnter 'sendEvent:public-interface'; StageL_assertIsInt "$intExecId"; StageL_assertIsIntArray "$(join_by $'\037' "${intArrayEventData[@]}")"

    # Send the provided event or events data to the specified document.
}

getDocumentFrame() {
    intExecId="$1"; shift; strFormat="$1"; shift; StageL_internalDebugCollect "int ExecId = $intExecId; "; StageL_internalDebugCollect "str Format = $strFormat; "; StageL_internalDebugStackEnter 'getDocumentFrame:public-interface'; StageL_assertIsInt "$intExecId"; StageL_assertIsStr "$strFormat"

    StageL_assertIsSupportedOutputFormat "$strFormat"
    # Return the most recently available output for the given document in the requested format.
}
# To run the tests, you can use runTests or runPrintTests.

runTests() {
    StageL_internalDebugStackEnter 'runTests:public-interface'; 

    # Returns true if all tests pass; false otherwise. Displays a report of the tests.
    StageL_setupIfNeeded 
    StageL_clearTestStats 
    StageL_runTestsOnly 'true'
    StageL_reportTests 
    if [[ "true" == "$(StageL_eq "$intFailedTests" '0')" ]]; then

        boolReturn='true'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
    fi

    boolReturn='false'; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}

quietRunTests() {
    StageL_internalDebugStackEnter 'quietRunTests:public-interface'; 

    # Returns true if all tests pass; false otherwise.
    StageL_setupIfNeeded 
    boolRes='false'
    boolRes="$(StageL_runTestsOnly 'false')"

    boolReturn="$boolRes"; StageL_assertIsBool "$boolReturn"; StageL_internalDebugStackExit; print "$boolReturn"
}


# @license-end

 

# @license-end
 

# @license-end
