strN=''
if [[ "true" == "$(StageL_eq 'a' "$strN")" ]]; then
    strN='FizzBuzz'
fi
else if ("$(StageL_eq 'b' "$strN")" ]]; then
    strN='c'
fi
else
    strN='b'
}
