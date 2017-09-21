#!/usr/bin/env perl6

use v6.c;
use Test;
use Grammar::Tracer;

grammar EM {
    token TOP { <block> }
    token block { [<simpleBlock>\nblock]|<simpleBlock> }
    token simpleBlock { <line>*<finalLine>? }

    token line { " "*<lineContents>\n }
    token finalLine { " "*<lineContents> }
    token lineContents { <declaration>|<invocation>|[''] }

    token escapedString { [\w|[\\\N]]+ }
    token literal { <number> }
    token number { \d+ }

    token value { <literal> | <identifier> | <invocation> }
    token declaration {
        [ <identifier>[\=<value>]? ] |
        [ <identifier> ' ' \= ' ' <value> ]
    }

    token type { 'String'|\* }
    token normalIdentifier { [[<type>\x20]?<escapedString>] }
    token routineIdentifier { <normalIdentifier> }
    token identifier { [[<type>\x20]?<escapedString>] }
    token identifierBody { <routineIdentifier>|<identifierString> }
    token identifierString { <escapedString> }

    token parameterSignature { <type>[\x20<identifierString>]?\?? }

    token invocation {
        <identifierString>
        [
            \( <parameterList> \) |
            ' ' <parameterList>
        ]
    }

    token parameter { <declaration> | <value> }
    token parameterList {
        [
            \( <innerParameterList> \) |
            ' ' <innerParameterList>
        ]
    }
    token innerParameterList {
        [
            [<parameter>\,?\x20]*
            <parameter>
        ] |
        ''
    }
}

sub run-silenced (&code) {
    temp $*OUT = temp $*ERR = class {
        BEGIN {
            ::?CLASS.^add_method: $_, my method (*@) {} for qw/say put print print-nl/
        }
    }.new;
    code;
}

sub runParserTest(Str $code, Str $rule, Str $fail?) {
    if ( $fail === "f" ) {
        if run-silenced { EM.parse($code, :$rule) } {
            say EM.parse($code, :$rule);
            fail "Parsing failed.";
        }
        else {
            return True;
        }
    }
    else {
        if ! run-silenced { EM.parse($code, :$rule) } {
            say EM.parse($code, :$rule);
            fail "Parsing failed.";
        }
        else {
            return True;
        }
    }
}

ok runParserTest("foo(String, String qux?, *)", "identifier");
ok runParserTest("foo(String, String qux?, *)", "routineIdentifier");
ok runParserTest("foo(bar baz)", "invocation");
ok runParserTest("foo(bar 6 qux)", "invocation");
ok runParserTest("foo(qux=6 bar)", "invocation");
ok runParserTest("foo bar baz", "invocation");
ok runParserTest("foo bar 6 qux", "invocation");
ok runParserTest("foo qux=6 bar", "invocation");
ok runParserTest("foo bar", "invocation");
ok runParserTest("foo(bar)", "invocation");
ok runParserTest("foo(bar, baz)", "invocation");
ok runParserTest("foo(bar, baz", "invocation");
ok runParserTest("foo (bar, baz)", "invocation");
ok runParserTest("foo(bar,baz)", "invocation");
say "Done running tests. Report:";
done-testing;
# my $m = EM.parse(Q[String foo(String, String qux?, *):
# foo(bar baz)
# foo(qux=6 bar)]);
# my $n = Q[    say $!par[1]$!par[2]$qux
# 
# # Test simple invocation
# foo(bar baz)
# foo(bar 6 qux) # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
# foo(qux=6 bar) # qux is still 6, but now parameter 0 is 6 and 1 is bar
# 
# # Test simple invocation, parenthesis-less style
# foo bar baz
# foo bar 6 qux # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
# foo qux=6 bar # qux is still 6, but now parameter 0 is 6 and 1 is bar
# 
# # Test invocation with "invoke"
# routineName="foo"
# invoke $routineName bar baz
# ];
# say $m;
