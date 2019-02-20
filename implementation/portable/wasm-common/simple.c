/* void _start() {
    utf8enc();
    utf9enc();
}
extern int utf8enc(); */
int errorStatus;
int checkForError() {
    int errorTemp = errorStatus;
    errorStatus = 0;
    return errorTemp;
}
int die() {
    errorStatus = 1; /* All calls need to call checkForError exactly once afterwards. */
}
int fortytwo(int a) {
    return 42;
}
int add(int a, int b) {
    return a+b;
}
int utf8enc() {
    return 42;
}
int utf9enc() {
    return 43;
}
