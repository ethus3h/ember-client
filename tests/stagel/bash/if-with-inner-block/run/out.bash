if [[ "true" == "$(StageL_eq '0' "$(StageL_mod "$intNum" '3')")" ]]; then
    boolOut='false'
    boolOut="$(StageL_eq '0' '0')"
fi
