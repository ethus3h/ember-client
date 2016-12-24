@Overview:
    This file describes lang.sprint().
    Because this is a core routine, it is implemented in the language implementations, and this file only describes the routine's interface.

@Interface:
    @Routine:
        C nd!sprint
        Display a simple printable-ASCII string to the user using the implementation's default string output.
        @Throws:
            @Exception:
                !noSstringOutputResourceAvailable
                Shows that there is no available resource for outputting a simple string.
        @Parameters:
            @Sstring:
                string
                The text to display
            @List[Resource]:
                outputResources =
                    [
                        Resource:system.resources.default('output', Sstring)
                        (FuzzyList[Resource]) List[Resource]:system.resources.list
                    ]
        @Returns
            @Void:
                This routine does not have a return value.
