intArrayRes=()
while [[ "true" == "$(StageL_lt '8' "$(StageL_len "$(join_by $'\037' "${intArrayRes[@]}")")")" ]]; do
    intArrayRes="$(StageL_push "$(join_by $'\037' '0')" "$(join_by $'\037' "${intArrayRes[@]}")")"
done
