/* https://webassembly.org/docs/dynamic-linking/ */
#ifdef _WIN32
#  define EXPORT __declspec(dllexport)
#  define IMPORT __declspec(dllimport)
#else
#  define EXPORT
#  define IMPORT __attribute__ ((visibility ("default")))
#endif
