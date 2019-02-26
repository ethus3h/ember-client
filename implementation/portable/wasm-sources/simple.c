#include "_eite-shared.c"
#include <stdlib.h>

/* void _start() {
    utf8enc();
    utf9enc();
}
extern int utf8enc(); */

https://github.com/emscripten-core/emscripten/blob/5187ea263120ff57424a184c1bc73259e24dc9a9/tests/wrap_malloc.cpp
void * __attribute__((noinline)) malloc(size_t size)
{
	++totalAllocated;
	void *ptr = emscripten_builtin_malloc(size);
	printf("Allocated %u bytes, got %p. %d pointers allocated total.\n", size, ptr, totalAllocated);
	return ptr;
}

void __attribute__((noinline)) free(void *ptr)
{
	++totalFreed;
	emscripten_builtin_free(ptr);
	printf("Freed ptr %p, %d pointers freed total.\n", ptr, totalFreed);
}
EXPORT int fortytwo(int a) {
    return 42;
}
EXPORT int add(int a, int b) {
    return a+b;
}
EXPORT int utf8enc() {
    return 44;
}
EXPORT int utf9enc() {
    return 43;
}
