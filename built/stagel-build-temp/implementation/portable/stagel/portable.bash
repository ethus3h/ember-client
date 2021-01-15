// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

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

    intTotalTests="$(StageL_add 