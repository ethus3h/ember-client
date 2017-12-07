#!/usr/bin/env perl6

class EmParser {
    method parse( $/ ) {
        my $*ST = SymbolTable.new;
        return EM.parse( $/ , :actions($*ST) );
    }
}
