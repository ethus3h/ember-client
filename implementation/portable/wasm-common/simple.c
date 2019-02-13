int main() {
    // This is library code, so cannot be run by itself. But, we need an entry point so the functions don't get eaten by the linker's --gc-sections.
    utf8enc();
    utf9enc();
    return 1;
}
int utf8enc() {
    return 42;
}
int utf9enc() {
    return 43;
}
