f() {
    StageL_internalDebugStackEnter 'f:in';

    intCounter='1'
    intCounter="$(StageL_add "$intCounter" '1')"
    strTemp=''

    StageL_internalDebugStackExit;
}
