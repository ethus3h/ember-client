#!/usr/bin/env perl6

class EM {
    method parse( $/ ) {
        my $*ST = SymbolTable.new;
        return EmGrammar.parse( $/ , :actions($*ST) );
    }
}
