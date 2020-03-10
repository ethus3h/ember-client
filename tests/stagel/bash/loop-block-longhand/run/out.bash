strArrayTemp=()
strArrayTemp=( 'd' 'b' 'l' 'c' 'b' 'a' )
intC='0'
intI='0'
strElem=''
while [[ "true" == "$(StageL_lt "$intI" "$(StageL_count "$(join_by $'\037' "${strArrayTemp[@]}")")")" ]]; then
    strElem="$(StageL_get "$(join_by $'\037' "${strArrayTemp[@]}")" "$intI")"
    intI="$(StageL_inc "$intI")"
    intC="$(StageL_inc "$intC")"
done
