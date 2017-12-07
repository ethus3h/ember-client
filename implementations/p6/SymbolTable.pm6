#!/usr/bin/env perl6

# This class is originally by Moritz Lenz
class SymbolTable {
    has @!scopes = {}, ;
    method enter-scope() {
        @!scopes.push({})
    }
    method leave-scope() {
        @!scopes.pop();
    }
    method declare($variable) {
        @!scopes[*-1]{$variable} = True
    }
    method check-declared($variable) {
        for @!scopes.reverse -> %scope {
            return True if %scope{$variable};
        }
        return False;
    }
    method getScopingSpaces() returns Str {
        my Int $scopeCount = @!scopes.elems - 2;
        return '    ' x $scopeCount;
    }
}
