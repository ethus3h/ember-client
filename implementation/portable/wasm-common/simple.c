#include "_export.c"

/* void _start() {
    utf8enc();
    utf9enc();
}
extern int utf8enc(); */
int errorStatus = 0;

EXPORT int checkForError() {
    int errorTemp = errorStatus;
    errorStatus = 0;
    return errorTemp;
}
int die() {
    errorStatus = 1; /* All calls need to call checkForError exactly once afterwards. */
}
int fortytwo(int a) EXPORT {
    return 42;
}
int add(int a, int b) EXPORT {
    return a+b;
}
int utf8enc() {
    return 44;
}
int utf9enc() {
    return 43;
}
