void _start() {
    int ret = main(); /* https://web.archive.org/web/20190213211745/https://stackoverflow.com/questions/29694564/what-is-the-use-of-start-in-c */
    exit ret;
}
int main() {
    /* This is library code, so cannot be run by itself. But, we need an entry point so the functions don't get eaten by the linker's --gc-sections. */
    utf8enc();
    utf9enc();
}
int utf8enc() {
    return 42;
}
int utf9enc() {
    return 43;
}
