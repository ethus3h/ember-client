@Overview:
    This file describes lang.print().

@Interface:
    @Routine:
        nd!print
        Display a string to the user using the implementation's default string output.
        If there is no suitable string output, the string should be converted to a simple string and be attempted to be printed again. This behavior can be disabled by setting Boolean:trySprint to False.
        @Throws:
            @Exception:
                !noStringOutputResourceAvailable
                Shows that there is no available resource for outputting this string.
            @Exception:
                !stringChangedForDisplay
                There was no suitable output resource, so the string was altered to be shown to the user.
        @Parameters:
            @String:
                string
                The text to display
            @List[Resource]:
                outputResources =
                    [
                        Resource:system.resources.default('output', String)
                        (FuzzyList[Resource]) List[Resource]:system.resources.list
                    ]
            @Boolean:
                trySprint =
                    True
                If there is no available output resource for this string, should the string be cast to a sstring and tried again?
            @List[Resource]:
                fallbackResources =
                    [
                        Resource:system.resources.default('output', Sstring)
                        (FuzzyList[Resource]) List[Resource]:system.resources.list
                    ]
        @Returns
            @Void:
                This routine does not have a return value.
