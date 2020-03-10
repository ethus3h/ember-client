strN=''
if [[ "true" == "$(StageL_eq 'a' "$strN")" ]]; then
    strN='FizzBuzz'
elif [[ "true" == "$(StageL_eq 'b' "$strN")" ]]; then
    strN='c'
else
    strN='b'
fi
